import React, { createContext, useContext } from 'react';
import useAuth from './useAuth'; // Importe la logique du hook que nous avons défini précédemment

// 1. Création du Context
const AuthContext = createContext();

/**
 * 2. Hook personnalisé pour consommer le contexte
 * C'est ce que vous utiliserez dans tous les composants (ex: const { user, isAuthenticated } = useAuthContext();)
 */
export const useAuthContext = () => {
    return useContext(AuthContext);
};

/**
 * 3. Le Provider qui enveloppe l'application et gère l'état global
 */
export const AuthProvider = ({ children }) => {
    // Utilisation du hook d'authentification pour gérer toute la logique d'état
    const auth = useAuth();

    // La valeur fournie est l'objet retourné par useAuth
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    );
};

// Export par défaut pour l'utilisation dans le fichier racine (index.js)
export default AuthContext;