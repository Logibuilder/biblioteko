// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/AuthContext';
import { Link } from 'react-router-dom';

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthContext(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return;
        await login(email, password);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-md-5 col-lg-4">
                <div className="text-center mb-4">
                    <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow" style={{width: '64px', height: '64px'}}>
                        <i className="bi bi-book-half fs-2"></i>
                    </div>
                    <h3 className="fw-bold text-dark">Bon retour !</h3>
                    <p className="text-muted">Connectez-vous à votre espace membre.</p>
                </div>

                <div className="card shadow-lg border-0 p-2">
                    <div className="card-body">
                        {error && (
                            <div className="alert alert-danger d-flex align-items-center" role="alert">
                                <i className="bi bi-exclamation-circle-fill me-2"></i>
                                <div>{error}</div>
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <label htmlFor="email">Adresse Email</label>
                            </div>
                            
                            <div className="form-floating mb-3">
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    placeholder="Mot de passe"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <label htmlFor="password">Mot de passe</label>
                            </div>
                            
                            <div className="d-grid mt-4">
                                <button type="submit" className="btn btn-primary py-3 fw-bold" disabled={isLoading}>
                                    {isLoading ? <div className="spinner-border spinner-border-sm"></div> : "Se connecter"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer bg-white border-0 text-center py-3">
                        <small className="text-muted">Pas encore de compte ? <Link to="/register" className="fw-bold text-primary text-decoration-none">Créer un compte</Link></small>
                    </div>
                </div>
                
                {/* Info Test Discrète */}
                <div className="text-center mt-4 text-muted opacity-50 small">
                    Comptes démo : membre@biblio.com / biblio@biblio.com (password)
                </div>
            </div>
        </div>
    );
};

export default LoginForm;