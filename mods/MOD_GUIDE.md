# 📦 GUIDE DE CRÉATION DE MODS - MINING2D

## 🎯 Introduction

Ce guide vous explique comment créer vos propres mods pour Mining2D et ajouter :
- 🧱 Nouveaux blocs
- ⚒️ Nouveaux outils
- 🔨 Nouvelles recettes de craft
- 🔥 Nouvelles recettes de fusion
- ✨ Et plus encore !

---

## 🚀 Démarrage Rapide

### Étape 1 : Créer votre fichier de mod

1. Allez dans le dossier `mods/`
2. Créez un nouveau fichier : `mon-mod.js`
3. Copiez le contenu de `example-mod.js` comme base

### Étape 2 : Activer votre mod

Éditez `mods/mods.json` :
```json
{
  "mods": [
    "example-mod",
    "mon-mod"        ← Ajoutez votre mod
  ],
  "enabled": {
    "example-mod": true,
    "mon-mod": true  ← Activez-le
  }
}
```

### Étape 3 : Recharger le jeu

Rafraîchissez la page (F5) et votre mod sera chargé !

---

## 📋 Structure d'un Mod

```javascript
export default {
    // === MÉTADONNÉES (OBLIGATOIRE) ===
    name: "Nom du Mod",
    version: "1.0.0",
    author: "Votre Nom",
    description: "Description courte",

    // === CONTENU (OPTIONNEL) ===
    blocks: { /* Nouveaux blocs */ },
    recipes: [ /* Nouvelles recettes */ ],
    smeltingRecipes: { /* Fusion */ },
    onLoad: function() { /* Init */ }
};
```

---

## 🧱 Ajouter des Blocs

### Plage d'IDs Disponibles
- **100-999** : Réservés aux mods
- **1-99** : Réservés au jeu de base

### Propriétés d'un Bloc

```javascript
blocks: {
    100: {
        // === OBLIGATOIRE ===
        name: 'Mon Bloc',           // Nom affiché
        color: '#ff5733',           // Couleur hexadécimale
        solid: true,                // true = solide, false = traversable
        
        // === OPTIONNEL ===
        hardness: 2,                // Durée de minage (0.1 = rapide, 5 = lent)
        minableWith: ['pickaxe'],   // Outils acceptés
        unbreakable: false,         // Incassable ?
        light: false,               // Émet de la lumière ?
        climbable: false,           // Grimpable (échelle) ?
        isItem: false,              // Item non-posable ?
        isFuel: false,              // Utilisable comme combustible ?
        fuelTime: 0,                // Temps de combustion (ms)
        
        // === POUR LES OUTILS ===
        tool: false,                // Est un outil ?
        toolType: 'pickaxe',        // Type : pickaxe, axe, shovel
        efficiency: 1,              // Vitesse (1 = lent, 10 = rapide)
        miningPower: 0,             // Niveau (0 = bois, 1 = pierre, 2 = fer)
        
        // === POUR LES ARMES ===
        weapon: false,              // Est une arme ?
        damage: 1                   // Dégâts
    }
}
```

### Exemples de Blocs

#### Bloc Décoratif Simple
```javascript
200: {
    name: 'Marbre',
    color: '#f0f0f0',
    solid: true,
    hardness: 2
}
```

#### Minerai Minable
```javascript
201: {
    name: 'Rubis',
    color: '#e74c3c',
    solid: true,
    hardness: 3,
    minableWith: ['pickaxe']  // Pioche obligatoire
}
```

#### Outil Puissant
```javascript
202: {
    name: 'Pioche en Diamant',
    color: '#3498db',
    solid: false,
    isItem: true,
    tool: true,
    toolType: 'pickaxe',
    efficiency: 10,           // Très rapide
    miningPower: 3            // Mine tout
}
```

#### Arme
```javascript
203: {
    name: 'Épée Légendaire',
    color: '#9b59b6',
    solid: false,
    isItem: true,
    weapon: true,
    damage: 10
}
```

---

## 🔨 Ajouter des Recettes de Craft

### Type 1 : Shapeless (Position Libre)

Les items peuvent être placés **n'importe où** dans la grille.

```javascript
recipes: [
    {
        name: 'Poudre Magique',
        shapeless: true,
        ingredients: [4, 7, 8],  // Diamant + Charbon + Fer
        output: { id: 250, count: 1 }
    }
]
```

**Exemples valides :**
```
[D][ ][ ]    [ ][C][ ]    [ ][ ][ ]
[C][F][ ]    [D][ ][F]    [D][C][F]
[ ][ ][ ]    [ ][ ][ ]    [ ][ ][ ]
```

### Type 2 : Shaped (Forme Précise)

