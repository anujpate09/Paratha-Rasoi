import { createHash, randomInt } from 'node:crypto'
import { db, getOtp } from './db.js'

const TTL = 5 * 60_000 // OTP valid for 5 minutes
const RESEND_GAP = 30_000 // min gap between OTPs to one number
const HOUR = 60 * 60_000
const MAX_SENDS = 5 // OTPs per number per hour
const MAX_ATTEMPTS = 5 // wrong guesses before the OTP stops working

const hash = (phone, code) => createHash('sha256').update(`${phone}:${code}`).digest('hex')

// "98765 43210", "+91 98765-43210", "098765 43210" → "919876543210". Returns '' if invalid.
export function toWhatsAppNumber(phone) {
  let digits = String(phone).replace(/\D/g, '')
  if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1)
  if (digits.length === 10) digits = `91${digits}`
  return /^[1-9]\d{9,14}$/.test(digits) ? digits : ''
}

// Returns { code } for a new OTP, { wait: seconds } if asked again too soon, or { limited: true }.
export async function createOtp(phone) {
  const now = Date.now()
  const row = await getOtp(phone)
  if (row && now - row.sent_at < RESEND_GAP) return { wait: Math.ceil((RESEND_GAP - (now - row.sent_at)) / 1000) }

  const sameWindow = row && now - row.window_at < HOUR
  const sends = sameWindow ? row.sends + 1 : 1
  if (sends > MAX_SENDS) return { limited: true }

  const code = String(randomInt(0, 1_000_000)).padStart(6, '0')
  await db.execute({
    sql: `INSERT INTO otps (phone, code_hash, expires, attempts, sent_at, sends, window_at) VALUES (?, ?, ?, 0, ?, ?, ?)
      ON CONFLICT(phone) DO UPDATE SET code_hash = excluded.code_hash, expires = excluded.expires, attempts = 0,
        sent_at = excluded.sent_at, sends = excluded.sends, window_at = excluded.window_at`,
    args: [phone, hash(phone, code), now + TTL, now, sends, sameWindow ? row.window_at : now],
  })
  return { code }
}

// True once for the right, unexpired code; the OTP can't be reused after that.
export async function verifyOtp(phone, code) {
  const row = await getOtp(phone)
  if (!row || row.expires < Date.now() || row.attempts >= MAX_ATTEMPTS) return false
  if (hash(phone, code) !== row.code_hash) {
    await db.execute({ sql: 'UPDATE otps SET attempts = attempts + 1 WHERE phone = ?', args: [phone] })
    return false
  }
  // Used OTPs are expired, not deleted, so the hourly send limit still counts them.
  await db.execute({ sql: 'UPDATE otps SET expires = 0 WHERE phone = ?', args: [phone] })
  return true
}
