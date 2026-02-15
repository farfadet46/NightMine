# MINING2D v0.18 - Système de Minage Amélioré

## 🎯 Nouveautés Majeures de la version 0.18

### ⚒️ **Refonte Complète du Système de Minage**

Le minage a été entièrement repensé pour être plus réaliste, stratégique et satisfaisant !

---

## 🔨 **Nouvelles Mécaniques**

### 1. **Les Outils sont Obligatoires**

Chaque type de bloc **nécessite un outil spécifique** :

| Bloc | Outil Requis | Alternative |
|------|--------------|-------------|
| **Pierre, Minerais** | ⛏️ Pioche | ❌ Impossible |
| **Bois, Planches** | 🪓 Hache | ✋ Main (très lent) |
| **Terre, Herbe** | 🥄 Pelle | ✋ Main (lent) |
| **Coffre** | 🪓 Hache | ✋ Main (très lent) |
| **Four** | ⛏️ Pioche | ✋ Main (très lent) |

**Exemples concrets :**
- ❌ **Vous NE POUVEZ PAS** casser de la pierre avec une hache
- ❌ **Vous NE POUVEZ PAS** couper du bois avec une pioche
- ❌ **Vous NE POUVEZ PAS** creuser de la terre avec une hache
- ✅ **Vous DEVEZ** avoir une pioche pour miner la pierre
- ✅ **Vous DEVEZ** avoir une hache pour couper du bois rapidement

---

### 2. **Minage Progressif (Plus de Clic Maintenu)**

Le système de minage est maintenant **progressif et visuel** :

#### Comment ça marche :
1. **Clic gauche** sur un bloc pour **commencer** le minage
2. Une **barre de progression** apparaît sous le bloc
3. Des **fissures** se forment progressivement
4. Le bloc se **brise automatiquement** à 100%
5. **Relâcher le clic** annule le minage en cours

#### Feedback Visuel :
- 🔲 **0-30%** : Bordure lumineuse qui pulse
- ⚡ **30-50%** : Première fissure diagonale
- 💥 **50-70%** : Deuxième fissure en croix
- 🔥 **70-100%** : Fissures complètes (vertical + horizontal)

---

## ⏱️ **Temps de Minage**

### Table des Vitesses

| Outil | Efficacité | Exemple (Pierre 1.5 dureté) |
|-------|-----------|------------------------------|
| ✋ Main | 0.2x | **37.5 secondes** |
| 🪓 Bois/Pioche Bois | 2x | **0.75 seconde** |
| ⚒️ Fer/Pioche Fer | 6x | **0.25 seconde** |

### Dureté des Blocs

| Bloc | Dureté | Temps Main | Temps Bois | Temps Fer |
|------|--------|-----------|-----------|-----------|
| Feuilles | 0.2 | 1s | 0.1s | Instant |
| Terre | 0.5 | 2.5s | 0.25s | 0.08s |
| Herbe | 0.6 | 3s | 0.3s | 0.1s |
| Pierre | 1.5 | ❌ | 0.75s | 0.25s |
| Bois | 2.0 | 10s | 1s | 0.33s |
| Coffre | 2.5 | 12.5s | 1.25s | 0.42s |
| Minerais | 3.0 | ❌ | 1.5s | 0.5s |

---

## 🎮 **Impact sur le Gameplay**

### Avant v0.18 ❌
- Clic maintenu = spam de destruction
- Tous les outils marchent sur tout
- Pas de stratégie d'outil
- Minage instantané et peu satisfaisant

### Après v0.18 ✅
- **Clic progressif** = engagement actif
- **Outils spécialisés** obligatoires
- **Choix stratégique** de l'outil
- **Feedback visuel** avec fissures
- **Temps de minage** cohérents

---

## 🔧 **Modifications Techniques**

### Fichiers Modifiés

#### **blockTypes.js**
- Ajout de `minableWith: ['toolType', 'hand']` sur chaque bloc
- Définit précisément quels outils peuvent miner chaque bloc
- Pierre : UNIQUEMENT pioche
- Bois : Hache OU main (lent)
- Terre : Pelle OU main

