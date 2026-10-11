import { FEATURES, PHONE, WHATSAPP } from '../data'
import { useLang } from '../i18n'
import Icon from './Icon'

export const ORDER_URL = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent("Hi Paratha Rasoi! I'd like to place an order.")}`

export default function Hero() {
  const { t } = useLang()
  return (
    <div id="home" className="hero-area">
      <img
        className="hero-photo"
        src="/assets/hero-paratha.webp"
        alt="Stuffed paratha with butter, served with curry, chutney and raita"
        fetchPriority="high"
      />
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="eyebrow">{t('hero.eyebrow')}</div>
          <h1>
            <span>{t('hero.line1')}</span>
            <span>{t('hero.line2')}</span>
            <em>{t('hero.line3')}</em>
          </h1>
          <p className="hero-description">{t('hero.description')}</p>
          <div className="hero-buttons">
            <a className="btn btn-primary" href={ORDER_URL} target="_blank" rel="noreferrer">
              {t('hero.order')} <Icon name="arrow" size={18} />
            </a>
            <a className="btn btn-light" href={`tel:${PHONE}`}>
              {t('hero.call')} <Icon name="phone" size={18} />
            </a>
          </div>
        </div>
      </section>
      <div className="features wrap">
        {FEATURES.map((feature) => {
          const [title, text] = t(`features.${feature.key}`)
          return (
            <div className="feature" key={feature.key}>
              <span><Icon name={feature.icon} size={36} /></span>
              <div>
                <b>{title}</b>
                <small>{text}</small>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
