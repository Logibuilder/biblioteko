## diagrammes de classes

### Identification des classes

```mermaid
classDiagram
class User {
    +id: int
    +username: String
    +email: String
    +password: String
    +role: Role
}
%% Represents any user of the system (base class).

class Member {
    +encryptionKey: String
    +borrowHistory(): List<BorrowRecord>
    +submitWork()
    +borrowWork()
}
%% Represents a registered user who can submit, borrow, and view works.

class Librarian {
    +moderationRights: bool
    +moderateWork()
    +enrichMetadata()
    +validateWork()
}
%% Represents a member with additional privileges for moderation and work management.

User <|-- Member
User <|-- Librarian



# Diagramme de classes – Bibliothèque numérique décentralisée


%% ======================
%% CLASSES PRINCIPALES
%% ======================


%% représente un utilisateur de la plateforme, pouvant être lecteur, contributeur ou modérateur.

class Work {
    +id: int
    +title: String
    +status: WorkStatus
}
%% représente une œuvre numérique (livre, document, image, etc.) disponible dans la bibliothèque.

class WorkVersion {
    +id: int
    +versionNumber: int
    +fileHash: String
}
%% représente une version spécifique d’une œuvre (nouvelle édition ou correction d’un fichier).

class Metadata {
    +id: int
    +author: String
    +date: Date
    +keywords: List<String>
}
%% contient les métadonnées descriptives associées à une œuvre ou une version (titre, auteur, date, format, etc.).

class ModerationTicket {
    +id: int
    +status: String
    +createdAt: Date
}
%% représente une demande de modération ou un signalement sur une œuvre ou un utilisateur.

class ModerationNote {
    +id: int
    +content: String
    +createdAt: Date
}
%% contient les remarques ou décisions prises par un modérateur sur un ticket.

class BorrowRecord {
    +id: int
    +borrowDate: Date
    +returnDate: Date
}
%% enregistre les emprunts ou consultations d’une œuvre par un utilisateur (historique des accès).

%% ======================
%% SERVICES TECHNIQUES
%% ======================

class StorageService {
    <<interface>>
    +upload(file)
    +download(hash)
    +delete(hash)
}
%% définit les opérations de stockage et récupération des fichiers (upload, download, suppression).

class IPFSAdapter {
    +upload(file)
    +download(hash)
    +delete(hash)
}
%% implémente StorageService pour interagir avec le réseau IPFS (stockage décentralisé).

class GitRepositoryAdapter {
    +commit(metadata)
    +getHistory()
}
%% gère la version des métadonnées ou fichiers via un dépôt Git local ou distant (traçabilité et historique).

class WorkService {
    +createWork()
    +updateWork()
    +getWork()
}
%% gère la logique métier liée aux œuvres (création, mise à jour, association de métadonnées, versions, etc.).

class ModerationService {
    +createTicket()
    +addNote()
    +resolveTicket()
}
%% gère les processus de modération (création, attribution, suivi et clôture de tickets).

class OCRService {
    +extractText(file)
}
%% effectue la reconnaissance de texte (OCR) sur les œuvres scannées pour les rendre consultables et indexables.

%% ======================
%% CONTRÔLEURS (API REST)
%% ======================

class AuthController {
    +login()
    +register()
    +assignRole()
}
%% gère l’authentification, l’inscription et la gestion des rôles utilisateurs.

class WorkController {
    +createWork()
    +listWorks()
    +updateWork()
}
%% expose les routes API pour la création, la consultation, la mise à jour et la recherche d’œuvres.

%% ======================
%% ÉNUMÉRATIONS
%% ======================

class Role {
    <<enumeration>>
    USER
    CONTRIBUTOR
    MODERATOR
    ADMIN
}
%% définit les rôles possibles des utilisateurs.

class WorkStatus {
    <<enumeration>>
    DRAFT
    PUBLISHED
    UNDER_REVIEW
    ARCHIVED
}
%% représente l’état d’une œuvre.

%% ======================
%% RELATIONS
%% ======================

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
