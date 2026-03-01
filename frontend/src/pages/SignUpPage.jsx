import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { register } from '@/lib/api';

export function SignUpPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      setError('All fields are required.');
      return;
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setLoading(true);
    try {
      const { data } = await register(form);
      localStorage.setItem('nn_token', data.token);
      localStorage.setItem('nn_user', JSON.stringify(data.user));
      navigate('/blog');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
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
          to="/login"
          className="flex items-center justify-center px-6 h-10 rounded-lg bg-white/5 hover:bg-white/10 text-white border border-white/10 text-sm font-bold transition-colors"
        >
          Log In
        </Link>
      </header>

      {/* Main */}
      <main className="flex-1 flex items-center justify-center p-4 md:p-10">
        <div className="w-full max-w-[1100px] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col lg:flex-row min-h-[580px] border border-slate-700/20">
          {/* Left — Image Panel */}
          <div
            className="relative w-full lg:w-1/2 min-h-[260px] lg:min-h-full flex flex-col justify-end p-8 lg:p-12 bg-cover bg-center"
            style={{
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuC-OZsgVi8DJG90StbiOr8rlG2c39xw8ZFMCEHWA7qc8bFCBS0G7BWfCsHcsOmm2E3h8KH7ugVALsvpjdpcBgA4pHxUpvNjRGvgfNCcnWdx063oi83dtHN87DCo8aXbZhqHIXtrSznrpNxqcdWvZRc5T49bSjyGwFp3q_yzFRTe2ANLAARX8V1ULWc9mPViYvXFEk2ST98x7F654lN2ROn5JgOOhwHNxziYX2VMA3XlPwfeydXnYyR1_xAlcfvv2y-44B_ATCWh6fc')`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950/90 via-gray-900/40 to-transparent" />
            <div className="relative z-10 text-white">
              <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/10 text-xs font-medium uppercase tracking-wider">
                🎓 Learn Japanese
              </div>
              <h3 className="text-3xl font-bold mb-2">Master Nihongo Today</h3>
              <p className="text-slate-200 text-lg opacity-90 font-light">
                Join over 10,000 students learning Japanese with our interactive platform.
              </p>
            </div>
          </div>

          {/* Right — Form Panel */}
          <div className="w-full lg:w-1/2 p-8 lg:p-14 flex flex-col justify-center bg-white text-slate-900">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Create an account</h1>
                <p className="text-slate-500 text-sm mb-1">
                  Join our community to access exclusive blog posts and study materials.
                </p>
                <p className="text-primary text-sm font-semibold">Unlock our exclusive blog and resources.</p>
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
                  Sign up with Google
                </button>
                <button className="flex items-center justify-center gap-3 w-full h-12 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-slate-700 font-medium text-sm">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12.017 24c6.624 0 11.99-5.367 11.99-11.987C24.007 5.367 18.641 0 12.017 0z"/>
                  </svg>
                  Sign up with Apple
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
                  <span className="text-slate-900 text-sm font-semibold">Full Name</span>
                  <input
                    name="name"
                    type="text"
                    placeholder="e.g. Kenji Tanaka"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                  />
                </label>
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
                  <span className="text-slate-900 text-sm font-semibold">Password</span>
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
                  {loading ? 'Creating account…' : 'Create Account'}
                </button>
              </form>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="font-bold text-primary hover:text-primary/80 transition-colors">
                  Log in
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
