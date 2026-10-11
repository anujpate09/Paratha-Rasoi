import { useCallback, useState } from 'react'
import { Title, useLang } from '../i18n'
import { MenuViewer } from './Overlays'

const MENU = {
  en: { src: '/assets/paratha-rasoi-menu.jpg', alt: 'Complete Paratha Rasoi menu with dishes and prices' },
  // No Kannada menu image yet, so Kannada shows the English menu.
  kn: { src: '/assets/paratha-rasoi-menu.jpg', alt: 'ಪರಾಠ ರಸೋಯಿಯ ಪೂರ್ಣ ಮೆನು, ಖಾದ್ಯಗಳು ಮತ್ತು ಬೆಲೆಗಳೊಂದಿಗೆ' },
  hi: { src: '/assets/paratha-rasoi-menu-hi.webp', alt: 'पराठा रसोई का पूरा मेन्यू, डिशेज़ और दाम के साथ' },
}

export default function FullMenu() {
  const { lang, t } = useLang()
  const menu = MENU[lang] || MENU.en
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])

  return (
    <section className="full-menu-section" id="full-menu">
      <div className="wrap">
        <div className="eyebrow">{t('fullMenu.eyebrow')}</div>
        <h2 className="section-title">
          <Title parts={t('fullMenu.title')} />
        </h2>
        <p className="section-intro">{t('fullMenu.intro')}</p>
        <button className="menu-board-btn" onClick={() => setOpen(true)} aria-label={t('fullMenu.open')}>
          <img className="menu-board" src={menu.src} alt={menu.alt} loading="lazy" />
          <span className="menu-board-hint">{t('fullMenu.hint')}</span>
        </button>
      </div>
      <MenuViewer open={open} onClose={close} src={menu.src} alt={menu.alt} />
    </section>
  )
}
