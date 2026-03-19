import { useNavigate } from 'react-router-dom';
import { Home, Map } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex items-center justify-center p-6 relative overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-50 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 space-y-8 animate-in zoom-in-95 duration-700 max-w-md w-full">
        <div className="w-40 h-40 bg-white rounded-full shadow-2xl flex items-center justify-center mx-auto border-8 border-slate-50 transform -rotate-12">
           <Map size={64} className="text-indigo-400" />
        </div>
        
        <div className="space-y-4">
           <h1 className="text-6xl font-black text-[#0B1A2C] tracking-tighter">404</h1>
           <p className="text-xl font-black text-slate-800 tracking-tight">Looks like you're lost!</p>
           <p className="text-sm font-bold text-slate-400 max-w-[280px] mx-auto">
             The trip or page you are looking for has been moved or doesn't exist.
           </p>
        </div>

        <button 
           onClick={() => navigate('/dashboard')}
           className="w-full relative group mt-8 block"
        >
          <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl group-hover:blur-2xl opacity-20 transition-all top-2" />
          <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-6 rounded-3xl text-sm font-black shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95">
            <Home size={20} strokeWidth={2.5} className="text-indigo-400" /> Go Back Home
          </div>
        </button>
      </div>
    </div>
  );
}
