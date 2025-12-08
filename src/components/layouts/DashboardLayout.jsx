import React from 'react';
import { Outlet, NavLink, Navigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/AuthContext";
import LogoutButton from "../Auth/LogoutButton";
const DashboardLayout = () => {
    const { user, isAuthenticated, logout } = useAuthContext();

    // Sécurité : Si l'utilisateur force l'URL sans être connecté
    if (!user) return <Navigate to="/login" replace />;

    const isBibliothecaire = user.role === 'bibliothecaire';

    return (
        <div className="container py-4">
            {/* --- HEADER COMMUN --- */}
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <div>
                    <h1 className="h2 mb-0">🚀 Tableau de Bord</h1>
                    <small className="text-muted">
                        Connecté en tant que <strong>{user.email}</strong> 
                        <span className="badge bg-secondary ms-2">{user.role.toUpperCase()}</span>
                    </small>
                </div>
                <LogoutButton />
            </div>

            {/* --- NAVIGATION (Onglets transformés en Liens) --- */}
            {/* On utilise NavLink qui gère automatiquement la classe 'active' */}
            {!isBibliothecaire && (
                <ul className="nav nav-tabs mb-4">
                    <li className="nav-item">
                        <NavLink 
                            to="/dashboard/emprunter" 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            📚 Emprunter
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/dashboard/numeriser" 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            ⚡ Numériser (OCR)
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink 
                            to="/dashboard/proposer" 
                            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                        >
                            ✍️ Proposer
                        </NavLink>
                    </li>
                </ul>
            )}

            {isBibliothecaire && (
                <div className="alert alert-warning mb-4">
                    Mode Bibliothécaire activé (Navigation spécifique à venir)
                </div>
            )}

            {/* --- ZONE DE CONTENU VARIABLE --- */}
            {/* C'est ici que s'afficheront EmprunterOeuvreList, NumeriserOeuvre, etc. */}
            <div className="bg-white p-3 border rounded shadow-sm" style={{ minHeight: '400px' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default DashboardLayout;