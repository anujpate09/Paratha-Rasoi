import { DISHES } from '../data'
import { DishName, Title, useLang } from '../i18n'
import Icon from './Icon'

const DESCRIPTION = { hi: 'descriptionHi', kn: 'descriptionKn' }

export default function Signature() {
  const { lang, t } = useLang()
  return (
    <section className="menu-section" id="menu">
      <div className="wrap">
        <div className="eyebrow">{t('signature.eyebrow')}</div>
        <h2 className="section-title">
          <Title parts={t('signature.title')} />
        </h2>
        <p className="section-intro">{t('signature.intro')}</p>
        <div className="dish-grid">
          {DISHES.map((dish) => (
            <article className="dish-card" key={dish.name}>
              <img src={dish.image} alt={dish.alt} loading="lazy" />
              <div className="dish-body">
                <h3><DishName name={dish.name} /></h3>
                <p>{dish[DESCRIPTION[lang]] || dish.description}</p>
                <div className="dish-bottom">
                  <strong>₹{dish.price}</strong>
                </div>
              </div>
            </article>
          ))}
        </div>
        <a className="btn full-menu" href="#full-menu">
          {t('signature.viewMenu')} <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  )
}
