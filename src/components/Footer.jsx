import { FACEBOOK, INSTAGRAM, NAV_LINKS, PHONE, PHONE_DISPLAY, ZOMATO_BOOKING } from '../data'
import { Logo } from './Header'
import { useLang } from '../i18n'
import Icon from './Icon'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer>
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Logo />
            <p>{t('footer.tagline')}</p>
            <div className="socials">
              <a href={FACEBOOK} target="_blank" rel="noreferrer" aria-label={t('footer.facebook')}>
                <Icon name="facebook" size={16} />
              </a>
              <a href={INSTAGRAM} target="_blank" rel="noreferrer" aria-label={t('footer.instagram')}>
                <Icon name="instagram" size={15} />
              </a>
            </div>
          </div>
          <div>
            <h3>{t('footer.quickLinks')}</h3>
            <ul>
              {NAV_LINKS.map((id) => (
                <li key={id}>
                  <a href={`#${id}`}>{t(id === 'visit' ? 'nav.visitUs' : `nav.${id}`)}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>{t('footer.contactUs')}</h3>
            <ul>
              <li>Shop No 4 &amp; 5, LG City<br />Gunjur, Bengaluru 560087</li>
              <li><a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a></li>
              <li>{t('footer.hours1')}<br />{t('footer.hours2')}</li>
              <li>{t('footer.closed')}</li>
            </ul>
          </div>
          <div>
            <h3>{t('footer.order')}</h3>
            <p>{t('footer.orderText')}</p>
            <div className="order-links">
              <a className="btn" href={`tel:${PHONE}`}>{t('footer.callToOrder')}</a>
              <a className="btn" href="#contact">{t('footer.contactBtn')}</a>
              <a className="btn" href={ZOMATO_BOOKING} target="_blank" rel="noreferrer">{t('reserve.zomato')}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>{t('footer.rights', { year: new Date().getFullYear() })}</span>
          <span>
            <a href="/privacy-policy">{t('footer.privacy')}</a> · {t('footer.motto')}
          </span>
        </div>
      </div>
    </footer>
  )
}
