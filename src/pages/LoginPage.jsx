import React from 'react';
import LoginForm from '../components/Auth/LoginForm';
import { useAuthContext } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

const LoginPage = () => {
    const { isAuthenticated, isAuthReady } = useAuthContext();

    if (!isAuthReady) {
        return (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{minHeight: '80vh'}}>
                <div className="spinner-border text-success mb-3" style={{width: '3rem', height: '3rem'}} role="status">
                    <span className="visually-hidden">Chargement...</span>
                </div>
                <p className="fs-5 text-muted">Chargement de la page de connexion...</p>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="py-5">
            <LoginForm /> 
        </div>
    );
};

export default LoginPage;