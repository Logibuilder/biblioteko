import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { soumettreOeuvre } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const ProposerOeuvreForm = () => {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const token = localStorage.getItem('token');

    const fichierInputRef = useRef(null);

    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [contenuMarkdown, setContenuMarkdown] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [fromConversion, setFromConversion] = useState(false);

    if (!user || user.role !== 'membre') {
        return <div className="alert alert-warning m-4">Réservé aux membres.</div>;
    }

    useEffect(() => {
        const oeuvreConvertie = sessionStorage.getItem('oeuvreConvertie');
        if (oeuvreConvertie) {
            try {
                const data = JSON.parse(oeuvreConvertie);
                setContenuMarkdown(data.contenu_md || '');
                setFromConversion(true);
                sessionStorage.removeItem('oeuvreConvertie');
                setMessage('✅ Document converti chargé avec succès !');
            } catch (e) {
                console.error('Erreur parsing données:', e);
            }
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titre.trim()) {
            setError("Le titre est requis.");
            return;
        }
        if (!fromConversion && !contenuMarkdown) {
            setError("Aucun contenu disponible pour soumission.");
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError(null);

        try {
            const formData = new FormData();
            formData.append('titre', titre.trim());
            formData.append('auteur', auteur.trim());
            formData.append('soumisPar', user.email);

            if (contenuMarkdown) {
                formData.append('contenu_md', contenuMarkdown);
                formData.append('source', 'conversion_ocr');
            }

            const result = await soumettreOeuvre(formData, token);
            setMessage(result.message);

            setTitre('');
            setAuteur('');
            setContenuMarkdown('');
            setFromConversion(false);

            setTimeout(() => navigate('/dashboard/emprunter'), 3000);
        } catch (err) {
            setError(err.message || "Erreur lors de la soumission.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleReinitialiser = () => {
        setTitre('');
        setAuteur('');
        setContenuMarkdown('');
        setFromConversion(false);
        setError('');
        setMessage('');
    };

    return (
        <div className="container">
            <h3 className="fw-bold mb-4">
                {fromConversion ? "Déposer l'œuvre convertie" : "Proposer une œuvre"}
            </h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Auteur"
                        value={auteur}
                        onChange={(e) => setAuteur(e.target.value)}
                    />
                </div>

                {fromConversion && contenuMarkdown && (
                    <div className="mb-3 p-3 border border-success rounded">
                        <h6>Contenu converti (Markdown)</h6>
                        <div style={{ maxHeight: '250px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                            {contenuMarkdown.substring(0, 2000)}
                            {contenuMarkdown.length > 2000 && '...'}
                        </div>
                    </div>
                )}

                <div className="d-flex gap-2">
                    <button type="button" className="btn btn-secondary flex-grow-1" onClick={handleReinitialiser} disabled={isLoading}>
                        Réinitialiser
                    </button>
                    <button type="submit" className="btn btn-primary flex-grow-1" disabled={isLoading}>
                        {isLoading ? "Envoi..." : (fromConversion ? "Déposer l'œuvre convertie" : "Soumettre")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProposerOeuvreForm;
