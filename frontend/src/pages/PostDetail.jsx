import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost, createComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import { translateCategory } from '../utils/categoryUtils';
import Avatar from '../components/Avatar';
import ImageUpload from '../components/ImageUpload';

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { t, lang } = useLang();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [commentImage, setCommentImage] = useState('');
  const [showImageUpload, setShowImageUpload] = useState(false);
  const [commentError, setCommentError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = () => {
    getPost(id).then((res) => setPost(res.data)).catch(console.error).finally(() => setLoading(false));
  };
  useEffect(() => { fetchPost(); }, [id]);

  const handleDeletePost = async () => {
    if (!window.confirm(lang === 'en' ? 'Delete this post?' : 'Dzēst šo ierakstu?')) return;
    try { await deletePost(id); navigate('/forums'); } catch { alert('Kļūda'); }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!comment.trim() && !commentImage) return setCommentError(lang === 'en' ? 'Comment cannot be empty' : 'Komentārs nevar būt tukšs');
    if (comment.length > 500) return setCommentError(lang === 'en' ? 'Max 500 characters' : 'Maks. 500 rakstzīmes');
    setSubmitting(true);
    try {
      await createComment({ content: comment, postId: parseInt(id), imageUrl: commentImage });
      setComment('');
      setCommentImage('');
      setShowImageUpload(false);
      setCommentError('');
      fetchPost();
    }
    catch (err) { setCommentError(err.response?.data?.message || 'Kļūda'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (cId) => {
    if (!window.confirm(lang === 'en' ? 'Delete comment?' : 'Dzēst komentāru?')) return;
    try { await deleteComment(cId); fetchPost(); } catch { alert('Kļūda'); }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!post) return <div className="error">{lang === 'en' ? 'Post not found' : 'Ieraksts nav atrasts'}</div>;

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '3rem', maxWidth: '800px' }}>
      <Link to="/forums" style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>{t('backToForum')}</Link>

      <div className="card" style={{ marginTop: '1.2rem' }}>
        {post.imageUrl && (
          <div style={{ margin: '-1.5rem -1.5rem 1.5rem', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
            <img src={post.imageUrl} alt={post.title} style={{ width: '100%', maxHeight: '420px', objectFit: 'cover', display: 'block' }} />
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ background: 'rgba(79,142,247,0.12)', color: 'var(--accent)', borderRadius: '20px', padding: '0.12rem 0.65rem', fontSize: '0.78rem', fontWeight: 600 }}>{translateCategory(post.category, lang)}</span>
            <Link to={`/profils/${post.author?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
              <Avatar user={post.author} size={24} />
              {post.author?.firstName} {post.author?.lastName}
            </Link>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{timeAgo(post.createdAt, lang)}</span>
          </div>
          {(user?.id === post.authorId || user?.role === 'admin') && (
            <button className="btn btn-danger btn-sm" onClick={handleDeletePost}>{t('delete')}</button>
          )}
        </div>
        <h1 style={{ fontSize: '1.6rem', marginBottom: '1.2rem', lineHeight: '1.35' }}>{post.title}</h1>
        <div style={{ color: 'var(--text-secondary)', lineHeight: '1.8', whiteSpace: 'pre-wrap', fontSize: '0.97rem' }}>{post.content}</div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: '1.2rem', fontWeight: 600 }}>
          {t('comments')} ({post.Comments?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleAddComment} style={{ marginBottom: '1.5rem' }}>
            <div className="form-group">
              <textarea
                placeholder={t('commentPlaceholder')}
                value={comment}
                onChange={(e) => { setComment(e.target.value); setCommentError(''); }}
                rows={3}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
                {commentError && <span className="form-error">{commentError}</span>}
                <span style={{ fontSize: '0.78rem', color: comment.length > 450 ? 'var(--warning)' : 'var(--text-muted)', marginLeft: 'auto' }}>
                  {comment.length}/500
                </span>
              </div>
            </div>

            {showImageUpload && (
              <div className="form-group">
                <ImageUpload
                  onUpload={setCommentImage}
                  currentImage={commentImage}
                  label={lang === 'en' ? 'Add image to comment' : 'Pievienot attēlu komentāram'}
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? t('saving') : t('addComment')}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => { setShowImageUpload(!showImageUpload); if (showImageUpload) setCommentImage(''); }}
              >
                {showImageUpload
                  ? (lang === 'en' ? 'Remove image' : 'Noņemt attēlu')
                  : (lang === 'en' ? '+ Add image' : '+ Pievienot attēlu')
                }
              </button>
            </div>
          </form>
        ) : (
          <div className="card" style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            <Link to="/pieteikties">{t('login')}</Link>{' '}{t('loginToComment')}
          </div>
        )}

        {post.Comments?.length === 0 ? (
          <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem', textAlign: 'center', padding: '1.5rem' }}>
            {t('noCommentsYet')}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.7rem' }}>
            {post.Comments.map((c) => (
              <div key={c.id} className="card" style={{ padding: '1rem 1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center' }}>
                  <Link to={`/profils/${c.author?.id}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--text-primary)' }}>
                    <Avatar user={c.author} size={28} />
                    <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>{c.author?.firstName} {c.author?.lastName}</span>
                  </Link>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{timeAgo(c.createdAt, lang)}</span>
                    {(user?.id === c.authorId || user?.role === 'admin') && (
                      <button className="btn btn-danger btn-sm" onClick={() => handleDeleteComment(c.id)} style={{ padding: '0.15rem 0.5rem', fontSize: '0.76rem' }}>
                        {t('delete')}
                      </button>
                    )}
                  </div>
                </div>
                {c.content && (
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: c.imageUrl ? '0.8rem' : 0 }}>
                    {c.content}
                  </p>
                )}
                {c.imageUrl && (
                  <img
                    src={c.imageUrl}
                    alt="comment attachment"
                    style={{ maxWidth: '100%', maxHeight: '400px', borderRadius: '8px', objectFit: 'contain', display: 'block' }}
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default PostDetail;
