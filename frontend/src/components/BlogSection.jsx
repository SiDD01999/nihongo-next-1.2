import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, Clock, ArrowRight, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getPosts } from '@/lib/api';

const CATEGORY_COLORS = {
  grammar: 'bg-red-100 text-red-700',
  culture: 'bg-purple-100 text-purple-700',
  vocabulary: 'bg-blue-100 text-blue-700',
  kanji: 'bg-amber-100 text-amber-700',
};

export const BlogSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const { data } = await getPosts();
        setPosts(data.slice(0, 3));
      } catch {
        // Silently fail — section just won't show posts
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // Don't render the section at all if there are no posts and not loading
  if (!loading && posts.length === 0) return null;

  return (
    <section id="blog" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          {/* Section Label */}
          <div className="inline-block bg-primary-light border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">From Our Blog</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Latest <span className="text-primary">Articles</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Grammar guides, cultural insights, and vocabulary tips to support your Japanese learning journey.
          </p>
        </motion.div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 className="w-7 h-7 animate-spin text-primary" />
            <p className="text-muted-foreground text-sm">Loading articles...</p>
          </div>
        )}

        {/* Posts Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post, index) => (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
              >
                <Link to={`/blog/${post.slug}`} className="group block h-full">
                  <Card className="h-full border-border hover:shadow-xl transition-all duration-300 card-hover flex flex-col overflow-hidden">
                    {/* Image */}
                    {post.image && (
                      <div className="w-full aspect-[16/10] overflow-hidden">
                        <div
                          className="w-full h-full bg-cover bg-center group-hover:scale-[1.03] transition-transform duration-500"
                          style={{ backgroundImage: `url('${post.image}')` }}
                        />
                      </div>
                    )}

                    <CardContent className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Category + Featured badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <Badge className={`${CATEGORY_COLORS[post.category] || 'bg-muted text-muted-foreground'} text-xs font-bold uppercase`}>
                          {post.category}
                        </Badge>
                        {post.featured && (
                          <Badge className="bg-primary/10 text-primary text-xs font-bold">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-serif font-bold text-lg text-foreground group-hover:text-primary transition-colors mb-2 flex-1 leading-snug">
                        {post.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm leading-relaxed mb-4 line-clamp-2">
                        {post.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto pt-4 border-t border-border">
                        <span className="font-medium text-foreground">{post.author}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {post.readTime}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* View All CTA */}
        {!loading && posts.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7, duration: 0.5 }}
            className="text-center mt-12"
          >
            <Button asChild variant="outline" size="lg" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
              <Link to="/blog" className="inline-flex items-center gap-2">
                <BookOpen size={18} />
                View All Articles
                <ArrowRight size={16} />
              </Link>
            </Button>
          </motion.div>
        )}
      </div>
    </section>
  );
};