Le pattern doit être respecté mais peut être **décalé** dans la grille.

```javascript
recipes: [
    {
        name: 'Baguette Magique',
        pattern: [
            [4],    // Diamant
            [10],   // Bâton
            [10]    // Bâton
        ],
        output: { id: 251, count: 1 }
    }
]
```

**Positions possibles :**
```
[D][ ][ ]    [ ][D][ ]    [ ][ ][D]
[B][ ][ ]    [ ][B][ ]    [ ][ ][B]
[B][ ][ ]    [ ][B][ ]    [ ][ ][B]
```

### Type 3 : Shaped Complexe

```javascript
{
    name: 'Armure',
    pattern: [
        [16, null, 16],  // Fer   Fer
        [16, 16, 16],    // Fer Fer Fer
        [16, null, 16]   // Fer   Fer
    ],
    output: { id: 252, count: 1 }
}
```

---

## 🔥 Ajouter des Recettes de Fusion

Transformation d'items dans un four.

```javascript
smeltingRecipes: {
    // ID_INPUT: { id: ID_OUTPUT, count: QUANTITE, time: TEMPS_MS }
    
    201: { id: 210, count: 1, time: 3000 },  // Rubis → Lingot (3s)
    100: { id: 101, count: 2, time: 1500 }   // Cuivre → 2 Lingots (1.5s)
}
```

---

## 🎨 Codes Couleur Recommandés

### Minerais
```javascript
'#cd7f32'  // Cuivre (bronze)
'#c0c0c0'  // Argent
'#ffd700'  // Or
'#e74c3c'  // Rubis (rouge)
'#3498db'  // Saphir (bleu)
'#2ecc71'  // Émeraude (vert)
'#9b59b6'  // Améthyste (violet)
```

### Matériaux
```javascript
'#8b4513'  // Bois marron
'#708090'  // Pierre grise
'#2c3e50'  // Obsidienne noire
'#ecf0f1'  // Marbre blanc
'#e67e22'  // Brique orange
```

---

## ⚙️ Propriétés Avancées

### minableWith - Outils Acceptés

```javascript
minableWith: ['hand']                    // Main uniquement
minableWith: ['pickaxe']                 // Pioche uniquement
minableWith: ['axe', 'hand']             // Hache OU main
minableWith: ['pickaxe', 'axe', 'shovel'] // N'importe quel outil
```

### Hardness - Durée de Minage

| Hardness | Exemple | Description |
|----------|---------|-------------|
| 0.2 | Feuilles | Instantané |
| 0.5 | Terre | Rapide |
| 1.5 | Pierre | Normal |
| 2.5 | Minerai | Lent |
| 4.0 | Obsidienne | Très lent |

### Efficiency - Vitesse d'Outil

| Efficiency | Exemple | Vitesse |
|------------|---------|---------|
| 0.2 | Main | Très lent |
| 2 | Outils bois | Normal |
| 4 | Outils cuivre | Rapide |
| 6 | Outils fer | Très rapide |
| 10 | Outils diamant | Extrême |

### Mining Power - Niveau d'Outil

| Level | Peut Miner |
|-------|------------|
| 0 | Pierre seulement |
| 1 | Pierre + Fer |
| 2 | Tout sauf bedrock |
| 3 | Tout + minerais spéciaux |

---

## 🔧 Fonction onLoad()

Exécutée quand le mod est chargé. Utile pour :
- Logs de debug
- Modifications avancées
- Initialisation de systèmes personnalisés

```javascript
onLoad: function() {
    console.log('[MON MOD] Chargé !');
    
    // Ajouter des items de départ au joueur
    // Note : Nécessite accès à l'objet game
    
    // Afficher un message
    alert('Mod installé avec succès !');
}
```

---

## 📦 Exemples de Mods Complets

### Mod "Bronze Age"

```javascript
export default {
    name: "Bronze Age",
    version: "1.0.0",
    author: "Steve",
    description: "Ajoute le bronze et des outils en bronze",

    blocks: {
        110: { 
            name: 'Minerai d\'Étain', 
            color: '#8b8b8b', 
            solid: true, 
            hardness: 2,
            minableWith: ['pickaxe']
        },
        111: { 
            name: 'Lingot d\'Étain', 
            color: '#c0c0c0', 
            solid: false,
            isItem: true
        },
        112: { 
            name: 'Lingot de Bronze', 
            color: '#cd7f32', 
            solid: false,
            isItem: true
        },
        113: {
            name: 'Pioche en Bronze',
            color: '#cd7f32',
            solid: false,
            isItem: true,
            tool: true,
            toolType: 'pickaxe',
            efficiency: 5,
            miningPower: 1
        }
    },

    recipes: [
        {
            name: 'Bronze (Alliage)',
            shapeless: true,
            ingredients: [101, 111],  // Cuivre + Étain
            output: { id: 112, count: 2 }
        },
        {
            name: 'Pioche en Bronze',
            pattern: [
                [112, 112, 112],
                [null, 10, null],
                [null, 10, null]
            ],
            output: { id: 113, count: 1 }
        }
    ],

    smeltingRecipes: {
        110: { id: 111, count: 1, time: 2500 }
    }
};
```

