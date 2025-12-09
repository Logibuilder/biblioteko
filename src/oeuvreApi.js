// src/api/oeuvreApi.js

// ============================================================
// 1. DONNÉES SIMULÉES (Base de données en mémoire RAM)
// ============================================================

let FAKE_OEUVRES_A_MODERER = [
    { 
        id: 1, 
        titre: "Architecture des logiciels", 
        auteur: "Launay M.", 
        format: "PDF",
        fichier: "arch_soft.pdf", 
        dateSoumission: "2025-11-15", 
        soumisPar: "membre@biblio.com",
        etat: "SOUMISE" 
    },
    { 
        id: 2, 
        titre: "Fables choisies", 
        auteur: "Jean de La Fontaine", 
        format: "PDF",
        fichier: "fables.pdf", 
        dateSoumission: "2025-11-16", 
        soumisPar: "etudiant@biblio.com",
        etat: "SOUMISE"
    },
];

let FAKE_OEUVRES_DISPONIBLES = [
    { id: 101, titre: "Les Misérables", auteur: "Victor Hugo", dispo: true },
    { id: 102, titre: "1984", auteur: "George Orwell", dispo: true },
    { id: 103, titre: "Le Meilleur des mondes", auteur: "Aldous Huxley", dispo: true },
    { id: 104, titre: "Fondation", auteur: "Isaac Asimov", dispo: true },
    { id: 105, titre: "Dune", auteur: "Frank Herbert", dispo: true },
];

let FAKE_MES_EMPRUNTS = [];
let FAKE_MES_NUMERISATIONS = [];


// ============================================================
// 2. SERVICE OEUVRE (Logique de Modération & Gestion)
// ============================================================

/**
 * NOUVEAU : Vérification des permissions (RBAC)
 */
export const verifierPermission = (token, permission) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulation : seul le token 'jwt_biblio' a la permission
            // Dans votre Login, biblio@biblio.com a le token 'jwt_biblio_456'
            const hasPermission = token && token.startsWith('jwt_biblio');
            
            if (hasPermission) {
                console.log(`[RBAC] Permission '${permission}' accordée.`);
                resolve(true);
            } else {
                console.warn(`[RBAC] Permission '${permission}' REFUSÉE.`);
                resolve(false);
            }
        }, 300);
    });
};

/**
 * NOUVEAU : Enrichissement des métadonnées (Loop du diagramme)
 */
export const sauvegarderMetadonnees = (id, nouvellesInfos, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const oeuvre = FAKE_OEUVRES_A_MODERER.find(o => o.id === id);
            if (!oeuvre) return reject(new Error("Œuvre introuvable"));

            // Mise à jour de l'objet en mémoire
            oeuvre.titre = nouvellesInfos.titre;
            oeuvre.auteur = nouvellesInfos.auteur;
            
            console.log(`[Service] setInfos() sur l'œuvre ${id} :`, nouvellesInfos);
            resolve({ success: true, message: "Métadonnées mises à jour." });
        }, 400);
    });
};

export const fetchOeuvresAModerer = (token) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("[API] Récupération de la file d'attente...");
            resolve([...FAKE_OEUVRES_A_MODERER]);
        }, 800);
    });
};

export const soumettreOeuvre = (formData, token) => {
    const titre = formData.get('titre');
    const auteur = formData.get('auteur') || "Auteur inconnu";
    const fichier = formData.get('fichier');
    const soumisPar = formData.get('soumisPar');

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!token) return reject(new Error("Connexion requise."));
            if (!titre || !fichier) return reject(new Error("Titre et fichier requis."));

            const newId = Date.now();
            const extension = fichier.name ? fichier.name.split('.').pop().toUpperCase() : "PDF";

            const nouvelleSoumission = {
                id: newId,
                titre: titre,
                auteur: auteur,
                format: extension,
                fichier: fichier.name || "fichier.pdf",
                dateSoumission: new Date().toISOString().split('T')[0],
                soumisPar: soumisPar || "membre@biblio.com",
                etat: "SOUMISE"
            };

            FAKE_OEUVRES_A_MODERER.push(nouvelleSoumission);
            console.log(`[BACKEND] Nouvelle œuvre soumise : ${titre}`);

            resolve({
                success: true,
                message: "Œuvre soumise avec succès.",
                oeuvreId: newId,
            });
        }, 1500);
    });
};

export const traiterOeuvre = (id, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const oeuvre = FAKE_OEUVRES_A_MODERER.find(o => o.id === id);
            if (!oeuvre) return reject(new Error("Œuvre introuvable"));
            
            oeuvre.etat = "EN_TRAITEMENT"; 
            console.log(`[Service] Œuvre ${id} verrouillée (EN_TRAITEMENT).`);
            
            resolve({ success: true, etat: "EN_TRAITEMENT" });
        }, 300);
    });
};

export const validerOeuvre = (id, destination, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = FAKE_OEUVRES_A_MODERER.findIndex(o => o.id === id);
            if (index === -1) return reject(new Error("Œuvre introuvable."));

            const oeuvre = FAKE_OEUVRES_A_MODERER[index];
            FAKE_OEUVRES_A_MODERER.splice(index, 1);

            const oeuvreValidee = {
                id: oeuvre.id,
                titre: oeuvre.titre,
                auteur: oeuvre.auteur,
                dispo: true,
                isGratuit: destination === 'fond_commun',
                dateValidation: new Date().toISOString()
            };
            
            FAKE_OEUVRES_DISPONIBLES.push(oeuvreValidee);

            console.log(`[GIT] Déplacement vers /${destination}/${oeuvre.fichier}`);
            resolve({ success: true, message: `Validée dans ${destination}.` });
        }, 800);
    });
};

export const refuserOeuvre = (id, motif, token) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const index = FAKE_OEUVRES_A_MODERER.findIndex(o => o.id === id);
            if (index !== -1) FAKE_OEUVRES_A_MODERER.splice(index, 1);
            
            console.log(`[BACKEND] Rejet : ${motif}`);
            resolve({ success: true, message: "Œuvre rejetée." });
        }, 500);
    });
};

export const analyserOeuvreIA = (oeuvreId) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const isPublicDomain = oeuvreId % 2 === 0; 
            const confiance = Math.floor(Math.random() * (99 - 80) + 80);
            resolve({
                titreDetecte: isPublicDomain ? "Titre Classique" : "Doc Technique",
                auteurDetecte: isPublicDomain ? "Victor Hugo" : "Auteur Moderne",
                anneeDetectee: isPublicDomain ? "1862" : "2024",
                destinationSuggeree: isPublicDomain ? "fond_commun" : "sequestre", 
                confiance: confiance
            });
        }, 1200);
    });
};


// ============================================================
// 3. SERVICE EMPRUNT & NUMÉRISATION
// ============================================================

export const fetchOeuvresDisponibles = (token) => {
    return new Promise((resolve) => setTimeout(() => resolve([...FAKE_OEUVRES_DISPONIBLES]), 600));
};

// Remplacez la fonction fetchMesEmprunts existante par celle-ci :

export const fetchMesEmprunts = (userEmail, token) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const now = new Date();
            
            // 1. Filtrer : Séparer les emprunts valides des expirés
            const empruntsValides = [];
            const empruntsExpires = [];

            FAKE_MES_EMPRUNTS.forEach(emprunt => {
                const dateRetour = new Date(emprunt.dateRetour);
                if (dateRetour < now) {
                    empruntsExpires.push(emprunt);
                } else {
                    empruntsValides.push(emprunt);
                }
            });

            // 2. Traiter les expirations (Retour automatique en rayon)
            if (empruntsExpires.length > 0) {
                console.log(`[AUTO-SYSTEM] ${empruntsExpires.length} emprunt(s) expiré(s). Retour automatique.`);
                
                empruntsExpires.forEach(emp => {
                    // On recrée l'objet œuvre "propre" (sans les dates d'emprunt)
                    const oeuvreRendue = {
                        id: emp.id,
                        titre: emp.titre,
                        auteur: emp.auteur,
                        dispo: true,
                        isGratuit: emp.isGratuit
                    };
                    // On la remet dans le catalogue disponible
                    FAKE_OEUVRES_DISPONIBLES.push(oeuvreRendue);
                });

                // 3. Mettre à jour la "Base de données" simulée
                // On vide le tableau original et on ne remet que les valides
                FAKE_MES_EMPRUNTS.length = 0;
                FAKE_MES_EMPRUNTS.push(...empruntsValides);
            }

            // 4. Renvoyer uniquement la liste à jour à l'utilisateur
            resolve([...FAKE_MES_EMPRUNTS]);
        }, 500);
    });
};

export const emprunterOeuvre = (oeuvreId, userEmail, token) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const index = FAKE_OEUVRES_DISPONIBLES.findIndex(o => o.id === oeuvreId);
            if (index === -1) return reject(new Error("Œuvre indisponible."));

            const oeuvre = FAKE_OEUVRES_DISPONIBLES[index];
            FAKE_OEUVRES_DISPONIBLES.splice(index, 1);

            const dateRetour = new Date();
            dateRetour.setDate(dateRetour.getDate() + 14);

            const nouvelEmprunt = { 
                ...oeuvre, 
                dateEmprunt: new Date().toISOString(),
                dateRetour: dateRetour.toISOString() 
            };
            
            FAKE_MES_EMPRUNTS.push(nouvelEmprunt);
            console.log(`[BACKEND] Emprunt validé pour ${oeuvre.titre}`);

            resolve({
                success: true,
                message: `Emprunt validé !`,
                emprunt: nouvelEmprunt
            });
        }, 800);
    });
};

export const fetchMesNumerisations = (userEmail, token) => {
    return new Promise((resolve) => setTimeout(() => resolve([...FAKE_MES_NUMERISATIONS]), 600));
};

export const numeriserOeuvre = (formData, token) => {
    const titre = formData.get('titre');
    const fichier = formData.get('fichier');

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (!fichier) return reject(new Error("Fichier manquant."));
            const mdContent = `# ${titre}\n\n[Contenu OCR simulé...]`;
            const nouvelleNum = {
                id: Date.now(),
                titre: titre,
                nomFichierOriginal: fichier.name,
                date: new Date().toISOString(),
                contenu: mdContent
            };
            FAKE_MES_NUMERISATIONS.push(nouvelleNum);
            resolve({ success: true, message: "OCR terminé.", data: nouvelleNum });
        }, 2000);
    });
};