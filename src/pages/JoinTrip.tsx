import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plane, ArrowLeft, ArrowRight, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { tripApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

export default function JoinTrip() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const { showToast } = useToast();
  const [joinCode, setJoinCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCode || !currentUser) return;
    
    setIsSubmitting(true);
    try {
      const { data } = await tripApi.join(joinCode, currentUser);
      showToast('Successfully joined the trip!', 'success');
      navigate(`/trip/${data._id}`);
    } catch {
      showToast('Invalid invite code. Try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fbfa] flex flex-col font-sans text-[#0B1A2C]">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-indigo-50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[30%] h-[30%] bg-teal-50 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={24} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-100">
              <Plane size={16} className="text-white" />
           </div>
           <span className="text-base font-black tracking-tight">TripSplit</span>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <main className="flex-1 relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                <ShieldCheck size={14} /> Secure Invitation
             </div>
             <h1 className="text-5xl font-black tracking-tighter leading-tight">
                Enter the <br /> <span className="text-indigo-600 italic">Invite Code</span>
             </h1>
             <p className="text-slate-400 font-bold text-sm max-w-[280px] mx-auto">
                Ask your trip organizer for the 6-character unique code to jump in.
             </p>
          </div>

          <form onSubmit={handleJoin} className="space-y-8">
             <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition-opacity" />
                <input 
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                  placeholder="EX: TRP001"
                  maxLength={6}
                  className="relative w-full bg-white border-2 border-slate-100 rounded-3xl px-8 py-7 text-3xl font-black text-center tracking-[0.4em] text-[#0B1A2C] placeholder:text-slate-200 placeholder:tracking-normal focus:outline-none focus:border-indigo-500 shadow-xl transition-all font-mono"
                  required
                  autoFocus
                />
             </div>

             <button 
               type="submit"
               disabled={isSubmitting || joinCode.length < 3}
               className="w-full relative group/btn"
             >
                <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl group-hover/btn:blur-2xl opacity-20 group-hover/btn:opacity-40 transition-all" />
                <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-6 rounded-3xl text-lg font-black shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                  {isSubmitting ? 'Verifying...' : (
                    <>
                      Join Group <ArrowRight size={24} strokeWidth={3} />
                    </>
                  )}
                </div>
             </button>
          </form>

          {/* Helper Section */}
          <div className="pt-8 border-t border-slate-100 flex items-center justify-center gap-10">
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                   <UserPlus size={20} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Auto Join</span>
             </div>
             <div className="flex flex-col items-center gap-2">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 border border-slate-100">
                   <Sparkles size={20} />
                </div>
                <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Live Sync</span>
             </div>
          </div>
        </div>
      </main>

      {/* Footer Info */}
      <footer className="p-10 text-center">
         <p className="text-slate-400 text-xs font-bold">
            Logged in as <span className="text-indigo-600 uppercase tracking-widest">{currentUser}</span>
         </p>
      </footer>
    </div>
  );
}
