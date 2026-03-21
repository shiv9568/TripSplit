import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import { lazy, Suspense } from 'react';

import LandingPage from './pages/LandingPage';
const AuthPage = lazy(() => import('./pages/AuthPage'));
const CreateTrip = lazy(() => import('./pages/CreateTrip'));
const JoinTrip = lazy(() => import('./pages/JoinTrip'));
const TripDetail = lazy(() => import('./pages/TripDetail'));
const AddExpense = lazy(() => import('./pages/AddExpense'));
const Settlements = lazy(() => import('./pages/Settlements'));
const Members = lazy(() => import('./pages/Members'));
const ExpenseHistory = lazy(() => import('./pages/ExpenseHistory'));
const ExpenseDetail = lazy(() => import('./pages/ExpenseDetail'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Profile = lazy(() => import('./pages/Profile'));
const MyTrips = lazy(() => import('./pages/MyTrips'));
const EditExpense = lazy(() => import('./pages/EditExpense'));
const WhatsappImport = lazy(() => import('./pages/WhatsappImport'));
const Payment = lazy(() => import('./pages/Payment'));
const TripSummary = lazy(() => import('./pages/TripSummary'));
const Notifications = lazy(() => import('./pages/Notifications'));
const NotFound = lazy(() => import('./pages/NotFound'));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fbfa]">
      <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin" />
    </div>
  );
}

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/dashboard" element={<MyTrips />} />
              <Route path="/authUser" element={<AuthPage />} />
              <Route path="/create-trip" element={<CreateTrip />} />
              <Route path="/join" element={<JoinTrip />} />
              <Route path="/trip/:id" element={<TripDetail />} />
              <Route path="/trip/:id/add-expense" element={<AddExpense />} />
              <Route path="/trip/:id/settlements" element={<Settlements />} />
              <Route path="/trip/:id/members" element={<Members />} />
              <Route path="/trip/:id/history" element={<ExpenseHistory />} />
              <Route path="/trip/:id/analytics" element={<Analytics />} />
              <Route path="/trip/:id/summary" element={<TripSummary />} />
              <Route path="/trip/:id/edit-expense/:expenseId" element={<EditExpense />} />
              <Route path="/expense/:id" element={<ExpenseDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/import" element={<WhatsappImport />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
