import React, { useState } from 'react';
// ⚠️ Correction : Nous importons le hook de contexte qui donne accès à l'état global
import { useAuthContext } from '../../hooks/AuthContext'; 

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // ⚠️ Correction : Appel de useAuthContext à la place de useAuth
    const { login, isLoading, error } = useAuthContext(); 

    // --- Reste de la logique (handleSubmit) inchangée ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // 🚨 ATTENTION : Utiliser une modale/messagebox au lieu d'alert() dans une appli moderne
        if (!email || !password) {
            console.error("Veuillez remplir tous les champs."); 
            // Vous pouvez ajouter ici un affichage d'erreur temporaire dans l'interface
            return;
        }

        const success = await login(email, password);
        if (success) {
            console.log("Connexion réussie !"); 
        }
    };
    // ---------------------------------------------------

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto', padding: '20px', border: '1px solid #ccc', borderRadius: '5px' }}>
            <h2>Connexion à la Bibliothèque</h2>
            
            {error && <p style={{ color: 'red' }}>Erreur: {error}</p>}
            
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="email">Email (Membre ou Bibliothécaire):</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>
            
            <div style={{ marginBottom: '15px' }}>
                <label htmlFor="password">Mot de passe:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                />
            </div>
            
            <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '10px', backgroundColor: isLoading ? '#aaa' : '#ffcc00', color: 'black', border: 'none', cursor: 'pointer' }}>
                {isLoading ? 'Connexion en cours...' : 'Se connecter'}
            </button>
            <p style={{ marginTop: '10px', fontSize: '12px' }}>
                Testez avec <strong>membre@biblio.com</strong> ou <strong>biblio@biblio.com</strong> (Mdp: password)
            </p>
        </form>
    );
};

export default LoginForm;