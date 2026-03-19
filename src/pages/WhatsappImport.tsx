import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WhatsappImport() {
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleParse = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsSuccess(true);
    }, 1500);
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
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Import Bills</span>
        <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-2 mt-4">
             <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] shadow-sm flex items-center justify-center mx-auto text-emerald-500 mb-6">
                <MessageSquare size={32} />
             </div>
             <h2 className="text-3xl font-black text-[#0B1A2C] tracking-tighter">Copy, Paste, <br/> <span className="text-emerald-500 italic">Auto-Parse.</span></h2>
             <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest max-w-[250px] mx-auto mt-2 leading-relaxed">
                Paste WhatsApp messages. Our AI detects amounts and names.
             </p>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-6 mt-8">
             <textarea
               value={text}
               onChange={(e) => setText(e.target.value)}
               placeholder={`Example:\nUber ride 450 paid by Liam\nPizza 1200 John`}
               className="w-full h-48 bg-slate-50 border-2 border-slate-100 rounded-2xl p-6 font-mono text-xs focus:outline-none focus:border-emerald-500/30 transition-all text-[#0B1A2C] placeholder:text-slate-300 resize-none shadow-inner"
             />

             {isSuccess ? (
                <div className="bg-emerald-50 text-emerald-600 p-6 rounded-2xl text-sm font-black flex items-center justify-center gap-2 animate-in zoom-in-95">
                   <CheckCircle2 size={20} /> Expenses Added!
                </div>
             ) : (
               <button
                 onClick={handleParse}
                 disabled={!text || isAnalyzing}
                 className="w-full relative group pt-2"
               >
                 <div className="absolute inset-0 bg-emerald-600 rounded-2xl blur-xl group-hover:blur-2xl opacity-20 transition-all top-2" />
                 <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-5 rounded-2xl text-sm font-black shadow-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 disabled:grayscale">
                   {isAnalyzing ? 'Analyzing AI...' : (
                      <><Sparkles size={18} className="text-emerald-400" /> Auto Parse Expenses</>
                   )}
                 </div>
               </button>
             )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
