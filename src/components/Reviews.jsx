import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { fetchGoogleReviews, GOOGLE_REVIEWS_URL } from '../googlePlaces'
import { STATIC_RATING, STATIC_REVIEWS } from '../reviews'
import { Title, useLang } from '../i18n'
import Icon from './Icon'

const GAP = 24
const AVATAR_COLORS = ['#7a3d8f', '#8f5420', '#3d6b5a', '#2f5d8a', '#9a3f3f']

// Cards per view; must match the .review-card flex-basis breakpoints in index.css.
const getVisibleCount = () =>
  window.matchMedia('(max-width: 680px)').matches ? 1 : window.matchMedia('(max-width: 1024px)').matches ? 2 : 3

function useVisibleCount() {
  const [count, setCount] = useState(getVisibleCount)
  useEffect(() => {
    const onResize = () => setCount(getVisibleCount())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  return count
}

function Stars({ rating }) {
  return (
    <span className="g-stars" aria-label={`${rating} out of 5 stars`}>
      {'★'.repeat(Math.round(rating))}
      <span className="g-stars-off">{'★'.repeat(5 - Math.round(rating))}</span>
    </span>
  )
}

function GoogleMark({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}

// True when the clamped review text is cut off, so "Read more" is only shown when needed.
function useIsClamped(ref, text) {
  const [clamped, setClamped] = useState(false)
  useLayoutEffect(() => {
    const measure = () => {
      const el = ref.current
      if (el && !el.classList.contains('expanded')) setClamped(el.scrollHeight > el.clientHeight + 1)
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [ref, text])
  return clamped
}

function ReviewCard({ review, index }) {
  const { t } = useLang()
  const textRef = useRef(null)
  const [expanded, setExpanded] = useState(false)
  const clamped = useIsClamped(textRef, review.text)

  return (
    <article className="review-card">
      <header className="review-author">
        {review.photo ? (
          <img className="avatar" src={review.photo} alt="" referrerPolicy="no-referrer" loading="lazy" />
        ) : (
          <span className="avatar" style={{ background: AVATAR_COLORS[index % AVATAR_COLORS.length] }}>
            {review.author[0]}
          </span>
        )}
        <b>
          {review.authorUrl ? (
            <a href={review.authorUrl} target="_blank" rel="noreferrer">{review.author}</a>
          ) : (
            review.author
          )}
        </b>
        <GoogleMark />
      </header>
      <div className="review-meta">
        <Stars rating={review.rating} />
        <span>{review.when}</span>
      </div>
      <p ref={textRef} className={expanded ? 'expanded' : undefined}>{review.text}</p>
      {(clamped || expanded) && (
        <button className="review-more" onClick={() => setExpanded((open) => !open)} aria-expanded={expanded}>
          {expanded ? t('reviews.showLess') : t('reviews.readMore')}
        </button>
      )}
    </article>
  )
}

export default function Reviews() {
  const { t } = useLang()
  // Static reviews show immediately; live Google data replaces them when an API key is set.
  const [data, setData] = useState({ ...STATIC_RATING, reviews: STATIC_REVIEWS })
  const [index, setIndex] = useState(0)
  const [offset, setOffset] = useState(0)
  const trackRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    fetchGoogleReviews()
      .then((live) => {
        if (!cancelled && live.reviews.length) {
          setData({ ...live, totalLabel: live.total.toLocaleString('en-IN') })
        }
      })
      .catch((error) => {
        if (error.message !== 'missing-key') console.error('Google reviews:', error)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const visible = Math.min(useVisibleCount(), data.reviews.length)
  const maxIndex = data.reviews.length - visible
  const current = Math.min(index, maxIndex)

  useEffect(() => {
    const measure = () => {
      const card = trackRef.current?.firstElementChild
      if (card) setOffset(current * (card.getBoundingClientRect().width + GAP))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [current, visible])

  const reviewsUrl = data.url || GOOGLE_REVIEWS_URL

  return (
    <section className="reviews wrap" id="reviews" aria-labelledby="reviews-heading">
      <div className="reviews-heading">
        <div>
          <div className="eyebrow">{t('reviews.eyebrow')}</div>
          <h2 id="reviews-heading">
            <GoogleMark size={34} /> <Title parts={t('reviews.title')} />
          </h2>
          {data.rating && (
            <a className="g-summary" href={reviewsUrl} target="_blank" rel="noreferrer">
              <b>{data.rating.toFixed(1)}</b>
              <Stars rating={data.rating} />
              <span>{t('reviews.count', { n: data.totalLabel })}</span>
            </a>
          )}
        </div>
        {maxIndex > 0 && (
          <div className="review-arrows">
            <button
              className="round-arrow"
              onClick={() => setIndex(Math.max(0, current - 1))}
              disabled={current === 0}
              aria-label={t('reviews.prev')}
            >
              <Icon name="chevronLeft" size={20} />
            </button>
            <button
              className="round-arrow"
              onClick={() => setIndex(Math.min(maxIndex, current + 1))}
              disabled={current === maxIndex}
              aria-label={t('reviews.next')}
            >
              <Icon name="chevronRight" size={20} />
            </button>
          </div>
        )}
      </div>

      <div className="review-window">
        <div className="review-track" ref={trackRef} style={{ transform: `translateX(-${offset}px)` }}>
          {data.reviews.map((review, i) => <ReviewCard review={review} index={i} key={i} />)}
        </div>
      </div>

      <div className="review-actions">
        <a className="btn" href={reviewsUrl} target="_blank" rel="noreferrer">
          <GoogleMark size={16} /> {t('reviews.viewAll')} <Icon name="arrow" size={16} />
        </a>
      </div>
    </section>
  )
}
