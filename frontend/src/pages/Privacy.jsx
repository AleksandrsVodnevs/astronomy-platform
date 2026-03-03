import { useNavigate } from 'react-router-dom';
import { useLang } from '../context/LanguageContext';
import './Legal.css';

const Privacy = () => {
  const { lang } = useLang();
  const navigate = useNavigate();

  return (
    <div className="container legal-page">
      <button className="legal-back" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        {lang === 'en' ? 'Back' : 'Atpakaļ'}
      </button>
      {lang === 'en' ? (
        <>
          <h1>Privacy Policy</h1>
          <p className="legal-updated">Last updated: May 2026</p>

          <section>
            <h2>1. Introduction</h2>
            <p>AstroLV ("we", "our", "the Platform") is committed to protecting your personal data. This Privacy Policy explains what data we collect, how we use it, and your rights regarding it.</p>
          </section>

          <section>
            <h2>2. Data We Collect</h2>
            <p>When you register and use the Platform, we collect:</p>
            <ul>
              <li><strong>Account information:</strong> first name, last name, email address, encrypted password.</li>
              <li><strong>Profile information (optional):</strong> profile picture, bio, location, website, interests.</li>
              <li><strong>User content:</strong> forum posts and comments you publish.</li>
              <li><strong>Technical data:</strong> login timestamps and account status changes.</li>
            </ul>
          </section>

          <section>
            <h2>3. How We Use Your Data</h2>
            <p>We use your data to:</p>
            <ul>
              <li>Provide and maintain the Platform's functionality.</li>
              <li>Manage your account and authenticate your identity.</li>
              <li>Send password reset emails when requested.</li>
              <li>Display your public profile and posts to other users.</li>
              <li>Moderate content and ensure Platform safety.</li>
            </ul>
          </section>

          <section>
            <h2>4. Data Sharing</h2>
            <p>We do not sell or share your personal data with third parties. Your public profile information (name, avatar, bio, posts) is visible to all Platform users. Your email address is never publicly displayed.</p>
          </section>

          <section>
            <h2>5. Data Storage and Security</h2>
            <p>Your data is stored in a secure PostgreSQL database. Passwords are stored using bcrypt hashing — we never store plaintext passwords. We implement reasonable security measures to protect your data from unauthorised access.</p>
          </section>

          <section>
            <h2>6. Your Rights</h2>
            <p>You have the right to:</p>
            <ul>
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your account and associated data.</li>
              <li>Update your profile information at any time through your profile page.</li>
            </ul>
            <p>To exercise these rights, contact us at <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a>.</p>
          </section>

          <section>
            <h2>7. Cookies</h2>
            <p>The Platform uses browser localStorage to store your authentication token and language preference. No third-party tracking cookies are used.</p>
          </section>

          <section>
            <h2>8. Children's Privacy</h2>
            <p>The Platform is not directed at children under the age of 13. We do not knowingly collect data from children under 13.</p>
          </section>

          <section>
            <h2>9. Changes to This Policy</h2>
            <p>We may update this Privacy Policy from time to time. We encourage you to review it periodically.</p>
          </section>

          <section>
            <h2>10. Contact</h2>
            <p>For privacy-related questions, contact us at <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a> or +371 25 131 356.</p>
          </section>
        </>
      ) : (
        <>
          <h1>Privātuma politika</h1>
          <p className="legal-updated">Pēdējo reizi atjaunināts: 2026. gada maijs</p>

          <section>
            <h2>1. Ievads</h2>
            <p>AstroLV ("mēs", "mūsu", "Platforma") apņemas aizsargāt jūsu personas datus. Šī privātuma politika paskaidro, kādus datus mēs apkopojam, kā tos izmantojam un kādas ir jūsu tiesības.</p>
          </section>

          <section>
            <h2>2. Apkopotie dati</h2>
            <p>Reģistrējoties un lietojot Platformu, mēs apkopojam:</p>
            <ul>
              <li><strong>Konta informācija:</strong> vārds, uzvārds, e-pasta adrese, šifrēta parole.</li>
              <li><strong>Profila informācija (neobligāta):</strong> profila attēls, apraksts par sevi, atrašanās vieta, tīmekļa vietne, intereses.</li>
              <li><strong>Lietotāja saturs:</strong> jūsu publicētie foruma ieraksti un komentāri.</li>
              <li><strong>Tehniskie dati:</strong> pieteikšanās laika zīmogi un konta statusa izmaiņas.</li>
            </ul>
          </section>

          <section>
            <h2>3. Datu izmantošana</h2>
            <p>Mēs izmantojam jūsu datus, lai:</p>
            <ul>
              <li>Nodrošinātu un uzturētu Platformas funkcionalitāti.</li>
              <li>Pārvaldītu jūsu kontu un autentificētu jūsu identitāti.</li>
              <li>Nosūtītu paroles atjaunošanas e-pastus pēc pieprasījuma.</li>
              <li>Rādītu jūsu publisko profilu un ierakstus citiem lietotājiem.</li>
              <li>Moderētu saturu un nodrošinātu Platformas drošību.</li>
            </ul>
          </section>

          <section>
            <h2>4. Datu kopīgošana</h2>
            <p>Mēs nepārdodam un nekopīgojam jūsu personas datus ar trešajām pusēm. Jūsu publiskā profila informācija (vārds, attēls, apraksts, ieraksti) ir redzama visiem Platformas lietotājiem. Jūsu e-pasta adrese nekad netiek publiski parādīta.</p>
          </section>

          <section>
            <h2>5. Datu glabāšana un drošība</h2>
            <p>Jūsu dati tiek glabāti drošā PostgreSQL datu bāzē. Paroles tiek glabātas izmantojot bcrypt hešošanu — mēs nekad neglabājam paroles atklātā tekstā. Mēs īstenojam saprātīgus drošības pasākumus, lai aizsargātu jūsu datus no nesankcionētas piekļuves.</p>
          </section>

          <section>
            <h2>6. Jūsu tiesības</h2>
            <p>Jums ir tiesības:</p>
            <ul>
              <li>Piekļūt mūsu glabātajiem personas datiem par jums.</li>
              <li>Pieprasīt neprecīzu datu labošanu.</li>
              <li>Pieprasīt sava konta un saistīto datu dzēšanu.</li>
              <li>Jebkurā laikā atjaunināt profila informāciju profila lapā.</li>
            </ul>
            <p>Lai izmantotu šīs tiesības, sazinieties ar mums: <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a>.</p>
          </section>

          <section>
            <h2>7. Sīkdatnes</h2>
            <p>Platforma izmanto pārlūka localStorage, lai glabātu jūsu autentifikācijas tokenu un valodas preferences. Netiek izmantotas trešo pušu izsekošanas sīkdatnes.</p>
          </section>

          <section>
            <h2>8. Bērnu privātums</h2>
            <p>Platforma nav paredzēta bērniem līdz 13 gadu vecumam. Mēs apzināti neapkopojam datus no bērniem līdz 13 gadiem.</p>
          </section>

          <section>
            <h2>9. Politikas izmaiņas</h2>
            <p>Mēs laiku pa laikam varam atjaunināt šo privātuma politiku. Iesakām to periodiski pārskatīt.</p>
          </section>

          <section>
            <h2>10. Kontakti</h2>
            <p>Ar privātumu saistītiem jautājumiem sazinieties ar mums: <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a> vai +371 25 131 356.</p>
          </section>
        </>
      )}
    </div>
  );
};
export default Privacy;
