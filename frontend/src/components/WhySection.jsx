import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Users, Award, Laptop, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export const WhySection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const features = [
    {
      icon: Users,
      title: 'Friendly, Personalised Classes',
      description: 'Small-batch and one-on-one sessions designed around learner pace and goals.',
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
    {
      icon: Award,
      title: 'Experienced Trainers',
      description: 'Qualified instructors with strong beginner and JLPT-level teaching experience.',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      icon: Laptop,
      title: 'Flexible Online Classes',
      description: 'Interactive live classes accessible from anywhere, at times that suit you.',
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      icon: BookOpen,
      title: 'Strong Foundation Approach',
      description: 'Clear focus on pronunciation, scripts, and grammar basics for lasting success.',
      color: 'text-primary',
      bgColor: 'bg-primary-light',
    },
  ];

  return (
    <section className="py-24 bg-background">
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
            <span className="text-sm font-medium text-primary">Why Choose Us</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            Why Learn with <span className="text-primary">Nihongo Next?</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            We combine expert teaching with a personalized approach to help you achieve your Japanese language goals.
          </p>
        </motion.div>

        {/* Feature Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1 + 0.2, duration: 0.6 }}
            >
              <Card className="h-full border-border hover:shadow-lg transition-all duration-300 card-hover">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  
                  <h3 className="font-serif font-semibold text-xl text-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed mt-auto">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
