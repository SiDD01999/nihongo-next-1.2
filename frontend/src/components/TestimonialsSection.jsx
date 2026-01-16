import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronLeft, ChevronRight, Quote, Star } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const TestimonialsSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const testimonials = [
    {
      name: 'Satyam',
      course: 'JLPT N5',
      rating: 5,
      text: 'Nihongo Next made learning Japanese so much easier than I expected. The teachers are patient and the structured approach helped me build a strong foundation quickly.',
    },
    {
      name: 'Sahil',
      course: 'JLPT N4',
      rating: 5,
      text: 'The personalized attention and flexible online classes fit perfectly into my work schedule. I passed JLPT N4 on my first attempt thanks to their excellent guidance!',
    },
    {
      name: 'Anuroop',
      course: 'JLPT N3',
      rating: 5,
      text: 'What sets Nihongo Next apart is their focus on building confidence. The interactive sessions and cultural insights made every class engaging and memorable.',
    },
    {
      name: 'Arushi',
      course: 'JLPT N5',
      rating: 5,
      text: 'As a complete beginner, I was nervous about learning Japanese. But the friendly environment and clear teaching style made it enjoyable from day one!',
    },
    {
      name: 'Rohan',
      course: 'JLPT N4',
      rating: 5,
      text: 'The combination of grammar drills, conversation practice, and cultural context creates a well-rounded learning experience. Highly recommend for serious learners!',
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  // Calculate visible testimonials (current + 2 more for desktop)
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      visible.push(testimonials[(currentIndex + i) % testimonials.length]);
    }
    return visible;
  };

  return (
    <section id="testimonials" className="py-24 bg-background overflow-hidden">
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
            <span className="text-sm font-medium text-primary">Student Success</span>
          </div>

          {/* Heading */}
          <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
            What Our <span className="text-primary">Students Say</span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join hundreds of satisfied learners who've achieved their Japanese language goals with us.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <div className="relative max-w-7xl mx-auto">
          {/* Desktop View - 3 Cards */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            {getVisibleTestimonials().map((testimonial, index) => (
              <motion.div
                key={`${currentIndex}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Card className={`border-border h-full ${index === 0 ? 'shadow-lg' : 'shadow-sm'}`}>
                  <CardContent className="p-8">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    
                    {/* Rating */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      "{testimonial.text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-border">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonial.name}</div>
                        <div className="text-sm text-muted-foreground">{testimonial.course} Student</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Mobile/Tablet View - 1 Card with Animation */}
          <div className="lg:hidden relative h-[400px]">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: 'spring', stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="absolute inset-0"
              >
                <Card className="border-border shadow-lg h-full">
                  <CardContent className="p-8 flex flex-col h-full">
                    <Quote className="w-10 h-10 text-primary/20 mb-4" />
                    
                    {/* Rating */}
                    <div className="flex space-x-1 mb-4">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Testimonial Text */}
                    <p className="text-muted-foreground mb-6 leading-relaxed flex-grow">
                      "{testimonials[currentIndex].text}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center space-x-3 pt-4 border-t border-border mt-auto">
                      <div className="w-12 h-12 bg-primary-light rounded-full flex items-center justify-center">
                        <span className="font-semibold text-primary text-lg">
                          {testimonials[currentIndex].name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{testimonials[currentIndex].name}</div>
                        <div className="text-sm text-muted-foreground">{testimonials[currentIndex].course} Student</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation Controls */}
          <div className="flex justify-center items-center space-x-4 mt-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrev}
              className="rounded-full border-border hover:bg-muted"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>

            {/* Dots Indicator */}
            <div className="flex space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-border hover:bg-muted-foreground'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNext}
              className="rounded-full border-border hover:bg-muted"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
