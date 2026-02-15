# MINING2D v0.19 - Crafting Flexible & Intelligent

## 🎯 Nouveautés de la version 0.19

### 🔧 **Système de Crafting Complètement Refait**

Le crafting est maintenant **beaucoup plus flexible et intuitif** !

---

## ✨ **Nouvelles Fonctionnalités**

### 1. **Recettes Shapeless (Sans Forme)**

Certaines recettes ne nécessitent plus de placement précis :

#### 🪵 **Planches**
- **Avant v0.19** : ❌ Il fallait mettre le bois EXACTEMENT en haut à gauche
- **Maintenant v0.19** : ✅ Mettez 1 bois N'IMPORTE OÙ dans la grille !

```
Exemples valides :
[Bois] [ ] [ ]    [ ] [Bois] [ ]    [ ] [ ] [ ]
[  ]   [ ] [ ]    [ ] [  ]   [ ]    [ ] [Bois] [ ]
[  ]   [ ] [ ]    [ ] [  ]   [ ]    [ ] [  ]   [ ]
   ✅                ✅                ✅
```

#### 🌿 **Boutures**
- **Avant** : ❌ 9 feuilles exactement disposées en carré 3x3
- **Maintenant** : ✅ 9 feuilles N'IMPORTE OÙ dans la grille

```
Exemples valides :
[F][F][F]    [F][ ][F]    [F][F][ ]
[F][F][F]    [F][F][F]    [F][F][F]
[F][F][F]    [F][ ][F]    [F][F][F]
   ✅            ✅            ✅
```

---

### 2. **Recettes Shaped Flexibles (Avec Décalage)**

Les recettes qui ont une forme précise peuvent maintenant être **décalées** dans la grille !

#### ⚔️ **Épée**
Pattern requis :
```
[Fer]
[Fer]
[Bât]
```

**Maintenant vous pouvez la placer :**

```
Position 1:        Position 2:        Position 3:
[Fer][ ][ ]        [ ][Fer][ ]        [ ][ ][Fer]
[Fer][ ][ ]        [ ][Fer][ ]        [ ][ ][Fer]
[Bât][ ][ ]        [ ][Bât][ ]        [ ][ ][Bât]
   ✅                  ✅                  ✅
```

#### 🥄 **Pelle**
```
Position 1:        Position 2:        Position 3:
[Mat][ ][ ]        [ ][Mat][ ]        [ ][ ][Mat]
[Bât][ ][ ]        [ ][Bât][ ]        [ ][ ][Bât]
[Bât][ ][ ]        [ ][Bât][ ]        [ ][ ][Bât]
   ✅                  ✅                  ✅
```

#### 🪓 **Hache**
```
Position 1:        Position 2:        
[Mat][Mat][ ]      [ ][Mat][Mat]      
[Mat][Bât][ ]      [ ][Mat][Bât]      
[ ][Bât][ ]        [ ][ ][Bât]        
     ✅                  ✅            
```

#### 🔥 **Torche**
```
[Charbon]          [ ][Charbon]       [ ][ ][Charbon]
[Bâton]            [ ][Bâton]         [ ][ ][Bâton]
                        ✅                  ✅
```

---

## 📊 **Tableau Récapitulatif des Recettes**

| Item | Type | Placement |
|------|------|-----------|
| 🪵 **Planches** | Shapeless | 1 bois n'importe où |
| 🌿 **Boutures** | Shapeless | 9 feuilles n'importe où |
| 🪵 **Bâtons** | Shaped Flexible | 2 planches verticales |
| 🔥 **Torche** | Shaped Flexible | Charbon + Bâton vertical |
| ⛏️ **Pioche** | Shaped Centré | 3 matériaux + 2 bâtons (doit être centré) |
| 🪓 **Hache** | Shaped Flexible | 2-3 matériaux + 2 bâtons |
| 🥄 **Pelle** | Shaped Flexible | 1 matériau + 2 bâtons vertical |
| ⚔️ **Épée** | Shaped Flexible | 2 matériaux + 1 bâton vertical |
| 🪜 **Échelle** | Shaped Centré | 7 bâtons en forme H (doit être centré) |
| 🔥 **Four** | Shaped Centré | 8 pierres en carré creux |
| 📦 **Coffre** | Shaped Centré | 8 planches en carré creux |

