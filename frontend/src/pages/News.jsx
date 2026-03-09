import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getNews } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import './News.css';

const News = () => {
  const { t, lang } = useLang();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getNews().then((res) => setNews(res.data)).catch(console.error).finally(() => setLoading(false)); }, []);
  if (loading) return <div className="loading">{t('loading')}</div>;

  const [featured, ...rest] = news;

  return (
    <div className="container news-page">
      <div className="page-header">
        <h1>{t('newsTitle')}</h1>
        <p>{t('newsSubtitle')}</p>
      </div>

      {news.length === 0 ? (
        <div className="news-empty">{t('noNewsYet')}</div>
      ) : (
        <>
          <Link to={`/zinas/${featured.id}`} className="news-featured">
            {featured.imageUrl && (
              <div className="news-featured-img" style={{ backgroundImage: `url(${featured.imageUrl})` }} />
            )}
            <div className="news-featured-body">
              <span className="news-featured-label">{lang === 'en' ? 'Latest' : 'Jaunākais'}</span>
              <h2 className="news-featured-title">{featured.title}</h2>
              <p className="news-featured-excerpt">{featured.content.substring(0, 220)}...</p>
              <div className="news-featured-footer">
                <span className="news-featured-date">{timeAgo(featured.createdAt, lang)}</span>
                <span className="news-featured-cta">{t('readMore')}</span>
              </div>
            </div>
          </Link>

          {rest.length > 0 && (
            <div className="news-grid">
              {rest.map((item) => (
                <Link to={`/zinas/${item.id}`} key={item.id} className="news-card">
                  <div className="news-card-img-wrap">
                    {item.imageUrl
                      ? <img src={item.imageUrl} alt={item.title} className="news-card-img" />
                      : <div className="news-card-placeholder" />}
                  </div>
                  <div className="news-card-body">
                    <span className="news-card-date">{timeAgo(item.createdAt, lang)}</span>
                    <h3 className="news-card-title">{item.title}</h3>
                    <p className="news-card-excerpt">{item.content.substring(0, 115)}...</p>
                    {item.sourceUrl && (
                      <span className="news-card-source">
                        {item.sourceUrl.replace(/^https?:\/\//, '').split('/')[0]}
                      </span>
                    )}
                    <span className="news-card-cta">{t('readMore')}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};
export default News;
