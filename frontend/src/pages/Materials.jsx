import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMaterials } from '../services/api';
import { useLang } from '../context/LanguageContext';
import './Materials.css';

const CATEGORIES = ['Astronomija', 'Astrofotogrāfija'];
const DIFFICULTIES_LV = ['Iesācējs', 'Vidējs', 'Pieredzējis'];
const DIFFICULTY_MAP = { 'Iesācējs': 'Beginner', 'Vidējs': 'Intermediate', 'Pieredzējis': 'Advanced' };
const difficultyColor = { 'Iesācējs': '#10b981', 'Vidējs': '#f59e0b', 'Pieredzējis': '#ef4444' };
const CATEGORY_LABEL = { 'Astronomija': { lv: 'Astronomija', en: 'Astronomy' }, 'Astrofotogrāfija': { lv: 'Astrofotogrāfija', en: 'Astrophotography' } };

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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header"><h1>{t('materialsTitle')}</h1><p>{t('materialsSubtitle')}</p></div>

      <div className="mat-tabs">
        <button className={`mat-tab ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setActiveCategory('all')}>{t('allMaterials')}</button>
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`mat-tab ${activeCategory === cat ? 'active' : ''}`} onClick={() => setActiveCategory(cat)}>
            {CATEGORY_LABEL[cat][lang] || cat}
          </button>
        ))}
      </div>

      <div className="mat-difficulty-filter">
        <span style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{t('difficulty')}:</span>
        <button className={`diff-btn ${activeDifficulty === 'all' ? 'active' : ''}`} onClick={() => setActiveDifficulty('all')}>{t('allMaterials')}</button>
        {DIFFICULTIES_LV.map((d) => (
          <button key={d} className={`diff-btn ${activeDifficulty === d ? 'active' : ''}`}
            style={activeDifficulty === d ? { background: difficultyColor[d], borderColor: difficultyColor[d], color: 'white' } : {}}
            onClick={() => setActiveDifficulty(d)}>{lang === 'en' ? DIFFICULTY_MAP[d] : d}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>{t('noMaterials')}</div>
      ) : (
        <div className="mat-grid">
          {filtered.map((m) => (
            <Link to={`/materiali/${m.id}`} key={m.id} className="mat-card">
              <div className="mat-card-top">
                <span className="mat-category-label">{CATEGORY_LABEL[m.category]?.[lang] || m.category}</span>
                <span className="mat-difficulty" style={{ color: difficultyColor[m.difficulty] }}>
                  {lang === 'en' ? DIFFICULTY_MAP[m.difficulty] : m.difficulty}
                </span>
              </div>
              <h2>{m.title}</h2>
              <p>{m.content.substring(0, 140)}...</p>
              <span className="mat-read-more">{t('readMore')}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Materials;
