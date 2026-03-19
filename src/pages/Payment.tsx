import { useNavigate } from 'react-router-dom';
import { ArrowLeft, QrCode, CreditCard, Banknote, CheckCircle2 } from 'lucide-react';
import { useState } from 'react';

export default function Payment() {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'cash' | 'card'>('upi');
  const [success, setSuccess] = useState(false);

  const handlePay = () => {
    setSuccess(true);
    setTimeout(() => {
      navigate(-1);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Settle Up</span>
        <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-2 mt-4">
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">You owe Sofia</p>
             <h2 className="text-5xl font-black text-indigo-600 tracking-tighter">₹450</h2>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-4 mt-8">
             <h3 className="text-[10px] font-black uppercase tracking-widest pl-2 text-slate-400">Payment Method</h3>
             
             <div className="space-y-3">
               {[
                 { id: 'upi', icon: <QrCode size={20} />, label: 'UPI Pay (QR)', desc: 'Pay instantly via scanner' },
                 { id: 'cash', icon: <Banknote size={20} />, label: 'Cash Given', desc: 'Settle offline' },
               ].map(method => (
                 <div
                   key={method.id}
                   onClick={() => setPaymentMethod(method.id as any)}
                   className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all ${
                     paymentMethod === method.id 
                       ? 'bg-indigo-50 border-indigo-500 shadow-md' 
                       : 'bg-slate-50 border-slate-50 hover:border-slate-200'
                   }`}
                 >
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${paymentMethod === method.id ? 'bg-indigo-600 text-white' : 'bg-white text-slate-400'}`}>
                     {method.icon}
                   </div>
                   <div className="flex-1">
                      <p className={`font-black tracking-tight text-sm ${paymentMethod === method.id ? 'text-[#0B1A2C]' : 'text-slate-500'}`}>{method.label}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{method.desc}</p>
                   </div>
                   <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'}`}>
                     {paymentMethod === method.id && <div className="w-2 h-2 bg-white rounded-full" />}
                   </div>
                 </div>
               ))}
             </div>
          </div>

          {paymentMethod === 'upi' && (
             <div className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 text-center flex flex-col items-center">
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Scan QR code</p>
                <div className="w-48 h-48 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] flex items-center justify-center">
                   <QrCode size={120} className="text-slate-300" />
                </div>
             </div>
          )}

          <button
            onClick={handlePay}
            disabled={success}
            className="w-full relative group mt-8"
          >
            <div className={`absolute inset-0 rounded-3xl blur-xl group-hover:blur-2xl opacity-20 transition-all top-2 ${success ? 'bg-emerald-600' : 'bg-indigo-600'}`} />
            <div className={`relative py-5 rounded-3xl text-sm font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 ${success ? 'bg-emerald-600 text-white' : 'bg-[#0B1A2C] text-white hover:bg-slate-800'}`}>
              {success ? <><CheckCircle2 size={18} /> Settled Successfully!</> : 'Mark as Paid'}
            </div>
          </button>

        </div>
      </main>
    </div>
  );
}
