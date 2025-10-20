# Diagrammes de classes – Bibliothèque numérique décentralisée

```mermaid
classDiagram
%% ====================================================
%% UTILISATEURS
%% ====================================================
class User {
    +id: int
    +username: String
    +email: String
    +password: String
    +role: Role
}
%% Utilisateur général du système

class Member {
    +encryptionKey: String
    +borrowHistory(): List<BorrowRecord>
    +submitWork()
    +borrowWork()
}
%% Utilisateur inscrit pouvant emprunter et soumettre des œuvres

class Librarian {
    +moderationRights: bool
    +moderateWork()
    +enrichMetadata()
    +validateWork()
}
%% Membre avec droits supplémentaires pour modération et validation

User <|-- Member
Member <|-- Librarian

%% ====================================================
%% ŒUVRES ET MÉTADONNÉES
%% ====================================================
class Work {
    +id: int
    +title: String
    +status: WorkStatus
}
%% Œuvre numérique disponible dans la bibliothèque

class WorkVersion {
    +id: int
    +versionNumber: int
    +fileHash: String
}
%% Version spécifique d’une œuvre

class Metadata {
    +id: int
    +author: String
    +date: Date
    +keywords: List<String>
}
%% Métadonnées descriptives d’une œuvre

class ModerationTicket {
    +id: int
    +status: String
    +createdAt: Date
}
%% Ticket de modération pour une œuvre ou un utilisateur

class ModerationNote {
    +id: int
    +content: String
    +createdAt: Date
}
%% Remarques ou décisions d’un modérateur sur un ticket

class BorrowRecord {
    +id: int
    +borrowDate: Date
    +returnDate: Date
}
%% Historique des emprunts ou consultations

%% ====================================================
%% SERVICES TECHNIQUES
%% ====================================================
class StorageService {
    <<interface>>
    +upload(file)
    +download(hash)
    +delete(hash)
}
%% Interface de stockage des fichiers

class IPFSAdapter {
    +upload(file)
    +download(hash)
    +delete(hash)
}
%% Implémente StorageService avec IPFS (stockage décentralisé)

class GitRepositoryAdapter {
    +commit(metadata)
    +getHistory()
}
%% Gestion des versions via Git

class WorkService {
    +createWork()
    +updateWork()
    +getWork()
}
%% Logique métier des œuvres

class ModerationService {
    +createTicket()
    +addNote()
    +resolveTicket()
}
%% Gestion des processus de modération

class OCRService {
    +extractText(file)
}
%% Reconnaissance de texte des scans

%% ====================================================
%% CONTRÔLEURS
%% ====================================================
class AuthController {
    +login()
    +register()
    +assignRole()
}
%% Gestion de l’authentification et des rôles

class WorkController {
    +createWork()
    +listWorks()
    +updateWork()
}
%% Routes API pour les œuvres

%% ====================================================
%% ENUMS
%% ====================================================
class Role {
    <<enumeration>>
    USER
    CONTRIBUTOR
    MODERATOR
    ADMIN
}
%% Rôles utilisateurs

class WorkStatus {
    <<enumeration>>
    DRAFT
    PUBLISHED
    UNDER_REVIEW
    ARCHIVED
}
%% Statut d’une œuvre

%% ====================================================
%% RELATIONS
%% ====================================================
User "1" --> "*" BorrowRecord
User "1" --> "*" Work
Work "1" --> "*" WorkVersion
Work "1" --> "1" Metadata
WorkVersion "1" --> "*" ModerationTicket
ModerationTicket "1" --> "*" ModerationNote
WorkService --> Work
WorkController --> WorkService
AuthController --> User
IPFSAdapter ..|> StorageService
