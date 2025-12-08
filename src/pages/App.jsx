import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';

// Pages et Layouts
import LoginPage from './LoginPage';
import DashboardLayout from '../layouts/DashboardLayout'; // Nouveau

// Composants fonctionnels (qui deviennent des "pages")
import EmprunterOeuvre from '../components/emprunt/EmprunterOeuvre';
import ProposerOeuvreForm from '../components/soumission/ProposerOeuvreForm';
import NumeriserOeuvre from '../components/numerisation/NumeriserOeuvre';

/**
 * Protection des routes : Vérifie si l'auth est chargée et si l'utilisateur est connecté
 */
const ProtectedRoute = ({ element }) => {
    const { isAuthenticated, isAuthReady } = useAuthContext();

    if (!isAuthReady) return <div className="text-center p-5">Chargement de l'application...</div>;
    
    return isAuthenticated ? element : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* Titre global de l'app (optionnel, peut être retiré si le Layout gère tout) */}
            <div style={{ backgroundColor: '#212529', color: 'white', padding: '10px', textAlign: 'center' }}>
                Bibliothèque Numérique Décentralisée
            </div>

            <main style={{flexGrow: 1}}>
                <Routes>
                    {/* Redirection racine */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Page de Login */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* --- ROUTES IMBRIQUÉES DU DASHBOARD --- */}
                    <Route path="/dashboard" element={<ProtectedRoute element={<DashboardLayout />} />}>
                        
                        {/* 1. Redirection par défaut : /dashboard -> /dashboard/emprunter */}
                        <Route index element={<Navigate to="emprunter" replace />} />

                        {/* 2. Les sous-routes */}
                        <Route path="emprunter" element={<EmprunterOeuvre />} />
                        <Route path="numeriser" element={<NumeriserOeuvre />} />
                        <Route path="proposer" element={<ProposerOeuvreForm />} />

                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<h1 className="text-center mt-5">404 - Page introuvable</h1>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;