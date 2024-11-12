import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { auth } from './firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, UserCredential } from 'firebase/auth';

interface UserData {
  email: string | null;
}

interface GlobalContextType {
  userData: UserData | null;
  login: (email: string, password: string) => Promise<UserCredential>;
  signup: (email: string, password: string) => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within a GlobalProvider');
  }
  return context;
};

interface GlobalProviderProps {
  children: ReactNode;
}

export const GlobalProvider: React.FC<GlobalProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setUserData({ email: null });
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      
      if (user) {
        const token = await user.getIdToken();
        setUserData({ email: user.email });
        localStorage.setItem('authToken', token || '');
      } else {
        setUserData(null);
        localStorage.removeItem('authToken');
      }
    });

    return () => unsubscribe();
  }, []);

  const login = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = (email: string, password: string) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const logout = () => {
    return signOut(auth);
  };

  return (
    <GlobalContext.Provider value={{ userData, login, signup, logout }}>
      {children}
    </GlobalContext.Provider>
  );
};
