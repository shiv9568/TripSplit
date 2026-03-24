import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search, Receipt, Filter, Share2, Trash2 } from 'lucide-react';
import { expenseApi } from '../utils/api';
import { useToast } from '../components/Toast';
import type { Expense } from '../types';
import { ExpenseHistorySkeleton } from '../components/Skeleton';

const getCategoryInfo = (cat: string) => {
  const categories = {
    food: { icon: '🍔', color: 'text-orange-500 bg-orange-50', label: 'Food & Dining' },
    petrol: { icon: '⛽', color: 'text-rose-500 bg-rose-50', label: 'Fuel' },
    hotel: { icon: '🏨', color: 'text-indigo-500 bg-indigo-50', label: 'Accommodation' },
    tickets: { icon: '🎟️', color: 'text-amber-500 bg-amber-50', label: 'Tickets' },
    entertainment: { icon: '🎢', color: 'text-purple-500 bg-purple-50', label: 'Entertainment' },
    shopping: { icon: '🛍️', color: 'text-pink-500 bg-pink-50', label: 'Shopping' },
    travel: { icon: '✈️', color: 'text-sky-500 bg-sky-50', label: 'Transit' },
    other: { icon: '📝', color: 'text-slate-500 bg-slate-50', label: 'Miscellaneous' }
  };
  return categories[cat as keyof typeof categories] || categories.other;
};

