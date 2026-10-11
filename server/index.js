import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import express from 'express'
import { TIMES, TOPICS } from '../src/data.js'
import { addMessage, addReservation, listMessages, listReservations, setReservationStatus } from './db.js'
import { createOtp, toWhatsAppNumber, verifyOtp } from './otp.js'
import { sendOtpMessage, whatsappConfigured } from './whatsapp.js'

const PORT = Number(process.env.PORT) || 3001
const ADMIN_TOKEN = process.env.ADMIN_TOKEN
const PHONE_RE = /^[0-9+\s-]{8,20}$/
const OTP_PER_IP = 10 // per hour, so one visitor can't send OTPs to many numbers

const app = express()
// Behind Render's proxy: read the visitor's real IP (used by the OTP rate limit).
app.set('trust proxy', 1)
app.use(express.json({ limit: '20kb' }))

const text = (value, max) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const otpRequests = new Map() // ip → { count, start }
function tooManyOtps(ip) {
  const now = Date.now()
  const entry = otpRequests.get(ip)
  if (!entry || now - entry.start > 60 * 60_000) {
    otpRequests.set(ip, { count: 1, start: now })
    return false
  }
  return ++entry.count > OTP_PER_IP
}

// Step 1 of booking: send a 6-digit OTP to the customer's WhatsApp.
app.post('/api/otp', async (req, res) => {
  const phone = toWhatsAppNumber(text(req.body.phone, 20))
  if (!phone) return res.status(400).json({ error: 'Please enter a valid phone number.' })
  if (tooManyOtps(req.ip)) return res.status(429).json({ error: 'Too many OTP requests. Please try again later.' })

  const otp = createOtp(phone)
  if (otp.wait) return res.status(429).json({ error: `Please wait ${otp.wait} seconds before asking for a new OTP.` })
  if (otp.limited) return res.status(429).json({ error: 'Too many OTPs for this number. Please try again in an hour.' })

  try {
    await sendOtpMessage(phone, otp.code)
  } catch (err) {
    console.error(err)
    return res.status(502).json({ error: 'Could not send the OTP on WhatsApp. Please check the number is on WhatsApp.' })
  }
  res.json({ ok: true })
})

// Step 2: save the reservation once the OTP matches.
app.post('/api/reservations', (req, res) => {
  const name = text(req.body.name, 100)
  const phone = text(req.body.phone, 20)
  const date = text(req.body.date, 10)
  const time = text(req.body.time, 10)
  const guests = Number(req.body.guests)
  const otp = text(req.body.otp, 6)
  const today = new Date().toISOString().slice(0, 10)

  if (!name || !PHONE_RE.test(phone)) return res.status(400).json({ error: 'Please enter your name and a valid phone number.' })
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || date < today) return res.status(400).json({ error: 'Please pick a valid date.' })
  if (!TIMES.includes(time)) return res.status(400).json({ error: 'Please pick a valid time.' })
  if (!Number.isInteger(guests) || guests < 1 || guests > 6) return res.status(400).json({ error: 'Party size must be 1–6.' })
  if (!verifyOtp(toWhatsAppNumber(phone), otp)) return res.status(400).json({ error: 'Wrong or expired OTP. Please check it or resend.' })

  const id = addReservation({ name, phone, date, time, guests })
  res.status(201).json({ id })
})

app.post('/api/messages', (req, res) => {
  const name = text(req.body.name, 100)
  const phone = text(req.body.phone, 20)
  const topic = text(req.body.topic, 50)
  const message = text(req.body.message, 2000)

  if (!name || !PHONE_RE.test(phone) || !message) return res.status(400).json({ error: 'Name, phone and message are required.' })
  if (!TOPICS.includes(topic)) return res.status(400).json({ error: 'Invalid topic.' })

  const id = addMessage({ name, phone, topic, message })
  res.status(201).json({ id })
})

// Listing customer data needs ADMIN_TOKEN; without it these routes are disabled.
function requireAdmin(req, res, next) {
  if (ADMIN_TOKEN && req.get('authorization') === `Bearer ${ADMIN_TOKEN}`) return next()
  res.status(401).json({ error: 'Unauthorized' })
}

app.get('/api/reservations', requireAdmin, (req, res) => res.json(listReservations()))
app.get('/api/messages', requireAdmin, (req, res) => res.json(listMessages()))

app.patch('/api/reservations/:id', requireAdmin, (req, res) => {
  const { status } = req.body
  if (!['pending', 'confirmed', 'cancelled'].includes(status)) return res.status(400).json({ error: 'Invalid status.' })
  if (!setReservationStatus(Number(req.params.id), status)) return res.status(404).json({ error: 'Reservation not found.' })
  res.json({ ok: true })
})

// In production, serve the built site from dist/ as well.
const dist = resolve('dist')
if (existsSync(dist)) {
  app.use(express.static(dist))
  app.get(/^(?!\/api\/).*/, (req, res) => res.sendFile(resolve(dist, 'index.html')))
}

app.listen(PORT, () => {
  console.log(`API running on http://localhost:${PORT}`)
  if (!whatsappConfigured) console.warn('WhatsApp not configured: booking OTPs will be printed here instead of sent.')
})
