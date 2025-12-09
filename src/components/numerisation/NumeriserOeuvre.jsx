import React, { useState, useEffect } from 'react';
import { numeriserOeuvre, fetchMesNumerisations } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const NumeriserOeuvre = () => {
    const { user } = useAuthContext();
    const token = localStorage.getItem('token');

    const [titre, setTitre] = useState('');
    const [fichier, setFichier] = useState(null);
    const [mesNumerisations, setMesNumerisations] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);

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
            setMesNumerisations([...mesNumerisations, result.data]);
            setTitre('');
            setFichier(null);
            document.getElementById('fileInputNumerisation').value = ""; 
        } catch (err) {
            setError(err.message);
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
        <div className="container-fluid">
            <div className="row g-4 justify-content-center">
                
                {/* ZONE FORMULAIRE */}
                <div className="col-md-5">
                    <div className="card shadow-lg border-0 h-100">
                        <div className="card-header bg-primary text-white py-3">
                            <h5 className="mb-0"><i className="bi bi-magic me-2"></i>Numérisation OCR</h5>
                        </div>
                        <div className="card-body p-4">
                            <p className="text-muted small mb-4">
                                Transformez vos anciens documents PDF en texte éditable (Markdown) grâce à notre moteur IA.
                            </p>

                            {error && <div className="alert alert-danger small">{error}</div>}
                            {message && <div className="alert alert-success small">{message}</div>}

                            <form onSubmit={handleSubmit}>
                                <div className="form-floating mb-3">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="titreDoc"
                                        placeholder="Titre"
                                        value={titre}
                                        onChange={(e) => setTitre(e.target.value)}
                                        required 
                                        disabled={isProcessing}
                                    />
                                    <label htmlFor="titreDoc">Titre du document</label>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">Fichier source (PDF)</label>
                                    <input 
                                        id="fileInputNumerisation"
                                        type="file" 
                                        className="form-control form-control-lg" 
                                        accept=".pdf"
                                        onChange={(e) => setFichier(e.target.files[0])}
                                        required 
                                        disabled={isProcessing}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-3 fw-bold rounded-3" 
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Analyse IA en cours...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-cloud-upload me-2"></i>Lancer la numérisation
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* ZONE RÉSULTATS */}
                <div className="col-md-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white py-3">
                            <h5 className="mb-0 text-dark fw-bold">📂 Mes Documents Numérisés</h5>
                        </div>
                        <div className="card-body p-0">
                            {mesNumerisations.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-file-earmark-text fs-1 opacity-25 d-block mb-2"></i>
                                    Aucun document traité pour l'instant.
                                </div>
                            ) : (
                                <div className="list-group list-group-flush">
                                    {mesNumerisations.map((num) => (
                                        <div key={num.id} className="list-group-item d-flex justify-content-between align-items-center py-3 px-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light rounded p-2 text-dark me-3">
                                                    <i className="bi bi-markdown-fill fs-4"></i>
                                                </div>
                                                <div>
                                                    <strong className="d-block text-dark">{num.titre}</strong>
                                                    <small className="text-muted d-flex align-items-center">
                                                        <i className="bi bi-calendar3 me-1"></i>
                                                        {new Date(num.date).toLocaleDateString()}
                                                    </small>
                                                </div>
                                            </div>
                                            <button 
                                                className="btn btn-outline-primary btn-sm rounded-pill px-3"
                                                onClick={() => downloadMarkdown(num)}
                                            >
                                                <i className="bi bi-download me-2"></i>Markdown
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