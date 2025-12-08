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



// ... (Conservez le code existant : FAKE_OEUVRES_A_MODERER, fetchOeuvresAModerer, soumettreOeuvre) ...

// --- NOUVEAU CODE À AJOUTER À LA FIN DU FICHIER ---

// 1. Données simulées : Œuvres disponibles à l'emprunt// ... (Gardez le haut du fichier: FAKE_OEUVRES_A_MODERER, fetchOeuvresAModerer, soumettreOeuvre) ...

// --- DÉBUT DU CODE CORRIGÉ À COPIER ---

// 1. Données simulées : Utilisation de 'let' pour permettre la modification des listes en mémoire
let FAKE_OEUVRES_DISPONIBLES = [
    { id: 101, titre: "Les Misérables", auteur: "Victor Hugo", dispo: true },
    { id: 102, titre: "1984", auteur: "George Orwell", dispo: true },
    { id: 103, titre: "Le Meilleur des mondes", auteur: "Aldous Huxley", dispo: true },
    { id: 104, titre: "Fondation", auteur: "Isaac Asimov", dispo: true },
    { id: 105, titre: "Dune", auteur: "Frank Herbert", dispo: true },
];

let FAKE_MES_EMPRUNTS = [
    // Exemple : { id: 99, titre: "Le Petit Prince", auteur: "Saint-Exupéry", dateRetour: "2025-12-01" }
];

// 2. Fonction pour récupérer les emprunts (utilisée par MesEmpruntsList)
export const fetchMesEmprunts = (userEmail, token) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[BACKEND SIMULÉ] Récupération des emprunts pour ${userEmail}`);
            // On renvoie une copie du tableau pour éviter les problèmes de référence
            resolve([...FAKE_MES_EMPRUNTS]);
        }, 500);
    });
};

// 3. Fonction pour récupérer les œuvres disponibles
export const fetchOeuvresDisponibles = (token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token) {
                reject(new Error("Vous devez être connecté."));
                return;
            }
            // On renvoie une copie du tableau
            resolve([...FAKE_OEUVRES_DISPONIBLES]);
        }, 800);
    });
};

// 4. Fonction d'emprunt CORRIGÉE
export const emprunterOeuvre = (oeuvreId, userEmail, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token) {
                reject(new Error("Accès refusé."));
                return;
            }

            // A. Trouver l'œuvre dans la liste des dispos
            const oeuvreIndex = FAKE_OEUVRES_DISPONIBLES.findIndex(o => o.id === oeuvreId);
            
            if (oeuvreIndex === -1) {
                reject(new Error("Œuvre non disponible ou introuvable."));
                return;
            }

            const oeuvre = FAKE_OEUVRES_DISPONIBLES[oeuvreIndex];

            // B. Calcul date retour (J + 14)
            const dateRetour = new Date();
            dateRetour.setDate(dateRetour.getDate() + 14);

            // C. SIMULATION BACKEND : Déplacer de "Dispo" vers "Mes Emprunts"
            // Retirer de la liste disponible
            FAKE_OEUVRES_DISPONIBLES.splice(oeuvreIndex, 1);
            
            // Créer l'objet emprunt complet
            const nouvelEmprunt = { 
                ...oeuvre, 
                dateRetour: dateRetour.toISOString() // Format ISO standard
            };
            
            // Ajouter à l'historique serveur
            FAKE_MES_EMPRUNTS.push(nouvelEmprunt);

            console.log(`[BACKEND SIMULÉ] Emprunt de l'ID ${oeuvreId} validé.`);

            // D. RÉPONSE : On renvoie l'objet 'emprunt' pour que le frontend puisse l'afficher
            resolve({
                success: true,
                message: `Emprunt validé ! Retour prévu le ${dateRetour.toLocaleDateString()}`,
                emprunt: nouvelEmprunt // ✅ C'est cette ligne qui corrige votre erreur
            });
        }, 800);
    });
};



// ... (Gardez tout le code existant : emprunterOeuvre, etc.)

// --- SECTION NUMÉRISATION (OCR) ---

// 1. Stockage simulé des numérisations
let FAKE_MES_NUMERISATIONS = [
    // Exemple : { id: 501, titre: "Vieux Manuscrit", date: "2023-10-10", contenu: "# Titre\nTexte..." }
];

// 2. Récupérer l'historique des numérisations
export const fetchMesNumerisations = (userEmail, token) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`[BACKEND SIMULÉ] Récupération numérisations pour ${userEmail}`);
            resolve([...FAKE_MES_NUMERISATIONS]);
        }, 600);
    });
};

// 3. Simuler le processus d'OCR (PDF -> Markdown)
export const numeriserOeuvre = (formData, token) => {
    const titre = formData.get('titre');
    const fichier = formData.get('fichier');

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token) {
                reject(new Error("Accès refusé."));
                return;
            }
            if (!fichier) {
                reject(new Error("Aucun fichier fourni."));
                return;
            }

            console.log(`[BACKEND SIMULÉ] Traitement OCR en cours sur : ${fichier.name}...`);

            // Génération d'un contenu Markdown fictif
            const fakeMarkdownContent = `
# ${titre}
*(Numérisé le ${new Date().toLocaleDateString()})*

## Introduction
Ceci est le résultat simulé de la transformation du fichier **${fichier.name}**.
L'algorithme de reconnaissance de caractères (OCR) a extrait ce texte.

## Chapitre 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.

> Fin de l'extrait numérisé.
            `;

            const nouvelleNumerisation = {
                id: Date.now(),
                titre: titre,
                nomFichierOriginal: fichier.name,
                date: new Date().toISOString(),
                contenu: fakeMarkdownContent.trim()
            };

            // Ajout à l'historique
            FAKE_MES_NUMERISATIONS.push(nouvelleNumerisation);

            resolve({
                success: true,
                message: "Numérisation terminée avec succès !",
                data: nouvelleNumerisation
            });

        }, 2500); // On simule un délai de 2.5s pour le "traitement"
    });
};