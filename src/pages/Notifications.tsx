import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BellDot, ReceiptText, UserPlus, CheckCircle2 } from 'lucide-react';

export default function Notifications() {
  const navigate = useNavigate();

  const mockNotifs = [
    { type: 'expense', text: 'Liam added "Seafood Dinner" for ₹2500 in Bali Trip', time: '10m ago', icon: <ReceiptText size={16} />, color: 'bg-orange-50 text-orange-600' },
    { type: 'settle', text: 'Sofia settled ₹450 with you', time: '2h ago', icon: <CheckCircle2 size={16} />, color: 'bg-emerald-50 text-emerald-600' },
    { type: 'join', text: 'Noah joined the Summer Tour', time: '1d ago', icon: <UserPlus size={16} />, color: 'bg-indigo-50 text-indigo-600' },
    { type: 'expense', text: 'You added "Flight Tickets" for ₹12000', time: '2d ago', icon: <ReceiptText size={16} />, color: 'bg-blue-50 text-blue-600' },
  ];

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Activity Updates</span>
        <button className="relative w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600">
          <BellDot size={20} strokeWidth={2.5} />
          <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-indigo-50" />
        </button>
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2 mb-4">Recent</h2>

          {mockNotifs.map((n, i) => (
             <div key={i} className="bg-white rounded-[1.5rem] p-5 shadow-sm border border-slate-100 flex items-start gap-4">
               <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${n.color}`}>
                  {n.icon}
               </div>
               <div>
                 <p className="text-sm font-bold text-[#0B1A2C] leading-snug">{n.text}</p>
                 <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-2">{n.time}</p>
               </div>
             </div>
          ))}

        </div>
      </main>
    </div>
  );
}
