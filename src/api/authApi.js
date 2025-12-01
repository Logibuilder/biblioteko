// --- Simulation de l'endpoint fictif du backend Pyramid ---

const FAKE_USERS = {
    "membre@biblio.com": { id: 101, role: "membre", token: "jwt_membre_123" },
    "biblio@biblio.com": { id: 202, role: "bibliothecaire", token: "jwt_biblio_456" },
};

/**
 * Simule l'appel API /login
 * @param {string} email
 * @param {string} password
 * @returns {Promise<Object>} Informations utilisateur (ou erreur)
 */
export const login = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => { // Simule le temps de latence réseau
            const user = FAKE_USERS[email];
            if (user && password === "password") {
                console.log(`[API Fictive] Connexion réussie pour: ${user.role}`);
                resolve({
                    token: user.token,
                    id: user.id,
                    role: user.role,
                    email,
                });
            } else {
                console.log(`[API Fictive] Échec de la connexion pour: ${email}`);
                reject(new Error("Identifiants incorrects ou utilisateur non trouvé."));
            }
        }, 800);
    });
};

/**
 * Simule l'appel API /logout (Souvent pas nécessaire si on supprime juste le token côté client)
 * @returns {Promise<void>}
 */
export const logout = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("[API Fictive] Déconnexion simulée.");
            resolve();
        }, 200);
    });
};