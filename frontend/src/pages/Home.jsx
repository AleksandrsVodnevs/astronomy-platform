import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews, getPosts } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import './Home.css';
import StarsBackground from '../components/StarsBackground';
import EarthPlanet from '../components/EarthPlanet';

const Home = () => {
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNews(), getPosts()])
      .then(([nr, pr]) => { setNews(nr.data.slice(0, 5)); setPosts(pr.data.slice(0, 5)); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">{t('loading')}</div>;

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

      <div className="home-content container">
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

        <aside className="home-sidebar">
          <div className="sidebar-card">
            <h3>{t('popularPosts')}</h3>
            {posts.length === 0 ? <div className="empty-state">{t('noPosts')}</div> : (
              <ul className="popular-list">
                {posts.map((post) => (
                  <li key={post.id}><Link to={`/forums/${post.id}`}><span className="popular-dot"></span>{post.title}</Link></li>
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
