/**
 * Types de blocs et leurs propriétés
 */
const BLOCK_TYPES = {
    0: { name: 'Air', color: null, solid: false },
    1: { name: 'Terre', color: '#5d4e37', solid: true, hardness: 0.5, minableWith: ['shovel', 'pickaxe', 'hand'] },
    2: { name: 'Pierre', color: '#666', solid: true, hardness: 1.5, minableWith: ['pickaxe'] },
    3: { name: 'Herbe', color: '#4caf50', solid: true, hardness: 0.5, minableWith: ['shovel', 'hand'] },
    4: { name: 'Diamant', color: '#ffd700', solid: true, hardness: 3, minableWith: ['pickaxe'] },
    5: { name: 'Bois', color: '#795548', solid: true, isFuel: true, fuelTime: 4000, hardness: 2, minableWith: ['axe', 'hand'] },
    6: { name: 'Feuilles', color: '#2e7d32', solid: false, hardness: 0.2, minableWith: ['shovel', 'hand', 'pickaxe', 'axe', 'sword'] },
    7: { name: 'Charbon', color: '#333', solid: true, isFuel: true, fuelTime: 7000, hardness: 3, minableWith: ['pickaxe'] },
    8: { name: 'Fer', color: '#d4af89', solid: true, hardness: 3, minableWith: ['pickaxe'] },
    9: { name: 'Planches', color: '#a67c52', solid: true, isFuel: true, fuelTime: 2000, hardness: 2, minableWith: ['axe', 'hand'] },
    10: { name: 'Bâton', color: '#8b4513', solid: false, isItem: true },
    11: { name: 'Torche', color: '#ffcc00', solid: false, hardness:0.2, light: true, minableWith: ['shovel', 'hand', 'pickaxe', 'axe', 'sword'] },
    12: { name: 'Bouture', color: '#2e7d32', solid: false, hardness:0.2, minableWith: ['shovel', 'hand', 'pickaxe', 'sword'] },
    13: { name: 'Échelle', color: '#8b6f47', solid: false, hardness:0.3, climbable: true, minableWith: ['shovel', 'hand', 'pickaxe', 'sword'] },
    14: { name: 'Four', color: '#383736', solid: true, hardness: 2, minableWith: ['pickaxe', 'hand'] },
    15: { name: 'Charbon de bois', color: '#2a2a2a', solid: false, isFuel: true, fuelTime: 8000 },
    16: { name: 'Lingot de fer', color: '#b87333', solid: false },
    17: { name: 'Lingot d\'or', color: '#ffd700', solid: false },
    18: { name: 'Coffre', color: '#8b5a3c', solid: true, hardness: 0.5, minableWith: ['axe', 'hand'] },
    19: { name: 'Pioche en fer', color: '#78909c', solid: false, isItem: true, tool: true, toolType: 'pickaxe', miningPower: 2, efficiency: 6 },
    20: { name: 'Hache en fer', color: '#78909c', solid: false, isItem: true, tool: true, toolType: 'axe', miningPower: 2, efficiency: 6 },
    21: { name: 'Pelle en fer', color: '#78909c', solid: false, isItem: true, tool: true, toolType: 'shovel', miningPower: 2, efficiency: 6 },
    22: { name: 'Épée en fer', color: '#78909c', solid: false, isItem: true, weapon: true, damage: 4 },
    23: { name: 'Pioche en bois', color: '#8b6f47', solid: false, isItem: true, tool: true, toolType: 'pickaxe', miningPower: 0, efficiency: 2 },
    24: { name: 'Hache en bois', color: '#8b6f47', solid: false, isItem: true, tool: true, toolType: 'axe', miningPower: 0, efficiency: 2 },
    25: { name: 'Pelle en bois', color: '#8b6f47', solid: false, isItem: true, tool: true, toolType: 'shovel', miningPower: 0, efficiency: 2 },
    26: { name: 'Épée en bois', color: '#8b6f47', solid: false, isItem: true, weapon: true, damage: 2 },
    99: { name: 'Bedrock', color: '#111', solid: true, unbreakable: true }
};

/**
 * Recettes de craft avec patterns 3x3
 * null = case vide, number = ID du bloc requis
 * shapeless: true = les items peuvent être placés n'importe où
 */
const RECIPES = [
    {
        name: 'Planches (x6)',
        shapeless: true,
        ingredients: [5], // Juste 1 bois
        output: { id: 9, count: 6 }
    },
    {
        name: 'Bâtons (x4)',
        pattern: [
            [9],
            [9]
        ],
        output: { id: 10, count: 4 }
    },
    {
        name: 'Torches (x4)',
        pattern: [
            [7],
            [10]
        ],
        output: { id: 11, count: 4 }
    },
    {
        name: 'Échelle (x6)',
        pattern: [
            [10, null, 10],
            [10, 10, 10],
            [10, null, 10]
        ],
        output: { id: 13, count: 6 }
    },
    {
        name: 'Bouture (x3)',
        shapeless: true,
        ingredients: [6, 6, 6, 6, 6, 6, 6, 6, 6], // 9 feuilles
        output: { id: 12, count: 3 }
    },
    {
        name: 'Four',
        pattern: [
            [2, 2, 2],
            [2, null, 2],
            [2, 2, 2]
        ],
        output: { id: 14, count: 1 }
    },
    {
        name: 'Coffre',
        pattern: [
            [9, 9, 9],
            [9, null, 9],
            [9, 9, 9]
        ],
        output: { id: 18, count: 1 }
    },
    {
        name: 'Pioche en fer',
        pattern: [
            [16, 16, 16],
            [null, 10, null],
            [null, 10, null]
        ],
        output: { id: 19, count: 1 }
    },
    {
        name: 'Hache en fer',
        pattern: [
            [16, 16],
            [16, 10],
            [null, 10]
        ],
        output: { id: 20, count: 1 }
    },
    {
        name: 'Pelle en fer',
        pattern: [
            [16],
            [10],
            [10]
        ],
        output: { id: 21, count: 1 }
    },
    {
        name: 'Épée en fer',
        pattern: [
            [16],
            [16],
            [10]
        ],
        output: { id: 22, count: 1 }
    },
    {
        name: 'Pioche en bois',
        pattern: [
            [9, 9, 9],
            [null, 10, null],
            [null, 10, null]
        ],
        output: { id: 23, count: 1 }
    },
    {
        name: 'Hache en bois',
        pattern: [
            [9, 9],
            [9, 10],
            [null, 10]
        ],
        output: { id: 24, count: 1 }
    },
    {
        name: 'Pelle en bois',
        pattern: [
            [9],
            [10],
            [10]
        ],
        output: { id: 25, count: 1 }
    },
    {
        name: 'Épée en bois',
        pattern: [
            [9],
            [9],
            [10]
        ],
        output: { id: 26, count: 1 }
    },
    {
        name: 'Lingot de fer',
        type: 'smelting',
        input: 8,           // Fer brut
        fuel: null,         // N'importe quel combustible
        output: { id: 16, count: 1 }
    },
    {
        name: 'Lingot d\'or',
        type: 'smelting',
        input: 4,           // Diamant -> Or pour l'exemple
        fuel: null,
        output: { id: 17, count: 1 }
    },
    {
        name: 'Charbon de bois',
        type: 'smelting',
        input: 5,           // Bois
        fuel: null,
        output: { id: 15, count: 1 }
    }
];

// Recettes spécifiques au four
const SMELTING_RECIPES = {
    8: { id: 16, count: 1, time: 3000 },   // Fer -> Lingot de fer
    4: { id: 17, count: 1, time: 3000 },   // Diamant -> Lingot d'or (exemple)
    5: { id: 15, count: 1, time: 2000 },   // Bois -> Charbon de bois
};
