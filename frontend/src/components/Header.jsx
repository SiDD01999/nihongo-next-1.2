import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, LogOut, PenSquare, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isLanding = location.pathname === '/';

  // Read auth state from localStorage
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('nn_user')); } catch { return null; }
  });

  // Listen for storage changes (login/logout in other tabs)
  useEffect(() => {
    const sync = () => {
      try { setUser(JSON.parse(localStorage.getItem('nn_user'))); } catch { setUser(null); }
    };
    window.addEventListener('storage', sync);
    // Also listen for custom event from same-tab login
    window.addEventListener('auth-change', sync);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener('auth-change', sync);
    };
  }, []);

  // Re-check auth on route change (covers same-tab login redirect)
  useEffect(() => {
    try { setUser(JSON.parse(localStorage.getItem('nn_user'))); } catch { setUser(null); }
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('nn_token');
    localStorage.removeItem('nn_user');
    setUser(null);
    setShowDropdown(false);
    setIsMobileMenuOpen(false);
    window.dispatchEvent(new Event('auth-change'));
    navigate('/');
  };

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

  const isAdmin = user?.role === 'ADMIN';

  const initials = user
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '';

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

          {/* Desktop CTA / User Menu */}
          <div className="hidden md:flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={() => scrollToSection('courses')}
              className="border-border hover:bg-muted"
            >
              View Courses
            </Button>

            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-muted transition-colors"
                >
                  <div className="w-9 h-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                    {initials}
                  </div>
                  <span className="text-sm font-medium text-foreground max-w-[120px] truncate">
                    {user.name}
                  </span>
                </button>

                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-56 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-border">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                          Admin
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin/posts/new"
                        onClick={() => setShowDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                      >
                        <PenSquare size={15} />
                        Write a Post
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
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
              </>
            )}
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

              {user ? (
                <>
                  <div className="flex items-center gap-3 px-3 py-3 bg-muted/50 rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                      {initials}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  {isAdmin && (
                    <Link to="/admin/posts/new" onClick={() => setIsMobileMenuOpen(false)}>
                      <Button variant="outline" className="w-full py-3">
                        <PenSquare size={15} className="mr-2" /> Write a Post
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="w-full py-3 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut size={15} className="mr-2" /> Log Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button variant="outline" className="w-full py-3">Log In</Button>
                  </Link>
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90 py-3">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};
