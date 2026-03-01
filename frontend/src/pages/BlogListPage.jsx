import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Search, Clock, Calendar, ChevronRight, BookOpen, TrendingUp, Mail, Loader2 } from 'lucide-react';
import { getPosts } from '@/lib/api';

const CATEGORIES = [
  { label: 'All Posts', value: 'all' },
  { label: 'Grammar', value: 'grammar' },
  { label: 'Culture', value: 'culture' },
  { label: 'Vocabulary', value: 'vocabulary' },
  { label: 'Kanji', value: 'kanji' },
];

const CATEGORY_COLORS = {
  grammar: 'bg-red-100 text-red-700',
  culture: 'bg-purple-100 text-purple-700',
  vocabulary: 'bg-blue-100 text-blue-700',
  kanji: 'bg-amber-100 text-amber-700',
};

export function BlogListPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      try {
        const params = {};
        if (activeCategory !== 'all') params.category = activeCategory;
        if (searchQuery) params.search = searchQuery;
        const { data } = await getPosts(params);
        setPosts(data);
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Fetch posts error:', err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchPosts, searchQuery ? 300 : 0);
    return () => clearTimeout(debounce);
  }, [activeCategory, searchQuery]);

  const featured = posts.find((p) => p.featured);
  const rest = posts.filter((p) => !p.featured);
  const trending = posts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Page Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-b from-primary/5 to-background border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider mb-4">
            <BookOpen size={14} />
            The Nihongo Next Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
            Learn Japanese, <span className="text-primary">One Article at a Time</span>
          </h1>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Grammar guides, cultural insights, vocabulary tips, and JLPT prep — all written by expert instructors.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  activeCategory === cat.value
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="text-center py-20">
                <p className="text-red-500 text-lg mb-4">{error}</p>
                <button
                  onClick={() => setActiveCategory(activeCategory)}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Featured Article */}
            {!loading && !error && featured && (
              <Link to={`/blog/${featured.slug}`} className="group block mb-10">
                <div className="rounded-2xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
                  <div
                    className="w-full aspect-[16/7] bg-cover bg-center group-hover:scale-[1.02] transition-transform duration-500"
                    style={{ backgroundImage: `url('${featured.image}')` }}
                  />
                  <div className="p-6 md:p-8">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${CATEGORY_COLORS[featured.category]}`}>
                        {featured.category}
                      </span>
                      <span className="text-xs bg-primary/10 text-primary font-bold px-2.5 py-0.5 rounded-full">Featured</span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground group-hover:text-primary transition-colors mb-3">
                      {featured.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed mb-4">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">{featured.author}</span>
                      <span className="flex items-center gap-1"><Calendar size={13} />{featured.date}</span>
                      <span className="flex items-center gap-1"><Clock size={13} />{featured.readTime}</span>
                    </div>
                  </div>
                </div>
              </Link>
            )}

            {/* Article Grid */}
            {!loading && !error && <div className="grid sm:grid-cols-2 gap-6">
              {rest.map((post) => (
                <Link key={post.slug} to={`/blog/${post.slug}`} className="group block">
                  <div className="rounded-xl overflow-hidden border border-border bg-card shadow-sm hover:shadow-md transition-all h-full flex flex-col">
                    <div
                      className="w-full aspect-[4/3] bg-cover bg-center group-hover:scale-[1.03] transition-transform duration-500"
                      style={{ backgroundImage: `url('${post.image}')` }}
                    />
                    <div className="p-5 flex flex-col flex-1">
                      <span className={`self-start px-2.5 py-0.5 rounded-full text-xs font-bold uppercase mb-3 ${CATEGORY_COLORS[post.category]}`}>
                        {post.category}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 flex-1">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">{post.excerpt}</p>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mt-auto">
                        <span className="font-medium text-foreground">{post.author}</span>
                        <span className="flex items-center gap-1"><Clock size={11} />{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>}

            {!loading && !error && posts.length === 0 && (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No articles found matching your search.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 xl:w-80 flex-shrink-0 space-y-8">
            {/* Search */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif font-bold text-foreground mb-3">Search</h3>
              <div className="relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif font-bold text-foreground mb-4">Categories</h3>
              <ul className="space-y-2">
                {CATEGORIES.map((cat) => (
                  <li key={cat.value}>
                    <button
                      onClick={() => setActiveCategory(cat.value)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeCategory === cat.value
                          ? 'bg-primary/10 text-primary font-semibold'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      }`}
                    >
                      <span>{cat.label}</span>
                      <ChevronRight size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Trending */}
            <div className="bg-card border border-border rounded-xl p-5">
              <h3 className="font-serif font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={16} className="text-primary" />
                Trending Now
              </h3>
              <ul className="space-y-4">
                {trending.map((item, i) => (
                  <li key={item.slug}>
                    <Link to={`/blog/${item.slug}`} className="flex items-start gap-3 group">
                      <span className="text-2xl font-serif font-bold text-primary/30 leading-none mt-0.5">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <div>
                        <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors leading-tight mb-1">
                          {item.title}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock size={11} />{item.readTime || 'Quick read'}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <Mail size={16} className="text-primary" />
                <h3 className="font-serif font-bold text-foreground">Newsletter</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Get new articles delivered to your inbox every week.
              </p>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
              />
              <button className="w-full py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors">
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </main>

      <Footer />
    </div>
  );
}
