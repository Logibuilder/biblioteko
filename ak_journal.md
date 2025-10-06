# Journal de Projet

## Informations générales
- **Projet :** BIBLIOTÉCO 
- **Étudiant :** Assane KANE  
- **Période :** Octobre 2025  
- **Technologies utilisées :** 

---

## Objectifs du projet

---

## Journal de développement

### 🗓️ Semaine 1 06/10/2025– (RÉALISATION DES SCÉNARIO)
-  réalisation du scénario devenir membre
-  réalisation du scénario devenir bibliothécaire
-  réalisation du scénario numériser une oeuvre (à finir)
  


**Difficultés rencontrées :** comprendre toutes les contraintes entre enseignants et salles.  
**Solutions apportées :** réunion avec l’équipe pour redéfinir les règles de priorité.

---

### 🗓️ Semaine 2 – Conception du modèle et base de données
- Définition du modèle relationnel dans PostgreSQL.  
- Création des entités JPA : `Professeur`, `Salle`, `Cours`, `EmploiDuTemps`.  
- Configuration de la connexion à la base dans `application.properties`.  
- Ajout de données de test (Laurent, Sophie, Agathe).  

**Difficultés rencontrées :** mapping entre les entités et la base de données.  
**Solutions :** utilisation d’annotations JPA (`@OneToMany`, `@ManyToOne`).

---

### 🗓️ Semaine 3 – Développement du backend
- Implémentation des services pour gérer les professeurs et les salles.  
- Création des contrôleurs REST pour accéder aux données.  
- Mise en place de tests unitaires avec **JUnit 4**.  

**Difficultés rencontrées :** erreurs de dépendances entre les couches `service` et `controller`.  
**Solutions :** utilisation de **Lombok** et refactorisation du code.

---

### 🗓️ Semaine 4 – Algorithme d’optimisation
- Implémentation de l’algorithme de génération automatique de l’emploi du temps.  
- Test de plusieurs stratégies (gloutonne, par priorité).  
- Validation des contraintes de disponibilité et de type de salle.  

**Difficultés rencontrées :** performances et conflits horaires.  
**Solutions :** ajout d’une phase de vérification avant l’insertion en base.

---

### 🗓️ Semaine 5 – Interface utilisateur et finalisation
- Création de l’interface web avec **Thymeleaf**.  
- Intégration du backend avec le frontend.  
- Tests complets de bout en bout.  
- Rédaction du rapport final et préparation de la soutenance.  

**Difficultés rencontrées :** synchronisation des mises à jour entre le backend et l’affichage.  
**Solutions :** rechargement automatique via Spring Boot DevTools.

---

## Bilan du projet
- ✅ Application fonctionnelle et robuste.  
- ✅ Respect des contraintes principales.  
- 💡 Pistes d’amélioration : optimisation de l’algorithme, ajout d’une interface React.

---

## Annexes
- [Diagramme UML](./uml/diagramme_classes.png)  
- [Script SQL](./database/schema.sql)  
- [Code source principal](./src/main/java/com/projet/emploi)  

---

_Fichier mis à jour le : 06 octobre 2025_

