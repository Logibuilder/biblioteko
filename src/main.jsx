import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App'; 
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext'; 

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* 1. Le Routage doit englober l'application */}
    <BrowserRouter> 
      {/* 2. L'AuthProvider doit englober tout ce qui a besoin de l'état utilisateur */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);