import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/AuthContext'; 

const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, isLoading, error } = useAuthContext(); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email || !password) {
            console.error("Veuillez remplir tous les champs."); 
            return;
        }

        const success = await login(email, password);
        if (success) {
            console.log("Connexion réussie !"); 
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center mt-5">
                <div className="col-md-6 col-lg-5">
                    <div className="card shadow-lg">
                        <div className="card-body p-4">
                            <h2 className="card-title text-center mb-4">
                                <i className="bi bi-book-fill text-success me-2"></i>
                                Connexion à la Bibliothèque
                            </h2>
                            
                            {error && (
                                <div className="alert alert-danger" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                    {error}
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label fw-bold">
                                        <i className="bi bi-envelope me-2"></i>
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="membre@biblio.com"
                                        required
                                    />
                                </div>
                                
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label fw-bold">
                                        <i className="bi bi-lock me-2"></i>
                                        Mot de passe
                                    </label>
                                    <input
                                        type="password"
                                        className="form-control"
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        required
                                    />
                                </div>
                                
                                <div className="d-grid">
                                    <button 
                                        type="submit" 
                                        className="btn btn-success btn-lg"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Connexion en cours...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-box-arrow-in-right me-2"></i>
                                                Se connecter
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>

                            <div className="mt-3 text-center">
                                <small className="text-muted">
                                    <strong>Comptes de test :</strong><br/>
                                    <span className="badge bg-info text-dark me-2">membre@biblio.com</span>
                                    <span className="badge bg-warning text-dark">biblio@biblio.com</span>
                                    <br/>
                                    <span className="text-secondary">Mot de passe : password</span>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginForm;