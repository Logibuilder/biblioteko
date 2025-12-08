import React from 'react';

const MesEmprunts = ({ emprunts }) => {
    return (
        <div className="card shadow-sm bg-light">
            <div className="card-header bg-secondary text-white">
                <h5 className="mb-0">🎒 Mes Emprunts ({emprunts.length})</h5>
            </div>
            <div className="card-body p-2">
                {emprunts.length === 0 ? (
                    <p className="text-muted text-center mt-2">Vous n'avez aucun emprunt en cours.</p>
                ) : (
                    <ul className="list-group list-group-flush">
                        {emprunts.map((emprunt, index) => (
                            <li key={index} className="list-group-item bg-transparent">
                                <strong>{emprunt.titre}</strong>
                                <br/>
                                <small className="text-danger">
                                    À rendre le : {new Date(emprunt.dateRetour).toLocaleDateString()}
                                </small>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default MesEmprunts;