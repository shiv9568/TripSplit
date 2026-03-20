import { useState, useEffect, useCallback, memo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, ArrowRight, Plus, Receipt, PieChart, Users, X,
  Copy, Check, Trash2, MessageSquare, Download, Edit2, HandCoins,
  Plane, Globe, Sparkles, TrendingUp, ChevronRight,
  Info, History, LayoutDashboard, ReceiptText, Home, User
} from 'lucide-react';
import { tripApi, expenseApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import type { Trip, Expense, TripSummary } from '../types';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

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
  onDelete,
  onEdit
}: { 
  expense: Expense; 
  onDelete: (id: string) => void;
  onEdit: (id: string) => void;
}) {
  const category = getCategoryInfo(expense.category);
  
  return (
    <div className="group bg-white rounded-3xl p-3 sm:p-4 border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-3 sm:gap-4 relative overflow-hidden">
      <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border-2 ${category.color} ${category.border} shadow-sm transition-transform`}>
        {category.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-[#0B1A2C] truncate text-base sm:text-lg tracking-tight leading-tight">{expense.title}</p>
        <p className="text-[9px] sm:text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5 truncate">
          {category.label} • Paid by <span className="text-indigo-600">{expense.paidBy}</span>
        </p>
      </div>
      <div className="text-right shrink-0 pr-1">
        <p className="text-lg sm:text-xl font-black text-[#0B1A2C]">₹{expense.amount.toLocaleString()}</p>
        <p className="text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-tighter">
          {new Date(expense.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
        <button
          onClick={() => onEdit(expense._id)}
          className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90"
          title="Edit Expense"
        >
          <Edit2 size={16} sm-size={18} />
        </button>
        <button
          onClick={() => onDelete(expense._id)}
          className="p-2 text-rose-300 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all active:scale-90"
          title="Delete Expense"
        >
          <Trash2 size={16} sm-size={18} />
        </button>
      </div>
    </div>
  );
});

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, setLastTripId } = useApp();
  const { showToast } = useToast();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tab, setTab] = useState<'expenses' | 'summary' | 'settlements' | 'members'>('expenses');
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadData = useCallback(async () => {
    if (!id) return;
    try {
      const [tripRes, expensesRes, summaryRes] = await Promise.all([
        tripApi.getById(id),
        expenseApi.getAll(id),
        expenseApi.getSummary(id),
      ]);
      
      const updatedTrip = tripRes.data;
      setTrip(updatedTrip);
      setExpenses(expensesRes.data);
      setSummary(summaryRes.data);
      setLastTripId(id);

      // Check if current user is still authorized (member or creator)
      if (currentUser) {
         const isMember = updatedTrip.members.some((m: any) => m.name === currentUser?.name || m.email === currentUser?.email);
         const isAdmin = updatedTrip.createdBy === currentUser?.email || updatedTrip.createdBy === currentUser?.name;
         if (!isMember && !isAdmin) {
            showToast('You are no longer a member of this trip.', 'info');
            setLastTripId('');
            navigate('/');
         }
      }
    } catch (err) {
      console.error('Data Sync Error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [id, currentUser, navigate, setLastTripId, showToast]);

  useEffect(() => {
    setIsLoading(true);
    loadData();
    // High-frequency polling (3s) for near real-time feel
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, [loadData]);

  const copyInviteCode = () => {
    if (trip?.inviteCode) {
      navigator.clipboard.writeText(trip.inviteCode);
      setCopied(true);
      showToast('Invite code copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleApprove = async (name: string) => {
    try {
      await tripApi.approve(id!, name);
      showToast(`${name} joined the trip!`, 'success');
      loadData();
    } catch {
      showToast('Failed to approve member', 'error');
    }
  };

  const handleReject = async (name: string) => {
    try {
      await tripApi.reject(id!, name);
      showToast('Request rejected', 'info');
      loadData();
    } catch {
      showToast('Failed to reject request', 'error');
    }
  };

  const handleRemoveMember = async (name: string) => {
    if (name === trip?.createdBy) {
      showToast("Cannot remove the admin", 'error');
      return;
    }
    if (!window.confirm(`Remove ${name} from the trip?`)) return;
    try {
      await tripApi.removeMember(id!, name);
      showToast(`${name} removed`, 'success');
      loadData();
    } catch {
      showToast('Failed to remove member', 'error');
    }
  };

  const handleExportPDF = () => {
    if (!trip || !summary) return;

    try {
      const doc = new jsPDF();
      
      // Professional Header
      doc.setFontSize(22);
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text(trip.name, 14, 22);
      
      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Created By: ${trip.createdBy}`, 14, 30);
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 35);
      
      // Summary Box
      doc.setDrawColor(240);
      doc.setFillColor(248, 250, 252); // slate-50
      doc.roundedRect(14, 42, 182, 35, 3, 3, 'F');
      
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42); // slate-900
      doc.text("Trip Summary", 20, 50);
      
      doc.setFontSize(10);
      doc.text(`Total Group Spent: Rs. ${summary.totalAmount.toLocaleString()}`, 20, 58);
      doc.text(`Estimated Per Head: Rs. ${summary.perPerson.toLocaleString()}`, 20, 64);
      doc.text(`Total Expenses: ${summary.expenseCount}`, 20, 70);
      
      // Expense Table
      const tableData = expenses.map(ex => [
        new Date(ex.date).toLocaleDateString(),
        ex.title,
        ex.category.charAt(0).toUpperCase() + ex.category.slice(1),
        ex.paidBy,
        `Rs. ${ex.amount.toLocaleString()}`
      ]);

      autoTable(doc, {
        startY: 85,
        head: [['Date', 'Description', 'Category', 'Paid By', 'Amount']],
        body: tableData,
        headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [249, 250, 251] },
        margin: { top: 85 },
      });

      doc.save(`${trip.name.replace(/\s+/g, '_')}_Expense_Report.pdf`);
      showToast('Professional PDF report generated!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Failed to generate PDF', 'error');
    }
  };

  const handleExportExcel = () => {
    // Basic CSV implementation for "Excel" compatibility
    if (!trip || !expenses.length) return;
    
    const headers = ['Date', 'Description', 'Category', 'Paid By', 'Amount'];
    const rows = expenses.map(ex => [
      new Date(ex.date).toLocaleDateString(),
      ex.title,
      ex.category,
      ex.paidBy,
      ex.amount
    ]);
    
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${trip.name.replace(/\s+/g, '_')}_Expenses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Excel-compatible CSV exported!', 'success');
  };

  const [showAddMember, setShowAddMember] = useState(false);
  const [newMemberName, setNewMemberName] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName.trim()) return;
    try {
      await tripApi.addMember(id!, newMemberName.trim(), newMemberEmail.trim() || undefined);
      showToast(`${newMemberName} added to the group!`, 'success');
      setNewMemberName('');
      setNewMemberEmail('');
      setShowAddMember(false);
      loadData();
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to add member', 'error');
    }
  };

  const handleLeave = async () => {
    if (!window.confirm('Are you sure you want to leave this group?')) return;
    try {
      if (!currentUser) return;
      await tripApi.leave(id!, currentUser);
      showToast('You left the group', 'info');
      setCurrentUser('');
      setLastTripId('');
      navigate('/');
    } catch {
      showToast('Failed to leave group', 'error');
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

  const handleEditExpense = (expenseId: string) => {
    navigate(`/trip/${id}/edit-expense/${expenseId}`);
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
            onClick={() => navigate('/')}
            className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center hover:bg-slate-200 transition-colors"
          >
            <ArrowLeft size={20} className="text-[#0B1A2C]" strokeWidth={3} />
          </button>
          <div className="flex flex-col items-center">
            <h1 className="text-[10px] font-black tracking-widest text-slate-400 uppercase opacity-60 mb-0.5">{trip.name}</h1>
            <button 
              onClick={() => setTab('members')} 
              className={`text-sm font-black text-[#1a1035] flex items-center gap-1.5 hover:text-indigo-600 transition-colors ${tab === 'members' ? 'text-indigo-600' : ''}`}
            >
              <Users size={14} strokeWidth={3} /> {trip.members.length} Members
            </button>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleExportExcel}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-emerald-600 hover:bg-emerald-50"
              title="Export as Excel"
            >
              <ReceiptText size={18} strokeWidth={2.5} />
            </button>
            <button 
              onClick={handleExportPDF}
              className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-sm hover:shadow-md transition-all text-indigo-600 hover:bg-indigo-50"
              title="Export as PDF"
            >
              <Download size={18} strokeWidth={2.5} />
            </button>
          </div>
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
                     <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Per Head</p>
                     <p className="text-xl font-black text-teal-300">₹{summary.perPerson.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-3xl">
                     <p className="text-[10px] font-black text-indigo-100 uppercase tracking-widest mb-1">Expenses</p>
                     <p className="text-xl font-black text-white">{summary.expenseCount}</p>
                  </div>
               </div>

               {/* Budget Progress Bar */}
               {trip.budget && trip.budget > 0 && (
                 <div className="pt-2 animate-in slide-in-from-top-4 duration-700">
                    <div className="flex justify-between items-end mb-3">
                       <span className="text-[10px] font-black text-indigo-100 uppercase tracking-[0.2em] opacity-80">Trip Budget Status</span>
                       <span className="text-sm font-black text-white">₹{summary.totalAmount.toLocaleString()} / ₹{trip.budget.toLocaleString()}</span>
                    </div>
                    <div className="h-4 bg-white/10 backdrop-blur-md rounded-full overflow-hidden border border-white/20 p-0.5">
                       <div 
                         className={`h-full rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,255,255,0.2)] ${
                            (summary.totalAmount / trip.budget) >= 0.9 ? 'bg-gradient-to-r from-red-400 to-rose-600' :
                            (summary.totalAmount / trip.budget) >= 0.8 ? 'bg-gradient-to-r from-orange-400 to-red-500' :
                            (summary.totalAmount / trip.budget) >= 0.5 ? 'bg-gradient-to-r from-yellow-400 to-orange-400' :
                            'bg-gradient-to-r from-teal-400 to-emerald-500'
                         }`}
                         style={{ width: `${Math.min(100, (summary.totalAmount / trip.budget) * 100)}%` }}
                       />
                    </div>
                    <div className="flex justify-between mt-2">
                       <span className="text-[9px] font-bold text-indigo-200 capitalize">
                          {Math.floor((summary.totalAmount / trip.budget) * 100)}% utilized
                       </span>
                       {(summary.totalAmount / trip.budget) >= 0.8 && (
                          <span className="text-[9px] font-black text-red-300 uppercase animate-pulse flex items-center gap-1">
                             ⚠️ Critical Limit Reached
                          </span>
                       )}
                    </div>
                 </div>
               )}

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
           {/* Sub-Navigation Tabs */}
                       <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 mb-6 bg-slate-100/50 p-1 rounded-[2rem] snap-x">
               <button
                 onClick={() => setTab('expenses')}
                 className={`px-4 py-2.5 rounded-[1.5rem] text-[10px] sm:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-tight snap-center ${tab === 'expenses' ? 'bg-[#1a1035] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
               >
                 <ReceiptText size={14} className="sm:size-4" /> Bill Board
               </button>
               <button
                 onClick={() => setTab('summary')}
                 className={`px-4 py-2.5 rounded-[1.5rem] text-[10px] sm:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-tight snap-center ${tab === 'summary' ? 'bg-[#1a1035] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
               >
                 <PieChart size={14} className="sm:size-4" /> Analytics
               </button>
               <button
                 onClick={() => setTab('settlements')}
                 className={`px-4 py-2.5 rounded-[1.5rem] text-[10px] sm:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-tight snap-center ${tab === 'settlements' ? 'bg-[#1a1035] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
               >
                 <HandCoins size={14} className="sm:size-4" /> Hisab-Kitab
               </button>
               <button
                 onClick={() => setTab('members')}
                 className={`px-4 py-2.5 rounded-[1.5rem] text-[10px] sm:text-xs font-black transition-all flex items-center gap-1.5 shrink-0 uppercase tracking-tight snap-center ${tab === 'members' ? 'bg-[#1a1035] text-white shadow-md' : 'text-slate-500 hover:bg-white/50'}`}
               >
                 <Users size={14} className="sm:size-4" /> Members
               </button>
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
                      <ExpenseItem key={exp._id} expense={exp} onDelete={handleDeleteExpense} onEdit={handleEditExpense} />
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

                {/* Member Net Balances Section */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-8 mt-8">
                   <div className="flex items-center justify-between">
                      <div className="space-y-1">
                         <h3 className="text-xl font-black text-[#1a1035]">Member Balances</h3>
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Net Payable vs Receivable</p>
                      </div>
                      <HandCoins className="text-indigo-400" size={24} />
                   </div>

                   <div className="grid gap-4">
                      {Object.entries(summary.balances).map(([name, balance]) => (
                         <div key={name} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-slate-100">
                            <div className="flex items-center gap-4">
                               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center font-black text-[#1a1035] shadow-sm border border-slate-100">
                                  {name.charAt(0).toUpperCase()}
                               </div>
                               <div>
                                  <p className="font-black text-[#1a1035]">{name}</p>
                                  <div className="flex items-center gap-2 mt-0.5">
                                     <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Paid: ₹{summary.paidBy[name]?.toLocaleString() || 0}</span>
                                  </div>
                               </div>
                            </div>
                            <div className="text-right">
                               <p className={`text-lg font-black ${balance >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                                  {balance >= 0 ? '+' : '-'}₹{Math.abs(balance).toLocaleString()}
                               </p>
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                  {balance >= 0 ? 'To Get' : 'To Pay'}
                                </p>
                            </div>
                         </div>
                      ))}
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

              {tab === 'members' && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {/* Admin Moderation: Pending Requests */}
                    {currentUser === trip?.createdBy && trip?.pendingMembers && (trip.pendingMembers as any[]).length > 0 && (
                      <div className="bg-amber-50 rounded-[2.5rem] p-8 border border-amber-100 shadow-inner space-y-5">
                        <div className="flex items-center gap-3 text-amber-900">
                          <Plus className="w-5 h-5" />
                          <h3 className="text-xl font-black italic">Member Requests</h3>
                        </div>
                        <div className="grid gap-4">
                          {(trip.pendingMembers as any[]).map((req: any) => (
                            <div key={req.name} className="bg-white/80 backdrop-blur-sm p-5 rounded-3xl flex items-center justify-between border border-amber-200 shadow-sm">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center font-black text-amber-600">
                                     {req.name.charAt(0).toUpperCase()}
                                  </div>
                                  <div>
                                     <p className="font-black text-amber-900">{req.name}</p>
                                     <p className="text-[10px] text-amber-600/60 font-black uppercase tracking-widest">Wants to Join</p>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleApprove(req.name)}
                                    className="bg-indigo-600 text-white p-2.5 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-indigo-100"
                                  >
                                    <Check size={20} strokeWidth={3} />
                                  </button>
                                  <button 
                                    onClick={() => handleReject(req.name)}
                                    className="bg-rose-100 text-rose-600 p-2.5 rounded-xl hover:bg-rose-200 transition-colors"
                                  >
                                    <X size={20} strokeWidth={3} />
                                  </button>
                               </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
 
                   {/* Manual Add Member (Admin Only) */}
                   {currentUser === trip?.createdBy && (
                     <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-4">
                        <div className="flex items-center justify-between">
                           <h3 className="text-xl font-black text-[#1a1035]">Add New Traveler</h3>
                           <button 
                             onClick={() => setShowAddMember(!showAddMember)}
                             className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${showAddMember ? 'bg-rose-50 text-rose-500 rotate-45' : 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'}`}
                           >
                             <Plus size={20} strokeWidth={3} />
                           </button>
                        </div>

                        {showAddMember && (
                          <form onSubmit={handleAddMember} className="space-y-4 animate-in fade-in slide-in-from-top-4 duration-300">
                             <div className="space-y-3">
                                <input 
                                  type="text"
                                  placeholder="Full Name (e.g. Rahul)"
                                  value={newMemberName}
                                  onChange={(e) => setNewMemberName(e.target.value)}
                                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1a1035] focus:bg-white focus:border-indigo-400 outline-none transition-all shadow-inner"
                                  required
                                />
                                <input 
                                  type="email"
                                  placeholder="Email (Optional)"
                                  value={newMemberEmail}
                                  onChange={(e) => setNewMemberEmail(e.target.value)}
                                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-[#1a1035] focus:bg-white focus:border-indigo-400 outline-none transition-all shadow-inner"
                                />
                             </div>
                             <button 
                               type="submit"
                               className="w-full bg-[#1a1035] text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-indigo-600 transition-all active:scale-95"
                             >
                                Add Member Directly
                             </button>
                          </form>
                        )}
                     </div>
                   )}

                    {/* Member Directory */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-[#1a1035]">Trip Members</h3>
                          <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-lg text-[10px] font-black uppercase tracking-widest">
                            {trip?.members.length} Active
                          </span>
                       </div>
                       <div className="grid gap-4">
                          {trip?.members.map((m: any) => (
                             <div key={m.name} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl group hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200">
                                <div className="flex items-center gap-4">
                                   <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center font-black text-indigo-600 shadow-sm ring-1 ring-slate-100 text-lg">
                                      {m.name.charAt(0).toUpperCase()}
                                   </div>                                    <div>
                                       <div className="flex items-center gap-2">
                                          <p className="font-black text-[#1a1035]">{m.name}</p>
                                          {m.name === trip.createdBy && (
                                            <span className="text-[9px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-md font-black uppercase tracking-tighter">Admin</span>
                                          )}
                                       </div>
                                       <p className="text-xs font-bold text-slate-400">{m.email || 'Group Member'}</p>
                                    </div>
                                 </div>
                                 
                                 <div className="flex items-center gap-5">
                                    <div className="text-right">
                                       <div className="space-y-0.5">
                                          <p className="text-sm font-black text-[#1a1035]">₹{summary?.paidBy[m.name]?.toLocaleString() || 0}</p>
                                          <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none">Paid</p>
                                       </div>
                                       
                                       {summary?.balances[m.name] !== undefined && (
                                          <div className={`mt-2 px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-tighter inline-block ${summary.balances[m.name] >= 0 ? 'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100' : 'bg-rose-50 text-rose-500 ring-1 ring-rose-100'}`}>
                                             {summary.balances[m.name] >= 0 ? 'Get' : 'Pay'} ₹{Math.abs(summary.balances[m.name]).toLocaleString()}
                                          </div>
                                       )}
                                    </div>

                                    {(currentUser?.name === trip?.createdBy || currentUser?.email === trip?.createdBy) && m.name !== trip.createdBy && (
                                       <button 
                                         onClick={() => handleRemoveMember(m.name)}
                                         className="p-3 text-rose-500 bg-rose-50 hover:bg-rose-100 rounded-2xl transition-all shadow-sm active:scale-95 shrink-0"
                                         title={`Remove ${m.name}`}
                                       >
                                          <Trash2 size={18} strokeWidth={3} />
                                       </button>
                                    )}
                                 </div>
                              </div>
                          ))}
                       </div>
                    </div>

                    {/* Personal Management */}
                    {trip?.members.find(m => m.name === currentUser?.name || m.email === currentUser?.email) && (
                      <div className="pt-2 px-4">
                         <button 
                           onClick={handleLeave}
                           className="w-full bg-rose-50 text-rose-600 py-5 rounded-[2rem] font-black text-sm hover:bg-rose-100 transition-all flex items-center justify-center gap-3 border border-rose-100 shadow-sm shadow-rose-100/50"
                         >
                            <ArrowRight className="rotate-180 w-5 h-5 stroke-[2.5]" /> LEAVE GROUP
                         </button>
                         <p className="text-center text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                           Note: Your existing expenses will remain in the trip.
                         </p>
                      </div>
                    )}
                 </div>
               )}
               {tab === 'settlements' && summary && (
                 <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
                       <div className="flex items-center justify-between">
                          <h3 className="text-xl font-black text-[#1a1035]">Money Breakdown</h3>
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Calculated</span>
                       </div>
                       
                       {summary.settlements.length === 0 ? (
                          <div className="py-12 text-center space-y-4">
                             <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
                                <Check size={32} strokeWidth={3} />
                             </div>
                             <p className="text-slate-400 font-bold">Everyone is all settled up!</p>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             {summary.settlements.map((settle, i) => (
                                <div key={i} className="bg-slate-50/50 rounded-3xl p-5 border border-slate-100 flex items-center justify-between">
                                   <div className="flex items-center gap-4">
                                      <div className="flex flex-col items-center">
                                         <div className="w-10 h-10 bg-white shadow-sm rounded-xl flex items-center justify-center font-black text-[#1a1035] border border-slate-200 text-xs">
                                            {settle.from.charAt(0)}
                                         </div>
                                         <span className="text-[10px] font-black text-slate-400 mt-1 uppercase">{settle.from}</span>
                                      </div>
                                      <div className="flex flex-col items-center px-2">
                                         <ArrowRight size={14} className="text-indigo-400" />
                                         <span className="text-[8px] font-black text-indigo-500 uppercase">owes</span>
                                      </div>
                                      <div className="flex flex-col items-center">
                                         <div className="w-10 h-10 bg-indigo-600 shadow-md rounded-xl flex items-center justify-center font-black text-white text-xs">
                                            {settle.to.charAt(0)}
                                         </div>
                                         <span className="text-[10px] font-black text-[#1a1035] mt-1 uppercase">{settle.to}</span>
                                      </div>
                                   </div>
                                   <div className="text-right">
                                      <p className="text-lg font-black text-[#1a1035]">₹{settle.amount.toLocaleString()}</p>
                                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">To Pay</p>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </div>
               )}
           </div>
        </div>
      </main>

      {/* Global Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-0 pb-0">
        <div className="bg-white flex items-center justify-around shadow-[0_-10px_40px_rgb(0,0,0,0.05)] border-t border-slate-100">
          <button 
            onClick={() => navigate('/trips')} 
            className="flex-1 py-4 flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <Home size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Trips</span>
          </button>
          
          <button 
            onClick={() => navigate(`/trip/${id}`)}
            className="flex-1 py-4 flex flex-col items-center gap-1 text-indigo-600 relative"
          >
            <LayoutDashboard size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Dashboard</span>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-indigo-600 rounded-b-full shadow-[0_0_10px_rgba(79,70,229,0.5)]" />
          </button>

          <button 
            onClick={() => navigate(`/trip/${id}/history`)}
            className="flex-1 py-4 flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <History size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">History</span>
          </button>

          <button 
            onClick={() => navigate('/profile')}
            className="flex-1 py-4 flex flex-col items-center gap-1 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <User size={22} strokeWidth={2.5} />
            <span className="text-[10px] font-black uppercase tracking-widest">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
