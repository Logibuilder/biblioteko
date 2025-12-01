import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { useAuthContext } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    // ✅ Récupérer AUSSI isAuthReady
    const { isAuthenticated, isAuthReady } = useAuthContext();

    // ✅ ÉTAPE 1: Attendre que l'initialisation soit terminée
    if (!isAuthReady) {
        return (
            <div style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                fontSize: '1.2em'
            }}>
                Chargement de la page de connexion...
            </div>
        );
    }

    // ✅ ÉTAPE 2: Si déjà authentifié, rediriger vers le dashboard
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // ✅ ÉTAPE 3: Afficher le formulaire de connexion
    return (
        <div style={{ padding: '50px' }}>
            <LoginForm /> 
        </div>
    );
};

export default LoginPage;