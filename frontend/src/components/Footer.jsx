import React from 'react';
import { Separator } from '@/components/ui/separator';
// import { Instagram, Linkedin, Youtube } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center shadow-md">
                <span className="text-primary-foreground font-bold text-xl font-serif">
                  日
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-xl text-secondary-foreground">
                  Nihongo Next
                </span>
                <span className="text-xs text-secondary-foreground/70">
                  日本語を学ぶ
                </span>
              </div>
            </div>
            <p className="text-sm text-secondary-foreground/70 mb-4 max-w-md">
              Your trusted partner in mastering the Japanese language. 
              Learn with clarity, consistency, and cultural understanding.
            </p>
            
            {/* Social Media - Commented for future use */}
            {/* <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-secondary-foreground/10 rounded-full flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div> */}
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4 text-secondary-foreground">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => scrollToSection('hero')}
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('about')}
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  About Us
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('courses')}
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  Courses
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection('testimonials')}
                  className="text-sm text-secondary-foreground/70 hover:text-primary transition-colors"
                >
                  Testimonials
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-serif font-semibold text-lg mb-4 text-secondary-foreground">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-secondary-foreground/70">
              <li>
                <a href="mailto:nextnihongo@gmail.com" className="hover:text-primary transition-colors break-all">
                  nextnihongo@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919876543210" className="hover:text-primary transition-colors">
                  +91 98765 43210
                </a>
              </li>
              <li className="pt-2">
                Online Classes
                <br />
                Available across India
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-secondary-foreground/20" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-secondary-foreground/70">
            © {currentYear} Nihongo Next. All rights reserved.
          </p>
          <div className="flex space-x-6 text-sm text-secondary-foreground/70">
            <button className="hover:text-primary transition-colors">
              Privacy Policy
            </button>
            <button className="hover:text-primary transition-colors">
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
