import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Calendar, Clock, ThumbsUp, ChevronRight, ArrowForward } from 'lucide-react';

// ─── Mock post data ───────────────────────────────────────────────────────────
const POSTS = {
  'mastering-japanese-particles': {
    slug: 'mastering-japanese-particles',
    category: 'Grammar Deep Dive',
    title: 'Mastering Japanese Particles: Not as Scary as You Think',
    subtitle: 'A deep dive into は, が, に, and で for beginners.',
    author: { name: 'Kenji Tanaka', role: 'Senior Instructor', initials: 'KT',
      bio: 'Kenji has been teaching Japanese to international students for over 10 years. He specializes in breaking down complex grammar concepts into bite-sized, digestible lessons. He loves hiking in Nagano on weekends.',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAADh-nYRXttm8SnVIErg74W2WmmHGAUy9vd8A5qsUYoHCQfNQ-ir2HmjE6rJ4zOvq6gYnLWNuS4dWHGDQACIA4SELVePo5u00GrMwnBdp7Zd8aEwobWl_rVu87D0cTkWiif8k0SuSQuLOdS3iTAqngK-qld6Jmz7Y71RnJ33KZpXj9BjwC_oTMcf41_Illm1qQltYy7fIKPhV6lPdsZEJDiTKxNF8KzzLFTnB5IRkJpRXEBBu3eLyPqE9uYxeetJbrUjdIFTotznQ' },
    date: 'Oct 12, 2023',
    readTime: '15 min read',
    heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjiNXkftsR81kl9x-nfN35jXleZ1LOhiKIntbPLD16E7xCT7ywsPcSSE-RbKw6nU1dV-e_IgL51J1uMZfzK1vCae2K2BpUU24mhbOwOLeNvRCRv56HzFkCDvhjc6iYnuSf-_wREOX3eJIXwgVpQii7nU3lQYXiSCy5Jdr4l2s-vN2PJbGjV-3WPZnbpTIWQ1DzX3kux3P9KkJBD9Uc-VboySKvafaFW7SAyQH1VIHpA0i7xWVeP7HGE59bxjvjgLyOTVkHzdfy0zg',
    heroCaption: 'Kyoto in Autumn — The perfect setting for study.',
    tags: ['Grammar', 'Beginner', 'Particles'],
  },
};

const RELATED = [
  { slug: 'keigo-formal-japanese', category: 'Culture', title: "Understanding 'Keigo': Formal Japanese", author: 'Yuki Sato', readTime: '10 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDAfTFxiqAkwx1McWH6hYDGnAasHA8UDNDmMNwF6sPLyGftg_Cqw2ev-EsDdfpi9yxIuVef1DzeJVFaaCqlNV5ySkDStyUilUeS6dErLLUT9yE2n2D6VylT4MsMGNoJH-K8-0o43C8uYGInp1x9kzCLjC55iY_kA7RHOdQmXv90cbIPVczzcBuNjl6YKFHGOqIiPiG-BNg2ih_bU6eV2CO6sz_VYcq4DfxCQjFJgI19Zwlka81YYK5Iu_A5FUT50fwI9zRMEwVf0K4' },
  { slug: 'food-vocabulary-travelers', category: 'Vocabulary', title: 'Essential Food Vocabulary for Travelers', author: 'Kenji Tanaka', readTime: '8 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB9-4PxdjUagNriQq3CX-TqOPDmW4Ky5cZ64zBFbiJO4joel7_lWy5rTLo8ftdkFK9Bu9X8YyIDagoknap_ptVQn3T8HHAlHAyN2hN43NBvA2LUzs6A-TqnD-z4b72e7wrmHuoM7hF52VvdwTeSt6WzXZ2-X31k032J8KZeKrhBFJA9qRa0h9QBMMUvR6vm6ZaShEOYG7-dy0tq0MqsJ3AWQhz9TPVSsvk8dfyonhI9cz19ZjNehxh7wL3Ws8-FZXt5y-_h3S31RGw' },
  { slug: 'top-10-kanji-must-know', category: 'Beginner', title: 'Top 10 Kanji You Must Know', author: 'Mike Ross', readTime: '12 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCxXDLx8EuPYFtEYzW8gH3szmsKxUArXX6qzcXk0xbjEV3kiZuxzqfvgQKYGPwGHFl7aOD5HDbo-9TqfMgTu7KVHUw_yLYYkLqwxXCiyM8Y90levni1LTy7Y2GIWAQKQRFhx_Bp16Iya3T_BIMcxnTmZzY9unbw-ikyXYGOhFh_3bwTd6-Ihnz4vIaEc7WVMHYYhSMd07J7hLnrvxPRswqkkuSWCtE3mU8jFO-L77TFh0wKid1fa6YvgLFdRa4eP5P2yyhW9QpmHzU' },
];

const COMMENTS = [
  { id: 1, name: 'Sarah Jenkins', initials: 'SJ', text: 'This finally makes sense! I\'ve been struggling with the wa/ga distinction for months. The "who ate the cake" example was perfect.', time: '2 hours ago', likes: 14,
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuABEDOB-_C7Br-ycMdubjTtcSFw1wDidVxoVNoV1cR8zhAFEFiEIUgR29G-Pv9EfjhCrbk0mYlAttQhF6qrg7e48Aa3Th7Qfe1j_NfJkNsSxvXX2Frro_Adfu2nsqbGslGMeBGpqrGacpzCC2WmtOe6DAglPqd5IVpnb6m9gpSPbdDgpq04-FISRMIBdsDXJs6p2-oYZi-m_zLl8tiNuYnEJSLI6gzfX46roM_5w0N_y7uWTr-3yBCWH5OiVS1StMCgy4pjzoFGNl0',
    reply: { name: 'Kenji Tanaka', text: 'Glad it helped, Sarah! Keep practicing those example sentences.', time: '1 hour ago' } },
];

// ─── Ruby text helper ─────────────────────────────────────────────────────────
function Ruby({ char, reading }) {
  return (
    <ruby className="inline-flex flex-col-reverse items-center align-bottom leading-none">
      {char}
      <rt className="text-[0.6em] leading-[1.2] text-center text-primary font-medium" style={{ marginBottom: '-0.2em' }}>
        {reading}
      </rt>
    </ruby>
  );
}

// ─── Article body ─────────────────────────────────────────────────────────────
function ArticleBody() {
  return (
    <div className="prose prose-lg max-w-none">
      <p className="text-lg leading-relaxed text-foreground/80 mb-6">
        Japanese particles, or{' '}
        <span className="font-bold text-primary" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
          助詞 (じょし)
        </span>
        , are the glue that holds sentences together. While they can be intimidating at first,
        understanding their core functions unlocks a new level of fluency. Let's start with the most
        common confusion:{' '}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-base font-mono">wa</code>{' '}
        versus{' '}
        <code className="text-primary bg-primary/10 px-1.5 py-0.5 rounded text-base font-mono">ga</code>.
      </p>

      <h2 className="text-2xl font-serif font-bold text-primary mt-10 mb-4 pl-4 border-l-4 border-primary">
        The Topic Marker: は (Wa)
      </h2>
      <p className="text-foreground/80 leading-relaxed mb-6">
        First, note that while this character is usually read as "ha", when it functions as a
        particle, it is pronounced "wa". The particle{' '}
        <span className="font-bold text-primary" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>は</span>{' '}
        marks the <strong>topic</strong> of the sentence. It tells the listener,
        "As for this thing, here is what I want to say about it."
      </p>

      {/* Example card */}
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8 shadow-sm">
        <div className="flex items-start gap-3">
          <span className="text-primary text-2xl mt-0.5">💡</span>
          <div>
            <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">Example Sentence</p>
            <p className="text-2xl mb-2" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
              <Ruby char="私" reading="わたし" />は
              <Ruby char="学生" reading="がくせい" />です。
            </p>
            <p className="text-muted-foreground italic mb-1">Watashi wa gakusei desu.</p>
            <p className="text-foreground font-medium">I am a student.</p>
            <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-primary/10">
              Here,{' '}
              <span className="text-primary font-bold" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>私</span>{' '}
              (I) is the topic. Everything following describes "I".
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-2xl font-serif font-bold text-primary mt-10 mb-4 pl-4 border-l-4 border-primary">
        The Subject Marker: が (Ga)
      </h2>
      <p className="text-foreground/80 leading-relaxed mb-4">
        Unlike{' '}
        <span className="text-primary font-bold" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>は</span>,
        which sets a general topic,{' '}
        <span className="text-primary font-bold" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>が</span>{' '}
        identifies a <strong>specific subject</strong> performing an action. It puts the spotlight
        squarely on the noun before it.
      </p>
      <p className="text-foreground/80 leading-relaxed mb-6">Imagine someone asks, "Who ate the cake?"</p>

      {/* Comparison grid */}
      <div className="grid md:grid-cols-2 gap-4 mb-8">
        <div className="bg-muted/50 rounded-xl p-5 border border-border">
          <p className="text-xs font-bold text-muted-foreground uppercase mb-2">Wrong Context</p>
          <p className="text-lg mb-1 opacity-50" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            <Ruby char="私" reading="わたし" />は<Ruby char="食" reading="た" />べました。
          </p>
          <p className="text-sm text-muted-foreground">As for me, I ate (it).</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-5 relative overflow-hidden">
          <span className="absolute top-3 right-3 text-green-600 text-lg">✓</span>
          <p className="text-xs font-bold text-green-700 uppercase mb-2">Correct Context</p>
          <p className="text-lg mb-1" style={{ fontFamily: 'Noto Sans JP, sans-serif' }}>
            <Ruby char="私" reading="わたし" />が<Ruby char="食" reading="た" />べました。
          </p>
          <p className="text-sm text-muted-foreground"><strong>I</strong> am the one who ate it.</p>
        </div>
      </div>

      <h3 className="text-xl font-serif font-bold text-foreground mt-8 mb-3">Key Takeaways</h3>
      <ul className="space-y-3 mb-10 list-none pl-0">
        {[
          'Use は for general statements and introducing topics.',
          'Use が when identifying specifically who or what.',
          'Always practice reading aloud to get a feel for the rhythm.',
        ].map((item) => (
          <li key={item} className="flex items-start gap-3">
            <span className="text-primary font-bold text-lg leading-tight mt-0.5">✓</span>
            <span className="text-foreground/80">{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function BlogPostPage() {
  const { slug } = useParams();
  const post = POSTS[slug] || POSTS['mastering-japanese-particles'];
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState(COMMENTS);

  const handleComment = () => {
    if (!commentText.trim()) return;
    setComments([...comments, {
      id: comments.length + 2, name: 'You', initials: 'YO',
      text: commentText, time: 'Just now', likes: 0, image: null,
    }]);
    setCommentText('');
  };

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
          <span className="text-primary font-medium">Grammar</span>
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
              {post.subtitle}
            </p>
            <div className="flex items-center justify-center flex-wrap gap-4 text-sm text-muted-foreground border-t border-b border-border py-4 w-full">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-full bg-muted bg-cover bg-center"
                  style={{ backgroundImage: `url('${post.author.image}')` }}
                />
                <span className="font-medium text-foreground">{post.author.name}</span>
              </div>
              <span className="w-1 h-1 bg-border rounded-full hidden sm:block" />
              <span className="flex items-center gap-1.5"><Calendar size={14} />{post.date}</span>
              <span className="w-1 h-1 bg-border rounded-full hidden sm:block" />
              <span className="flex items-center gap-1.5"><Clock size={14} />{post.readTime}</span>
            </div>
          </header>

          {/* Hero Image */}
          <div className="w-full max-w-[960px] mb-12 rounded-2xl overflow-hidden shadow-lg border border-border">
            <div
              className="aspect-video w-full bg-cover bg-center"
              style={{ backgroundImage: `url('${post.heroImage}')` }}
            />
            <div className="bg-card py-3 px-4 text-center border-t border-border">
              <p className="text-xs text-muted-foreground italic">{post.heroCaption}</p>
            </div>
          </div>

          {/* Article Content */}
          <div className="w-full max-w-[720px]">
            <ArticleBody />
          </div>

          {/* Tags */}
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

          {/* Author Bio */}
          <div className="w-full max-w-[800px] bg-primary/5 border border-primary/20 rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 items-center md:items-start mb-16">
            <div
              className="w-20 h-20 flex-shrink-0 rounded-full bg-muted bg-cover bg-center ring-4 ring-background shadow-sm"
              style={{ backgroundImage: `url('${post.author.image}')` }}
            />
            <div className="text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2">
                <h3 className="text-lg font-serif font-bold text-foreground">{post.author.name}</h3>
                <span className="hidden md:block text-primary/40 text-xs">•</span>
                <span className="text-primary text-sm font-bold uppercase tracking-wider">{post.author.role}</span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.author.bio}</p>
              <Link
                to="/blog"
                className="text-primary hover:text-primary/80 text-sm font-bold flex items-center justify-center md:justify-start gap-1 group"
              >
                View all posts by {post.author.name.split(' ')[0]}
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

            {/* New comment */}
            <div className="flex gap-4 mb-8">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold flex-shrink-0 text-sm">
                JD
              </div>
              <div className="flex-1">
                <textarea
                  className="w-full bg-card border border-border rounded-xl p-3 text-sm focus:ring-2 focus:ring-primary/30 focus:border-primary outline-none min-h-[100px] resize-y mb-2 placeholder:text-muted-foreground transition-all"
                  placeholder="Ask a question or share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end">
                  <button
                    onClick={handleComment}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-2 px-4 rounded-lg transition-colors shadow-sm"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </div>

            {/* Comment list */}
            <div className="space-y-6">
              {comments.map((c) => (
                <div key={c.id}>
                  <div className="flex gap-4">
                    <div
                      className="w-10 h-10 rounded-full bg-muted bg-cover bg-center flex-shrink-0 flex items-center justify-center text-sm font-bold text-muted-foreground"
                      style={c.image ? { backgroundImage: `url('${c.image}')` } : {}}
                    >
                      {!c.image && c.initials}
                    </div>
                    <div className="flex-1">
                      <div className="bg-muted/50 rounded-xl p-4 mb-2">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-bold text-foreground text-sm">{c.name}</span>
                          <span className="text-xs text-muted-foreground">{c.time}</span>
                        </div>
                        <p className="text-foreground/80 text-sm">{c.text}</p>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <button className="flex items-center gap-1 hover:text-primary transition-colors">
                          <ThumbsUp size={13} /> {c.likes}
                        </button>
                        <button className="hover:text-primary transition-colors">Reply</button>
                      </div>
                    </div>
                  </div>

                  {/* Author reply */}
                  {c.reply && (
                    <div className="flex gap-4 pl-14 mt-4">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs flex-shrink-0">
                        KT
                      </div>
                      <div className="flex-1">
                        <div className="bg-primary/5 border border-primary/10 rounded-xl p-3 mb-2">
                          <div className="flex justify-between items-center mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-foreground text-sm">{c.reply.name}</span>
                              <span className="bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded">
                                AUTHOR
                              </span>
                            </div>
                            <span className="text-xs text-muted-foreground">{c.reply.time}</span>
                          </div>
                          <p className="text-foreground/80 text-sm">{c.reply.text}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Keep Learning — Related Articles */}
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
              {RELATED.map((item) => (
                <Link key={item.slug} to={`/blog/${item.slug}`} className="group block">
                  <div className="w-full aspect-[4/3] rounded-xl bg-muted mb-4 overflow-hidden relative shadow-sm">
                    <div
                      className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                      style={{ backgroundImage: `url('${item.image}')` }}
                    />
                    <div className="absolute top-3 left-3 bg-background/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-foreground border border-border">
                      {item.category}
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-foreground mb-2 group-hover:text-primary transition-colors leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">By {item.author} • {item.readTime}</p>
                </Link>
              ))}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </div>
  );
}
