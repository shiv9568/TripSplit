import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { tripApi, expenseApi } from '../utils/api';
import type { Trip, Expense, TripSummary } from '../types';
import { X, Sparkles, TrendingUp, Presentation, Coffee, Wallet, CalendarDays, Rocket } from 'lucide-react';

export default function TripWrapped() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [trip, setTrip] = useState<Trip | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [summary, setSummary] = useState<TripSummary | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    async function fetchData() {
      try {
        const [tripRes, expensesRes, summaryRes] = await Promise.all([
          tripApi.getById(id!),
          expenseApi.getAll(id!),
          expenseApi.getSummary(id!),
        ]);
        setTrip(tripRes.data);
        setExpenses(expensesRes.data);
        setSummary(summaryRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    // Auto advance slides every 6 seconds
    if (loading || !slides.length) return;
    const timer = setTimeout(() => {
      if (currentSlide < slides.length - 1) {
        setCurrentSlide(prev => prev + 1);
      }
    }, 6000);
    return () => clearTimeout(timer);
  }, [currentSlide, loading]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#0B1A2C] flex items-center justify-center z-50">
        <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!trip || !summary || expenses.length === 0) {
    return (
      <div className="fixed inset-0 bg-[#0B1A2C] text-white flex flex-col items-center justify-center p-6 z-50">
        <h2 className="text-2xl font-black mb-4">Not enough data to Wrap!</h2>
        <p className="text-slate-400 mb-8">Add some expenses first to see your Trip Wrapped.</p>
        <button onClick={() => navigate(`/trip/${id}`)} className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold">Go Back</button>
      </div>
    );
  }

  // Calculators
  const spentDesc = Object.entries(summary.spent).filter(([_, amt]) => amt > 0).sort((a, b) => b[1] - a[1]);
  const bigSpender = spentDesc.length > 0 ? spentDesc[0] : null;
  const pennyPincher = spentDesc.length > 1 ? spentDesc[spentDesc.length - 1] : null;

  const expensesByDate = expenses.reduce((acc, curr) => {
    const d = new Date(curr.date).toLocaleDateString();
    acc[d] = (acc[d] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);
  const datesSorted = Object.entries(expensesByDate).sort((a, b) => b[1] - a[1]);
  const mostExpensiveDay = datesSorted.length > 0 ? datesSorted[0] : null;

  const foodAmt = summary.categoryBreakdown['food']?.amount || 0;
  const travelAmt = (summary.categoryBreakdown['travel']?.amount || 0) + (summary.categoryBreakdown['petrol']?.amount || 0);

  // Slides configuration
  let allSlides = [
    {
      id: "intro",
      bg: "bg-gradient-to-br from-[#0B1A2C] via-indigo-950 to-indigo-900",
      icon: <Sparkles size={64} className="text-indigo-400 mb-8 animate-pulse drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />,
      title: (
        <div key={`slide-intro`} className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
          <span className="text-indigo-400 text-lg sm:text-xl uppercase tracking-[0.4em] font-black mb-4 block">TripSplit Wrapped</span>
          <span className="text-5xl sm:text-6xl font-black leading-tight text-white mb-4 block">
            Ready to look back at<br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-indigo-400 block mt-2">{trip.name}?</span>
          </span>
        </div>
      )
    },
    {
      id: "total",
      bg: "bg-gradient-to-bl from-rose-600 via-pink-600 to-orange-500",
      icon: <Wallet size={56} className="text-white/90 mb-8" />,
      title: (
        <div key={`slide-total`} className="animate-in fade-in zoom-in-95 duration-700 text-center">
          <span className="text-3xl sm:text-4xl font-black text-rose-100 block mb-6 px-4">The group dropped a total of...</span>
          <span className="text-7xl sm:text-8xl font-black text-white shrink-0 mb-6 block drop-shadow-2xl">₹{summary.totalAmount.toLocaleString()}</span>
          <span className="text-xl font-bold text-white/90 bg-black/20 px-6 py-2 rounded-full inline-block">That's ₹{summary.perPerson.toLocaleString()} per person!</span>
        </div>
      )
    }
  ];

  if (bigSpender) {
    allSlides.push({
      id: "big_spender",
      bg: "bg-gradient-to-br from-violet-600 to-fuchsia-700",
      icon: <Rocket size={64} className="text-white/90 mb-8" />,
      title: (
        <div key={`slide-bigspender`} className="animate-in slide-in-from-right-8 fade-in duration-700 text-center">
          <span className="text-2xl sm:text-3xl font-black text-fuchsia-200 block mb-6">The High Roller Award goes to...</span>
          <span className="text-5xl sm:text-7xl font-black text-[#1a1035] mb-6 inline-block bg-white px-8 py-5 rounded-[2.5rem] shadow-2xl rotate-2">{bigSpender[0]} 🍾</span>
          <span className="text-xl sm:text-2xl font-bold text-white/90 block mt-4">For treating themselves to <span className="font-black text-white">₹{bigSpender[1].toLocaleString()}</span>!</span>
        </div>
      )
    });
  }

  if (pennyPincher && pennyPincher[0] !== bigSpender?.[0]) {
    allSlides.push({
      id: "penny_pincher",
      bg: "bg-gradient-to-tr from-emerald-500 to-teal-800",
      icon: <TrendingUp size={64} className="text-white/90 mb-8 rotate-180" />,
      title: (
        <div key={`slide-penny`} className="animate-in zoom-in-105 fade-in duration-700 text-center">
          <span className="text-2xl sm:text-3xl font-black text-emerald-200 block mb-4">Meanwhile, the ultimate Penny Pincher...</span>
          <span className="text-6xl sm:text-7xl font-black text-white mb-6 block underline decoration-emerald-300 decoration-8 underline-offset-8 py-2">{pennyPincher[0]} 🤫</span>
          <span className="text-xl sm:text-2xl font-bold text-white/90">Only consumed <span className="font-black">₹{pennyPincher[1].toLocaleString()}</span> the entire trip.</span>
        </div>
      )
    });
  }

  if (mostExpensiveDay) {
    allSlides.push({
      id: "expensive_day",
      bg: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-900",
      icon: <CalendarDays size={64} className="text-white/90 mb-8" />,
      title: (
        <div key={`slide-day`} className="animate-in fade-in slide-in-from-bottom-8 duration-700 text-center">
          <span className="text-3xl font-black text-blue-200 block mb-4">The Most Expensive Day was...</span>
          <span className="text-5xl sm:text-6xl font-black text-white mb-6 block bg-black/20 p-6 rounded-3xl backdrop-blur-sm border border-white/10">{mostExpensiveDay[0]}</span>
          <span className="text-xl sm:text-2xl font-bold text-white/90 block">You guys dropped <span className="font-black text-white">₹{mostExpensiveDay[1].toLocaleString()}</span> in just 24 hours. Wild! 💸</span>
        </div>
      )
    });
  }

  if (foodAmt > 0 || travelAmt > 0) {
    allSlides.push({
      id: "category",
      bg: "bg-gradient-to-tr from-[#ea580c] to-[#9a3412]",
      icon: <Coffee size={64} className="text-white/90 mb-8" />,
      title: (
        <div key={`slide-cat`} className="animate-in slide-in-from-left-8 fade-in duration-700 w-full px-6 flex flex-col items-center">
          <span className="text-2xl sm:text-3xl font-black text-orange-200 block mb-12 text-center">Did you eat or travel more?</span>
          <div className="flex items-end justify-center gap-8 sm:gap-12 h-56 mb-12 w-full max-w-sm">
             <div className="flex flex-col items-center gap-3 w-1/2">
                <span className="text-white font-black text-2xl">₹{foodAmt.toLocaleString()}</span>
                <div className="w-full max-w-[5rem] bg-orange-300 rounded-t-2xl shadow-[0_0_20px_rgba(253,186,116,0.3)] transition-all duration-1000 origin-bottom" style={{ height: `${Math.max(10, (foodAmt/Math.max(foodAmt, travelAmt))*200)}px` }} />
                <span className="text-white font-black uppercase tracking-widest text-sm">Food</span>
             </div>
             <div className="flex flex-col items-center gap-3 w-1/2">
                <span className="text-white font-black text-2xl">₹{travelAmt.toLocaleString()}</span>
                <div className="w-full max-w-[5rem] bg-amber-200 rounded-t-2xl shadow-[0_0_20px_rgba(253,230,138,0.3)] transition-all duration-1000 origin-bottom delay-300" style={{ height: `${Math.max(10, (travelAmt/Math.max(foodAmt, travelAmt))*200)}px` }} />
                <span className="text-white font-black uppercase tracking-widest text-sm">Travel</span>
             </div>
          </div>
          <span className="text-2xl sm:text-3xl font-black text-white bg-black/20 px-6 py-3 rounded-full">
             {foodAmt > travelAmt ? "Foodies forever! 🍔" : "Born to explore! 🌍"}
          </span>
        </div>
      )
    });
  }

  allSlides.push({
    id: "outro",
    bg: "bg-gradient-to-bl from-slate-900 via-indigo-950 to-[#0B1A2C]",
    icon: <Presentation size={64} className="text-white/90 mb-8" />,
    title: (
      <div key={`slide-outro`} className="animate-in fade-in zoom-in-95 duration-700 w-full px-6 flex flex-col items-center text-center">
        <span className="text-5xl sm:text-6xl font-black text-white mb-6 block">That's a wrap! 🎬</span>
        <span className="text-xl sm:text-2xl font-bold text-indigo-300 block mb-12 max-w-sm">Hope you had a great trip. Time to settle debts and plan the next one!</span>
        <button 
          onClick={(e) => { e.stopPropagation(); navigate(`/trip/${id}/settlements`); }}
          className="w-full max-w-xs bg-white text-[#0B1A2C] py-5 rounded-[1.5rem] font-black text-lg active:scale-95 transition-all shadow-[0_10px_40px_rgba(255,255,255,0.2)] z-50 hover:bg-slate-50 relative pointer-events-auto"
        >
          Settle Debts
        </button>
      </div>
    )
  });

  const slides = allSlides;

  const prevSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide > 0) setCurrentSlide(currentSlide - 1);
  };
  const nextSlide = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentSlide < slides.length - 1) setCurrentSlide(currentSlide + 1);
  };

  return (
    <div className={`fixed inset-0 z-50 flex flex-col transition-colors duration-1000 ease-in-out ${slides[currentSlide].bg}`}>
      
      {/* Background Interactive Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px]" />
         <div className="absolute bottom-[-10%] left-[-20%] w-[600px] h-[600px] bg-black/10 rounded-full blur-[120px]" />
      </div>

      {/* Touch boundaries for mobile tapping */}
      <div className="absolute inset-y-0 left-0 w-1/4 z-20 cursor-w-resize" onClick={prevSlide} />
      <div className="absolute inset-y-0 right-0 w-1/4 z-20 cursor-e-resize" onClick={nextSlide} />

      {/* Progress Bars */}
      <div className="absolute top-0 left-0 right-0 p-4 sm:p-6 z-30 flex gap-2">
        {slides.map((_, i) => (
          <div key={i} className="flex-1 h-1 sm:h-1.5 bg-white/20 rounded-full overflow-hidden backdrop-blur-sm">
            <div 
              className={`h-full bg-white transition-all ease-linear ${i < currentSlide ? 'w-full' : i === currentSlide ? 'w-full origin-left' : 'w-0'}`} 
              style={{ transitionDuration: i === currentSlide ? '6000ms' : '0ms' }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button 
        onClick={(e) => { e.stopPropagation(); navigate(`/trip/${id}`); }}
        className="absolute top-10 sm:top-12 right-6 z-40 w-12 h-12 bg-black/20 rounded-full flex items-center justify-center text-white backdrop-blur-md hover:bg-white/20 transition-all active:scale-90 shadow-lg cursor-pointer pointer-events-auto border border-white/10"
      >
        <X size={24} strokeWidth={3} />
      </button>

      {/* Slide Content container */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 relative z-10 w-full pointer-events-none">
         {slides[currentSlide].icon}
         {slides[currentSlide].title}
      </div>
    </div>
  );
}
