import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import Admin from './components/Admin'
import PrivacyPolicy from './components/PrivacyPolicy'
import { LangProvider } from './i18n'
import './index.css'

const PAGES = { '/admin': Admin, '/privacy-policy': PrivacyPolicy }
const Page = PAGES[window.location.pathname.replace(/\/$/, '')] || App

if (Page === PrivacyPolicy) document.title = 'Privacy Policy — Paratha Rasoi'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* Only the main site is bilingual; admin and privacy pages stay English. */}
    {Page === App ? (
      <LangProvider>
        <App />
      </LangProvider>
    ) : (
      <Page />
    )}
  </StrictMode>,
)
