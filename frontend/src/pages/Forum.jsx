import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getPosts } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import { translateCategory } from '../utils/categoryUtils';
import Avatar from '../components/Avatar';
import './Forum.css';

const CATEGORIES = ['Planētas', 'Galaktikas', 'Kosmoss', 'Astrofizika', 'Novērojumi'];

const Forum = () => {
  const { user } = useAuth();
  const { t, lang } = useLang();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'all';
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => { getPosts().then((res) => setPosts(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);

  const filtered = posts.filter((p) => {
    const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
    const matchesSearch = searchQuery === '' || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  if (loading) return <div className="loading">{t('loading')}</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>{t('forumTitle')}</h1>
          <p>{t('forumSubtitle')}</p>
        </div>
        {user && <Link to="/forums/jauns" className="btn btn-primary">{t('newPost')}</Link>}
      </div>
      <div className="forum-categories">
        <button className={`category-btn ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setSearchParams({})}>{t('allCategories')}</button>
        {CATEGORIES.map((cat) => (
          <button key={cat} className={`category-btn ${activeCategory === cat ? 'active' : ''}`} onClick={() => setSearchParams({ category: cat })}>{translateCategory(cat, lang)}</button>
        ))}
      </div>
      {searchQuery && (
        <div className="search-info">
          "{searchQuery}" — {filtered.length} {lang === 'en' ? 'results' : 'rezultāti'}
          <button onClick={() => setSearchParams({})} className="clear-search">Clear</button>
        </div>
      )}
      {filtered.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', marginTop: '1rem' }}>{t('noPostsInCategory')}</div>
      ) : (
        <div className="posts-list">
          {filtered.map((post) => (
            <Link to={`/forums/${post.id}`} key={post.id} className="post-card">
              <div className="post-card-main">
                <div className="post-category-badge">{translateCategory(post.category, lang)}</div>
                <h2>{post.title}</h2>
                <p>{post.content.substring(0, 160)}...</p>
              </div>
              <div className="post-card-meta">
                <Link to={`/profils/${post.author?.id}`} className="post-author-link" onClick={(e) => e.stopPropagation()}>
                  <Avatar user={post.author} size={22} />
                  <span>{post.author?.firstName} {post.author?.lastName}</span>
                </Link>
                <span className="post-time">{timeAgo(post.createdAt, lang)}</span>
                <svg className="post-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Forum;