---

## 🎮 **Impact sur le Gameplay**

### Avant v0.18
```
Joueur : "Je veux faire des planches"
[Place le bois au centre]
❌ Rien ne se passe
[Déplace en haut à droite]
❌ Toujours rien
[Déplace en haut à GAUCHE]
✅ Enfin ! (frustrant)
```

### Après v0.19
```
Joueur : "Je veux faire des planches"
[Place le bois N'IMPORTE OÙ]
✅ Ça marche ! (intuitif)
```

---

## 🛠️ **Modifications Techniques**

### Fichiers Modifiés

#### **blockTypes.js**
- Ajout de la propriété `shapeless: true` pour recettes flexibles
- Nouveau format `ingredients: [id, id, ...]` pour shapeless
- Patterns réduits (sans null inutiles) pour shaped flexibles
- Exemples :
  ```javascript
  // Shapeless
  {
    name: 'Planches (x8)',
    shapeless: true,
    ingredients: [5], // Juste l'ID du bois
    output: { id: 9, count: 8 }
  }
  
  // Shaped flexible
  {
    name: 'Épée en fer',
    pattern: [
      [16],  // Juste la colonne nécessaire
      [16],
      [10]
    ],
    output: { id: 22, count: 1 }
  }
  ```

#### **crafting.js**
Nouvelles fonctions :

1. **`checkRecipe()`** amélioré
   - Détecte automatiquement le type de recette
   - Appelle la bonne fonction de vérification

2. **`matchesShapeless(pattern, ingredients)`**
   - Compte les items présents
   - Compare avec les items requis
   - Ignore la position

3. **`matchesShaped(pattern, recipePattern)`**
   - Essaie tous les décalages possibles
   - Vérifie pattern + zone vide autour

4. **`matchesAtOffset(pattern, recipe, offsetRow, offsetCol)`**
   - Vérifie correspondance à un décalage précis
   - S'assure que le reste de la grille est vide

#### **inputManager.js**
- Réintroduction du **clic maintenu** pour le minage
- Détection automatique du changement de bloc
- Redémarrage automatique du minage sur nouveau bloc

---

## 💡 **Exemples Pratiques**

### Craft de Départ Optimisé

**Objectif** : Faire une pioche en bois le plus vite possible

```
1. Couper un arbre (à la main)
2. Ouvrir craft (E)
3. Mettre 1 bois N'IMPORTE OÙ → 8 planches ✅
4. Récupérer les planches
5. Mettre 2 planches verticales N'IMPORTE OÙ → 4 bâtons ✅
6. Faire pioche : 3 planches + 2 bâtons (centré)
7. Profit ! ⛏️
```

Plus besoin de chercher la bonne position pendant 30 secondes !

---

## 🎯 **Avantages du Nouveau Système**

### Pour les Nouveaux Joueurs
- ✅ **Intuitif** : Pas besoin de mémoriser les positions exactes
- ✅ **Rapide** : Moins de manipulations inutiles
- ✅ **Moins de frustration** : Ça marche du premier coup

### Pour les Joueurs Expérimentés
- ✅ **Efficace** : Craft plus rapide
- ✅ **Fluide** : Moins de micro-management
- ✅ **Naturel** : Focus sur le jeu, pas sur l'UI

---

## 🔍 **Détails d'Implémentation**

### Algorithme de Matching Shapeless

```javascript
1. Extraire tous les items de la grille
2. Compter chaque type d'item
3. Comparer avec les items requis
4. Match si les comptes sont identiques
```

### Algorithme de Matching Shaped

```javascript
Pour chaque position (row, col) possible :
  1. Essayer de placer le pattern à cette position
  2. Vérifier que le pattern correspond
  3. Vérifier que le reste est vide
  4. Si tout OK → Match trouvé
```

