import { Title, useLang } from '../i18n'
import { STATIC_RATING } from '../reviews'

export default function Story() {
  const { t } = useLang()
  const [openedValue, openedLabel] = t('story.opened')
  const stats = [
    { value: openedValue, label: openedLabel },
    { value: `${STATIC_RATING.rating}★`, label: t('story.rating', { n: STATIC_RATING.totalLabel }) },
    { value: '₹300', label: t('story.price') },
  ]

  return (
    <section className="story wrap" id="about">
      <figure className="story-images">
        <img
          src="/assets/dining-room.webp"
          alt="Paratha Rasoi dining room with yellow, pink and blue striped walls, pendant lights and dark wooden tables"
          width="868"
          height="680"
          loading="lazy"
        />
        <figcaption>{t('story.caption')}</figcaption>
      </figure>
      <div className="story-copy">
        <div className="eyebrow">{t('story.eyebrow')}</div>
        <h2>
          <Title parts={t('story.title')} />
        </h2>
        <p>{t('story.p1')}</p>
        <p>{t('story.p2')}</p>
        <div className="stats">
          {stats.map((stat) => (
            <div key={stat.value}>
              <strong>{stat.value}</strong>
              {stat.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
