import { useState, useCallback, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout } from '../api/authApi';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [error, setError] = useState(null);

    // Charger l'état depuis le stockage local à l'initialisation
    useEffect(() => {
        const initAuth = async () => {
            // ✅ Délai minimal pour améliorer l'UX (optionnel)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    setIsAuthenticated(true);
                    console.log('✅ Session restaurée:', userData.email);
                } catch (err) {
                    console.error('❌ Erreur lors de la restauration de session:', err);
                    // Nettoyage en cas de données corrompues
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            
            // Marque l'initialisation comme terminée
            setIsAuthReady(true);
        };

        initAuth();
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
        console.log("✅ Utilisateur déconnecté.");
    }, []);

    return { user, isAuthenticated, isLoading, error, login, logout, isAuthReady };
};

export default useAuth;