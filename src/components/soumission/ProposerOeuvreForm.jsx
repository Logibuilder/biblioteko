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
        return <div className="alert alert-warning m-4">Réservé aux membres.</div>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titre || !fichier) {
            setError("Titre et fichier requis.");
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

            const result = await soumettreOeuvre(formData, token);
            setMessage(result.message);
            setTitre('');
            setAuteur('');
            setFichier(null);
            document.getElementById('fichierInput').value = '';
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0 overflow-hidden">
                        <div className="card-header bg-primary text-white py-4 text-center border-0">
                            <i className="bi bi-cloud-plus-fill fs-1 mb-2 d-block"></i>
                            <h4 className="mb-0 fw-bold">Contribuer à la Bibliothèque</h4>
                            <p className="mb-0 opacity-75 small">Partagez vos connaissances avec la communauté</p>
                        </div>
                        
                        <div className="card-body p-5">
                            <div className="alert alert-light border border-primary border-opacity-25 d-flex align-items-start mb-4">
                                <i className="bi bi-info-circle-fill text-primary me-3 fs-5 mt-1"></i>
                                <div className="small text-muted">
                                    Votre œuvre sera placée en <strong>file d'attente</strong>. Un bibliothécaire utilisera nos outils d'IA pour valider le contenu avant publication.
                                </div>
                            </div>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-primary">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="titre"
                                                placeholder="Titre"
                                                value={titre}
                                                onChange={(e) => setTitre(e.target.value)}
                                                disabled={isLoading}
                                                required
                                            />
                                            <label htmlFor="titre">Titre de l'œuvre *</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="auteur"
                                                placeholder="Auteur"
                                                value={auteur}
                                                onChange={(e) => setAuteur(e.target.value)}
                                                disabled={isLoading}
                                            />
                                            <label htmlFor="auteur">Nom de l'auteur</label>
                                        </div>
                                    </div>
                                    
                                    <div className="col-12 mt-4">
                                        <label className="form-label fw-bold small text-muted">Fichier numérique (PDF/MD) *</label>
                                        <div className="input-group input-group-lg">
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="fichierInput"
                                                onChange={(e) => setFichier(e.target.files[0])}
                                                disabled={isLoading}
                                                accept=".pdf,.md"
                                                required
                                            />
                                            <span className="input-group-text bg-white text-muted">
                                                <i className="bi bi-file-earmark-arrow-up"></i>
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="d-grid mt-5">
                                    <button 
                                        type="submit" 
                                        className="btn btn-primary py-3 fw-bold shadow-sm"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Envoi en cours..." : "Soumettre pour Modération"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProposerOeuvreForm;
