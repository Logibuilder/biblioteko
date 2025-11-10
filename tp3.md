# TP 3: Les propriétés NP, les réductions polynomiales

**Master 1 d'Informatique** | 2023-2024
**FST- Département Informatique**

---

## Objectif

[cite_start]Le but de ce TP est de "concrétiser" les notions de propriété NP et de réduction polynomiale[cite: 6].

[cite_start]Ce rapport, accompagné d'une archive contenant le code, présente les réponses aux questions posées et détaille les choix d'implémentation[cite: 8].

---

## 1. Qu'est-ce qu'une propriété NP?

[cite_start]Cette section se concentre sur le problème de la mise en sachets[cite: 11].

> **Problème: BinPack**
>
> * **Donnée:**
>     [cite_start]* `n` : un nombre d'objets [cite: 17]
>     [cite_start]* $x_{1},\cdot\cdot\cdot,x_{n}$ : `n` entiers, les poids des objets [cite: 18]
>     [cite_start]* `c` : la capacité d'un sac (entière) [cite: 19]
>     [cite_start]* `k` : le nombre de sacs [cite: 20]
> * **Sortie:**
>     [cite_start]* **Oui**, s'il existe une mise en sachets possible, c'est-à-dire une affectation $aff:[1..n]\rightarrow[1..k]$ telle que pour tout sac `j` ($1\le j\le k$), la somme des poids des objets affectés à ce sac est inférieure ou égale à `c` ($\sum_{i/aff(i)=j}x_{i}\le c$) [cite: 22-24].
>     * **Non**, sinon.

---

### Q 1. La propriété est NP

> **Rappel de Définition (NP):** Une propriété L est dite NP s'il existe un polynôme Q et un algorithme polynomial A à deux entrées tels que :
> [cite_start]$L=\{u/\exists c,A(c,u)=Vrai,|c|\le Q(|u|)\}$ [cite: 31]

**Q : Définir une notion de certificat.**

**Réponse :**
Un certificat `c` est une "preuve" qu'une instance `u` (ici, $u = (n, x, c, k)$) a une solution "Oui". [cite_start]Pour BinPack, un certificat est simplement **l'affectation de chaque objet à un sac**[cite: 23].

**Q : Comment pensez-vous l'implémenter?**

**Réponse :**
[cite_start]Un certificat peut être implémenté comme un **tableau (ou une liste) `aff` de taille `n`** (le nombre d'objets)[cite: 23].
Pour chaque objet `i` (de 1 à `n`), `aff[i]` contiendra un entier `j` (de 1 à `k`), indiquant que l'objet `i` est placé dans le sac `j`.

**Q : Quelle sera la taille d'un certificat? La taille des certificats est-elle bien bornée polynomialement par rapport à la taille de l'entrée?**

**Réponse :**
* **Taille d'un certificat :** Le tableau `aff` contient `n` entiers. Chaque entier `j` est compris entre 1 et `k`. Pour stocker un nombre `j` (jusqu'à `k`), il faut $O(\log k)$ bits. La taille totale du certificat est donc $O(n \log k)$ bits.
* **Taille de l'entrée :** La taille de l'entrée $|u|$ est la place nécessaire pour écrire les `n` poids $x_i$, la capacité `c` et le nombre de sacs `k`. En supposant que les poids sont codés en binaire, $|u| \approx O(n \log(\max(x_i)) + \log c + \log k)$.
* **Bornée polynomialement :** Oui. [cite_start]La taille du certificat $O(n \log k)$ est clairement polynomiale (et même linéaire) par rapport à la taille de l'entrée $|u|$[cite: 34].

**Q : Proposez un algorithme de vérification associé. Est-il bien polynomial?**

**Réponse :**
L'algorithme de vérification `A(certificat, instance)` prend le certificat `aff` et l'instance $(n, x, c, k)$ et retourne Vrai si `aff` est une solution valide.

1.  Créer un tableau `poids_sacs` de taille `k`, initialisé à zéro. Ce tableau suivra le poids total de chaque sac.
2.  **Parcourir les objets** (pour `i` de 1 à `n`) :
    a.  Récupérer le numéro de sac assigné : `j = aff[i]`.
    b.  Vérifier si `j` est un numéro de sac valide (si $1 \le j \le k$). Si non, retourner `Faux` (certificat mal formé).
    c.  Ajouter le poids de l'objet au sac : `poids_sacs[j] = poids_sacs[j] + x[i]`.
3.  **Vérifier les capacités** (pour `j` de 1 à `k`) :
    a.  [cite_start]Si `poids_sacs[j] > c`, alors le sac `j` est surchargé[cite: 24]. Retourner `Faux`.
4.  Si la fin de la boucle est atteinte sans retourner `Faux`, cela signifie que tous les objets sont placés et qu'aucun sac n'est surchargé. Retourner `Vrai`.

**Polynomial?**
* L'étape 1 prend $O(k)$ temps.
* L'étape 2 (boucle) s'exécute `n` fois. Chaque itération est en $O(1)$. Total : $O(n)$.
* L'étape 3 (boucle) s'exécute `k` fois. Chaque itération est en $O(1)$. Total : $O(k)$.
* La complexité totale est $O(n + k)$. [cite_start]C'est bien un algorithme **polynomial** par rapport à la taille de l'entrée[cite: 35].

---

### Q 2. NP Non déterministe polynomial

