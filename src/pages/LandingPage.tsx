import { useNavigate } from 'react-router-dom';
import { Globe, Plane, Users, Receipt, ArrowRight, Sparkles, PieChart, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const handleStart = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // Home wrapper handles login
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      {/* Premium Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-teal-400 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg transform rotate-3">
              <Globe className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tight text-[#0B1A2C]">TripSplit</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-bold text-sm text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <button onClick={handleStart} className="bg-[#0B1A2C] text-white px-6 py-2.5 rounded-full hover:bg-indigo-600 transition-all shadow-md">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] bg-indigo-50 rounded-full blur-3xl opacity-60 z-0" />
        <div className="absolute bottom-10 left-[-5%] w-[400px] h-[400px] bg-teal-50 rounded-full blur-3xl opacity-60 z-0" />

        <div className="max-w-7xl mx-auto relative z-10 grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left space-y-8">
            <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest border border-indigo-100">
              <Sparkles size={14} /> The Future of Group Travel
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#0B1A2C] leading-tight tracking-tight">
              Split Bills, <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Not Friendships.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 font-medium leading-relaxed max-w-xl">
              The premium way to track expenses, manage balances, and settle up on your group trips. Elegant, intuitive, and built for modern travelers.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <button 
                onClick={handleStart}
                className="w-full sm:w-auto bg-[#0B1A2C] text-white text-lg font-extrabold px-10 py-5 rounded-2xl hover:bg-indigo-600 hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-2 group"
              >
                Start Your Trip <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="flex items-center gap-3 text-[#0B1A2C] font-black px-6 py-4 hover:bg-slate-50 rounded-2xl transition-colors">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <Plane size={20} />
                </div>
                See Demo
              </button>
            </div>
          </div>

          {/* Interactive Mockup */}
          <div className="relative animate-in fade-in slide-in-from-right-10 duration-1000">
            <div className="relative z-10 bg-slate-900 rounded-[3rem] p-4 shadow-2xl border-8 border-slate-800 transform md:rotate-3">
              {/* Fake Mobile Screen */}
              <div className="bg-[#f8fcfb] rounded-[2.5rem] overflow-hidden aspect-[9/19] w-full max-w-[320px] mx-auto relative">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-10 h-10 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center">
                      <Users size={20} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                      <div className="w-1 h-1 bg-slate-300 rounded-full" />
                    </div>
                  </div>
                  
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">My Trip</h3>
                  <h2 className="text-2xl font-black text-[#0B1A2C] mb-6 whitespace-nowrap">Paris Escape 🇫🇷</h2>
                  
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
                    <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Spent</p>
                    <p className="text-3xl font-black text-[#0B1A2C]">₹42,500</p>
                    <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                      <div className="w-3/4 h-full bg-teal-400" />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-white/50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 font-bold">🍕</div>
                        <div className="text-[11px] font-bold text-[#0B1A2C]">Dinner at Loup</div>
                      </div>
                      <div className="text-[11px] font-black">₹4,200</div>
                    </div>
                    <div className="flex items-center justify-between bg-white/50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 font-bold">🚕</div>
                        <div className="text-[11px] font-bold text-[#0B1A2C]">Airport Taxi</div>
                      </div>
                      <div className="text-[11px] font-black">₹1,800</div>
                    </div>
                  </div>
                </div>
                {/* Bottom Nav Mockup */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-slate-100 px-6 flex items-center justify-between">
                  <div className="w-4 h-4 bg-indigo-600 rounded-full" />
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                  <div className="w-10 h-10 bg-[#0B1A2C] rounded-full flex items-center justify-center shadow-lg -mt-8">
                    <Receipt size={16} className="text-white" />
                  </div>
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                  <div className="w-4 h-4 bg-slate-200 rounded-full" />
                </div>
              </div>
            </div>
            {/* Floating Accents */}
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl z-0 blur-xl animate-pulse" />
            <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-full z-0 blur-2xl opacity-40" />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 px-6 bg-[#f8fcfb]">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.3em]">Features</h2>
            <h3 className="text-4xl md:text-5xl font-black text-[#0B1A2C]">Everything for the <span className="text-teal-500 italic">perfect</span> trip.</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Receipt className="text-indigo-600" size={24} />, title: 'Smart ledger', desc: 'Real-time expense tracking with categorical breakdown and smart insights.' },
              { icon: <Users className="text-teal-500" size={24} />, title: 'Team Settle', desc: 'Minimal transactions algorithm to settle debts between any number of people.' },
              { icon: <Globe className="text-orange-500" size={24} />, title: 'Multi-Currency', desc: 'Automatic conversion for international trips. No more manual math.' },
              { icon: <PieChart className="text-emerald-500" size={24} />, title: 'Visual analytics', desc: 'Beautiful charts showing who spent what and where the money goes.' },
              { icon: <ShieldCheck className="text-blue-500" size={24} />, title: 'Private & Secure', desc: 'Your trip data is encrypted and shared only with the people you invite.' },
              { icon: <Sparkles className="text-purple-500" size={24} />, title: 'WhatsApp Scan', desc: 'Paste your group messages and our AI automatically parses the bills.' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                  {f.icon}
                </div>
                <h4 className="text-xl font-extrabold text-[#0B1A2C] mb-3">{f.title}</h4>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-teal-400 rounded-lg flex items-center justify-center transform rotate-3">
              <Globe className="text-white w-4 h-4" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#0B1A2C]">TripSplit</span>
          </div>
          <p className="text-slate-400 font-bold text-sm">© 2026 TripSplit. Build with precision.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-indigo-600 font-bold text-sm transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
