import { useEffect, useRef, useState } from 'react'
import { createReservation, getSettings, requestOtp } from '../api'
import { MENU, TIMES, WHATSAPP, ZOMATO_BOOKING } from '../data'
import { CATEGORY_NAMES, DISH_NAMES, useLang } from '../i18n'
import Icon from './Icon'

// Modal behaviour: Escape to close, body scroll lock,
// focus moved into the panel on open and restored on close.
function usePanel(open, onClose) {
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const previous = document.activeElement
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector('button, input')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus?.()
    }
  }, [open, onClose])
  return ref
}

// Full-screen menu image viewer, so the menu opens inside the site instead of a new tab.
export function MenuViewer({ open, onClose, src, alt }) {
  const { t } = useLang()
  const ref = usePanel(open, onClose)
  const [zoomed, setZoomed] = useState(false)

  useEffect(() => {
    if (!open) setZoomed(false)
  }, [open])

  return (
    <div
      ref={ref}
      className={`menu-viewer${open ? ' show' : ''}${zoomed ? ' zoomed' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('fullMenu.viewerTitle')}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="menu-viewer-bar">
        <b>{t('fullMenu.viewerTitle')}</b>
        <button className="btn menu-viewer-zoom" onClick={() => setZoomed((z) => !z)} aria-pressed={zoomed}>
          <Icon name={zoomed ? 'zoomOut' : 'zoomIn'} size={16} /> {zoomed ? t('fullMenu.fit') : t('fullMenu.zoomIn')}
        </button>
        <button className="close" onClick={onClose} aria-label={t('fullMenu.close')}>
          <Icon name="close" size={22} />
        </button>
      </div>
      <div className="menu-viewer-body" onClick={(event) => event.target === event.currentTarget && onClose()}>
        <img src={src} alt={alt} onClick={() => setZoomed((z) => !z)} />
      </div>
    </div>
  )
}

export function Overlay({ show, onClick }) {
  return <div className={`overlay${show ? ' show' : ''}`} onClick={onClick} />
}

// Pre-filled WhatsApp message to the restaurant with the booking details.
function restaurantWhatsApp(booking) {
  const day = new Date(`${booking.date}T00:00`).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
  const text = [
    'Hello Paratha Rasoi! I would like to reserve a table.',
    '',
    `Name: ${booking.name}`,
    `Phone: ${booking.phone}`,
    `Date: ${day}`,
    `Time: ${booking.time}`,
    `Guests: ${booking.guests}`,
  ].join('\n')
  return `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
}

export function ReservationModal({ open, onClose }) {
  const { t } = useLang()
  const ref = usePanel(open, onClose)
  // Booking mode is set on the admin page: 'otp' or 'whatsapp' (form opens WhatsApp to the restaurant).
  const [mode, setMode] = useState(null)
  // form → otp (OTP mode only: code sent to the customer's WhatsApp) → done (saved in the database)
  const [step, setStep] = useState('form')
  const [booking, setBooking] = useState(null)
  const [cooldown, setCooldown] = useState(0)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  useEffect(() => {
    if (!open) return
    let cancelled = false
    getSettings()
      .then((settings) => !cancelled && setMode(settings.bookingMode))
      .catch(() => !cancelled && setMode('whatsapp'))
    return () => {
      cancelled = true
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      setStep('form')
      setBooking(null)
      setError('')
    }
  }, [open])

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setTimeout(() => setCooldown((s) => s - 1), 1000)
    return () => clearTimeout(timer)
  }, [cooldown])

  const run = async (action) => {
    setSaving(true)
    setError('')
    try {
      await action()
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const sendOtp = (details) =>
    run(async () => {
      await requestOtp(details.phone)
      setBooking(details)
      setStep('otp')
      setCooldown(30)
    })

  const onSubmit = (event) => {
    event.preventDefault()
    const details = Object.fromEntries(new FormData(event.currentTarget))
    if (mode === 'otp') return sendOtp(details)

    // The old way: send the details to the restaurant's WhatsApp and save them. WhatsApp must open
    // synchronously inside the submit handler, or browsers block it as a popup.
    window.open(restaurantWhatsApp(details), '_blank', 'noopener')
    run(async () => {
      setBooking(details)
      await createReservation(details)
      setStep('done')
    })
  }

  const onVerify = (event) => {
    event.preventDefault()
    const otp = new FormData(event.currentTarget).get('otp')
    run(async () => {
      await createReservation({ ...booking, otp })
      setStep('done')
    })
  }

  const errorNote = error && (
    <p className="form-note" role="alert">
      {error}
    </p>
  )

  return (
    <div
      ref={ref}
      className={`modal${open ? ' show' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="booking-title"
      aria-hidden={!open}
      inert={!open}
    >
      <button className="close modal-close" onClick={onClose} aria-label={t('reserve.close')}>
        <Icon name="close" size={22} />
      </button>
      <h2 id="booking-title">{t('reserve.title')}</h2>
      <p>{t('reserve.subtitle')}</p>
      {step === 'done' && (
        <>
          <div className="booking-message" role="status">
            {mode === 'otp' ? (
              t('reserve.success')
            ) : (
              <>
                {t('reserve.successWhatsapp')[0]}<b>{t('reserve.successWhatsapp')[1]}</b>{t('reserve.successWhatsapp')[2]}
              </>
            )}
          </div>
          <a className="btn btn-primary booking-whatsapp" href={restaurantWhatsApp(booking)} target="_blank" rel="noreferrer">
            <Icon name="whatsapp" size={18} /> {mode === 'otp' ? t('reserve.alsoWhatsapp') : t('reserve.openWhatsapp')}
          </a>
        </>
      )}
      {step === 'otp' && (
        <form onSubmit={onVerify}>
          <p className="otp-sent">{t('reserve.otpSent', { phone: booking.phone })}</p>
          <div className="form-grid">
            <label>
              {t('reserve.otp')}
              <input
                name="otp"
                required
                autoFocus
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                placeholder="••••••"
                className="otp-input"
              />
            </label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving}>
            {saving ? t('reserve.verifying') : t('reserve.verify')}
          </button>
          <div className="otp-actions">
            <button type="button" onClick={() => sendOtp(booking)} disabled={saving || cooldown > 0}>
              {cooldown > 0 ? t('reserve.resendIn', { s: cooldown }) : t('reserve.resend')}
            </button>
            <button type="button" onClick={() => { setStep('form'); setError('') }} disabled={saving}>
              {t('reserve.changeNumber')}
            </button>
          </div>
          {errorNote}
        </form>
      )}
      {step === 'form' && (
        <form onSubmit={onSubmit}>
          <div className="form-grid">
            <label>
              {t('reserve.name')}
              <input name="name" required autoComplete="name" placeholder={t('reserve.name')} defaultValue={booking?.name} />
            </label>
            <label>
              {t('reserve.phone')}
              <input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="+91"
                pattern="[0-9+\s\-]{8,}"
                defaultValue={booking?.phone}
              />
            </label>
            <label>
              {t('reserve.date')}
              <input name="date" type="date" min={today} required defaultValue={booking?.date} />
            </label>
            <label>
              {t('reserve.time')}
              <select name="time" required defaultValue={booking?.time ?? ''}>
                <option value="" disabled>{t('reserve.selectTime')}</option>
                {TIMES.map((time) => <option key={time}>{time}</option>)}
              </select>
            </label>
            <label>
              {t('reserve.guests')}
              <select name="guests" required defaultValue={booking?.guests ?? ''}>
                <option value="" disabled>{t('reserve.partySize')}</option>
                {[1, 2, 3, 4, 5, 6].map((n) => <option key={n}>{n}</option>)}
              </select>
            </label>
          </div>
          <button className="btn btn-primary" type="submit" disabled={saving || !mode}>
            <Icon name="whatsapp" size={18} />{' '}
            {saving ? t('reserve.sending') : mode === 'otp' ? t('reserve.submit') : t('reserve.submitWhatsapp')}
          </button>
          <div className="booking-or" aria-hidden="true">
            <span>{t('reserve.or')}</span>
          </div>
          <a className="btn booking-zomato" href={ZOMATO_BOOKING} target="_blank" rel="noreferrer">
            {t('reserve.zomato')} <Icon name="arrow" size={16} />
          </a>
          {errorNote}
        </form>
      )}
    </div>
  )
}

const MENU_ITEMS = MENU.flatMap(({ category, items }) => items.map(([name, price]) => ({ name, price, category })))

const normalize = (text) => text.toLowerCase().replace(/\s+/g, ' ').trim()
const orderUrl = (item) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(`Hi Paratha Rasoi! I'd like to order: ${item.name} (₹${item.price})`)}`

export function SearchPanel({ open, onClose }) {
  const { t, dish, category } = useLang()
  const ref = usePanel(open, onClose)
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  // Every word must match the item name or its category ("paneer starter", "chicken rice").
  const words = normalize(query).split(' ').filter(Boolean)
  const results = words.length
    ? MENU_ITEMS.filter((item) => {
        // Match English, Hindi and Kannada names, so "paneer", "पनीर" and "ಪನೀರ್" work in any language.
        const names = [item.name, item.category]
        for (const lang of Object.keys(DISH_NAMES)) names.push(DISH_NAMES[lang][item.name], CATEGORY_NAMES[lang][item.category])
        const haystack = normalize(names.filter(Boolean).join(' '))
        return words.every((word) => haystack.includes(word))
      })
    : []

  return (
    <div
      ref={ref}
      className={`modal search-panel${open ? ' show' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={t('search.label')}
      aria-hidden={!open}
      inert={!open}
    >
      <div className="search-field">
        <Icon name="search" size={20} />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder={t('search.placeholder')}
          aria-label={t('search.input')}
          autoComplete="off"
        />
        <button className="close" onClick={onClose} aria-label={t('search.close')}>
          <Icon name="close" size={20} />
        </button>
      </div>

      {words.length === 0 ? (
        <div className="search-suggestions">
          <small>{t('search.popular')}</small>
          <div>
            {t('search.suggestions').map((word) => (
              <button key={word} onClick={() => setQuery(word)}>{word}</button>
            ))}
          </div>
        </div>
      ) : (
        <>
          <p className="search-count" role="status">
            {results.length === 1
              ? t('search.foundOne')
              : results.length
                ? t('search.found', { n: results.length })
                : t('search.none', { q: query.trim() })}
          </p>
          <ul className="search-results">
            {results.map((item) => (
              <li key={`${item.category}-${item.name}`}>
                <div>
                  <b>{dish(item.name)}</b>
                  <small>{dish(item.name) !== item.name ? `${item.name} · ` : ''}{category(item.category)}</small>
                </div>
                <strong>₹{item.price}</strong>
                <a href={orderUrl(item)} target="_blank" rel="noreferrer" aria-label={t('search.order', { name: item.name })}>
                  <Icon name="whatsapp" size={18} />
                </a>
              </li>
            ))}
          </ul>
        </>
      )}

      <a className="search-full-menu" href="#full-menu" onClick={onClose}>
        {t('search.fullMenu')} <Icon name="arrow" size={16} />
      </a>
    </div>
  )
}
