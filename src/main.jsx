import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App'; 
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './hooks/AuthContext'; 


// 🎨 Import Bootstrap CSS
import 'bootstrap/dist/css/bootstrap.min.css';
// 🎨 Import Bootstrap JS (pour les composants interactifs)
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


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