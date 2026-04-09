import { useNavigate } from 'react-router-dom';
import './Legal.css';

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className="container legal-page">
      <button className="legal-back" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Atpakaļ
      </button>

      <h1>Lietošanas noteikumi</h1>
      <p className="legal-updated">Pēdējo reizi atjaunināts: 2026. gada maijs</p>

      <section>
        <h2>1. Noteikumu pieņemšana</h2>
        <p>Piekļūstot AstroLV platformai ("Platforma") vai lietojot to, jūs piekrītat šiem lietošanas noteikumiem. Ja nepiekrītat, lūdzam neizmantot Platformu.</p>
      </section>

      <section>
        <h2>2. Pakalpojuma apraksts</h2>
        <p>AstroLV ir izglītības platforma, kas veltīta astronomijai un astrofotogrāfijai. Tā nodrošina lietotājiem piekļuvi ziņām, mācību materiāliem, kopienas forumam un lietotāju profiliem. Platforma tiek darbināta kā kvalifikācijas projekts - Aleksandrs Vodnevs, Rīgas Valsts tehnikums.</p>
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
    </div>
  );
};
export default Terms;