**Q 2.1. Génération aléatoire d'un certificat**

**Q : Proposez un algorithme de génération aléatoire de certificat...**

**Réponse :**
[cite_start]L'algorithme prend en entrée `n` (nb d'objets) et `k` (nb de sacs)[cite: 38].

1.  Créer un tableau `aff` de taille `n`.
2.  Pour `i` de 1 à `n` (pour chaque objet) :
    a.  Générer un nombre entier aléatoire `j` uniformément dans l'intervalle $[1, k]$.
    b.  Assigner `aff[i] = j`.
3.  Retourner `aff`.

**Q : Votre algorithme génère-t-il de façon uniforme les certificats, i.e. tous les certificats ont-ils la même probabilité d'apparaître?**

**Réponse :**
**Oui**. Pour chaque objet `i`, il y a `k` choix possibles, et chaque choix est fait avec une probabilité de $1/k$. Les choix pour les `n` objets sont indépendants.
Il y a $k^n$ certificats possibles (voir Q 3.1).
La probabilité de générer un certificat spécifique $(j_1, j_2, ..., j_n)$ est le produit des probabilités individuelles :
$P(aff[1]=j_1) \times ... \times P(aff[n]=j_n) = (1/k) \times ... \times (1/k) = (1/k)^n$.
[cite_start]Puisque cette probabilité est la même pour toutes les $k^n$ combinaisons, la génération est bien **uniforme**[cite: 39].

**Q 2.2. Quel serait le schéma d'un algorithme non-déterministe polynomial pour le problème?**

**Réponse :**
Un algorithme non-déterministe (sur une machine de Turing non-déterministe) se déroule en deux phases :

1.  [cite_start]**Phase de "divination" (non-déterministe) :** L'algorithme "devine" un certificat[cite: 40]. Il génère (de façon non-déterministe) un tableau `aff` de taille `n` où chaque `aff[i]` est un entier entre 1 et `k`. Cette étape est polynomiale (en $O(n \log k)$).
2.  [cite_start]**Phase de "vérification" (déterministe) :** L'algorithme utilise le vérificateur polynomial `A(aff, instance)` décrit à la Q1[cite: 35].
3.  **Résultat :** Si le vérificateur retourne `Vrai`, l'algorithme non-déterministe "Accepte". Sinon, il "Rejette".

L'instance est acceptée s'il existe *au moins une* exécution (un chemin de divination) qui mène à l'acceptation.

---

### Q 3. NPC EXPTIME

**Q 3.1. Pour n et k fixés, combien de valeurs peut prendre un certificat?**

