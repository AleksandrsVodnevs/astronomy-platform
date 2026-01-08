import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

const CATEGORIES = ['Planētas', 'Galaktikas', 'Kosmoss', 'Astrofizika', 'Novērojumi'];

const CreatePost = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', content: '', category: 'Planētas', status: 'published',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return setError('Virsraksts ir obligāts');
    if (!formData.content.trim()) return setError('Saturs ir obligāts');

    setLoading(true);
    try {
      const res = await createPost(formData);
      navigate(`/forums/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.message || 'Kļūda veidojot ierakstu');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '700px' }}>
      <div className="page-header">
        <h1>Jauns ieraksts</h1>
        <p>Dalies savās astronomijas zināšanās</p>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Virsraksts</label>
            <input
              type="text"
              name="title"
              placeholder="Ieraksta virsraksts"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Kategorija</label>
            <select name="category" value={formData.category} onChange={handleChange}>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Saturs</label>
            <textarea
              name="content"
              placeholder="Rakstiet ieraksta saturu..."
              value={formData.content}
              onChange={handleChange}
              rows={8}
              required
            />
          </div>

          <div className="form-group">
            <label>Statuss</label>
            <select name="status" value={formData.status} onChange={handleChange}>
              <option value="published">Publicēts</option>
              <option value="draft">Melnraksts</option>
            </select>
          </div>

          {error && <div className="form-error">{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saglabā...' : 'Publicēt ierakstu'}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate('/forums')}>
              Atcelt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePost;