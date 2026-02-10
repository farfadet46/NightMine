/**
 * Types de blocs et leurs propriétés
 */
const BLOCK_TYPES = {
    0: { name: 'Air', color: null, solid: false },
    1: { name: 'Terre', color: '#5d4e37', solid: true },
    2: { name: 'Pierre', color: '#666', solid: true },
    3: { name: 'Herbe', color: '#4caf50', solid: true },
    4: { name: 'Diamant', color: '#ffd700', solid: true },
    5: { name: 'Bois', color: '#795548', solid: true, isFuel: true, fuelTime: 4000 },
    6: { name: 'Feuilles', color: '#2e7d32', solid: false },
    7: { name: 'Charbon', color: '#333', solid: true, isFuel: true, fuelTime: 7000 },
    8: { name: 'Fer', color: '#d4af89', solid: true },
    9: { name: 'Planches', color: '#a67c52', solid: true, isFuel: true, fuelTime: 2000 },
    10: { name: 'Bâton', color: '#8b4513', solid: false, isItem: true },
    11: { name: 'Torche', color: '#ffcc00', solid: false, light: true },
    12: { name: 'Bouture', color: '#2e7d32', solid: false },
    13: { name: 'Échelle', color: '#8b6f47', solid: false, climbable: true },
    14: { name: 'Four', color: '#383736', solid: true },
    15: { name: 'Charbon de bois', color: '#2a2a2a', solid: false, isFuel: true, fuelTime: 8000 },
    16: { name: 'Lingot de fer', color: '#b87333', solid: false },
    17: { name: 'Lingot d\'or', color: '#ffd700', solid: false },
    99: { name: 'Bedrock', color: '#111', solid: true, unbreakable: true }
};

/**
 * Recettes de craft avec patterns 3x3
 * null = case vide, number = ID du bloc requis
 */
const RECIPES = [
    {
        name: 'Planches (x8)',
        pattern: [
            [5, null, null],
            [null, null, null],
            [null, null, null]
        ],
        output: { id: 9, count: 8 }
    },
    {
        name: 'Bâtons (x4)',
        pattern: [
            [9, null, null],
            [9, null, null],
            [null, null, null]
        ],
        output: { id: 10, count: 4 }
    },
    {
        name: 'Torches (x4)',
        pattern: [
            [7, null, null],
            [10, null, null],
            [null, null, null]
        ],
        output: { id: 11, count: 4 }
    },
    {
        name: 'Échelle (x3)',
        pattern: [
            [10, null, 10],
            [10, 10, 10],
            [10, null, 10]
        ],
        output: { id: 13, count: 3 }
    },
    {
        name: 'Bouture (x2)',
        pattern: [
            [6, 6, 6],
            [6, 6, 6],
            [6, 6, 6]
        ],
        output: { id: 12, count: 2 }
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
