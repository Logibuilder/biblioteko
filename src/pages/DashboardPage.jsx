import React from 'react';
import { useAuthContext } from '../hooks/AuthContext';
import LogoutButton from '../components/Auth/LogoutButton';
import ProposerOeuvreForm from '../components/soumission/ProposerOeuvreForm';
// Assurez-vous que ce chemin est correct :
// import OeuvreAModererList from '../components/Moderation/OeuvreAModererList'; 

const DashboardPage = () => {
    // Récupération de l'utilisateur connecté via le contexte global
    const { user } = useAuthContext();

    if (!user) {
        // Cas où l'utilisateur n'est pas encore chargé (ou déconnecté)
        return <div>Chargement du tableau de bord...</div>;
    }
    
    // Détermination du rôle pour l'affichage conditionnel
    const isBibliothecaire = user.role === 'bibliothecaire';

    return (
        <div style={{ padding: '20px' }}>
            <h1>🚀 Tableau de Bord</h1>
            <p>Connecté(e) en tant que : <strong>{user.email}</strong> (Rôle: **{user.role.toUpperCase()}**)</p>
            <br/>

            {/* Affichage pour le Bibliothécaire */}
            {isBibliothecaire && (
                <>
                    <h2>Espace Modération et Gestion</h2>
                    {/* Le composant qui appelle l'API pour les œuvres à modérer */}
                    {/* <OeuvreAModererList />  */}
                </>
            )}

            {/* Affichage pour le Membre standard */}
            {!isBibliothecaire && (
                <>
                    <h2>Espace Membre</h2>
                    <p>Bienvenue sur votre espace. Vous pouvez **Proposer une nouvelle œuvre** ou consulter vos emprunts.</p>
                </>
            )}

            {/* 2. AFFICHAGE CONDITIONNEL POUR LE MEMBRE STANDARD */}
            {!isBibliothecaire && (
                <>
                    <h2>Espace Membre : Proposer un Titre</h2>
                    {/* Le Membre standard voit le formulaire de soumission */}
                    <ProposerOeuvreForm />
                </>
            )}

            <hr style={{ margin: '30px 0' }}/>
            <LogoutButton />
        </div>
    );
};

export default DashboardPage;