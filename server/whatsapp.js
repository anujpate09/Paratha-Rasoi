// Sends the booking OTP through Meta's WhatsApp Cloud API. Needs an approved
// "Authentication" message template with a copy-code button (see readme).
// Without WHATSAPP_TOKEN / WHATSAPP_PHONE_NUMBER_ID the OTP is printed in the server console instead.
const API_VERSION = 'v23.0'
const {
  WHATSAPP_TOKEN,
  WHATSAPP_PHONE_NUMBER_ID,
  WHATSAPP_OTP_TEMPLATE = 'booking_otp',
  WHATSAPP_TEMPLATE_LANG = 'en',
} = process.env

export const whatsappConfigured = Boolean(WHATSAPP_TOKEN && WHATSAPP_PHONE_NUMBER_ID)

// to: full number with country code, digits only (e.g. 919876543210).
export async function sendOtpMessage(to, code) {
  if (!whatsappConfigured) {
    console.log(`[OTP] WhatsApp is not configured. OTP for +${to}: ${code}`)
    return
  }

  const res = await fetch(`https://graph.facebook.com/${API_VERSION}/${WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: WHATSAPP_OTP_TEMPLATE,
        language: { code: WHATSAPP_TEMPLATE_LANG },
        components: [
          { type: 'body', parameters: [{ type: 'text', text: code }] },
          { type: 'button', sub_type: 'url', index: '0', parameters: [{ type: 'text', text: code }] },
        ],
      },
    }),
    signal: AbortSignal.timeout(10_000),
  })
  if (!res.ok) throw new Error(`WhatsApp API ${res.status}: ${await res.text()}`)
}
