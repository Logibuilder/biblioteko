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

        // Appel de la fonction du hook
        const success = await register(formData.email, formData.password, formData.nom);
        if (success) {
            console.log("Inscription réussie !");
            // La redirection sera gérée par le useEffect dans RegisterPage ou App
        }
    };

    return (
        <div className="card shadow-lg border-0">
            <div className="card-body p-5">
                <h2 className="text-center mb-4 text-primary">
                    <i className="bi bi-person-plus-fill me-2"></i>Créer un compte
                </h2>

                {(error || localError) && (
                    <div className="alert alert-danger">
                        {localError || error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Nom complet</label>
                        <input
                            type="text"
                            name="nom"
                            className="form-control"
                            value={formData.nom}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Adresse Email</label>
                        <input
                            type="email"
                            name="email"
                            className="form-control"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Mot de passe</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Confirmer</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                className="form-control"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="d-grid mt-4">
                        <button type="submit" className="btn btn-primary btn-lg" disabled={isLoading}>
                            {isLoading ? "Création en cours..." : "S'inscrire"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-3">
                    <p className="small">
                        Déjà membre ? <Link to="/login" className="fw-bold">Se connecter</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterForm;