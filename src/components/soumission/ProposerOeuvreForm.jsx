import React, { useState } from 'react';
import { soumettreOeuvre } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const ProposerOeuvreForm = () => {
    const { user } = useAuthContext();
    const token = localStorage.getItem('token'); 

    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [fichier, setFichier] = useState(null);
    
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    if (!user || user.role !== 'membre') {
        return (
            <div className="alert alert-warning" role="alert">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                Seuls les membres peuvent proposer des œuvres.
            </div>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titre || !fichier) {
            setError("Le titre et le fichier (PDF/MD) sont obligatoires.");
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('titre', titre);
            formData.append('auteur', auteur);
            formData.append('fichier', fichier); 
            formData.append('soumisPar', user.email);
            formData.append('token', token); 

            const result = await soumettreOeuvre(formData, token);
            
            setMessage(result.message);
            
            // Reset form
            setTitre('');
            setAuteur('');
            setFichier(null);
            // Reset file input
            document.getElementById('fichier').value = '';

        } catch (err) {
            setError(err.message || "Erreur lors de la soumission de l'œuvre.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="card shadow-sm">
            <div className="card-header bg-success text-white">
                <h4 className="mb-0">
                    <i className="bi bi-file-earmark-arrow-up me-2"></i>
                    Proposer une Œuvre à la Communauté
                </h4>
            </div>
            <div className="card-body">
                <div className="alert alert-info" role="alert">
                    <i className="bi bi-info-circle-fill me-2"></i>
                    Votre soumission sera placée dans le répertoire <code>a_moderer</code> en attente de validation par un bibliothécaire.
                </div>

                {error && (
                    <div className="alert alert-danger alert-dismissible fade show" role="alert">
                        <i className="bi bi-x-circle-fill me-2"></i>
                        <strong>Erreur :</strong> {error}
                        <button type="button" className="btn-close" onClick={() => setError(null)} aria-label="Close"></button>
                    </div>
                )}

                {message && (
                    <div className="alert alert-success alert-dismissible fade show" role="alert">
                        <i className="bi bi-check-circle-fill me-2"></i>
                        <strong>Succès :</strong> {message}
                        <button type="button" className="btn-close" onClick={() => setMessage('')} aria-label="Close"></button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Champ Titre */}
                    <div className="mb-3">
                        <label htmlFor="titre" className="form-label fw-bold">
                            <i className="bi bi-book me-2"></i>
                            Titre de l'œuvre <span className="text-danger">*</span>
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="titre"
                            value={titre}
                            onChange={(e) => setTitre(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ex: Architecture des logiciels"
                            required
                        />
                    </div>

                    {/* Champ Auteur */}
                    <div className="mb-3">
                        <label htmlFor="auteur" className="form-label fw-bold">
                            <i className="bi bi-person me-2"></i>
                            Nom(s) de l'auteur(s)
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="auteur"
                            value={auteur}
                            onChange={(e) => setAuteur(e.target.value)}
                            disabled={isLoading}
                            placeholder="Ex: Launay M."
                        />
                    </div>

                    {/* Champ Fichier */}
                    <div className="mb-3">
                        <label htmlFor="fichier" className="form-label fw-bold">
                            <i className="bi bi-file-earmark-pdf me-2"></i>
                            Fichier Numérique (PDF ou MD) <span className="text-danger">*</span>
                        </label>
                        <input
                            type="file"
                            className="form-control"
                            id="fichier"
                            onChange={(e) => setFichier(e.target.files[0])}
                            disabled={isLoading}
                            accept=".pdf,.md"
                            required
                        />
                        <div className="form-text">
                            <i className="bi bi-info-circle me-1"></i>
                            Formats acceptés : PDF, Markdown (.md)
                        </div>
                    </div>

                    <div className="d-grid">
                        <button 
                            type="submit" 
                            className="btn btn-success btn-lg"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                    Envoi en cours...
                                </>
                            ) : (
                                <>
                                    <i className="bi bi-send me-2"></i>
                                    Soumettre pour Modération
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProposerOeuvreForm;