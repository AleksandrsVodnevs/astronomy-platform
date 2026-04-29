import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getNewsItem, deleteNews } from '../services/api';
import { useAuth } from '../context/AuthContext';

const NewsDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNewsItem(id)
      .then((res) => setItem(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm('Vai tiešām dzēst šo ziņu?')) return;
    try {
      await deleteNews(id);
      navigate('/zinas');
    } catch (err) {
      alert('Kļūda dzēšot ziņu');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('lv-LV', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) return <div className="loading">Ielādē...</div>;
  if (!item) return <div className="error">Ziņa nav atrasta</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>
      <Link to="/zinas" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Atpakaļ uz ziņām</Link>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            📡 {formatDate(item.createdAt)} · {item.admin?.firstName} {item.admin?.lastName}
          </span>
          {user?.role === 'admin' && (
            <button className="btn btn-danger btn-sm" onClick={handleDelete}>Dzēst</button>
          )}
        </div>

        <h1 style={{ fontSize: '1.7rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>{item.title}</h1>

        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {item.content}
        </div>

        {item.sourceUrl && (
          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
            <a href={item.sourceUrl} target="_blank" rel="noreferrer"
              style={{ fontSize: '0.9rem', color: 'var(--accent)' }}>
              🔗 Oriģinālais avots
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsDetail;