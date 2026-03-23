import { useNavigate } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  MapPin, Receipt, Users, ArrowRight, ChevronDown,
  Plane, HandCoins, BarChart3, CheckCircle2, Star
} from 'lucide-react';
import { useApp } from '../context/AppContext';

/* ── tiny hook: animate on scroll into view ── */
function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

function FadeSection({ children, className = '', delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ── App snapshot card ── */
function SnapCard({ img, title, desc, step }: { img: string; title: string; desc: string; step: number }) {
  const { ref, visible } = useFadeIn();
  return (
    <div
      ref={ref}
      className="flex flex-col group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `opacity 0.7s ease ${step * 150}ms, transform 0.7s ease ${step * 150}ms`,
      }}
    >
      {/* Step badge */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-sm shadow-md">
          {step}
        </div>
        <div className="h-px flex-1 bg-slate-200 group-last:hidden" />
      </div>

      {/* Screenshot frame */}
      <div className="rounded-[28px] overflow-hidden border border-slate-100 shadow-2xl bg-white mb-5 aspect-[9/16] max-w-[200px] mx-auto w-full">
        <img src={img} alt={title} className="w-full h-full object-cover object-top" />
      </div>

      <h3 className="font-black text-[#1a1035] text-lg mb-1">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  useEffect(() => {
    document.title = 'TripSplit – Effortlessly Track & Split Group Travel Expenses';
  }, []);

  // Helper: require login before navigating to a protected route
  const gatedNav = (path: string) => {
    if (currentUser) {
      navigate(path);
    } else {
      navigate('/authUser', { state: { from: path } });
    }
  };

  return (
    <div className="min-h-screen font-sans text-[#1a1035] overflow-x-hidden" style={{ background: '#FAF7F4' }}>

      {/* ════════════════════════════════
          NAVBAR
      ════════════════════════════════ */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-slate-200/60 px-6 lg:px-12 py-4" style={{ background: 'rgba(250,247,244,0.85)' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2.5 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-slate-100 italic">
              <img src="/logo.png" alt="TripSplit Logo" className="w-full h-full object-cover" />
            </div>
            <span className="text-xl font-black tracking-tight text-[#1a1035]">TripSplit</span>
          </div>

          {/* Nav links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-500">
            <a href="#how" className="hover:text-indigo-600 transition-colors">How It Works</a>
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#testimonials" className="hover:text-indigo-600 transition-colors">Reviews</a>
          </div>

          <div className="flex items-center gap-3">
            {currentUser ? (
              <button
                onClick={() => navigate('/trips')}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[13px] font-black shadow-lg hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
              >
                Go to Trips
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/authUser', { state: { initialMode: 'login' } })}
                  className="hidden sm:block text-[13px] font-black text-slate-500 hover:text-indigo-600 transition-colors uppercase tracking-widest px-4"
                >
                  Log In
                </button>
                <button
                  onClick={() => navigate('/authUser', { state: { initialMode: 'signup' } })}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-full text-[13px] font-black shadow-[0_4px_16px_rgba(79,70,229,0.35)] hover:bg-indigo-700 hover:shadow-[0_4px_24px_rgba(79,70,229,0.45)] transition-all"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════
          HERO
      ════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 px-6 lg:px-12 overflow-hidden">
        {/* Dot grid pattern */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, #d1d5db 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            opacity: 0.5,
          }}
        />
        {/* Gradient blobs */}
        <div className="absolute top-32 left-1/4 w-80 h-80 bg-indigo-100 rounded-full blur-[100px] opacity-60 pointer-events-none" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-violet-100 rounded-full blur-[80px] opacity-50 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10">

          {/* ── Left copy ── */}
          <div className="space-y-7">
            {/* Pill badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-black shadow-sm">
              <Plane className="w-3.5 h-3.5" />
              Smart Group Expense Splitting — Free Forever
            </div>

            {/* Big headline — note.io style with highlighted word */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[1.05] tracking-tight">
              Split trips,{' '}
              <span className="relative inline-block">
                <span className="relative z-10 text-indigo-600">not</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 100 12"
                  preserveAspectRatio="none"
                  style={{ height: '10px' }}
                >
                  <path
                    d="M0,8 Q50,0 100,8"
                    stroke="#818cf8"
                    strokeWidth="3"
                    fill="none"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{' '}
              <br />
              friendships →
            </h1>

            <p className="text-lg text-slate-500 font-semibold max-w-md leading-relaxed">
              TripSplit is the easiest way to log group travel expenses, 
              see who owes what, and settle up — without the awkward maths.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => gatedNav('/create-trip')}
                className="flex items-center gap-2 bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-base shadow-[0_8px_28px_rgba(79,70,229,0.4)] hover:bg-indigo-700 hover:-translate-y-1 transition-all"
              >
                Plan a Trip Free <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/join')}
                className="flex items-center gap-2 bg-white border-2 border-slate-200 text-slate-700 px-8 py-4 rounded-2xl font-black text-base hover:border-indigo-300 hover:text-indigo-600 transition-all shadow-sm"
              >
                Join Trip Chat
              </button>
            </div>

            {/* Mini stats */}
            <div className="flex gap-8 pt-4">
              {[
                { value: '50K+', label: 'Travelers' },
                { value: '1.2M+', label: 'Expenses logged' },
                { value: '₹0', label: 'Cost to use' },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-black text-[#1a1035]">{s.value}</p>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: 3D character + floating cards ── */}
          <div className="relative flex items-center justify-center min-h-[400px] lg:min-h-[500px]">
            {/* Soft arch/blob behind character */}
            <div
              className="absolute w-80 h-80 rounded-full"
              style={{ background: 'linear-gradient(135deg, #e0e7ff 0%, #ede9fe 100%)' }}
            />

            {/* Character image - LCP optimized */}
            <img
              src="/hero-character.png"
              alt="TripSplit mascot"
              width={384}
              height={384}
              className="relative z-10 w-72 sm:w-80 lg:w-96 h-auto min-h-[288px] lg:min-h-[384px] drop-shadow-2xl select-none"
              style={{ aspectRatio: '1/1' }}
              draggable={false}
              loading="eager"
              fetchPriority="high"
              decoding="sync"
            />

            {/* Floating card 1 — expense added */}
            <div className="absolute top-4 right-0 lg:-right-8 z-20 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 animate-bounce"
              style={{ animationDuration: '3s' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">🍜</span>
                <div>
                  <p className="text-[11px] font-black text-slate-800">Dinner at Baga</p>
                  <p className="text-[10px] text-emerald-500 font-black">₹1,800 added</p>
                </div>
              </div>
            </div>

            {/* Floating card 2 — settled */}
            <div className="absolute bottom-10 left-0 lg:-left-8 z-20 bg-white rounded-2xl px-4 py-3 shadow-xl border border-slate-100 animate-bounce"
              style={{ animationDuration: '4s', animationDelay: '1s' }}>
              <div className="flex items-center gap-2">
                <span className="text-2xl">✅</span>
                <div>
                  <p className="text-[11px] font-black text-slate-800">Rahul settled up</p>
                  <p className="text-[10px] text-indigo-500 font-black">₹450 received</p>
                </div>
              </div>
            </div>

            {/* Floating card 3 — members joined */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 lg:-right-12 z-20 bg-indigo-600 rounded-2xl px-4 py-3 shadow-xl animate-bounce"
              style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}>
              <div className="flex items-center gap-1.5">
                {['🧑', '👩', '🧔', '👱'].map((e, i) => (
                  <span key={i} className="text-lg text-white">{e}</span>
                ))}
                <p className="text-[11px] font-black text-white ml-1">4 on trip!</p>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-bounce opacity-40">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Scroll</p>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </section>

      {/* ════════════════════════════════
          HOW IT WORKS — SNAPSHOTS
      ════════════════════════════════ */}
      <section id="how" className="py-28 px-6 lg:px-12 bg-[#FAF7F4]">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16 space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">How it works</p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">
              From first step to<br />
              <span className="text-indigo-600">final settlement</span>
            </h2>
            <p className="text-slate-500 font-semibold max-w-lg mx-auto">
              Three simple moves. No spreadsheets. No confusion.
            </p>
          </FadeSection>

          <div className="grid sm:grid-cols-3 gap-10 lg:gap-16">
            <SnapCard
              step={1}
              img="/snap-dashboard.png"
              title="Create your trip"
              desc="Start a trip in 30s. Friends join instantly with a 6-digit code — zero login required."
            />
            <SnapCard
              step={2}
              img="/snap-expense.png"
              title="Log every expense"
              desc="Add food, hotels, petrol, and more. Tag who paid and who it's split between. Supports all categories."
            />
            <SnapCard
              step={3}
              img="/snap-settle.png"
              title="Settle up instantly"
              desc="TripSplit calculates the smartest way to settle. Fewer transactions, zero arguments."
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          FEATURES
      ════════════════════════════════ */}
      <section id="features" className="py-28 px-6 lg:px-12" style={{ background: '#FAF7F4' }}>
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16 space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Features</p>
            <h2 className="text-4xl sm:text-5xl font-black leading-tight">Everything you need,<br />nothing you don't</h2>
          </FadeSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <MapPin className="w-6 h-6 text-indigo-600" />,
                bg: 'bg-indigo-50',
                title: 'Trip Management',
                desc: 'Create multiple trips, set destinations, invite members, and manage everything from one dashboard.'
              },
              {
                icon: <Receipt className="w-6 h-6 text-emerald-600" />,
                bg: 'bg-emerald-50',
                title: 'Smart Expense Logging',
                desc: 'Log food, hotels, petrol, activities — split equally, by percentage, or custom amounts.'
              },
              {
                icon: <HandCoins className="w-6 h-6 text-amber-600" />,
                bg: 'bg-amber-50',
                title: 'Instant Settle Up',
                desc: 'Our algorithm minimises the number of transactions needed. One tap to mark as paid.'
              },
              {
                icon: <Users className="w-6 h-6 text-violet-600" />,
                bg: 'bg-violet-50',
                title: 'Easy Member Invites',
                desc: 'Share a trip code with friends — no sign-up needed to join. They can add and view expenses immediately.'
              },
              {
                icon: <BarChart3 className="w-6 h-6 text-rose-600" />,
                bg: 'bg-rose-50',
                title: 'Expense Analytics',
                desc: 'Visual charts showing spend by category, per member, and over time. Understand where money went.'
              },
              {
                icon: <CheckCircle2 className="w-6 h-6 text-teal-600" />,
                bg: 'bg-teal-50',
                title: 'Trip Summary Export',
                desc: 'Get a full summary of your trip — all expenses, balances, and settlements — in a clean report.'
              },
            ].map((f, i) => (
              <FadeSection
                key={f.title}
                delay={i * 80}
                className="bg-white border border-slate-100 rounded-[2rem] p-8 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className={`w-14 h-14 ${f.bg} rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform`}>
                  {f.icon}
                </div>
                <h3 className="text-lg font-black text-[#1a1035] mb-3">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed font-medium">{f.desc}</p>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          SOCIAL PROOF / TESTIMONIALS
      ════════════════════════════════ */}
      <section id="testimonials" className="py-28 px-6 lg:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <FadeSection className="text-center mb-16 space-y-3">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-indigo-500">Reviews</p>
            <h2 className="text-4xl sm:text-5xl font-black">Travelers love it</h2>
          </FadeSection>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                quote: '"Finally an app that ends the "who paid for dinner?" drama. Our Goa trip was the smoothest ever."',
                name: 'Priya S.', role: 'Frequent traveler', avatar: '🧑‍💼'
              },
              {
                quote: '"We used to use a WhatsApp spreadsheet. TripSplit replaced it completely — everyone in our group uses it now."',
                name: 'Rohan M.', role: 'Weekend explorer', avatar: '🧔'
              },
              {
                quote: '"The settle-up feature is genius. It told us 3 transactions would clear everything for 6 people. Unbelievable."',
                name: 'Anjali K.', role: 'Road trip enthusiast', avatar: '👩'
              },
            ].map((t, i) => (
              <FadeSection key={t.name} delay={i * 100} className="bg-slate-50 border border-slate-100 rounded-[2rem] p-8 space-y-5">
                <div className="flex text-amber-400">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 fill-current" />)}
                </div>
                <p className="text-slate-700 font-semibold text-sm leading-relaxed italic">{t.quote}</p>
                <div className="flex items-center gap-3 pt-2">
                  <span className="text-3xl">{t.avatar}</span>
                  <div>
                    <p className="font-black text-[#1a1035] text-sm">{t.name}</p>
                    <p className="text-xs font-bold text-slate-400">{t.role}</p>
                  </div>
                </div>
              </FadeSection>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════
          BIG CTA
      ════════════════════════════════ */}
      <section className="py-28 px-6 lg:px-12" style={{ background: '#FAF7F4' }}>
        <FadeSection className="max-w-4xl mx-auto rounded-[3rem] bg-indigo-600 p-12 sm:p-20 text-center relative overflow-hidden">
          {/* bg decoration */}
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-violet-400/20 rounded-full blur-3xl" />

          <div className="relative z-10 space-y-6">
            <p className="text-indigo-200 text-xs font-black uppercase tracking-[0.2em]">Ready to go?</p>
            <h2 className="text-4xl sm:text-5xl font-black text-white leading-tight">
              Plan your next trip.<br />We'll handle the maths.
            </h2>
            <p className="text-indigo-200 text-base font-semibold max-w-md mx-auto">
              Free forever. No credit card. No hidden fees. Just you, your friends, and stress-free splits.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <button
                onClick={() => gatedNav('/create-trip')}
                className="bg-white text-indigo-700 font-black px-10 py-4 rounded-2xl text-base hover:bg-slate-50 transition-all hover:-translate-y-1 shadow-2xl flex items-center justify-center gap-2"
              >
                Create a Free Trip <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => navigate('/join')}
                className="border-2 border-white/40 text-white font-black px-10 py-4 rounded-2xl text-base hover:bg-white/10 transition-all flex items-center justify-center gap-2"
              >
                Join an Existing Trip
              </button>
            </div>
          </div>
        </FadeSection>
      </section>

      {/* ════════════════════════════════
          FOOTER
      ════════════════════════════════ */}
      <footer className="px-6 lg:px-12 py-16" style={{ background: '#1a1035', color: 'white' }}>
        <div className="max-w-7xl mx-auto grid sm:grid-cols-4 gap-10 mb-12">
          <div className="sm:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-white/10">
                <img src="/logo.png" alt="TripSplit Logo" className="w-full h-full object-cover" />
              </div>
              <span className="text-xl font-black">TripSplit</span>
            </div>
            <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
              The easiest way to track group travel expenses and settle up with friends — no spreadsheets required.
            </p>
          </div>

          {[
            { title: 'Product', links: ['Dashboard', 'Create Trip', 'Join Trip', 'Analytics'] },
            { title: 'Company', links: ['About', 'Contact', 'Privacy Policy', 'Terms'] },
          ].map(col => (
            <div key={col.title} className="space-y-4">
              <h4 className="font-black text-xs uppercase tracking-widest text-slate-400">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map(link => (
                  <li key={link}>
                    <a href="#" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="max-w-7xl mx-auto border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-bold text-slate-500">
          <p>© {new Date().getFullYear()} TripSplit. All rights reserved.</p>
          <p>Made with ❤️ for travelers</p>
        </div>
      </footer>
    </div>
  );
}
