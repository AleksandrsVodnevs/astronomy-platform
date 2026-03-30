import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews, getPosts, getApod } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import './Home.css';
import StarsBackground from '../components/StarsBackground';
import EarthPlanet from '../components/EarthPlanet';

const APOD_CACHE_KEY = 'apod_cache_v3';

const Home = () => {
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [apod, setApod] = useState(null);
  const [apodLoading, setApodLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNews(), getPosts()])
      .then(([nr, pr]) => { setNews(nr.data.slice(0, 5)); setPosts(pr.data.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    // Serve from localStorage cache if today's entry exists
    try {
      const raw = localStorage.getItem(APOD_CACHE_KEY);
      if (raw) {
        const { date, data } = JSON.parse(raw);
        if (date === today && data && !data.error) {
          setApod(data);
          setApodLoading(false);
          return;
        }
      }
    } catch (_) {}

    // Fetch via backend proxy (avoids per-browser-IP rate limiting)
    getApod()
      .then((res) => {
        const d = res.data;
        setApod(d);
        if (!d.error) {
          try { localStorage.setItem(APOD_CACHE_KEY, JSON.stringify({ date: today, data: d })); } catch (_) {}
        }
      })
      .catch(console.error)
      .finally(() => setApodLoading(false));
  }, []);

  if (loading) return <div className="loading">{t('loading')}</div>;

  const isVideo = apod && (apod.media_type === 'video' || apod.url?.includes('youtube'));

  return (
    <div className="home">
      <section className="hero">
        <StarsBackground />
        <div className="hero-content">
          <h1 className="hero-title">{t('heroTitle')}</h1>
          <p className="hero-subtitle">{t('heroSubtitle')}</p>
          <div className="hero-buttons">
            <Link to="/forums" className="btn btn-primary">{t('goToForum')}</Link>
            <Link to="/zinas" className="btn btn-secondary">{t('news')}</Link>
            <Link to="/materiali" className="btn btn-secondary">{t('materials')}</Link>
          </div>
        </div>
        <div className="hero-image">
          <EarthPlanet />
        </div>
      </section>

      <div className="home-body container">

        {/* Left: NASA APOD */}
        <div className="home-apod-col">
          {apodLoading ? (
            <div className="apod-skeleton">
              <div className="apod-skel-img skel-pulse" />
              <div className="apod-skel-line skel-pulse" style={{ width: '55%', margin: '1rem 1rem 0.5rem' }} />
              <div className="apod-skel-line skel-pulse" style={{ width: '85%', margin: '0 1rem 0.4rem' }} />
              <div className="apod-skel-line skel-pulse" style={{ width: '70%', margin: '0 1rem 1rem' }} />
            </div>
          ) : apod && !apod.error ? (
            <div className="apod-card">
              <span className="apod-eyebrow">NASA: Dienas attēls</span>
              {isVideo ? (
                <div className="apod-video-thumb">
                  <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" opacity="0.35">
                    <circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/>
                  </svg>
                  <a href={apod.url} target="_blank" rel="noreferrer" className="apod-video-link">
                    {lang === 'en' ? 'Watch on NASA' : 'Skatīt NASA vietnē'}
                  </a>
                </div>
              ) : (
                <img
                  src={apod.hdurl || apod.url}
                  alt={apod.title}
                  className="apod-img"
                  loading="eager"
                  onError={(e) => { e.target.src = apod.url; }}
                />
              )}
              <div className="apod-info">
                <div className="apod-meta">
                  <span className="apod-date">{apod.date}</span>
                  {apod.copyright && (
                    <span className="apod-copy">© {apod.copyright.replace(/\n/g, ' ')}</span>
                  )}
                </div>
                <h2 className="apod-title">{apod.title}</h2>
                <p className="apod-excerpt">
                  {apod.explanation?.substring(0, 220)}{'… '}
                  <a
                    href={`https://apod.nasa.gov/apod/ap${apod.date.replace(/-/g, '').substring(2)}.html`}
                    target="_blank"
                    rel="noreferrer"
                    className="apod-read-more"
                  >
                    {lang === 'en' ? 'Read more' : 'Lasīt vairāk'} →
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <a className="apod-fallback" href="https://apod.nasa.gov" target="_blank" rel="noreferrer">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" opacity="0.4">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4l3 3"/>
              </svg>
              <span className="apod-fallback-title">NASA: Dienas attēls</span>
              <span className="apod-fallback-sub">Skatīt apod.nasa.gov →</span>
            </a>
          )}
        </div>

        {/* Middle: Latest news */}
        <section className="home-news">
          <div className="section-header">
            <h2>{t('latestNews')}</h2>
            <Link to="/zinas" className="see-all">{t('seeAll')}</Link>
          </div>
          {news.length === 0 ? <div className="empty-state">{t('noNews')}</div> : (
            <div className="news-list">
              {news.map((item) => (
                <Link to={`/zinas/${item.id}`} key={item.id} className="news-card">
                  <div className="news-body">
                    <h3>{item.title}</h3>
                    <span className="news-date">{timeAgo(item.createdAt, lang)}</span>
                    <p>{item.content.substring(0, 110)}...</p>
                  </div>
                  <span className="news-arrow">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Right: sidebar (popular posts + forum topics) */}
        <aside className="home-sidebar">
          <div className="sidebar-card">
            <h3>{t('popularPosts')}</h3>
            {posts.length === 0 ? <div className="empty-state">{t('noPosts')}</div> : (
              <ul className="popular-list">
                {posts.map((post, idx) => (
                  <li key={post.id}><Link to={`/forums/${post.id}`}><span className="popular-num">{idx + 1}</span>{post.title}</Link></li>
                ))}
              </ul>
            )}
          </div>
          <div className="sidebar-card">
            <h3>{t('forumTopics')}</h3>
            <ul className="topics-list">
              {(lang === 'en'
                ? [['Planētas','Planets'],['Galaktikas','Galaxies'],['Kosmoss','Space'],['Astrofizika','Astrophysics'],['Novērojumi','Observations']]
                : [['Planētas','Planētas'],['Galaktikas','Galaktikas'],['Kosmoss','Kosmoss'],['Astrofizika','Astrofizika'],['Novērojumi','Novērojumi']]
              ).map(([cat, label]) => (
                <li key={cat}><Link to={`/forums?category=${cat}`}>{label}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};
export default Home;
