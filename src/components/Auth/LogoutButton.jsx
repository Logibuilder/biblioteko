import React from 'react';
import { useAuthContext } from '../../hooks/AuthContext';

const LogoutButton = () => {
    const { logout } = useAuthContext();

    return (
        <button 
            onClick={logout} 
            style={{ 
                padding: '8px 15px', 
                backgroundColor: '#dc3545', 
                color: 'white', 
                border: 'none', 
                borderRadius: '5px', 
                cursor: 'pointer' 
            }}
        >
            Déconnexion
        </button>
    );
};

export default LogoutButton;