import { PHONE, PHONE_DISPLAY } from '../data'
import Icon from './Icon'

// Adapted from the restaurant's existing policy (paratha-rasoi.grexa.site/privacy-policy).
export default function PrivacyPolicy() {
  return (
    <>
      <div className="header-bar scrolled">
        <header className="header wrap">
          <a className="logo" href="/" aria-label="Paratha Rasoi home">
            <img src="/assets/logo.png" alt="Paratha Rasoi — Swaad jo ghar ki yaad dilaye" width="600" height="240" />
          </a>
          <a className="btn" href="/">
            <Icon name="chevronLeft" size={16} /> Back to website
          </a>
        </header>
      </div>

      <main className="legal wrap">
        <div className="eyebrow">Paratha Rasoi</div>
        <h1 className="section-title">Privacy <em>Policy</em></h1>
        <p className="legal-date">
          <b>Effective Date:</b> 1st January, 2025
        </p>

        <p>
          Paratha Rasoi (“we,” “our,” or “us”) values your privacy. This Privacy Policy explains how we
          collect, use, and protect your information when you visit our website.
        </p>

        <h2>Information We Collect</h2>
        <ul>
          <li>
            <b>Personal information</b> that you provide when you contact us, reserve a table, or sign up
            for our services (such as name, email, phone number).
          </li>
          <li>
            <b>Non-personal information</b> collected automatically through cookies or analytics tools
            (such as browser type, IP address, pages visited).
          </li>
        </ul>

        <h2>How We Use Information</h2>
        <p>We may use the information we collect to:</p>
        <ul>
          <li>Provide, operate, and improve our website and services.</li>
          <li>Respond to inquiries or customer support requests.</li>
          <li>Send updates, offers, or marketing communications (you can opt out anytime).</li>
          <li>Analyze website traffic and usage patterns.</li>
        </ul>

        <h2>Sharing of Information</h2>
        <p>
          We do not sell, rent, or trade your personal information. We may share it only with trusted
          third parties who help us operate our website, or when required to comply with the law or to
          protect our rights.
        </p>

        <h2>Cookies</h2>
        <p>
          Our website may use cookies to enhance your browsing experience. You can set your browser to
          refuse cookies, but some features of the website may not work properly as a result.
        </p>

        <h2>Data Security</h2>
        <p>
          We implement reasonable measures to protect your personal information. However, no method of
          transmitting data over the Internet is completely secure.
        </p>

        <h2>Your Rights</h2>
        <p>
          You may request access to, correction of, or deletion of your personal data by{' '}
          <a href="/#contact">contacting us</a>.
        </p>

        <h2>Updates to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. Any changes will be posted on this page
          with the updated effective date.
        </p>

        <h2>Contact Us</h2>
        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
        <ul className="legal-contact">
          <li>
            <Icon name="phone" size={18} /> <a href={`tel:${PHONE}`}>{PHONE_DISPLAY}</a>
          </li>
          <li>
            <Icon name="pin" size={18} /> Shop No 4 &amp; 5, LG City, Gunjur - Nerige Road, Gunjur,
            Halasahalli Thippasandra, Bengaluru, Karnataka 560087
          </li>
        </ul>
      </main>

      <footer className="legal-footer">
        <div className="wrap">
          © {new Date().getFullYear()} Paratha Rasoi. All rights reserved. · <a href="/">Home</a>
        </div>
      </footer>
    </>
  )
}