export default function ExpenseTimeline() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExpenses();
  }, [tripId]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const { data } = await expenseApi.getAll(tripId!);
      setExpenses(data || []);
    } catch {
      showToast('Error loading timeline', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expenseApi.delete(id);
      setExpenses(expenses.filter(e => e._id !== id));
      showToast('Expense deleted', 'success');
    } catch {
      showToast('Error deleting expense', 'error');
    }
  };

  const filteredExpenses = expenses.filter(e => 
    (e.title || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.paidBy || '').toLowerCase().includes(search.toLowerCase())
  );

  // Group by date
  const groupedExpenses = filteredExpenses.reduce((acc, ex) => {
    const dateStr = new Date(ex.createdAt).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(ex);
    return acc;
  }, {} as Record<string, Expense[]>);


  if (isLoading && expenses.length === 0) return <ExpenseHistorySkeleton />;

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f8fbfa] flex flex-col font-sans text-[#0B1A2C]">
      {/* Visual background accents */}
      <div className="absolute top-[-5%] right-[-10%] w-[500px] h-[500px] bg-indigo-50/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-[-10%] w-[300px] h-[300px] bg-teal-50/40 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
         <button 
           onClick={() => navigate(`/trip/${tripId}`)}
           className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
         >
           <ArrowLeft size={20} strokeWidth={2.5} />
         </button>
         <h1 className="text-xl font-black tracking-tight text-[#0B1A2C]">Trip Timeline</h1>
         <button 
           onClick={() => showToast('Timeline exported!', 'success')}
           className="w-12 h-12 bg-[#0B1A2C] rounded-2xl shadow-sm flex items-center justify-center text-white hover:bg-slate-800 transition-all"
         >
           <Share2 size={24} />
         </button>
      </header>

      <main className="flex-1 relative z-10 px-6 pb-20 overflow-y-auto">
         <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Search */}
            <div className="flex gap-4">
               <div className="flex-1 relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                     <Search size={24} />
                  </div>
                  <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search timeline..."
                    className="w-full bg-white border-2 border-slate-100 pl-14 pr-6 py-5 rounded-3xl text-lg font-bold text-[#0B1A2C] placeholder:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-xl transition-all"
                  />
               </div>
               <button className="w-16 h-16 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-xl flex-shrink-0">
                  <Filter size={24} />
               </button>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative pb-10">
               {Object.keys(groupedExpenses).length > 0 && (
                   <div className="absolute left-[39px] sm:left-[51px] top-6 bottom-0 w-[2px] bg-slate-200/50 rounded-full" />
               )}

               {isLoading ? (
                  <div className="flex justify-center items-center py-20 relative z-10">
                     <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent" />
                  </div>
               ) : Object.keys(groupedExpenses).length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-6 relative z-10">
                     <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center">
                        <Receipt size={48} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-black text-[#0B1A2C]">No Events Found</h4>
                        <p className="text-slate-400 font-bold">Try searching for something else or log a new expense.</p>
                     </div>
                  </div>
               ) : (
                  Object.entries(groupedExpenses).map(([date, dayExpenses]) => {
                     const dailyTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0);

                     return (
                         <div key={date} className="relative z-10 space-y-6">
                            {/* Date Header Node */}
                            <div className="flex items-center gap-6">
                               <div className="w-20 sm:w-28 flex-shrink-0 text-right bg-white/50 backdrop-blur-sm p-2 rounded-xl">
                                  <div className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-widest leading-none">{date.split(',')[0]}</div>
                                  <div className="text-sm font-black text-[#0B1A2C] leading-none mt-1">{date.split(',')[1]}</div>
                               </div>
                               <div className="w-6 h-6 rounded-full bg-slate-100 border-4 border-white shadow-sm flex-shrink-0 relative z-10 flex items-center justify-center">
                                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                               </div>
                               <div className="flex-1 bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 inline-block">
                                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Daily Spend</span>
                                  <span className="text-[#0B1A2C] font-black">₹{dailyTotal.toLocaleString()}</span>
                               </div>
                            </div>

                            {/* Expense Nodes */}
                            {dayExpenses.map((ex) => {
                               const categoryInfo = getCategoryInfo(ex.category || 'other');
                               return (
                                 <div key={ex._id} className="flex items-start gap-4 sm:gap-6 pl-2 sm:pl-0 group">
                                    <div className="w-[68px] sm:w-[104px] pt-4 text-right flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                           {new Date(ex.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>

                                    {/* Line Node point */}
                                    <div className="relative pt-6 flex flex-col items-center">
                                        <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm flex-shrink-0 relative z-10 ${categoryInfo.color.split(' ')[1].replace('text-', 'bg-')}`} />
                                    </div>

                                    {/* Card */}
                                    <div className="flex-1 bg-white p-5 sm:p-6 rounded-[2rem] border border-slate-100 shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2 group/card">
                                       <div className="flex items-center gap-4">
                                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 group-hover/card:scale-110 group-hover/card:rotate-12 transition-transform duration-300 ${categoryInfo.color.split(' ')[1].replace('text-', 'bg-')} bg-opacity-10 ${categoryInfo.color.split(' ')[1]}`}>
                                             {categoryInfo.icon}
                                          </div>
                                          <div>
                                             <div className="text-lg sm:text-xl font-black text-[#0B1A2C] capitalize">
                                                {ex.title}
                                             </div>
                                             <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                                Paid by <span className="text-indigo-600">{ex.paidBy}</span>
                                             </div>
                                          </div>
                                       </div>

                                       <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-t-0 border-slate-50 pt-3 sm:pt-0">
                                          <div className="text-left sm:text-right">
                                             <div className="text-xl sm:text-2xl font-black text-[#0B1A2C] tracking-tighter">
                                                ₹{ex.amount.toLocaleString()}
                                             </div>
                                             <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{categoryInfo.label}</div>
                                          </div>
                                          <button 
                                             onClick={() => handleDelete(ex._id)}
                                             aria-label={`Delete expense ${ex.title}`}
                                             className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-sm flex-shrink-0 opacity-0 group-hover/card:opacity-100"
                                          >
                                             <Trash2 size={18} />
                                          </button>
                                       </div>
                                    </div>
                                 </div>
                               );
                            })}
                         </div>
                     );
                  })
               )}
            </div>
         </div>
      </main>

      {/* Quick Summary Floating Card */}
      <footer className="fixed bottom-0 left-0 right-0 p-6 z-20 pointer-events-none">
         <div className="max-w-md mx-auto bg-[#0B1A2C] rounded-[28px] p-6 shadow-2xl flex items-center justify-between pointer-events-auto border-t border-white/5">
             <div className="flex flex-col">
                <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">LOGGED VOLUME</span>
                <span className="text-2xl font-black text-white">
                   ₹{filteredExpenses.reduce((acc, e) => acc + e.amount, 0).toLocaleString()}
                </span>
             </div>
             <div className="flex items-center gap-2">
                <div className="text-right">
                   <div className="text-[8px] font-black text-indigo-500 uppercase tracking-widest">LATEST ENTRY</div>
                   <div className="text-xs font-bold text-white uppercase"> JUST NOW </div>
                </div>
                <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg">
                   <Clock size={20} />
                </div>
             </div>
         </div>
      </footer>
    </div>
  );
}
