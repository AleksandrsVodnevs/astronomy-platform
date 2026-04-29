import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost, createComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = () => {
    getPost(id)
      .then((res) => setPost(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPost(); }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm('Vai tiešām dzēst šo ierakstu?')) return;
    try {
      await deletePost(id);
      navigate('/forums');
    } catch {
      alert('Kļūda dzēšot ierakstu');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return setCommentError('Komentārs nevar būt tukšs');
    if (comment.length > 500) return setCommentError('Komentārs nevar pārsniegt 500 rakstzīmes');

    setSubmitting(true);
    try {
      await createComment({ content: comment, postId: parseInt(id) });
      setComment('');
      setCommentError('');
      fetchPost();
    } catch (err) {
      setCommentError(err.response?.data?.message || 'Kļūda pievienojot komentāru');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Dzēst komentāru?')) return;
    try {
      await deleteComment(commentId);
      fetchPost();
    } catch {
      alert('Kļūda dzēšot komentāru');
    }
  };

  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString('lv-LV', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  if (loading) return <div className="loading">Ielādē...</div>;
  if (!post) return <div className="error">Ieraksts nav atrasts</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>
      <Link to="/forums" style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>← Atpakaļ uz forumu</Link>

      {/* Post */}
      <div className="card" style={{ marginTop: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{
              background: 'rgba(79,142,247,0.15)', color: 'var(--accent)',
              borderRadius: '20px', padding: '0.15rem 0.7rem', fontSize: '0.8rem', fontWeight: 600
            }}>{post.category}</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {post.author?.firstName} {post.author?.lastName} · {formatDate(post.createdAt)}
            </span>
          </div>
          {(user?.id === post.authorId || user?.role === 'admin') && (
            <button className="btn btn-danger btn-sm" onClick={handleDeletePost}>Dzēst</button>
          )}
        </div>

        <h1 style={{ fontSize: '1.7rem', marginBottom: '1.5rem', lineHeight: '1.3' }}>{post.title}</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>
          {post.content}
        </div>
      </div>

      {/* Comments */}
      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.2rem' }}>
          Komentāri ({post.Comments?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <textarea
                placeholder="Rakstiet komentāru... (maks. 500 rakstzīmes)"
                value={comment}
                onChange={(e) => { setComment(e.target.value); setCommentError(''); }}
                rows={3}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.4rem' }}>
                {commentError && <span className="form-error">{commentError}</span>}
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
                  {comment.length}/500
                </span>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saglabā...' : 'Pievienot komentāru'}
            </button>
          </form>
        ) : (
          <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <Link to="/pieteikties">Pieteikties</Link>, lai pievienotu komentāru
          </div>
        )}

        {post.Comments?.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '1rem' }}>
            Pagaidām nav komentāru. Esi pirmais!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {post.Comments.map((c) => (
              <div key={c.id} className="card" style={{ padding: '1rem 1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                    {c.author?.firstName} {c.author?.lastName}
                  </span>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {formatDate(c.createdAt)}
                    </span>
                    {(user?.id === c.authorId || user?.role === 'admin') && (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleDeleteComment(c.id)}
                        style={{ padding: '0.2rem 0.6rem', fontSize: '0.78rem' }}
                      >Dzēst</button>
                    )}
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  {c.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostDetail;