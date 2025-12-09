// src/components/layouts/DashboardLayout.jsx
import React from 'react';
import { Outlet, NavLink, Navigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../../hooks/AuthContext";
import LogoutButton from "../Auth/LogoutButton";

const DashboardLayout = () => {
    const { user } = useAuthContext();
    const location = useLocation();

    if (!user) return <Navigate to="/login" replace />;
    const isBibliothecaire = user.role === 'bibliothecaire';

    // Redirection par défaut (comme vu précédemment)
    if (location.pathname === '/dashboard') {
        return <Navigate to={isBibliothecaire ? "/dashboard/moderer" : "/dashboard/emprunter"} replace />;
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            
            {/* --- 1. NAVBAR (Bleu & Blanc) --- */}
            <nav className="navbar navbar-expand-lg sticky-top shadow-sm" style={{ backgroundColor: '#fff', borderBottom: '1px solid #eaeaea' }}>
                <div className="container">
                    <span className="navbar-brand fw-bold text-primary d-flex align-items-center">
                        <i className="bi bi-book-half me-2 fs-4"></i>
                        <span>Biblioteko</span>
                    </span>

                    <div className="d-flex align-items-center">
                        <div className="me-3 text-end d-none d-md-block">
                            <div className="fw-bold text-dark" style={{fontSize: '0.9rem'}}>{user.email}</div>
                            <div className="badge bg-primary bg-opacity-10 text-primary" style={{fontSize: '0.7rem'}}>
                                {user.role.toUpperCase()}
                            </div>
                        </div>
                        <LogoutButton />
                    </div>
                </div>
            </nav>

            {/* --- 2. SOUS-NAVIGATION (Pills modernes) --- */}
            <div className="bg-white border-bottom py-3 mb-4">
                <div className="container">
                    <ul className="nav nav-pills justify-content-center">
                        {!isBibliothecaire ? (
                            <>
                                <NavItem to="/dashboard/emprunter" icon="bi-collection" label="Emprunter" />
                                <NavItem to="/dashboard/numeriser" icon="bi-magic" label="Numériser" />
                                <NavItem to="/dashboard/proposer" icon="bi-pencil-square" label="Proposer" />
                            </>
                        ) : (
                            <>
                                <NavItem to="/dashboard/moderer" icon="bi-shield-check" label="Modération" />
                                <NavItem to="/dashboard/retours" icon="bi-calendar-event" label="Retours" />
                            </>
                        )}
                    </ul>
                </div>
            </div>

            {/* --- 3. CONTENU --- */}
            <div className="container flex-grow-1 pb-5">
                <div className="fade-in-up"> {/* Animation css optionnelle */}
                    <Outlet />
                </div>
            </div>

            {/* --- 4. FOOTER SIMPLE --- */}
            <footer className="text-center py-4 text-muted small mt-auto">
                © 2025 Biblioteko - Gestion Décentralisée
            </footer>
        </div>
    );
};

// Petit composant utilitaire pour les liens
const NavItem = ({ to, icon, label }) => (
    <li className="nav-item mx-1">
        <NavLink 
            to={to} 
            className={({ isActive }) => 
                `nav-link px-4 d-flex align-items-center gap-2 ${isActive ? 'active shadow-sm fw-bold' : 'text-secondary'}`
            }
            style={{ borderRadius: '50px' }} // Forme de "pilule"
        >
            <i className={`bi ${icon}`}></i> {label}
        </NavLink>
    </li>
);

export default DashboardLayout;