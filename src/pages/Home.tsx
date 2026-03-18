import { useState, memo } from 'react';
import { Plane, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import Dashboard from './Dashboard';

export default function Home() {
  const { currentUser, setCurrentUser } = useApp();
  const [nameInput, setNameInput] = useState('');

  if (currentUser) {
    return <Dashboard />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#0a0a0c] flex items-center justify-center p-6 selection:bg-indigo-500/30">
      {/* Dynamic Animated Background */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-purple-600/15 rounded-full blur-[80px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <main className="relative z-10 w-full max-w-lg animate-in fade-in zoom-in-95 duration-700">
        {/* Logo and Tagline */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] animate-bounce">
             <ShieldCheck size={14} /> Global Encryption Active
          </div>
          <div className="flex items-center justify-center gap-3">
             <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-indigo-600/40 transform rotate-6 hover:rotate-0 transition-transform cursor-pointer">
                <Plane className="text-white w-8 h-8" size={32} />
             </div>
             <h1 className="text-5xl font-black tracking-tighter text-white">
                TripSplit
             </h1>
          </div>
        </div>

        {/* Login Glass Card */}
        <div className="relative group">
           {/* Card Glowing Border */}
           <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-teal-400 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition-opacity" />
           
           <div className="relative bg-[#121216]/80 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-10 shadow-2xl space-y-8">
              <div className="space-y-2">
                 <h2 className="text-3xl font-black text-white leading-tight">Identify <br /> Yourself</h2>
                 <p className="text-slate-500 font-bold text-sm">Enter the traveler's name to unlock <br /> your secure dashboard.</p>
              </div>

              <div className="space-y-6">
                 <div className="space-y-3">
                    <label className="text-xs font-black text-slate-400 uppercase tracking-widest pl-2">Full Legal Name</label>
                    <div className="relative group/input">
                       <div className="absolute inset-0 bg-indigo-500/10 rounded-2xl blur-sm opacity-0 group-focus-within/input:opacity-100 transition-opacity" />
                       <input 
                         type="text"
                         value={nameInput}
                         onChange={(e) => setNameInput(e.target.value)}
                         placeholder="e.g. John Wick"
                         className="relative w-full bg-black/40 border border-white/5 rounded-2xl px-6 py-5 text-xl font-bold text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                       />
                    </div>
                 </div>

                 <button 
                   onClick={() => nameInput.trim() && setCurrentUser(nameInput)}
                   className="w-full relative group/btn"
                   disabled={!nameInput.trim()}
                 >
                    <div className="absolute inset-0 bg-indigo-600 rounded-2xl blur-xl group-hover/btn:blur-2xl opacity-40 group-hover/btn:opacity-60 transition-all" />
                    <div className="relative bg-indigo-600 hover:bg-indigo-500 text-white py-5 rounded-2xl text-xl font-black shadow-2xl shadow-indigo-600/40 flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale">
                       Unlock Access <ArrowRight size={24} strokeWidth={3} />
                    </div>
                 </button>
              </div>

              <div className="pt-6 border-t border-white/5 flex items-center justify-center gap-8">
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Trips</span>
                    <span className="text-indigo-400 font-black">2.4k+</span>
                 </div>
                 <div className="w-px h-8 bg-white/5" />
                 <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Global Status</span>
                    <span className="text-teal-400 font-black">Online</span>
                 </div>
              </div>
           </div>
        </div>

        {/* Bottom Helper */}
        <p className="mt-12 text-center text-slate-600 text-sm font-bold flex items-center justify-center gap-2">
           <Sparkles size={16} /> Premium splitting for modern explorers.
        </p>
      </main>
    </div>
  );
}
