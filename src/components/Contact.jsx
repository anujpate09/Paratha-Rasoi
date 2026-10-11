import { useState } from 'react'
import { PHONE, PHONE_DISPLAY, TOPICS, WHATSAPP } from '../data'
import { createMessage } from '../api'
import { Title, useLang } from '../i18n'
import Icon from './Icon'

const MAP_EMBED =
  'https://www.google.com/maps/embed?origin=mfe&pb=!1m2!2m1!1sParatha+Rasoi,+LG+City,+Gunjur+-+Nerige+Road,+Gunjur,+Bengaluru+560087'

export default function Contact() {
  const { t } = useLang()
  const [sent, setSent] = useState(false)

  const onSubmit = (event) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    // Keep a copy in the database; WhatsApp still opens even if saving fails.
    createMessage(Object.fromEntries(form)).catch((error) => console.error('Could not save message:', error))
    const text = [
      `Hello Paratha Rasoi! (${form.get('topic')})`,
      '',
      form.get('message'),
      '',
      `— ${form.get('name')}, ${form.get('phone')}`,
    ].join('\n')
    window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`, '_blank', 'noopener')
    setSent(true)
    event.currentTarget.reset()
  }

  return (
    <section className="contact-section" id="contact">
      <div className="wrap">
        <div className="contact-heading">
          <div className="eyebrow">{t('contact.eyebrow')}</div>
          <h2 className="section-title">
            <Title parts={t('contact.title')} />
          </h2>
          <p className="section-intro">{t('contact.intro')}</p>
        </div>

        <div className="contact-grid">
          <div className="contact-info">
            <iframe
              className="contact-map"
              title={t('contact.mapTitle')}
              src={MAP_EMBED}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a className="contact-item" href={`tel:${PHONE}`}>
              <span><Icon name="phone" /></span>
              <div>
                <small>{t('contact.callUs')}</small>
                <b>{PHONE_DISPLAY}</b>
              </div>
            </a>
            <a className="contact-item" href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noreferrer">
              <span><Icon name="chat" /></span>
              <div>
                <small>{t('contact.whatsapp')}</small>
                <b>{t('contact.chat')}</b>
              </div>
            </a>
            <div className="contact-item">
              <span><Icon name="clock" /></span>
              <div>
                <small>{t('contact.days')}</small>
                <b>12–3:30 PM · 5:30–11:30 PM</b>
              </div>
            </div>
          </div>

          <form className="contact-form" onSubmit={onSubmit}>
            <div className="form-grid">
              <label>
                {t('contact.name')}
                <input name="name" required autoComplete="name" placeholder={t('contact.name')} />
              </label>
              <label>
                {t('contact.phone')}
                <input name="phone" type="tel" required autoComplete="tel" placeholder="+91" pattern="[0-9+\s\-]{8,}" />
              </label>
              <label>
                {t('contact.topic')}
                <select name="topic" defaultValue={TOPICS[0]}>
                  {TOPICS.map((topic) => <option key={topic} value={topic}>{t('contact.topics')[topic]}</option>)}
                </select>
              </label>
              <label className="span-2">
                {t('contact.message')}
                <textarea name="message" required rows="5" placeholder={t('contact.messagePlaceholder')} />
              </label>
            </div>
            <button className="btn btn-primary" type="submit">
              {t('contact.send')} <Icon name="arrow" size={16} />
            </button>
            {sent && (
              <p className="form-note" role="status">
                {t('contact.sent')}
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
