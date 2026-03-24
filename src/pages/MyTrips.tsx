import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, Home, LayoutGrid, Clock, User, Plus, 
  Users, Calendar, ArrowRight, Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { tripApi } from '../utils/api';
import { useToast } from '../components/Toast';
import { MyTripsSkeleton } from '../components/Skeleton';

export default function MyTrips() {
  const navigate = useNavigate();
  const { currentUser, setLastTripId } = useApp();
  const { showToast } = useToast();
  
  const [trips, setTrips] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      navigate('/authUser');
      return;
    }
    fetchTrips();
  }, [currentUser]);

  const fetchTrips = async () => {
    try {
      if (!currentUser) return;
      const { data } = await tripApi.getAll(currentUser.name, currentUser.email);
      setTrips(data);
    } catch {
      showToast('Error loading your trips', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Delete this trip entire group?')) return;
    try {
      await tripApi.delete(id);
      setTrips(trips.filter(t => t._id !== id));
      showToast('Trip group deleted', 'info');
    } catch {
      showToast('Action failed', 'error');
    }
  };

  if (isLoading && trips.length === 0) return <MyTripsSkeleton />;

  return (
    <div className="min-h-screen bg-[#FAF7F4] pb-32 font-sans overflow-x-hidden relative">
      {/* Design Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[400px] h-[400px] bg-teal-50/40 rounded-full blur-[100px] pointer-events-none" />

      <header className="relative z-10 px-6 pt-10 pb-6 max-w-2xl mx-auto w-full space-y-2">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <span className="text-[10px] font-black uppercase tracking-[0.3em] text-indigo-500">Voyager Dashboard</span>
               <h1 className="text-4xl font-black text-[#1a1035] tracking-tight">Your Trips</h1>
            </div>
            <button 
               onClick={() => navigate('/create-trip')}
               aria-label="Create new trip"
               className="w-14 h-14 bg-indigo-600 rounded-[22px] flex items-center justify-center text-white shadow-xl shadow-indigo-200 hover:scale-110 active:scale-95 transition-all"
            >
               <Plus size={28} strokeWidth={3} />
            </button>
         </div>
      </header>

      <main className="relative z-10 p-6 max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
         
         {trips.length === 0 ? (
            <div className="bg-white rounded-[3rem] p-12 text-center border-2 border-dashed border-slate-100 space-y-6">
               <div className="w-20 h-20 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center mx-auto">
                  <Globe size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-xl font-black text-[#1a1035]">No active journeys</h3>
                  <p className="text-slate-400 font-bold max-w-xs mx-auto text-sm leading-relaxed">Join a group with a code or start your own trip to begin logging expenses.</p>
               </div>
               <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={() => navigate('/join')} 
                    className="bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg"
                  >
                     Join Existing Trip
                  </button>
                  <button 
                    onClick={() => navigate('/create-trip')} 
                    className="bg-white border-2 border-slate-100 text-slate-500 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:border-indigo-100 transition-colors"
                  >
                     Start New Trip
                  </button>
               </div>
            </div>
         ) : (
            <div className="space-y-4">
               {trips.map((trip) => (
                  <div 
                    key={trip._id}
                    onClick={() => {
                        setLastTripId(trip._id);
                        navigate(`/trip/${trip._id}`);
                    }}
                    className="group relative bg-white p-7 rounded-[3rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer overflow-hidden border-l-8 border-l-indigo-600"
                  >
                     <div className="flex items-start justify-between">
                        <div className="space-y-4 flex-1">
                           <div className="space-y-1">
                              <h3 className="text-2xl font-black text-[#1a1035] group-hover:text-indigo-600 transition-colors">{trip.name}</h3>
                              <p className="text-slate-400 font-bold text-xs line-clamp-1 pr-10">{trip.description || 'No description provided'}</p>
                           </div>

                           <div className="flex flex-wrap gap-4 items-center">
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <Users size={14} className="text-indigo-500" />
                                 {trip.members.length} Members
                              </div>
                              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400">
                                 <Calendar size={14} className="text-indigo-500" />
                                 {new Date(trip.createdAt).toLocaleDateString()}
                              </div>
                           </div>
                        </div>

                        <div className="flex flex-col items-end gap-4">
                            {(trip.createdBy === currentUser?.email || trip.createdBy === currentUser?.name) ? (
                               <button 
                                 onClick={(e) => handleDelete(e, trip._id)}
                                 aria-label={`Delete trip ${trip.name}`}
                                 className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center text-rose-300 hover:bg-rose-600 hover:text-white transition-all"
                               >
                                  <Trash2 size={18} />
                               </button>
                            ) : (
                               <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-300">
                                  <ArrowRight size={18} />
                               </div>
                            )}
                        </div>
                     </div>

                     {/* Progress garnish */}
                     <div className="absolute top-4 right-4 text-xs font-black italic text-indigo-100 group-hover:text-indigo-500 transition-colors">
                        # {trip.inviteCode}
                     </div>
                  </div>
               ))}
            </div>
         )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-8 left-6 right-6 z-50">
         <div className="max-w-md mx-auto bg-white/80 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl p-3 flex items-center justify-between">
            <button 
               onClick={() => navigate('/trips')}
               className="flex flex-col items-center gap-1 flex-1 py-1 text-indigo-600"
            >
               <Home size={22} strokeWidth={3} />
               <span className="text-[10px] font-black uppercase tracking-widest">Trips</span>
               <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full mt-0.5" />
            </button>
            <button 
               disabled
               className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-300"
            >
               <LayoutGrid size={22} strokeWidth={2.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
            </button>
            <button 
               disabled
               className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-300 opacity-50"
            >
               <Clock size={22} strokeWidth={2.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">History</span>
            </button>
            <button 
               onClick={() => navigate('/profile')}
               className="flex flex-col items-center gap-1 flex-1 py-1 text-slate-400 group hover:text-indigo-600 transition-colors"
            >
               <User size={22} strokeWidth={2.5} />
               <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
            </button>
         </div>
      </nav>
    </div>
  );
}
