import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, ThumbsUp, ChevronRight, Loader2, Share2, Link2, Check, PenSquare, Trash2 } from 'lucide-react';
import { getPost, getPosts, addComment, likeComment, deletePost } from '@/lib/api';

// ─── Render post content with simple markdown-like formatting ─────────────────
function PostContent({ content }) {
  if (!content) return null;

  const lines = content.split('\n');

  return (
    <div className="prose prose-lg max-w-none">
      {lines.map((line, i) => {
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-xl font-serif font-bold text-foreground mt-8 mb-3">{line.slice(4)}</h3>;
        }
        if (line.startsWith('## ')) {
          return (
            <h2 key={i} className="text-2xl font-serif font-bold text-primary mt-10 mb-4 pl-4 border-l-4 border-primary">
              {line.slice(3)}
            </h2>
          );
        }
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-3xl font-serif font-bold text-foreground mt-10 mb-4">{line.slice(2)}</h1>;
        }
        if (line.startsWith('- ')) {
          return (
            <li key={i} className="flex items-start gap-3 mb-2">
              <span className="text-primary font-bold text-lg leading-tight mt-0.5">-</span>
              <span className="text-foreground/80">{line.slice(2)}</span>
            </li>
          );
        }
        if (line.trim() === '') return <div key={i} className="h-4" />;
        return <p key={i} className="text-foreground/80 leading-relaxed mb-4">{line}</p>;
      })}
    </div>
  );
}

