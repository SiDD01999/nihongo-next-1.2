import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { ArrowLeft, Save, Loader2, Eye, ImagePlus, Trash2, Bold, Italic, Strikethrough, Heading1, Heading2, Heading3, List, ListOrdered, Quote, Code, Minus, Link2, Table, Superscript } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createPost, updatePost, getPost, deletePost, uploadImage } from '@/lib/api';

const CATEGORIES = [
  { label: 'Grammar', value: 'grammar' },
  { label: 'Culture', value: 'culture' },
  { label: 'Vocabulary', value: 'vocabulary' },
  { label: 'Kanji', value: 'kanji' },
];

// ─── Toolbar formatting actions ────────────────────────────────────────────────
const TOOLBAR_GROUPS = [
  {
    label: 'Text Style',
    items: [
      { icon: Bold, label: 'Bold', prefix: '**', suffix: '**', placeholder: 'bold text' },
      { icon: Italic, label: 'Italic', prefix: '*', suffix: '*', placeholder: 'italic text' },
      { icon: Strikethrough, label: 'Strikethrough', prefix: '~~', suffix: '~~', placeholder: 'strikethrough text' },
      { icon: Superscript, label: 'Superscript', prefix: '<sup>', suffix: '</sup>', placeholder: 'superscript' },
      { icon: Code, label: 'Inline Code', prefix: '`', suffix: '`', placeholder: 'code' },
    ],
  },
  {
    label: 'Headings',
    items: [
      { icon: Heading1, label: 'Heading 1', prefix: '# ', suffix: '', placeholder: 'Heading 1', line: true },
      { icon: Heading2, label: 'Heading 2', prefix: '## ', suffix: '', placeholder: 'Heading 2', line: true },
      { icon: Heading3, label: 'Heading 3', prefix: '### ', suffix: '', placeholder: 'Heading 3', line: true },
    ],
  },
  {
    label: 'Lists & Blocks',
    items: [
      { icon: List, label: 'Bullet List', prefix: '- ', suffix: '', placeholder: 'List item', line: true },
      { icon: ListOrdered, label: 'Numbered List', prefix: '1. ', suffix: '', placeholder: 'List item', line: true },
      { icon: Quote, label: 'Blockquote', prefix: '> ', suffix: '', placeholder: 'quote', line: true },
      { icon: Minus, label: 'Divider', insert: '\n---\n', placeholder: '' },
    ],
  },
  {
    label: 'Media & Links',
    items: [
      { icon: Link2, label: 'Link', prefix: '[', suffix: '](url)', placeholder: 'link text' },
      { icon: ImagePlus, label: 'Image', insert: '![alt text](image-url)', placeholder: '' },
      { icon: Table, label: 'Table', insert: '\n| Column 1 | Column 2 | Column 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n', placeholder: '' },
    ],
  },
];

function CodeBlockButton({ onInsert }) {
  return (
    <button
      type="button"
      onClick={onInsert}
      title="Code Block"
      className="p-1.5 sm:p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
    >
      <span className="text-xs font-mono font-bold">&lt;/&gt;</span>
    </button>
  );
}

