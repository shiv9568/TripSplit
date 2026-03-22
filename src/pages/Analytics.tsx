import { useState, useEffect } from 'react';
import { ArrowLeft, PieChart, BarChart3, ChevronDown, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { expenseApi } from '../utils/api';
import type { TripSummary } from '../types';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function Analytics() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [timeRange] = useState('All Time');
  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    expenseApi.getSummary(id).then(res => {
      setSummary(res.data);
      setIsLoading(false);
    }).catch(err => {
      console.error(err);
      setIsLoading(false);
    });
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fbfa] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!summary) return null;

  const ALL_CATEGORIES = [
    { value: 'food', label: 'Food', color: 'bg-orange-100 text-orange-600', hex: '#f97316' },
    { value: 'petrol', label: 'Petrol', color: 'bg-amber-100 text-amber-600', hex: '#f59e0b' },
    { value: 'hotel', label: 'Hotel', color: 'bg-indigo-100 text-indigo-600', hex: '#4f46e5' },
    { value: 'travel', label: 'Travel', color: 'bg-blue-100 text-blue-600', hex: '#2563eb' },
    { value: 'tickets', label: 'Tickets', color: 'bg-pink-100 text-pink-600', hex: '#db2777' },
    { value: 'entertainment', label: 'Entertainment', color: 'bg-purple-100 text-purple-600', hex: '#9333ea' },
    { value: 'shopping', label: 'Shopping', color: 'bg-teal-100 text-teal-600', hex: '#0d9488' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-600', hex: '#475569' },
  ];

  const categories = ALL_CATEGORIES.map(cat => {
    const data = summary.categoryBreakdown[cat.value];
    const amount = data ? data.amount : 0;
    return {
      name: cat.label,
      amount: amount,
      color: cat.color,
      hex: cat.hex,
      percent: summary.totalAmount > 0 ? Math.round((amount / summary.totalAmount) * 100) : 0
    };
  }).sort((a, b) => b.amount - a.amount);

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <header className="relative z-10 px-4 sm:px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Analytics</span>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 hover:bg-slate-50 transition-colors">
          <Download size={20} strokeWidth={2.5} />
        </button>
      </header>

      <main className="flex-1 relative z-10 p-4 sm:p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Spent</p>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0B1A2C] tracking-tighter break-words">₹{summary.totalAmount.toLocaleString()}</h2>
            </div>
            <button className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-xs font-black text-[#0B1A2C] shadow-sm shrink-0">
              {timeRange} <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-indigo-500" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category Breakdown</h3>
            </div>
            
            {/* Real Pie Chart from Recharts */}
            {categories.length > 0 ? (
              <div className="h-[250px] w-full mt-4 mb-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                        <Pie
                          data={categories}
                          cx="50%"
                          cy="50%"
                          innerRadius={65}
                          outerRadius={95}
                          paddingAngle={5}
                          minAngle={15}
                          dataKey="amount"
                          stroke="none"
                        >
                          {categories.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.hex} />
                          ))}
                        </Pie>
                        <Tooltip 
                          formatter={(value: any) => [`₹${Number(value).toLocaleString()}`, 'Amount']}
                          contentStyle={{ borderRadius: '1rem', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                        />
                    </RechartsPieChart>
                  </ResponsiveContainer>
              </div>
            ) : (
              <div className="text-center text-slate-400 font-bold py-10">No expenses yet.</div>
            )}

            <div className="space-y-4 pt-2">
              {categories.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: cat.hex }} />
                     <span className="font-bold text-[#0B1A2C] text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="font-black text-[#0B1A2C]">₹{cat.amount.toLocaleString()}</span>
                     <span className="text-xs font-bold text-slate-400 w-8 text-right">{cat.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Simple Stats to replace fake daily spending */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-teal-500" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-3xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Per Head</p>
                   <p className="font-black text-[#0B1A2C] text-lg break-words">₹{summary.perPerson.toLocaleString()}</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-3xl">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Bills</p>
                   <p className="font-black text-[#0B1A2C] text-lg">{summary.expenseCount}</p>
                </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
