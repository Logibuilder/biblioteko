import React, { useState, useEffect } from 'react';
import { numeriserOeuvre, fetchMesNumerisations } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const NumeriserOeuvre = () => {
    const { user } = useAuthContext();
    const token = localStorage.getItem('token');

    // États du formulaire
    const [titre, setTitre] = useState('');
    const [fichier, setFichier] = useState(null);
    
    // États de l'interface
    const [mesNumerisations, setMesNumerisations] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false); // Pour le loading du bouton
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

    // Chargement initial de la liste
    useEffect(() => {
        const loadList = async () => {
            if (user) {
                const data = await fetchMesNumerisations(user.email, token);
                setMesNumerisations(data);
            }
        };
        loadList();
    }, [user, token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!titre || !fichier) {
            setError("Veuillez fournir un titre et un fichier PDF.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setMessage('');

        try {
            const formData = new FormData();
            formData.append('titre', titre);
            formData.append('fichier', fichier);
            formData.append('user', user.email);

            const result = await numeriserOeuvre(formData, token);
            
            setMessage(result.message);
            setMesNumerisations([...mesNumerisations, result.data]); // Mise à jour immédiate
            
            // Reset form
            setTitre('');
            setFichier(null);
            document.getElementById('fileInputNumerisation').value = ""; 

        } catch (err) {
            setError(err.message || "Erreur lors de la numérisation.");
        } finally {
            setIsProcessing(false);
        }
    };

    const downloadMarkdown = (numerisation) => {
        const element = document.createElement("a");
        const file = new Blob([numerisation.contenu], {type: 'text/markdown'});
        element.href = URL.createObjectURL(file);
        element.download = `${numerisation.titre.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <div className="container-fluid mt-3">
            <div className="row">
                {/* COLONNE GAUCHE : Formulaire */}
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-header bg-warning text-dark">
                            <h5 className="mb-0">⚡ Numériser (OCR)</h5>
                        </div>
                        <div className="card-body">
                            <p className="text-muted small">
                                Envoyez un PDF. L'API le transformera en Markdown.
                            </p>

                            {error && <div className="alert alert-danger">{error}</div>}
                            {message && <div className="alert alert-success">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Titre</label>
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        required 
                                        disabled={isProcessing}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Fichier (PDF)</label>
                                    <input 
                                        id="fileInputNumerisation"
                                        type="file" 
                                        className="form-control" 
                                        accept=".pdf"
                                        onChange={(e) => setFichier(e.target.files[0])}
                                        required 
                                        disabled={isProcessing}
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-dark w-100" 
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? "Traitement IA..." : "Lancer la numérisation"}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE : Résultats */}
                <div className="col-md-7">
                    <div className="card shadow-sm bg-light">
                        <div className="card-header bg-secondary text-white">
                            <h5 className="mb-0">📂 Mes Documents</h5>
                        </div>
                        <div className="card-body p-0">
                            {mesNumerisations.length === 0 ? (
                                <div className="p-4 text-center text-muted">Aucun document.</div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {mesNumerisations.map((num) => (
                                        <div key={num.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong>{num.titre}</strong>
                                                <div className="small text-muted">{new Date(num.date).toLocaleDateString()}</div>
                                            </div>
                                            <button 
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() => downloadMarkdown(num)}
                                            >
                                                📥 .md
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NumeriserOeuvre;