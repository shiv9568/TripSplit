import { useState, useEffect, useCallback, memo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, Users, Globe, ArrowRight, Clock, Trash2, Copy, Loader2, Plane, LayoutDashboard, History, Settings, ReceiptText } from 'lucide-react';
import { tripApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import type { Trip } from '../types';

const TripCard = memo(function TripCard({ trip, onDelete }: { trip: Trip; onDelete: (id: string) => void }) {
  const { showToast } = useToast();
  
  const copyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(trip.inviteCode);
    showToast('Invite code copied!', 'success');
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(trip._id);
  };

  return (
    <Link
      to={`/trip/${trip._id}`}
      className="group bg-white rounded-3xl p-5 border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-indigo-100/50 transition-colors" />
      
      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0 transform -rotate-3 group-hover:rotate-0 transition-transform">
            <Plane size={24} />
          </div>
          <button
            onClick={handleDelete}
            className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
          >
            <Trash2 size={18} />
          </button>
        </div>

        <div className="space-y-1">
          <h3 className="text-xl font-black text-[#0B1A2C] tracking-tight group-hover:text-indigo-600 transition-colors truncate">
            {trip.name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <Clock size={12} strokeWidth={3} />
            {new Date(trip.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex -space-x-2 overflow-hidden">
            {trip.members.slice(0, 3).map((m, i) => (
              <div 
                key={i} 
                className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-black text-white shadow-sm ring-1 ring-slate-100 ${
                  ['bg-indigo-400', 'bg-teal-400', 'bg-emerald-400', 'bg-orange-400'][i % 4]
                }`}
              >
                {m.name[0]?.toUpperCase()}
              </div>
            ))}
            {trip.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm ring-1 ring-slate-100">
                +{trip.members.length - 3}
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={copyCode}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-black text-[#0B1A2C] hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
            >
              <Copy size={12} /> {trip.inviteCode}
            </button>
            <div className="w-8 h-8 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={18} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
});

export default function Dashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadTrips = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await tripApi.getAll();
      setTrips(data);
    } catch {
      showToast('Failed to load trips', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadTrips();
  }, [loadTrips]);

  const handleDeleteTrip = async (tripId: string) => {
    if (!confirm('Delete this trip?')) return;
    try {
      await tripApi.delete(tripId);
      showToast('Trip deleted', 'success');
      loadTrips();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans text-slate-900 pb-32 overflow-x-hidden">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <LayoutDashboard className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-xl font-black text-[#0B1A2C] tracking-tight">Dashboard</h1>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentUser}</p>
            </div>
          </div>
          <button className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-indigo-100 transition-all">
            <div className="text-sm font-black text-indigo-600">{currentUser?.[0]?.toUpperCase()}</div>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-28 space-y-12">
        {/* Statistics / Summary Hero */}
        <section className="relative group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-800 rounded-[2.5rem] shadow-2xl shadow-indigo-200 transform md:-rotate-1 group-hover:rotate-0 transition-transform duration-500" />
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-6 text-center md:text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 text-indigo-100 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest backdrop-blur-lg">
                <Sparkles size={14} className="text-teal-300" /> Active Summary
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                Hey {currentUser?.split(' ')[0]}, <br />
                Ready to <span className="text-teal-300 italic">explore?</span>
              </h2>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <button onClick={() => navigate('/dashboard')} className="bg-[#0B1A2C] text-white px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-800 transition-colors shadow-xl active:scale-95">
                  <Plus size={20} /> Create New Trip
                </button>
                <Link to="/join" className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-slate-50 transition-colors shadow-lg active:scale-95">
                  <Users size={20} /> Join Trip
                </Link>
              </div>
            </div>
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
              {[
                { label: 'Total Trips', value: trips.length, color: 'text-indigo-200' },
                { label: 'Total Spent', value: '₹0', color: 'text-teal-300' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-xl border border-white/10 p-6 rounded-3xl space-y-1 min-w-[140px]">
                  <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest">{stat.label}</p>
                  <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Trips List Section */}
        <section className="space-y-8 pb-12">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#0B1A2C] flex items-center gap-3 tracking-tight">
              Your Trips <span className="text-slate-300">/</span> <span className="text-indigo-600 italic font-medium">{trips.length}</span>
            </h2>
          </div>
          
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-[200px] bg-slate-100 rounded-3xl animate-pulse" />
              ))}
            </div>
          ) : trips.length === 0 ? (
            <div className="bg-white rounded-[2.5rem] p-12 text-center border-2 border-dashed border-slate-100">
               <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Plane size={32} className="text-indigo-400 transform -rotate-12" />
               </div>
               <h3 className="text-2xl font-black text-[#0B1A2C] mb-3">No trips yet!</h3>
               <p className="text-slate-400 font-bold mb-8 max-w-xs mx-auto">Create your first trip or join one using an invite code to get started.</p>
               <button onClick={() => {}} className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-sm shadow-2xl hover:bg-indigo-700 transition-colors">
                  Get Started →
               </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map(trip => (
                <TripCard key={trip._id} trip={trip} onDelete={handleDeleteTrip} />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Global Bottom Navigation (Mobile + Tablet) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6">
        <div className="max-w-md mx-auto bg-[#0B1A2C] rounded-[2rem] p-2 flex items-center justify-around shadow-2xl border border-white/5 ring-8 ring-indigo-50/50">
          <button onClick={() => navigate('/dashboard')} className="p-4 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30 ring-1 ring-white/20 transition-all scale-110">
            <LayoutDashboard size={20} strokeWidth={2.5} />
          </button>
          <button onClick={() => navigate('/history')} className="p-4 text-slate-400 hover:text-white transition-colors group">
            <History size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={() => navigate('/dashboard')} className="p-4 text-slate-400 hover:text-indigo-400 transition-colors group">
            <ReceiptText size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-4 text-slate-400 hover:text-white transition-colors group">
            <Settings size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>
    </div>
  );
}

const Sparkles = memo(function Sparkles({ className, size }: { className?: string; size?: number }) {
  return (
    <svg 
      className={className} 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="m5 3 1 1"/><path d="m19 19 1 1"/><path d="m5 19 1-1"/><path d="m19 5 1-1"/>
    </svg>
  );
});
