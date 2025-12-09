import React from 'react';

const MesEmprunts = ({ emprunts }) => {
    return (
        <div className="card shadow-sm h-100">
            <div className="card-header bg-white border-0 pt-4 pb-2">
                <h5 className="mb-0 text-primary fw-bold d-flex align-items-center">
                    <i className="bi bi-backpack2 me-2 fs-4"></i>
                    Mon Cartable
                    <span className="badge bg-primary bg-opacity-10 text-primary ms-auto rounded-pill fs-6">
                        {emprunts.length}
                    </span>
                </h5>
            </div>
            <div className="card-body p-0">
                {emprunts.length === 0 ? (
                    <div className="text-center py-5 px-3">
                        <div className="bg-light rounded-circle d-inline-flex p-3 mb-3 text-secondary">
                            <i className="bi bi-book fs-1 opacity-50"></i>
                        </div>
                        <p className="text-muted small mb-0">Vous n'avez aucun emprunt en cours.</p>
                    </div>
                ) : (
                    <div className="list-group list-group-flush">
                        {emprunts.map((emprunt, index) => (
                            <div key={index} className="list-group-item border-0 border-bottom py-3 px-4">
                                <div className="d-flex align-items-start">
                                    <div className="me-3 mt-1 text-primary">
                                        <i className="bi bi-journal-bookmark-fill fs-5"></i>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h6 className="mb-1 fw-bold text-dark">{emprunt.titre}</h6>
                                        <div className="d-flex align-items-center mt-2">
                                            <i className="bi bi-clock-history text-danger me-2 small"></i>
                                            <small className="text-danger fw-semibold" style={{fontSize: '0.85rem'}}>
                                                Retour : {new Date(emprunt.dateRetour).toLocaleDateString()}
                                            </small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            {emprunts.length > 0 && (
                <div className="card-footer bg-light border-0 text-center py-3">
                    <small className="text-muted">Pensez à rendre vos livres à temps !</small>
                </div>
            )}
        </div>
    );
};

export default MesEmprunts;