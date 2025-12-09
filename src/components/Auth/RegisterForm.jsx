import React, { useState } from 'react';
import { useAuthContext } from '../../hooks/AuthContext';
import { Link } from 'react-router-dom';

const RegisterForm = () => {
    const { register, isLoading, error } = useAuthContext();
    
    const [formData, setFormData] = useState({
        nom: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [localError, setLocalError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');

        if (formData.password !== formData.confirmPassword) {
            setLocalError("Les mots de passe ne correspondent pas.");
            return;
        }

        const success = await register(formData.email, formData.password, formData.nom);
        if (success) {
            // Le hook gère la redirection
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className="col-12 col-md-8 col-lg-6" style={{ maxWidth: '600px' }}>
                <div className="text-center mb-4">
                    <h2 className="fw-bold text-dark">Rejoignez-nous</h2>
                    <p className="text-muted">Accédez à des milliers de ressources numériques.</p>
                </div>

                <div className="card shadow-lg border-0 overflow-hidden">
                    <div className="card-header bg-primary text-white text-center py-3 border-0">
                        <i className="bi bi-person-badge fs-1"></i>
                    </div>
                    <div className="card-body p-4 p-md-5">
                        
                        {(error || localError) && (
                            <div className="alert alert-danger small">
                                {localError || error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    name="nom"
                                    className="form-control"
                                    id="nom"
                                    placeholder="Nom"
                                    value={formData.nom}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="nom">Nom complet</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type="email"
                                    name="email"
                                    className="form-control"
                                    id="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                                <label htmlFor="email">Adresse Email</label>
                            </div>

                            <div className="row g-2 mb-4">
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            id="pwd"
                                            placeholder="Mot de passe"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="pwd">Mot de passe</label>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="form-floating">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            className="form-control"
                                            id="cpwd"
                                            placeholder="Confirmer"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                        />
                                        <label htmlFor="cpwd">Confirmer</label>
                                    </div>
                                </div>
                            </div>

                            <div className="d-grid">
                                <button type="submit" className="btn btn-primary py-3 fw-bold" disabled={isLoading}>
                                    {isLoading ? <div className="spinner-border spinner-border-sm"></div> : "Créer mon compte"}
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="card-footer bg-white border-0 text-center py-3">
                        <small className="text-muted">
                            Déjà membre ? <Link to="/login" className="fw-bold text-primary text-decoration-none">Se connecter</Link>
                        </small>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;
