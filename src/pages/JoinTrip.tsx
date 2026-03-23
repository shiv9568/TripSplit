import { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ShieldCheck, Sparkles, UserPlus } from 'lucide-react';
import { tripApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

export default function JoinTrip() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { currentUser, setCurrentUser, setLastTripId } = useApp();
  const { showToast } = useToast();
  const nameInputRef = useRef<HTMLInputElement>(null);
  const codeInputRef = useRef<HTMLInputElement>(null);
  
  const joinCodeFromUrl = searchParams.get('code') || '';
  const hasCodeInUrl = joinCodeFromUrl.length >= 4;
  
  const [joinCode, setJoinCode] = useState(joinCodeFromUrl);
  const [guestName, setGuestName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(hasCodeInUrl ? 2 : 1);
  const [tripName, setTripName] = useState('');

  const [pendingTrip, setPendingTrip] = useState<{ id: string; name: string } | null>(() => {
    const saved = localStorage.getItem('tripsplit_pending_join');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (hasCodeInUrl && !pendingTrip) {
      tripApi.getTripByInviteCode(joinCodeFromUrl)
        .then(({ data }) => {
          setTripName(data.name);
        })
        .catch(() => {});
    }
  }, [hasCodeInUrl, joinCodeFromUrl, pendingTrip]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 1) {
        codeInputRef.current?.focus();
      } else {
        nameInputRef.current?.focus();
      }
    }, 150);
    return () => clearTimeout(timer);
  }, [step, hasCodeInUrl]);

  useEffect(() => {
    let interval: any;
    const nameToCheck = guestName.trim() || currentUser?.name;
    if (pendingTrip && nameToCheck) {
      console.log('Polling status for trip', pendingTrip.id, 'with name', nameToCheck);
      interval = setInterval(async () => {
        try {
          const { data } = await tripApi.checkStatus(pendingTrip.id, nameToCheck);
          console.log('Status update:', data.status);
          if (data.status === 'approved') {
            if (!currentUser) setCurrentUser({ id: crypto.randomUUID(), name: nameToCheck as string, email: '' });
            localStorage.removeItem('tripsplit_pending_join');
            setLastTripId(pendingTrip.id);
            showToast('Access Granted! Welcome aboard.', 'success');
            navigate(`/trip/${pendingTrip.id}`);
            clearInterval(interval);
          } else if (data.status === 'none') {
            localStorage.removeItem('tripsplit_pending_join');
            setPendingTrip(null);
            showToast('Request closed.', 'info');
          }
        } catch (e) {
          console.error('Status check error', e);
        }
      }, 3000); // Poll every 3s for snappier experience
    }
    return () => clearInterval(interval);
  }, [pendingTrip, currentUser, guestName, navigate]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      if (!joinCode || joinCode.length < 4) {
        showToast('Please enter a valid invite code', 'error');
        return;
      }
      // Always go to name confirmation step now
      if (currentUser && !guestName) setGuestName(currentUser.name);
      setStep(2);
      return;
    }

    const finalName = guestName.trim() || currentUser?.name;
    if (!finalName) {
      showToast('Please provide your name.', 'error');
      return;
    }
    performJoin(joinCode, finalName);
  };

  const performJoin = async (code: string, name: string) => {
    setIsSubmitting(true);
    try {
      const { data } = await tripApi.join(code, name);
      if (data.pending) {
         showToast(data.message || 'Request sent to admin for approval.', 'info');
         const pendingData = { id: data.tripId, name: name };
         localStorage.setItem('tripsplit_pending_join', JSON.stringify(pendingData));
         setPendingTrip(pendingData);
         return;
      }
      if (!currentUser) setCurrentUser({ id: crypto.randomUUID(), name, email: '' });
      showToast('Successfully joined!', 'success');
      setLastTripId(data._id);
      navigate(`/trip/${data._id}`);
    } catch (err: any) {
      showToast(err?.response?.data?.error || 'Invalid code or name.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cancelPending = () => {
    localStorage.removeItem('tripsplit_pending_join');
    setPendingTrip(null);
    setStep(1);
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none opacity-50" />
      
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
           <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg shadow-indigo-100 italic">
              <img src="/logo.png" alt="TripSplit Logo" className="w-full h-full object-cover" />
           </div>
           <span className="text-base font-black tracking-tight">TripSplit</span>
        </div>
        <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {pendingTrip ? (
             <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
                <div className="relative inline-block">
                   <div className="absolute inset-0 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" />
                   <div className="relative w-32 h-32 bg-white rounded-[2.5rem] shadow-2xl border border-indigo-50 flex items-center justify-center mx-auto">
                      <div className="w-16 h-16 border-4 border-slate-100 border-t-indigo-600 rounded-full animate-spin" />
                   </div>
                </div>
                <div className="space-y-4">
                   <h1 className="text-4xl font-black text-[#0B1A2C] tracking-tighter">Waiting for <br /> <span className="text-indigo-600 italic">Approval</span></h1>
                   <p className="text-slate-400 font-bold text-sm max-w-[280px] mx-auto leading-relaxed">
                      We've notified the trip admin. You'll be automatically redirected the moment they click approve!
                   </p>
                </div>
                <button 
                  onClick={cancelPending}
                  className="px-8 py-3 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-500 transition-colors"
                >
                   Cancel Request
                </button>
             </div>
) : (
              <>
                <div className="text-center space-y-4">
                   {hasCodeInUrl && tripName ? (
                     <>
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <ShieldCheck size={14} /> Join Trip
                       </div>
                       <h1 className="text-4xl sm:text-5xl font-black tracking-tighter leading-tight">
                          Welcome to <br /> <span className="text-indigo-600 italic">{tripName}</span>
                       </h1>
                       <p className="text-slate-400 font-bold text-sm">Just enter your name to join this trip</p>
                     </>
                   ) : (
                     <>
                       <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
                          <ShieldCheck size={14} /> Secure Invitation
                       </div>
                       <h1 className="text-5xl font-black tracking-tighter leading-tight">
                          Enter the <br /> <span className="text-indigo-600 italic">Invite Code</span>
                       </h1>
                     </>
                   )}
                </div>

                <form onSubmit={handleJoin} className="space-y-8">
                   <div className="space-y-4">
                     {step === 1 ? (
                       <div className="space-y-6">
                          <div className="text-center space-y-2">
                             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">Step 1: Invite Code</h2>
                          </div>
                          <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition-opacity pointer-events-none" />
                               <input
                              ref={codeInputRef}
                              type="text"
                              inputMode="text"
                              autoCorrect="off"
                              spellCheck="false"
                              value={joinCode}
                              onChange={(e) => setJoinCode(e.target.value.toUpperCase().replace(/\s/g, ''))}
                              placeholder="TRP001"
                              className="relative z-10 w-full bg-white border-2 border-indigo-100 rounded-[2rem] px-6 py-5 text-2xl sm:text-3xl font-mono text-center tracking-[0.3em] sm:tracking-[0.5em] focus:bg-white focus:border-indigo-400 outline-none transition-all placeholder:text-slate-200 text-[#0B1A2C]"
                              required
                              autoComplete="off"
                              autoCapitalize="characters"
                            />
                          </div>
                       </div>
                     ) : (
                       <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
                          <div className="text-center space-y-2">
                             <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest">{hasCodeInUrl ? 'Your Name' : 'Step 2: Who are you?'}</h2>
                          </div>
                          <div className="relative group">
                              <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-indigo-500 rounded-3xl blur opacity-10 group-focus-within:opacity-25 transition-opacity pointer-events-none" />
                               <input 
                              ref={nameInputRef}
                              type="text"
                              inputMode="text"
                              autoCorrect="off"
                              spellCheck="false"
                              value={guestName}
                              onChange={(e) => setGuestName(e.target.value)}
                              placeholder="Enter your name"
                              className="relative z-10 w-full bg-white border-2 border-indigo-100 rounded-[2rem] px-6 py-5 text-xl sm:text-2xl font-bold text-center text-[#0B1A2C] placeholder:text-slate-200 focus:border-indigo-500 outline-none transition-all"
                              required
                              autoComplete="name"
                            />
                          </div>
                          {!hasCodeInUrl && (
                            <button type="button" onClick={() => setStep(1)} className="w-full text-xs font-black text-slate-300 hover:text-indigo-600 uppercase tracking-widest">Change Code</button>
                          )}
                       </div>
                     )}
                   </div>

                   <button 
                     type="submit"
                     disabled={isSubmitting || (step === 1 && joinCode.length < 4) || (step === 2 && !guestName.trim() && !currentUser)}
                     className="w-full relative group/btn"
                   >
                      <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl group-hover/btn:blur-2xl opacity-20 group-hover/btn:opacity-40 transition-all" />
                      <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-7 rounded-[2rem] text-xl font-black shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                        {isSubmitting ? 'Hang tight...' : (
                          <>
                            {hasCodeInUrl ? 'Join Trip' : (step === 1 ? 'Verify Code' : 'Request Access')} <ArrowRight size={24} strokeWidth={3} />
                          </>
                        )}
                      </div>
                   </button>
                </form>
              </>
           )}

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
            Logged in as <span className="text-indigo-600 uppercase tracking-widest">{currentUser?.name || 'Guest'}</span>
         </p>
      </footer>
    </div>
  );
}
