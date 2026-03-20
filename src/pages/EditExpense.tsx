import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, IndianRupee, Tag, Check, Users, MessageSquare, ChevronDown, Trash2 } from 'lucide-react';
import { expenseApi, tripApi } from '../utils/api';
import { useToast } from '../components/Toast';

const CATEGORIES = [
  { value: 'food', label: 'Food', icon: '🍔' },
  { value: 'petrol', label: 'Petrol', icon: '⛽' },
  { value: 'hotel', label: 'Hotel', icon: '🏨' },
  { value: 'travel', label: 'Travel', icon: '✈️' },
  { value: 'tickets', label: 'Tickets', icon: '🎟️' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎉' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️' },
  { value: 'alcohol', label: 'Alcohol', icon: '🍺' },
  { value: 'smoking', label: 'Smoking', icon: '🚬' },
  { value: 'other', label: 'Other', icon: '📦' },
];

export default function EditExpense() {
  const { id: tripId, expenseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [payer, setPayer] = useState('');
  const [category, setCategory] = useState('other');
  const [members, setMembers] = useState<any[]>([]);
  const [splitAmong, setSplitAmong] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    loadData();
  }, [tripId, expenseId]);

  const loadData = async () => {
    try {
      const [tripRes, expenseRes] = await Promise.all([
        tripApi.getById(tripId!),
        expenseApi.getById(expenseId!)
      ]);
      
      const tripData = tripRes.data;
      const expData = expenseRes.data;

      setMembers(tripData.members);
      
      // Fill expense data
      setDescription(expData.title);
      setAmount(expData.amount.toString());
      setPayer(expData.paidBy);
      setCategory(expData.category || 'other');
      setSplitAmong(expData.splitBetween || tripData.members.map((m: any) => m.name));

    } catch {
      showToast('Error loading details', 'error');
      navigate(-1);
    } finally {
      setIsFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !payer) {
       showToast('Please fill all fields', 'error');
       return;
    }
    
    setIsLoading(true);
    try {
      await expenseApi.update(expenseId!, {
        title: description,
        description: description,
        amount: Number(amount),
        paidBy: payer,
        category: category,
        splitBetween: splitAmong
      });
      showToast('Expense updated!', 'success');
      navigate(`/trip/${tripId}`);
    } catch {
      showToast('Update failed', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this expense permanently?')) return;
    try {
      await expenseApi.delete(expenseId!);
      showToast('Deleted', 'info');
      navigate(`/trip/${tripId}`);
    } catch {
      showToast('Delete failed', 'error');
    }
  };

  if (isFetching) return (
     <div className="min-h-screen bg-[#FAF7F4] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
     </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans relative overflow-x-hidden">
      {/* Design Decals */}
      <div className="absolute top-[-5%] right-[-5%] w-[400px] h-[400px] bg-indigo-100/50 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[350px] h-[350px] bg-teal-50/40 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-10 pb-6 flex items-center justify-between max-w-2xl mx-auto w-full">
         <button 
           onClick={() => navigate(-1)}
           className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all"
         >
           <ArrowLeft size={22} strokeWidth={2.5} />
         </button>
         <h1 className="text-xl font-black tracking-tight text-[#0B1A2C]">Edit Bill</h1>
         <button 
           onClick={handleDelete}
           className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-300 hover:text-rose-600 transition-all border border-rose-100"
         >
           <Trash2 size={20} />
         </button>
      </header>

      <main className="flex-1 relative z-10 px-6 pb-12 overflow-y-auto">
         <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Amount Input Large */}
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-3xl blur opacity-10" />
                  <div className="relative bg-white border-2 border-slate-100 rounded-[2.5rem] px-6 py-10 shadow-xl flex flex-col items-center">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Adjust Amount</span>
                     <div className="flex items-center gap-2">
                        <IndianRupee size={32} className="text-indigo-600" strokeWidth={3} />
                        <input 
                           type="number"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           className="w-full text-5xl font-black text-[#0B1A2C] bg-transparent text-center focus:outline-none"
                           required
                        />
                     </div>
                  </div>
               </div>

               {/* Description & Category */}
               <div className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-xl space-y-10">
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Tag size={18} strokeWidth={2.5} />
                        <label className="text-[10px] font-black uppercase tracking-widest">Update Category</label>
                     </div>
                     <div className="relative">
                        <select
                           value={category}
                           onChange={(e) => setCategory(e.target.value)}
                           className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-10 text-sm font-bold text-[#0B1A2C] appearance-none focus:outline-none focus:border-indigo-500 transition-all"
                        >
                           {CATEGORIES.map(cat => (
                              <option key={cat.value} value={cat.value}>
                                 {cat.icon} {cat.label}
                              </option>
                           ))}
                        </select>
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                           <span className="text-lg">{CATEGORIES.find(c => c.value === category)?.icon}</span>
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                           <ChevronDown size={18} strokeWidth={2.5} />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-slate-400">
                        <MessageSquare size={18} strokeWidth={2.5} />
                        <label className="text-[10px] font-black uppercase tracking-widest">What changed?</label>
                     </div>
                     <input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full text-lg font-bold text-[#0B1A2C] border-b-2 border-slate-50 py-2 focus:border-indigo-500 focus:outline-none transition-all"
                        required
                     />
                  </div>

                  <div className="space-y-4 border-t border-slate-50 pt-8">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Users size={18} strokeWidth={2.5} />
                        <label className="text-[10px] font-black uppercase tracking-widest">Paid By</label>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        {members.map((member) => (
                           <button
                              key={member.name}
                              type="button"
                              onClick={() => setPayer(member.name)}
                              className={`p-4 rounded-2xl border-2 font-black text-sm transition-all flex items-center justify-between ${
                                 payer === member.name 
                                 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                 : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-100'
                              }`}
                           >
                              {member.name}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Split Preview */}
                  <div className="space-y-4 border-t border-slate-50 pt-8">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Users size={18} strokeWidth={2.5} />
                           <label className="text-[10px] font-black uppercase tracking-widest">Splitting Logic</label>
                        </div>
                     </div>
                     <div className="flex flex-wrap gap-2">
                        {members.map(m => (
                           <button
                              key={m.name}
                              type="button"
                              onClick={() => {
                                 if (splitAmong.includes(m.name)) setSplitAmong(splitAmong.filter(n => n !== m.name));
                                 else setSplitAmong([...splitAmong, m.name]);
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                                 splitAmong.includes(m.name)
                                 ? 'bg-indigo-600 text-white border-indigo-600' 
                                 : 'bg-slate-50 text-slate-400 border-slate-100'
                              }`}
                           >
                              {m.name}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>

               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/save pt-4"
               >
                  <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-6 rounded-[2rem] text-lg font-black shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-95">
                     {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                     ) : (
                        <>Update Bill <Check size={20} strokeWidth={3} /></>
                     )}
                  </div>
               </button>
            </form>
         </div>
      </main>
    </div>
  );
}
