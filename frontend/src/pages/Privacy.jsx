import { useNavigate } from 'react-router-dom';
import './Legal.css';

const Privacy = () => {
  const navigate = useNavigate();

  return (
    <div className="container legal-page">
      <button className="legal-back" onClick={() => window.history.length > 1 ? navigate(-1) : navigate('/')}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        Atpakaļ
      </button>

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
        <p>Jūsu dati tiek glabāti drošā PostgreSQL datu bāzē. Paroles tiek glabātas izmantojot bcrypt hešošanu - mēs nekad neglabājam paroles atklātā tekstā. Mēs īstenojam saprātīgus drošības pasākumus, lai aizsargātu jūsu datus no nesankcionētas piekļuves.</p>
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
    </div>
  );
};
export default Privacy;
