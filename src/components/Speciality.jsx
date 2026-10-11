import { PHONE, SPECIALITY, ZOMATO_BOOKING } from '../data'
import { Title, useLang } from '../i18n'
import Icon from './Icon'

export default function Speciality() {
  const { t } = useLang()
  return (
    <section className="speciality wrap" id="speciality">
      <div className="speciality-image">
        <img src={SPECIALITY.image} alt="Freshly prepared Chicken Ghee Roast Paratha" loading="lazy" />
        <span>{t('speciality.badge')}</span>
      </div>
      <div className="speciality-copy">
        <div className="eyebrow">{t('speciality.eyebrow')}</div>
        <h2>
          <Title parts={t('speciality.title')} />
        </h2>
        <p>{t('speciality.body')}</p>
        <div className="speciality-meta">
          <div>
            <small>{t('speciality.price')}</small>
            <strong>₹{SPECIALITY.price}</strong>
          </div>
          <div>
            <small>{t('speciality.bestWith')}</small>
            <strong>{t('speciality.bestWithValue')}</strong>
          </div>
        </div>
        <div className="speciality-actions">
          <a className="btn btn-primary" href={`tel:${PHONE}`}>
            {t('speciality.call')} <Icon name="phone" size={15} />
          </a>
          <a className="btn" href={ZOMATO_BOOKING} target="_blank" rel="noreferrer">
            {t('reserve.zomato')} <Icon name="arrow" size={15} />
          </a>
        </div>
      </div>
    </section>
  )
}
