import { createContext, useContext, useState, type ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  token: string | null;
  setToken: (token: string | null) => void;
  lastTripId: string;
  setLastTripId: (id: string) => void;
  logout: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('tripsplit_user_data');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('tripsplit_token'));
  const [lastTripId, setLastTripId] = useState<string>(() => localStorage.getItem('tripsplit_last_trip') || '');

  const handleSetCurrentUser = (user: User | null) => {
    if (user) {
      localStorage.setItem('tripsplit_user_data', JSON.stringify(user));
    } else {
      localStorage.removeItem('tripsplit_user_data');
    }
    setCurrentUser(user);
  };

  const handleSetToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem('tripsplit_token', newToken);
    } else {
      localStorage.removeItem('tripsplit_token');
    }
    setToken(newToken);
  };

  const handleSetLastTripId = (id: string) => {
    localStorage.setItem('tripsplit_last_trip', id);
    setLastTripId(id);
  };

  const logout = () => {
    handleSetCurrentUser(null);
    handleSetToken(null);
    handleSetLastTripId('');
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, 
      setCurrentUser: handleSetCurrentUser, 
      token,
      setToken: handleSetToken,
      lastTripId, 
      setLastTripId: handleSetLastTripId,
      logout
    }}>
      {children}
    </AppContext.Provider>
  );
};


export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