#### **game.js**
- Suppression de `miningCooldown` (ancien système)
- Ajout de `miningState` (progressif) :
  - `active` : minage en cours ou non
  - `x, y` : position du bloc ciblé
  - `progress` : pourcentage (0 à 1)
  - `totalTime` : durée totale calculée
  - `startTime` : timestamp de début

- Nouvelles fonctions :
  - `startMining(x, y)` : démarre le minage
  - `updateMining()` : met à jour la progression
  - `cancelMining()` : annule le minage
  - `canMineBlock(blockId)` : vérifie outil + calcule temps
  - `completeBlockBreak(x, y)` : détruit le bloc à 100%

#### **inputManager.js**
- `handleMouseDown()` : Démarrer le minage au clic
- `handleMouseUp()` : Annuler le minage au relâchement
- Suppression du système `mouse.down` (maintien)

#### **renderer.js**
- Nouvelle fonction `drawMiningProgress(camera)` :
  - Barre de progression verte sous le bloc
  - Fissures progressives (3 niveaux)
  - Bordure lumineuse qui pulse
  - Animation fluide

---

## 💡 **Stratégies de Jeu**

### Début de Partie (Optimal)

1. ✋ **Récoltez du bois** à la main (lent mais possible)
   - Attendez ~10 secondes par bloc
   
2. 🔨 **Craftez une hache en bois**
   - 3 planches + 2 bâtons
   - Maintenant vous coupez du bois 5x plus vite !
   
3. 🪓 **Récoltez beaucoup de bois** avec la hache
   - Construction de base rapide
   
4. ⛏️ **Craftez une pioche en bois**
   - Seul moyen de miner de la pierre
   
5. 🏔️ **Minez de la pierre** pour le four
   - 8 pierres = 1 four
   
6. 🔥 **Faites fondre du fer**
   - Fer brut → Lingots de fer
   
7. ⚒️ **Craftez des outils en fer**
   - 3x plus rapides que le bois
   - Mining vraiment efficace

---

## 🎯 **Conseils Pro**

### Gestion des Outils
- ✅ **Toujours avoir** : 1 pioche, 1 hache, 1 pelle
- 🎒 **Hotbar optimal** : [Pioche] [Hache] [Pelle] [Torche] [Nourriture]
- 🔄 **Switchez rapidement** entre outils selon le bloc

### Optimisation du Minage
- ⏱️ **Ne relâchez pas** le clic avant 100% (perte de progression)
- 🎯 **Visez juste** : Cliquer sur le mauvais bloc annule
- 🏃 **Restez à portée** : Sortir de la zone = annulation
- 🔧 **Bon outil** : Une pioche en fer mine 12x plus vite qu'une hache

### Progression Naturelle
```
Main (lent) → Bois (OK) → Fer (rapide) → Diamant (futur)
```

---

## 🐛 **Corrections de Bugs**

- ✅ Les outils ne peuvent plus miner n'importe quoi
- ✅ Le spam-clic ne fonctionne plus
- ✅ Feedback visuel cohérent
- ✅ Calculs de temps précis
- ✅ Annulation propre du minage

---

## 🎨 **Améliorations Visuelles**

### Effets de Fissures
- 3 niveaux de fissures progressives
- Animation fluide du blanc au noir
- Overlay semi-transparent

