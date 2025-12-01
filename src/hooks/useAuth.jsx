import { useState, useCallback, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authApi';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Utilisé pour les actions (login/logout)
    const [isAuthReady, setIsAuthReady] = useState(false); // 👈 NOUVEL ÉTAT CRITIQUE pour l'initialisation
    const [error, setError] = useState(null);

    // Charger l'état depuis le stockage local (ex: token) à l'initialisation
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        // ⚠️ Marque l'initialisation comme terminée DANS TOUS LES CAS
        setIsAuthReady(true);
    }, []);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await apiLogin(email, password);

            // Stockage et mise à jour de l'état
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.message || "Erreur de connexion.");
            setIsAuthenticated(false);
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        await apiLogout(); 
        
        // Nettoyage de l'état et du stockage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
        setError(null);
        console.log("Utilisateur déconnecté.");
    }, []);

    // ⚠️ Ajout de isAuthReady dans l'objet retourné
    return { user, isAuthenticated, isLoading, error, login, logout, isAuthReady };
};

export default useAuth;