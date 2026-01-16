import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { BookOpen, CheckCircle2, Video } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export const CoursesSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const scrollToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const courses = [
    {
      level: 'JLPT N5',
      title: 'Beginner Foundation',
      description: 'Perfect for absolute beginners starting their Japanese journey.',
      duration: '2-3 months',
      badge: 'Most Popular',
      badgeColor: 'bg-primary text-primary-foreground',
      outcomes: [
        'Master Hiragana and Katakana',
        'Learn basic grammar structures',
        'Build vocabulary of 800+ words',
        'Understand simple daily conversations',
        'JLPT N5 exam preparation',
      ],
    },
    {
      level: 'JLPT N4',
      title: 'Elementary Proficiency',
      description: 'Expand your skills and build conversational confidence.',
      duration: '3-4 months',
      badge: 'Recommended',
      badgeColor: 'bg-accent text-accent-foreground',
      outcomes: [
        'Learn 300 essential Kanji',
        'Master intermediate grammar patterns',
        'Vocabulary expansion to 1,500+ words',
        'Understand everyday conversations',
        'JLPT N4 exam preparation',
      ],
    },
    {
      level: 'JLPT N3',
      title: 'Intermediate Mastery',
      description: 'Achieve fluency for professional and academic contexts.',
      duration: '4-5 months',
      badge: 'Advanced',
      badgeColor: 'bg-secondary text-secondary-foreground',
      outcomes: [
        'Master 650 Kanji characters',
        'Complex grammar structures',
        'Vocabulary of 3,700+ words',
        'Comprehend native-level materials',
        'JLPT N3 exam preparation',
      ],
    },
  ];

  return (
    <section id="courses" className="py-24 bg-muted/30">
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
            <span className="text-sm font-medium text-primary">Our Programs</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Choose Your <span className="text-primary">Learning Path</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Structured courses designed to take you from beginner to confident Japanese speaker.
          </p>
        </motion.div>

        {/* Course Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.15 + 0.2, duration: 0.6 }}
            >
              <Card className="h-full border-border hover:shadow-xl transition-all duration-300 card-hover flex flex-col">
                <CardHeader className="pb-4">
                  {/* Badge */}
                  {course.badge && (
                    <Badge className={`${course.badgeColor} mb-4 w-fit`}>
                      {course.badge}
                    </Badge>
                  )}

                  {/* Level */}
                  <div className="flex items-center space-x-2 mb-2">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <span className="font-serif font-bold text-2xl text-foreground">
                      {course.level}
                    </span>
                  </div>

                  <CardTitle className="text-xl text-foreground mb-2">
                    {course.title}
                  </CardTitle>

                  <p className="text-sm text-muted-foreground mb-4">
                    {course.description}
                  </p>

                  {/* Duration & Mode */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Video className="w-4 h-4" />
                      <span>Online</span>
                    </div>
                    <span className="text-primary font-medium">{course.duration}</span>
                  </div>
                </CardHeader>

                <CardContent className="flex-grow flex flex-col">
                  {/* Divider */}
                  <div className="border-t border-border mb-4" />

                  {/* Learning Outcomes */}
                  <div className="mb-6 flex-grow">
                    <h4 className="font-semibold text-sm text-foreground mb-3">
                      What You'll Learn:
                    </h4>
                    <ul className="space-y-2">
                      {course.outcomes.map((outcome, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button - anchored to bottom */}
                  <Button
                    onClick={scrollToContact}
                    className="w-full bg-primary text-primary-foreground hover:bg-primary/90 mt-auto"
                  >
                    Request Callback
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
