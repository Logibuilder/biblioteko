import React from 'react';
import RegisterForm from '../components/Auth/RegisterForm';
import { useAuthContext } from '../hooks/AuthContext';
import { Navigate } from 'react-router-dom';

const RegisterPage = () => {
    const { isAuthenticated, isAuthReady } = useAuthContext();

    // Redirection si déjà connecté
    if (isAuthReady && isAuthenticated) {
        return <Navigate to="/dashboard" replace />;
    }

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <RegisterForm />
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;