**Exemple pour épée (pattern 3×1)** :
- Positions possibles : 3 colonnes × 1 ligne = 3 positions
- Le système teste : [0,0], [0,1], [0,2]

---

## 🎨 **Comparaison Visuelle**

### Craft de Planches

**AVANT (v0.18)** ❌
```
Seule position valide :
[Bois][ ][ ]
[  ]  [ ][ ]
[  ]  [ ][ ]
```

**MAINTENANT (v0.19)** ✅
```
Toutes ces positions marchent :
[Bois][ ][ ]  [ ][Bois][ ]  [ ][ ][Bois]
[  ]  [ ][ ]  [ ][  ]  [ ]  [ ][ ][  ]
[  ]  [ ][ ]  [ ][  ]  [ ]  [ ][ ][  ]

[  ][ ][ ]    [  ][ ][ ]    [  ][ ][ ]
[Bois][ ][ ]  [ ][Bois][ ]  [ ][ ][Bois]
[  ]  [ ][ ]  [ ][  ]  [ ]  [ ][ ][  ]

[  ][ ][ ]    [  ][ ][ ]    [  ][ ][ ]
[  ][ ][ ]    [ ][ ][ ]    [ ][ ][ ]
[Bois][ ][ ]  [ ][Bois][ ]  [ ][ ][Bois]
```

---

## 📈 **Statistiques de Craft**

### Temps Gagné par Session

**Actions répétitives** :
- Planches : ~20 fois par session
- Bâtons : ~10 fois
- Outils : ~5 fois

**Temps économisé** :
- Avant : ~3 secondes de positionnement par craft
- Maintenant : ~0.5 seconde
- **Gain : 2.5 secondes × 35 crafts = 87.5 secondes par session**

Soit **1.5 minute gagnée** par partie de 30 minutes ! 🚀

---

## 🐛 **Corrections de Bugs**

- ✅ Le bois peut maintenant être placé n'importe où
- ✅ Les bâtons ne nécessitent plus d'être en haut à gauche
- ✅ Les torches peuvent être décalées
- ✅ Les épées/pelles/haches ne doivent plus être centrées

---

## 🔮 **Prochaines Versions**

### v0.20 (Planifié)
- 🎒 **Craft depuis l'inventaire** (2×2) pour recettes simples
- 📜 **Livre de recettes** qui se débloque progressivement
- 🔄 **Craft rapide** (double-clic sur output pour craft multiple)

### v0.21 (Planifié)
- 🏭 **Tables de craft** (persistent dans le monde)
- 🔨 **Enclume** pour réparer les outils
- ⚗️ **Alchimie** avec potions

---

## 📝 **Notes de Version**

**Version 0.19**
- ✅ Système de recettes shapeless (sans position)
- ✅ Système de recettes shaped flexibles (avec décalage)
- ✅ Planches craftables n'importe où
- ✅ Boutures craftables n'importe où
- ✅ Tous les outils peuvent être décalés
- ✅ Clic maintenu réintroduit pour le minage
- ✅ Détection automatique de changement de bloc

**Compatibilité**
- ✅ Compatible avec les sauvegardes v0.18
- ✅ Toutes les anciennes recettes fonctionnent toujours
- ✅ UX grandement améliorée

---

## 🎓 **Guide Rapide**

### Craft Intuitif en 3 Étapes

1. **Ouvrir la grille** (E)
2. **Placer les items** (peu importe où pour la plupart)
3. **Récupérer le résultat** (clic sur output)

**Finis les essais-erreurs pour trouver la bonne position !**

---

## 💬 **Feedback des Joueurs**

### Problèmes Résolus

❌ *"Je dois essayer 9 positions différentes pour les planches"*  
✅ **Résolu** : N'importe quelle position marche

❌ *"Pourquoi ma torche ne marche pas au milieu ?"*  
✅ **Résolu** : Toutes les positions verticales marchent

❌ *"Le craft est frustrant et lent"*  
✅ **Résolu** : Craft fluide et intuitif

---

**Le crafting est maintenant naturel, rapide et sans frustration !** ✨🎮

Bon craft et bon jeu ! 🔨⚒️
