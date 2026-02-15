# MINING2D v0.17 - Système de Dureté et Outils en Bois

## 🎯 Nouveautés Majeures de la version 0.17

### ⚙️ **Système de Dureté des Blocs**

Chaque bloc a maintenant une **dureté** (hardness) qui détermine le temps nécessaire pour le miner !

#### Table de Dureté
| Bloc | Dureté | Temps à la main | Temps outil bois | Temps outil fer |
|------|--------|----------------|------------------|-----------------|
| Feuilles | 0.2 | Rapide | Très rapide | Instantané |
| Terre | 0.5 | Moyen | Rapide | Très rapide |
| Herbe | 0.6 | Moyen | Rapide | Très rapide |
| Pierre | 1.5 | **TRÈS LENT** | Lent | Rapide |
| Bois/Planches | 2.0 | **TRÈS LENT** | Rapide | Très rapide |
| Four/Coffre | 2.0-2.5 | **TRÈS LENT** | Rapide | Très rapide |
| Charbon/Fer | 3.0 | **IMPOSSIBLE** | **TRÈS LENT** | Moyen |
| Diamant | 3.0 | **IMPOSSIBLE** | **TRÈS LENT** | Moyen |

### 🔨 **Nouveaux Outils en Bois**

4 nouveaux outils craftables avec des planches :

1. **Pioche en bois** (ID: 23)
   - Craft : 3 planches en haut + 2 bâtons
   - Efficacité : 2x (power: 0)
   - Parfait pour débuter le minage de pierre

2. **Hache en bois** (ID: 24)
   - Craft : 2 planches en L + 2 bâtons
   - Efficacité : 2x
   - Idéale pour couper du bois rapidement

3. **Pelle en bois** (ID: 25)
   - Craft : 1 planche + 2 bâtons
   - Efficacité : 2x
   - Optimale pour creuser terre et herbe

4. **Épée en bois** (ID: 26)
   - Craft : 2 planches verticales + 1 bâton
   - Dégâts : 2 points
   - Arme de base

### 📊 **Comparatif des Outils**

#### Efficacité (efficiency)
- **Bois** : 2x plus rapide que la main
- **Fer** : 6x plus rapide que la main

#### Puissance de Minage (miningPower)
- **Bois** : Niveau 0 (peut miner pierre avec difficulté)
- **Fer** : Niveau 2 (mine facilement tous les minerais)

### 🎮 **Nouvelles Mécaniques de Gameplay**

#### Système Intelligent d'Outils
Le jeu détecte maintenant **quel outil est le bon** pour chaque bloc :

- **Pioche** → Pierre, Charbon, Fer, Diamant
- **Hache** → Bois, Planches
- **Pelle** → Terre, Herbe

#### Calcul du Temps de Minage
```
Temps = (Dureté × Base_Cooldown) / Efficacité_Outil

Exemples:
- Pierre à la main : 1.5 × 15 × 5 = 112.5 frames (TRÈS LENT!)
- Pierre avec pioche bois : (1.5 × 15) / 2 = 11.25 frames (OK)
- Pierre avec pioche fer : (1.5 × 15) / 6 = 3.75 frames (RAPIDE!)
```

#### Pénalité de Mauvais Outil
Si vous utilisez le **mauvais outil** (ex: pioche sur du bois) :
- Efficacité réduite à 30% du bonus de l'outil
- Toujours mieux qu'à la main, mais pas optimal !

### 🌳 **Progression Logique**

**Début de Partie :**
1. ✋ Ramassez du bois **à la main** (lent mais possible)
2. 🔨 Craftez des **outils en bois**
3. ⛏️ Minez de la pierre avec la pioche en bois
4. 🏭 Créez un **four** et faites fondre du fer
5. 🔧 Craftez des **outils en fer** (beaucoup plus efficaces)
6. 💎 Minez des minerais rares rapidement !

### 📋 **Recettes des Outils en Bois**

```
PIOCHE EN BOIS
[Plan] [Plan] [Plan]
[    ] [Bât] [    ]
[    ] [Bât] [    ]

HACHE EN BOIS
[Plan] [Plan] [    ]
[Plan] [Bât] [    ]
[    ] [Bât] [    ]

PELLE EN BOIS
[    ] [Plan] [    ]
[    ] [Bât] [    ]
[    ] [Bât] [    ]

ÉPÉE EN BOIS
[    ] [Plan] [    ]
[    ] [Plan] [    ]
[    ] [Bât] [    ]
```

