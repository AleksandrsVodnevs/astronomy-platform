import { useLang } from '../context/LanguageContext';
import './Legal.css';

const Terms = () => {
  const { lang } = useLang();

  return (
    <div className="container legal-page">
      {lang === 'en' ? (
        <>
          <h1>Terms of Use</h1>
          <p className="legal-updated">Last updated: May 2026</p>

          <section>
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the AstroLV platform ("the Platform"), you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use the Platform.</p>
          </section>

          <section>
            <h2>2. Description of Service</h2>
            <p>AstroLV is an educational platform dedicated to astronomy and astrophotography. It provides users with access to news, educational materials, a community forum, and user profiles. The Platform is operated as a qualification project by Aleksandrs Vodnevs, Rīgas Valsts tehnikums.</p>
          </section>

          <section>
            <h2>3. User Accounts</h2>
            <p>To access certain features, you must register an account. You agree to:</p>
            <ul>
              <li>Provide accurate and complete registration information.</li>
              <li>Keep your password secure and not share it with others.</li>
              <li>Be responsible for all activity that occurs under your account.</li>
              <li>Notify us immediately of any unauthorised use of your account.</li>
            </ul>
          </section>

          <section>
            <h2>4. User Content</h2>
            <p>By posting content (forum posts, comments) on the Platform, you confirm that:</p>
            <ul>
              <li>You own or have the right to share the content.</li>
              <li>The content does not violate any applicable laws or third-party rights.</li>
              <li>The content is not offensive, defamatory, or harmful.</li>
            </ul>
            <p>We reserve the right to remove any content that violates these terms without prior notice.</p>
          </section>

          <section>
            <h2>5. Prohibited Conduct</h2>
            <p>You agree not to:</p>
            <ul>
              <li>Post spam, advertisements, or misleading content.</li>
              <li>Harass, threaten, or abuse other users.</li>
              <li>Attempt to gain unauthorised access to any part of the Platform.</li>
              <li>Use the Platform for any unlawful purpose.</li>
            </ul>
          </section>

          <section>
            <h2>6. Intellectual Property</h2>
            <p>The AstroLV name, logo, and original content created by the Platform administrators are the property of AstroLV. User-submitted content remains the property of the respective authors.</p>
          </section>

          <section>
            <h2>7. Disclaimer</h2>
            <p>The Platform is provided "as is" without warranties of any kind. We do not guarantee uninterrupted availability or the accuracy of all content. Educational materials are provided for informational purposes only.</p>
          </section>

          <section>
            <h2>8. Changes to Terms</h2>
            <p>We may update these Terms of Use from time to time. Continued use of the Platform after changes constitutes acceptance of the revised terms.</p>
          </section>

          <section>
            <h2>9. Contact</h2>
            <p>If you have questions about these Terms, please contact us at <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a> or by phone at +371 25 131 356.</p>
          </section>
        </>
      ) : (
        <>
          <h1>Lietošanas noteikumi</h1>
          <p className="legal-updated">Pēdējo reizi atjaunināts: 2026. gada maijs</p>

          <section>
            <h2>1. Noteikumu pieņemšana</h2>
            <p>Piekļūstot AstroLV platformai ("Platforma") vai lietojot to, jūs piekrītat šiem lietošanas noteikumiem. Ja nepiekrītat, lūdzam neizmantot Platformu.</p>
          </section>

          <section>
            <h2>2. Pakalpojuma apraksts</h2>
            <p>AstroLV ir izglītības platforma, kas veltīta astronomijai un astrofotogrāfijai. Tā nodrošina lietotājiem piekļuvi ziņām, mācību materiāliem, kopienas forumam un lietotāju profiliem. Platforma tiek darbināta kā kvalifikācijas projekts — Aleksandrs Vodnevs, Rīgas Valsts tehnikums.</p>
          </section>

          <section>
            <h2>3. Lietotāju konti</h2>
            <p>Lai piekļūtu noteiktām funkcijām, jums jāreģistrējas. Jūs piekrītat:</p>
            <ul>
              <li>Sniegt precīzu un pilnīgu reģistrācijas informāciju.</li>
              <li>Glabāt paroli drošībā un nekopīgot to ar citiem.</li>
              <li>Atbildēt par visu darbību, kas notiek jūsu kontā.</li>
              <li>Nekavējoties paziņot mums par jebkādu nesankcionētu konta izmantošanu.</li>
            </ul>
          </section>

          <section>
            <h2>4. Lietotāju saturs</h2>
            <p>Publicējot saturu (foruma ierakstus, komentārus) Platformā, jūs apliecināt, ka:</p>
            <ul>
              <li>Jums pieder vai ir tiesības dalīties ar šo saturu.</li>
              <li>Saturs nepārkāpj piemērojamos likumus vai trešo pušu tiesības.</li>
              <li>Saturs nav aizskarošs, neslavinošs vai kaitīgs.</li>
            </ul>
            <p>Mēs paturam tiesības bez iepriekšēja brīdinājuma dzēst jebkuru saturu, kas pārkāpj šos noteikumus.</p>
          </section>

          <section>
            <h2>5. Aizliegtā rīcība</h2>
            <p>Jūs piekrītat:</p>
            <ul>
              <li>Nepublicēt surogātpastu, reklāmas vai maldinošu saturu.</li>
              <li>Neaizskarot, nedraudēt un nepatīkami neietekmēt citus lietotājus.</li>
              <li>Nemēģināt iegūt nesankcionētu piekļuvi jebkurai Platformas daļai.</li>
              <li>Nelietot Platformu nelikumīgiem mērķiem.</li>
            </ul>
          </section>

          <section>
            <h2>6. Intelektuālais īpašums</h2>
            <p>AstroLV nosaukums, logotips un platformas administratoru izveidotais oriģinālais saturs pieder AstroLV. Lietotāju iesniegtais saturs paliek attiecīgo autoru īpašums.</p>
          </section>

          <section>
            <h2>7. Atbildības ierobežojums</h2>
            <p>Platforma tiek nodrošināta "kā ir" bez jebkāda veida garantijām. Mēs negarantējam nepārtrauktu pieejamību vai visa satura precizitāti. Mācību materiāli tiek sniegti tikai informatīviem mērķiem.</p>
          </section>

          <section>
            <h2>8. Noteikumu izmaiņas</h2>
            <p>Mēs laiku pa laikam varam atjaunināt šos lietošanas noteikumus. Turpinot lietot Platformu pēc izmaiņām, jūs piekrītat pārskatītajiem noteikumiem.</p>
          </section>

          <section>
            <h2>9. Kontakti</h2>
            <p>Ja jums ir jautājumi par šiem noteikumiem, sazinieties ar mums: <a href="mailto:astroschool.notifications@gmail.com">astroschool.notifications@gmail.com</a> vai pa tālruni +371 25 131 356.</p>
          </section>
        </>
      )}
    </div>
  );
};
export default Terms;
