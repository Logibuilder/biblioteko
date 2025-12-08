import React, { useState, useEffect } from 'react';
import { fetchOeuvresDisponibles, fetchMesEmprunts, emprunterOeuvre } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';
import MesEmprunts from './MesEmprunts'; // Import du nouveau composant

const EmprunterOeuvre = () => {
    const { user } = useAuthContext();
    const token = localStorage.getItem('token');

    // États "remontés" ici pour synchroniser les deux affichages
    const [disponibles, setDisponibles] = useState([]);
    const [mesEmprunts, setMesEmprunts] = useState([]);
    
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

    // Chargement initial
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const [disposData, empruntsData] = await Promise.all([
                    fetchOeuvresDisponibles(token),
                    fetchMesEmprunts(user.email, token)
                ]);
                setDisponibles(disposData);
                setMesEmprunts(empruntsData);
            } catch (err) {
                console.error("Erreur de chargement", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) loadData();
    }, [user, token]);

    const handleEmprunter = async (oeuvre) => {
        if (!window.confirm(`Confirmer l'emprunt de "${oeuvre.titre}" ?`)) return;

        try {
            const result = await emprunterOeuvre(oeuvre.id, user.email, token);
            setMessage(`✅ ${result.message}`);

            // Mise à jour des états locaux pour rafraîchir l'interface immédiatement
            setMesEmprunts([...mesEmprunts, result.emprunt]);
            setDisponibles(disponibles.filter(o => o.id !== oeuvre.id));

            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    };

    if (isLoading) return <div className="text-center p-4">Chargement...</div>;

    return (
        <div className="container-fluid mt-3">
            {message && <div className="alert alert-success">{message}</div>}

            <div className="row">
                {/* COLONNE GAUCHE : Liste des œuvres disponibles */}
                <div className="col-md-8">
                    <div className="card shadow-sm mb-4">
                        <div className="card-header bg-primary text-white">
                            <h5 className="mb-0">📚 Œuvres Disponibles</h5>
                        </div>
                        <div className="card-body">
                            {disponibles.length === 0 ? (
                                <p className="text-muted">Aucune œuvre disponible.</p>
                            ) : (
                                <div className="list-group">
                                    {disponibles.map((oeuvre) => (
                                        <div key={oeuvre.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                <h6 className="mb-0 fw-bold">{oeuvre.titre}</h6>
                                                <small className="text-muted">par {oeuvre.auteur}</small>
                                            </div>
                                            <button 
                                                className="btn btn-outline-primary btn-sm"
                                                onClick={() => handleEmprunter(oeuvre)}
                                            >
                                                Emprunter
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* COLONNE DROITE : Appel du composant dédié aux emprunts */}
                <div className="col-md-4">
                    <MesEmprunts emprunts={mesEmprunts} />
                </div>
            </div>
        </div>
    );
};

export default EmprunterOeuvre;