### Barre de Progression
- Couleur verte (#4caf50) pour la progression
- Fond noir semi-transparent
- Bordure blanche
- Taille : 32px × 4px

### Bordure Animée
- Pulse blanc à 0.3-0.5 opacité
- Vitesse : 100ms par cycle
- Effet "focus" sur le bloc ciblé

---

## 📊 **Statistiques**

### Temps Total pour une Pioche en Fer

**Sans outils** (main pure) :
- 10 bois (10s chacun) = **100 secondes**
- Impossible de miner la pierre = **BLOQUÉ**

**Avec outils bois** :
- 10 bois avec hache bois (1s) = **10 secondes**
- 8 pierres avec pioche bois (0.75s) = **6 secondes**
- Fondre 3 fers (3s chacun) = **9 secondes**
- **Total : ~25 secondes** ✅

**Gain de temps : 75%** 🚀

---

## 🎮 **Expérience de Jeu**

### Ce qui rend le minage satisfaisant :

1. **Engagement actif** : Vous devez maintenir le clic
2. **Feedback visuel** : Vous voyez la progression
3. **Choix stratégiques** : Quel outil pour quelle tâche ?
4. **Sens de progression** : Main → Bois → Fer
5. **Récompense** : Les bons outils sont vraiment utiles

### Exemple d'une Session

```
[Spawn] → Couper 5 arbres (50s main)
       → Crafter hache bois
       → Couper 20 arbres (20s)
       → Crafter pioche bois
       → Miner 8 pierres (6s)
       → Crafter four
       → Explorer pour trouver du fer
       → Fondre 3 lingots
       → Crafter pioche en fer
       → Miner efficacement ! ⚡
```

---

## 🔮 **Prochaines Versions**

### v0.19 (Planifié)
- 🔧 **Durabilité des outils** (ils s'usent)
- 💎 **Outils en pierre** (entre bois et fer)
- ⭐ **Outils en diamant** (les meilleurs)
- 🔨 **Réparation** d'outils

### v0.20 (Planifié)
- ❤️ **Système de santé** du joueur
- 🍖 **Nourriture** et régénération
- ⚔️ **Combat** amélioré

### v0.21 (Planifié)
- 👾 **Mobs hostiles**
- 🏹 **Arc et flèches**
- 🛡️ **Armures**

---

## 📋 **Résumé des Changements**

### ✅ Ajouté
- Système de minage progressif (clic → progression → destruction)
- Validation d'outil obligatoire (pioche pour pierre, etc.)
- Barre de progression visuelle sous le bloc
- Effet de fissures progressives (3 niveaux)
- Bordure lumineuse animée sur le bloc ciblé
- Propriété `minableWith` sur tous les blocs
- Annulation du minage au relâchement

### ❌ Supprimé
- Ancien système de `miningCooldown`
- Possibilité de miner avec n'importe quel outil
- Clic maintenu pour spam-miner

### 🔧 Modifié
- Calcul du temps de minage (millisecondes au lieu de frames)
- Gestion des clics souris (down/up au lieu de maintien)
- Rendu du monde (ajout de la couche de progression)

---

## 🎓 **Guide Rapide**

### Pour les Nouveaux Joueurs

**Objectif** : Obtenir une pioche en fer

1. Coupez un arbre à la main (maintenez clic gauche)
2. Craftez des planches (1 bois = 8 planches)
3. Craftez des bâtons (2 planches = 4 bâtons)
4. Craftez une hache en bois (2 planches + 2 bâtons)
5. Coupez plus d'arbres rapidement
6. Craftez une pioche en bois (3 planches + 2 bâtons)
7. Minez 8 pierres
8. Craftez un four (8 pierres)
9. Trouvez du fer dans les grottes
10. Faites fondre 3 lingots de fer
11. Craftez une pioche en fer (3 lingots + 2 bâtons)
12. Profit ! ⚒️

---

## 📝 **Notes de Version**

**Version 0.18**
- ✅ Refonte complète du système de minage
- ✅ Validation des outils par type de bloc
- ✅ Minage progressif avec feedback visuel
- ✅ Barre de progression et fissures animées
- ✅ Calculs de temps cohérents et réalistes
- ✅ Expérience de jeu nettement améliorée

**Compatibilité**
- ✅ Compatible avec les sauvegardes v0.17
- ✅ Tous les outils existants fonctionnent
- ✅ Balance du gameplay entièrement refaite

---

**Le minage est maintenant stratégique, progressif et visuellement satisfaisant !** ⛏️✨

Bon jeu et bon minage ! 🎮🔨
