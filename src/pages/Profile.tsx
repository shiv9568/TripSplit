import { ArrowLeft, User, Mail, Bell, Shield, LogOut, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser } = useApp();

  const handleLogout = () => {
    setCurrentUser('');
    navigate('/authUser');
  };

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
        <span className="text-sm font-black tracking-tight text-[#0B1A2C]">Profile</span>
        <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-4 pt-4">
             <div className="w-24 h-24 bg-white rounded-[2rem] shadow-xl border border-slate-100 flex items-center justify-center mx-auto text-4xl font-black text-indigo-600">
                {currentUser ? currentUser[0].toUpperCase() : 'U'}
             </div>
             <div>
                <h2 className="text-2xl font-black text-[#0B1A2C] tracking-tighter">{currentUser || 'Guest User'}</h2>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mt-1">Free Plan Member</p>
             </div>
          </div>

          <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-1 mt-8">
             <div className="flex items-center justify-between py-4 border-b border-slate-50">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                    <User size={18} strokeWidth={2.5} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Name</span>
                    <span className="text-sm font-bold text-[#0B1A2C]">{currentUser}</span>
                 </div>
               </div>
               <button className="text-indigo-600 font-bold text-xs uppercase tracking-widest">Edit</button>
             </div>

             <div className="flex items-center justify-between py-4">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                    <Mail size={18} strokeWidth={2.5} />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</span>
                    <span className="text-sm font-bold text-[#0B1A2C]">{currentUser?.toLowerCase().replace(' ', '')}@gmail.com</span>
                 </div>
               </div>
             </div>
          </div>

          <div className="space-y-4">
             <h3 className="text-[10px] font-black uppercase tracking-widest pl-2 text-slate-400">Settings</h3>
             <div className="bg-white rounded-[2rem] p-2 shadow-xl border border-slate-100 space-y-1">
                {[
                  { icon: <Bell size={18} />, label: 'Notifications', color: 'text-orange-500 bg-orange-50' },
                  { icon: <Shield size={18} />, label: 'Privacy & Security', color: 'text-emerald-500 bg-emerald-50' }
                ].map((item, i) => (
                  <button key={i} className="w-full flex items-center justify-between p-4 hover:bg-slate-50 rounded-2xl transition-colors group">
                     <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                          {item.icon}
                       </div>
                       <span className="text-sm font-bold text-[#0B1A2C]">{item.label}</span>
                     </div>
                     <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                  </button>
                ))}
             </div>
          </div>

          <button 
             onClick={handleLogout}
             className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-6 rounded-3xl text-sm font-black shadow-sm flex items-center justify-center gap-2 transition-all active:scale-95 mt-8 border border-red-100"
          >
             <LogOut size={18} strokeWidth={2.5} /> Logout
          </button>

        </div>
      </main>
    </div>
  );
}
