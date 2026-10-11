import { PHONE, PHONE_DISPLAY } from '../data'
import { Title, useLang } from '../i18n'
import Icon from './Icon'

const MAP_URL =
  'https://www.google.com/maps/search/?api=1&query=Paratha+Rasoi+LG+City+Gunjur+Bengaluru+560087'

export default function Visit() {
  const { t } = useLang()
  return (
    <section className="visit-section" id="visit">
      <div className="wrap">
        <div className="visit-heading">
          <div>
            <div className="eyebrow">{t('visit.eyebrow')}</div>
            <h2 className="section-title">
              <Title parts={t('visit.title')} />
            </h2>
          </div>
          <a className="btn" href={`tel:${PHONE}`}>
            {t('visit.call', { phone: PHONE_DISPLAY })}
          </a>
        </div>
        <figure className="storefront">
          <img
            src="/assets/storefront.webp"
            alt="Paratha Rasoi storefront at LG City, Gunjur with the Paratha Rasoi sign in Kannada and English"
            width="1212"
            height="912"
            loading="lazy"
          />
          <figcaption>{t('visit.storefront')}</figcaption>
        </figure>
        <div className="visit-grid">
          <article>
            <span><Icon name="pin" /></span>
            <h3>{t('visit.address')}</h3>
            <p>
              Shop No 4 &amp; 5, LG City, Gunjur - Nerige Road, Gunjur, Halasahalli Thippasandra,
              Bengaluru, Karnataka 560087
            </p>
            <small>
              <a href={MAP_URL} target="_blank" rel="noreferrer">{t('visit.directions')}</a>
            </small>
          </article>
          <article>
            <span><Icon name="clock" /></span>
            <h3>{t('visit.hours')}</h3>
            <p>
              {t('visit.days')}
              <br />
              12:00 PM–3:30 PM
              <br />
              5:30 PM–11:30 PM
            </p>
            <small>{t('visit.closed')}</small>
          </article>
          <article>
            <span><Icon name="home" /></span>
            <h3>{t('visit.dining')}</h3>
            <p>{t('visit.diningText')}</p>
            <small>{t('visit.diningNote')}</small>
          </article>
        </div>
      </div>
    </section>
  )
}
