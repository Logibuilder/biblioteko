import React, { useState, useEffect } from 'react';
// 1. IMPORT MANQUANT : verifierPermission et sauvegarderMetadonnees
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
    
    // 2. ÉTAT MANQUANT : Permission
    const [permissionAccordee, setPermissionAccordee] = useState(false);
    const [loading, setLoading] = useState(true);

    const [selectedOeuvre, setSelectedOeuvre] = useState(null);
    
    // 3. ÉTAT MANQUANT : Données d'édition pour l'enrichissement
    const [editData, setEditData] = useState({ titre: '', auteur: '' });
    const [isSaving, setIsSaving] = useState(false);

    const [aiData, setAiData] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [destination, setDestination] = useState('');
    const [motifRejet, setMotifRejet] = useState('');
    const [showRejetInput, setShowRejetInput] = useState(false);
    const [globalMessage, setGlobalMessage] = useState(null);

    // CORRECTION ÉTAPE 1 : Vérification RBAC avant le chargement
    useEffect(() => {
        const init = async () => {
            if (!token) return;
            setLoading(true);

            // Appel RBAC
            const aDroit = await verifierPermission(token, "peut_moderer_oeuvre");
            setPermissionAccordee(aDroit);

            if (aDroit) {
                loadOeuvres();
            } else {
                setLoading(false); // Stop loading si refusé
            }
        };
        init();
    }, [token]);

    const loadOeuvres = async () => {
        const data = await fetchOeuvresAModerer(token);
        setOeuvres(data);
        setLoading(false);
    };

    const handleOpenModeration = async (oeuvre) => {
        try {
            await traiterOeuvre(oeuvre.id, token);
            const updatedOeuvres = oeuvres.map(o => o.id === oeuvre.id ? { ...o, etat: 'EN_TRAITEMENT' } : o);
            setOeuvres(updatedOeuvres);
            
            // CORRECTION : Initialiser les données d'édition
            setSelectedOeuvre({ ...oeuvre, etat: 'EN_TRAITEMENT' });
            setEditData({ titre: oeuvre.titre, auteur: oeuvre.auteur });
            
            setAiData(null);
            setDestination('');
            setMotifRejet('');
            setShowRejetInput(false);
            lancerIA(oeuvre.id);
        } catch (err) { console.error(err); }
    };

    // CORRECTION ÉTAPE 3 : Fonction de sauvegarde (Enrichissement)
    const handleSaveMetadata = async () => {
        setIsSaving(true);
        try {
            await sauvegarderMetadonnees(selectedOeuvre.id, editData, token);
            // Mise à jour locale
            setSelectedOeuvre(prev => ({ ...prev, ...editData }));
            setOeuvres(prev => prev.map(o => o.id === selectedOeuvre.id ? { ...o, ...editData } : o));
            alert("Métadonnées enrichies !");
        } catch (err) {
            alert("Erreur : " + err.message);
        } finally {
            setIsSaving(false);
        }
    };

    // ... (lancerIA, handleClose, handleValider, handleRefuser restent identiques)
    const lancerIA = async (id) => { /* ... */ setIsAiLoading(true); try { const r = await analyserOeuvreIA(id); setAiData(r); setDestination(r.destinationSuggeree||""); } catch(e){} finally{setIsAiLoading(false);} };
    const handleClose = () => { setSelectedOeuvre(null); setAiData(null); };
    const handleValider = async () => { if(!destination) return alert("Destination?"); try{ await validerOeuvre(selectedOeuvre.id, destination, token); setGlobalMessage({type:'success',text:'Validé'}); loadOeuvres(); handleClose(); }catch(e){alert(e.message);} };
    const handleRefuser = async () => { if(!motifRejet) return alert("Motif?"); if(!window.confirm("Sûr?")) return; try{ await refuserOeuvre(selectedOeuvre.id, motifRejet, token); setGlobalMessage({type:'warning',text:'Rejeté'}); loadOeuvres(); handleClose(); }catch(e){alert(e.message);} };


    if (loading) return <div className="p-5 text-center">Vérification des droits...</div>;
    // Blocage si pas de permission
    if (!permissionAccordee) return <div className="alert alert-danger m-3">Accès Refusé : Droits insuffisants.</div>;

    return (
        <div className="container-fluid mt-3">
             {/* ... (Header et Tableau restent identiques) ... */}
            <h3 className="mb-4 text-primary">Espace Modération</h3>
            {globalMessage && <div className={`alert alert-${globalMessage.type}`}>{globalMessage.text}</div>}
            
            <div className="card shadow-sm">
                <table className="table table-hover align-middle mb-0">
                    <thead className="table-light"><tr><th>Œuvre</th><th>Soumis par</th><th>État</th><th className="text-end">Action</th></tr></thead>
                    <tbody>
                        {oeuvres.map(o => (
                            <tr key={o.id} className={o.etat === 'EN_TRAITEMENT' ? 'table-warning' : ''}>
                                <td><strong>{o.titre}</strong><div className="small text-muted">{o.fichier}</div></td>
                                <td>{o.soumisPar}</td>
                                <td><span className={`badge ${o.etat==='EN_TRAITEMENT'?'bg-warning text-dark':'bg-secondary'}`}>{o.etat||'SOUMISE'}</span></td>
                                <td className="text-end"><button className="btn btn-primary btn-sm" onClick={()=>handleOpenModeration(o)}>{o.etat==='EN_TRAITEMENT'?'Reprendre':'Examiner'}</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {oeuvres.length===0 && <div className="p-4 text-center">Rien à modérer.</div>}
            </div>

            {selectedOeuvre && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.5)'}}>
                    <div className="modal-dialog modal-lg modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">Traitement : {selectedOeuvre.titre}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={handleClose}></button>
                            </div>
                            
                            <div className="modal-body">
                                <div className="row g-3">
                                    {/* CORRECTION : COLONNE D'ENRICHISSEMENT (Inputs éditables) */}
                                    <div className="col-md-6 border-end">
                                        <h6 className="text-primary"><i className="bi bi-pencil-square me-2"></i>Enrichissement</h6>
                                        <div className="mb-2">
                                            <label className="form-label small">Titre (Editable)</label>
                                            <input 
                                                type="text" className="form-control" 
                                                value={editData.titre} 
                                                onChange={(e) => setEditData({...editData, titre: e.target.value})}
                                            />
                                        </div>
                                        <div className="mb-2">
                                            <label className="form-label small">Auteur (Editable)</label>
                                            <input 
                                                type="text" className="form-control" 
                                                value={editData.auteur} 
                                                onChange={(e) => setEditData({...editData, auteur: e.target.value})}
                                            />
                                        </div>
                                        <button 
                                            className="btn btn-sm btn-outline-primary w-100 mt-2"
                                            onClick={handleSaveMetadata}
                                            disabled={isSaving}
                                        >
                                            {isSaving ? 'Sauvegarde...' : 'Sauvegarder Infos'}
                                        </button>

                                        {/* Feedback IA */}
                                        <div className="mt-3 p-2 bg-light rounded small">
                                            <strong>Analyse IA :</strong>
                                            {isAiLoading ? "..." : aiData ? (
                                                <ul className="mb-0 ps-3">
                                                    <li>Auteur détecté : {aiData.auteurDetecte}</li>
                                                    <li>Confiance : {aiData.confiance}%</li>
                                                </ul>
                                            ) : "Erreur IA"}
                                        </div>
                                    </div>

                                    {/* COLONNE DE DÉCISION (Reste identique à votre code, juste réorganisée) */}
                                    <div className="col-md-6">
                                        <h6 className="text-success"><i className="bi bi-check-circle me-2"></i>Décision Finale</h6>
                                        <div className="d-grid gap-2 mb-3">
                                            <button className={`btn ${destination==='fond_commun'?'btn-success':'btn-outline-success'} text-start`} onClick={()=>{setDestination('fond_commun');setShowRejetInput(false);}}>Fond Commun</button>
                                            <button className={`btn ${destination==='sequestre'?'btn-warning':'btn-outline-warning'} text-start`} onClick={()=>{setDestination('sequestre');setShowRejetInput(false);}}>Séquestre</button>
                                        </div>
                                        
                                        {!showRejetInput ? (
                                            <>
                                                <button className="btn btn-primary w-100 mb-2" onClick={handleValider} disabled={!destination}>Valider & Publier</button>
                                                <button className="btn btn-outline-danger w-100" onClick={()=>{setShowRejetInput(true);setDestination('')}}>Rejeter</button>
                                            </>
                                        ) : (
                                            <div className="bg-danger-subtle p-2 rounded">
                                                <label className="small fw-bold">Motif :</label>
                                                <textarea className="form-control form-control-sm mb-2" value={motifRejet} onChange={e=>setMotifRejet(e.target.value)}></textarea>
                                                <button className="btn btn-danger btn-sm w-100" onClick={handleRefuser}>Confirmer Rejet</button>
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