### 💡 **Stratégies et Astuces**

#### Optimisation du Minage
- **Toujours utiliser le bon outil** pour gagner du temps
- Pioche en bois → accès à la pierre
- Pioche en fer → accès aux minerais profonds
- Hache → récolte de bois massive pour constructions

#### Gestion des Ressources
- Commencez par **4 planches** = 1 pioche en bois
- La pioche permet de miner **beaucoup de pierre**
- 8 pierres = 1 four pour fondre le fer
- 3 lingots de fer = 1 pioche en fer (très efficace)

### 🎨 **Améliorations Visuelles**

#### Nouvelles Icônes
- Outils en bois : Teinte marron clair (#8b6f47)
- Outils en fer : Teinte gris métallique (#78909c)
- Reflets et ombres pour différencier les matériaux

#### Rendu en Main
Tous les outils en bois sont maintenant visibles quand vous les tenez !

### 🔧 **Modifications Techniques**

#### Fichiers Modifiés

**blockTypes.js**
- Ajout de `hardness` sur tous les blocs solides
- 4 nouveaux outils en bois (IDs 23-26)
- Propriétés `toolType`, `miningPower`, `efficiency`
- Recettes de craft pour outils en bois

**game.js**
- Nouvelle fonction `getMiningSpeed(blockId, toolId)`
- Calcul intelligent : dureté + efficacité + type d'outil
- Système de bonus/pénalité selon l'outil utilisé
- 10 planches ajoutées à l'inventaire de départ

**renderer.js**
- Rendu de tous les outils en bois dans `drawHeldItem()`
- Différenciation visuelle bois vs fer

**index.html**
- Styles CSS pour icônes d'outils en bois
- Version mise à jour : v0.17

**constants.js**
- `BASE_MINING_COOLDOWN` : 15 frames

### 📈 **Impact sur le Gameplay**

#### Avant v0.17
- Tous les blocs se minaient à la même vitesse
- Les outils n'avaient aucune utilité réelle
- Pas de progression logique

#### Après v0.17
- ✅ Progression naturelle : main → bois → fer
- ✅ Les outils sont **essentiels** pour miner efficacement
- ✅ Choix stratégiques : quel outil pour quelle tâche ?
- ✅ La pierre est **impossible** à miner rapidement sans pioche
- ✅ Les minerais nécessitent de bons outils

### 🎯 **Items de Départ Mis à Jour**

Vous commencez avec :
- 5x Terre
- 16x Pierre
- 10x Torches
- **10x Planches** (NOUVEAU!)
- 3x Lingots de fer

Les planches permettent de crafter immédiatement une pioche en bois !

### 🐛 **Corrections de Bugs**

- ✅ Les outils en fer sont maintenant **vraiment plus rapides**
- ✅ Système de minage cohérent et prévisible
- ✅ Calculs de vitesse optimisés

### 🔮 **Prochaines Versions**

- **v0.18** : Outils en pierre (entre bois et fer)
- **v0.19** : Durabilité des outils (ils s'usent)
- **v0.20** : Système de santé et dégâts
- **v0.21** : Mobs et combats

---

## 📊 Résumé des Changements

✅ Système de dureté sur tous les blocs  
✅ 4 outils en bois craftables  
✅ Progression naturelle main → bois → fer  
✅ Calcul intelligent du temps de minage  
✅ Bonus/pénalité selon le bon/mauvais outil  
✅ Nouvelles icônes pour outils en bois  
✅ Balance du gameplay complètement refaite  

**Migration depuis v0.16** : Compatible ! Le gameplay est plus réaliste et équilibré.

**Le minage n'a jamais été aussi satisfaisant !** ⛏️🌲

---

## 🎓 Guide Rapide

**Pour un nouveau joueur :**
1. Récupérez du **bois** en cassant un arbre (lent à la main)
2. Craftez des **planches** (1 bois = 8 planches)
3. Craftez une **pioche en bois** (3 planches + 2 bâtons)
4. Minez de la **pierre** avec la pioche
5. Craftez un **four** (8 pierres)
6. Trouvez du **fer** dans les grottes
7. Faites fondre le fer en **lingots**
8. Craftez des **outils en fer** (bien meilleurs !)

Bon minage ! 🎮⚒️
