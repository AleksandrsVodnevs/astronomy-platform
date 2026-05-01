import { Link } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import BlackHoleLogo from './BlackHoleLogo';
import './Footer.css';

const Footer = () => {
  const { lang } = useLang();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-grid">

          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <BlackHoleLogo size={24} />
              <span>AstroLV</span>
            </div>
            <p>{lang === 'en'
              ? 'Astronomy and astrophotography education platform for enthusiasts in Latvia.'
              : 'Astronomijas un astrofotogrāfijas izglītības platforma entuziastiem Latvijā.'
            }</p>
          </div>

          {/* Navigation */}
          <div className="footer-col">
            <h4>{lang === 'en' ? 'Platform' : 'Platforma'}</h4>
            <ul>
              <li><Link to="/">{lang === 'en' ? 'Home' : 'Sākums'}</Link></li>
              <li><Link to="/zinas">{lang === 'en' ? 'News' : 'Ziņas'}</Link></li>
              <li><Link to="/forums">{lang === 'en' ? 'Forum' : 'Forums'}</Link></li>
              <li><Link to="/materiali">{lang === 'en' ? 'Learning Materials' : 'Mācību materiāli'}</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-col">
            <h4>{lang === 'en' ? 'Legal' : 'Juridiskā info'}</h4>
            <ul>
              <li><Link to="/noteikumi">{lang === 'en' ? 'Terms of Use' : 'Lietošanas noteikumi'}</Link></li>
              <li><Link to="/privatums">{lang === 'en' ? 'Privacy Policy' : 'Privātuma politika'}</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4>{lang === 'en' ? 'Contact' : 'Kontakti'}</h4>
            <ul>
              <li>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a>
              </li>
              <li>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.5 19.79 19.79 0 0 1 1.58 4.91 2 2 0 0 1 3.55 2.72h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 10.18a16 16 0 0 0 6 6l1.27-.73a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 17.92z"/></svg>
                <a href="tel:+37125131356">+371 25 131 356</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="footer-bottom">
          <span>&copy; {year} AstroLV. {lang === 'en' ? 'All rights reserved.' : 'Visas tiesības aizsargātas.'}</span>
          <div className="footer-bottom-links">
            <Link to="/noteikumi">{lang === 'en' ? 'Terms' : 'Noteikumi'}</Link>
            <Link to="/privatums">{lang === 'en' ? 'Privacy' : 'Privātums'}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
