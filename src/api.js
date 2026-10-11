async function post(path, body) {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export const getSettings = async () => {
  const res = await fetch('/api/settings')
  if (!res.ok) throw new Error('Could not load booking settings. Please try again.')
  return res.json()
}
export const requestOtp = (phone) => post('/api/otp', { phone })
export const createReservation =(reservation) => post('/api/reservations', reservation)
export const createMessage = (message) => post('/api/messages', message)
