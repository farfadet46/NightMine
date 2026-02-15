# MINING2D v0.20 - Système de MODS

## 🎉 Nouveauté Majeure : Système de Mods Complet !

Mining2D supporte maintenant **les mods** ! Vous pouvez facilement créer et partager :
- 🧱 Nouveaux blocs
- ⚒️ Nouveaux outils  
- 🔨 Nouvelles recettes
- 🔥 Recettes de fusion
- ✨ Et bien plus !

---

## 🚀 Utilisation Rapide

### Activer un Mod

1. Placez le fichier du mod (`.js`) dans le dossier `mods/`
2. Éditez `mods/mods.json` :
```json
{
  "mods": ["mon-mod"],
  "enabled": {
    "mon-mod": true
  }
}
```
3. Rechargez le jeu (F5)

### Créer un Mod

Copiez `mods/example-mod.js` et modifiez-le !

---

## 📦 Mods Inclus

### 1. **Example Mod** (Template)
- **Fichier** : `mods/example-mod.js`
- **Contenu** : Template minimal pour démarrer
- **Activé** : Oui par défaut

### 2. **Copper Mod** (Exemple Complet)
- **Fichier** : `mods/copper-mod.js`
- **Contenu** :
  - Minerai de Cuivre (ID: 100)
  - Lingot de Cuivre (ID: 101)
  - Pioche en Cuivre (ID: 102)
  - Hache en Cuivre (ID: 103)
  - Pelle en Cuivre (ID: 104)
  - Épée en Cuivre (ID: 105)
  - Recettes de craft complètes
  - Recette de fusion
- **Activé** : Non par défaut

**Pour activer Copper Mod** :
```json
{
  "mods": ["example-mod", "copper-mod"],
  "enabled": {
    "example-mod": true,
    "copper-mod": true  ← Changez à true
  }
}
```

---

## 📝 Structure d'un Mod

```javascript
export default {
    // Métadonnées (obligatoire)
    name: "Mon Mod",
    version: "1.0.0",
    author: "Votre Nom",
    description: "Description",

    // Nouveaux blocs/items
    blocks: {
        100: { 
            name: 'Mon Bloc', 
            color: '#ff0000',
            solid: true,
            hardness: 1
        }
    },

    // Recettes de craft
    recipes: [
        {
            name: 'Mon Craft',
            shapeless: true,
            ingredients: [1, 1],
            output: { id: 100, count: 1 }
        }
    ],

    // Recettes de fusion
    smeltingRecipes: {
        100: { id: 101, count: 1, time: 3000 }
    },

    // Initialisation
    onLoad: function() {
        console.log('Mod chargé !');
    }
};
```

---

## 🎯 IDs Disponibles pour les Mods

### Plages Réservées
- **1-99** : Jeu de base (NE PAS UTILISER)
- **100-999** : Mods (LIBRE)

### Organisation Recommandée
- **100-199** : Minerais & Matériaux
- **200-299** : Outils
- **300-399** : Armes
- **400-499** : Blocs décoratifs
- **500+** : Libre

---

## 🔧 Propriétés des Blocs

### Obligatoires
```javascript
name: 'Nom du Bloc'      // Nom affiché
color: '#ff5733'         // Couleur hexadécimale
solid: true              // true = solide, false = traversable
```

### Optionnelles
```javascript
hardness: 2              // Difficulté à miner
minableWith: ['pickaxe'] // Outils acceptés
isItem: true             // Item non-posable
tool: true               // Est un outil
toolType: 'pickaxe'      // Type d'outil
efficiency: 6            // Vitesse de minage
miningPower: 2           // Niveau d'outil
weapon: true             // Est une arme
damage: 4                // Dégâts
isFuel: true             // Combustible
fuelTime: 8000           // Durée combustion (ms)
```

---

## 📖 Guide Complet

Consultez **`mods/MOD_GUIDE.md`** pour :
- ✅ Tutoriels pas à pas
- ✅ Exemples de code complets
- ✅ Référence des propriétés
- ✅ Bonnes pratiques
- ✅ Debugging

---

## 💡 Exemples d'Utilisation

### Ajouter un Minerai Simple

```javascript
blocks: {
    150: {
        name: 'Rubis',
        color: '#e74c3c',
        solid: true,
        hardness: 3,
        minableWith: ['pickaxe']
    }
}
```

### Ajouter un Outil Puissant

```javascript
blocks: {
    250: {
        name: 'Super Pioche',
        color: '#3498db',
        solid: false,
        isItem: true,
        tool: true,
        toolType: 'pickaxe',
        efficiency: 10,
        miningPower: 3
    }
}
```

### Recette Shapeless

```javascript
recipes: [
    {
        name: 'Alliage',
        shapeless: true,
        ingredients: [16, 17],  // Fer + Or
        output: { id: 300, count: 1 }
    }
]
```

### Recette Shaped

```javascript
recipes: [
    {
        name: 'Épée',
        pattern: [
            [16],  // Fer
            [16],  // Fer
            [10]   // Bâton
        ],
        output: { id: 301, count: 1 }
    }
]
```

