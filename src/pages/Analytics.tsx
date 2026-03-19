import { useState } from 'react';
import { ArrowLeft, PieChart, BarChart3, ChevronDown, Download } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

export default function Analytics() {
  const navigate = useNavigate();
  const { id: _id } = useParams();
  const [timeRange, _setTimeRange] = useState('All Time');

  // Mock data
  const totalSpent = 12500;
  const categories = [
    { name: 'Food', amount: 4500, color: 'bg-orange-400', percent: 36 },
    { name: 'Travel', amount: 3000, color: 'bg-emerald-400', percent: 24 },
    { name: 'Hotel', amount: 3500, color: 'bg-indigo-400', percent: 28 },
    { name: 'Other', amount: 1500, color: 'bg-slate-400', percent: 12 },
  ];

  const dailySpending = [300, 800, 400, 1200, 600, 200, 900];

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
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

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          {/* Header */}
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Spent</p>
              <h2 className="text-4xl font-black text-[#0B1A2C] tracking-tighter">₹{totalSpent.toLocaleString()}</h2>
            </div>
            <button className="flex items-center gap-1 bg-white px-3 py-1.5 rounded-xl border border-slate-100 text-xs font-black text-[#0B1A2C] shadow-sm">
              {timeRange} <ChevronDown size={14} className="text-slate-400" />
            </button>
          </div>

          {/* Category Breakdown (Donut Chart representation) */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center gap-2">
              <PieChart size={18} className="text-indigo-500" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Category Breakdown</h3>
            </div>
            
            {/* Visual Bar Map instead of actual SVG pie for UI mockup simplicity */}
            <div className="flex h-12 rounded-2xl overflow-hidden gap-1 bg-slate-50 p-1">
               {categories.map(cat => (
                 <div key={cat.name} className={`h-full rounded-xl ${cat.color}`} style={{ width: `${cat.percent}%` }} />
               ))}
            </div>

            <div className="space-y-4 pt-2">
              {categories.map(cat => (
                <div key={cat.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                     <div className={`w-3 h-3 rounded-full ${cat.color}`} />
                     <span className="font-bold text-[#0B1A2C] text-sm">{cat.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="font-black text-[#0B1A2C]">₹{cat.amount}</span>
                     <span className="text-xs font-bold text-slate-400 w-8 text-right">{cat.percent}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Spending (Bar Chart representation) */}
          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-6">
            <div className="flex items-center gap-2">
              <BarChart3 size={18} className="text-teal-500" />
              <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Daily Spending</h3>
            </div>
            
            <div className="h-40 flex items-end justify-between gap-2 pt-4 border-b border-slate-100 pb-2">
               {dailySpending.map((amount, i) => (
                 <div key={i} className="flex flex-col items-center gap-2 flex-1 group">
                    <div 
                      className="w-full bg-teal-100 group-hover:bg-teal-400 rounded-lg transition-colors relative"
                      style={{ height: `${(amount / 1200) * 100}%` }}
                    >
                      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-black text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity">
                        ₹{amount}
                      </span>
                    </div>
                 </div>
               ))}
            </div>
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
               <span>Mon</span>
               <span>Sun</span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
