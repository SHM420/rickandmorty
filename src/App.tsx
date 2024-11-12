import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GlobalProvider } from './GlobalContext';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/Singup';
import Characters from './components/Characters';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('authToken');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <GlobalProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route
              path="/characters"
              element={
                <PrivateRoute>
                  <Header />
                  <Characters />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </QueryClientProvider>
    </GlobalProvider>
  );
};

export default App;
