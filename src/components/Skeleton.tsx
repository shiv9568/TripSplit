// Reusable Skeleton Components — designed via Stitch (Horizon Ivory design system)
// Shimmer animation: left-to-right gradient sweep, 2s linear loop

const shimmer = `relative overflow-hidden bg-[#e2e8f0] before:absolute before:inset-0 
  before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent 
  before:animate-[shimmer_1.8s_linear_infinite] before:translate-x-[-100%]`;

// Add the @keyframes to the global CSS via style tag on first render
if (typeof document !== 'undefined') {
  const id = 'skeleton-shimmer-style';
  if (!document.getElementById(id)) {
    const style = document.createElement('style');
    style.id = id;
    style.textContent = `@keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }`;
    document.head.appendChild(style);
  }
}

const Bone = ({ className = '' }: { className?: string }) => (
  <div className={`${shimmer} rounded-xl ${className}`} />
);

/* ── MyTrips Dashboard Skeleton ─────────────────────────────────────────── */
export function MyTripsSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans pb-32 overflow-x-hidden">
      {/* Header */}
      <header className="relative z-10 px-6 pt-10 pb-6 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <Bone className="h-3 w-28 rounded-full" />
            <Bone className="h-9 w-36 rounded-xl" />
          </div>
          <Bone className="w-14 h-14 rounded-[22px]" />
        </div>
      </header>

      {/* Trip Cards */}
      <main className="relative z-10 p-6 max-w-2xl mx-auto space-y-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-[2rem] p-5 shadow-sm border border-slate-100">
            <div className="flex justify-between items-start mb-4">
              <Bone className="h-11 w-11 rounded-2xl" />
              <Bone className="h-7 w-20 rounded-full" />
            </div>
            <div className="space-y-3 mt-2">
              <Bone className="h-5 w-3/4 rounded-lg" />
              <Bone className="h-3.5 w-1/2 rounded-lg" />
            </div>
            <div className="mt-5 flex justify-between items-center pt-4 border-t border-slate-50">
              <div className="flex -space-x-2">
                <Bone className="w-8 h-8 rounded-full ring-2 ring-white" />
                <Bone className="w-8 h-8 rounded-full ring-2 ring-white" />
                <Bone className="w-8 h-8 rounded-full ring-2 ring-white" />
              </div>
              <Bone className="h-3.5 w-24 rounded-lg" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}

/* ── TripDetail Skeleton ─────────────────────────────────────────────────── */
export function TripDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans overflow-x-hidden">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-6 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Bone className="w-10 h-10 rounded-full" />
          <div className="flex flex-col items-center gap-2">
            <Bone className="h-3 w-28 rounded-full" />
            <Bone className="h-4 w-20 rounded-full" />
          </div>
          <div className="flex gap-2">
            <Bone className="w-10 h-10 rounded-xl" />
            <Bone className="w-10 h-10 rounded-xl" />
          </div>
        </div>
      </header>

      <div className="pt-24 max-w-2xl mx-auto px-5 space-y-5">
        {/* Hero Summary Card */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 mt-4">
          <div className="flex justify-between items-start mb-6">
            <div className="space-y-3">
              <Bone className="h-3.5 w-24 rounded-full" />
              <Bone className="h-10 w-40 rounded-xl" />
            </div>
            <Bone className="h-8 w-24 rounded-full" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map(n => (
              <div key={n} className="bg-slate-50 rounded-2xl p-3 space-y-2">
                <Bone className="h-3 w-3/4 rounded-full" />
                <Bone className="h-5 w-1/2 rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2">
          {[1, 2, 3, 4].map(n => (
            <Bone key={n} className="h-9 flex-1 rounded-2xl" />
          ))}
        </div>

        {/* Expense Rows */}
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
              <Bone className="w-12 h-12 rounded-2xl flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <Bone className="h-4 w-3/5 rounded-lg" />
                <Bone className="h-3 w-2/5 rounded-lg" />
              </div>
              <Bone className="h-5 w-16 rounded-lg flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-6">
        <Bone className="w-16 h-16 rounded-[22px]" />
      </div>
    </div>
  );
}

/* ── ExpenseHistory Skeleton ──────────────────────────────────────────────── */
export function ExpenseHistorySkeleton() {
  return (
    <div className="min-h-screen bg-[#FAF7F4] font-sans pb-32">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <Bone className="w-10 h-10 rounded-full" />
          <div className="space-y-2 flex-1">
            <Bone className="h-4 w-32 rounded-lg" />
            <Bone className="h-3 w-20 rounded-lg" />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-5 pt-6 space-y-4">
        {/* Summary pill */}
        <Bone className="h-16 w-full rounded-3xl" />

        {/* Expense list */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <Bone className="w-12 h-12 rounded-2xl flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Bone className="h-4 w-3/5 rounded-lg" />
              <Bone className="h-3 w-2/5 rounded-lg" />
            </div>
            <div className="space-y-2 text-right">
              <Bone className="h-4 w-16 rounded-lg" />
              <Bone className="h-3 w-10 rounded-lg ml-auto" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
