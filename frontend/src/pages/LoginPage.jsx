import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { login } from '@/lib/api';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Email and password are required.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await login(form);
      localStorage.setItem('nn_token', data.token);
      localStorage.setItem('nn_user', JSON.stringify(data.user));
      navigate('/blog');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-950 font-sans text-slate-100 antialiased overflow-x-hidden">
      {/* Header */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-4 border-b border-slate-800 bg-gray-900 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3">
          <img
            src="https://customer-assets.emergentagent.com/job_nihongo-studio/artifacts/3dxeu67p_logo.png"
            alt="Nihongo Next"
            className="h-9 w-auto object-contain"
          />
          <span className="text-white text-xl font-bold tracking-tight">Nihongo Next</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8">
          {['Home', 'Blog', 'Courses', 'About'].map((item) => (
            <Link
              key={item}
              to={item === 'Home' ? '/' : item === 'Blog' ? '/blog' : '/'}
              className="text-slate-300 hover:text-white text-sm font-medium transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>
        <Link
          to="/signup"
          className="flex items-center justify-center px-6 h-10 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold transition-colors shadow-sm"
        >
          Sign Up
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[540px] border border-slate-700/20">
          {/* Left — Image Panel */}
          <div
            className="relative w-full lg:w-1/2 min-h-[220px] lg:min-h-full flex flex-col justify-end p-8 lg:p-12 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfpCPNCumt3xgbQjegNjx0KHsAIDC6k9zhIXIn2MRCAWokCyCsCNdKfJj9rzEfg_mtSugZSnRp8TNxJK6lkmNbWtPY_4gzPh_SyTxdXktFmkUZ6o-DiHBle7CZsCs_tTD9feNS-viJ4wbJFwwMQyVZJI8BxJh7efsndRtcD1AK1FmBrcjNTuTJb7KN9kWGhUnyafDc-Wus04Ko_E1xHHJb1swg9yN8UfBy-9WHHjJbtxT1T3X3H4Y_Op0z6gWsXKIxhxENXLCZcM4')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent" />
            <div className="relative z-10 text-white">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-medium uppercase tracking-wider">
                🌸 Welcome Back
              </div>
              <h3 className="text-3xl font-bold mb-2">Continue Your Journey</h3>
              <p className="text-slate-200 text-lg opacity-90 font-light">
                Log in to access your lessons, blog posts, and study progress.
              </p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center bg-white text-slate-900">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Welcome back</h1>
                <p className="text-slate-500 text-sm">
                  Sign in to continue learning Japanese.
                </p>
              </div>

              {/* SSO Buttons */}
              <div className="flex flex-col gap-3 mb-6">
                <button className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-400">Or continue with email</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-slate-900 text-sm font-semibold">Email Address</span>
                  <input
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-900 text-sm font-semibold">Password</span>
                    <button type="button" className="text-xs text-primary hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full h-12 pl-4 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </label>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white text-base font-bold transition-all shadow-lg disabled:opacity-60"
                >
                  {loading ? 'Signing in…' : 'Log In'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Don't have an account?{' '}
                <Link to="/signup" className="font-bold text-primary hover:text-primary/80 transition-colors">
                  Sign up free
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-slate-500 text-sm bg-gray-950 border-t border-slate-800">
        <p>© {new Date().getFullYear()} Nihongo Next. All rights reserved.</p>
      </footer>
    </div>
  );
}
