import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPublicProfile, getUserCommentCount } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import { translateCategory } from '../utils/categoryUtils';
import Avatar from '../components/Avatar';
import './PublicProfile.css';

const PublicProfile = () => {
  const { id } = useParams();
  const { t, lang } = useLang();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentCount, setCommentCount] = useState(0);

  useEffect(() => {
    getPublicProfile(id).then((res) => setData(res.data)).catch(console.error).finally(() => setLoading(false));
    getUserCommentCount(id).then((res) => setCommentCount(res.data.count)).catch(console.error);
  }, [id]);

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!data) return <div className="error">{lang === 'en' ? 'User not found' : 'Lietotājs nav atrasts'}</div>;

  const { user, posts } = data;
  const joinDate = new Date(user.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'lv-LV', { year: 'numeric', month: 'long' });
  const joinShort = new Date(user.createdAt).toLocaleDateString(lang === 'en' ? 'en-GB' : 'lv-LV', { year: 'numeric', month: 'short' });

  return (
    <div className="container public-profile-container">
      <aside className="public-profile-sidebar">
        <div className="card public-profile-card">
          <div className="public-avatar-wrap"><Avatar user={user} size={90} /></div>
          <h1 className="public-name">{user.firstName} {user.lastName}</h1>
          <span className={`badge badge-${user.role === 'admin' ? 'admin' : 'user'}`}>
            {user.role === 'admin' ? t('roleAdmin') : t('roleUser')}
          </span>
          {user.bio && <p className="public-bio">{user.bio}</p>}
          <div className="public-meta-list">
            {user.location && (
              <div className="public-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/><circle cx="12" cy="9" r="2.5"/></svg>
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="public-meta-item">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                <a href={user.website} target="_blank" rel="noreferrer">{user.website.replace(/^https?:\/\//, '')}</a>
              </div>
            )}
            <div className="public-meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              <span>{lang === 'en' ? 'Joined' : 'Pievienojās'} {joinDate}</span>
            </div>
          </div>
          <div className="profile-stats-row">
            <div className="profile-stat-box">
              <span className="psb-num">{posts.length}</span>
              <span className="psb-label">{lang === 'en' ? 'Posts' : 'Ieraksti'}</span>
            </div>
            <div className="profile-stat-box">
              <span className="psb-num">{commentCount}</span>
              <span className="psb-label">{lang === 'en' ? 'Comments' : 'Komentāri'}</span>
            </div>
            <div className="profile-stat-box">
              <span className="psb-num">{joinShort}</span>
              <span className="psb-label">{lang === 'en' ? 'Member since' : 'Dalībnieks kopš'}</span>
            </div>
          </div>
          {user.interests && (
            <div className="public-interests">
              {user.interests.split(',').map((i) => i.trim()).filter(Boolean).map((interest) => (
                <span key={interest} className="interest-tag">{interest}</span>
              ))}
            </div>
          )}
        </div>
      </aside>

      <main className="public-profile-posts">
        <h2 className="public-posts-title">
          {lang === 'en' ? 'Posts' : 'Ieraksti'}
          <span className="public-posts-count">{posts.length}</span>
        </h2>
        {posts.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', padding: '2rem' }}>
            {lang === 'en' ? 'No posts yet' : 'Vēl nav ierakstu'}
          </div>
        ) : (
          <div className="public-posts-list">
            {posts.map((post) => (
              <Link to={`/forums/${post.id}`} key={post.id} className="public-post-card card">
                {post.imageUrl && (
                  <div className="public-post-image"><img src={post.imageUrl} alt={post.title} /></div>
                )}
                <div className="public-post-body">
                  <span className="post-category-badge">{translateCategory(post.category, lang)}</span>
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 120)}...</p>
                  <span className="public-post-time">{timeAgo(post.createdAt, lang)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
export default PublicProfile;
