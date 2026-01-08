import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews, getPosts } from '../services/api';
import './Home.css';

const Home = () => {
  const [news, setNews] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getNews(), getPosts()])
      .then(([newsRes, postsRes]) => {
        setNews(newsRes.data.slice(0, 5));
        setPosts(postsRes.data.slice(0, 5));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('lv-LV', {
      year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  if (loading) return <div className="loading">Ielādē...</div>;

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Astronomijas izglītības platforma
          </h1>
          <p className="hero-subtitle">
            Izpēti Visumu, dalies zināšanās un pievienojies astronomijas entuziastu kopienai Latvijā
          </p>
          <div className="hero-buttons">
            <Link to="/forums" className="btn btn-primary">Doties uz forumu</Link>
            <Link to="/zinas" className="btn btn-secondary">Jaunākās ziņas</Link>
          </div>
        </div>
        <div className="hero-image">
          <div className="hero-planet"></div>
          <div className="stars">
            {[...Array(40)].map((_, i) => (
              <div key={i} className="star" style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                width: `${Math.random() * 3 + 1}px`,
                height: `${Math.random() * 3 + 1}px`,
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Main content */}
      <div className="home-content container">
        {/* Left: News */}
        <section className="home-news">
          <div className="section-header">
            <h2>Jaunākās ziņas</h2>
            <Link to="/zinas" className="see-all">Skatīt visas →</Link>
          </div>
          {news.length === 0 ? (
            <div className="empty-state">Nav ziņu</div>
          ) : (
            <div className="news-list">
              {news.map((item) => (
                <Link to={`/zinas/${item.id}`} key={item.id} className="news-card">
                  <div className="news-icon">📡</div>
                  <div className="news-body">
                    <h3>{item.title}</h3>
                    <span className="news-date">{formatDate(item.createdAt)}</span>
                    <p>{item.content.substring(0, 100)}...</p>
                  </div>
                  <span className="news-arrow">→</span>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Right sidebar */}
        <aside className="home-sidebar">
          {/* Popular posts */}
          <div className="sidebar-card">
            <h3>Populārākie raksti</h3>
            {posts.length === 0 ? (
              <div className="empty-state">Nav rakstu</div>
            ) : (
              <ul className="popular-list">
                {posts.map((post) => (
                  <li key={post.id}>
                    <Link to={`/forums/${post.id}`}>
                      <span className="popular-dot">●</span>
                      {post.title}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Forum topics */}
          <div className="sidebar-card">
            <h3>Foruma tēmas</h3>
            <ul className="topics-list">
              {['Planētas', 'Galaktikas', 'Kosmoss', 'Astrofizika', 'Novērojumi'].map((topic) => (
                <li key={topic}>
                  <Link to={`/forums?category=${topic}`}>
                    <span className="topic-icon">🔭</span>
                    {topic}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Home;