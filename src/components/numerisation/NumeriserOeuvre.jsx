import React, { useState } from 'react';
import { convertirPDF } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const NumeriserOeuvre = () => {
    const { token } = useAuthContext();
    const navigate = useNavigate();

    const [pdfFile, setPdfFile] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState(null);
    const [documentConverti, setDocumentConverti] = useState(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.type !== 'application/pdf') {
            setError("Seuls les fichiers PDF sont acceptés.");
            return;
        }

        setPdfFile(file);
        setError(null);
    };

    const handleConvertir = async (e) => {
        e.preventDefault();

        if (!pdfFile) {
            setError("Veuillez fournir un PDF.");
            return;
        }

        setIsProcessing(true);
        setError(null);
        setMessage('');
        setDocumentConverti(null);

        try {
            const formData = new FormData();
            formData.append('pdf', pdfFile);

            const result = await convertirPDF(formData, token);

            const contenuMarkdown = result?.contenu_md || result?.markdown || result?.texte || result?.content;

            if (!contenuMarkdown) throw new Error("Le contenu converti est vide.");

            setDocumentConverti(contenuMarkdown);
            setMessage("✅ Conversion réussie !");
        } catch (err) {
            setError(err.message || "Erreur lors de la conversion.");
        } finally {
            setIsProcessing(false);
        }
    };

    const handleDeposer = () => {
        if (!documentConverti) return;

        sessionStorage.setItem(
            'oeuvreConvertie',
            JSON.stringify({ contenu_md: documentConverti, source: 'conversion_ocr' })
        );

        navigate('/dashboard/proposer');
    };

    return (
        <div className="container">
            <h3 className="fw-bold mb-3">Numérisation OCR</h3>

            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <form onSubmit={handleConvertir} className="card p-4 shadow-sm">
                <input
                    type="file"
                    accept=".pdf"
                    className="form-control mb-3"
                    onChange={handleFileChange}
                    disabled={isProcessing}
                />
                <button className="btn btn-primary" disabled={isProcessing}>
                    {isProcessing ? 'Conversion...' : 'Convertir'}
                </button>
            </form>

            {documentConverti && (
                <div className="card mt-4 p-4 border-success">
                    <h5>Conversion réussie</h5>
                    <button className="btn btn-success mt-3" onClick={handleDeposer}>
                        Continuer vers le dépôt
                    </button>
                </div>
            )}
        </div>
    );
};

export default NumeriserOeuvre;
