// main.jsx
import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Styles
import './index.css';

// Components
import App from './components/App/App.jsx';
import Login from "./components/Login/Login.jsx"

// Context
import { AppProvider } from './context/AppContext.jsx';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';

const ProtectedApp = () => {
  const { authenticated } = useAuth();

  return authenticated ?  
    <div className="flex flex-col md:flex-row items-center w-full h-screen">
      <AppProvider>
        <App />
      </AppProvider>
    </div>
  : 
    <Login />
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <ProtectedApp />
    </AuthProvider>
  </StrictMode>
  );
