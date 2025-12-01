import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';

import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

/**
 * Composant pour protéger les routes qui nécessitent une authentification.
 */
const ProtectedRoute = ({ element: Element }) => {
    // ✅ Utilisation de isAuthReady au lieu de isLoading
    const { isAuthenticated, isAuthReady } = useAuthContext();

    // Affichage pendant l'initialisation (lecture du localStorage)
    if (!isAuthReady) {
        return (
            <div style={{ 
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                fontSize: '1.2em',
                gap: '20px'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '5px solid #f3f3f3',
                    borderTop: '5px solid #646cff',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <p>Vérification de l'authentification...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }
    
    // Si non authentifié, redirige vers la page de connexion
    return isAuthenticated ? Element : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            <h1 style={{
                color: 'green', 
                textAlign: 'center', 
                padding: '10px', 
                margin: 0, 
                borderBottom: '1px solid #ccc'
            }}>
                Bibliothèque Numérique
            </h1>
            <main style={{flexGrow: 1}}>
                <Routes>
                    {/* Redirige l'accueil vers le dashboard */}
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    
                    {/* Route Publique */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* Routes Protégées */}
                    <Route 
                        path="/dashboard" 
                        element={<ProtectedRoute element={<DashboardPage />} />} 
                    />

                    {/* Gestion des routes non trouvées (404) */}
                    <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;