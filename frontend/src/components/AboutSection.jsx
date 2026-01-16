import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Heart, Target, Users } from 'lucide-react';

export const AboutSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <section id="about" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          {/* Section Label */}
          <div className="inline-block bg-primary-light border border-primary/20 rounded-full px-4 py-2 mb-6">
            <span className="text-sm font-medium text-primary">About Us</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-6">
            Welcome to <span className="text-primary">Nihongo Next</span>
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground leading-relaxed mb-12">
            At Nihongo Next, we believe that learning Japanese should be an enjoyable and rewarding journey. 
            Our mission is to provide a friendly, supportive environment where students of all levels can 
            develop their language skills with clarity, consistency, and cultural understanding.
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Heart className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Passionate Teaching
              </h3>
              <p className="text-sm text-muted-foreground">
                Our instructors bring genuine enthusiasm and dedication to every lesson, making learning engaging and fun.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Structured Approach
              </h3>
              <p className="text-sm text-muted-foreground">
                We follow a clear, progressive curriculum that builds a strong foundation from day one.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-serif font-semibold text-xl text-foreground mb-2">
                Supportive Community
              </h3>
              <p className="text-sm text-muted-foreground">
                Join a welcoming community of learners and build confidence through collaborative practice.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
