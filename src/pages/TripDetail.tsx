import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, Plus, Receipt, PieChart, Users, 
  Copy, Check, Trash2, MessageSquare, Download,
  Plane, Globe, Sparkles, TrendingUp, Wallet, ChevronRight,
  Info, History, LayoutDashboard, Settings, ReceiptText
} from 'lucide-react';
import { tripApi, expenseApi, utilityApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import type { Trip, Expense, TripSummary } from '../types';

const CATEGORIES = [
  { value: 'food', label: 'Food', icon: '🍔', color: 'bg-orange-100 text-orange-600', border: 'border-orange-200' },
  { value: 'petrol', label: 'Petrol', icon: '⛽', color: 'bg-amber-100 text-amber-600', border: 'border-amber-200' },
  { value: 'hotel', label: 'Hotel', icon: '🏨', color: 'bg-indigo-100 text-indigo-600', border: 'border-indigo-200' },
  { value: 'travel', label: 'Travel', icon: '✈️', color: 'bg-blue-100 text-blue-600', border: 'border-blue-200' },
  { value: 'tickets', label: 'Tickets', icon: '🎟️', color: 'bg-pink-100 text-pink-600', border: 'border-pink-200' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎉', color: 'bg-purple-100 text-purple-600', border: 'border-purple-200' },
  { value: 'shopping', label: 'Shopping', icon: '🛍️', color: 'bg-teal-100 text-teal-600', border: 'border-teal-200' },
  { value: 'other', label: 'Other', icon: '📦', color: 'bg-gray-100 text-gray-600', border: 'border-gray-200' },
];

const getCategoryInfo = (value: string) => {
  return CATEGORIES.find(c => c.value === value) || CATEGORIES[CATEGORIES.length - 1];
};

const ExpenseItem = memo(function ExpenseItem({ 
  expense, 
  onDelete
}: { 
  expense: Expense; 
  onDelete: (id: string) => void;
}) {
  const category = getCategoryInfo(expense.category);
  
  return (
    <div className="group bg-white rounded-3xl p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4 relative overflow-hidden">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border-2 ${category.color} ${category.border} shadow-sm transform group-hover:-rotate-3 transition-transform`}>
        {category.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[#0B1A2C] truncate text-lg tracking-tight">{expense.title}</p>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">
          {category.label} • Paid by <span className="text-indigo-600">{expense.paidBy}</span>
        </p>
      </div>
      <div className="text-right shrink-0 pr-2">
        <p className="text-xl font-black text-[#0B1A2C]">₹{expense.amount.toLocaleString()}</p>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          {new Date(expense.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </p>
      </div>
      <button
        onClick={() => onDelete(expense._id)}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl opacity-0 group-hover:opacity-100 transition-all active:scale-90"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
});

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const { showToast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'expenses' | 'summary' | 'whatsapp'>('expenses');
  const [copied, setCopied] = useState(false);
  const [whatsappText, setWhatsappText] = useState('');
  const [parsedExpenses, setParsedExpenses] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    try {
      const [tripRes, expensesRes, summaryRes] = await Promise.all([
        tripApi.getById(id),
        expenseApi.getAll(id),
        expenseApi.getSummary(id),
      ]);
      setTrip(tripRes.data);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
    } catch {
      showToast('Failed to load trip', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [id, showToast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const copyInviteCode = () => {
    if (trip?.inviteCode) {
      navigator.clipboard.writeText(trip.inviteCode);
      setCopied(true);
      showToast('Invite code copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm('Delete this expense?')) return;
    try {
      await expenseApi.delete(expenseId);
      showToast('Expense deleted', 'success');
      loadData();
    } catch {
      showToast('Failed to delete', 'error');
    }
  };

  const handleParseWhatsApp = async () => {
    if (!whatsappText.trim()) return;
    setIsSubmitting(true);
    try {
      const { data } = await expenseApi.parseWhatsApp(whatsappText, id!, currentUser);
      setParsedExpenses(data.expenses);
      if (data.expenses.length === 0) showToast('No expenses found', 'info');
    } catch {
      showToast('Parse failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddParsedExpenses = async () => {
    if (parsedExpenses.length === 0) return;
    setIsSubmitting(true);
    try {
      await expenseApi.bulkCreate(id!, parsedExpenses);
      setWhatsappText('');
      setParsedExpenses([]);
      showToast('Successfully imported!', 'success');
      loadData();
    } catch {
      showToast('Import failed', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportPDF = async () => {
    try {
      const response = await utilityApi.getPDF(id!);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = `${trip?.name}_report.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
      showToast('PDF downloaded successfully!', 'success');
    } catch {
      showToast('PDF export failed', 'error');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans text-slate-900 pb-32 overflow-x-hidden">
      
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#0B1A2C]" />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-lg font-black tracking-tight text-[#0B1A2C] truncate max-w-[180px]">{trip.name}</h1>
            <Link to={`/trip/${id}/members`} className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] flex items-center gap-1 hover:underline">
              <Users size={12} strokeWidth={3} /> {trip.members.length} Members
            </Link>
          </div>
          <button 
            onClick={handleExportPDF}
            className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-indigo-600"
          >
            <Download size={20} strokeWidth={2.5} />
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-28 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Main "Featured Trip" Gradient Card */}
        {summary && (
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900 rounded-[2.5rem] shadow-2xl shadow-indigo-100 transform -rotate-1 group-hover:rotate-0 transition-transform duration-500" />
            <div className="relative p-8 text-white space-y-8">
               <div className="flex items-start justify-between">
                  <div className="space-y-1">
                     <p className="text-xs font-black text-indigo-200 uppercase tracking-widest opacity-80">Total Group Spent</p>
                     <h2 className="text-5xl font-black tracking-tighter">₹{summary.totalAmount.toLocaleString()}</h2>
                  </div>
                  <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-[1.5rem] flex items-center justify-center border border-white/20">
                     <Plane size={24} className="text-teal-300 transform -rotate-12" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl">
                     <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Per Person</p>
                     <p className="text-xl font-black text-teal-300">₹{summary.perPerson.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl">
                     <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Expenses</p>
                     <p className="text-xl font-black text-white">{summary.expenseCount}</p>
                  </div>
               </div>

               <Link to={`/trip/${id}/settlements`} className="flex items-center justify-between bg-white text-indigo-600 p-6 rounded-3xl shadow-xl hover:bg-slate-50 transition-all group/settle active:scale-95">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
                        <TrendingUp size={24} className="text-indigo-600" />
                     </div>
                     <div>
                        <p className="text-sm font-black text-[#0B1A2C] leading-none mb-1">Settlement Pending</p>
                        <p className="text-xs font-bold text-slate-400">{summary.settlements.length} transactions required</p>
                     </div>
                  </div>
                  <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center transform group-hover/settle:translate-x-1 transition-transform">
                     <ChevronRight size={20} strokeWidth={3} />
                  </div>
               </Link>
            </div>
          </div>
        )}

        {/* Invite Code & Action Bar */}
        <div className="flex items-center gap-3">
           <div className="flex-1 bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-center justify-between group">
              <div className="space-y-1">
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Invite Code</p>
                 <p className="text-xl font-black tracking-[0.2em] font-mono text-[#0B1A2C]">{trip.inviteCode}</p>
              </div>
              <button 
                onClick={copyInviteCode}
                className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 hover:bg-indigo-50 transition-colors active:scale-90"
              >
                {copied ? <Check size={20} strokeWidth={3} /> : <Copy size={20} strokeWidth={3} />}
              </button>
           </div>
           <button 
             onClick={() => navigate(`/trip/${id}/add-expense`)}
             className="w-16 h-16 bg-[#0B1A2C] text-white rounded-3xl flex items-center justify-center shadow-2xl hover:bg-slate-800 transition-all active:scale-90"
           >
             <Plus size={32} strokeWidth={3} />
           </button>
        </div>

        {/* Dynamic Tab Navigation */}
        <div className="space-y-6">
           <div className="flex items-center gap-2 p-1.5 bg-slate-100 rounded-[1.5rem] shadow-inner">
              {[
                { id: 'expenses', label: 'Expenses', icon: <ReceiptText size={18} /> },
                { id: 'summary', label: 'Analytics', icon: <PieChart size={18} /> },
                { id: 'whatsapp', label: 'Paste Bills', icon: <MessageSquare size={18} /> },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id as any)}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                    tab === t.id 
                      ? 'bg-white text-[#0B1A2C] shadow-lg scale-[1.02]' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {t.icon} <span className="hidden sm:inline">{t.label}</span>
                </button>
              ))}
           </div>

           {/* Tab Content Rendering */}
           <div className="min-h-[300px]">
              {tab === 'expenses' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  {expenses.length === 0 ? (
                    <div className="bg-white rounded-[2rem] p-12 text-center border-2 border-dashed border-slate-100">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Receipt size={28} className="text-slate-200" />
                       </div>
                       <h3 className="text-xl font-black text-[#0B1A2C]">No bills yet</h3>
                       <p className="text-slate-400 font-bold mb-6">Hit the plus button to add your first expense.</p>
                       <button onClick={() => navigate(`/trip/${id}/add-expense`)} className="bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-sm shadow-xl">
                          Add Now
                       </button>
                    </div>
                  ) : (
                    expenses.map(exp => (
                      <ExpenseItem key={exp._id} expense={exp} onDelete={handleDeleteExpense} />
                    ))
                  )}
                </div>
              )}

              {tab === 'summary' && summary && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   {/* Category Breakdown */}
                   <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-[#0B1A2C]">Spending Pulse</h3>
                         <div className="px-3 py-1 bg-teal-50 text-teal-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Dynamic Stats</div>
                      </div>
                      <div className="space-y-6">
                        {Object.entries(summary.categoryBreakdown)
                          .sort(([,a]: any, [,b]: any) => b.amount - a.amount)
                          .map(([cat, data]: [string, any]) => {
                            const category = getCategoryInfo(cat);
                            const percent = (data.amount / summary.totalAmount) * 100;
                            return (
                              <div key={cat} className="space-y-2">
                                <div className="flex justify-between items-center text-xs font-black uppercase">
                                  <span className="flex items-center gap-2 text-slate-500">
                                    <span className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-base">{category.icon}</span> {category.label}
                                  </span>
                                  <span className="text-[#0B1A2C]">₹{data.amount.toLocaleString()} <span className="text-slate-300 ml-1">({percent.toFixed(0)}%)</span></span>
                                </div>
                                <div className="relative w-full h-3 bg-slate-50 rounded-full overflow-hidden border border-slate-100">
                                  <div
                                    className={`absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ${category.color.split(' ')[1].replace('text-', 'bg-')}`}
                                    style={{ width: `${percent}%` }}
                                  />
                                </div>
                              </div>
                            );
                          })
                        }
                      </div>
                   </div>

                   {/* Quick Tips */}
                   <div className="bg-[#0B1A2C] rounded-[2rem] p-8 text-white relative overflow-hidden group">
                      <Globe className="absolute -right-8 -bottom-8 w-40 h-40 text-white/5 transform group-hover:rotate-45 transition-transform duration-1000" />
                      <div className="relative z-10 space-y-4">
                         <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <Info className="text-teal-300" />
                         </div>
                         <h3 className="text-2xl font-black leading-tight">Export the final <br /> trip report.</h3>
                         <p className="text-indigo-200 font-medium text-sm">Download a professional PDF with all transactions and final member balances.</p>
                         <button onClick={handleExportPDF} className="bg-white text-[#0B1A2C] px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-teal-300 transition-colors">
                            Download PDF
                         </button>
                      </div>
                   </div>
                </div>
              )}

              {tab === 'whatsapp' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                   <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-sm space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                            <MessageSquare size={32} />
                         </div>
                         <div>
                            <h3 className="text-xl font-black text-[#0B1A2C]">Paste Group Msgs</h3>
                            <p className="text-sm font-bold text-slate-400 tracking-tight">AI will auto-detect amounts & titles.</p>
                         </div>
                      </div>

                      <textarea
                        value={whatsappText}
                        onChange={(e) => setWhatsappText(e.target.value)}
                        placeholder={`Pizza 1200 John\nCab 500 Emily\nTickets 4500 Mark`}
                        className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 font-mono text-sm focus:outline-none focus:border-emerald-500/30 transition-all placeholder:text-slate-300"
                      />

                      <button
                        onClick={handleParseWhatsApp}
                        disabled={isSubmitting || !whatsappText.trim()}
                        className="w-full bg-[#0B1A2C] text-white py-5 rounded-2xl font-black shadow-xl disabled:opacity-50 flex items-center justify-center gap-3 transition-all active:scale-95"
                      >
                        <Sparkles size={20} className="text-teal-300" /> {isSubmitting ? 'Analyzing...' : 'Analyze Text'}
                      </button>
                   </div>

                   {parsedExpenses.length > 0 && (
                     <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-black text-[#0B1A2C]">{parsedExpenses.length} Detected</h3>
                           <button onClick={() => setParsedExpenses([])} className="text-[10px] font-black text-red-500 uppercase tracking-widest uppercase tracking-widest px-3 py-1 bg-red-50 rounded-lg">Clear All</button>
                        </div>
                        <div className="space-y-3 max-h-64 overflow-y-auto pr-2 scrollbar-thin">
                          {parsedExpenses.map((exp, i) => (
                            <div key={i} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                              <div>
                                <p className="font-black text-[#0B1A2C] capitalize">{exp.title}</p>
                                <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{exp.category} • Paid by {exp.paidBy}</p>
                              </div>
                              <p className="font-black text-indigo-600 text-lg">₹{exp.amount}</p>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleAddParsedExpenses}
                          disabled={isSubmitting}
                          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-2xl font-black shadow-xl active:scale-95 transition-all outline-none"
                        >
                          {isSubmitting ? 'Importing...' : 'Confirm & Add All'}
                        </button>
                     </div>
                   )}
                </div>
              )}
           </div>
        </div>
      </main>

      {/* Global Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-6">
        <div className="max-w-md mx-auto bg-[#0B1A2C] rounded-[2rem] p-2 flex items-center justify-around shadow-2xl border border-white/5 ring-8 ring-indigo-50/50">
          <button onClick={() => navigate('/dashboard')} className="p-4 text-slate-400 hover:text-white transition-colors group">
            <LayoutDashboard size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={() => navigate('/history')} className="p-4 text-slate-400 hover:text-white transition-colors group">
            <History size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
          <button onClick={() => navigate(`/trip/${id}/settlements`)} className="p-4 text-slate-400 hover:text-white transition-colors group">
            <Wallet size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
          <button className="p-4 text-slate-400 hover:text-white transition-colors group">
            <Settings size={20} strokeWidth={2.5} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </nav>
    </div>
  );
}