// ─── Share button ────────────────────────────────────────────────────────────
function ShareButton({ title }) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Try native share API (mobile)
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // User cancelled or not supported, fall through to clipboard
      }
    }

    // Fallback: copy URL to clipboard
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = url;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground transition-colors"
    >
      {copied ? (
        <>
          <Check size={15} className="text-green-600" />
          <span className="text-green-600">Link Copied!</span>
        </>
      ) : (
        <>
          <Share2 size={15} />
          Share
        </>
      )}
    </button>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function BlogPostPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const user = (() => {
    try { return JSON.parse(localStorage.getItem('nn_user')); } catch { return null; }
  })();

  const isAdmin = user?.role === 'ADMIN';

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const [postRes, postsRes] = await Promise.all([
          getPost(slug),
          getPosts(),
        ]);
        setPost(postRes.data);
        setComments(postRes.data.comments || []);
        setRelated(postsRes.data.filter((p) => p.slug !== slug).slice(0, 3));
      } catch (err) {
        setError('Failed to load post. Please try again.');
        console.error('Fetch post error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const handleComment = async () => {
    if (!commentText.trim()) return;
    if (!user) return;
    setSubmitting(true);
    try {
      const { data } = await addComment(slug, {
        text: commentText,
        name: user.name,
      });
      setComments([...comments, data]);
      setCommentText('');
    } catch (err) {
      console.error('Comment error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (commentId) => {
    try {
      const { data } = await likeComment(slug, commentId);
      setComments(comments.map((c) => c.id === commentId ? { ...c, likes: data.likes } : c));
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(slug);
      navigate('/blog');
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center flex-col gap-4">
          <p className="text-red-500 text-lg">{error || 'Post not found.'}</p>
          <Link to="/blog" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium">
            Back to Blog
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 md:px-6 lg:px-8 pt-28 pb-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-sm text-muted-foreground mb-8">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={14} />
          <Link to="/blog" className="hover:text-primary transition-colors">Blog</Link>
          <ChevronRight size={14} />
          <span className="text-primary font-medium capitalize">{post.category}</span>
        </nav>

        <article className="flex flex-col items-center">
          {/* Article Header */}
          <header className="w-full max-w-[800px] text-center mb-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-4 border border-primary/20">
              {post.category}
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-black text-foreground leading-tight tracking-tight mb-6">
              {post.title}
            </h1>
            <p className="text-muted-foreground text-lg md:text-xl leading-relaxed mb-6 font-light">
              {post.excerpt}
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4 text-sm text-muted-foreground border-t border-b border-border py-4 w-full">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  {post.author.split(' ').map(n => n[0]).join('')}
                </div>
                <span className="font-medium text-foreground">{post.author}</span>
              </div>
              <span className="w-1 h-1 bg-border rounded-full hidden sm:block" />
              <span className="flex items-center gap-1.5"><Calendar size={14} />{post.date}</span>
              <span className="w-1 h-1 bg-border rounded-full hidden sm:block" />
              <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime}</span>
            </div>

            {/* Share + Admin actions */}
            <div className="flex items-center justify-center gap-3 mt-4">
              <ShareButton title={post.title} />
              {isAdmin && (
                <>
                  <Link
                    to={`/admin/posts/${post.slug}/edit`}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-card hover:bg-muted text-sm font-medium text-foreground transition-colors"
                  >
                    <PenSquare size={15} /> Edit
                  </Link>
                  <button
                    onClick={handleDelete}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg border border-red-200 bg-card hover:bg-red-50 text-sm font-medium text-red-600 transition-colors"
                  >
                    <Trash2 size={15} /> Delete
                  </button>
                </>
              )}
            </div>
          </header>

          {/* Hero Image */}
          {post.image && (
            <div className="w-full max-w-[960px] mb-12 rounded-2xl overflow-hidden shadow-lg border border-border">
              <div
                className="aspect-video w-full bg-cover bg-center"
                style={{ backgroundImage: `url('${post.image}')` }}
              />
            </div>
          )}

          {/* Article Content — dynamic rendering */}
          <div className="w-full max-w-[720px]">
            <PostContent content={post.content} />
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="w-full max-w-[720px] flex flex-wrap gap-2 mb-12 border-t border-border pt-6">
              <span className="text-sm font-medium text-muted-foreground py-1">Tags:</span>
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  to="/blog"
                  className="px-3 py-1 bg-muted hover:bg-muted/80 hover:text-primary rounded-full text-sm text-foreground transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author Bio */}
          <div className="w-full max-w-[800px] bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start mb-16">
            <div className="w-20 h-20 flex-shrink-0 rounded-full bg-primary/10 ring-4 ring-background shadow-sm flex items-center justify-center text-primary font-bold text-2xl">
              {post.author.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h3 className="text-lg font-serif font-bold text-foreground">{post.author}</h3>
                <span className="hidden md:block text-primary/40 text-xs">-</span>
                <span className="text-primary text-sm font-bold uppercase tracking-wider">Author</span>
              </div>
              <Link
                to="/blog"
                className="text-primary hover:text-primary/80 text-sm font-bold flex items-center justify-center md:justify-start gap-1 group"
              >
                View all posts by {post.author.split(' ')[0]}
                <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
              </Link>
            </div>
          </div>

          {/* Comments */}
          <div className="w-full max-w-[800px] mb-16">
            <h3 className="text-xl font-serif font-bold text-foreground mb-6 flex items-center gap-2">
              Discussion
              <span className="bg-muted text-muted-foreground text-xs px-2 py-0.5 rounded-full">{comments.length}</span>
            </h3>

            {/* New comment — requires login */}
            {user ? (
              <div className="flex gap-4 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold flex-shrink-0 text-sm">
                  {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <textarea
                    className="w-full bg-card border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none min-h-[100px] resize-y mb-2 placeholder:text-muted-foreground transition-all"
                    placeholder="Ask a question or share your thoughts..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-muted-foreground">Commenting as <strong>{user.name}</strong></span>
                    <button
                      onClick={handleComment}
                      disabled={submitting || !commentText.trim()}
                      className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm disabled:opacity-60"
                    >
                      {submitting ? 'Posting...' : 'Post Comment'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-3 py-8 mb-8 bg-muted/50 rounded-xl border border-border">
                <p className="text-muted-foreground text-sm">Log in to join the discussion</p>
                <div className="flex gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 border border-border rounded-lg text-sm font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            )}

            {/* Comment list */}
            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id}>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex-shrink-0 flex items-center justify-center text-sm font-bold text-muted-foreground">
                      {c.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted/50 rounded-xl p-4 mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-foreground text-sm">{c.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {c.time ? new Date(c.time).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <p className="text-foreground/80 text-sm whitespace-pre-wrap">{c.text}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button
                          onClick={() => handleLike(c.id)}
                          className="flex items-center gap-1 hover:text-primary transition-colors"
                        >
                          <ThumbsUp size={13} /> {c.likes}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {comments.length === 0 && (
                <p className="text-center text-muted-foreground text-sm py-8">No comments yet. Be the first to share your thoughts!</p>
              )}
            </div>
          </div>

          {/* Keep Learning — Related Articles */}
          {related.length > 0 && (
            <div className="w-full max-w-[960px] border-t border-border pt-12">
              <div className="flex justify-between items-end mb-6">
                <div>
                  <h3 className="text-xl font-serif font-bold text-foreground mb-1">Keep Learning</h3>
                  <p className="text-muted-foreground text-sm">Related articles chosen for you</p>
                </div>
                <Link to="/blog" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline group">
                  View all
                  <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                </Link>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                {related.map((item) => (
                  <Link key={item.slug} to={`/blog/${item.slug}`} className="group block">
                    <div className="w-full aspect-[4/3] rounded-xl bg-muted mb-4 overflow-hidden relative shadow-sm">
                      {item.image && (
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${item.image}')` }}
                        />
                      )}
                      <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-foreground border border-border">
                        {item.category}
                      </div>
                    </div>
                    <h4 className="font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs text-muted-foreground">By {item.author} - {item.readTime}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>

      <Footer />
    </div>
  );
}
