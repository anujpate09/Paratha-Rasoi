import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createClient } from '@libsql/client'

// Hosted Turso database when TURSO_DATABASE_URL is set (production on Render),
// otherwise a local SQLite file (development).
const REMOTE_URL = process.env.TURSO_DATABASE_URL
export const DB_PATH = resolve(process.env.DB_PATH || 'data/paratha-rasoi.db')
export const DB_LOCATION = REMOTE_URL || DB_PATH

if (!REMOTE_URL) mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = createClient(
  REMOTE_URL ? { url: REMOTE_URL, authToken: process.env.TURSO_AUTH_TOKEN } : { url: pathToFileURL(DB_PATH).href },
)

// Resolves once the tables exist; the server waits for it before listening.
export const ready = db.executeMultiple(`
  CREATE TABLE IF NOT EXISTS reservations (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    phone      TEXT    NOT NULL,
    date       TEXT    NOT NULL,
    time       TEXT    NOT NULL,
    guests     INTEGER NOT NULL,
    status     TEXT    NOT NULL DEFAULT 'pending',
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS messages (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    phone      TEXT NOT NULL,
    topic      TEXT NOT NULL,
    message    TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS otps (
    phone     TEXT    PRIMARY KEY,
    code_hash TEXT    NOT NULL,
    expires   INTEGER NOT NULL,
    attempts  INTEGER NOT NULL DEFAULT 0,
    sent_at   INTEGER NOT NULL,
    sends     INTEGER NOT NULL,
    window_at INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS settings (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
`)

// libSQL rows are array-like; turn them into plain { column: value } objects for JSON.
const toObjects = ({ columns, rows }) =>
  rows.map((row) => Object.fromEntries(columns.map((column, i) => [column, row[i]])))

export async function addReservation({ name, phone, date, time, guests }) {
  const result = await db.execute({
    sql: 'INSERT INTO reservations (name, phone, date, time, guests) VALUES (?, ?, ?, ?, ?)',
    args: [name, phone, date, time, guests],
  })
  return Number(result.lastInsertRowid)
}

export async function addMessage({ name, phone, topic, message }) {
  const result = await db.execute({
    sql: 'INSERT INTO messages (name, phone, topic, message) VALUES (?, ?, ?, ?)',
    args: [name, phone, topic, message],
  })
  return Number(result.lastInsertRowid)
}

export async function listReservations() {
  return toObjects(await db.execute('SELECT * FROM reservations ORDER BY date, time'))
}

export async function listMessages() {
  return toObjects(await db.execute('SELECT * FROM messages ORDER BY created_at DESC'))
}

export async function setReservationStatus(id, status) {
  const result = await db.execute({ sql: 'UPDATE reservations SET status = ? WHERE id = ?', args: [status, id] })
  return result.rowsAffected > 0
}

export async function getSetting(key) {
  return (await db.execute({ sql: 'SELECT value FROM settings WHERE key = ?', args: [key] })).rows[0]?.[0]
}

export async function setSetting(key, value) {
  await db.execute({
    sql: 'INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    args: [key, value],
  })
}

export async function getOtp(phone) {
  return toObjects(await db.execute({ sql: 'SELECT * FROM otps WHERE phone = ?', args: [phone] }))[0]
}
