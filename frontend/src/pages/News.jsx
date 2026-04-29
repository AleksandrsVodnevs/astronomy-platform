import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/api';
import './News.css';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getNews()
      .then((res) => setNews(res.data))
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
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem' }}>
      <div className="page-header">
        <h1>Ziņas</h1>
        <p>Jaunākie notikumi astronomijas pasaulē</p>
      </div>

      {news.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
          Pagaidām nav ziņu
        </div>
      ) : (
        <div className="news-grid">
          {news.map((item) => (
            <Link to={`/zinas/${item.id}`} key={item.id} className="news-item">
              <div className="news-item-header">
                <span className="news-item-icon">📡</span>
                <span className="news-item-date">{formatDate(item.createdAt)}</span>
              </div>
              <h2>{item.title}</h2>
              <p>{item.content.substring(0, 150)}...</p>
              {item.sourceUrl && (
                <span className="news-source">Avots: {item.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}</span>
              )}
              <span className="news-read-more">Lasīt vairāk →</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;