// src/api/oeuvreApi.js (Version Connectée à Pyramid)

const API_URL = "http://localhost:6543/api";

// Helper pour gérer les erreurs HTTP
const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur serveur (${response.status})`);
    }
    return await response.json();
};

// --- 1. MODÉRATION (Connecté au Backend) ---

export const fetchOeuvresAModerer = async (token) => {
    // Note: Pour l'instant on ne vérifie pas le token côté Python (MVP), 
    // mais on le passe quand même pour la forme.
    const response = await fetch(`${API_URL}/oeuvres`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const traiterOeuvre = async (id, token) => {
    // id correspond au nom du fichier (ex: Les_Miserables.md)
    const response = await fetch(`${API_URL}/oeuvres/${id}/traiter`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    return handleResponse(response);
};

export const validerOeuvre = async (id, destination, token) => {
    const response = await fetch(`${API_URL}/oeuvres/${id}/valider`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ destination })
    });
    return handleResponse(response);
};

export const refuserOeuvre = async (id, motif, token) => {
    const response = await fetch(`${API_URL}/oeuvres/${id}/rejeter`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ motif })
    });
    return handleResponse(response);
};

// --- 2. DEPOT (Connecté au Backend) ---

export const soumettreOeuvre = async (formData, token) => {
    // FormData est géré automatiquement par fetch (pas besoin de Content-Type)
    const response = await fetch(`${API_URL}/oeuvres/depot`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
    });
    return handleResponse(response);
};

// --- 3. SERVICES SIMULÉS (Pas encore dans le backend) ---
// (On garde la simulation JS pour ce que le Python ne fait pas encore)

export const analyserOeuvreIA = (oeuvreId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const confiance = Math.floor(Math.random() * (99 - 80) + 80);
            resolve({
                titreDetecte: "Titre Détecté par IA",
                auteurDetecte: "Auteur IA",
                anneeDetectee: "2024",
                resume: "Analyse simulée côté client (Backend IA non connecté).",
                destinationSuggeree: "fond_commun", 
                confiance: confiance
            });
        }, 1000);
    });
};





/**
 * NOUVELLE FONCTION : Upload PDF avec conversion OCR automatique
 */
export const numeriserPDF = async (formData, token) => {
    const response = await fetch(`${API_URL}/oeuvres/depot-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // FormData contient : pdf, titre, auteur, soumisPar
    });
    return handleResponse(response);
};



/**
 * NOUVELLE FONCTION : Convertir un PDF en Markdown (sans dépôt)
 */
export const convertirPDF = async (formData, token) => {
    const response = await fetch(`${API_URL}/oeuvres/convertir-pdf`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData // FormData contient : pdf, titre, auteur
    });
    return handleResponse(response);
};

/**
 * NOUVELLE FONCTION : Déposer un Markdown converti
 */
export const deposerMarkdown = async (data, token) => {
    const response = await fetch(`${API_URL}/oeuvres/deposer-md`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(data) // {titre, auteur, contenu_md, soumisPar}
    });
    return handleResponse(response);
};


// Simulation pour l'espace membre (pas encore d'API catalogue)
export const fetchOeuvresDisponibles = () => Promise.resolve([]);
export const fetchMesEmprunts = () => Promise.resolve([]);
export const emprunterOeuvre = () => Promise.resolve({ success: true });
export const fetchMesNumerisations = () => Promise.resolve([]);
export const numeriserOeuvre = () => Promise.resolve({ success: true });
export const sauvegarderMetadonnees = () => Promise.resolve({ success: true });
export const verifierPermission = () => Promise.resolve(true); // On laisse passer tout le monde côté front