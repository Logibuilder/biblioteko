// DANS src/pages/LoginPage.jsx

import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { useAuthContext } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const { isAuthenticated } = useAuthContext();

    // Redirection si déjà connecté
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    // ⚠️ LE RÉSULTAT DU RETURN DOIT CONTENIR LE FORMULAIRE !
    return (
        <div style={{ padding: '50px' }}>
            {/* 👈 Assurez-vous que LoginForm est bien là */}
            <LoginForm /> 
        </div>
    );
};

export default LoginPage;