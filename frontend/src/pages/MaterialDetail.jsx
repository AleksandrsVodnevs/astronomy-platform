import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { getMaterial, deleteMaterial } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import './MaterialDetail.css';

const difficultyColor = { 'Iesācējs': '#10b981', 'Vidējs': '#f59e0b', 'Pieredzējis': '#ef4444' };
const DIFFICULTY_MAP = { 'Iesācējs': 'Beginner', 'Vidējs': 'Intermediate', 'Pieredzējis': 'Advanced' };
const CATEGORY_LABEL = { 'Astronomija': { lv: 'Astronomija', en: 'Astronomy' }, 'Astrofotogrāfija': { lv: 'Astrofotogrāfija', en: 'Astrophotography' } };

const MaterialDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { getMaterial(id).then((res) => setMaterial(res.data)).catch(console.error).finally(() => setLoading(false)); }, [id]);

  const handleDelete = async () => {
    if (!window.confirm(lang === 'en' ? 'Delete this material?' : 'Dzēst šo materiālu?')) return;
    try { await deleteMaterial(id); navigate('/materiali'); } catch { alert('Kļūda'); }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString(lang === 'en' ? 'en-GB' : 'lv-LV', { year: 'numeric', month: 'long', day: 'numeric' });

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!material) return <div className="error">{lang === 'en' ? 'Material not found' : 'Materiāls nav atrasts'}</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '860px' }}>
      <Link to="/materiali" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{t('backToMaterials')}</Link>

      <div className="card" style={{ marginTop: '1.2rem' }}>
        {/* Cover image */}
        {material.imageUrl && (
          <div style={{ margin: '-1.5rem -1.5rem 1.8rem', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
            <img src={material.imageUrl} alt={material.title} style={{ width: '100%', maxHeight: '400px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(79,142,247,0.12)', color: 'var(--accent)', borderRadius: '20px', padding: '0.15rem 0.7rem', fontSize: '0.78rem', fontWeight: 600 }}>
              {CATEGORY_LABEL[material.category]?.[lang] || material.category}
            </span>
            <span style={{ fontSize: '0.82rem', fontWeight: 600, color: difficultyColor[material.difficulty] }}>
              {lang === 'en' ? DIFFICULTY_MAP[material.difficulty] : material.difficulty}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{formatDate(material.createdAt)}</span>
          </div>
          {user?.role === 'admin' && <button className="btn btn-danger btn-sm" onClick={handleDelete}>{t('delete')}</button>}
        </div>

        <h1 style={{ fontSize: '1.7rem', marginBottom: '1.8rem', lineHeight: '1.3' }}>{material.title}</h1>

        {/* Markdown rendered content */}
        <div className="markdown-body">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {material.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};
export default MaterialDetail;
