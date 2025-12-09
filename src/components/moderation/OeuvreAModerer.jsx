import React, { useState, useEffect } from 'react';
import { 
    fetchOeuvresAModerer, 
    verifierPermission, 
    traiterOeuvre, 
    sauvegarderMetadonnees, 
    analyserOeuvreIA, 
    validerOeuvre, 
    refuserOeuvre 
} from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const OeuvreAModerer = () => {
    const { token } = useAuthContext();
    const [oeuvres, setOeuvres] = useState([]);
    
    // États pour la logique
    const [permissionAccordee, setPermissionAccordee] = useState(false);
    const [loading, setLoading] = useState(true);
    const [selectedOeuvre, setSelectedOeuvre] = useState(null);
    
    // États pour l'enrichissement (Modale)
    const [editData, setEditData] = useState({ titre: '', auteur: '' });
    const [isSaving, setIsSaving] = useState(false);

    // États IA et Décision
    const [aiData, setAiData] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [destination, setDestination] = useState('');
    const [motifRejet, setMotifRejet] = useState('');
    const [showRejetInput, setShowRejetInput] = useState(false);
    const [globalMessage, setGlobalMessage] = useState(null);

    // 1. Initialisation
    useEffect(() => {
        const init = async () => {
            if (!token) return;
            setLoading(true);
            const aDroit = await verifierPermission(token, "peut_moderer_oeuvre");
            setPermissionAccordee(aDroit);
            if (aDroit) {
                const data = await fetchOeuvresAModerer(token);
                setOeuvres(data);
            }
            setLoading(false);
        };
        init();
    }, [token]);

    // 2. Ouverture Modale
    const handleOpenModeration = async (oeuvre) => {
        try {
            await traiterOeuvre(oeuvre.id, token);
            setOeuvres(prev => prev.map(o => o.id === oeuvre.id ? { ...o, etat: 'EN_TRAITEMENT' } : o));
            
            setSelectedOeuvre({ ...oeuvre, etat: 'EN_TRAITEMENT' });
            setEditData({ titre: oeuvre.titre, auteur: oeuvre.auteur });
            setAiData(null);
            setDestination('');
            setMotifRejet('');
            setShowRejetInput(false);
            
            lancerIA(oeuvre.id);
        } catch (err) { console.error(err); }
    };

    const lancerIA = async (id) => { 
        setIsAiLoading(true); 
        try { 
            const r = await analyserOeuvreIA(id); 
            setAiData(r); 
            setDestination(r.destinationSuggeree || ""); 
        } catch(e){} 
        finally { setIsAiLoading(false); } 
    };

    // 3. Sauvegarde Enrichissement
    const handleSaveMetadata = async () => {
        setIsSaving(true);
        try {
            await sauvegarderMetadonnees(selectedOeuvre.id, editData, token);
            setSelectedOeuvre(prev => ({ ...prev, ...editData }));
            setOeuvres(prev => prev.map(o => o.id === selectedOeuvre.id ? { ...o, ...editData } : o));
            alert("Métadonnées mises à jour !");
        } catch (err) { alert(err.message); } 
        finally { setIsSaving(false); }
    };

    const handleClose = () => setSelectedOeuvre(null);

    const handleValider = async () => {
        if(!destination) return;
        try{ 
            await validerOeuvre(selectedOeuvre.id, destination, token); 
            setGlobalMessage({type:'success', text:'L\'œuvre a été validée et publiée.'}); 
            setOeuvres(prev => prev.filter(o => o.id !== selectedOeuvre.id));
            handleClose(); 
        } catch(e){ alert(e.message); } 
    };

    const handleRefuser = async () => {
        if(!motifRejet || !window.confirm("Confirmer le rejet ?")) return;
        try{ 
            await refuserOeuvre(selectedOeuvre.id, motifRejet, token); 
            setGlobalMessage({type:'warning', text:'L\'œuvre a été rejetée.'}); 
            setOeuvres(prev => prev.filter(o => o.id !== selectedOeuvre.id));
            handleClose(); 
        } catch(e){ alert(e.message); } 
    };

    if (loading) return <div className="text-center p-5"><div className="spinner-border text-primary"></div></div>;
    if (!permissionAccordee) return <div className="alert alert-danger m-4">Accès interdit.</div>;

    return (
        <div className="container-fluid">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h4 className="fw-bold text-dark mb-1">Espace Modération</h4>
                    <p className="text-muted small mb-0">Gérez les soumissions et classez les œuvres.</p>
                </div>
            </div>

            {globalMessage && (
                <div className={`alert alert-${globalMessage.type} shadow-sm border-0 d-flex align-items-center mb-4`}>
                    <i className={`bi ${globalMessage.type === 'success' ? 'bi-check-circle-fill' : 'bi-exclamation-triangle-fill'} me-2 fs-5`}></i>
                    {globalMessage.text}
                </div>
            )}

            {/* Tableau */}
            <div className="card shadow-sm">
                <div className="table-responsive">
                    <table className="table table-hover align-middle mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="ps-4 py-3">Œuvre</th>
                                <th className="py-3">Auteur</th>
                                <th className="py-3">Soumis par</th>
                                <th className="py-3">État</th>
                                <th className="text-end pe-4 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {oeuvres.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="text-center py-5 text-muted">
                                        <i className="bi bi-inbox fs-1 d-block mb-3 opacity-25"></i>
                                        Aucune œuvre en attente.
                                    </td>
                                </tr>
                            ) : (
                                oeuvres.map(o => (
                                    <tr key={o.id}>
                                        <td className="ps-4">
                                            <div className="d-flex align-items-center">
                                                <div className="bg-primary bg-opacity-10 text-primary rounded p-2 me-3">
                                                    <i className="bi bi-file-earmark-pdf fs-5"></i>
                                                </div>
                                                <div>
                                                    <div className="fw-bold text-dark">{o.titre}</div>
                                                    <div className="small text-muted">{o.fichier}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="fw-semibold text-secondary">{o.auteur}</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <div className="bg-light text-secondary me-2 rounded-circle d-flex justify-content-center align-items-center" style={{width: 24, height: 24, fontSize: 10}}>
                                                    {o.soumisPar.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="small">{o.soumisPar}</span>
                                            </div>
                                        </td>
                                        <td>
                                            {o.etat === 'EN_TRAITEMENT' ? (
                                                <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill">
                                                    <i className="bi bi-hourglass-split me-1"></i> En cours
                                                </span>
                                            ) : (
                                                <span className="badge bg-info bg-opacity-10 text-info border border-info border-opacity-25 px-3 py-2 rounded-pill">
                                                    Nouvelle
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-end pe-4">
                                            <button 
                                                className={`btn btn-sm ${o.etat === 'EN_TRAITEMENT' ? 'btn-primary' : 'btn-outline-primary'} rounded-pill px-3`}
                                                onClick={() => handleOpenModeration(o)}
                                            >
                                                {o.etat === 'EN_TRAITEMENT' ? 'Reprendre' : 'Examiner'}
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* --- MODALE COMPLETE ET DESIGN --- */}
            {selectedOeuvre && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg">
                            
                            {/* Header Modale */}
                            <div className="modal-header bg-primary text-white py-3">
                                <h5 className="modal-title fw-bold">
                                    <i className="bi bi-pencil-square me-2"></i>Traitement
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                            </div>
                            
                            <div className="modal-body p-4">
                                <div className="row g-4">
                                    
                                    {/* COLONNE GAUCHE : ENRICHISSEMENT */}
                                    <div className="col-md-6 border-end pe-4">
                                        <h6 className="text-primary fw-bold mb-3">1. Enrichissement</h6>
                                        
                                        <div className="mb-3">
                                            <label className="form-label small text-muted fw-bold">Titre (Editable)</label>
                                            <input 
                                                type="text" className="form-control" 
                                                value={editData.titre} 
                                                onChange={(e) => setEditData({...editData, titre: e.target.value})}
                                            />
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label small text-muted fw-bold">Auteur (Editable)</label>
                                            <input 
                                                type="text" className="form-control" 
                                                value={editData.auteur} 
                                                onChange={(e) => setEditData({...editData, auteur: e.target.value})}
                                            />
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-outline-primary w-100 mb-4"
                                            onClick={handleSaveMetadata}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? <span className="spinner-border spinner-border-sm me-2"></span> : <i className="bi bi-save me-2"></i>}
                                            Sauvegarder les métadonnées
                                        </button>

                                        {/* Analyse IA */}
                                        <div className="bg-light p-3 rounded-3 border">
                                            <div className="d-flex justify-content-between align-items-center mb-2">
                                                <strong className="text-dark"><i className="bi bi-robot me-2"></i>Analyse IA</strong>
                                                {isAiLoading && <div className="spinner-border spinner-border-sm text-primary"></div>}
                                            </div>
                                            {aiData ? (
                                                <ul className="mb-0 ps-3 small text-muted">
                                                    <li>Auteur détecté : <strong className="text-dark">{aiData.auteurDetecte}</strong></li>
                                                    <li>Confiance : <strong className="text-success">{aiData.confiance}%</strong></li>
                                                    <li>Suggestion : {aiData.destinationSuggeree}</li>
                                                </ul>
                                            ) : <span className="small text-muted">En attente...</span>}
                                        </div>
                                    </div>

                                    {/* COLONNE DROITE : DÉCISION */}
                                    <div className="col-md-6 ps-4">
                                        <h6 className="text-success fw-bold mb-3">2. Décision Finale</h6>
                                        
                                        <p className="small text-muted mb-2">Choisissez le dépôt de destination :</p>
                                        <div className="d-grid gap-2 mb-4">
                                            <button 
                                                className={`btn ${destination === 'fond_commun' ? 'btn-success' : 'btn-outline-success'} text-start p-3`}
                                                onClick={() => { setDestination('fond_commun'); setShowRejetInput(false); }}
                                            >
                                                <div className="fw-bold"><i className="bi bi-unlock-fill me-2"></i>Fond Commun</div>
                                                <div className="small opacity-75">Domaine Public (Gratuit)</div>
                                            </button>
                                            <button 
                                                className={`btn ${destination === 'sequestre' ? 'btn-warning' : 'btn-outline-warning'} text-start p-3`}
                                                onClick={() => { setDestination('sequestre'); setShowRejetInput(false); }}
                                            >
                                                <div className="fw-bold"><i className="bi bi-lock-fill me-2"></i>Séquestre</div>
                                                <div className="small opacity-75">Sous Droits (Chiffré)</div>
                                            </button>
                                        </div>
                                        
                                        {!showRejetInput ? (
                                            <div className="d-grid gap-2">
                                                <button 
                                                    className="btn btn-primary py-2 fw-bold" 
                                                    onClick={handleValider} 
                                                    disabled={!destination}
                                                >
                                                    Valider & Publier
                                                </button>
                                                <button 
                                                    className="btn btn-link text-danger text-decoration-none" 
                                                    onClick={() => { setShowRejetInput(true); setDestination(''); }}
                                                >
                                                    Rejeter l'œuvre
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="bg-danger bg-opacity-10 p-3 rounded-3 border border-danger border-opacity-25">
                                                <label className="form-label small fw-bold text-danger">Motif du rejet :</label>
                                                <textarea 
                                                    className="form-control form-control-sm mb-2" 
                                                    rows="2"
                                                    value={motifRejet}
                                                    onChange={(e) => setMotifRejet(e.target.value)}
                                                    placeholder="Ex: Violation de droits..."
                                                ></textarea>
                                                <div className="d-flex gap-2">
                                                    <button className="btn btn-danger btn-sm w-100" onClick={handleRefuser}>Confirmer</button>
                                                    <button className="btn btn-light btn-sm w-100" onClick={() => setShowRejetInput(false)}>Annuler</button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OeuvreAModerer;