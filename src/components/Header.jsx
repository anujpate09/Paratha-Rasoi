import { useEffect, useState } from 'react'
import { NAV_LINKS } from '../data'
import { LangToggle, useLang } from '../i18n'
import { ORDER_URL } from './Hero'
import Icon from './Icon'

// The header follows the design's nav; Visit stays reachable from the footer.
const HEADER_LINKS = NAV_LINKS.filter((id) => id !== 'visit')

export function Logo() {
  return (
    <a className="logo" href="#home" aria-label="Paratha Rasoi home">
      <img src="/assets/logo.png" alt="Paratha Rasoi — Swaad jo ghar ki yaad dilaye" width="600" height="240" />
    </a>
  )
}

export default function Header({ onOpenReserve, onOpenSearch }) {
  const { t } = useLang()
  const [active, setActive] = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Highlight the nav link of the section currently in view.
  useEffect(() => {
    const sections = HEADER_LINKS.map((id) => document.getElementById(id)).filter(Boolean)
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => entry.isIntersecting && setActive(entry.target.id))
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className={`header-bar${scrolled ? ' scrolled' : ''}`}>
      <header className="header wrap">
        <Logo />
        <nav className={`nav${menuOpen ? ' open' : ''}`} aria-label={t('header.mainNav')}>
          {HEADER_LINKS.map((id) => (
            <a
              key={id}
              href={`#${id}`}
              className={active === id ? 'active' : undefined}
              onClick={() => setMenuOpen(false)}
            >
              {t(`nav.${id}`)}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <LangToggle />
          <button className="icon-btn icon-search" onClick={onOpenSearch} aria-label={t('header.search')}>
            <Icon name="search" />
          </button>
          <a className="icon-btn icon-whatsapp" href={ORDER_URL} target="_blank" rel="noreferrer" aria-label={t('header.whatsapp')}>
            <Icon name="whatsapp" />
          </a>
          <button className="icon-btn icon-reserve" onClick={onOpenReserve} aria-label={t('header.reserve')}>
            <Icon name="calendar" />
          </button>
          <button className="btn btn-reserve" onClick={onOpenReserve}>
            <Icon name="calendar" size={18} /> {t('header.reserve')}
          </button>
          <button
            className="icon-btn mobile-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? t('header.closeNav') : t('header.openNav')}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>
    </div>
  )
}
