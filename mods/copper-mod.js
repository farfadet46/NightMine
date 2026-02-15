/**
 * MOD EXEMPLE - Ajoute le Cuivre
 * 
 * Ce mod montre comment ajouter un nouveau minerai complet avec :
 * - Minerai de cuivre (bloc)
 * - Lingot de cuivre (item)
 * - Outils en cuivre (pioche, hache, pelle, épée)
 * - Recettes de craft
 * - Recette de fusion
 * 
 * NOTE : Utilisez des noms pour vos blocs, pas de numéros !
 */

// Variable globale MODS (créée automatiquement si elle n'existe pas)
if (typeof MODS === 'undefined') {
    MODS = [];
}

// Ajouter le mod Copper au tableau
MODS.push({
    // Métadonnées du mod
    name: "Copper Mod",
    version: "1.0.0",
    author: "Mining2D Team",
    description: "Ajoute le cuivre et des outils en cuivre",

    // Nouveaux blocs/items avec des NOMS comme clés
    blocks: {
        'copper_ore': { 
            name: 'Minerai de Cuivre', 
            color: '#cd7f32', 
            solid: true, 
            hardness: 2.5,
            minableWith: ['pickaxe'],
            // GÉNÉRATION DANS LE MONDE
            worldGen: {
                rarity: 0.018,      // 1.8% de chance (entre charbon 2% et fer 1.5%)
                minDepth: 10,       // Commence à partir de Y=10
                maxDepth: 70,       // Jusqu'à Y=70
                veinSize: 3         // Taille des filons (3x3)
            }
        },
        'copper_ingot': { 
            name: 'Lingot de Cuivre', 
            color: '#d4956d', 
            solid: false,
            isItem: true
        },
        'copper_pickaxe': {
            name: 'Pioche en Cuivre',
            color: '#cd7f32',
            solid: false,
            isItem: true,
            tool: true,
            toolType: 'pickaxe',
            miningPower: 1,
            efficiency: 4
        },
        'copper_axe': {
            name: 'Hache en Cuivre',
            color: '#cd7f32',
            solid: false,
            isItem: true,
            tool: true,
            toolType: 'axe',
            miningPower: 1,
            efficiency: 4
        },
        'copper_shovel': {
            name: 'Pelle en Cuivre',
            color: '#cd7f32',
            solid: false,
            isItem: true,
            tool: true,
            toolType: 'shovel',
            miningPower: 1,
            efficiency: 4
        },
        'copper_sword': {
            name: 'Épée en Cuivre',
            color: '#cd7f32',
            solid: false,
            isItem: true,
            weapon: true,
            damage: 3
        }
    },

    // Nouvelles recettes de craft (utilisez les noms !)
    recipes: [
        {
            name: 'Pioche en Cuivre',
            pattern: [
                ['copper_ingot', 'copper_ingot', 'copper_ingot'],
                [null, 10, null],  // 10 = bâton (ID vanilla)
                [null, 10, null]
            ],
            output: { id: 'copper_pickaxe', count: 1 }
        },
        {
            name: 'Hache en Cuivre',
            pattern: [
                ['copper_ingot', 'copper_ingot'],
                ['copper_ingot', 10],
                [null, 10]
            ],
            output: { id: 'copper_axe', count: 1 }
        },
        {
            name: 'Pelle en Cuivre',
            pattern: [
                ['copper_ingot'],
                [10],
                [10]
            ],
            output: { id: 'copper_shovel', count: 1 }
        },
        {
            name: 'Épée en Cuivre',
            pattern: [
                ['copper_ingot'],
                ['copper_ingot'],
                [10]
            ],
            output: { id: 'copper_sword', count: 1 }
        }
    ],

    // Nouvelles recettes de fusion (utilisez les noms !)
    smeltingRecipes: {
        'copper_ore': {
            output: 'copper_ingot',
            count: 1,
            time: 2500
        }
    },

    // Fonction appelée quand le mod est chargé
    onLoad: function(ids) {
        console.log('[COPPER MOD] Le cuivre a été ajouté au jeu !');
        console.log('[COPPER MOD] Les outils en cuivre sont entre le bois et le fer');
        console.log('[COPPER MOD] IDs attribués :', ids);
    }
});
