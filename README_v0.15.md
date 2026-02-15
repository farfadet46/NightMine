# MINING2D v0.15 - Ajout des Coffres

## Nouveautés de la version 0.15

### Système de Coffres
- **Nouveau bloc : Coffre (ID: 18)**
  - Se craft avec 8 planches disposées en carré (avec un vide au centre)
  - Permet de stocker 27 items (3 rangées de 9 slots)
  - Interface graphique dédiée avec grille de stockage
  
### Fonctionnalités

#### Crafting du Coffre
```
Planches | Planches | Planches
Planches |   Vide   | Planches
Planches | Planches | Planches
```
Résultat : 1 Coffre

#### Utilisation
- **Placer un coffre** : Clic droit avec le coffre sélectionné
- **Ouvrir un coffre** : Clic droit sur un coffre placé
- **Fermer le coffre** : Touche Échap (ESC)
- **Détruire un coffre** : Clic gauche maintenu - tous les items sont droppés au sol

#### Interface du Coffre
- Grille de 27 slots (9x3)
- Support complet du drag & drop :
  - **Clic gauche** : Prendre/déposer tout le stack
  - **Clic droit** : Prendre/déposer 1 item à la fois
  - **Clic molette** : Diviser le stack en deux
- Inventaire du joueur visible en bas pour faciliter les échanges
- Tooltip affichant le nom de l'item au survol

#### Rendu Visuel
Le coffre apparaît comme un bloc en bois avec :
- Une texture bois marron (#8b5a3c)
- Un couvercle plus foncé en haut
- Une serrure dorée au centre
- Des bordures et détails pour l'effet 3D

### Modifications Techniques

#### Nouveaux Fichiers
- **chestManager.js** : Gestionnaire complet des coffres
  - Gestion de l'inventaire de chaque coffre
  - Système de sauvegarde par position (x,y)
  - Interface utilisateur dédiée
  - Gestion du drag & drop

#### Fichiers Modifiés
- **blockTypes.js** : Ajout du bloc Coffre et de sa recette
- **game.js** : Intégration du ChestManager et gestion de l'ouverture/fermeture
- **world.js** : Ajout de la fonction breakChest()
- **renderer.js** : Ajout de la fonction drawChest() pour le rendu
- **index.html** : 
  - Ajout du panel d'interface du coffre
  - Styles CSS pour l'icône et le panel
  - Import du script chestManager.js
  - Mise à jour vers v0.15

### Gameplay

Les coffres permettent maintenant de :
- **Stocker vos ressources** de manière organisée
- **Créer des dépôts** à différents endroits de votre monde
- **Libérer de l'espace** dans votre inventaire limité
- **Sécuriser vos items précieux** avant d'explorer des zones dangereuses

### Notes de Version

**Version 0.15**
- ✅ Ajout du système de coffres complet
- ✅ 27 slots de stockage par coffre
- ✅ Interface utilisateur intuitive
- ✅ Sauvegarde automatique du contenu
- ✅ Récupération des items à la destruction
- ✅ Support complet du drag & drop

**Compatibilité**
- Compatible avec toutes les sauvegardes de la v0.14
- Les coffres sont persistants pendant la session
- Chaque coffre a son propre inventaire indépendant

### Prochaines Versions Envisagées
- v0.16 : Système d'outils (pioche, hache, pelle)
- v0.17 : Armures et système de santé
- v0.18 : Mobs et combats
- v0.19 : Biomes variés
- v0.20 : Donjons et boss

Bon jeu !
