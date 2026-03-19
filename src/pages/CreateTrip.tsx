import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Plane, Sparkles, User, ArrowRight } from 'lucide-react';
import { tripApi } from '../utils/api';
import { useApp } from '../context/AppContext';
import { useToast } from '../components/Toast';

export default function CreateTrip() {
  const navigate = useNavigate();
  const { currentUser } = useApp();
  const { showToast } = useToast();
  
  const [tripName, setTripName] = useState('');
  const [members, setMembers] = useState([{ name: currentUser || '', email: '' }]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      showToast('Please sign in or enter a name first to create a trip', 'info');
      navigate('/authUser');
    }
  }, [currentUser, navigate, showToast]);

  if (!currentUser) return null;

  const addMember = () => {
    setMembers([...members, { name: '', email: '' }]);
  };

  const updateMember = (index: number, field: 'name' | 'email', value: string) => {
    const newMembers = [...members];
    newMembers[index][field] = value;
    setMembers(newMembers);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = [...members];
      newMembers.splice(index, 1);
      setMembers(newMembers);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName.trim()) {
      showToast('Trip name is required', 'error');
      return;
    }
    
    // Filter out empty names
    const validMembers = members.map(m => m.name.trim()).filter(Boolean);
    if (validMembers.length === 0) {
      showToast('At least one member is required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await tripApi.create({
        name: tripName,
        members: validMembers,
        createdBy: currentUser || 'Anonymous'
      });
      showToast('Trip created successfully!', 'success');
      navigate(`/trip/${data._id}`);
    } catch {
      showToast('Failed to create trip', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fbfa] font-sans flex flex-col relative overflow-hidden">
      {/* Decorative Accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-10%] w-[300px] h-[300px] bg-teal-50 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 px-6 py-6 max-w-2xl mx-auto w-full flex items-center justify-between">
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-slate-400 hover:text-indigo-600 transition-all font-black"
        >
          <ArrowLeft size={20} strokeWidth={2.5} />
        </button>
        <div className="flex bg-white px-4 py-2 border border-slate-100 rounded-2xl shadow-sm items-center gap-2">
           <div className="w-6 h-6 bg-indigo-600 rounded flex items-center justify-center">
              <Plane size={14} className="text-white" />
           </div>
           <span className="text-sm font-black tracking-tight text-[#0B1A2C]">New Trip</span>
        </div>
        <div className="w-12" /> {/* Spacer */}
      </header>

      <main className="flex-1 relative z-10 p-6">
        <div className="max-w-md mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest">
              <Sparkles size={14} /> Quick Setup
            </div>
            <h1 className="text-4xl font-black tracking-tighter leading-tight text-[#0B1A2C]">
              Let's create <span className="text-indigo-600 italic">your trip</span>
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Trip Name input */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 flex flex-col">
                Trip Name
              </label>
              <div className="relative group">
                <input 
                  type="text"
                  value={tripName}
                  onChange={(e) => setTripName(e.target.value)}
                  placeholder="Bali Summer Tour"
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-indigo-500 rounded-2xl px-6 py-5 text-xl font-black text-[#0B1A2C] placeholder:text-slate-300 focus:bg-white transition-all shadow-inner outline-none"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Members input */}
            <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-slate-100 space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Member List</h3>
                <span className="text-[10px] font-black bg-slate-100 text-slate-500 px-2 py-1 rounded-md">{members.length} Members</span>
              </div>
              
              <div className="space-y-3">
                {members.map((member, index) => (
                  <div key={index} className="flex gap-2 items-center slide-in-from-right-2 animate-in duration-300">
                     <div className="flex-1 space-y-2">
                       <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User size={14} className="text-slate-300" />
                          </div>
                          <input 
                            type="text"
                            value={member.name}
                            onChange={(e) => updateMember(index, 'name', e.target.value)}
                            placeholder="Name"
                            className="w-full bg-slate-50 border border-slate-100 rounded-xl py-3 pl-9 pr-3 text-sm font-bold text-[#0B1A2C] placeholder:text-slate-300 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                            required
                          />
                       </div>
                     </div>
                     <button
                       type="button"
                       onClick={() => removeMember(index)}
                       disabled={members.length === 1}
                       className="w-12 h-[46px] bg-slate-50 text-slate-300 rounded-xl flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors disabled:opacity-50"
                     >
                       <Trash2 size={16} strokeWidth={2.5} />
                     </button>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={addMember}
                className="w-full mt-4 py-4 rounded-xl border-2 border-dashed border-slate-200 text-slate-400 font-black text-xs uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={16} strokeWidth={3} /> Add Member
              </button>
            </div>

            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full relative group pt-4"
            >
              <div className="absolute inset-0 bg-indigo-600 rounded-3xl blur-xl group-hover:blur-2xl opacity-20 transition-all top-4" />
              <div className="relative bg-[#0B1A2C] hover:bg-slate-800 text-white py-6 rounded-3xl text-lg font-black shadow-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                {isSubmitting ? 'Creating...' : (
                  <>Create Trip <ArrowRight size={20} strokeWidth={3} /></>
                )}
              </div>
            </button>
            
          </form>
        </div>
      </main>
    </div>
  );
}
