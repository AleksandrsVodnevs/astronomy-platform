import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Forum.css';

const CATEGORIES = ['Visas', 'Planētas', 'Galaktikas', 'Kosmoss', 'Astrofizika', 'Novērojumi'];

const Forum = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'Visas';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    getPosts()
      .then((res) => setPosts(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === 'Visas' || p.category === activeCategory;
    const matchesSearch = searchQuery === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('lv-LV', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  if (loading) return <div className="loading">Ielādē...</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>Forums</h1>
          <p>Dalies zināšanās ar astronomijas kopienu</p>
        </div>
        {user && (
          <Link to="/forums/jauns" className="btn btn-primary">+ Jauns ieraksts</Link>
        )}
      </div>

      {/* Category filter */}
      <div className="forum-categories">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => setSearchParams(cat === 'Visas' ? {} : { category: cat })}
          >
            {cat}
          </button>
        ))}
      </div>

      {searchQuery && (
        <div className="search-info">
          Meklēšanas rezultāti: "<strong>{searchQuery}</strong>" — {filtered.length} ieraksti
          <button onClick={() => setSearchParams({})} className="clear-search">✕ Notīrīt</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>
          Nav ierakstu šajā kategorijā
        </div>
      ) : (
        <div className="posts-list">
          {filtered.map((post) => (
            <Link to={`/forums/${post.id}`} key={post.id} className="post-card">
              <div className="post-card-main">
                <div className="post-category-badge">{post.category}</div>
                <h2>{post.title}</h2>
                <p>{post.content.substring(0, 160)}...</p>
              </div>
              <div className="post-card-meta">
                <span>✍ {post.author?.firstName} {post.author?.lastName}</span>
                <span>📅 {formatDate(post.createdAt)}</span>
                <span className="post-arrow">→</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Forum;