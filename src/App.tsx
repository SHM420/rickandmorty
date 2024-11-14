import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { GlobalProvider } from './GlobalContext';
import Header from './components/Header';
import Login from './components/Login';
import SignUp from './components/Singup';
import Characters from './components/Characters';
import SingleCharacter from './components/SingleCharacter';
import SingleEpisode from './components/SingleEpisode';
import SingleLocation from './components/SingleLocation';
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
            <Route
              path="/character/:id"
              element={
                <PrivateRoute>
                  <Header />
                  <SingleCharacter />
                </PrivateRoute>
              }
            />
            <Route
              path="/episode/:id"
              element={
                <PrivateRoute>
                  <Header />
                  <SingleEpisode />
                </PrivateRoute>
              }
            />
            <Route
              path="/location/:id"
              element={
                <PrivateRoute>
                  <Header />
                  <SingleLocation />
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
