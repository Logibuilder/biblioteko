import { useState, useCallback, useEffect } from 'react';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/authApi';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [error, setError] = useState(null);
    
    // ✅ Ajout de l'état token
    const [token, setToken] = useState(null); 

    useEffect(() => {
        const initAuth = async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const storedUser = localStorage.getItem('user');
            const storedToken = localStorage.getItem('token');
            
            if (storedUser && storedToken) {
                try {
                    const userData = JSON.parse(storedUser);
                    setUser(userData);
                    // 👇 LIGNE MANQUANTE AJOUTÉE ICI :
                    setToken(storedToken); 
                    setIsAuthenticated(true);
                    console.log('✅ Session restaurée:', userData.email);
                } catch (err) {
                    console.error('❌ Erreur lors de la restauration de session:', err);
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                }
            }
            
            setIsAuthReady(true);
        };

        initAuth();
    }, []);

    const login = useCallback(async (email, password) => {
        setIsLoading(true);
        setError(null);
        try {
            const userData = await apiLogin(email, password);

            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            setToken(userData.token); // ✅ Correct
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

    // NOUVELLE FONCTION : Register
    const register = useCallback(async (email, password, nom) => {
        setIsLoading(true);
        setError(null);
        try {
            // Appel API
            const userData = await apiRegister(email, password, nom);

            // Si succès, on connecte l'utilisateur directement
            localStorage.setItem('token', userData.token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            setUser(userData);
            setToken(userData.token);
            setIsAuthenticated(true);
            return true;
        } catch (err) {
            setError(err.message || "Erreur lors de l'inscription.");
            return false;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        await apiLogout(); 
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        
        setUser(null);
        setToken(null); // ✅ Correct
        setIsAuthenticated(false);
        setError(null);
        console.log("✅ Utilisateur déconnecté.");
    }, []);

    return { user, token, isAuthenticated, isLoading, error, login, logout,register, isAuthReady };
};

export default useAuth;