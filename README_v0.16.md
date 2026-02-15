# MINING2D v0.16 - Outils et Lingots

## Nouveautés de la version 0.16

### 🔨 **Système d'Outils en Fer**

#### Nouveaux Items Craftables
1. **Pioche en fer** (ID: 19)
   - Craft : 3 lingots de fer en haut, 2 bâtons au milieu
   - Vitesse de minage : **2.5x plus rapide** qu'à la main
   - Parfaite pour creuser la pierre et les minerais

2. **Hache en fer** (ID: 20)
   - Craft : 2 lingots de fer en forme de L + 2 bâtons
   - Vitesse de coupe : **2.5x plus rapide**
   - Idéale pour abattre les arbres rapidement

3. **Pelle en fer** (ID: 21)
   - Craft : 1 lingot de fer en haut + 2 bâtons
   - Vitesse de creusage : **2.5x plus rapide**
   - Optimale pour creuser la terre et le sable

4. **Épée en fer** (ID: 22)
   - Craft : 2 lingots de fer verticaux + 1 bâton
   - Dégâts : 4 points
   - Prête pour les futurs combats !

### ✨ **Nouvelles Icônes**

#### Lingots Redesignés
- **Lingot de fer** : Nouvelle icône avec reflets métalliques gris argenté
- **Lingot d'or** : Nouvelle icône avec reflets dorés brillants
- Fini les carrés de couleur, maintenant ce sont de vrais lingots !

#### Icônes d'Outils
Chaque outil a son propre design unique :
- 🔨 **Pioche** : Tête grise avec manche en bois
- 🪓 **Hache** : Lame en fer avec manche incliné
- 🥄 **Pelle** : Tête plate avec long manche
- ⚔️ **Épée** : Lame grise avec garde en bois

### 🎮 **Mécaniques de Gameplay**

#### Vitesse de Minage Variable
- **Sans outil** : Vitesse normale (cooldown de 15)
- **Avec pioche/hache/pelle** : Vitesse 2.5x supérieure (cooldown de 6)
- Le système détecte automatiquement l'outil en main

#### Utilisation des Outils
- Équipez simplement l'outil dans votre hotbar
- Le minage devient automatiquement plus rapide
- Les outils ne s'usent pas (pour l'instant - durabilité à venir ?)

### 📊 **Recettes de Craft Détaillées**

```
PIOCHE EN FER
[Fer] [Fer] [Fer]
[  ] [Bât] [  ]
[  ] [Bât] [  ]

HACHE EN FER
[Fer] [Fer] [  ]
[Fer] [Bât] [  ]
[  ] [Bât] [  ]

PELLE EN FER
[  ] [Fer] [  ]
[  ] [Bât] [  ]
[  ] [Bât] [  ]

ÉPÉE EN FER
[  ] [Fer] [  ]
[  ] [Fer] [  ]
[  ] [Bât] [  ]
```

### 🎯 **Stratégie de Progression**

1. **Miner du fer brut** dans les grottes
2. **Faire fondre le fer** dans un four (avec du charbon/bois)
3. **Obtenir des lingots de fer**
4. **Crafter des outils** pour miner plus vite
5. **Optimiser votre efficacité** de récolte

### 💡 **Conseils d'Utilisation**

- **Pioche** : Utilisez-la pour tout ce qui est pierre, minerai, bedrock
- **Hache** : Parfaite pour récolter du bois rapidement
- **Pelle** : Idéale pour terraformer (terre, herbe)
- **Épée** : Gardez-la dans votre inventaire pour les futurs mobs !

### 🔧 **Modifications Techniques**

#### Fichiers Modifiés
- **blockTypes.js** : 
  - Ajout des 4 nouveaux outils (IDs 19-22)
  - Ajout de toutes les recettes de craft
  - Propriétés `tool`, `miningSpeed`, `weapon`, `damage`

- **constants.js** :
  - Nouvelle constante `BASE_MINING_COOLDOWN`
  - Séparation du cooldown de base et du cooldown actif

- **game.js** :
  - Fonction `handleMining()` améliorée avec calcul de vitesse
  - Nouvelles icônes pour lingots et outils dans `getIconHTML()`
  - 3 lingots de fer ajoutés à l'inventaire de départ

- **renderer.js** :
  - Fonction `drawHeldItem()` étendue avec rendu de tous les outils
  - Chaque outil a son propre dessin en pixel art

- **index.html** :
  - Styles CSS pour toutes les nouvelles icônes
  - Gradients pour les lingots (effet métallique)
  - Version mise à jour : v0.16

### 🎨 **Design des Icônes**

Toutes les icônes utilisent maintenant du CSS avancé :
- **Gradients** pour les reflets métalliques
- **Box-shadows** pour la profondeur 3D
- **Pseudo-éléments** (::before, ::after) pour les détails
- **Pixel-perfect** pour un style rétro cohérent

### 🚀 **Performance**

- Aucun impact sur les performances
- Les calculs de vitesse sont optimisés
- Rendering des outils en cache automatique

### 📝 **Items de Départ Mis à Jour**

Vous commencez maintenant avec :
- 5x Terre
- 16x Pierre
- 10x Torches
- **3x Lingots de fer** (NOUVEAU !)

Cela vous permet de tester immédiatement le craft d'outils !

### 🔮 **Prochaines Versions Envisagées**

- **v0.17** : Durabilité des outils (ils s'usent)
- **v0.18** : Outils en bois et en pierre (progression)
- **v0.19** : Système de santé et combat
- **v0.20** : Mobs hostiles et drops

---

## Résumé des Changements

✅ 4 nouveaux outils craftables en fer  
✅ Redesign complet des icônes de lingots  
✅ Système de vitesse de minage variable  
✅ Rendu des outils tenus en main  
✅ Nouvelles recettes de craft  
✅ Icônes CSS pixel art détaillées  

**Migration depuis v0.15** : Aucune action requise, totalement compatible !

Bon minage avec vos nouveaux outils ! ⛏️
