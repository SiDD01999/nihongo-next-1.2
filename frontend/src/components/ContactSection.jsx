import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Phone, Mail, MapPin, Send, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import emailjs from 'emailjs-com';
import { toast } from 'sonner';

export const ContactSection = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    course: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCourseChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      course: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || !formData.phone || !formData.email || !formData.course) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    try {
      // Initialize EmailJS with your public key
      emailjs.init("YOUR_PUBLIC_KEY"); // TODO: Replace with actual public key

      // Send email using EmailJS
      await emailjs.send(
        "service_f5b4ngf",
        "callback_request_template",
        {
          name: formData.name,
          phone: formData.phone,
          email: formData.email,
          course: formData.course,
          time: new Date().toLocaleString(),
          to_email: "nextnihongo@gmail.com"
        }
      );

      // Success
      setIsSubmitted(true);
      toast.success('Request submitted successfully! We will contact you soon.');
      
      // Reset form
      setFormData({
        name: '',
        phone: '',
        email: '',
        course: '',
      });

      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 5000);

    } catch (error) {
      console.error('EmailJS Error:', error);
      toast.error('Failed to submit request. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="max-w-5xl mx-auto"
        >
          {/* Section Label */}
          <div className="text-center mb-12">
            <div className="inline-block bg-primary-light border border-primary/20 rounded-full px-4 py-2 mb-6">
              <span className="text-sm font-medium text-primary">Get In Touch</span>
            </div>

            <h2 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-4">
              Request a <span className="text-primary">Callback</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Interested in learning Japanese? Fill out the form below and we'll get back to you shortly.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Contact Form */}
            <Card className="border-border shadow-lg">
              <CardContent className="p-8">
                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-success" />
                    </div>
                    <h3 className="font-serif font-bold text-2xl text-foreground mb-2">
                      Request Received!
                    </h3>
                    <p className="text-muted-foreground">
                      Thank you for your interest. We'll contact you soon.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Full Name */}
                    <div>
                      <Label htmlFor="name" className="text-foreground mb-2 block">
                        Full Name <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="border-border focus:ring-primary"
                      />
                    </div>

                    {/* Contact Number */}
                    <div>
                      <Label htmlFor="phone" className="text-foreground mb-2 block">
                        Contact Number <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="border-border focus:ring-primary"
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <Label htmlFor="email" className="text-foreground mb-2 block">
                        Email Address <span className="text-primary">*</span>
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="your.email@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="border-border focus:ring-primary"
                      />
                    </div>

                    {/* Course Selection */}
                    <div>
                      <Label htmlFor="course" className="text-foreground mb-2 block">
                        Course Interested In <span className="text-primary">*</span>
                      </Label>
                      <Select value={formData.course} onValueChange={handleCourseChange} required>
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="N5">JLPT N5</SelectItem>
                          <SelectItem value="N4">JLPT N4</SelectItem>
                          <SelectItem value="N3">JLPT N3</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Submit Button */}
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12"
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <span className="animate-spin mr-2">⏳</span>
                          Submitting...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <Send className="w-5 h-5 mr-2" />
                          Submit Request
                        </span>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <div className="space-y-6">
              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                      <p className="text-sm text-muted-foreground mb-1">Available Mon-Sat, 10 AM - 7 PM</p>
                      <div className="flex flex-col space-y-1">
                        <a href="tel:+919805052048" className="text-primary hover:underline font-medium">
                          +91 98050 52048
                        </a>
                        <a href="tel:+918629027005" className="text-primary hover:underline font-medium">
                          +91 86290 27005
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">We'll respond within 24 hours</p>
                      <a href="mailto:nextnihongo@gmail.com" className="text-primary hover:underline font-medium break-all">
                        nextnihongo@gmail.com
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-primary-light rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">Location</h3>
                      <p className="text-sm text-muted-foreground">
                        Online Classes - Learn from Anywhere in India
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Note about EmailJS */}
              <Card className="border-primary/30 bg-primary-light/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2 flex items-center">
                    <CheckCircle2 className="w-5 h-5 text-primary mr-2" />
                    Quick Response Guaranteed
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We value your time. Expect to hear from us within 24 hours during business days.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
