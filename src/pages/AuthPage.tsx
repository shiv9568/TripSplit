import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Plane, MapPin, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setCurrentUser, currentUser, setToken } = useApp();

  // Redirect destination passed via navigate('/authUser', { state: { from: '/create-trip' } })
  const state = location.state as { from?: string; initialMode?: 'login' | 'signup' };
  const redirectTo = state?.from || '/trips';

  // Already logged in — send them straight to their destination
  useEffect(() => {
    if (currentUser) {
      navigate(redirectTo, { replace: true });
    }
  }, [currentUser, navigate, redirectTo]);

  const [isLogin, setIsLogin] = useState(state?.initialMode !== 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  useEffect(() => {
    document.title = isLogin ? 'Sign In | TripSplit' : 'Create Account | TripSplit';
  }, [isLogin]);

  const switchMode = () => {
    setAnimating(true);
    setTimeout(() => {
      setIsLogin(prev => !prev);
      setAnimating(false);
    }, 200);
  };

  const [error, setError] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const endpoint = isLogin ? '/api/users/login' : '/api/users/register';
      const body = isLogin 
        ? { email, password } 
        : { name, email, password };

      const baseUrl = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:5000`;
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // data contains { user: { id, name, email }, token }
      setToken(data.token);
      setCurrentUser(data.user);
      
      // Success! 
      navigate(redirectTo, { replace: true });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans" style={{ background: '#FAF7F4' }}>

      {/* ── Left Panel: Decorative (desktop only) ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[45%] relative overflow-hidden p-12"
        style={{ background: 'linear-gradient(145deg, #eef2ff 0%, #e0e7ff 60%, #c7d2fe 100%)' }}
      >
        {/* Arch shape */}
        <div
          className="absolute top-12 right-0 w-72 h-96 rounded-l-full"
          style={{ background: 'rgba(255,255,255,0.35)', backdropFilter: 'blur(12px)' }}
        />
        <div
          className="absolute bottom-32 -left-12 w-56 h-56 rounded-full"
          style={{ background: 'rgba(255,255,255,0.2)' }}
        />
        {/* Dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #a5b4fc 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.4,
          }}
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            <Globe className="text-white w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-indigo-900 tracking-tight">TripSplit</span>
        </div>

        {/* Illustration area */}
        <div className="relative z-10 flex flex-col items-center justify-center flex-1 py-10">
          <div className="relative">
            {/* Arch backdrop */}
            <div
              className="w-56 h-72 rounded-t-full mx-auto"
              style={{ background: 'rgba(255,255,255,0.5)' }}
            />
            {/* Floating cards */}
            <div className="absolute -top-4 -left-10 bg-white rounded-2xl p-3 shadow-xl border border-indigo-50 flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center">
                <MapPin className="w-4 h-4 text-indigo-600" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-700">Destination</p>
                <p className="text-[9px] text-indigo-400 font-semibold">Goa, India</p>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-10 bg-white rounded-2xl p-3 shadow-xl border border-indigo-50 flex items-center gap-2">
              <div className="w-8 h-8 bg-violet-100 rounded-xl flex items-center justify-center">
                <Plane className="w-4 h-4 text-violet-500" />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-700">Next Trip</p>
                <p className="text-[9px] text-violet-400 font-semibold">4 friends, ₹24,000</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom tagline */}
        <div className="relative z-10 space-y-2">
          <p className="text-2xl font-black text-indigo-900 leading-snug">
            Travel together,<br />settle simply.
          </p>
          <p className="text-sm text-indigo-600 font-semibold max-w-xs leading-relaxed opacity-80">
            Create trips, track every rupee, and split bills effortlessly with your crew.
          </p>
        </div>
      </div>

      {/* ── Right Panel: Form ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-2 mb-10">
          <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shadow">
            <Globe className="text-white w-5 h-5" />
          </div>
          <span className="text-xl font-black text-[#1a1035]">TripSplit</span>
        </div>

        <div className="w-full max-w-[400px] space-y-8">

          {/* Header */}
          <div
            style={{
              opacity: animating ? 0 : 1,
              transform: animating ? 'translateY(8px)' : 'translateY(0)',
              transition: 'opacity 0.2s ease, transform 0.2s ease',
            }}
          >
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500 mb-2">
              {isLogin ? 'Welcome Back' : 'Get Started'}
            </p>
            <h1 className="text-3xl sm:text-4xl font-black text-[#1a1035] leading-tight">
              {isLogin ? 'Sign in to your account' : 'Create your account'}
            </h1>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 text-[13px] font-black animate-in fade-in slide-in-from-top-2">
                <div className="w-1.5 h-1.5 bg-red-400 rounded-full shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Form */}
          <form
            onSubmit={handleAuth}
            className="space-y-4"
            style={{ opacity: animating ? 0 : 1, transition: 'opacity 0.2s ease' }}
          >
            {/* Name — signup only */}
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                  Full Name
                </label>
                <div className="relative">
                  <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold text-[#1a1035] bg-white border-2 border-slate-200 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all duration-200"
                  />
                </div>
              </div>
            )}

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="email@gmail.com"
                  className="w-full rounded-2xl py-4 pl-11 pr-4 text-sm font-semibold text-[#1a1035] bg-white border-2 border-slate-200 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all duration-200"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest pl-1">
                Password
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl py-4 pl-11 pr-12 text-sm font-semibold text-[#1a1035] bg-white border-2 border-slate-200 placeholder:text-slate-300 focus:outline-none focus:border-indigo-400 transition-all duration-200"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 hover:text-indigo-400 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    className="text-xs font-bold text-indigo-400 hover:text-indigo-600 transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>
              )}
            </div>

            {/* Submit button — same indigo as landing page CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl font-black text-sm text-white transition-all duration-200 active:scale-[0.97] disabled:opacity-70"
                style={{
                  background: loading ? '#a5b4fc' : '#4f46e5',
                  boxShadow: loading ? 'none' : '0 8px 28px rgba(79,70,229,0.35)',
                }}
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                    {isLogin ? 'Signing in…' : 'Creating account…'}
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Switch mode */}
          <p className="text-center text-sm font-semibold text-slate-400">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button
              onClick={switchMode}
              className="font-black text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors"
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </button>
          </p>

          {/* Back to home */}
          <p className="text-center">
            <button
              onClick={() => navigate('/')}
              className="text-xs font-bold text-slate-300 hover:text-indigo-400 transition-colors"
            >
              ← Back to home
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
