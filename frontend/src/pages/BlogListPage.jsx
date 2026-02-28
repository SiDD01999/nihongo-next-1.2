import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Search, Clock, Calendar, ChevronRight, BookOpen, TrendingUp, Mail } from 'lucide-react';

const CATEGORIES = [
  { label: 'All Posts', value: 'all', count: 12 },
  { label: 'Grammar', value: 'grammar', count: 4 },
  { label: 'Culture', value: 'culture', count: 3 },
  { label: 'Vocabulary', value: 'vocabulary', count: 3 },
  { label: 'Kanji', value: 'kanji', count: 2 },
];

const POSTS = [
  {
    slug: 'mastering-japanese-particles',
    title: 'Mastering Japanese Particles: Not as Scary as You Think',
    excerpt: 'A deep dive into は, が, に, and で — the particles that confuse beginners the most, explained clearly with real examples.',
    category: 'grammar',
    author: 'Kenji Tanaka',
    date: 'Oct 12, 2023',
    readTime: '15 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjiNXkftsR81kl9x-nfN35jXleZ1LOhiKIntbPLD16E7xCT7ywsPcSSE-RbKw6nU1dV-e_IgL51J1uMZfzK1vCae2K2BpUU24mhbOwOLeNvRCRv56HzFkCDvhjc6iYnuSf-_wREOX3eJIXwgVpQii7nU3lQYXiSCy5Jdr4l2s-vN2PJbGjV-3WPZnbpTIWQ1DzX3kux3P9KkJBD9Uc-VboySKvafaFW7SAyQH1VIHpA0i7xWVeP7HGE59bxjvjgLyOTVkHzdfy0zg',
    featured: true,
  },
  {
    slug: 'keigo-formal-japanese',
    title: "Understanding 'Keigo': Formal Japanese",
    excerpt: 'Master the art of polite speech in Japanese. From です/ます forms to honorific and humble language.',
    category: 'culture',
    author: 'Yuki Sato',
    date: 'Oct 5, 2023',
    readTime: '10 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAfTFxiqAkwx1McWH6hYDGnAasHA8UDNDmMNwF6sPLyGftg_Cqw2ev-EsDdfpi9yxIuVef1DzeJVFaaCqlNV5ySkDStyUilUeS6dErLLUT9yE2n2D6VylT4MsMGNoJH-K8-0o43C8uYGInp1x9kzCLjC55iY_kA7RHOdQmXv90cbIPVczzcBuNjl6YKFHGOqIiPiG-BNg2ih_bU6eV2CO6sz_VYcq4DfxCQjFJgI19Zwlka81YYK5Iu_A5FUT50fwI9zRMEwVf0K4',
    featured: false,
  },
  {
    slug: 'food-vocabulary-travelers',
    title: 'Essential Food Vocabulary for Travelers',
    excerpt: 'Planning a trip to Japan? These 50 food words and phrases will help you order with confidence at any restaurant.',
    category: 'vocabulary',
    author: 'Kenji Tanaka',
    date: 'Sep 28, 2023',
    readTime: '8 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9-4PxdjUagNriQq3CX-TqOPDmW4Ky5cZ64zBFbiJO4joel7_lWy5rTLo8ftdkFK9Bu9X8YyIDagoknap_ptVQn3T8HHAlHAyN2hN43NBvA2LUzs6A-TqnD-z4b72e7wrmHuoM7hF52VvdwTeSt6WzXZ2-X31k032J8KZeKrhBFJA9qRa0h9QBMMUvR6vm6ZaShEOYG7-dy0tq0MqsJ3AWQhz9TPVSsvk8dfyonhI9cz19ZjNehxh7wL3Ws8-FZXt5y-_h3S31RGw',
    featured: false,
  },
  {
    slug: 'top-10-kanji-must-know',
    title: 'Top 10 Kanji You Must Know as a Beginner',
    excerpt: 'Start your Kanji journey right. These 10 essential characters appear everywhere in daily Japanese life.',
    category: 'kanji',
    author: 'Mike Ross',
    date: 'Sep 20, 2023',
    readTime: '12 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxXDLx8EuPYFtEYzW8gH3szmsKxUArXX6qzcXk0xbjEV3kiZuxzqfvgQKYGPwGHFl7aOD5HDbo-9TqfMgTu7KVHUw_yLYYkLqwxXCiyM8Y90levni1LTy7Y2GIWAQKQRFhx_Bp16Iya3T_BIMcxnTmZzY9unbw-ikyXYGOhFh_3bwTd6-Ihnz4vIaEc7WVMHYYhSMd07J7hLnrvxPRswqkkuSWCtE3mU8jFO-L77TFh0wKid1fa6YvgLFdRa4eP5P2yyhW9QpmHzU',
    featured: false,
  },
  {
    slug: 'jlpt-n5-study-guide',
    title: 'The Complete JLPT N5 Study Guide',
    excerpt: 'Everything you need to pass the JLPT N5 — vocabulary lists, grammar points, and practice strategies.',
    category: 'grammar',
    author: 'Kenji Tanaka',
    date: 'Sep 12, 2023',
    readTime: '20 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKTOjwLg6_w1yfaHcr85LDjnelvNVPpFj6YGvg5G6EgYCzXOZPIvvX13ibrzS9IkDm_Js-TVLId2QQUgJeWKjiH6cyAE0gTZok0pubi4HRzTsVkRrLvQP0-dHBHIZLZLIvQyZSCGwUdecZFS6Z9Zccliyixh8dsdJ6KcU7UCxOtnIRMsnz4QVvNkMewSZQl44so22hIv7x7xy_umQH4lsRNKfJJMr49RKeeoDO2KvgYEUvU9Dtl0-Jqr231-a_a5iCSWkevqNO1xY',
    featured: false,
  },
  {
    slug: 'japanese-culture-etiquette',
    title: 'Japanese Culture & Etiquette: Do\'s and Don\'ts',
    excerpt: 'Avoid embarrassing mistakes in Japan. A guide to bowing, removing shoes, dining customs, and more.',
    category: 'culture',
    author: 'Yuki Sato',
    date: 'Sep 1, 2023',
    readTime: '11 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCfpCPNCumt3xgbQjegNjx0KHsAIDC6k9zhIXIn2MRCAWokCyCsCNdKfJj9rzEfg_mtSugZSnRp8TNxJK6lkmNbWtPY_4gzPh_SyTxdXktFmkUZ6o-DiHBle7CZsCs_tTD9feNS-viJ4wbJFwwMQyVZJI8BxJh7efsndRtcD1AK1FmBrcjNTuTJb7KN9kWGhUnyafDc-Wus04Ko_E1xHHJb1swg9yN8UfBy-9WHHjJbtxT1T3X3H4Y_Op0z6gWsXKIxhxENXLCZcM4',
    featured: false,
  },
];

const TRENDING = [
  { title: 'Mastering Japanese Particles', slug: 'mastering-japanese-particles', readTime: '15 min' },
  { title: 'JLPT N5 Study Guide', slug: 'jlpt-n5-study-guide', readTime: '20 min' },
  { title: 'Top 10 Kanji You Must Know', slug: 'top-10-kanji-must-know', readTime: '12 min' },
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

  const filtered = POSTS.filter((p) => {
    const matchCat = activeCategory === 'all' || p.category === activeCategory;
    const matchSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered.find((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);

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
                <span className="ml-1.5 text-xs opacity-70">({cat.count})</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Featured Article */}
            {featured && (
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
            <div className="grid sm:grid-cols-2 gap-6">
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
            </div>

            {filtered.length === 0 && (
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
                      <span className="text-xs font-medium bg-muted px-2 py-0.5 rounded-full">{cat.count}</span>
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
                {TRENDING.map((item, i) => (
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
                          <Clock size={11} />{item.readTime}
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