**Réponse :**
[cite_start]Le certificat est une fonction $aff:[1..n]\rightarrow[1..k]$[cite: 23].
Chacun des `n` objets peut être assigné à l'un des `k` sacs.
* L'objet 1 a `k` choix possibles.
* L'objet 2 a `k` choix possibles.
* ...
* L'objet `n` a `k` choix possibles.
[cite_start]Le nombre total de certificats (d'affectations) possibles est $k \times k \times ... \times k$ (n fois), soit **$k^n$**[cite: 41].

**Q 3.2. Enumération de tous les certificats**

**Q : Une méthode classique pour énumérer les certificats... consiste à s'appuyer sur un ordre total... Quel ordre proposez-vous?**

**Réponse :**
Nous pouvons utiliser **l'ordre lexicographique**.
Si nous voyons le certificat `aff` (un tableau de `n` entiers de 1 à `k`) comme un **nombre de `n` chiffres en base `k`** (en utilisant les chiffres {1, ..., k} au lieu de {0, ..., k-1}).

* [cite_start]**Certificat "le plus petit" (de départ) :** `[1, 1, ..., 1]` (tous les objets dans le sac 1)[cite: 44].
* **Notion de "successeur" :** C'est la même logique que l'incrémentation d'un nombre.
    1.  On parcourt le tableau `aff` de la droite vers la gauche (de `i = n` à `1`).
    2.  On cherche le premier indice `i` tel que `aff[i] < k`.
    3.  Si on trouve un tel `i` :
        a.  On incrémente cet élément : `aff[i] = aff[i] + 1`.
        b.  On met tous les éléments à sa droite à 1 (pour `j` de `i+1` à `n`, `aff[j] = 1`).
        c.  On a trouvé le successeur.
    4.  Si on ne trouve pas un tel `i` (c'est-à-dire que tous les éléments sont égaux à `k`), c'est qu'on était au certificat "maximal".
* [cite_start]**Certificat "le plus grand" (maximal) :** `[k, k, ..., k]` (tous les objets dans le sac `k`)[cite: 44].

**Exemple (n=3, k=2):**
[1, 1, 1] $\rightarrow$ [1, 1, 2] $\rightarrow$ [1, 2, 1] $\rightarrow$ [1, 2, 2] $\rightarrow$ [2, 1, 1] $\rightarrow$ ... $\rightarrow$ [2, 2, 2]

**Q 3.3. L'algorithme du British Museum**

**Q : Comment déduire de ce qui précède un algorithme pour tester si le problème a une solution?**

**Réponse :**
[cite_start]L'algorithme (parfois appelé "exploration exhaustive") consiste à tester *tous* les certificats possibles un par un, jusqu'à en trouver un valide[cite: 56].

1.  Générer le "plus petit" certificat : `aff = [1, 1, ..., 1]`.
2.  Démarrer une boucle :
    a.  Vérifier si le `aff` courant est valide en utilisant le vérificateur polynomial `A(aff, instance)` de la Q1.
    b.  Si `A` retourne `Vrai` : la propriété est vérifiée. Retourner `Vrai` (et `aff`).
    c.  Vérifier si `aff` est le certificat "maximal" (`[k, k, ..., k]`). Si oui, la boucle s'arrête.
    d.  Sinon, générer le certificat "successeur" de `aff` en utilisant la méthode de la Q3.2.
3.  Si la boucle se termine (parce qu'on a atteint le certificat maximal sans trouver de solution), cela signifie qu'aucun certificat n'est valide. Retourner `Faux`.

**Q : Quelle complexité a cet algorithme?**

**Réponse :**
* **Nombre de certificats :** $k^n$ (de Q3.1).
* **Coût de la vérification :** $O(n + k)$ (de Q1).
* **Coût de la génération du successeur :** En moyenne $O(1)$ (amorti), au pire $O(n)$.
* **Complexité totale :** L'algorithme effectue $k^n$ vérifications.
    La complexité est donc $O(k^n \times (n+k))$.
* [cite_start]C'est un algorithme de **complexité exponentielle** par rapport à `n`[cite: 48].

---

### Q 4. Implémentation

**Q : Implémenter les notions et algorithmes évoqués ci-dessus.**

**Discussion des choix d'implémentation (comme demandé):**

* [cite_start]**Langage choisi :** (ex: Java, en suivant l'architecture proposée [cite: 124-168], ou C, Python, etc.)
* **Structure des classes/données :**
    * [cite_start]Une classe `PblBinPack` contiendrait l'instance : `nbObjets`, `poids[]`, `cap`, `nbSacs` [cite: 150-153].
    * [cite_start]Une classe `CertificatBinPack` contiendrait le tableau `aff[]` (de taille `n`) et une référence vers l'instance `PblBinPack` à laquelle il se rapporte[cite: 167].
* [cite_start]**Implémentation du mode "vérification" (`-ver`)[cite: 57]:**
    * Lire l'instance du fichier.
    * Demander à l'utilisateur de saisir un certificat (ex: "1 3 2 1 ...").
    * Lire cette entrée et la stocker dans un `CertificatBinPack`.
    * [cite_start]Appeler la méthode `estCorrect()` de ce certificat[cite: 139], qui implémente l'algorithme vérificateur de la Q1.
    * Afficher le résultat (Vrai/Faux).
* [cite_start]**Implémentation du mode "non-déterministe" (`-nd`)[cite: 57]:**
    * Lire l'instance.
    * Créer un `CertificatBinPack`.
    * [cite_start]Appeler une méthode `alea()` [cite: 145] sur ce certificat (implémentant l'algo de Q2.1).
    * Appeler `estCorrect()` sur ce certificat aléatoire.
    * [cite_start]Afficher le résultat (Vrai/Faux) et le certificat généré[cite: 55].
* [cite_start]**Implémentation du mode "exploration exhaustive" (`-exh`)[cite: 57]:**
    * Lire l'instance.
    * [cite_start]Implémenter la méthode `aUneSolution()` de `PblBinPack`[cite: 155].
    * Cette méthode crée le certificat "minimal" (`[1, ..., 1]`).
    * [cite_start]Elle boucle tant que `estDernier()` [cite: 143] est faux :
        * [cite_start]Elle appelle `estCorrect()`[cite: 139]. Si Vrai, elle retourne Vrai.
        * [cite_start]Elle appelle `suivant()` [cite: 141] (qui implémente l'algo de Q3.2).
    * Elle teste une dernière fois le certificat "maximal".
    * [cite_start]Si la boucle se termine, elle retourne Faux[cite: 56].
    * [cite_start]**Attention :** Mettre un avertissement si `n` et `k` sont grands, comme le suggère le sujet[cite: 58].

---

## 2. Réductions polynomiales

### Une première réduction très simple

> **Problème: Partition**
>
> [cite_start]* **Donnée:** `n` un nombre d'entiers, $x_{1},\cdot\cdot\cdot,x_{n}$ les entiers [cite: 64-65].
> [cite_start]* **Sortie:** **Oui**, s'il existe un sous-ensemble $J\subset[1..n]$ tel que $\sum_{i\in J}x_{i}=\sum_{i\notin J}x_{i}=\frac{\sum_{i=1}^{n}x_{i}}{2}$[cite: 67]. **Non**, sinon.

**Q 1. Montrer que Partition se réduit polynomialement en Bin Pack.**

**Réponse :**
Nous devons transformer (en temps polynomial) une instance de **Partition** en une instance de **BinPack** de telle sorte que la réponse à l'une est "Oui" si et seulement si la réponse à l'autre est "Oui".

**Transformation $f(\text{Instance\_Partition}) \rightarrow \text{Instance\_BinPack}$ :**
Soit $I_P = (n, \{x_1, ..., x_n\})$ une instance de Partition.

1.  Calculer la somme totale $S = \sum_{i=1}^{n} x_i$.
2.  Si $S$ est **impaire**, le problème Partition n'a pas de solution. On génère une instance triviale de BinPack dont la réponse est "Non". Par exemple : $n'=1$ objet, $x'_1=2$, $c'=1$, $k'=1$.
3.  Si $S$ est **paire**, on définit le but de la partition $T = S / 2$.
4.  On construit l'instance de BinPack $I_B$ comme suit :
    * **Objets $n'$ :** $n' = n$. Les poids sont les mêmes : $\{x_1, ..., x_n\}$.
    * **Capacité $c'$ :** $c' = T = S / 2$.
    * **Nombre de sacs $k'$ :** $k' = 2$.

**Preuve :**
* **($\Rightarrow$) Si Partition($I_P$) = "Oui" :**
    Il existe un ensemble $J$ tel que $\sum_{i \in J} x_i = T$. L'ensemble complémentaire $J^c = [1..n] \setminus J$ a pour somme $S - T = S - S/2 = T$.
    On peut donc placer les objets de $J$ dans le sac 1 (poids total $T \le c'$) et les objets de $J^c$ dans le sac 2 (poids total $T \le c'$).
    C'est une solution valide pour BinPack($I_B$). Donc BinPack($I_B$) = "Oui".
* **($\Leftarrow$) Si BinPack($I_B$) = "Oui" :**
    Il existe une affectation dans $k'=2$ sacs de capacité $c'=T$. Soit $J$ l'ensemble des objets dans le sac 1, et $J^c$ ceux dans le sac 2.
    Nous avons $\sum_{i \in J} x_i \le c'$ et $\sum_{i \in J^c} x_i \le c'$.
    La somme totale est $S = (\sum_{i \in J} x_i) + (\sum_{i \in J^c} x_i) \le c' + c' = T + T = S$.
    Puisque la somme est *exactement* $S$, l'inégalité doit être une égalité. Cela implique $\sum_{i \in J} x_i = c' = T$ et $\sum_{i \in J^c} x_i = c' = T$.
    L'ensemble $J$ est une solution valide pour Partition($I_P$). Donc Partition($I_P$) = "Oui".

Cette transformation (calcul de $S$) est polynomiale (en $O(n \cdot \text{taille des } x_i)$).

**Q 1.1. à coder : Implémenter la réduction polynomiale de Partition dans Bin Pack.**

**Réponse :**
L'implémentation consistera en une fonction qui :
1.  Prend en entrée une instance de Partition (ex: un fichier avec `n` et la liste des $x_i$).
2.  Calcule la somme $S$.
3.  Si $S$ est impaire, génère un fichier BinPack "Non" (ex: "1 \n 2 \n 1 \n 1").
4.  Si $S$ est paire, génère un fichier BinPack contenant :
    * Ligne 1 : `n`
    * Ligne 2 : $x_1, x_2, ..., x_n$
    * Ligne 3 : $c = S / 2$
    * Ligne 4 : $k = 2$

**Q 1.2. La propriété Partition est connue NP-complète. Qu'en déduire pour Bin Pack?**

**Réponse :**
1.  Nous avons montré que **BinPack est dans NP** (Section 1, Q1).
2.  Nous avons montré une réduction polynomiale **Partition $\le_p$ BinPack** (Q1.1).
3.  [cite_start]On sait que **Partition est NP-complet**[cite: 71], ce qui signifie qu'il est NP-difficile.

Par définition, si un problème $P_1$ est NP-difficile et que $P_1 \le_p P_2$, alors $P_2$ est aussi NP-difficile.
Donc, BinPack est NP-difficile.
Puisque BinPack est à la fois dans NP et NP-difficile, on en déduit que **BinPack est NP-complet**.

**Q 1.3. Pensez-vous que Bin Pack se réduise polynomialement dans Partition? Pourquoi?**

**Réponse :**
**Oui**. [cite_start]Puisque nous venons de prouver que BinPack est NP-complet (Q1.2) et que Partition est aussi NP-complet[cite: 71], et que tous les problèmes NP-complets se réduisent polynomialement les uns aux autres (par définition de la NP-complétude), une telle réduction doit exister.

Cependant, cette réduction n'est pas "évidente". La réduction de BinPack (problème général avec `k` sacs et une capacité `c`) vers Partition (problème très spécifique de 2 ensembles à somme égale) est complexe et non triviale à construire, contrairement à la réduction inverse que nous avons faite.

---

### Une réduction un peu moins évidente

> **Problème: Sum** (Aussi connu sous le nom de Subset Sum)
>
> [cite_start]* **Donnée:** `n` un nombre d'entiers, $x_{1},\cdot\cdot\cdot,x_{n}$ les entiers, et `c` un entier cible [cite: 78-80].
> [cite_start]* **Sortie:** **Oui**, s'il existe un sous-ensemble $J\subset[1..n]$ tel que $\sum_{i\in J}x_{i}=c$[cite: 82]. **Non**, sinon.

**Q 2. Entre Sum et Partition, lequel des deux problèmes peut être presque vu comme un cas particulier de l'autre? Qu'en déduire en terme de réduction?**

**Réponse :**
* **Partition est un cas particulier de Sum.**
* Partition demande s'il existe un sous-ensemble $J$ dont la somme est $T = (\sum x_i) / 2$.
* Sum demande s'il existe un sous-ensemble $J$ dont la somme est $c$.
* Donc, Partition est simplement le problème Sum où la cible `c` est fixée à une valeur très spécifique ($(\sum x_i) / 2$) et où on vérifie d'abord que $\sum x_i$ est paire.
* **Déduction :** Puisque Partition est un cas particulier de Sum, la réduction est dans ce sens : **Partition $\le_p$ Sum**. Pour résoudre Partition, on calcule $T = (\sum x_i) / 2$ et on appelle le solveur Sum avec la cible $c = T$.

**Q 3. à coder : Montrer que Sum se réduit polynomialement en Partition et implémentez la réduction.**

**Réponse :**
C'est la réduction non-triviale. Soit $I_S = (X = \{x_1, ..., x_n\}, c)$ une instance de Sum. Nous voulons la transformer en une instance $I_P = (Y = \{y_1, ..., y_m\})$ de Partition.

Let $S = \sum_{i=1}^n x_i$. Nous cherchons un $J \subset X$ tel que $\sum_J x_i = c$. Si un tel $J$ existe, l'ensemble complémentaire $X \setminus J$ a une somme de $S - c$.
Ces deux sommes $c$ et $S-c$ sont différentes (en général). Pour Partition, nous avons besoin que les deux sous-ensembles aient une somme *égale*.

**Transformation :**
L'idée est d'ajouter des "poids de lest" pour équilibrer les deux sommes.

1.  Calculer $S = \sum_{i=1}^n x_i$.
2.  Si $c > S$, la réponse à Sum est trivialement "Non". On peut générer une instance "Non" de Partition (ex: $Y = \{1, 1, 3\}$).
3.  On veut trouver un $J$ de somme $c$. Le reste $X \setminus J$ a une somme $S-c$.
4.  L'écart entre les deux est $|c - (S-c)| = |2c - S|$.
5.  On crée une nouvelle instance de Partition $I_P$ avec l'ensemble $Y = \{x_1, ..., x_n, y_{n+1}\}$ où $y_{n+1} = |2c - S|$.
6.  La somme totale de $Y$ est $S' = S + |2c - S|$.
7.  Le but pour Partition est de trouver un sous-ensemble $A \subset Y$ de somme $T' = S' / 2$.

* **Cas 1 : $S \ge 2c$.**
    $y_{n+1} = S - 2c$. La somme totale est $S' = S + (S - 2c) = 2S - 2c$.
    Le but de la partition est $T' = S' / 2 = S - c$.
* **Cas 2 : $S < 2c$.**
    $y_{n+1} = 2c - S$. La somme totale est $S' = S + (2c - S) = 2c$.
    Le but de la partition est $T' = S' / 2 = c$.

**Preuve :**
* **($\Rightarrow$) Si Sum($I_S$) = "Oui" :**
    Il existe $J \subset X$ tel que $\sum_J x_i = c$. Le complémentaire $X \setminus J$ a une somme $S - c$.
    * **Cas 1 ($S \ge 2c$) :** Le but de la partition est $S - c$. L'ensemble $X \setminus J$ est un sous-ensemble de $Y$ dont la somme est $S - c$. C'est une solution pour Partition.
    * **Cas 2 ($S < 2c$) :** Le but de la partition est $c$. L'ensemble $J$ est un sous-ensemble de $Y$ dont la somme est $c$. C'est une solution pour Partition.
    Dans les deux cas, Partition($I_P$) = "Oui".
* **($\Leftarrow$) Si Partition($I_P$) = "Oui" :**
    Il existe $A \subset Y$ tel que $\sum_A y_i = T'$.
    * **Cas 1 ($S \ge 2c$, $T' = S - c$) :**
        Si $y_{n+1} \notin A$, alors $A \subset X$ et $\sum_A x_i = S - c$. Le complémentaire $X \setminus A$ a une somme $S - (S - c) = c$. C'est une solution pour Sum.
        Si $y_{n+1} \in A$, alors $A' = A \setminus \{y_{n+1}\} \subset X$. $\sum_{A'} x_i = T' - y_{n+1} = (S - c) - (S - 2c) = c$. $A'$ est une solution pour Sum.
    * **Cas 2 ($S < 2c$, $T' = c$) :**
        Si $y_{n+1} \notin A$, alors $A \subset X$ et $\sum_A x_i = c$. $A$ est une solution pour Sum.
        Si $y_{n+1} \in A$, alors $A' = A \setminus \{y_{n+1}\} \subset X$. $\sum_{A'} x_i = T' - y_{n+1} = c - (2c - S) = S - c$. Le complémentaire $X \setminus A'$ a une somme $S - (S - c) = c$. C'est une solution pour Sum.
    Dans tous les cas, Sum($I_S$) = "Oui".

Cette transformation est polynomiale (calcul de $S$ et de $y_{n+1}$).

---

### Composition de réductions

**Q 4. En utilisant la réduction précédente, comment implémenter une réduction polynomiale de Sum dans BinPack?**

**Réponse :**
Puisque les réductions polynomiales sont transitives, si $Sum \le_p Partition$ (Q3) et $Partition \le_p BinPack$ (Q1), alors $Sum \le_p BinPack$.

Pour implémenter la réduction $f(\text{Instance\_Sum}) \rightarrow \text{Instance\_BinPack}$, il suffit de **composer les deux réductions** :

1.  Prendre l'instance de **Sum** $I_S = (X, c)$.
2.  Appliquer la réduction de Q3 (Sum $\rightarrow$ Partition) pour obtenir une instance de **Partition** $I_P = (Y)$.
    * $S = \sum X$. $y_{n+1} = |2c - S|$. $Y = X \cup \{y_{n+1}\}$.
3.  Prendre cette instance $I_P$ et lui appliquer la réduction de Q1 (Partition $\rightarrow$ BinPack) pour obtenir l'instance de **BinPack** $I_B$.
    * Calculer $S' = \sum Y = S + y_{n+1}$.
    * $T' = S' / 2$. (On sait que $S'$ est paire par construction).
    * L'instance $I_B$ est :
        * Objets : $Y = \{x_1, ..., x_n, y_{n+1}\}$ (il y a $n+1$ objets)
        * Capacité $c'$ : $T' = S' / 2$
        * Sacs $k'$ : 2

---

### Une dernière réduction

> **Problème: BinPackDiff**
>
> [cite_start]* **Donnée:** `n` objets avec poids $x_{1},\cdot\cdot\cdot,x_{n}$, `k` sacs avec capacités *différentes* $c_{1},\cdot\cdot\cdot,c_{k}$ [cite: 93-98].
> [cite_start]* **Sortie:** **Oui**, s'il existe $aff:[1..n]\rightarrow[1..k]$ tq $\sum_{i/aff(i)=j}x_{i}\le c_{j}$ pour tout `j` [cite: 100-102]. **Non**, sinon.

**Q 5. Proposer une réduction polynomiale de BinPackDiff dans BinPack (inutile de l'implémenter).**

**Réponse :**
Nous devons transformer une instance de BinPackDiff (sacs différents) en une instance de BinPack (sacs identiques). L'astuce consiste à "étiqueter" les sacs en utilisant des objets "gadgets" si grands qu'ils ne peuvent pas être placés ensemble.

**Transformation $f(\text{Instance\_BPD}) \rightarrow \text{Instance\_BP}$ :**
Soit $I_{BPD} = (n, X=\{x_i\}, k, C=\{c_j\})$ une instance de BinPackDiff.

1.  Trouver la capacité maximale $C_{max} = \max(c_j)$.
2.  Choisir un "grand" nombre $M$. $M$ doit être plus grand que la somme de tous les objets $X$. $M = (\sum x_i) + 1$. (Cela garantit que $M$ est plus grand que la capacité de n'importe quel sac $C_{max}$ et que $M$ plus un objet $x_i$ ne peut pas être confondu avec un autre gadget).
3.  On définit la nouvelle capacité *uniforme* $c'$ de BinPack.
    $c' = M + C_{max}$.
4.  On crée une nouvelle instance $I_{BP}$ de BinPack :
    * **Nombre de sacs $k'$ :** $k' = k$.
    * **Capacité $c'$ :** $c' = M + C_{max}$.
    * **Objets $X'$ :** On garde les $n$ objets originaux $X$, et on ajoute $k$ "objets gadgets" $G = \{g_1, ..., g_k\}$.
        * Le poids du gadget $g_j$ est $g_j = M + (C_{max} - c_j)$.
    * L'instance $I_{BP}$ a $n+k$ objets, $k$ sacs et une capacité $c'$.

**Preuve (Schéma) :**
* Le poids de chaque gadget $g_j$ est $g_j \ge M$. La capacité $c' = M + C_{max}$. La somme de deux gadgets $g_a + g_b \ge 2M$. Puisque $M > C_{max}$, $2M > M + C_{max} = c'$.
* **Conséquence :** Deux gadgets ne peuvent jamais être placés dans le même sac.
* Puisqu'il y a $k$ gadgets et $k$ sacs, une solution "Oui" pour $I_{BP}$ doit *obligatoirement* placer **exactement un gadget $g_j$ par sac**.
* Considérons le sac $j$ qui contient le gadget $g_j$.
* Le poids de $g_j$ est $M + (C_{max} - c_j)$.
* La capacité restante dans ce sac est $c' - g_j = (M + C_{max}) - (M + C_{max} - c_j) = c_j$.
* Les objets $X$ qui sont placés dans ce sac $j$ doivent donc avoir une somme $\sum x_i \le c_j$.
* C'est *exactement* la contrainte du problème BinPackDiff.
* Donc, une solution à $I_{BP}$ (assigner les $x_i$ aux sacs, chacun contenant son gadget $g_j$) correspond directement à une solution pour $I_{BPD}$ (assigner les $x_i$ aux sacs $j$ de capacité $c_j$).
* La réduction est polynomiale (calcul de $C_{max}$, $M$, et création des $k$ gadgets).

---

## 3. Optimisation versus Décision

* [cite_start]**BinPack (Décision):** ($X, c, k$) $\rightarrow$ Oui/Non, "Est-ce que $k$ sacs suffisent ?" [cite: 15]
* [cite_start]**BinPackOpt1 (Optimisation):** ($X, c$) $\rightarrow k_{min}$, "Combien de sacs au minimum ?" [cite: 105]
* [cite_start]**BinPackOpt2 (Optimisation):** ($X, c, k$) $\rightarrow aff$, "Donner une affectation qui minimise le nb de sacs (en utilisant au max $k$ sacs)" [cite: 111-117].

**Q 1. Montrer que si BinPackOpt1 (resp. BinPackOpt2) était P, la propriété Bin Pack le serait aussi; qu'en déduire pour BinPackOpt1 (resp. BinPackOpt2)?**

**Réponse :**
* **Si BinPackOpt1 était P (polynomial) :**
    Nous pouvons résoudre **BinPack(X, c, k)** comme suit :
    1.  Appeler `BinPackOpt1(X, c)` pour obtenir $k_{min}$. (C'est polynomial par hypothèse).
    2.  Comparer $k_{min}$ et $k$.
    3.  Si $k_{min} \le k$, retourner "Oui".
    4.  Sinon, retourner "Non".
    Cet algorithme (un appel polynomial + une comparaison) est polynomial. Donc **BinPack serait P**.

* **Si BinPackOpt2 était P (polynomial) :**
    Nous pouvons résoudre **BinPack(X, c, k)** comme suit :
    1.  Appeler `BinPackOpt2(X, c, k)`. (C'est polynomial par hypothèse).
    2.  Si l'algorithme retourne une affectation $aff$, cela signifie qu'une solution existe avec $k_{min} \le k$ sacs. Retourner "Oui".
    3.  [cite_start]S'il retourne "Impossible" (ou une affectation qui utilise $k_{used} > k$, bien que la définition [cite: 117] soit ambiguë, le principe reste), retourner "Non".
    Cet algorithme est aussi polynomial. Donc **BinPack serait P**.

* **Conclusion :**
    Nous avons montré que BinPack est NP-complet (Section 2, Q1.2).
    Si $P \ne NP$ (ce qui est la conjecture standard), alors BinPack n'est pas P.
    Puisque (BinPackOpt1 $\in$ P $\Rightarrow$ BinPack $\in$ P), on en déduit par contraposée que **BinPackOpt1 n'est pas P**. Il est au moins NP-difficile.
    De même, **BinPackOpt2 n'est pas P** et est au moins NP-difficile.

**Q 2. Montrer que si la propriété Bin Pack était P, BinPackOpt1 le serait aussi.**

**Réponse :**
Supposons que nous ayons un solveur polynomial `SolveBinPack(X, c, k)` qui retourne Vrai/Faux. Nous voulons trouver $k_{min}$ pour `BinPackOpt1(X, c)`.

Nous pouvons trouver $k_{min}$ en utilisant une **recherche dichotomique (binary search)**.

1.  **Bornes de recherche :** On sait que $k_{min}$ est compris entre $k_{low}$ et $k_{high}$.
    * Une borne inférieure simple $k_{low} = 1$. (Une meilleure serait $k_{low} = \lceil (\sum x_i) / c \rceil$).
    * Une borne supérieure $k_{high} = n$ (au pire, un sac par objet).
2.  **Recherche :**
    Tant que $k_{low} < k_{high}$ :
    a.  Calculer $k_{mid} = \lfloor (k_{low} + k_{high}) / 2 \rfloor$.
    b.  Appeler le solveur de décision : `possible = SolveBinPack(X, c, k_mid)`.
    c.  Si `possible` est "Oui" :
        * Une solution existe avec $k_{mid}$ sacs. $k_{min}$ est donc $\le k_{mid}$.
        * On continue la recherche dans l'intervalle $[k_{low}, k_{mid}]$. On pose $k_{high} = k_{mid}$.
    d.  Si `possible` est "Non" :
        * Aucune solution n'existe avec $k_{mid}$ sacs. $k_{min}$ est donc $> k_{mid}$.
        * On continue la recherche dans l'intervalle $[k_{mid} + 1, k_{high}]$. On pose $k_{low} = k_{mid} + 1$.
3.  **Résultat :** Quand la boucle s'arrête ($k_{low} == k_{high}$), cette valeur commune est $k_{min}$. Retourner $k_{low}$.

**Complexité :**
* L'intervalle de recherche initial est de taille $O(n)$.
* Le nombre d'itérations de la recherche dichotomique est $O(\log n)$.
* À chaque itération, on fait un appel à `SolveBinPack`, qui est polynomial (temps $T(n)$) par hypothèse.
* La complexité totale est $O(T(n) \times \log n)$.
* Si $T(n)$ est polynomial, alors $O(T(n) \times \log n)$ est aussi **polynomial**.
* [cite_start]Donc, si BinPack était P, BinPackOpt1 le serait aussi[cite: 120].

**Q 3. Plus dur... Montrer que si la propriété Bin Pack était P, BinPackOpt2 le serait aussi.**

**Réponse :**
Supposons que BinPack est P. Nous voulons trouver l'affectation $aff$ (la sortie de BinPackOpt2).

1.  **Trouver $k_{min}$ :** Utiliser l'algorithme de la Q2. C'est polynomial. Nous avons maintenant $(X, c, k_{min})$ et nous savons que la réponse est "Oui".
2.  **Construire l'affectation (Self-reduction) :** Nous allons "remplir" les sacs un par un, en utilisant le solveur BinPack comme oracle pour prendre les bonnes décisions.

**Algorithme de construction :**
Soit $R = X$ l'ensemble des objets restants à placer.
Pour $j$ de 1 à $k_{min}-1$ : // Remplir les $k-1$ premiers sacs
    a.  $S_j = \emptyset$ (ensemble des objets pour le sac $j$).
    b.  $C_{rem} = c$ (capacité restante du sac $j$).
    c.  Parcourir tous les objets $x_i$ dans $R$ (dans un ordre fixe, ex: par indice) :
        i.  **Test :** Si on met $x_i$ dans le sac $j$, le reste peut-il toujours être emballé ?
        ii. On vérifie deux choses :
            1.  Est-ce que $x_i$ rentre ? ($x_i \le C_{rem}$)
            2.  Est-ce que le reste $R \setminus \{x_i\}$ peut être emballé dans les $k_{min} - j$ sacs restants *plus* le sac $j$ avec sa capacité réduite ?
            *Cette vérification est compliquée car elle nécessite BinPackDiff.*

    **Algorithme plus simple (utilisant uniquement l'oracle BinPack) :**
    Soit $R = X$ (objets restants).
    Pour $j$ de 1 à $k_{min}-1$ : // Pour les $k-1$ premiers sacs
        a.  $S_j = \emptyset$ (contenu du sac $j$).
        b.  Pour $i$ de 1 à $n$ (pour tous les objets $x_i$) :
            i.  Si $x_i \in R$ ET $(\sum S_j) + x_i \le c$ :
                1.  **Test :** Est-ce qu'une solution existe si $x_i$ est dans le sac $j$ ?
                2.  Pour tester cela, on demande à l'oracle :
                    `possible = SolveBinPack(R \setminus \{x_i\}, c, k_{min} - j)`
                3.  *Non, ce test est faux.* Il teste si le reste tient dans $k_{min}-j$ sacs, mais le reste de $S_j$ doit tenir dans le sac $j$ *actuel*.

    **Algorithme correct (le plus standard) :**
    1.  Trouver $k_{min}$ (polynomial, Q2).
    2.  $R = X$ (objets restants).
    3.  $k = k_{min}$.
    4.  $aff = [0, ..., 0]$ (affectation vide).
    5.  Pour $j = 1$ à $k-1$ : // Pour les $k-1$ premiers sacs
        a.  $R_{\text{actuel}} = R$ (copie des objets restants).
        b.  Pour $i = 1$ à $n$ : // Pour tous les objets
            i.  Si $x_i \in R_{\text{actuel}}$ ET $(\sum_{\text{objets déjà dans } S_j} \text{poids}) + x_i \le c$:
                1.  **Test :** Si on met $x_i$ dans le sac $j$, est-ce que *tous les autres objets* ($R_{\text{actuel}} \setminus \{x_i\}$) peuvent être placés dans les $k-j$ sacs restants ?
                2.  `possible = SolveBinPack(R_{\text{actuel}} \setminus \{x_i\}, c, k-j)`
                3.  Si `possible` est **"Non"** :
                    * Cela signifie que $x_i$ *doit* être dans $S_j$ (ou une solution n'existe pas, ce que nous savons être faux).
                    * *Correction : cette logique est pour SAT. Pour BinPack :*
                1.  **Test :** Est-ce qu'une solution existe *sans* mettre $x_i$ dans le sac $j$ ?
                2.  Pour cela, on suppose que $x_i$ est *mis de côté* et on vérifie si le reste $R \setminus \{x_i\}$ peut être packé dans $k$ sacs (en respectant les $j-1$ sacs déjà remplis). C'est trop complexe.

    **Algorithme correct (vraiment) :**
    1.  Trouver $k_{min}$ (polynomial, Q2).
    2.  $R = X$. $aff = [0]*n$. $k = k_{min}$.
    3.  Pour $i = 1$ à $n$ (pour chaque objet $x_i$) :
        a.  Pour $j = 1$ à $k$ (pour chaque sac) :
            i.  **Test :** Est-ce qu'il existe une solution valide *où $x_i$ est dans le sac $j$* ?
            ii. C'est difficile à tester avec l'oracle BinPack.
    
    **Reprenons l'idée Q3.3-c de l'enseignant (la plus probable) :**
    1.  Trouver $k_{min}$ (polynomial, Q2).
    2.  $R = X$ (objets restants).
    3.  $k = k_{min}$.
    4.  Pour $j = 1$ à $k-1$ : // Remplir le sac $j$
        a.  $S_j = \emptyset$.
        b.  $R_{\text{candidats}} = R$. // Objets pouvant aller dans ce sac
        c.  Pour $i = 1$ à $n$ (pour tous les $x_i$) :
            i.  Si $x_i \in R_{\text{candidats}}$ ET $(\sum S_j) + x_i \le c$:
                1.  **Test :** Si on met $x_i$ dans $S_j$, le reste ($R_{\text{candidats}} \setminus \{x_i\}$) peut-il être packé dans les $k-j$ sacs restants *PLUS* le reste de $S_j$ ?
                2.  **Test correct :** `possible = SolveBinPack(R \setminus (S_j \cup \{x_i\}), c, k-j)`
                3.  Si `possible` est **"Oui"** :
                    * Alors il existe une solution où $x_i$ est dans le sac $j$.
                    * On "valide" ce choix : $S_j = S_j \cup \{x_i\}$.
                    * On met à jour la liste des candidats : $R_{\text{candidats}} = R_{\text{candidats}} \setminus \{x_i\}$.
        d.  $R = R \setminus S_j$ (on retire les objets placés dans $S_j$ des objets restants).
    5.  Le dernier sac $S_k$ contient $R$.
    6.  Construire l'affectation `aff` à partir des ensembles $S_j$.

**Complexité :**
* Q2 : $O(T(n) \log n)$.
* Boucle principale : $k-1$ fois (soit $O(n)$).
* Boucle interne : $n$ fois.
* Test : 1 appel à `SolveBinPack` (temps $T(n)$).
* Total : $O(T(n) \log n + n \times n \times T(n)) = O(n^2 \times T(n))$.
* Si $T(n)$ est polynomial, $O(n^2 T(n))$ est **polynomial**.
* Donc, si BinPack était P, BinPackOpt2 le serait aussi.
