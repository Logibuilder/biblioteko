import React, { useState, useEffect } from 'react';
import { fetchOeuvresAModerer, analyserOeuvreIA, validerOeuvre, refuserOeuvre } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const OeuvreAModerer = () => {
    const { token } = useAuthContext();
    const [oeuvres, setOeuvres] = useState([]);
    
    // États Modale
    const [selectedOeuvre, setSelectedOeuvre] = useState(null);
    const [aiData, setAiData] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [destination, setDestination] = useState(''); // Le choix du dossier final
    const [globalMessage, setGlobalMessage] = useState(null);

    // Chargement initial
    useEffect(() => {
        const load = async () => {
            const data = await fetchOeuvresAModerer(token);
            setOeuvres(data);
        };
        load();
    }, [token]);

    // Ouvrir Modale + Lancer IA
    const handleOpenModeration = async (oeuvre) => {
        setSelectedOeuvre(oeuvre);
        setAiData(null);
        setDestination('');
        setIsAiLoading(true);

        try {
            const resultIA = await analyserOeuvreIA(oeuvre.id);
            setAiData(resultIA);
            // Pré-selectionner la destination selon l'IA
            setDestination(resultIA.destinationSuggeree || "");
        } catch (err) {
            console.error(err);
        } finally {
            setIsAiLoading(false);
        }
    };

    const handleClose = () => {
        setSelectedOeuvre(null);
        setAiData(null);
    };

    const handleValider = async () => {
        if (!destination) {
            alert("Veuillez choisir le dossier de destination.");
            return;
        }
        
        try {
            const res = await validerOeuvre(selectedOeuvre.id, destination, token);
            setGlobalMessage({ type: 'success', text: res.message });
            setOeuvres(prev => prev.filter(o => o.id !== selectedOeuvre.id));
            handleClose();
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    };

    const handleRefuser = async () => {
        if (!window.confirm("Rejeter définitivement cette œuvre ?")) return;
        await refuserOeuvre(selectedOeuvre.id, "Non conforme", token);
        setGlobalMessage({ type: 'warning', text: "Œuvre rejetée." });
        setOeuvres(prev => prev.filter(o => o.id !== selectedOeuvre.id));
        handleClose();
    };

    return (
        <div className="container-fluid mt-3">
            <h3 className="mb-4 text-primary"><i className="bi bi-folder-symlink me-2"></i>Modération & Classement</h3>

            {globalMessage && (
                <div className={`alert alert-${globalMessage.type} alert-dismissible fade show`}>
                    {globalMessage.text}
                    <button type="button" className="btn-close" onClick={() => setGlobalMessage(null)}></button>
                </div>
            )}

            <div className="card shadow-sm">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light">
                        <tr>
                            <th>Fichier / Titre</th>
                            <th>Soumis par</th>
                            <th>Date</th>
                            <th className="text-end">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {oeuvres.map(o => (
                            <tr key={o.id}>
                                <td>
                                    <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                                    <strong>{o.titre}</strong>
                                    <div className="small text-muted ps-4">{o.fichier}</div>
                                </td>
                                <td>{o.soumisPar}</td>
                                <td>{o.dateSoumission}</td>
                                <td className="text-end">
                                    <button className="btn btn-outline-primary btn-sm" onClick={() => handleOpenModeration(o)}>
                                        <i className="bi bi-eye"></i> Examiner
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {oeuvres.length === 0 && <div className="p-4 text-center text-muted">La file d'attente <code>a_moderer</code> est vide.</div>}
            </div>

            {/* --- MODALE --- */}
            {selectedOeuvre && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}} tabIndex="-1">
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">📦 Classement de l'œuvre</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="row g-3">
                                    {/* INFO FICHIER */}
                                    <div className="col-md-6">
                                        <div className="p-3 bg-light border rounded h-100">
                                            <h6 className="fw-bold text-uppercase small text-muted">Données Membre</h6>
                                            <p className="mb-1"><strong>Titre :</strong> {selectedOeuvre.titre}</p>
                                            <p className="mb-1"><strong>Auteur :</strong> {selectedOeuvre.auteur}</p>
                                            <p className="mb-0"><strong>Fichier :</strong> {selectedOeuvre.fichier}</p>
                                        </div>
                                    </div>

                                    {/* ANALYSE IA */}
                                    <div className="col-md-6">
                                        <div className="p-3 border rounded border-info bg-info-subtle h-100 position-relative">
                                            <h6 className="fw-bold text-uppercase small text-info-emphasis">
                                                <i className="bi bi-robot me-1"></i> Analyse Juridique (IA)
                                            </h6>
                                            
                                            {isAiLoading ? (
                                                <div className="text-center mt-3">
                                                    <div className="spinner-border spinner-border-sm text-info"></div>
                                                    <div className="small mt-1">Vérification droits d'auteur...</div>
                                                </div>
                                            ) : aiData ? (
                                                <div className="small">
                                                    <p className="mb-1"><strong>Auteur détecté :</strong> {aiData.auteurDetecte}</p>
                                                    <p className="mb-2"><strong>Année :</strong> {aiData.anneeDetectee}</p>
                                                    <div className="d-flex align-items-center bg-white p-2 rounded border">
                                                        <i className={`bi fs-4 me-2 ${aiData.destinationSuggeree === 'fond_commun' ? 'bi-unlock-fill text-success' : 'bi-lock-fill text-warning'}`}></i>
                                                        <div>
                                                            <div className="fw-bold">Suggestion : {aiData.destinationSuggeree === 'fond_commun' ? 'Domaine Public' : 'Sous Droits'}</div>
                                                            <div className="text-muted" style={{fontSize: '0.8em'}}>Confiance : {aiData.confiance}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : <span className="text-danger">Erreur IA</span>}
                                        </div>
                                    </div>

                                    {/* CHOIX DESTINATION */}
                                    <div className="col-12 mt-4">
                                        <label className="form-label fw-bold">📂 Destination (Dépôt Git)</label>
                                        <div className="d-flex gap-3">
                                            {/* OPTION 1 : FOND COMMUN */}
                                            <label className={`card p-3 w-100 cursor-pointer border-2 ${destination === 'fond_commun' ? 'border-success bg-success-subtle' : ''}`} style={{cursor:'pointer'}}>
                                                <div className="form-check">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="radio" 
                                                        name="dest" 
                                                        value="fond_commun"
                                                        checked={destination === 'fond_commun'}
                                                        onChange={(e) => setDestination(e.target.value)}
                                                    />
                                                    <span className="fw-bold d-block">fond_commun</span>
                                                    <small className="text-muted">Pour les œuvres libres de droits (Accès gratuit).</small>
                                                </div>
                                            </label>

                                            {/* OPTION 2 : SEQUESTRE */}
                                            <label className={`card p-3 w-100 cursor-pointer border-2 ${destination === 'sequestre' ? 'border-warning bg-warning-subtle' : ''}`} style={{cursor:'pointer'}}>
                                                <div className="form-check">
                                                    <input 
                                                        className="form-check-input" 
                                                        type="radio" 
                                                        name="dest" 
                                                        value="sequestre"
                                                        checked={destination === 'sequestre'}
                                                        onChange={(e) => setDestination(e.target.value)}
                                                    />
                                                    <span className="fw-bold d-block">séquestre</span>
                                                    <small className="text-muted">Pour les œuvres sous droits (Location/Chiffrement).</small>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="modal-footer bg-light">
                                <button className="btn btn-link text-danger text-decoration-none me-auto" onClick={handleRefuser}>
                                    Rejeter l'œuvre
                                </button>
                                <button className="btn btn-secondary" onClick={handleClose}>Annuler</button>
                                <button 
                                    className="btn btn-primary" 
                                    onClick={handleValider}
                                    disabled={!destination || isAiLoading}
                                >
                                    Valider le classement
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OeuvreAModerer;