import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Globe, ArrowRight, Mail, Lock, User, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function AuthPage() {
  const navigate = useNavigate();
  const { setCurrentUser } = useApp();
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (name || email) {
      setCurrentUser(name || email.split('@')[0]);
      navigate('/dashboard');
    }
  };

  const handleGoogleLogin = () => {
    setCurrentUser('Google User');
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-100 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-teal-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <button 
          onClick={() => navigate('/')}
          className="absolute top-6 left-6 w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors z-20"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>

        <div className="text-center mb-8 space-y-3">
          <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-slate-100 flex items-center justify-center mx-auto transform -rotate-6 hover:rotate-0 transition-transform">
            <Globe className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-black text-[#0B1A2C] tracking-tighter">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-400 font-bold text-sm">
            {isLogin ? 'Enter your details to access your trips.' : 'Join TripSplit to travel smarter.'}
          </p>
        </div>

        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-slate-100 space-y-6">
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User size={18} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#0B1A2C] placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail size={18} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@email.com"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#0B1A2C] placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={18} className="text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-[#0B1A2C] placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-all"
                />
              </div>
              {isLogin && (
                <div className="flex justify-end pt-1">
                  <button type="button" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">Forgot Password?</button>
                </div>
              )}
            </div>

            <button type="submit" className="w-full relative group pt-2">
              <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl group-hover:blur-2xl opacity-20 transition-all top-2" />
              <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-4 rounded-2xl text-sm font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95">
                {isLogin ? 'Sign In' : 'Create Account'} <ArrowRight size={18} />
              </div>
            </button>
          </form>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-100"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-black uppercase tracking-widest text-slate-300">OR</span>
            <div className="flex-grow border-t border-slate-100"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="w-full bg-white border-2 border-slate-100 hover:border-slate-200 text-[#0B1A2C] py-4 rounded-2xl text-sm font-black shadow-sm flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="text-center mt-6 text-sm font-bold text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button onClick={() => setIsLogin(!isLogin)} className="text-indigo-600 hover:underline hover:text-indigo-700">
            {isLogin ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
