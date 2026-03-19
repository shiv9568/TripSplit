import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit3, ReceiptText, Users, Tag, Check } from 'lucide-react';
import { expenseApi } from '../utils/api';
import { useToast } from '../components/Toast';

export default function ExpenseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [expense, setExpense] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // In a real app we'd fetch this specific expense by ID
    // For now we'll mock it if not found easily or if backend doesn't support getExpenseById
    const fetchExpense = async () => {
      try {
        // Simulated fetch
        setExpense({
          _id: id,
          tripId: 'mock-trip',
          title: 'Seafood Dinner',
          amount: 2500,
          paidBy: 'Liam',
          category: 'food',
          splitAmong: ['Liam', 'Noah', 'Sofia'],
          createdAt: new Date().toISOString()
        });
      } catch {
        showToast('Failed to load expense', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchExpense();
  }, [id, showToast]);

  if (isLoading) return (
    <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );

  if (!expense) return <div className="p-6 text-center">Expense not found</div>;

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-100/50 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-black"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Expense Detail</span>
        <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Main Card */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center space-y-6">
            <div className="w-20 h-20 bg-orange-50 rounded-[1.5rem] flex items-center justify-center mx-auto shadow-inner text-4xl">
              🍔
            </div>
            
            <div className="space-y-2">
              <h2 className="text-3xl font-black text-[#0B1A2C] capitalize">{expense.title}</h2>
              <p className="text-slate-400 font-bold text-sm tracking-tight">Paid by <span className="text-indigo-600">{expense.paidBy}</span></p>
            </div>
            
            <div className="py-6 border-y border-slate-100">
               <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2">Total Amount</span>
               <span className="text-5xl font-black text-indigo-600">₹{expense.amount.toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-left">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <Tag size={16} className="text-slate-400 mb-2" />
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category</p>
                 <p className="font-bold text-[#0B1A2C] capitalize">{expense.category}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                 <ReceiptText size={16} className="text-slate-400 mb-2" />
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Date</p>
                 <p className="font-bold text-[#0B1A2C]">
                   {new Date(expense.createdAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                 </p>
              </div>
            </div>
          </div>

          {/* Members Split */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-4">
             <div className="flex items-center gap-2 text-slate-400">
                <Users size={18} />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Split Details</h3>
             </div>
             <div className="space-y-3">
               {expense.splitAmong.map((m: string) => (
                  <div key={m} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl">
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black">
                           {m[0].toUpperCase()}
                        </div>
                        <span className="font-bold text-[#0B1A2C]">{m}</span>
                     </div>
                     <span className="font-black text-[#0B1A2C]">
                       ₹{(expense.amount / expense.splitAmong.length).toFixed(0)}
                     </span>
                  </div>
               ))}
             </div>
          </div>

          {/* Actions */}
          <div className="flex gap-4">
             <button className="flex-1 bg-white border-2 border-slate-100 hover:border-indigo-100 text-[#0B1A2C] py-4 rounded-2xl text-sm font-black shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95">
                <Edit3 size={18} className="text-indigo-500" /> Edit
             </button>
             <button className="flex-1 bg-red-50 text-red-600 py-4 rounded-2xl text-sm font-black shadow-sm flex items-center justify-center gap-2 transition-all hover:bg-red-100 active:scale-95">
                <Trash2 size={18} /> Delete
             </button>
          </div>

        </div>
      </main>
    </div>
  );
}