export function AdminPostEditor() {
  const navigate = useNavigate();
  const { slug } = useParams();
  const isEditing = Boolean(slug);
  const contentRef = useRef(null);

  const [form, setForm] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'grammar',
    tags: '',
    featured: false,
    image: '',
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Check admin access
  const user = (() => {
    try { return JSON.parse(localStorage.getItem('nn_user')); } catch { return null; }
  })();

  useEffect(() => {
    if (!user || user.role !== 'ADMIN') {
      navigate('/blog');
      return;
    }
    if (isEditing) {
      setLoading(true);
      getPost(slug)
        .then(({ data }) => {
          setForm({
            title: data.title || '',
            excerpt: data.excerpt || '',
            content: data.content || '',
            category: data.category || 'grammar',
            tags: (data.tags || []).join(', '),
            featured: data.featured || false,
            image: data.image || '',
          });
        })
        .catch(() => setError('Failed to load post.'))
        .finally(() => setLoading(false));
    }
  }, [slug, isEditing, navigate, user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { data } = await uploadImage(file);
      setForm(prev => ({ ...prev, image: data.url }));
    } catch {
      setError('Failed to upload image. Check that Cloudinary is configured.');
    } finally {
      setUploading(false);
    }
  };

  // ─── Toolbar insert logic ─────────────────────────────────────────────────────
  const insertFormatting = useCallback((action) => {
    const textarea = contentRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd, value } = textarea;
    const selectedText = value.substring(selectionStart, selectionEnd);

    let newValue;
    let newCursorPos;

    if (action.insert) {
      // Direct insert (divider, table, image, code block)
      newValue = value.substring(0, selectionStart) + action.insert + value.substring(selectionEnd);
      newCursorPos = selectionStart + action.insert.length;
    } else if (action.line) {
      // Line-level formatting (headings, lists, quotes)
      const lineStart = value.lastIndexOf('\n', selectionStart - 1) + 1;
      const text = selectedText || action.placeholder;
      newValue = value.substring(0, lineStart) + action.prefix + value.substring(lineStart, selectionStart) + text + action.suffix + value.substring(selectionEnd);
      newCursorPos = lineStart + action.prefix.length + (selectedText ? selectedText.length : 0);
    } else {
      // Inline formatting (bold, italic, etc.)
      const text = selectedText || action.placeholder;
      newValue = value.substring(0, selectionStart) + action.prefix + text + action.suffix + value.substring(selectionEnd);
      if (selectedText) {
        newCursorPos = selectionStart + action.prefix.length + selectedText.length + action.suffix.length;
      } else {
        newCursorPos = selectionStart + action.prefix.length;
      }
    }

    setForm(prev => ({ ...prev, content: newValue }));

    // Restore focus and cursor position
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    });
  }, []);

  const insertCodeBlock = useCallback(() => {
    insertFormatting({ insert: '\n```\ncode here\n```\n', placeholder: '' });
  }, [insertFormatting]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.excerpt || !form.category) {
      setError('Title, excerpt, and category are required.');
      return;
    }
    if (!form.content) {
      setError('Post content is required.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: form.featured,
      image: form.image || null,
    };

    try {
      if (isEditing) {
        await updatePost(slug, payload);
      } else {
        await createPost(payload);
      }
      navigate('/blog');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) return;
    setSaving(true);
    try {
      await deletePost(slug);
      navigate('/blog');
    } catch {
      setError('Failed to delete post.');
    } finally {
      setSaving(false);
    }
  };

  if (!user || user.role !== 'ADMIN') {
    return null;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 w-full max-w-[900px] mx-auto px-4 md:px-6 lg:px-8 pt-24 sm:pt-28 pb-12">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-6 sm:mb-8 animate-fade-in-up">
          <Link to="/blog" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft size={16} />
            <span className="hidden sm:inline">Back to Blog</span>
            <span className="sm:hidden">Back</span>
          </Link>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPreview(!showPreview)}
            >
              <Eye size={15} className="mr-1.5" />
              <span className="hidden sm:inline">{showPreview ? 'Edit' : 'Preview'}</span>
            </Button>
            {isEditing && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={saving}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 size={15} className="sm:mr-1.5" />
                <span className="hidden sm:inline">Delete</span>
              </Button>
            )}
          </div>
        </div>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-6 sm:mb-8 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          {isEditing ? 'Edit Post' : 'Write a New Post'}
        </h1>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : showPreview ? (
          /* Preview Mode */
          <div className="bg-card border border-border rounded-xl p-4 sm:p-6 md:p-8 animate-fade-in-scale">
            {form.image && (
              <div className="w-full aspect-video rounded-xl overflow-hidden mb-6 bg-muted">
                <img src={form.image} alt="" className="w-full h-full object-cover" />
              </div>
            )}
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wide mb-4">
              {form.category}
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-foreground mb-4">{form.title || 'Untitled'}</h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-6">{form.excerpt}</p>
            {form.tags && (
              <div className="flex flex-wrap gap-2 mb-6">
                {form.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                  <span key={tag} className="px-3 py-1 bg-muted rounded-full text-sm text-foreground">{tag}</span>
                ))}
              </div>
            )}
            <div className="prose prose-lg max-w-none">
              {form.content.split('\n').map((line, i) => {
                if (line.startsWith('### ')) return <h3 key={i} className="text-xl font-serif font-bold text-foreground mt-6 mb-3">{line.slice(4)}</h3>;
                if (line.startsWith('## ')) return <h2 key={i} className="text-2xl font-serif font-bold text-primary mt-8 mb-4 pl-4 border-l-4 border-primary">{line.slice(3)}</h2>;
                if (line.startsWith('# ')) return <h1 key={i} className="text-3xl font-serif font-bold text-foreground mt-8 mb-4">{line.slice(2)}</h1>;
                if (line.startsWith('- ')) return <li key={i} className="text-foreground/80 ml-4">{line.slice(2)}</li>;
                if (line.startsWith('> ')) return <blockquote key={i} className="border-l-4 border-primary/30 pl-4 italic text-muted-foreground my-4">{line.slice(2)}</blockquote>;
                if (line.startsWith('---')) return <hr key={i} className="my-6 border-border" />;
                if (line.trim() === '') return <br key={i} />;
                return <p key={i} className="text-foreground/80 leading-relaxed mb-4">{renderInlineFormatting(line)}</p>;
              })}
            </div>
          </div>
        ) : (
          /* Editor Form */
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            {error && (
              <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                {error}
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Title</label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter post title..."
                className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-base sm:text-lg"
              />
            </div>

            {/* Excerpt */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Excerpt</label>
              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                placeholder="Brief description of the post..."
                rows={2}
                className="w-full px-4 py-3 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-y"
              />
            </div>

            {/* Category + Featured */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={form.featured}
                    onChange={handleChange}
                    className="w-5 h-5 rounded border-border text-primary focus:ring-primary/30"
                  />
                  <span className="text-sm font-medium text-foreground">Featured post</span>
                </label>
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Tags (comma-separated)</label>
              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="e.g. particles, grammar, N5"
                className="w-full h-12 px-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Cover Image</label>
              <div className="flex flex-col gap-3">
                {form.image && (
                  <div className="relative w-full max-w-md aspect-video rounded-xl overflow-hidden border border-border">
                    <img src={form.image} alt="Cover" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                  <label className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-card text-sm font-medium text-foreground cursor-pointer hover:bg-muted transition-colors">
                    <ImagePlus size={16} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                  </label>
                  <span className="text-xs text-muted-foreground hidden sm:block">or</span>
                  <input
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Paste image URL..."
                    className="flex-1 w-full sm:w-auto h-10 px-3 rounded-lg border border-border bg-card text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Content with Toolbar */}
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">Content</label>

              {/* Formatting Toolbar */}
              <div className="border border-border border-b-0 rounded-t-xl bg-card px-2 sm:px-3 py-2 flex flex-wrap items-center gap-0.5">
                {TOOLBAR_GROUPS.map((group, gi) => (
                  <React.Fragment key={gi}>
                    {gi > 0 && <div className="w-px h-6 bg-border mx-1 hidden sm:block" />}
                    {group.items.map((action, ai) => (
                      <button
                        key={ai}
                        type="button"
                        onClick={() => insertFormatting(action)}
                        title={action.label}
                        className="p-1.5 sm:p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <action.icon size={16} />
                      </button>
                    ))}
                  </React.Fragment>
                ))}
                <div className="w-px h-6 bg-border mx-1 hidden sm:block" />
                <CodeBlockButton onInsert={insertCodeBlock} />
              </div>

              <textarea
                ref={contentRef}
                name="content"
                value={form.content}
                onChange={handleChange}
                placeholder="Write your blog post content here...&#10;&#10;Use the toolbar above or type markdown:&#10;# Heading 1&#10;## Heading 2&#10;**bold** *italic* ~~strikethrough~~&#10;- Bullet list&#10;> Blockquote"
                rows={20}
                className="w-full px-4 py-3 rounded-b-xl border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all resize-y font-mono text-sm leading-relaxed"
              />
            </div>

            {/* Submit */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4 border-t border-border">
              <Button
                type="submit"
                disabled={saving}
                className="bg-primary text-primary-foreground hover:bg-primary/90 w-full sm:w-auto"
              >
                {saving ? (
                  <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                ) : (
                  <><Save size={16} className="mr-2" /> {isEditing ? 'Update Post' : 'Publish Post'}</>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/blog')}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}

// ─── Inline formatting renderer for preview ──────────────────────────────────
function renderInlineFormatting(text) {
  // Process inline markdown: bold, italic, strikethrough, inline code, links
  const parts = [];
  let remaining = text;
  let key = 0;

  while (remaining.length > 0) {
    // Bold **text**
    let match = remaining.match(/\*\*(.+?)\*\*/);
    if (match && match.index === 0) {
      parts.push(<strong key={key++}>{match[1]}</strong>);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Strikethrough ~~text~~
    match = remaining.match(/~~(.+?)~~/);
    if (match && match.index === 0) {
      parts.push(<del key={key++}>{match[1]}</del>);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Italic *text*
    match = remaining.match(/\*(.+?)\*/);
    if (match && match.index === 0) {
      parts.push(<em key={key++}>{match[1]}</em>);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Inline code `text`
    match = remaining.match(/`(.+?)`/);
    if (match && match.index === 0) {
      parts.push(<code key={key++} className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">{match[1]}</code>);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Link [text](url)
    match = remaining.match(/\[(.+?)\]\((.+?)\)/);
    if (match && match.index === 0) {
      parts.push(<a key={key++} href={match[2]} className="text-primary underline hover:text-primary/80" target="_blank" rel="noopener noreferrer">{match[1]}</a>);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Superscript <sup>text</sup>
    match = remaining.match(/<sup>(.+?)<\/sup>/);
    if (match && match.index === 0) {
      parts.push(<sup key={key++}>{match[1]}</sup>);
      remaining = remaining.slice(match[0].length);
      continue;
    }

    // Find the next special character
    const nextSpecial = remaining.search(/(\*\*|~~|\*|`|\[|<sup>)/);
    if (nextSpecial > 0) {
      parts.push(remaining.substring(0, nextSpecial));
      remaining = remaining.substring(nextSpecial);
    } else {
      parts.push(remaining);
      break;
    }
  }

  return parts.length > 0 ? parts : text;
}
