import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  currentUser: string;
  setCurrentUser: (name: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<string>(() => localStorage.getItem('tripsplit_user') || '');

  const handleSetCurrentUser = (name: string) => {
    localStorage.setItem('tripsplit_user', name);
    setCurrentUser(name);
  };

  return (
    <AppContext.Provider value={{ currentUser, setCurrentUser: handleSetCurrentUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
