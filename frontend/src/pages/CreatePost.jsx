import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';
import { useLang } from '../context/LanguageContext';
import { CATEGORIES_LV, translateCategory } from '../utils/categoryUtils';
import ImageUpload from '../components/ImageUpload';



const CreatePost = () => {
  const navigate = useNavigate();
  const { t, lang } = useLang();
  const [formData, setFormData] = useState({ title: '', content: '', category: 'Planētas', status: 'published' });
  const [imageUrl, setImageUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => { setFormData({ ...formData, [e.target.name]: e.target.value }); setError(''); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError(lang === 'en' ? 'Title is required' : 'Virsraksts ir obligāts');
    if (!formData.content.trim()) return setError(lang === 'en' ? 'Content is required' : 'Saturs ir obligāts');
    setLoading(true);
    try {
      const res = await createPost({ ...formData, imageUrl });
      navigate(`/forums/${res.data.id}`);
    }
    catch (err) { setError(err.response?.data?.message || 'Kļūda'); }
    finally { setLoading(false); }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '740px' }}>
      <div className="page-header">
        <h1>{t('newPost')}</h1>
        <p>{t('forumSubtitle')}</p>
      </div>
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t('title')}</label>
            <input type="text" name="title" placeholder={lang === 'en' ? 'Post title' : 'Ieraksta virsraksts'} value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t('category')}</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES_LV.map((cat) => <option key={cat} value={cat}>{translateCategory(cat, lang)}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>{t('content')}</label>
            <textarea name="content" placeholder={lang === 'en' ? 'Write your post content...' : 'Rakstiet ieraksta saturu...'} value={formData.content} onChange={handleChange} rows={8} required />
          </div>
          <div className="form-group">
            <label>{lang === 'en' ? 'Image' : 'Attēls'}</label>
            <ImageUpload
              onUpload={setImageUrl}
              currentImage={imageUrl}
              label={lang === 'en' ? 'Add image (optional)' : 'Pievienot attēlu (neobligāts)'}
            />
          </div>
          <div className="form-group">
            <label>{lang === 'en' ? 'Status' : 'Statuss'}</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="published">{lang === 'en' ? 'Published' : 'Publicēts'}</option>
              <option value="draft">{lang === 'en' ? 'Draft' : 'Melnraksts'}</option>
            </select>
          </div>
          {error && <div className="form-error">{error}</div>}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? t('saving') : (lang === 'en' ? 'Publish Post' : 'Publicēt ierakstu')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/forums')}>
              {lang === 'en' ? 'Cancel' : 'Atcelt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default CreatePost;
