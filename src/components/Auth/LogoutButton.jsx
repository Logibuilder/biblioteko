import React from 'react';
import { useAuthContext } from '../../hooks/AuthContext';

const LogoutButton = () => {
    const { logout } = useAuthContext();

    return (
        <button 
            onClick={logout} 
            className="btn btn-danger"
        >
            <i className="bi bi-box-arrow-right me-2"></i>
            Déconnexion
        </button>
    );
};

export default LogoutButton;