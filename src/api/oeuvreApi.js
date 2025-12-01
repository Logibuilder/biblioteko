// Simulates existing works awaiting moderation
const FAKE_OEUVRES_A_MODERER = [
    {
        id: 1,
        titre: "Architecture des logiciels",
        auteur: "Launay M.",
        format: "PDF",
        dateSoumission: "2025-11-15",
        soumisPar: "membre@biblio.com"
    },
];

/**
 * Simulates the secure API call to list works for moderation (for Bibliothécaire).
 */
export const fetchOeuvresAModerer = (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token || !token.startsWith('jwt_biblio')) {
                reject(new Error("Access denied. You must be a librarian."));
                return;
            }
            console.log("[FAKE API] Fetching works for moderation.");
            resolve(FAKE_OEUVRES_A_MODERER);
        }, 1000);
    });
};

/**
 * Simulates the API call /proposer-oeuvre (Frontend -> ControleurDepot).
 * This simulates the backend logic: modeling the Oeuvre object and saving
 * the file to the 'a_moderer' Git repository directory.
 */
export const soumettreOeuvre = (formData, token) => {
    const titre = formData.get('titre');
    const fichier = formData.get('fichier');
    
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token || !token.startsWith('jwt_membre')) {
                reject(new Error("Error: You must be logged in to submit a work."));
                return;
            }
            if (!titre || !fichier) {
                reject(new Error("Title and file are required."));
                return;
            }
            
            // CRITICAL STEP: Simulating the backend's action (Diagram Step 6)
            console.log(`[BACKEND SIMULÉ - Contrôleur Dépôt] Receiving work '${titre}'. Modeling the Oeuvre object, setting status to 'EtatSoumise'.`);
            console.log(`[BACKEND SIMULÉ - Dépôt Git] Saving file '${fichier.name}' to the 'a_moderer' directory via a commit.`);
            
            resolve({ 
                success: true, 
                message: "Work successfully submitted, awaiting moderation (stored in 'a_moderer').",
                oeuvreId: Date.now()
            });
        }, 1500);
    });
};