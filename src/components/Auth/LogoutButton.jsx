import React from 'react';
import useAuth from '../../hooks/useAuth';

const LogoutButton = () => {
    const { logout } = useAuth();

    return (
        <button onClick={logout} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Déconnexion
        </button>
    );
};

export default LogoutButton;