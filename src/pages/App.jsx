import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';

import LoginPage from './LoginPage';
import DashboardPage from './DashboardPage';

/**
 * Composant pour protéger les routes qui nécessitent une authentification.
 * Il vérifie l'état de chargement et l'authentification avant d'afficher le contenu.
 */
const ProtectedRoute = ({ element: Element }) => {
    // ⚠️ CRITICAL: useAuthContext DOIT être appelé à l'intérieur d'AuthProvider
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        // Affichage tant que le statut d'authentification est vérifié (ex: localStorage)
        return <div style={{ padding: '50px', fontSize: '1.2em' }}>Vérification de l'authentification...</div>;
    }
    
    // Si non authentifié, redirige vers la page de connexion
    return isAuthenticated ? Element : <Navigate to="/login" replace />;
};

const App = () => {
    return (
        // Ajout d'un conteneur principal pour le débogage visuel
        <div style={{minHeight: '100vh', display: 'flex', flexDirection: 'column'}}>
            {/* 🚨 DEBUG: Ce texte devrait s'afficher si React démarre */}
            <h1 style={{color: 'green', textAlign: 'center', padding: '10px', margin: 0, borderBottom: '1px solid #ccc'}}>Bibliothèque Numérique</h1>
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
                    {/* TODO: Ajouter ici les futures routes /moderation, /emprunts, etc. */}

                    {/* Gestion des routes non trouvées (404) */}
                    <Route path="*" element={<h1>404 - Page non trouvée</h1>} />
                </Routes>
            </main>
        </div>
    );
};

export default App;