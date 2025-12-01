import React, { useState } from 'react';
import { soumettreOeuvre } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';

/**
 * Form allowing a Member to submit a digital file (PDF, MD, etc.)
 * and its metadata for moderation.
 */
const ProposerOeuvreForm = () => {
    // Access global user context
    const { user } = useAuthContext();
    const token = localStorage.getItem('token'); 

    // Form states
    const [titre, setTitre] = useState('');
    const [auteur, setAuteur] = useState('');
    const [fichier, setFichier] = useState(null);
    
    // API interaction states
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Role check (safety measure)
    if (!user || user.role !== 'membre') {
        return <p style={{ color: 'orange' }}>Only members are allowed to submit works.</p>;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!titre || !fichier) {
            setError("Title and file (PDF/MD) are mandatory.");
            return;
        }

        setIsLoading(true);
        setMessage('');
        setError(null);

        try {
            // CRITICAL: Creating FormData object for file upload
            const formData = new FormData();
            formData.append('titre', titre);
            formData.append('auteur', auteur);
            formData.append('fichier', fichier); 
            formData.append('soumisPar', user.email);
            formData.append('token', token); 

            // Call to the simulated API (ControleurDepot)
            const result = await soumettreOeuvre(formData, token);
            
            setMessage(result.message);
            
            // Reset form on success
            setTitre('');
            setAuteur('');
            setFichier(null);

        } catch (err) {
            setError(err.message || "Error during work submission.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '20px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <h2>📚 Proposer une Œuvre à la Communauté</h2>
            <p style={{ color: '#666', marginBottom: '20px' }}>Your submission will be placed in the repository **`a_moderer`** awaiting librarian validation (Git infrastructure).</p>

            {error && <p style={{ color: 'red', fontWeight: 'bold' }}>❌ {error}</p>}
            {message && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ {message}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '15px' }}>
                
                {/* Champ Titre */}
                <div>
                    <label htmlFor="titre" style={labelStyle}>Titre de l'œuvre *</label>
                    <input
                        type="text"
                        id="titre"
                        value={titre}
                        onChange={(e) => setTitre(e.target.value)}
                        disabled={isLoading}
                        style={inputStyle}
                        required
                    />
                </div>

                {/* Champ Auteur */}
                <div>
                    <label htmlFor="auteur" style={labelStyle}>Nom(s) de l'auteur(s)</label>
                    <input
                        type="text"
                        id="auteur"
                        value={auteur}
                        onChange={(e) => setAuteur(e.target.value)}
                        disabled={isLoading}
                        style={inputStyle}
                    />
                </div>

                {/* Champ Fichier */}
                <div>
                    <label htmlFor="fichier" style={labelStyle}>Fichier Numérique (PDF ou MD) *</label>
                    <input
                        type="file"
                        id="fichier"
                        onChange={(e) => setFichier(e.target.files[0])}
                        disabled={isLoading}
                        style={{ ...inputStyle, border: 'none', padding: '10px 0' }}
                        required
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={isLoading} 
                    style={{ 
                        padding: '12px 20px', 
                        backgroundColor: isLoading ? '#aaa' : '#007bff', 
                        color: 'white', 
                        border: 'none', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        fontSize: '1em'
                    }}
                >
                    {isLoading ? 'Envoi en cours...' : 'Soumettre pour Modération'}
                </button>
            </form>
        </div>
    );
};

const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold' };
const inputStyle = { width: '100%', padding: '10px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px' };

export default ProposerOeuvreForm;