import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMaterials } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { stripMarkdown } from '../utils/stripMarkdown';
import './Materials.css';

const CATEGORIES = ['Astronomija', 'Astrofotogrāfija'];
const DIFFICULTIES_LV = ['Iesācējs', 'Vidējs', 'Pieredzējis'];
const DIFFICULTY_MAP = { 'Iesācējs': 'Beginner', 'Vidējs': 'Intermediate', 'Pieredzējis': 'Advanced' };
const difficultyColor = { 'Iesācējs': '#10b981', 'Vidējs': '#f59e0b', 'Pieredzējis': '#ef4444' };
const difficultyGradient = {
  'Iesācējs':   'linear-gradient(135deg, #052e1c 0%, #064e3b 100%)',
  'Vidējs':     'linear-gradient(135deg, #431407 0%, #78350f 100%)',
  'Pieredzējis':'linear-gradient(135deg, #450a0a 0%, #7f1d1d 100%)',
};
const CATEGORY_LABEL = {
  'Astronomija':     { lv: 'Astronomija',     en: 'Astronomy' },
  'Astrofotogrāfija':{ lv: 'Astrofotogrāfija', en: 'Astrophotography' },
};

const Materials = () => {
  const { t, lang } = useLang();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
  const [activeDifficulty, setActiveDifficulty] = useState('all');

  useEffect(() => { getMaterials().then((res) => setMaterials(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  const filtered = materials.filter((m) => {
    const matchCat = activeCategory === 'all' || m.category === activeCategory;
    const matchDiff = activeDifficulty === 'all' || m.difficulty === activeDifficulty;
    return matchCat && matchDiff;
  });

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="container mat-page">
      <div className="page-header">
        <h1>{t('materialsTitle')}</h1>
        <p>{t('materialsSubtitle')}</p>
      </div>

      <div className="mat-filters">
        <div className="mat-filter-group">
          <button className={`mat-pill ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>
            {t('allMaterials')}
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} className={`mat-pill ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
              {CATEGORY_LABEL[cat][lang] || cat}
            </button>
          ))}
        </div>
        <div className="mat-filter-sep" />
        <div className="mat-filter-group">
          <button className={`mat-pill ${activeDifficulty === 'all' ? 'active' : ''}`} onClick={() => setActiveDifficulty('all')}>
            {lang === 'en' ? 'All levels' : 'Visi līmeņi'}
          </button>
          {DIFFICULTIES_LV.map((d) => (
            <button
              key={d}
              className={`mat-pill ${activeDifficulty === d ? 'active' : ''}`}
              style={activeDifficulty === d ? { background: difficultyColor[d], borderColor: difficultyColor[d], color: '#fff' } : {}}
              onClick={() => setActiveDifficulty(d)}
            >
              {lang === 'en' ? DIFFICULTY_MAP[d] : d}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="mat-empty">{t('noMaterials')}</div>
      ) : (
        <div className="mat-grid">
          {filtered.map((m) => (
            <Link to={`/materiali/${m.id}`} key={m.id} className="mat-card">
              <div className="mat-cover">
                <div
                  className="mat-cover-img"
                  style={m.imageUrl
                    ? { backgroundImage: `url(${m.imageUrl})` }
                    : { background: difficultyGradient[m.difficulty] || difficultyGradient['Iesācējs'] }}
                />
                {m.imageUrl && <div className="mat-cover-overlay" />}
                <div className="mat-cover-badges">
                  <span className="mat-cat-badge">
                    {CATEGORY_LABEL[m.category]?.[lang] || m.category}
                  </span>
                  <span className="mat-diff-badge" style={{ color: difficultyColor[m.difficulty] }}>
                    {lang === 'en' ? DIFFICULTY_MAP[m.difficulty] : m.difficulty}
                  </span>
                </div>
              </div>
              <div className="mat-card-body">
                <h2 className="mat-card-title">{m.title}</h2>
                <p className="mat-card-excerpt">{stripMarkdown(m.content).substring(0, 120)}...</p>
                <span className="mat-read-more">{t('readMore')}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Materials;
