import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, UserPlus, Sparkles, TrendingUp, TrendingDown, Star, MessageSquareCode, Copy, Share2 } from 'lucide-react';
import { tripApi } from '../utils/api';
import { useToast } from '../components/Toast';

interface MemberStats {
  name: string;
  paid: number;
  balance: number;
}

export default function Members() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [members, setMembers] = useState<MemberStats[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, [tripId]);

  const fetchMembers = async () => {
    try {
      const { data } = await tripApi.getById(tripId!);
      setInviteCode(data.inviteCode);
      
      // Compute stats
      const totalCost = data.expenses.reduce((acc: number, ex: any) => acc + ex.amount, 0);
      const perPerson = totalCost / data.members.length;
      
      const stats = data.members.map((m: any) => {
        const name = typeof m === 'string' ? m : m.name;
        const paid = data.expenses.filter((ex: any) => ex.paidBy === name).reduce((acc: number, ex: any) => acc + ex.amount, 0);
        return {
          name: name,
          paid: paid,
          balance: paid - perPerson
        };
      });
      
      setMembers(stats);
    } catch {
      showToast('Error loading members', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const copyInviteCode = () => {
    navigator.clipboard.writeText(inviteCode);
    showToast('Invite code copied!', 'success');
  };

  if (isLoading) return (
     <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
     </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fbfa] flex flex-col font-sans text-[#0B1A2C]">
      {/* Visual background accents */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-[-10%] w-[300px] h-[300px] bg-teal-50/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
         <button 
           onClick={() => navigate(`/trip/${tripId}`)}
           className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-black"
         >
           <ArrowLeft size={20} strokeWidth={2.5} />
         </button>
         <h1 className="text-xl font-black tracking-tight text-[#0B1A2C]">Trip Members</h1>
         <button 
           onClick={() => showToast('Share feature coming soon!', 'info')}
           className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-black"
         >
           <Share2 size={24} />
         </button>
      </header>

      <main className="flex-1 relative z-10 px-6 pb-20 overflow-y-auto">
         <div className="max-w-2xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Invite Section */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-indigo-50 flex flex-col gap-6 relative overflow-hidden group">
               <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <UserPlus size={100} strokeWidth={1} />
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
                     <MessageSquareCode size={32} />
                  </div>
                  <div className="space-y-1">
                     <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">INVITE FRIENDS</h3>
                     <p className="text-xl font-black text-[#0B1A2C] leading-none">Manage your squad.</p>
                  </div>
               </div>

               <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-50 border-2 border-slate-100 px-6 py-4 rounded-2xl items-center flex justify-between group/code transition-all focus-within:border-indigo-500">
                     <span className="text-2xl font-black tracking-[0.3em] font-mono text-indigo-600 uppercase">
                        {inviteCode}
                     </span>
                     <button onClick={copyInviteCode} className="text-slate-300 hover:text-indigo-600 p-2 transition-colors">
                        <Copy size={20} />
                     </button>
                  </div>
                  <button onClick={copyInviteCode} className="h-16 w-16 bg-[#0B1A2C] text-white rounded-2xl flex items-center justify-center shadow-lg hover:bg-slate-800 transition-all active:scale-95">
                     <UserPlus size={28} />
                  </button>
               </div>
            </div>

            {/* Members List */}
            <div className="space-y-6">
               <div className="flex items-center justify-between px-2">
                  <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                     <Users size={14} /> ACTIVE MEMBERS ({members.length})
                  </h3>
                  <div className="px-3 py-1 bg-indigo-50 rounded-full text-[10px] font-black text-indigo-600 flex items-center gap-1">
                     <Sparkles size={10} /> LIVE SYNC
                  </div>
               </div>

               <div className="space-y-6">
                  {members.map((m, i) => (
                     <div 
                        key={i}
                        className="relative group bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between"
                     >
                        <div className="flex items-center gap-5">
                           <div className="relative">
                              <div className="w-16 h-16 bg-slate-50 rounded-[20px] border-2 border-slate-100 flex items-center justify-center text-2xl font-black text-[#0B1A2C] uppercase">
                                 {m.name.charAt(0)}
                              </div>
                              {i === 0 && (
                                 <div className="absolute -top-2 -right-2 w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center text-white shadow-lg border-2 border-white">
                                    <Star size={14} fill="white" />
                                 </div>
                              )}
                           </div>
                           <div className="space-y-1">
                              <div className="text-xl font-black text-[#0B1A2C] capitalize">
                                 {m.name}
                              </div>
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                 PAID: <span className="text-[#0B1A2C]">₹{m.paid.toLocaleString()}</span>
                              </div>
                           </div>
                        </div>

                        <div className="text-right">
                           <div className="flex items-center justify-end gap-1.5 mb-1.5">
                              {m.balance >= 0 ? (
                                 <div className="flex items-center gap-1 p-1 px-3 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    <TrendingUp size={12} /> CREDIT
                                 </div>
                              ) : (
                                 <div className="flex items-center gap-1 p-1 px-3 bg-rose-50 text-rose-600 rounded-full text-[9px] font-black uppercase tracking-widest">
                                    <TrendingDown size={12} /> DEBT
                                 </div>
                              )}
                           </div>
                           <div className={`text-2xl font-black tracking-tighter ${m.balance >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {m.balance >= 0 ? '+' : '-'} ₹{Math.abs(m.balance).toLocaleString()}
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </main>

      {/* Stats Bottom Bar */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
         <div className="max-w-md mx-auto bg-[#0B1A2C] rounded-[28px] p-6 shadow-2xl flex items-center justify-between pointer-events-auto">
             <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">TOTAL TRIP SPEND</span>
                <span className="text-2xl font-black text-white">
                   ₹{members.reduce((acc, m) => acc + m.paid, 0).toLocaleString()}
                </span>
             </div>
             <button 
                onClick={() => navigate(`/trip/${tripId}/settlements`)}
                className="bg-indigo-600 hover:bg-slate-700 text-white font-black px-8 py-4 rounded-2xl flex items-center gap-2 shadow-lg shadow-indigo-100 transition-all active:scale-95"
             >
                Settle Up <TrendingUp size={18} />
             </button>
         </div>
      </footer>
    </div>
  );
}
