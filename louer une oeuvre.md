# Louer une œuvre

**Description** : Un membre loue une œuvre sous droits pour une période de 2 semaines.

**Acteurs** : Membre, Système

**Prérequis** : 
- Être authentifié en tant que membre
- L'œuvre doit être disponible

**Étapes** :

1. Le membre consulte le catalogue des œuvres depuis son interface
2. Le membre sélectionne une œuvre sous droits disponible(si préciser dans l'interface) à la location
3. L'application affiche les conditions de location (durée : 2 semaines)
4. Le membre confirme sa demande de location
5. L'application vérifie la disponibilité de l'œuvre dans le séquestre
6. Le système génère une copie chiffrée avec la clé du membre
7. L'application déplace l'œuvre chiffrée vers le répertoire "emprunts"
8. Le système enregistre la transaction avec date de début et date d'expiration (14 jours)
9. L'application notifie le membre du succès de l'opération(message affiché) 
10. Le membre peut accéder à l'œuvre chiffrée depuis son espace personnel pendant la durée de location

**États d'une location** :
- Disponible → En cours de location → Active → Expirée

**Scénarios alternatifs** :
- Si l'œuvre n'est pas disponible, le système dit que l'oeuvre n'est pas disponible.
- Si le membre annule avant confirmation, retour au catalogue

**Scénarios erreurs** :

**Données, documents, écrans** :
- Page de catalogue des œuvres
- Modal de confirmation de location
- Page "Mes locations" avec compte à rebours
- Fichier chiffré dans le répertoire "emprunts"
- Métadonnées : date début, date fin, identifiant œuvre, identifiant membre
