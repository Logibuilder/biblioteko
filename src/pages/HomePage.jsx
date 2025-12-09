import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../hooks/AuthContext';

const HomePage = () => {
    const { user } = useAuthContext();

    return (
        <div className="d-flex flex-column min-vh-100 bg-white">
            
            {/* --- NAVBAR SIMPLE --- */}
            <nav className="navbar navbar-expand-lg py-3 sticky-top bg-white border-bottom">
                <div className="container">
                    <span className="navbar-brand fw-bold text-primary d-flex align-items-center">
                        <i className="bi bi-book-half me-2 fs-4"></i>
                        <span>Biblioteko</span>
                    </span>
                    <div>
                        {user ? (
                            <Link to="/dashboard" className="btn btn-outline-primary rounded-pill px-4 fw-bold">
                                Mon Tableau de bord
                            </Link>
                        ) : (
                            <div className="d-flex gap-2">
                                <Link to="/login" className="btn btn-link text-decoration-none text-secondary fw-bold">
                                    Se connecter
                                </Link>
                                <Link to="/register" className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm">
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <header className="py-5 mb-5 bg-light" style={{background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'}}>
                <div className="container py-5">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <div className="badge bg-primary bg-opacity-10 text-primary mb-3 px-3 py-2 rounded-pill fs-5">
                                Association CultureDiffusion
                            </div>
                            <h1 className="display-4 fw-bold text-dark mb-3">
                                La Bibliothèque Numérique <span className="text-primary">Décentralisée</span>.
                            </h1>
                            <p className="lead text-muted mb-4">
                                Partagez, numérisez et empruntez des œuvres en toute liberté. 
                                Une plateforme communautaire garantissant la préservation du patrimoine et le respect des droits.
                            </p>
                            <div className="d-flex gap-3">
                                <Link to="/register" className="btn btn-primary btn-lg rounded-pill px-5 fw-bold shadow">
                                    Rejoindre
                                </Link>
                                <a href="#fonctionnalites" className="btn btn-outline-dark btn-lg rounded-pill px-4">
                                    En savoir plus
                                </a>
                            </div>
                        </div>
                        <div className="col-lg-6 text-center">
                            {/* Illustration symbolique avec des icônes */}
                            <div className="position-relative d-inline-block">
                                <div className="bg-white p-4 rounded-4 shadow-lg" style={{transform: 'rotate(-3deg)'}}>
                                    <i className="bi bi-file-earmark-pdf fs-1 text-danger"></i>
                                    <div className="small fw-bold mt-2">PDF</div>
                                </div>
                                <div className="bg-primary p-4 rounded-4 shadow-lg text-white position-absolute top-50 start-100 translate-middle" style={{zIndex: 2}}>
                                    <i className="bi bi-robot fs-1"></i>
                                    <div className="small fw-bold mt-2">IA OCR</div>
                                </div>
                                <div className="bg-dark p-4 rounded-4 shadow-lg text-white position-absolute top-0 start-0 translate-middle" style={{transform: 'rotate(5deg)'}}>
                                    <i className="bi bi-git fs-1"></i>
                                    <div className="small fw-bold mt-2">GIT</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* --- FONCTIONNALITÉS CLÉS (Inspiré du Cahier des Charges) --- */}
            <section id="fonctionnalites" className="py-5">
                <div className="container">
                    <div className="text-center mb-5">
                        <h2 className="fw-bold">Architecture & Services</h2>
                        <p className="text-muted">Conçu selon les principes de l'Agile Unified Process.</p>
                    </div>

                    <div className="row g-4">
                        {/* Carte 1 */}
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-3 hover-shadow transition">
                                <div className="card-body">
                                    <div className="bg-success bg-opacity-10 text-success rounded-circle d-inline-flex p-3 mb-3">
                                        <i className="bi bi-magic fs-3"></i>
                                    </div>
                                    <h4 className="fw-bold">Numérisation IA</h4>
                                    <p className="text-muted small">
                                        Transformez vos scans PDF en texte exploitable (Markdown) grâce à la puissance des modèles Gemini et Pixtral.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Carte 2 */}
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-3 hover-shadow transition">
                                <div className="card-body">
                                    <div className="bg-warning bg-opacity-10 text-warning rounded-circle d-inline-flex p-3 mb-3">
                                        <i className="bi bi-shield-lock fs-3"></i>
                                    </div>
                                    <h4 className="fw-bold">Droits & Séquestre</h4>
                                    <p className="text-muted small">
                                        Gestion rigoureuse des œuvres sous droits. Système de prêt temporaire (2 semaines) chiffré via le dépôt Git.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Carte 3 */}
                        <div className="col-md-4">
                            <div className="card h-100 border-0 shadow-sm p-3 hover-shadow transition">
                                <div className="card-body">
                                    <div className="bg-info bg-opacity-10 text-info rounded-circle d-inline-flex p-3 mb-3">
                                        <i className="bi bi-people fs-3"></i>
                                    </div>
                                    <h4 className="fw-bold">Modération Humaine</h4>
                                    <p className="text-muted small">
                                        Des bibliothécaires valident, enrichissent et classent les contributions avant leur publication dans le Fond Commun.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="mt-auto py-4 bg-dark text-white-50">
                <div className="container text-center">
                    <small>
                        &copy; 2025 CultureDiffusion - Projet Pédagogique Architecture Logicielle.<br/>
                        Développé avec React & Bootstrap.
                    </small>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;