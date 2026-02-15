/**
 * MOD TEMPLATE - Exemple minimal
 * 
 * Copiez ce fichier et modifiez-le pour créer votre propre mod !
 * 
 * IMPORTANT : Utilisez des NOMS pour vos blocs, pas de numéros !
 * Le jeu attribuera automatiquement les IDs.
 */

// Variable globale MODS (créée automatiquement si elle n'existe pas)
if (typeof MODS === 'undefined') {
    MODS = [];
}

// Ajouter votre mod au tableau
MODS.push({
    // === INFORMATIONS DU MOD (OBLIGATOIRE) ===
    name: "Mon Premier Mod",
    version: "1.0.0",
    author: "Votre Nom",
    description: "Description de votre mod",

    // === BLOCS/ITEMS (OPTIONNEL) ===
    // Utilisez des noms simples comme clés, le jeu attribuera les IDs automatiquement
    blocks: {
        'mon_bloc': { 
            name: 'Mon Bloc', 
            color: '#ff0000',      // Couleur en hexadécimal
            solid: true,           // true = solide, false = traversable
            hardness: 1,           // Difficulté à miner (1 = facile, 5 = dur)
            minableWith: ['pickaxe', 'shovel', 'haxe', 'hand'], // Outils acceptés
            // GÉNÉRATION DANS LE MONDE (optionnel)
         /*   worldGen: {
                rarity: 0.01,      // 1% de chance de génération
                minDepth: 0,       // Profondeur minimale (Y)
                maxDepth: 80,      // Profondeur maximale (Y)
                veinSize: 2        // Taille des filons (2x2)
            }*/
        },
        'mon_item': {
            name: 'Mon Item',
            color: '#00ff00',
            solid: false,
            isItem: true          // Item qui ne se place pas
        }
    },

    // === RECETTES DE CRAFT (OPTIONNEL) ===
    recipes: [
        // Recette shapeless (position libre)
        {
            name: 'Mon Item',
            shapeless: true,
            ingredients: [1, 1], // Vous pouvez utiliser les IDs vanilla (1 = terre)
            output: { id: 'mon_item', count: 1 } // Utilisez le nom de votre bloc
        },
        
        // Recette shaped (forme précise mais décalable)
        {
            name: 'Mon Bloc',
            pattern: [
                ['mon_item', 'mon_item'],  // Utilisez les noms
                ['mon_item', 'mon_item']
            ],
            output: { id: 'mon_bloc', count: 1 }
        }
    ],

    // === RECETTES DE FUSION (OPTIONNEL) ===
    smeltingRecipes: {
        'mon_bloc': { // Nom de l'input
            output: 'mon_item', // Nom de l'output
            count: 1,
            time: 3000
        }
    },

    // === FONCTION D'INITIALISATION (OPTIONNEL) ===
    onLoad: function(ids) {
        // ids contient la map nom → ID attribué
        console.log('Mon mod est chargé !');
        console.log('IDs attribués :', ids);
    }
});
