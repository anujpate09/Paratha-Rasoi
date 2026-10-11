import { useCallback, useEffect, useState } from 'react'
import { TIMES } from '../data'

const TOKEN_KEY = 'pr-admin-token'
const STATUSES = ['pending', 'confirmed', 'cancelled']

function readToken() {
  try {
    return sessionStorage.getItem(TOKEN_KEY) || ''
  } catch {
    return ''
  }
}

function saveToken(token) {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // Storage blocked: the token just won't survive a reload.
  }
}

async function adminFetch(token, path, options = {}) {
  const res = await fetch(path, {
    ...options,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}`, ...options.headers },
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw Object.assign(new Error(data.error || 'Request failed'), { status: res.status })
  return data
}

// Upcoming first, then by the slot order in TIMES ("1:00 PM" must come after "12:00 PM").
const byDateTime = (a, b) => a.date.localeCompare(b.date) || TIMES.indexOf(a.time) - TIMES.indexOf(b.time)

export default function Admin() {
  const [token, setToken] = useState(readToken)
  const [tab, setTab] = useState('reservations')
  const [reservations, setReservations] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const logout = useCallback(() => {
    saveToken('')
    setToken('')
  }, [])

  const load = useCallback(async () => {
    if (!token) return
    setLoading(true)
    setError('')
    try {
      const [r, m] = await Promise.all([
        adminFetch(token, '/api/reservations'),
        adminFetch(token, '/api/messages'),
      ])
      setReservations(r.sort(byDateTime))
      setMessages(m)
    } catch (err) {
      if (err.status === 401) {
        logout()
        setError('Wrong password.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }, [token, logout])

  useEffect(() => {
    load()
  }, [load])

  const changeStatus = async (id, status) => {
    try {
      await adminFetch(token, `/api/reservations/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) })
      setReservations((list) => list.map((r) => (r.id === id ? { ...r, status } : r)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (!token) {
    return (
      <main className="admin">
        <form
          className="contact-form admin-login"
          onSubmit={(event) => {
            event.preventDefault()
            const value = new FormData(event.currentTarget).get('token').trim()
            saveToken(value)
            setToken(value)
          }}
        >
          <div className="eyebrow">Paratha Rasoi</div>
          <h1 className="section-title">Admin</h1>
          <div className="form-grid">
            <label className="span-2">
              Admin password (ADMIN_TOKEN)
              <input name="token" type="password" required autoFocus />
            </label>
          </div>
          <button className="btn btn-primary" type="submit">Open</button>
          {error && <p className="form-note" role="alert">{error}</p>}
        </form>
      </main>
    )
  }

  const pending = reservations.filter((r) => r.status === 'pending').length

  return (
    <main className="admin wrap">
      <header className="admin-head">
        <div>
          <div className="eyebrow">Paratha Rasoi</div>
          <h1 className="section-title">Admin</h1>
        </div>
        <div className="admin-actions">
          <button className="btn" onClick={load} disabled={loading}>{loading ? 'Loading…' : 'Refresh'}</button>
          <button className="btn" onClick={logout}>Log out</button>
          <a className="btn" href="/">Website</a>
        </div>
      </header>

      <div className="admin-tabs" role="tablist">
        <button role="tab" aria-selected={tab === 'reservations'} onClick={() => setTab('reservations')}>
          Reservations <span>{reservations.length}</span>{pending > 0 && <em> · {pending} pending</em>}
        </button>
        <button role="tab" aria-selected={tab === 'messages'} onClick={() => setTab('messages')}>
          Messages <span>{messages.length}</span>
        </button>
      </div>

      {error && <p className="form-note admin-error" role="alert">{error}</p>}

      {tab === 'reservations' ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Date</th><th>Time</th><th>Guests</th><th>Name</th><th>Phone</th><th>Status</th><th>Received</th></tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td>{r.date}</td>
                  <td>{r.time}</td>
                  <td>{r.guests}</td>
                  <td>{r.name}</td>
                  <td><a href={`tel:${r.phone.replace(/\s/g, '')}`}>{r.phone}</a></td>
                  <td>
                    <select
                      className={`status status-${r.status}`}
                      value={r.status}
                      onChange={(event) => changeStatus(r.id, event.target.value)}
                      aria-label={`Status for reservation ${r.id}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="muted">{r.created_at}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && reservations.length === 0 && <p className="admin-empty">No reservations yet.</p>}
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr><th>#</th><th>Received</th><th>Name</th><th>Phone</th><th>Topic</th><th>Message</th></tr>
            </thead>
            <tbody>
              {messages.map((m) => (
                <tr key={m.id}>
                  <td>{m.id}</td>
                  <td className="muted">{m.created_at}</td>
                  <td>{m.name}</td>
                  <td><a href={`tel:${m.phone.replace(/\s/g, '')}`}>{m.phone}</a></td>
                  <td>{m.topic}</td>
                  <td className="admin-message">{m.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && messages.length === 0 && <p className="admin-empty">No messages yet.</p>}
        </div>
      )}
    </main>
  )
}
