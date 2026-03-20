import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Bell, Shield, LogOut, ChevronRight, Check, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';
import { tripApi } from '../utils/api';

export default function Profile() {
  const navigate = useNavigate();
  const { currentUser, logout } = useApp();
  const { showToast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    showToast('Logged out successfully', 'info');
  };

  const handleSave = async () => {
    if (!newName.trim() || newName === currentUser?.name) {
        setIsEditing(false);
        return;
    }
    
    setIsSaving(true);
    try {
      // Note: Backend rename support might need updating for email-based auth
      await tripApi.renameUser(currentUser?.name || '', newName.trim());
      showToast('Profile updated group-wide!', 'success');
      setIsEditing(false);
    } catch (err) {
      showToast('Failed to update identity', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans flex flex-col relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/30 rounded-full blur-[120px] pointer-events-none" />
      
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between bg-white/50 backdrop-blur-md sticky top-0">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <span className="text-[10px] font-black uppercase tracking-widest text-[#1a1035]">Your Identity</span>
        <div className="w-12" />
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-4">
             <div className="relative inline-block group">
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-teal-400 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative w-28 h-28 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 flex items-center justify-center mx-auto text-5xl font-black text-indigo-600">
                                       {currentUser?.name ? currentUser.name[0].toUpperCase() : 'U'}
                </div>
             </div>
             <div>
                <h2 className="text-3xl font-black text-[#1a1035] tracking-tighter leading-none">{currentUser?.name || 'Guest User'}</h2>
                <p className="text-[10px] font-black uppercase text-indigo-400 tracking-[0.2em] mt-2">Active Participant</p>
             </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-50 space-y-6">
             <div className="space-y-4">
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                         <User size={18} strokeWidth={2.5} />
                      </div>
                      <span className="text-xs font-black uppercase tracking-widest text-slate-300">Display Name</span>
                   </div>
                   {!isEditing ? (
                     <button 
                       onClick={() => setIsEditing(true)} 
                       className="text-indigo-600 font-black text-[10px] uppercase tracking-widest px-3 py-1 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                     >
                        Edit
                     </button>
                   ) : (
                     <div className="flex gap-2">
                        <button 
                          onClick={handleSave} 
                          disabled={isSaving}
                          className="bg-indigo-600 text-white p-2 rounded-lg disabled:opacity-50"
                        >
                          <Check size={16} className={isSaving ? 'animate-pulse' : ''} />
                        </button>
                        <button 
                          onClick={() => !isSaving && setIsEditing(false)} 
                          disabled={isSaving}
                          className="bg-slate-100 text-slate-400 p-2 rounded-lg disabled:opacity-50"
                        >
                          <X size={16} />
                        </button>
                     </div>
                   )}
                </div>

                {isEditing ? (
                  <input 
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-indigo-100 rounded-2xl px-6 py-4 text-lg font-black text-[#1a1035] focus:bg-white focus:border-indigo-400 outline-none transition-all shadow-inner"
                    autoFocus
                  />
                ) : (
                  <p className="text-xl font-black text-[#1a1035] pl-1">{currentUser?.name}</p>
                )}
             </div>

             <div className="pt-6 border-t border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-500">
                      <Mail size={18} strokeWidth={2.5} />
                   </div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Account Email</span>
                      <span className="text-sm font-bold text-[#1a1035] lowercase opacity-50">{currentUser?.email || 'traveler@tripchat.app'}</span>
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
