import { useCallback, useEffect, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import Signature from './components/Signature'
import Speciality from './components/Speciality'
import FullMenu from './components/FullMenu'
import Story from './components/Story'
import Visit from './components/Visit'
import Reviews from './components/Reviews'
import Contact from './components/Contact'
import Footer from './components/Footer'
import { Overlay, ReservationModal, SearchPanel } from './components/Overlays'
import { useLang } from './i18n'

export default function App() {
  const { t } = useLang()
  const [reserveOpen, setReserveOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const close = useCallback(() => {
    setReserveOpen(false)
    setSearchOpen(false)
  }, [])

  useEffect(() => {
    document.title = t('meta.title')
  }, [t])

  // In-page links (#menu, #contact…) scroll to their section without adding the hash to the URL.
  useEffect(() => {
    const onClick = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = event.target.closest?.('a[href^="#"]')
      const target = link && document.getElementById(link.getAttribute('href').slice(1))
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({ block: 'start' })
    }
    document.addEventListener('click', onClick)

    // Arriving from another page with a hash (e.g. /#contact): scroll there, then drop the hash.
    const hashTarget = window.location.hash && document.getElementById(window.location.hash.slice(1))
    if (hashTarget) {
      hashTarget.scrollIntoView({ block: 'start' })
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }

    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <Header onOpenReserve={() => setReserveOpen(true)} onOpenSearch={() => setSearchOpen(true)} />
      <main>
        <Hero />
        <Signature />
        <Speciality />
        <FullMenu />
        <Story />
        <Visit />
        <Reviews />
        <Contact />
      </main>
      <Footer />

      <Overlay show={reserveOpen || searchOpen} onClick={close} />
      <ReservationModal open={reserveOpen} onClose={close} />
      <SearchPanel open={searchOpen} onClose={close} />
    </>
  )
}
