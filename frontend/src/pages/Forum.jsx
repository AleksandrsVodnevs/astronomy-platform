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

const CATEGORY_COLORS = {
  'Planētas':   '#4f8ef7',
  'Galaktikas': '#8b5cf6',
  'Kosmoss':    '#06b6d4',
  'Astrofizika':'#f59e0b',
  'Novērojumi': '#10b981',
};

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
    <div className="container forum-page">
      <div className="forum-header">
        <div className="page-header" style={{ marginBottom: 0 }}>
          <h1>{t('forumTitle')}</h1>
          <p>{t('forumSubtitle')}</p>
        </div>
        {user && (
          <Link to="/forums/jauns" className="forum-new-btn">
            {t('newPost')}
          </Link>
        )}
      </div>

      <div className="forum-filters">
        <button className={`forum-pill ${activeCategory === 'all' ? 'active' : ''}`} onClick={() => setSearchParams({})}>
          {t('allCategories')}
        </button>
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`forum-pill ${activeCategory === cat ? 'active' : ''}`}
            style={activeCategory === cat ? { background: CATEGORY_COLORS[cat], borderColor: CATEGORY_COLORS[cat], color: '#fff' } : {}}
            onClick={() => setSearchParams({ category: cat })}
          >
            {translateCategory(cat, lang)}
          </button>
        ))}
      </div>

      {searchQuery && (
        <div className="search-info">
          <span>"{searchQuery}" - {filtered.length} rezultāti</span>
          <button onClick={() => setSearchParams({})} className="clear-search">Dzēst</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="forum-empty">{t('noPostsInCategory')}</div>
      ) : (
        <div className="forum-list">
          {filtered.map((post) => (
            <Link
              to={`/forums/${post.id}`}
              key={post.id}
              className="forum-row"
              style={{ '--cat-color': CATEGORY_COLORS[post.category] || 'var(--accent)' }}
            >
              <div className="forum-row-body">
                <div className="forum-row-top">
                  <span
                    className="forum-cat-pill"
                    style={{
                      background: `${CATEGORY_COLORS[post.category] || '#4f8ef7'}1a`,
                      color: CATEGORY_COLORS[post.category] || 'var(--accent)',
                    }}
                  >
                    {translateCategory(post.category, lang)}
                  </span>
                </div>
                <h2 className="forum-row-title">{post.title}</h2>
                <div className="forum-row-meta">
                  <Link to={`/profils/${post.author?.id}`} className="forum-row-author" onClick={(e) => e.stopPropagation()}>
                    <Avatar user={post.author} size={20} />
                    <span>{post.author?.firstName} {post.author?.lastName}</span>
                  </Link>
                  <span className="forum-row-dot" />
                  <span className="forum-row-time">{timeAgo(post.createdAt, lang)}</span>
                  <span className="forum-row-dot" />
                  <span className="forum-row-comments">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {post._count?.Comments ?? post.Comments?.length ?? 0}
                  </span>
                </div>
              </div>
              <svg className="forum-row-arrow" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default Forum;
