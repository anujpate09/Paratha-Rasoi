import { mkdirSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { DatabaseSync } from 'node:sqlite'

export const DB_PATH = resolve(process.env.DB_PATH || 'data/paratha-rasoi.db')
mkdirSync(dirname(DB_PATH), { recursive: true })

export const db = new DatabaseSync(DB_PATH)

db.exec(`
  PRAGMA journal_mode = WAL;

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
`)

const insertReservation = db.prepare(
  'INSERT INTO reservations (name, phone, date, time, guests) VALUES (?, ?, ?, ?, ?)',
)
const insertMessage = db.prepare(
  'INSERT INTO messages (name, phone, topic, message) VALUES (?, ?, ?, ?)',
)

export function addReservation({ name, phone, date, time, guests }) {
  return Number(insertReservation.run(name, phone, date, time, guests).lastInsertRowid)
}

export function addMessage({ name, phone, topic, message }) {
  return Number(insertMessage.run(name, phone, topic, message).lastInsertRowid)
}

export function listReservations() {
  return db.prepare('SELECT * FROM reservations ORDER BY date, time').all()
}

export function listMessages() {
  return db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all()
}

export function setReservationStatus(id, status) {
  return db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id).changes > 0
}