---

## 🐛 Debugging

### Vérifier si votre mod est chargé

Ouvrez la console (F12) et cherchez :
```
[MOD] Chargement de "Votre Mod" v1.0.0
  ✓ Bloc ajouté : ...
  ✓ Recette ajoutée : ...
[MOD] "Votre Mod" chargé avec succès !
```

### Erreurs Courantes

**"Le mod est invalide"**
→ Vérifiez que `name`, `version`, `author` sont présents

**"Bloc X invalide"**
→ Vérifiez que le bloc a `name` et `color`

**"Recette Y invalide"**
→ Vérifiez que la recette a `name` et `output`

**"Cannot import module"**
→ Vérifiez le nom du fichier et `mods.json`

---

## 💡 Astuces & Bonnes Pratiques

### IDs de Blocs
- **100-199** : Minerais et matériaux
- **200-299** : Outils
- **300-399** : Armes
- **400-499** : Blocs décoratifs
- **500+** : Libre

### Nommage
- Utilisez des noms clairs : `copper-mod.js` ✅
- Évitez les espaces : `my mod.js` ❌

### Versions
- Format : `MAJOR.MINOR.PATCH`
- Exemple : `1.0.0` → `1.1.0` → `2.0.0`

### Compatibilité
- Ne modifiez jamais les IDs 1-99
- N'utilisez pas d'IDs déjà pris par d'autres mods
- Testez avec et sans autres mods actifs

---

## 🎓 Tutoriel : Créer un Mod Complet

### Objectif
Créer un mod qui ajoute l'**Émeraude** :
- Minerai d'émeraude
- Lingot d'émeraude
- Pioche en émeraude (très puissante)

### Code Complet

```javascript
export default {
    name: "Emerald Mod",
    version: "1.0.0",
    author: "Vous",
    description: "Ajoute l'émeraude, un minerai rare et puissant",

    blocks: {
        // Minerai (dans le sol)
        120: {
            name: 'Minerai d\'Émeraude',
            color: '#2ecc71',
            solid: true,
            hardness: 4,
            minableWith: ['pickaxe']
        },
        
        // Lingot (après fusion)
        121: {
            name: 'Lingot d\'Émeraude',
            color: '#27ae60',
            solid: false,
            isItem: true
        },
        
        // Pioche (outil)
        122: {
            name: 'Pioche en Émeraude',
            color: '#2ecc71',
            solid: false,
            isItem: true,
            tool: true,
            toolType: 'pickaxe',
            efficiency: 8,
            miningPower: 2
        }
    },

    recipes: [
        {
            name: 'Pioche en Émeraude',
            pattern: [
                [121, 121, 121],
                [null, 10, null],
                [null, 10, null]
            ],
            output: { id: 122, count: 1 }
        }
    ],

    smeltingRecipes: {
        120: { id: 121, count: 1, time: 4000 }
    },

    onLoad: function() {
        console.log('💎 Émeraude ajoutée au jeu !');
    }
};
```

---

## 📚 Référence Complète des IDs

### Blocs Vanille (1-99)
```
1  = Terre          11 = Torche         21 = Pelle Fer
2  = Pierre         12 = Bouture        22 = Épée Fer
3  = Herbe          13 = Échelle        23 = Pioche Bois
4  = Diamant        14 = Four           24 = Hache Bois
5  = Bois           15 = Charbon Bois   25 = Pelle Bois
6  = Feuilles       16 = Lingot Fer     26 = Épée Bois
7  = Charbon        17 = Lingot Or      99 = Bedrock
8  = Fer            18 = Coffre
9  = Planches       19 = Pioche Fer
10 = Bâton          20 = Hache Fer
```

### Réservés Mods (100+)
```
100-199 = Minerais & Matériaux
200-299 = Outils
300-399 = Armes
400-499 = Décoratifs
500+    = Libre
```

---

## 🎉 Partager Votre Mod

1. Testez votre mod
2. Documentez-le (README)
3. Partagez le fichier `.js`
4. Indiquez les dépendances éventuelles

---

**Bon modding ! 🚀**

*Pour toute question ou aide, consultez la console (F12)*