---

## 🐛 Debug

Ouvrez la console (F12) pour voir :

```
[MOD] Chargement des mods...
[MOD] Chargement de "Example Mod" v1.0.0
  ✓ Bloc ajouté : Mon Bloc (ID: 100)
  ✓ Recette ajoutée : Mon Craft
[MOD] "Example Mod" chargé avec succès !
[MOD] 1 mod(s) chargé(s)
=== MODS CHARGÉS ===
Example Mod v1.0.0 par Votre Nom
  Description de votre mod
===================
```

---

## 📂 Structure des Fichiers

```
Mining2D/
├── index.html
├── game.js
├── modManager.js         ← NOUVEAU
├── ... (autres fichiers)
└── mods/                 ← NOUVEAU DOSSIER
    ├── mods.json         ← Configuration
    ├── MOD_GUIDE.md      ← Guide complet
    ├── example-mod.js    ← Template simple
    └── copper-mod.js     ← Exemple complet
```

---

## ⚠️ Limitations

### Ce qui fonctionne
- ✅ Ajout de blocs/items
- ✅ Ajout de recettes
- ✅ Ajout de recettes de fusion
- ✅ Modification des propriétés
- ✅ Fonction d'initialisation

### Ce qui ne fonctionne pas encore
- ❌ Génération de minerais dans le monde
- ❌ Mobs personnalisés
- ❌ Biomes personnalisés
- ❌ Events personnalisés
- ❌ UI personnalisée

---

## 🎓 Tutoriel Complet

### Créer un Mod "Émeraude"

**1. Créer le fichier `mods/emerald-mod.js`**

```javascript
export default {
    name: "Emerald Mod",
    version: "1.0.0",
    author: "Vous",
    description: "Ajoute l'émeraude",

    blocks: {
        120: {
            name: 'Minerai d\'Émeraude',
            color: '#2ecc71',
            solid: true,
            hardness: 4,
            minableWith: ['pickaxe']
        },
        121: {
            name: 'Lingot d\'Émeraude',
            color: '#27ae60',
            solid: false,
            isItem: true
        },
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
    }
};
```

**2. Activer dans `mods/mods.json`**

```json
{
  "mods": ["example-mod", "emerald-mod"],
  "enabled": {
    "example-mod": true,
    "emerald-mod": true
  }
}
```

**3. Recharger le jeu**

Appuyez sur F5 et vérifiez la console !

---

## 🔥 Mods Communautaires

Partagez vos mods et découvrez ceux des autres !

### Comment Partager
1. Testez votre mod
2. Créez un README
3. Partagez le fichier `.js`

### Mods Populaires (Exemples)
- **Magic Mod** : Baguettes magiques et sorts
- **Tech Mod** : Machines automatiques
- **Decoration Mod** : 50+ blocs décoratifs
- **RPG Mod** : Armes et armures avancées

---

## 🎨 Palette de Couleurs

### Minerais
```
#cd7f32  Cuivre
#c0c0c0  Argent  
#ffd700  Or
#e74c3c  Rubis
#3498db  Saphir
#2ecc71  Émeraude
#9b59b6  Améthyste
```

### Matériaux
```
#8b4513  Bois
#708090  Pierre
#2c3e50  Obsidienne
#ecf0f1  Marbre
#e67e22  Brique
```

---

## 📋 Checklist de Création

Avant de publier votre mod :

- [ ] Testé en jeu
- [ ] IDs uniques (100-999)
- [ ] Métadonnées complètes (name, version, author)
- [ ] Couleurs cohérentes
- [ ] Recettes équilibrées
- [ ] Pas d'erreurs console
- [ ] Documentation (README)
- [ ] Testé avec d'autres mods

---

## 💬 Support

### Erreurs Courantes

**"Le mod est invalide"**
→ Vérifiez name, version, author

**"Bloc X invalide"**  
→ Vérifiez name et color

**"Cannot import module"**
→ Vérifiez le nom du fichier

### Obtenir de l'Aide

1. Consultez `mods/MOD_GUIDE.md`
2. Vérifiez la console (F12)
3. Comparez avec les exemples

---

## 🚀 Évolutions Futures

### v0.21 (Prévu)
- Generation de minerais custom dans le monde
- API pour mobs personnalisés
- Events système (onBlockBreak, onCraft, etc.)

### v0.22 (Prévu)
- Biomes personnalisés
- Structures générées (maisons, donjons)
- UI personnalisable

---

## 📊 Résumé

✅ **Système de mods fonctionnel**  
✅ **Ajout facile de blocs/outils**  
✅ **Recettes personnalisées**  
✅ **Configuration simple**  
✅ **Guide complet inclus**  
✅ **2 mods d'exemple**  

**Le modding est maintenant accessible à tous !** 🎉

---

**Bon modding et bonne création !** 🛠️✨

*Consultez `mods/MOD_GUIDE.md` pour le guide détaillé*
