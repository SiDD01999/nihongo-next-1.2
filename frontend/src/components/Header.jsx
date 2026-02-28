import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    if (!isLanding) {
      navigate('/');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    setIsMobileMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', id: 'hero' },
    { label: 'About', id: 'about' },
    { label: 'Courses', id: 'courses' },
    { label: 'Testimonials', id: 'testimonials' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isMobileMenuOpen
        ? 'bg-white shadow-md'
        : isScrolled
          ? 'backdrop-blur-xl shadow-md'
          : 'bg-transparent'
        }`}
      style={!isMobileMenuOpen && isScrolled ? { backgroundColor: 'hsl(var(--background) / 0.95)' } : isMobileMenuOpen ? { backgroundColor: '#ffffff' } : {}}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center space-x-3"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img
              src="https://customer-assets.emergentagent.com/job_nihongo-studio/artifacts/3dxeu67p_logo.png"
              alt="Nihongo Next Logo"
              className="h-12 w-auto object-contain"
            />
            <div className="flex flex-col">
              <span className="font-serif font-bold text-xl text-foreground">
                Nihongo Next
              </span>
              <span className="text-xs text-muted-foreground">
                日本語を学ぶ
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/blog"
              className="text-sm font-medium text-foreground hover:text-primary transition-colors duration-200"
            >
              Blog
            </Link>
          </nav>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => scrollToSection('courses')}
              className="border-border hover:bg-muted"
            >
              View Courses
            </Button>
            <Link to="/login">
              <Button variant="ghost" className="hover:text-primary">
                Log In
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                Sign Up
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-foreground hover:text-primary transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed top-20 left-0 right-0 bottom-0 z-50 p-6 overflow-y-auto animate-slideDown"
          style={{
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <nav className="flex flex-col space-y-4">
            {navItems.map((item, index) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left text-lg font-medium text-foreground hover:text-primary py-3 transition-all duration-300 border-b border-gray-100/50 hover:pl-2"
                style={{ animation: `fadeInUp 0.3s ease-out ${index * 0.05}s both` }}
              >
                {item.label}
              </button>
            ))}
            <Link
              to="/blog"
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-left text-lg font-medium text-foreground hover:text-primary py-3 border-b border-gray-100/50 transition-colors"
            >
              Blog
            </Link>
            <div className="flex flex-col space-y-3 pt-4">
              <Button
                variant="outline"
                onClick={() => scrollToSection('courses')}
                className="w-full border-border hover:bg-muted py-3"
              >
                View Courses
              </Button>
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                <Button variant="outline" className="w-full py-3">Log In</Button>
              </Link>
              <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3">
                  Sign Up
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
