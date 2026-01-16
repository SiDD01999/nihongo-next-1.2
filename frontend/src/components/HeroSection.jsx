import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Sparkles, BookOpen, Globe } from 'lucide-react';

export const HeroSection = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center space-x-2 bg-primary-light border border-primary/20 rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Your Gateway to Japanese Fluency
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-foreground mb-6 leading-tight"
            >
              Learn Japanese the{' '}
              <span className="text-primary">Easy</span> and{' '}
              <span className="text-primary">Enjoyable</span> Way
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
            >
              A friendly space to learn Japanese with clarity, consistency and cultural flavor.
              Master the language through personalized guidance and structured learning.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Button
                size="lg"
                onClick={() => scrollToSection('courses')}
                className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Explore Courses
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => scrollToSection('about')}
                className="border-2 border-border hover:bg-muted transition-all duration-300"
              >
                <Globe className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="mt-12 grid grid-cols-3 gap-8 border-t border-border pt-8"
            >
              <div>
                <div className="font-serif font-bold text-3xl text-primary mb-1">
                  100+
                </div>
                <div className="text-sm text-muted-foreground">
                  Happy Students
                </div>
              </div>
              <div>
                <div className="font-serif font-bold text-3xl text-primary mb-1">
                  95%
                </div>
                <div className="text-sm text-muted-foreground">
                  Success Rate
                </div>
              </div>
              <div>
                <div className="font-serif font-bold text-3xl text-primary mb-1">
                  4.8/5
                </div>
                <div className="text-sm text-muted-foreground">
                  Student Rating
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Main Card */}
              <div className="bg-card border border-border rounded-3xl shadow-2xl p-12 relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `repeating-linear-gradient(0deg, hsl(var(--primary)) 0px, transparent 1px, transparent 20px),
                                      repeating-linear-gradient(90deg, hsl(var(--primary)) 0px, transparent 1px, transparent 20px)`
                  }} />
                </div>

                {/* Japanese Characters */}
                <div className="relative space-y-8 text-center">
                  <div className="text-8xl font-serif text-primary mb-4 animate-float">
                    日本語
                  </div>
                  <div className="text-2xl font-medium text-foreground">
                    Nihongo
                  </div>
                  <div className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Begin your journey to mastering one of the world's most fascinating languages
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -top-4 -right-4 bg-primary text-primary-foreground rounded-2xl shadow-lg p-4 text-center"
              >
                <div className="text-2xl font-bold">ひらがな</div>
                <div className="text-xs">Hiragana</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -bottom-4 -left-4 bg-accent text-accent-foreground rounded-2xl shadow-lg p-4 text-center"
              >
                <div className="text-2xl font-bold">カタカナ</div>
                <div className="text-xs">Katakana</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute top-1/2 -right-8 bg-secondary text-secondary-foreground rounded-2xl shadow-lg p-4 text-center"
              >
                <div className="text-2xl font-bold">漢字</div>
                <div className="text-xs">Kanji</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
