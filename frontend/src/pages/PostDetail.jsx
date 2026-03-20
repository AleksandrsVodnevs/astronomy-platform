import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getPost, deletePost, createComment, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useLang } from '../context/LanguageContext';
import { timeAgo } from '../utils/timeAgo';
import { translateCategory } from '../utils/categoryUtils';
import Avatar from '../components/Avatar';
import ImageUpload from '../components/ImageUpload';
import './PostDetail.css';

const CAT_COLORS = {
  'Planētas':    '#4f8ef7',
  'Galaktikas':  '#8b5cf6',
  'Kosmoss':     '#06b6d4',
  'Astrofizika': '#f59e0b',
  'Novērojumi':  '#10b981',
};

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
      setComment(''); setCommentImage(''); setShowImageUpload(false); setCommentError('');
      fetchPost();
    } catch (err) { setCommentError(err.response?.data?.message || 'Kļūda'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (cId) => {
    if (!window.confirm(lang === 'en' ? 'Delete comment?' : 'Dzēst komentāru?')) return;
    try { await deleteComment(cId); fetchPost(); } catch { alert('Kļūda'); }
  };

  if (loading) return <div className="loading">{t('loading')}</div>;
  if (!post) return <div className="error">{lang === 'en' ? 'Post not found' : 'Ieraksts nav atrasts'}</div>;

  const catColor = CAT_COLORS[post.category] || 'var(--accent)';
  const commentCount = post.Comments?.length || 0;

  return (
    <div className="pd-page container">

      {/* Back */}
      <Link to="/forums" className="pd-back">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 5l-7 7 7 7"/></svg>
        {t('backToForum')}
      </Link>

      {/* Post */}
      <article className="pd-post">
        <header className="pd-post-header">
          <Link to={`/profils/${post.author?.id}`} className="pd-author-link">
            <Avatar user={post.author} size={36} />
            <div className="pd-author-info">
              <span className="pd-author-name">{post.author?.firstName} {post.author?.lastName}</span>
              <span className="pd-author-time">{timeAgo(post.createdAt, lang)}</span>
            </div>
          </Link>
          <span
            className="pd-cat-badge"
            style={{ background: `${catColor}1a`, color: catColor }}
          >
            {translateCategory(post.category, lang)}
          </span>
          {(user?.id === post.authorId || user?.role === 'admin') && (
            <button className="btn btn-danger btn-sm pd-delete-btn" onClick={handleDeletePost}>{t('delete')}</button>
          )}
        </header>

        {post.imageUrl && (
          <img src={post.imageUrl} alt={post.title} className="pd-post-img" />
        )}

        <h1 className="pd-post-title">{post.title}</h1>
        <div className="pd-post-content">{post.content}</div>

        <div className="pd-post-footer">
          <span className="pd-stat">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            {commentCount} {lang === 'en' ? 'comments' : 'komentāri'}
          </span>
        </div>
      </article>

      {/* Comments */}
      <section className="pd-comments">
        <div className="pd-comments-heading">
          <h2>{t('comments')}</h2>
          <span className="pd-comments-count">{commentCount}</span>
        </div>

        {/* Comment form */}
        {user ? (
          <form onSubmit={handleAddComment} className="pd-comment-form">
            <div className="pd-form-header">
              <Avatar user={user} size={30} />
              <span className="pd-form-label">{lang === 'en' ? 'Write a comment…' : 'Rakstīt komentāru…'}</span>
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <textarea
                placeholder={t('commentPlaceholder')}
                value={comment}
                onChange={(e) => { setComment(e.target.value); setCommentError(''); }}
                rows={3}
              />
            </div>
            {showImageUpload && (
              <div className="form-group" style={{ marginTop: '0.7rem', marginBottom: 0 }}>
                <ImageUpload
                  onUpload={setCommentImage}
                  currentImage={commentImage}
                  label={lang === 'en' ? 'Add image to comment' : 'Pievienot attēlu komentāram'}
                />
              </div>
            )}
            <div className="pd-form-actions">
              <span className="pd-char-count" style={{ color: comment.length > 450 ? 'var(--warning)' : 'var(--text-muted)' }}>
                {comment.length}/500
              </span>
              {commentError && <span className="form-error" style={{ marginLeft: 0 }}>{commentError}</span>}
              <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setShowImageUpload(!showImageUpload); if (showImageUpload) setCommentImage(''); }}
                >
                  {showImageUpload ? (lang === 'en' ? 'Remove image' : 'Noņemt attēlu') : (lang === 'en' ? '+ Image' : '+ Attēls')}
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={submitting}>
                  {submitting ? t('saving') : t('addComment')}
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="pd-login-prompt">
            <Link to="/pieteikties">{t('login')}</Link>{' '}{t('loginToComment')}
          </div>
        )}

        {/* Comments list */}
        {commentCount === 0 ? (
          <div className="pd-no-comments">{t('noCommentsYet')}</div>
        ) : (
          <div className="pd-comments-list">
            {post.Comments.map((c) => (
              <div key={c.id} className="pd-comment">
                <div className="pd-comment-avatar">
                  <Avatar user={c.author} size={32} />
                </div>
                <div className="pd-comment-body">
                  <div className="pd-comment-header">
                    <Link to={`/profils/${c.author?.id}`} className="pd-comment-author">
                      {c.author?.firstName} {c.author?.lastName}
                    </Link>
                    <span className="pd-comment-time">{timeAgo(c.createdAt, lang)}</span>
                    {(user?.id === c.authorId || user?.role === 'admin') && (
                      <button
                        className="pd-comment-delete"
                        onClick={() => handleDeleteComment(c.id)}
                      >
                        {t('delete')}
                      </button>
                    )}
                  </div>
                  {c.content && <p className="pd-comment-text">{c.content}</p>}
                  {c.imageUrl && (
                    <img src={c.imageUrl} alt="attachment" className="pd-comment-img" />
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
export default PostDetail;
