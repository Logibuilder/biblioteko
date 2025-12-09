import React, { useState, useEffect } from 'react';
import { fetchOeuvresDisponibles, fetchMesEmprunts, emprunterOeuvre } from '../../api/oeuvreApi';
import { useAuthContext } from '../../hooks/AuthContext';
import MesEmprunts from './MesEmprunts';

const EmprunterOeuvre = () => {
    const { user } = useAuthContext();
    const token = localStorage.getItem('token');

    const [disponibles, setDisponibles] = useState([]);
    const [mesEmprunts, setMesEmprunts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');

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
                console.error("Erreur", err);
            } finally {
                setIsLoading(false);
            }
        };
        if (user) loadData();
    }, [user, token]);

    const handleEmprunter = async (oeuvre) => {
        if (!window.confirm(`Emprunter "${oeuvre.titre}" ?`)) return;
        try {
            const result = await emprunterOeuvre(oeuvre.id, user.email, token);
            setMessage(`✅ ${result.message}`);
            setMesEmprunts([...mesEmprunts, result.emprunt]);
            setDisponibles(disponibles.filter(o => o.id !== oeuvre.id));
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            alert("Erreur : " + err.message);
        }
    };

    if (isLoading) return <div className="text-center p-5 text-primary"><div className="spinner-border"></div></div>;

    return (
        <div className="container-fluid">
            {/* Header Page */}
            <div className="mb-4">
                <h3 className="fw-bold text-dark mb-1">Bibliothèque</h3>
                <p className="text-muted">Parcourez le catalogue et empruntez vos prochaines lectures.</p>
            </div>

            {message && (
                <div className="alert alert-success shadow-sm border-0 d-flex align-items-center mb-4">
                    <i className="bi bi-check-circle-fill me-2 fs-5"></i>
                    {message}
                </div>
            )}

            <div className="row g-4">
                {/* GAUCHE : GRILLE DES ŒUVRES */}
                <div className="col-lg-8">
                    {disponibles.length === 0 ? (
                        <div className="alert alert-light border text-center py-5">
                            <i className="bi bi-emoji-frown fs-1 text-muted mb-2 d-block"></i>
                            Aucune œuvre disponible pour le moment.
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 g-3">
                            {disponibles.map((oeuvre) => (
                                <div key={oeuvre.id} className="col">
                                    <div className="card h-100 shadow-sm hover-shadow border-0">
                                        <div className="card-body d-flex flex-column">
                                            <div className="d-flex justify-content-between align-items-start mb-3">
                                                <div className="bg-primary bg-opacity-10 text-primary rounded p-3">
                                                    <i className="bi bi-book-half fs-4"></i>
                                                </div>
                                                {oeuvre.isGratuit && (
                                                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 rounded-pill">
                                                        Gratuit
                                                    </span>
                                                )}
                                            </div>
                                            
                                            <h5 className="card-title fw-bold text-dark mb-1">{oeuvre.titre}</h5>
                                            <p className="card-text text-muted small mb-4">par {oeuvre.auteur}</p>
                                            
                                            <div className="mt-auto pt-3 border-top">
                                                <button 
                                                    className="btn btn-outline-primary w-100 rounded-pill fw-semibold"
                                                    onClick={() => handleEmprunter(oeuvre)}
                                                >
                                                    <i className="bi bi-plus-circle me-2"></i>Emprunter
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* DROITE : SIDEBAR MON CARTABLE */}
                <div className="col-lg-4">
                    <div className="sticky-top" style={{ top: '90px', zIndex: 1 }}>
                        <MesEmprunts emprunts={mesEmprunts} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmprunterOeuvre;