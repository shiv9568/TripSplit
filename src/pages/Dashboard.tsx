import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Users, Home, LayoutDashboard, FileText, User as UserIcon, 
  CheckCircle2, Handshake, X, ArrowLeft
} from 'lucide-react';
import { tripApi, expenseApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import type { Trip, Expense, TripSummary } from '../types';
import Onboarding from '../components/Onboarding';

const CATEGORIES = [
  { value: 'food', label: 'Food', icon: '🍔', bg: 'bg-orange-100', text: 'text-orange-600' },
  { value: 'petrol', label: 'Petrol', icon: '⛽', bg: 'bg-amber-100', text: 'text-amber-600' },
  { value: 'hotel', label: 'Hotel', icon: '🏨', bg: 'bg-indigo-100', text: 'text-indigo-600' },
  { value: 'travel', label: 'Travel', icon: '✈️', bg: 'bg-blue-100', text: 'text-blue-600' },
  { value: 'tickets', label: 'Tickets', icon: '🎟️', bg: 'bg-pink-100', text: 'text-pink-600' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎉', bg: 'bg-purple-100', text: 'text-purple-600' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', bg: 'bg-teal-100', text: 'text-teal-600' },
  { value: 'alcohol', label: 'Alcohol', icon: '🍺', bg: 'bg-yellow-100', text: 'text-yellow-600' },
  { value: 'smoking', label: 'Smoking', icon: '🚬', bg: 'bg-slate-100', text: 'text-slate-600' },
  { value: 'other', label: 'Other', icon: '📦', bg: 'bg-gray-100', text: 'text-gray-600' },
];

const getCategoryInfo = (value: string) => {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
};

export default function Dashboard() {
  const { currentUser } = useApp();
  const navigate = useNavigate();
  const { showToast } = useToast();

  // Auth guard — bounce to login if not authenticated
  useEffect(() => {
    if (!currentUser) {
      navigate('/authUser', { replace: true, state: { from: '/dashboard' } });
    }
  }, [currentUser, navigate]);
  
  const [trips, setTrips] = useState<Trip[]>([]);
  const [activeTripId, setActiveTripId] = useState<string | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [runOnboarding, setRunOnboarding] = useState(false);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('hasSeenDashboardTour');
    if (!hasSeenTour) {
      setRunOnboarding(true);
    }
  }, []);

  const handleOnboardingFinish = () => {
    localStorage.setItem('hasSeenDashboardTour', 'true');
    setRunOnboarding(false);
  };

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data } = await tripApi.getAll(currentUser!.name, currentUser!.email);
      setTrips(data);
      if (data.length > 0) {
        setActiveTripId(data[0]._id);
      }
    } catch {
      showToast('Failed to load trips', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    if (currentUser) loadInitialData();
  }, [loadInitialData, currentUser]);

  const loadActiveTripData = useCallback(async (tripId: string) => {
    try {
      const [expensesRes, summaryRes] = await Promise.all([
        expenseApi.getAll(tripId),
        expenseApi.getSummary(tripId),
      ]);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch {
      showToast('Failed to load active trip details', 'error');
    }
  }, [showToast]);

  useEffect(() => {
    if (activeTripId) {
      loadActiveTripData(activeTripId);
    }
  }, [activeTripId, loadActiveTripData]);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    showToast('Invite code copied!', 'success');
  };

  const activeTrip = trips.find(t => t._id === activeTripId);

  // Exact UI styles based on the provided image
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F4FBFA] to-[#EAF5F5] font-sans text-slate-900 pb-32">
      <Onboarding run={runOnboarding} onFinish={handleOnboardingFinish} />
      {/* Top Navigation */}
      {/* Top Navigation */}
      <header className="px-6 py-6 pb-2 z-10 relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate('/')}
              className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
            >
              <ArrowLeft size={20} strokeWidth={2.5} />
            </button>
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm border border-slate-100 italic shrink-0">
              <img src="/logo.png" alt="TripSplit Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-[22px] font-black tracking-tight text-[#002222]">
              TripSplit
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
             <button 
               onClick={() => navigate('/create-trip')}
               className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-teal-600 hover:bg-teal-50 transition-all active:scale-95 tour-create-trip"
             >
               <Plus size={22} strokeWidth={3} />
             </button>
             
             <div className="relative cursor-pointer hover:opacity-90 transition-opacity" onClick={() => navigate('/profile')}>
                <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center overflow-hidden shadow-sm">
                   <img src={`https://ui-avatars.com/api/?name=${currentUser || 'User'}&background=c7d2fe&color=3730a3&bold=true`} alt="User avatar" className="w-full h-full object-cover" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                   {trips.length}
                </div>
             </div>
          </div>
        </div>

        {/* Dynamic Trip Tabs */}
        {trips.length > 0 && (
          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 pb-2">
            {trips.map(t => (
              <button 
                key={t._id}
                onClick={() => setActiveTripId(t._id)}
                className={`flex-shrink-0 px-5 py-2.5 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTripId === t._id 
                  ? 'bg-[#002222] text-white shadow-xl shadow-[#002222]/10 scale-105' 
                  : 'bg-white text-slate-400 border border-slate-100 hover:border-teal-200'
                }`}
              >
                {t.name}
              </button>
            ))}
          </div>
        )}
      </header>

      <main className="max-w-md mx-auto px-6 space-y-6 relative z-10">
        
        {/* Loading State or Dashboard Content */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-8 h-8 border-4 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Trip Summary Card */}
            {activeTrip ? (
          <div className="bg-white rounded-[1.5rem] p-6 shadow-[0_8px_30px_rgb(20,184,166,0.12)] border border-teal-50 space-y-6 relative overflow-hidden">
            {/* Subtle glow inside card */}
            <div className="absolute -right-20 -bottom-20 w-40 h-40 bg-teal-100 blur-[50px] rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <p className="text-sm font-bold text-slate-500">Trip Summary</p>
              <h2 className="text-2xl font-black text-[#002222] mt-1 tracking-tight">{activeTrip.name}</h2>
            </div>
            
            <div className="flex items-center justify-between pt-2 relative z-10">
              <div className="space-y-1">
                <p className="text-xs font-bold text-slate-600">Trip Total Spent</p>
                <p className="text-2xl font-black text-[#002222] tracking-tight">
                  ₹{summary ? summary.totalAmount.toLocaleString() : '0'}
                </p>
              </div>
              <div className="space-y-1 text-right">
                <p className="text-xs font-bold text-slate-600">My Balance</p>
                <div className="flex items-center justify-end gap-1.5 text-emerald-500 font-bold backdrop-blur-sm bg-emerald-50/50 px-2 py-0.5 rounded-lg border border-emerald-100">
                  <CheckCircle2 size={16} className="text-emerald-500 fill-emerald-100" />
                  <span className="text-lg font-black tracking-tight">+₹1,200</span>
                  <span className="text-[10px] uppercase text-emerald-600">(to collect)</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] p-8 py-12 shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 text-center space-y-6 animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-xl">
               <span className="text-4xl">🌎</span>
             </div>
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-[#002222]">Ready for adventure?</h3>
                <p className="text-sm font-bold text-slate-400 px-6">You don't have any trips yet. Create one and start splitting expenses with your friends!</p>
             </div>
             <button 
               onClick={() => navigate('/create-trip')} 
               className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-4 rounded-[1.5rem] font-black shadow-xl shadow-teal-600/30 transition-all active:scale-95 animate-pulse hover:animate-none"
             >
               🚀 Start Your First Trip
             </button>
          </div>
        )}

        {/* Action Buttons */}
        {activeTrip && (
          <div className="grid grid-cols-3 gap-3">
            <button 
              onClick={() => navigate(`/trip/${activeTrip._id}/add-expense`)}
              className="bg-teal-600 hover:bg-teal-700 active:scale-95 transition-all outline-none rounded-2xl flex flex-col items-center justify-center p-4 shadow-lg shadow-teal-600/20 text-white gap-2 tour-add-expense"
            >
              <div className="w-8 h-8 rounded-full border-2 border-white/20 flex items-center justify-center mb-1">
                <Plus size={20} className="text-white" strokeWidth={3} />
              </div>
              <span className="text-xs font-black tracking-tight">Add Expense</span>
            </button>

            <button 
              onClick={() => navigate(`/trip/${activeTrip._id}/settlements`)}
              className="bg-white hover:bg-slate-50 active:scale-95 transition-all outline-none rounded-2xl flex flex-col items-center justify-center p-4 shadow-sm border border-slate-100 text-[#002222] gap-2 tour-settle"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center mb-1">
                <Handshake size={20} className="text-emerald-600" />
              </div>
              <span className="text-xs font-black tracking-tight">Settle Up</span>
            </button>

            <button 
              onClick={() => setShowInviteModal(true)}
              className="bg-white hover:bg-slate-50 active:scale-95 transition-all outline-none rounded-2xl flex flex-col items-center justify-center p-4 shadow-sm border border-slate-100 text-[#002222] gap-2"
            >
              <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center mb-1">
                <Users size={20} className="text-blue-600" />
              </div>
              <span className="text-xs font-black tracking-tight text-center leading-tight">Invite Members</span>
            </button>
          </div>
        )}

        {/* Recent Activity */}
        <div className="bg-white rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.03)] border border-slate-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-50">
            <h2 className="text-lg font-black text-[#002222] tracking-tight">Recent Activity</h2>
          </div>
          
          <div className="p-4 space-y-1">
            {expenses.length === 0 ? (
               <div className="text-center py-8 text-slate-400 font-bold text-sm">
                 No recent activity to show
               </div>
            ) : (
              expenses.slice(0, 5).map((exp, idx) => {
                const category = getCategoryInfo(exp.category);
                const splitStr = `split ${activeTrip?.members.length || 1}`;
                
                return (
                  <div key={exp._id} className="flex items-center gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors cursor-pointer border-b border-slate-50 last:border-0 relative">
                    <div className={`w-12 h-12 rounded-full ${category.bg} flex items-center justify-center text-xl shrink-0`}>
                      {category.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#002222] truncate text-[15px]">{exp.title}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                        paid by {exp.paidBy.split(' ')[0]} - 
                        <img 
                          src={`https://ui-avatars.com/api/?name=${exp.paidBy}&background=random&size=20`} 
                          alt="avatar" 
                          className="w-4 h-4 rounded-full inline-block object-cover -mb-0.5" 
                        />
                      </div>
                    </div>
                    
                    <div className="text-right shrink-0 relative z-10">
                      <p className="font-black text-[#002222] text-[15px]">
                        {idx % 2 === 0 ? '' : '-'}₹{Math.round(exp.amount)}
                      </p>
                      <p className="text-[11px] text-slate-400 font-medium">
                        ₹{Math.round(exp.amount / (activeTrip?.members.length || 1))} - {splitStr}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        </>
        )}

        {/* Invite QR Modal */}
        {showInviteModal && activeTrip && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl space-y-6 relative animate-in zoom-in-95 duration-200">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200"
              >
                <X size={16} strokeWidth={3} />
              </button>
              <div className="text-center space-y-2">
                <h3 className="text-2xl font-black text-[#002222]">Invite Friends</h3>
                <p className="text-sm font-bold text-slate-400">Scan this QR code or use the code below to join!</p>
              </div>
              
              <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 flex justify-center">
                <img 
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(window.location.origin + '/join?code=' + activeTrip.inviteCode)}`}
                  alt="QR Code"
                  className="w-48 h-48 rounded-lg shadow-sm"
                />
              </div>

              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Or Share via Code</p>
                <div 
                  onClick={() => copyCode(activeTrip.inviteCode)}
                  className="bg-slate-100 py-4 rounded-2xl cursor-pointer hover:bg-slate-200 transition-colors active:scale-95"
                >
                  <span className="font-mono text-3xl font-black tracking-[0.2em] text-teal-600">{activeTrip.inviteCode}</span>
                </div>
                <p className="text-xs font-bold text-slate-400 mt-2">Tap code to copy</p>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Global Bottom Navigation (White Theme based on image) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-0 pb-0">
        <div className="bg-white flex items-center justify-around shadow-[0_-10px_40px_rgb(0,0,0,0.05)] border-t border-slate-100">
          <button 
            onClick={() => navigate('/')} 
            className="flex-1 py-4 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <Home size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Trips</span>
          </button>
          
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 py-4 flex flex-col items-center gap-1 text-teal-600 relative"
          >
            <LayoutDashboard size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Dashboard</span>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-teal-600 rounded-t-full" />
          </button>
          
          <button 
            onClick={() => activeTrip && navigate(`/trip/${activeTrip._id}/summary`)} 
            className="flex-1 py-4 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors tour-reports"
          >
            <FileText size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Reports</span>
          </button>
          
          <button 
            onClick={() => navigate('/profile')} 
            className="flex-1 py-4 flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <UserIcon size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-bold">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

