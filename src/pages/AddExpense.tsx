import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Sparkles, Receipt, IndianRupee, Tag, Check, Users, MessageSquare, ArrowRight, ChevronDown } from 'lucide-react';
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
  { value: 'other', label: 'Other', icon: '📦' },
];

export default function AddExpense() {
  const { id: tripId } = useParams();
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
    fetchTrip();
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const { data } = await tripApi.getById(tripId!);
      setMembers(data.members);
      setSplitAmong(data.members.map((m: any) => m.name));
      if (data.members.length > 0) setPayer(data.members[0].name);
    } catch {
      showToast('Error loading trip members', 'error');
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
      await expenseApi.create({
        tripId: tripId!,
        title: description, // Backend might expect 'title' instead of 'description'
        description: description,
        amount: Number(amount),
        paidBy: payer,
        category: category,
        splitAmong: splitAmong
      });
      showToast('Expense added successfully!', 'success');
      navigate(`/trip/${tripId}`);
    } catch {
      showToast('Failed to add expense', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) return (
     <div className="min-h-screen bg-indigo-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
     </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col font-sans">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-teal-100/30 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 p-6 flex items-center justify-between">
         <button 
           onClick={() => navigate(-1)}
           className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-black"
         >
           <ArrowLeft size={20} strokeWidth={2.5} />
         </button>
         <h1 className="text-xl font-black tracking-tight text-[#0B1A2C]">Add Expense</h1>
         <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 px-6 pb-12 overflow-y-auto">
         <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
            
            {/* Visual Intro */}
            <div className="text-center space-y-2">
               <div className="w-16 h-16 bg-white rounded-3xl shadow-xl border border-slate-100 mx-auto flex items-center justify-center">
                  <Receipt size={32} className="text-indigo-600" />
               </div>
               <div className="flex items-center justify-center gap-2 mt-4">
                  <div className="p-1 px-3 bg-indigo-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1 shadow-lg shadow-indigo-100">
                     <Sparkles size={12} /> Pro Input
                  </div>
               </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
               {/* Amount Input Large */}
               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-3xl blur opacity-5 group-focus-within:opacity-20 transition-all" />
                  <div className="relative bg-white border-2 border-slate-100 rounded-3xl px-6 py-8 shadow-xl focus-within:border-indigo-500 transition-all flex flex-col items-center">
                     <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Total Amount</span>
                     <div className="flex items-center gap-2">
                        <IndianRupee size={32} className="text-indigo-600" strokeWidth={3} />
                        <input 
                           type="number"
                           value={amount}
                           onChange={(e) => setAmount(e.target.value)}
                           placeholder="0.00"
                           className="w-full text-5xl font-black text-[#0B1A2C] placeholder:text-slate-100 focus:outline-none bg-transparent text-center"
                           required
                           autoFocus
                        />
                     </div>
                  </div>
               </div>

               {/* Description & Payer Card */}
               <div className="bg-white border-2 border-slate-100 rounded-3xl p-6 shadow-xl space-y-8">
                  {/* Category Picker */}
                  <div className="space-y-4">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Tag size={18} strokeWidth={2.5} />
                        <label className="text-[10px] font-black uppercase tracking-widest">Category</label>
                     </div>
                     <div className="relative group">
                        <select
                           value={category}
                           onChange={(e) => setCategory(e.target.value)}
                           className="w-full bg-slate-50 border-2 border-slate-50 rounded-2xl py-4 pl-12 pr-10 text-sm font-bold text-[#0B1A2C] appearance-none focus:outline-none focus:border-indigo-500 focus:bg-white transition-all cursor-pointer"
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

                  {/* Description */}
                  <div className="space-y-3">
                     <div className="flex items-center gap-2 text-slate-400">
                        <MessageSquare size={18} strokeWidth={2.5} />
                        <label className="text-[10px] font-black uppercase tracking-widest">What was it for?</label>
                     </div>
                     <input 
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Dinner, Flight, Cab etc."
                        className="w-full text-lg font-bold text-[#0B1A2C] placeholder:text-slate-200 border-b-2 border-slate-50 py-2 focus:border-indigo-500 focus:outline-none transition-all"
                        required
                     />
                  </div>

                  {/* Payer selection */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                     <div className="flex items-center gap-2 text-slate-400">
                        <Users size={18} strokeWidth={2.5} />
                        <label className="text-[10px] font-black uppercase tracking-widest">Who Paid?</label>
                     </div>
                     <div className="grid grid-cols-2 gap-3">
                        {members.map((member, idx) => (
                           <button
                              key={member._id || idx}
                              type="button"
                              onClick={() => setPayer(member.name)}
                              className={`p-4 rounded-2xl border-2 font-black text-sm tracking-tight transition-all flex items-center justify-between ${
                                 payer === member.name 
                                 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' 
                                 : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-slate-100'
                              }`}
                           >
                              {member.name}
                              {payer === member.name && <Check size={16} strokeWidth={3} />}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* Split Between */}
                  <div className="space-y-4 pt-4 border-t border-slate-50">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-slate-400">
                           <Users size={18} strokeWidth={2.5} />
                           <label className="text-[10px] font-black uppercase tracking-widest">Split Between</label>
                        </div>
                        <button 
                           type="button"
                           onClick={() => {
                              if (splitAmong.length === members.length) setSplitAmong([]);
                              else setSplitAmong(members.map(m => m.name));
                           }}
                           className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:underline"
                        >
                           {splitAmong.length === members.length ? 'Clear All' : 'Select All'}
                        </button>
                     </div>
                     
                     <div className="flex flex-wrap gap-2">
                        <button
                           type="button"
                           onClick={() => setSplitAmong(members.map(m => m.name))}
                           className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              splitAmong.length === members.length 
                              ? 'bg-indigo-600 text-white shadow-md' 
                              : 'bg-slate-50 text-slate-400 border border-slate-100'
                           }`}
                        >
                           All {splitAmong.length === members.length && '✓'}
                        </button>
                        {members.map(m => (
                           <button
                              key={m._id}
                              type="button"
                              onClick={() => {
                                 if (splitAmong.includes(m.name)) {
                                    setSplitAmong(splitAmong.filter(name => name !== m.name));
                                 } else {
                                    setSplitAmong([...splitAmong, m.name]);
                                 }
                               }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                 splitAmong.includes(m.name) && splitAmong.length !== members.length
                                 ? 'bg-indigo-600 text-white shadow-md' 
                                 : 'bg-slate-50 text-slate-400 border border-slate-100 hover:border-slate-200'
                              }`}
                           >
                              {m.name} {splitAmong.includes(m.name) && splitAmong.length !== members.length && '✓'}
                           </button>
                        ))}
                     </div>
                     {splitAmong.length === 0 && (
                        <p className="text-[10px] text-red-500 font-bold">* Select at least one person to split</p>
                     )}
                  </div>
               </div>

               {/* Submit Button */}
               <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full relative group/save"
               >
                  <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl group-hover/save:blur-2xl opacity-20 transition-all" />
                  <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-6 rounded-3xl text-lg font-black shadow-2xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50">
                     {isLoading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent" />
                     ) : (
                        <>
                           Save Expense <ArrowRight size={20} />
                        </>
                     )}
                  </div>
               </button>
            </form>
         </div>
      </main>
    </div>
  );
}
