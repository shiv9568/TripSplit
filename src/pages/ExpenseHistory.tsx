import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Search, Receipt, Share2, Filter, IndianRupee, Trash2 } from 'lucide-react';
import { expenseApi } from '../utils/api';
import { useToast } from '../components/Toast';

interface Expense {
  _id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitAmong: string[];
  createdAt: string;
}

export default function ExpenseHistory() {
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
      showToast('Error loading expenses', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;
    
    try {
      await expenseApi.delete(id);
      setExpenses(expenses.filter(e => e._id !== id));
      showToast('Expense deleted successfully', 'success');
    } catch {
      showToast('Error deleting expense', 'error');
    }
  };

  const filteredExpenses = expenses.filter(e => 
    (e.description || '').toLowerCase().includes(search.toLowerCase()) ||
    (e.paidBy || '').toLowerCase().includes(search.toLowerCase())
  );

  if (isLoading) return (
     <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
     </div>
  );

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
         <h1 className="text-xl font-black tracking-tight text-[#0B1A2C]">Expense Logs</h1>
         <button 
           onClick={() => showToast('Report generated!', 'success')}
           className="w-12 h-12 bg-[#0B1A2C] rounded-2xl shadow-sm flex items-center justify-center text-white hover:bg-slate-800 transition-all"
         >
           <Share2 size={24} />
         </button>
      </header>

      <main className="flex-1 relative z-10 px-6 pb-20 overflow-y-auto">
         <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Search & Filter */}
            <div className="flex gap-4">
               <div className="flex-1 relative group">
                  <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-indigo-600 transition-colors">
                     <Search size={24} />
                  </div>
                  <input 
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search logs..."
                    className="w-full bg-white border-2 border-slate-100 pl-14 pr-6 py-5 rounded-3xl text-lg font-bold text-[#0B1A2C] placeholder:text-slate-200 focus:outline-none focus:border-indigo-500 shadow-xl transition-all"
                  />
               </div>
               <button className="w-16 h-16 bg-white border-2 border-slate-100 rounded-3xl flex items-center justify-center text-slate-300 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-xl">
                  <Filter size={24} />
               </button>
            </div>

            {/* List */}
            <div className="space-y-6">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2 flex items-center gap-2">
                  <Clock size={16} /> FULL HISTORY ({filteredExpenses.length})
               </h3>

               {filteredExpenses.length === 0 ? (
                  <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-6">
                     <div className="w-24 h-24 bg-slate-50 text-slate-200 rounded-full flex items-center justify-center">
                        <Receipt size={48} />
                     </div>
                     <div className="space-y-2">
                        <h4 className="text-xl font-black text-[#0B1A2C]">No Logs Found</h4>
                        <p className="text-slate-400 font-bold">Try searching for something else or add new expense.</p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {filteredExpenses.map((ex, i) => (
                        <div 
                           key={i}
                           className="group relative bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-between overflow-hidden"
                        >
                           <div className="flex items-center gap-5">
                              <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                                 <IndianRupee size={28} strokeWidth={2.5} />
                              </div>
                              <div className="space-y-1">
                                 <div className="text-xl font-black text-[#0B1A2C] capitalize flex items-center gap-2">
                                    {ex.description}
                                 </div>
                                 <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
                                    <span>PAID BY <span className="text-indigo-600">{ex.paidBy}</span></span>
                                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                    <span>{new Date(ex.createdAt).toLocaleDateString()}</span>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-center gap-6">
                              <div className="text-right">
                                 <div className="text-2xl font-black text-[#0B1A2C] tracking-tighter">
                                    ₹{ex.amount.toLocaleString()}
                                 </div>
                                 <div className="text-[9px] font-black text-slate-300 uppercase tracking-widest">GROSS TOTAL</div>
                              </div>
                              <button 
                                 onClick={() => handleDelete(ex._id)}
                                 className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300 hover:bg-rose-600 hover:text-white transition-all shadow-sm"
                              >
                                 <Trash2 size={20} />
                              </button>
                           </div>
                        </div>
                     ))}
                  </div>
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
