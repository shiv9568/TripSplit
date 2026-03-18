import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wallet, TrendingUp, HandCoins, ArrowRight, UserCheck, Smartphone, Copy } from 'lucide-react';
import { tripApi } from '../utils/api';
import { useToast } from '../components/Toast';

interface Settlement {
  from: string;
  to: string;
  amount: number;
}

export default function Settlements() {
  const { id: tripId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState<number | null>(null);

  useEffect(() => {
    fetchSettlements();
  }, [tripId]);

  const fetchSettlements = async () => {
    try {
      const { data } = await tripApi.getById(tripId!);
      setSettlements(data.settlements || []);
    } catch {
      showToast('Error loading settlements', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsPaid = async (index: number) => {
    setIsProcessing(index);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      const updatedSettle = [...settlements];
      updatedSettle.splice(index, 1);
      setSettlements(updatedSettle);
      showToast('Payment confirmed!', 'success');
    } catch {
      showToast('Payment failed', 'error');
    } finally {
      setIsProcessing(null);
    }
  };

  const handleUPIPay = (settle: Settlement) => {
    // UPI Deep Link Mock
    // const upiUrl = `upi://pay?pa=72005XXXX@paytm&pn=Shivansh&am=${settle.amount}&cu=INR`;
    // window.location.href = upiUrl;
    showToast(`Redirecting to UPI for ₹${settle.amount}...`, 'info');
  };

  if (isLoading) return (
     <div className="min-h-screen bg-indigo-50/20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent" />
     </div>
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-slate-50 flex flex-col font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-br from-indigo-700 via-indigo-600 to-indigo-900 rounded-b-[48px] shadow-2xl z-0" />
      <div className="absolute top-20 right-[-10%] w-[400px] h-[400px] bg-white/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 pt-10 pb-6 flex items-center justify-between">
         <button 
           onClick={() => navigate(`/trip/${tripId}`)}
           className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all"
         >
           <ArrowLeft size={24} strokeWidth={2.5} />
         </button>
         <div className="text-center">
            <h1 className="text-xl font-black text-white tracking-tight">Final Settlement</h1>
            <p className="text-indigo-200 text-[10px] font-black uppercase tracking-widest">Clear your dues</p>
         </div>
         <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 p-6 overflow-y-auto">
         <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
            
            {/* Summary Pulse */}
            <div className="bg-white rounded-3xl p-8 shadow-2xl border border-indigo-50 flex items-center justify-between">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-400">
                     <TrendingUp size={16} />
                     <span className="text-[10px] font-black uppercase tracking-widest">TOTAL PENDING</span>
                  </div>
                  <div className="text-3xl font-black text-[#0B1A2C]">
                     ₹{settlements.reduce((acc, curr) => acc + curr.amount, 0).toLocaleString()}
                  </div>
               </div>
               <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
                  <Wallet size={32} />
               </div>
            </div>

            {/* List */}
            <div className="space-y-6">
               <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">WHO OWES WHOM?</h3>
               
               {settlements.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-slate-100 flex flex-col items-center gap-4">
                     <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
                        <UserCheck size={40} />
                     </div>
                     <div>
                        <h4 className="text-lg font-black text-[#0B1A2C]">All Settled Up!</h4>
                        <p className="text-slate-400 text-sm font-bold mt-1">Everyone is squared away. Good job!</p>
                     </div>
                  </div>
               ) : (
                  <div className="space-y-4">
                     {settlements.map((settle, i) => (
                        <div 
                           key={i} 
                           className="group relative overflow-hidden bg-white rounded-3xl border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-300"
                        >
                           {/* Side Accent */}
                           <div className="absolute top-0 left-0 bottom-0 w-2 bg-gradient-to-b from-indigo-500 to-indigo-700 opacity-50" />
                           
                           <div className="p-6">
                              <div className="flex items-center justify-between mb-8">
                                 <div className="flex items-center gap-4">
                                    <div className="flex flex-col items-center">
                                       <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-[#0B1A2C] font-black border border-slate-100 shadow-sm uppercase">
                                          {settle.from.charAt(0)}
                                       </div>
                                       <span className="text-[10px] font-black text-slate-400 mt-2 uppercase tracking-wide">{settle.from}</span>
                                    </div>
                                    <div className="flex flex-col items-center gap-1 px-4">
                                       <ArrowRight size={20} className="text-indigo-400 animate-pulse" />
                                       <span className="text-[8px] font-black text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">owes</span>
                                    </div>
                                    <div className="flex flex-col items-center">
                                       <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black shadow-lg shadow-indigo-100 uppercase">
                                          {settle.to.charAt(0)}
                                       </div>
                                       <span className="text-[10px] font-black text-[#0B1A2C] mt-2 uppercase tracking-wide">{settle.to}</span>
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SETTLE AMOUNT</div>
                                    <div className="text-2xl font-black text-[#0B1A2C]">₹{settle.amount}</div>
                                 </div>
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                 <button 
                                    onClick={() => handleUPIPay(settle)}
                                    className="relative overflow-hidden bg-white border-2 border-slate-100 p-4 rounded-2xl flex items-center justify-center gap-3 text-[#0B1A2C] font-black text-sm hover:border-indigo-500 hover:text-indigo-600 transition-all group/upi shadow-sm"
                                 >
                                    <Smartphone size={20} className="group-hover/upi:-translate-y-1 transition-transform" />
                                    Pay via UPI
                                 </button>
                                 <button 
                                    disabled={isProcessing === i}
                                    onClick={() => handleMarkAsPaid(i)}
                                    className="relative overflow-hidden bg-indigo-600 p-4 rounded-2xl flex items-center justify-center gap-3 text-white font-black text-sm hover:bg-slate-800 transition-all shadow-xl shadow-indigo-100"
                                 >
                                    {isProcessing === i ? (
                                       <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                                    ) : (
                                       <>
                                          <HandCoins size={20} /> Mark Paid
                                       </>
                                    )}
                                 </button>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>

            {/* Quick Tips */}
            <div className="bg-indigo-50 rounded-3xl p-6 flex gap-4 items-center border border-indigo-100">
               <div className="w-12 h-12 bg-white rounded-2xl flex-shrink-0 flex items-center justify-center text-indigo-600 shadow-sm">
                  <Copy size={24} />
               </div>
               <div className="space-y-1">
                  <h4 className="text-xs font-black text-indigo-900 uppercase">PRO TIP: EXPORT REPORT</h4>
                  <p className="text-[11px] font-bold text-indigo-600 leading-relaxed">Download a PDF of this settlement to share in the WhatsApp group for records.</p>
               </div>
            </div>
         </div>
      </main>
    </div>
  );
}
