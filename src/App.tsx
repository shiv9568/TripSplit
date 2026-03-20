import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';

import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import CreateTrip from './pages/CreateTrip';
import JoinTrip from './pages/JoinTrip';
import TripDetail from './pages/TripDetail';
import AddExpense from './pages/AddExpense';
import Settlements from './pages/Settlements';
import Members from './pages/Members';
import ExpenseHistory from './pages/ExpenseHistory';
import ExpenseDetail from './pages/ExpenseDetail';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import MyTrips from './pages/MyTrips';
import EditExpense from './pages/EditExpense';
import WhatsappImport from './pages/WhatsappImport';
import Payment from './pages/Payment';
import TripSummary from './pages/TripSummary';
import Notifications from './pages/Notifications';
import NotFound from './pages/NotFound';

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
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
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
