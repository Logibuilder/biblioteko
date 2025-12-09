// src/api/authApi.js

// Clé de stockage pour simuler la BDD
const DB_KEY = "biblio_fake_users_db";

// 1. Charger les utilisateurs (ou créer les défauts)
const loadUsers = () => {
    const stored = localStorage.getItem(DB_KEY);
    if (stored) {
        return JSON.parse(stored);
    }
    // Données par défaut si rien dans le stockage
    return {
        "membre@biblio.com": { 
            id: 101, 
            role: "membre", 
            token: "jwt_membre_123", 
            password: "password", // Mot de passe par défaut
            nom: "Membre Test"
        },
        "biblio@biblio.com": { 
            id: 202, 
            role: "bibliothecaire", 
            token: "jwt_biblio_456", 
            password: "password", // Mot de passe par défaut
            nom: "Bibliothécaire Chef"
        },
    };
};

// On charge les utilisateurs en mémoire au démarrage du fichier
let FAKE_USERS = loadUsers();

/**
 * Simule l'appel API /login
 */
export const login = (email, password) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // On recharge pour être sûr d'avoir la dernière version
            FAKE_USERS = loadUsers(); 
            
            const user = FAKE_USERS[email];
            
            if (!user) {
                console.log(`[API Fictive] Utilisateur inconnu: ${email}`);
                reject(new Error("Identifiants incorrects."));
                return;
            }

            // CORRECTION ICI : On vérifie le mot de passe stocké
            // (Si l'utilisateur n'a pas de mot de passe (vieux comptes), on accepte "password" par défaut)
            const motDePasseAttendu = user.password || "password";

            if (password === motDePasseAttendu) {
                console.log(`[API Fictive] Connexion réussie pour: ${user.role}`);
                resolve({
                    token: user.token,
                    id: user.id,
                    role: user.role,
                    email,
                    nom: user.nom || "Utilisateur"
                });
            } else {
                console.log(`[API Fictive] Mauvais mot de passe pour: ${email}`);
                reject(new Error("Identifiants incorrects."));
            }
        }, 800);
    });
};

/**
 * Simule l'appel API /logout
 */
export const logout = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("[API Fictive] Déconnexion simulée.");
            resolve();
        }, 200);
    });
};

/**
 * Simule l'appel API /register avec PERSISTANCE
 */
export const register = (email, password, nom) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // On s'assure d'avoir les données à jour
            FAKE_USERS = loadUsers();

            // 1. Vérifier si l'email existe déjà
            if (FAKE_USERS[email]) {
                reject(new Error("Cet email est déjà utilisé."));
                return;
            }

            // 2. Créer le nouvel utilisateur
            const newUser = {
                id: Date.now(),
                role: "membre",
                token: `jwt_new_${Date.now()}`,
                nom: nom,
                password: password // ✅ CORRECTION : ON SAUVEGARDE LE MOT DE PASSE ICI
            };

            // 3. Mise à jour de l'objet en mémoire
            FAKE_USERS[email] = newUser;

            // 4. SAUVEGARDE DANS LE LOCALSTORAGE
            localStorage.setItem(DB_KEY, JSON.stringify(FAKE_USERS));

            console.log(`[API Fictive] Nouvel utilisateur inscrit : ${email} (MDP: ${password})`);

            resolve({
                token: newUser.token,
                id: newUser.id,
                role: newUser.role,
                email,
                nom
            });

        }, 1000);
    });
};