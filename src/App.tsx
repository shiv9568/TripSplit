import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { ToastProvider } from './components/Toast';
import LandingPage from './pages/LandingPage';
import Home from './pages/Home';
import TripDetail from './pages/TripDetail';
import JoinTrip from './pages/JoinTrip';
import AddExpense from './pages/AddExpense';
import Settlements from './pages/Settlements';
import Members from './pages/Members';
import ExpenseHistory from './pages/ExpenseHistory';

function App() {
  return (
    <ToastProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/join" element={<JoinTrip />} />
            <Route path="/trip/:id" element={<TripDetail />} />
            <Route path="/trip/:id/add-expense" element={<AddExpense />} />
            <Route path="/trip/:id/settlements" element={<Settlements />} />
            <Route path="/trip/:id/members" element={<Members />} />
            <Route path="/trip/:id/history" element={<ExpenseHistory />} />
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ToastProvider>
  );
}

export default App;
