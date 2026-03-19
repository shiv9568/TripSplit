import { useNavigate } from 'react-router-dom';
import { Globe, Map, Receipt, Handshake, Users, DollarSign } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function LandingPage() {
  const navigate = useNavigate();
  const { currentUser } = useApp();

  const handleStart = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/dashboard'); // Home wrapper handles login
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Navbar segment */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0,0)}>
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">TripSplit</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-medium text-sm text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-blue-600 transition-colors">How It Works</a>
            <a href="#testimonials" className="hover:text-blue-600 transition-colors">Testimonials</a>
            <button onClick={handleStart} className="hover:text-blue-600 transition-colors">Sign In</button>
            <button onClick={handleStart} className="bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md">
              Start Splitting Free
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Group Travel Expenses, <br/>
              Effortlessly Tracked & <br/>
              Split
            </h1>
            <p className="text-lg text-slate-600 max-w-lg leading-relaxed">
              Create trips, add friends, log food, petrol, & hotel costs. 
              TripSplit calculates everything, so everyone knows what they owe.
            </p>
            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate('/create-trip')}
                className="bg-blue-600 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-blue-700 hover:-translate-y-1 transition-all shadow-lg flex justify-center items-center gap-2 flex-1"
              >
                Create Trip
              </button>
              <button 
                onClick={() => navigate('/join')}
                className="bg-emerald-500 text-white text-lg font-bold px-8 py-4 rounded-xl hover:bg-emerald-600 hover:-translate-y-1 transition-all shadow-lg shadow-emerald-200 flex justify-center items-center gap-2 flex-1"
              >
                Join Trip
              </button>
            </div>
          </div>

          <div className="relative">
            {/* Soft background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-70"></div>
            
            {/* Mockup Phone Box */}
            <div className="relative z-10 w-full max-w-sm mx-auto bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-slate-800">
              <div className="bg-slate-50 h-[600px] flex flex-col">
                <div className="px-6 pt-10 pb-4 bg-white border-b border-slate-100 flex items-center justify-center">
                  <div className="flex items-center gap-2">
                    <Globe className="text-blue-500 w-5 h-5" />
                    <span className="font-bold text-slate-800">TripSplit</span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 overflow-y-auto">
                  <h3 className="text-2xl font-bold text-slate-800 mb-6">Bali Trip</h3>
                  
                  <div className="space-y-3 mb-8">
                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center text-xl">🍽️</div>
                        <div>
                          <p className="font-bold border-slate-800 text-sm">Seafood Dinner</p>
                          <p className="text-xs text-slate-500">Paid by Liam</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">$150</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-xl">🚕</div>
                        <div>
                          <p className="font-bold border-slate-800 text-sm">Taxi Ride</p>
                          <p className="text-xs text-slate-500">Paid by Sofia</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">$45</p>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-xl">🛏️</div>
                        <div>
                          <p className="font-bold border-slate-800 text-sm">Hotel Stay</p>
                          <p className="text-xs text-slate-500">Paid by Noah</p>
                        </div>
                      </div>
                      <p className="font-bold text-slate-800">$800</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600">You owe Sofia</span>
                      <span className="font-bold text-red-500">$15</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="font-medium text-slate-600">You receive from Ben</span>
                      <span className="font-bold text-emerald-500">$50</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Cards */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border text-center border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 mx-auto bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Map className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Easy Trip Creation</h3>
              <p className="text-slate-600 leading-relaxed">Create trip events quickly. Set your destination, currency, and travel dates in seconds.</p>
            </div>

            <div className="bg-white border text-center border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 mx-auto bg-emerald-50 rounded-2xl flex items-center justify-center mb-6">
                <Receipt className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Add Friends & Log Expenses</h3>
              <p className="text-slate-600 leading-relaxed">Record spending on everything. Add receipts, categorize expenses, and tag who paid.</p>
            </div>

            <div className="bg-white border text-center border-slate-200 p-8 rounded-3xl shadow-lg hover:shadow-xl transition-all">
              <div className="w-20 h-20 mx-auto bg-violet-50 rounded-2xl flex items-center justify-center mb-6">
                <Handshake className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-3">Automatic Settle Up</h3>
              <p className="text-slate-600 leading-relaxed">Instant, accurate calculations. We figure out exactly who owes who to minimize transactions.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-24 bg-slate-50 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-16">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className="hidden md:block absolute top-[50px] left-[20%] right-[20%] h-0.5 bg-slate-200 z-0"></div>
            
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg ring-8 ring-slate-50">1</div>
              <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-4 border border-slate-100">
                <Globe className="w-10 h-10 text-blue-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Create a Trip</h3>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg ring-8 ring-slate-50">2</div>
              <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-4 border border-slate-100">
                <Users className="w-10 h-10 text-emerald-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Invite Friends & Track Costs</h3>
            </div>

            <div className="relative z-10 flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mb-4 shadow-lg ring-8 ring-slate-50">3</div>
              <div className="w-24 h-24 bg-white rounded-full shadow-md flex items-center justify-center mb-4 border border-slate-100">
                <DollarSign className="w-10 h-10 text-violet-500" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">Settle the Balances</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 bg-white px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-slate-900 mb-16 text-center">Testimonials</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-600 italic mb-6">"TripSplit saved us so much trouble on our Euro trip. No more arguing over who paid for dinner!"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-300 rounded-full flex items-center justify-center font-bold text-white">S</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Sarah J.</p>
                  <p className="text-xs text-slate-500">Backpacker</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-600 italic mb-6">"No more spreadsheet headaches. I add an expense on my phone, and everyone sees it instantly."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center font-bold text-white">M</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Mike T.</p>
                  <p className="text-xs text-slate-500">Weekend Traveler</p>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-slate-600 italic mb-6">"The best part is discovering that I actually owe less than I thought because of the automatic balancing feature."</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-500 rounded-full flex items-center justify-center font-bold text-white">E</div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Elena R.</p>
                  <p className="text-xs text-slate-500">Road Tripper</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
              <Globe className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold text-white">TripSplit</span>
          </div>
          <div className="flex gap-8 text-sm font-medium">
            <a href="#" className="hover:text-white transition-colors">About</a>
            <a href="#" className="hover:text-white transition-colors">Terms</a>
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Contact</a>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800 text-center text-sm">
          © {new Date().getFullYear()} TripSplit. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
