import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, FileText, CalendarDays, TrendingUp } from 'lucide-react';

export default function TripSummary() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Trip Report</span>
        <button className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-indigo-600 hover:bg-slate-50 transition-colors">
          <Download size={20} strokeWidth={2.5} />
        </button>
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-4 py-6">
             <div className="w-20 h-20 bg-indigo-600 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-indigo-200">
                <FileText size={32} />
             </div>
             <div>
               <h2 className="text-3xl font-black text-[#0B1A2C] tracking-tighter">Final Balances</h2>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2 flex items-center justify-center gap-2">
                 <CalendarDays size={14} /> Aug 15 - Aug 20
               </p>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 space-y-6">
             <div className="flex items-center justify-between border-b border-slate-50 pb-6">
                <div className="space-y-1">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Total Spent</p>
                   <p className="text-2xl font-black text-[#0B1A2C]">₹24,500</p>
                </div>
                <div className="space-y-1 text-right">
                   <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">My Share</p>
                   <p className="text-2xl font-black text-indigo-600">₹6,125</p>
                </div>
             </div>
             
             <div className="space-y-4 pt-2">
                <h3 className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                   <TrendingUp size={14} /> Final Settlement
                </h3>
                
                {/* Mock data */}
                {[
                  { name: 'Liam', owes: 'Sofia', amount: 15, type: 'owes' },
                  { name: 'Noah', owes: 'Me', amount: 50, type: 'gets' },
                ].map((s, i) => (
                   <div key={i} className={`p-4 rounded-[1.5rem] border ${s.type === 'owes' ? 'bg-orange-50/50 border-orange-100' : 'bg-emerald-50/50 border-emerald-100'} flex items-center justify-between`}>
                     <div className="flex items-center gap-3">
                       <div className="flex -space-x-3">
                          <div className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center font-bold text-slate-500 text-xs">
                             {s.name[0]}
                          </div>
                          <div className="w-10 h-10 rounded-full border-2 border-white bg-indigo-200 flex items-center justify-center font-bold text-indigo-600 text-xs">
                             {s.owes[0]}
                          </div>
                       </div>
                       <div>
                         <p className="font-bold text-[#0B1A2C] text-sm">{s.name} owes {s.owes}</p>
                       </div>
                     </div>
                     <span className={`font-black text-lg ${s.type === 'owes' ? 'text-orange-500' : 'text-emerald-500'}`}>
                        ₹{s.amount}
                     </span>
                   </div>
                ))}
             </div>
          </div>

          <button className="w-full relative group mt-8">
            <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl group-hover:blur-2xl opacity-20 transition-all top-2" />
            <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-6 rounded-3xl text-sm font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95">
              <Download size={20} strokeWidth={3} className="text-indigo-400" /> Download PDF Report
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
