// ============================================
// FICHIER 4: Frontend - src/components/numerisation/NumeriserOeuvre.jsx (COMPLET)
// ============================================

import React, { useState, useEffect } from 'react';
import { convertirPDF, deposerMarkdown } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

const NumeriserOeuvre = () => {
    const { user, token } = useAuthContext();

    // États du formulaire
    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [pdfFile, setPdfFile] = useState(null);
    
    // États de traitement
    const [isProcessing, setIsProcessing] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    
    // État de conversion
    const [documentConverti, setDocumentConverti] = useState(null);
    
    // Liste des conversions
    const [mesConversions, setMesConversions] = useState([]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.type !== 'application/pdf') {
                setError("Seuls les fichiers PDF sont acceptés.");
                setPdfFile(null);
                return;
            }
            if (file.size > 50 * 1024 * 1024) {
                setError("Le fichier est trop volumineux (50MB maximum).");
                setPdfFile(null);
                return;
            }
            setPdfFile(file);
            setError(null);
            
            if (!titre) {
                const nomSansPdf = file.name.replace('.pdf', '').replace(/_/g, ' ');
                setTitre(nomSansPdf);
            }
        }
    };

    const handleConvertir = async (e) => {
        e.preventDefault();
        
        if (!titre || !pdfFile) {
            setError("Veuillez fournir un titre et un fichier PDF.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setMessage('');
        setDocumentConverti(null);
        setUploadProgress(10);

        try {
            const formData = new FormData();
            formData.append('pdf', pdfFile);
            formData.append('titre', titre);
            formData.append('auteur', auteur || 'Auteur inconnu');

            setUploadProgress(30);

            // Appel API : CONVERSION SEULEMENT
            const result = await convertirPDF(formData, token);

            setUploadProgress(100);
            setMessage(`✅ Conversion réussie ! (${result.taille_md} caractères extraits)`);
            
            // Stockage du document converti en mémoire
            setDocumentConverti({
                titre: result.titre,
                auteur: result.auteur,
                contenu_md: result.contenu_md,
                fichier_original: result.fichier_original,
                date: new Date().toISOString()
            });

            // Ajout à l'historique local
            setMesConversions(prev => [
                {
                    id: Date.now(),
                    titre: result.titre,
                    auteur: result.auteur,
                    date: new Date().toISOString(),
                    statut: 'CONVERTIE'
                },
                ...prev
            ]);
            
        } catch (err) {
            setError(err.message || "Erreur lors de la conversion.");
        } finally {
            setIsProcessing(false);
            setTimeout(() => setUploadProgress(0), 2000);
        }
    };

    const handleDeposer = async () => {
        if (!documentConverti) return;

        setIsProcessing(true);
        setError(null);

        try {
            const data = {
                titre: documentConverti.titre,
                auteur: documentConverti.auteur,
                contenu_md: documentConverti.contenu_md,
                soumisPar: user.email
            };

            const result = await deposerMarkdown(data, token);
            
            setMessage(`✅ ${result.message}`);
            
            // Mise à jour du statut
            setMesConversions(prev => 
                prev.map(conv => 
                    conv.titre === documentConverti.titre 
                        ? { ...conv, statut: 'DEPOSEE' } 
                        : conv
                )
            );
            
            // Reset
            setDocumentConverti(null);
            setTitre('');
            setAuteur('');
            setPdfFile(null);
            document.getElementById('fileInputPDF').value = "";
            
        } catch (err) {
            setError(err.message);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleTelecharger = () => {
        if (!documentConverti) return;

        const blob = new Blob([documentConverti.contenu_md], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${documentConverti.titre.replace(/\s+/g, '_')}.md`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        setMessage('📥 Fichier téléchargé avec succès !');
    };

    return (
        <div className="container-fluid">
            <div className="mb-4">
                <h3 className="fw-bold text-dark mb-1">
                    <i className="bi bi-magic me-2 text-primary"></i>
                    Numérisation OCR Automatique
                </h3>
                <p className="text-muted">Convertissez vos PDF en Markdown, puis déposez-les ou téléchargez-les.</p>
            </div>

            <div className="row g-4">
                
                {/* COLONNE GAUCHE : FORMULAIRE */}
                <div className="col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-primary text-white py-3">
                            <h5 className="mb-0">
                                <i className="bi bi-file-pdf me-2"></i>
                                Étape 1 : Conversion
                            </h5>
                        </div>
                        <div className="card-body p-4">
                            
                            {error && (
                                <div className="alert alert-danger d-flex align-items-center small mb-3">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}
                            {message && (
                                <div className="alert alert-success d-flex align-items-center small mb-3">
                                    <i className="bi bi-check-circle-fill me-2"></i>
                                    {message}
                                </div>
                            )}

                            {isProcessing && uploadProgress > 0 && (
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <small className="text-muted fw-bold">Traitement en cours...</small>
                                        <small className="text-primary fw-bold">{uploadProgress}%</small>
                                    </div>
                                    <div className="progress" style={{height: '8px'}}>
                                        <div 
                                            className="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                            style={{width: `${uploadProgress}%`}}
                                        ></div>
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleConvertir}>
                                
                                <div className="mb-4">
                                    <label className="form-label small fw-bold text-muted">
                                        <i className="bi bi-file-earmark-pdf me-1 text-danger"></i>
                                        Fichier PDF *
                                    </label>
                                    <div className="border rounded-3 p-3 bg-light text-center">
                                        <input 
                                            id="fileInputPDF"
                                            type="file" 
                                            className="form-control form-control-lg" 
                                            accept=".pdf"
                                            onChange={handleFileChange}
                                            required 
                                            disabled={isProcessing}
                                            style={{display: pdfFile ? 'none' : 'block'}}
                                        />
                                        
                                        {pdfFile && (
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center">
                                                    <i className="bi bi-file-earmark-pdf fs-1 text-danger me-3"></i>
                                                    <div className="text-start">
                                                        <strong className="d-block text-dark">{pdfFile.name}</strong>
                                                        <small className="text-muted">
                                                            {(pdfFile.size / 1024 / 1024).toFixed(2)} MB
                                                        </small>
                                                    </div>
                                                </div>
                                                <button 
                                                    type="button"
                                                    className="btn btn-sm btn-outline-danger rounded-circle"
                                                    onClick={() => {
                                                        setPdfFile(null);
                                                        document.getElementById('fileInputPDF').value = "";
                                                    }}
                                                    disabled={isProcessing}
                                                >
                                                    <i className="bi bi-x"></i>
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                    <label htmlFor="titreDoc">Titre *</label>
                                </div>

                                <div className="form-floating mb-4">
                                    <input 
                                        type="text" 
                                        className="form-control" 
                                        id="auteurDoc"
                                        placeholder="Auteur"
                                        value={auteur}
                                        onChange={(e) => setAuteur(e.target.value)}
                                        disabled={isProcessing}
                                    />
                                    <label htmlFor="auteurDoc">Auteur</label>
                                </div>

                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-3 fw-bold rounded-3" 
                                    disabled={isProcessing}
                                >
                                    {isProcessing ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Conversion en cours...
                                        </>
                                    ) : (
                                        <>
                                            <i className="bi bi-lightning-charge-fill me-2"></i>
                                            Convertir en Markdown
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* PANNEAU ACTIONS POST-CONVERSION */}
                    {documentConverti && (
                        <div className="card shadow-sm border-success border-2 mt-3">
                            <div className="card-header bg-success text-white py-3">
                                <h5 className="mb-0">
                                    <i className="bi bi-check-circle me-2"></i>
                                    Étape 2 : Action
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <p className="text-muted small mb-3">
                                    Document converti avec succès. Que souhaitez-vous faire ?
                                </p>
                                
                                <div className="d-grid gap-2">
                                    <button 
                                        className="btn btn-success py-3 fw-bold"
                                        onClick={handleDeposer}
                                        disabled={isProcessing}
                                    >
                                        <i className="bi bi-cloud-upload me-2"></i>
                                        Déposer dans la bibliothèque
                                    </button>
                                    
                                    <button 
                                        className="btn btn-outline-primary py-3"
                                        onClick={handleTelecharger}
                                    >
                                        <i className="bi bi-download me-2"></i>
                                        Télécharger le fichier .md
                                    </button>
                                </div>

                                <div className="mt-3 p-3 bg-light rounded-3">
                                    <small className="text-muted">
                                        <strong>Aperçu :</strong><br/>
                                        {documentConverti.contenu_md.substring(0, 200)}...
                                    </small>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* COLONNE DROITE : HISTORIQUE */}
                <div className="col-lg-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center">
                            <h5 className="mb-0 text-dark fw-bold">
                                <i className="bi bi-clock-history me-2"></i>
                                Historique des Conversions
                            </h5>
                            <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                                {mesConversions.length}
                            </span>
                        </div>
                        <div className="card-body p-0">
                            {mesConversions.length === 0 ? (
                                <div className="text-center py-5 text-muted">
                                    <i className="bi bi-inbox fs-1 opacity-25 d-block mb-3"></i>
                                    <p className="mb-0">Aucune conversion effectuée.</p>
                                </div>
                            ) : (
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle mb-0">
                                        <thead className="bg-light">
                                            <tr>
                                                <th className="ps-4 py-3">Document</th>
                                                <th className="py-3">Date</th>
                                                <th className="py-3 text-center">Statut</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {mesConversions.map((conv) => (
                                                <tr key={conv.id}>
                                                    <td className="ps-4">
                                                        <div className="d-flex align-items-center">
                                                            <div className={`${conv.statut === 'DEPOSEE' ? 'bg-success' : 'bg-warning'} bg-opacity-10 text-${conv.statut === 'DEPOSEE' ? 'success' : 'warning'} rounded p-2 me-3`}>
                                                                <i className="bi bi-markdown-fill fs-5"></i>
                                                            </div>
                                                            <div>
                                                                <strong className="d-block text-dark">{conv.titre}</strong>
                                                                <small className="text-muted">{conv.auteur}</small>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="text-muted small">
                                                        {new Date(conv.date).toLocaleDateString('fr-FR')}
                                                    </td>
                                                    <td className="text-center">
                                                        {conv.statut === 'DEPOSEE' ? (
                                                            <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-3 py-2 rounded-pill">
                                                                <i className="bi bi-check-circle me-1"></i>
                                                                Déposée
                                                            </span>
                                                        ) : (
                                                            <span className="badge bg-warning bg-opacity-10 text-warning border border-warning border-opacity-25 px-3 py-2 rounded-pill">
                                                                <i className="bi bi-hourglass-split me-1"></i>
                                                                Convertie
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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