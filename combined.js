/**
 * Constantes du jeu
 */
const CONSTANTS = {
    BLOCK_SIZE: 32,
    CHUNK_WIDTH: 16,
    WORLD_SEED: 123456,
    WORLD_HEIGHT: 80,
    PLAYER_WIDTH: 0.75,
    PLAYER_HEIGHT: 0.75,
    GRAVITY: 0.02,
    SPEED: 0.12,
    JUMP_FORCE: -0.18,
    MINING_COOLDOWN: 15,
    BASE_MINING_COOLDOWN: 15,
    REACH_DISTANCE: 4.5,
    TORCH_LIGHT_RADIUS: 150,
    PLAYER_LIGHT_RADIUS: 220,
    INVENTORY_SIZE: 20,
    HOTBAR_SIZE: 5,
    SEED_MULTIPLIERS: {
        GROUND: 100,
        ORE: 1000,
        IRON: 1500,
        TREE: 50,
        CAVE: 3000,
        CAVE_DETAIL: 5000
    },
    CAVE: {
        FREQUENCY: 0.04,
        THRESHOLD: 0.35,
        DETAIL_SCALE: 0.12,
        MIN_DEPTH: 3,
        MAX_DEPTH: 60
    },
    FURNACE: {
        SMELT_TIME: 3000,
        FUEL_TIME: 8000,
        SLOTS: {
            INPUT: 0,
            FUEL: 1,
            OUTPUT: 2
        }
    }
};
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
/**
 * Générateur de bruit de Perlin simplifié pour les grottes
 */
class SimpleNoise {
    constructor(seed = 0) {
        this.perm = new Uint8Array(512);
        const random = this.seededRandom(seed);

        for (let i = 0; i < 256; i++) this.perm[i] = i;
        for (let i = 0; i < 256; i++) {
            const j = Math.floor(random() * 256);
            [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
            this.perm[i + 256] = this.perm[i];
        }
    }
    
    seededRandom(seed) {
        let x = seed;
        return () => {
            x = Math.sin(x++) * 10000;
            return x - Math.floor(x);
        };
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t, a, b) { return a + t * (b - a); }
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = this.perm[X] + Y, B = this.perm[X + 1] + Y;
        
        return this.lerp(v, 
            this.lerp(u, this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y)),
            this.lerp(u, this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1))
        );
    }

    // Bruit fractal (octaves)
    fractalNoise(x, y, octaves = 3, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return total / maxValue;
    }
}
/**
 * Gestionnaire de chunks - gère la génération et le stockage des chunks
 */
class ChunkManager {
    constructor(seed = CONSTANTS.WORLD_SEED, modManager = null) {
        this.seed = seed;
        this.chunks = new Map();
        this.caveNoise = new SimpleNoise(seed + 1);
        this.detailNoise = new SimpleNoise(seed + 2);
        this.modManager = modManager; // Référence au ModManager pour les minerais custom
    }

    /**
     * Génère un chunk à la position donnée
     */
    generate(chunkX) {
        const blocks = this.createBaseTerrain(chunkX);
        this.addCaves(blocks, chunkX);  // NOUVEAU : Grottes
        this.addOreVeins(blocks, chunkX);
        this.addCustomOres(blocks, chunkX); // NOUVEAU : Minerais des mods
        this.addTrees(blocks, chunkX);
        
        return {
            blocks: blocks,
            modified: false
        };
    }

    hash2D(x, y, seed = 1337) {
        let h = x * 374761393 + y * 668265263 + seed * 144665;
        h = (h ^ (h >> 13)) * 1274126177;
        return ((h ^ (h >> 16)) >>> 0) / 4294967295;
    }

    /**
     * Crée le terrain de base (terre, pierre, herbe)
     */
    createBaseTerrain(chunkX) {
        const chunk = [];
        const baseX = chunkX * CONSTANTS.CHUNK_WIDTH;
        
        for (let localX = 0; localX < CONSTANTS.CHUNK_WIDTH; localX++) {
            const x = baseX + localX;
            const column = [];
            const groundLevel = Math.floor(35 + Math.sin(x/10)*5);
            
            for (let y = 0; y < CONSTANTS.WORLD_HEIGHT; y++) {
                column[y] = this.getBlockForDepth(y, groundLevel, x, y);
            }
            chunk.push(column);
        }
        return chunk;
    }

    /**
     * Détermine le type de bloc selon la profondeur
     */
    getBlockForDepth(y, groundLevel, x, worldY) {
        if (y >= CONSTANTS.WORLD_HEIGHT - 2) return 99; // Bedrock
        if (y === groundLevel) return 3; // Herbe
        if (y > groundLevel) {
            const depth = y - groundLevel;
            if (depth > 1 && depth <= 6) {
                return this.seededRandom(x * CONSTANTS.SEED_MULTIPLIERS.GROUND + worldY * 200) < (depth - 1) / 5 ? 2 : 1;
            }
            if (depth > 6) return 2; // Pierre profonde
            return 1; // Terre
        }
        return 0; // Air
    }

    /**
     * AJOUTE DES GROTTES NATURELLES
     */
    addCaves(chunk, chunkX) {
        const baseX = chunkX * CONSTANTS.CHUNK_WIDTH;

        for (let localX = 0; localX < CONSTANTS.CHUNK_WIDTH; localX++) {
            const worldX = baseX + localX;
            const groundLevel = Math.floor(35 + Math.sin(worldX / 10) * 5);

            for (let y = 0; y < CONSTANTS.WORLD_HEIGHT; y++) {

                if (chunk[localX][y] !== 2) continue;

                const depth = y - groundLevel;
                if (depth < CONSTANTS.CAVE.MIN_DEPTH) continue;
                if (depth > CONSTANTS.CAVE.MAX_DEPTH) continue;

                let threshold = CONSTANTS.CAVE.THRESHOLD;
                if (depth < 6) threshold = 0.15;

                const caveValue = this.caveNoise.fractalNoise(
                    worldX * CONSTANTS.CAVE.FREQUENCY,
                    y * CONSTANTS.CAVE.FREQUENCY,
                    3,
                    0.5
                );

                const detailValue = this.detailNoise.noise(
                    worldX * CONSTANTS.CAVE.DETAIL_SCALE,
                    y * CONSTANTS.CAVE.DETAIL_SCALE
                );

                const finalValue = caveValue + detailValue * 0.3;
                const normalized = (finalValue + 1) / 2;

                if (normalized < threshold) {
                    chunk[localX][y] = 0;
                }
            }
        }
    }

    /**
     * Ajoute les filons de minerai (VERSION CORRIGÉE - pas de diagonales)
     */
    addOreVeins(chunk, chunkX) {
        const baseX = chunkX * CONSTANTS.CHUNK_WIDTH;

        for (let localX = 0; localX < CONSTANTS.CHUNK_WIDTH; localX++) {
            const x = baseX + localX;

            for (let y = 0; y < CONSTANTS.WORLD_HEIGHT; y++) {
                if (chunk[localX][y] !== 2) continue;

                // Charbon
                if (this.hash2D(x, y, 7) < 0.02) {
                    this.placeOreVein(chunk, chunkX, x, y, 7, 3, 3);
                }

                // Fer
                if (this.hash2D(x, y, 8) < 0.015) {
                    this.placeOreVein(chunk, chunkX, x, y, 8, 2, 2);
                }
            }
        }
    }

    /**
     * Ajoute les minerais personnalisés des mods
     */
    addCustomOres(chunk, chunkX) {
        if (!this.modManager || !this.modManager.customOres) return;

        const baseX = chunkX * CONSTANTS.CHUNK_WIDTH;

        for (let localX = 0; localX < CONSTANTS.CHUNK_WIDTH; localX++) {
            const x = baseX + localX;

            for (let y = 0; y < CONSTANTS.WORLD_HEIGHT; y++) {
                if (chunk[localX][y] !== 2) continue; // Seulement dans la pierre

                // Générer chaque minerai custom
                for (let i = 0; i < this.modManager.customOres.length; i++) {
                    const ore = this.modManager.customOres[i];
                    
                    // Vérifier la profondeur
                    if (y < ore.minDepth || y > ore.maxDepth) continue;
                    
                    // Vérifier la rareté (utiliser l'ID comme seed pour la cohérence)
                    if (this.hash2D(x, y, ore.id) < ore.rarity) {
                        const veinWidth = ore.veinSize || 2;
                        const veinHeight = ore.veinSize || 2;
                        this.placeOreVein(chunk, chunkX, x, y, ore.id, veinWidth, veinHeight);
                    }
                }
            }
        }
    }

    /**
     * Place une veine de minerai sans créer de patterns diagonaux
     */
    placeOreVein(chunk, chunkX, startX, startY, oreId, width, height) {
        for (let dx = 0; dx < width; dx++) {
            for (let dy = 0; dy < height; dy++) {
                const worldX = startX + dx;
                const worldY = startY + dy;
                
                // Calculer dans quel chunk on est
                const targetChunkX = Math.floor(worldX / CONSTANTS.CHUNK_WIDTH);
                const targetLocalX = ((worldX % CONSTANTS.CHUNK_WIDTH) + CONSTANTS.CHUNK_WIDTH) % CONSTANTS.CHUNK_WIDTH;
                
                // Ne modifier que si dans le chunk actuel
                if (targetChunkX !== chunkX) continue;
                if (worldY >= CONSTANTS.WORLD_HEIGHT) continue;
                if (!chunk[targetLocalX]) continue;
                if (chunk[targetLocalX][worldY] !== 2) continue;
                
                // Probabilité basée sur la position monde (pas de pattern diagonal)
                if (this.seededRandom(worldX * 111 + worldY * 222) > 0.3) {
                    chunk[targetLocalX][worldY] = oreId;
                }
            }
        }
    }

    /**
     * Ajoute les arbres
     */
    addTrees(chunk, chunkX) {
        const baseX = chunkX * CONSTANTS.CHUNK_WIDTH;
        
        for (let localX = 0; localX < CONSTANTS.CHUNK_WIDTH; localX++) {
            const x = baseX + localX;
            const groundLevel = Math.floor(35 + Math.sin(x/10)*5);
            
            if (chunk[localX][groundLevel] === 3 && this.seededRandom(x * 50) < 0.08) {
                this.generateTree(chunk, localX, groundLevel, x);
            }
        }
    }

    /**
     * Génère un arbre à la position donnée
     */
    generateTree(chunk, localX, groundLevel, seed) {
        const trunkHeight = 4 + Math.floor(this.seededRandom(seed * 75) * 2);
        
        // Tronc
        for (let i = 0; i < trunkHeight; i++) {
            const y = groundLevel - 1 - i;
            if (y > 0) chunk[localX][y] = 5;
        }
        
        // Feuilles
        const leafTop = groundLevel - 1 - trunkHeight;
        for (let lx = -2; lx <= 2; lx++) {
            for (let ly = -2; ly <= 1; ly++) {
                const targetX = localX + lx;
                const targetY = leafTop + ly;
                if (targetX >= 0 && targetX < CONSTANTS.CHUNK_WIDTH && 
                    targetY >= 0 && 
                    chunk[targetX]?.[targetY] === 0 && 
                    Math.sqrt(lx*lx + ly*ly) <= 2.2) {
                    chunk[targetX][targetY] = 6;
                }
            }
        }
    }

    /**
     * Générateur de nombres pseudo-aléatoires déterministe
     */
    seededRandom(seed) {
        const x = Math.sin(seed + this.seed) * 10000;
        return x - Math.floor(x);
    }

    /**
     * Récupère ou génère un chunk
     */
    get(chunkX) {
        if (!this.chunks.has(chunkX)) {
            this.chunks.set(chunkX, this.generate(chunkX));
        }
        return this.chunks.get(chunkX);
    }
    
    /**
     * Récupère un chunk (alias pour compatibilité avec saveManager)
     */
    getChunk(chunkX, chunkY = 0) {
        return this.get(chunkX);
    }

    /**
     * Convertit les coordonnées monde en coordonnées chunk
     */
    worldToChunk(worldX) {
        const chunkX = Math.floor(worldX / CONSTANTS.CHUNK_WIDTH);
        const localX = ((worldX % CONSTANTS.CHUNK_WIDTH) + CONSTANTS.CHUNK_WIDTH) % CONSTANTS.CHUNK_WIDTH;
        return { chunkX, localX };
    }

    /**
     * Récupère l'ID d'un bloc aux coordonnées monde
     */
    getBlockId(worldX, worldY) {
        if (worldY < 0 || worldY >= CONSTANTS.WORLD_HEIGHT) return 0;
        const { chunkX, localX } = this.worldToChunk(worldX);
        const chunk = this.get(chunkX);
        return chunk.blocks[localX]?.[worldY] || 0;
    }

    /**
     * Définit l'ID d'un bloc aux coordonnées monde
     */
    setBlockId(worldX, worldY, blockId) {
        if (worldY < 0 || worldY >= CONSTANTS.WORLD_HEIGHT) return;
        const { chunkX, localX } = this.worldToChunk(worldX);
        const chunk = this.get(chunkX);
        if (chunk.blocks[localX]) {
            chunk.blocks[localX][worldY] = blockId;
            chunk.modified = true; // Marquer le chunk comme modifié
        }
    }
}
/**
 * Gestionnaire d'inventaire - gère les items et le drag & drop
 */
class InventoryManager {
    constructor(size, hotbarSize) {
        this.slots = Array(size).fill(null);
        this.size = size;
        this.hotbarSize = hotbarSize;
        this.selectedSlot = 0;
        this.draggedItem = null;
    }

    /**
     * Ajoute un item à l'inventaire
     */
    addItem(id, count) {
        const existing = this.slots.find(slot => slot && slot.id === id);
        if (existing) {
            existing.count += count;
            return true;
        }
        
        const emptyIndex = this.slots.indexOf(null);
        if (emptyIndex !== -1) {
            this.slots[emptyIndex] = { id, count };
            return true;
        }
        return false; // Inventaire plein
    }

    /**
     * Consomme un item de l'inventaire
     */
    consumeItem(id, count) {
        const item = this.slots.find(s => s && s.id === id);
        if (!item || item.count < count) return false;
        
        item.count -= count;
        if (item.count <= 0) {
            const idx = this.slots.indexOf(item);
            this.slots[idx] = null;
        }
        return true;
    }

    /**
     * Vérifie si l'inventaire contient suffisamment d'un item
     */
    hasItem(id, count) {
        const item = this.slots.find(s => s && s.id === id);
        return item && item.count >= count;
    }

    /**
     * Gère le clic sur un slot (drag & drop)
     * clickType: 'left' = clic gauche, 'right' = clic droit, 'middle' = clic molette
     */
    handleSlotClick(index, clickType = 'left') {
        const slotContent = this.slots[index];
        
        if (clickType === 'middle' && slotContent && !this.draggedItem) {
            // Clic molette : diviser le stack en deux
            const halfCount = Math.floor(slotContent.count / 2);
            if (halfCount > 0) {
                this.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    this.slots[index] = null;
                }
            }
            return true;
        }
        
        if (clickType === 'right') {
            if (this.draggedItem && !slotContent) {
                // Clic droit : déposer un seul item
                this.slots[index] = { id: this.draggedItem.id, count: 1 };
                this.draggedItem.count--;
                if (this.draggedItem.count <= 0) {
                    this.draggedItem = null;
                }
                return true;
            } else if (this.draggedItem && slotContent && slotContent.id === this.draggedItem.id) {
                // Clic droit sur stack existant : ajouter 1
                slotContent.count++;
                this.draggedItem.count--;
                if (this.draggedItem.count <= 0) {
                    this.draggedItem = null;
                }
                return true;
            } else if (!this.draggedItem && slotContent) {
                // Clic droit sur un slot plein : prendre la moitié
                const halfCount = Math.ceil(slotContent.count / 2);
                this.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    this.slots[index] = null;
                }
                return true;
            }
        }
        
        // Clic gauche (comportement par défaut)
        if (!this.draggedItem && slotContent) {
            // Prendre l'item
            this.draggedItem = slotContent;
            this.slots[index] = null;
            return true;
        } else if (this.draggedItem) {
            if (slotContent && slotContent.id === this.draggedItem.id) {
                // Empiler
                slotContent.count += this.draggedItem.count;
                this.draggedItem = null;
            } else {
                // Échanger
                this.slots[index] = this.draggedItem;
                this.draggedItem = slotContent;
            }
            return true;
        }
        return false;
    }

    /**
     * Récupère l'item sélectionné dans la hotbar
     */
    getSelectedItem() {
        return this.slots[this.selectedSlot];
    }

    /**
     * Change le slot sélectionné
     */
    changeSelection(delta) {
        this.selectedSlot = (this.selectedSlot + delta + this.hotbarSize) % this.hotbarSize;
    }
}
/**
 * Gestionnaire de four - gere la cuisson des items
 */
class FurnaceManager {
    constructor(game) {
        this.game = game;
        this.furnaces = new Map();
        this.currentFurnacePos = null;
        this.isUIOpen = false;
    }

    getOrCreateFurnace(x, y) {
        const key = x + ',' + y;
        if (!this.furnaces.has(key)) {
            this.furnaces.set(key, {
                input: null,
                fuel: null,
                output: null,
                progress: 0,
                burnProgress: 0,
                isBurning: false,
                lastUpdate: performance.now()
            });
        }
        return this.furnaces.get(key);
    }

    openFurnace(x, y) {
        this.currentFurnacePos = { x: x, y: y };
        this.isUIOpen = true;
        this.game.paused = true;
        this.game.inventoryOpen = true;
        
        // Afficher l'inventaire
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            grid.classList.add('show');
        }
        
        // CACHER le craft
        const craftPanel = document.getElementById('craftingPanel');
        if (craftPanel) {
            craftPanel.style.display = 'none';
        }
        
        // Afficher le four
        const furnacePanel = document.getElementById('furnacePanel');
        if (furnacePanel) {
            furnacePanel.style.display = 'block';
        }
        
        this.updateUI();
        this.game.updateUI();
    }

    closeFurnace() {
        if (!this.isUIOpen) return;
        this.game.hideTooltip();
        
        // Retourner l'item dragué à l'inventaire
        if (this.game.inventory.draggedItem) {
            this.game.inventory.addItem(
                this.game.inventory.draggedItem.id, 
                this.game.inventory.draggedItem.count
            );
            this.game.inventory.draggedItem = null;
        }
        
        this.isUIOpen = false;
        this.currentFurnacePos = null;
        this.game.paused = false;
        this.game.inventoryOpen = false;
        
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            grid.classList.remove('show');
        }
        
        const furnacePanel = document.getElementById('furnacePanel');
        if (furnacePanel) {
            furnacePanel.style.display = 'none';
        }
        
        this.game.updateUI();
    }

    // Cette méthode est appelée quand on CASSSE le four (pas quand on ferme l'UI)
    breakFurnace(x, y) {
        const key = x + ',' + y;
        const furnace = this.furnaces.get(key);
        if (!furnace) return;
        
        // Dropper tous les items au sol
        const slots = ['input', 'fuel', 'output'];
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (furnace[slot]) {
                this.game.world.dropItem(x + 0.5, y + 0.5, furnace[slot].id, furnace[slot].count);
            }
        }
        
        // Supprimer le four de la liste
        this.furnaces.delete(key);
    }

    update() {
        const now = performance.now();
        const self = this;
        
        this.furnaces.forEach(function(furnace, key) {
            const dt = now - furnace.lastUpdate;
            furnace.lastUpdate = now;

            // Vérifier s'il y a quelque chose à cuire
            const hasSmeltableInput = furnace.input && SMELTING_RECIPES[furnace.input.id];

            if (furnace.isBurning) {
                furnace.burnProgress -= (dt / CONSTANTS.FURNACE.FUEL_TIME) * 100;
                
                // Arrêter si plus de fuel OU plus rien à cuire
                if (furnace.burnProgress <= 0 || !hasSmeltableInput) {
                    furnace.isBurning = false;
                    furnace.burnProgress = 0;
                    
                    // Ne reconsummer que si on a encore quelque chose à cuire ET du fuel
                    if (hasSmeltableInput && furnace.fuel && furnace.fuel.count > 0) {
                        self.consumeFuel(furnace);
                    }
                }
            }

            // Cuisson uniquement si on brûle ET on a un input valide
            if (furnace.isBurning && hasSmeltableInput) {
                const recipe = SMELTING_RECIPES[furnace.input.id];
                furnace.progress += (dt / recipe.time) * 100;
                
                if (furnace.progress >= 100) {
                    self.completeSmelting(furnace, recipe);
                }
            }

            // Auto-start : démarrer uniquement si on a input + fuel
            if (!furnace.isBurning && hasSmeltableInput && furnace.fuel && BLOCK_TYPES[furnace.fuel.id].isFuel) {
                self.consumeFuel(furnace);
            }

            // Mise à jour UI
            if (self.isUIOpen && self.currentFurnacePos) {
                const currentKey = self.currentFurnacePos.x + ',' + self.currentFurnacePos.y;
                if (key === currentKey) {
                    self.updateUIFurnace(furnace);
                }
            }
        });
    }

    consumeFuel(furnace) {
        const fuelData = BLOCK_TYPES[furnace.fuel.id];
        if (!fuelData || !fuelData.isFuel) return;

        furnace.fuel.count--;
        furnace.isBurning = true;
        furnace.burnProgress = 100;
        
        if (furnace.fuel.count <= 0) {
            furnace.fuel = null;
        }
    }

    completeSmelting(furnace, recipe) {
        furnace.progress = 0;
        furnace.input.count--;
        
        if (furnace.input.count <= 0) {
            furnace.input = null;
        }

        if (furnace.output && furnace.output.id === recipe.id) {
            furnace.output.count += recipe.count;
        } else if (!furnace.output) {
            furnace.output = { id: recipe.id, count: recipe.count };
        }
    }

    handleSlotClick(slotType, clickType) {
        const furnace = this.getOrCreateFurnace(this.currentFurnacePos.x, this.currentFurnacePos.y);
        const slotContent = furnace[slotType];
        const draggedItem = this.game.inventory.draggedItem;

        // Le slot output ne permet que de prendre, pas de poser
        if (slotType === 'output') {
            if (!slotContent) return; // Rien à prendre
            
            // Clic droit ou molette : prendre la moitié
            if (clickType === 'right' || clickType === 'middle') {
                const halfCount = Math.ceil(slotContent.count / 2);
                if (!draggedItem) {
                    // Prendre la moitié dans le curseur
                    this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                    slotContent.count -= halfCount;
                    if (slotContent.count <= 0) {
                        furnace.output = null;
                    }
                } else if (draggedItem.id === slotContent.id) {
                    // Empiler sur l'item draggué
                    draggedItem.count += halfCount;
                    slotContent.count -= halfCount;
                    if (slotContent.count <= 0) {
                        furnace.output = null;
                    }
                }
            } 
            // Clic gauche : prendre tout
            else {
                if (!draggedItem) {
                    // Prendre tout dans le curseur
                    this.game.inventory.draggedItem = { id: slotContent.id, count: slotContent.count };
                    furnace.output = null;
                } else if (draggedItem.id === slotContent.id) {
                    // Empiler sur l'item draggué
                    draggedItem.count += slotContent.count;
                    furnace.output = null;
                } else {
                    // Echanger
                    const temp = { id: draggedItem.id, count: draggedItem.count };
                    this.game.inventory.draggedItem = { id: slotContent.id, count: slotContent.count };
                    furnace.output = temp;
                }
            }
            
            this.game.updateUI();
            this.updateUI();
            return;
        }

        // Clic molette : diviser (pour input et fuel)
        if (clickType === 'middle' && slotContent && !draggedItem) {
            const halfCount = Math.floor(slotContent.count / 2);
            if (halfCount > 0) {
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    furnace[slotType] = null;
                }
            }
            this.game.updateUI();
            this.updateUI();
            return;
        }

        // Clic droit (pour input et fuel)
        if (clickType === 'right') {
            // Deposer 1 item
            if (draggedItem && !slotContent) {
                if (!this.canPlaceInSlot(slotType, draggedItem.id)) return;
                furnace[slotType] = { id: draggedItem.id, count: 1 };
                draggedItem.count--;
                if (draggedItem.count <= 0) {
                    this.game.inventory.draggedItem = null;
                }
                this.checkAutoStart(furnace);
                this.game.updateUI();
                this.updateUI();
                return;
            } 
            // Empiler sur slot existant
            else if (draggedItem && slotContent && slotContent.id === draggedItem.id) {
                slotContent.count++;
                draggedItem.count--;
                if (draggedItem.count <= 0) {
                    this.game.inventory.draggedItem = null;
                }
                this.game.updateUI();
                this.updateUI();
                return;
            } 
            // Prendre la moitie
            else if (!draggedItem && slotContent) {
                const halfCount = Math.ceil(slotContent.count / 2);
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    furnace[slotType] = null;
                }
                this.checkAutoStop(furnace);
                this.game.updateUI();
                this.updateUI();
                return;
            }
        }

        // Clic gauche (pour input et fuel)
        if (!draggedItem && slotContent) {
            // Prendre tout
            this.game.inventory.draggedItem = { 
                id: slotContent.id, 
                count: slotContent.count 
            };
            furnace[slotType] = null;
            this.checkAutoStop(furnace);
        } else if (draggedItem) {
            if (!this.canPlaceInSlot(slotType, draggedItem.id)) return;

            if (slotContent && slotContent.id === draggedItem.id) {
                // Empiler
                slotContent.count += draggedItem.count;
                this.game.inventory.draggedItem = null;
            } else if (!slotContent) {
                // Placer
                furnace[slotType] = { 
                    id: draggedItem.id, 
                    count: draggedItem.count 
                };
                this.game.inventory.draggedItem = null;
            } else {
                // Echanger
                const temp = { 
                    id: slotContent.id, 
                    count: slotContent.count 
                };
                furnace[slotType] = { 
                    id: draggedItem.id, 
                    count: draggedItem.count 
                };
                this.game.inventory.draggedItem = temp;
            }
            this.checkAutoStart(furnace);
        }

        this.game.updateUI();
        this.updateUI();
    }

    canPlaceInSlot(slotType, itemId) {
        const itemData = BLOCK_TYPES[itemId];
        
        if (slotType === 'input') {
            return SMELTING_RECIPES.hasOwnProperty(itemId);
        } else if (slotType === 'fuel') {
            return itemData && itemData.isFuel;
        } else if (slotType === 'output') {
            return false;
        }
        return true;
    }

    checkAutoStart(furnace) {
        if (furnace.isBurning) return;
        if (!furnace.input) return;
        if (!SMELTING_RECIPES[furnace.input.id]) return;

        if (furnace.fuel && BLOCK_TYPES[furnace.fuel.id].isFuel) {
            this.consumeFuel(furnace);
        }
    }

    checkAutoStop(furnace) {
        if (!furnace.input || !SMELTING_RECIPES[furnace.input.id]) {
            furnace.progress = 0;
        }
    }

    updateUI() {
        if (!this.isUIOpen) return;
        
        const furnace = this.getOrCreateFurnace(this.currentFurnacePos.x, this.currentFurnacePos.y);
        this.updateUIFurnace(furnace);
    }

    updateUIFurnace(furnace) {
        const inputSlot = document.getElementById('furnaceInput');
        const fuelSlot = document.getElementById('furnaceFuel');
        const outputSlot = document.getElementById('furnaceOutput');
        
        if (inputSlot) this.updateSlotDisplay(inputSlot, furnace.input);
        if (fuelSlot) this.updateSlotDisplay(fuelSlot, furnace.fuel);
        if (outputSlot) this.updateSlotDisplay(outputSlot, furnace.output);

        const burnBar = document.getElementById('burnProgress');
        const smeltBar = document.getElementById('smeltProgress');
        
        if (burnBar) {
            burnBar.style.width = furnace.burnProgress + '%';
            burnBar.style.opacity = furnace.isBurning ? '1' : '0.3';
        }
        
        if (smeltBar) {
            smeltBar.style.width = furnace.progress + '%';
            smeltBar.style.opacity = (furnace.isBurning && furnace.input) ? '1' : '0.3';
        }

        const flame = document.getElementById('furnaceFlame');
        if (flame) {
            if (furnace.isBurning) {
                flame.style.display = 'block';
                flame.style.opacity = 0.7 + Math.sin(Date.now() / 100) * 0.3;
            } else {
                flame.style.display = 'none';
            }
        }
    }

    updateSlotDisplay(element, item) {
        if (item) {
            element.innerHTML = this.game.getIconHTML(item.id) + 
                '<span class="inv-count">' + item.count + '</span>';
        } else {
            element.innerHTML = '';
        }
    }
}
/**
 * Gestionnaire de coffres - gère le stockage d'items
 */
class ChestManager {
    constructor(game) {
        this.game = game;
        this.chests = new Map();
        this.currentChestPos = null;
        this.isUIOpen = false;
    }

    getOrCreateChest(x, y) {
        const key = x + ',' + y;
        if (!this.chests.has(key)) {
            this.chests.set(key, {
                slots: Array(27).fill(null) // 27 slots (3 rangées de 9)
            });
        }
        return this.chests.get(key);
    }

    openChest(x, y) {
        this.currentChestPos = { x: x, y: y };
        this.isUIOpen = true;
        this.game.paused = true;
        this.game.inventoryOpen = true;
        
        // Afficher l'inventaire
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            grid.classList.add('show');
        }
        
        // Cacher le craft
        const craftPanel = document.getElementById('craftingPanel');
        if (craftPanel) {
            craftPanel.style.display = 'none';
        }
        
        // Cacher le four
        const furnacePanel = document.getElementById('furnacePanel');
        if (furnacePanel) {
            furnacePanel.style.display = 'none';
        }
        
        // Afficher le coffre
        const chestPanel = document.getElementById('chestPanel');
        if (chestPanel) {
            chestPanel.style.display = 'block';
        }
        
        this.updateUI();
        this.game.updateUI();
    }

    closeChest() {
        if (!this.isUIOpen) return;
        this.game.hideTooltip();
        
        // Retourner l'item dragué à l'inventaire
        if (this.game.inventory.draggedItem) {
            this.game.inventory.addItem(
                this.game.inventory.draggedItem.id, 
                this.game.inventory.draggedItem.count
            );
            this.game.inventory.draggedItem = null;
        }
        
        this.isUIOpen = false;
        this.currentChestPos = null;
        this.game.paused = false;
        this.game.inventoryOpen = false;
        
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            grid.classList.remove('show');
        }
        
        const chestPanel = document.getElementById('chestPanel');
        if (chestPanel) {
            chestPanel.style.display = 'none';
        }
        
        this.game.updateUI();
    }

    // Appelé quand on casse le coffre
    breakChest(x, y) {
        const key = x + ',' + y;
        const chest = this.chests.get(key);
        if (!chest) return;
        
        // Dropper tous les items au sol
        for (let i = 0; i < chest.slots.length; i++) {
            const item = chest.slots[i];
            if (item) {
                this.game.world.dropItem(x + 0.5, y + 0.5, item.id, item.count);
            }
        }
        
        // Supprimer le coffre de la liste
        this.chests.delete(key);
    }

    handleSlotClick(slotIndex, clickType) {
        const chest = this.getOrCreateChest(this.currentChestPos.x, this.currentChestPos.y);
        const slotContent = chest.slots[slotIndex];
        const draggedItem = this.game.inventory.draggedItem;

        // Clic molette : diviser
        if (clickType === 'middle' && slotContent && !draggedItem) {
            const halfCount = Math.floor(slotContent.count / 2);
            if (halfCount > 0) {
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    chest.slots[slotIndex] = null;
                }
            }
            this.game.updateUI();
            this.updateUI();
            return;
        }

        // Clic droit
        if (clickType === 'right') {
            // Déposer 1 item
            if (draggedItem && !slotContent) {
                chest.slots[slotIndex] = { id: draggedItem.id, count: 1 };
                draggedItem.count--;
                if (draggedItem.count <= 0) {
                    this.game.inventory.draggedItem = null;
                }
                this.game.updateUI();
                this.updateUI();
                return;
            } 
            // Empiler sur slot existant
            else if (draggedItem && slotContent && slotContent.id === draggedItem.id) {
                slotContent.count++;
                draggedItem.count--;
                if (draggedItem.count <= 0) {
                    this.game.inventory.draggedItem = null;
                }
                this.game.updateUI();
                this.updateUI();
                return;
            } 
            // Prendre la moitié
            else if (!draggedItem && slotContent) {
                const halfCount = Math.ceil(slotContent.count / 2);
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    chest.slots[slotIndex] = null;
                }
                this.game.updateUI();
                this.updateUI();
                return;
            }
        }

        // Clic gauche (comportement par défaut)
        if (!draggedItem && slotContent) {
            // Prendre tout
            this.game.inventory.draggedItem = { 
                id: slotContent.id, 
                count: slotContent.count 
            };
            chest.slots[slotIndex] = null;
        } else if (draggedItem) {
            if (slotContent && slotContent.id === draggedItem.id) {
                // Empiler
                slotContent.count += draggedItem.count;
                this.game.inventory.draggedItem = null;
            } else if (!slotContent) {
                // Placer
                chest.slots[slotIndex] = { 
                    id: draggedItem.id, 
                    count: draggedItem.count 
                };
                this.game.inventory.draggedItem = null;
            } else {
                // Échanger
                const temp = { 
                    id: slotContent.id, 
                    count: slotContent.count 
                };
                chest.slots[slotIndex] = { 
                    id: draggedItem.id, 
                    count: draggedItem.count 
                };
                this.game.inventory.draggedItem = temp;
            }
        }

        this.game.updateUI();
        this.updateUI();
    }

    updateUI() {
        if (!this.isUIOpen || !this.currentChestPos) return;
        
        const chest = this.getOrCreateChest(this.currentChestPos.x, this.currentChestPos.y);
        const chestGrid = document.getElementById('chestGrid');
        
        if (!chestGrid) return;
        
        for (let i = 0; i < chest.slots.length; i++) {
            const slot = chestGrid.children[i];
            const item = chest.slots[i];
            
            if (slot) {
                if (item) {
                    slot.innerHTML = this.game.getIconHTML(item.id) + 
                        '<span class="inv-count">' + item.count + '</span>';
                } else {
                    slot.innerHTML = '';
                }
            }
        }
    }

    initUI() {
        const chestGrid = document.getElementById('chestGrid');
        if (!chestGrid || chestGrid.children.length > 0) return;

        for (let i = 0; i < 27; i++) {
            const slot = document.createElement('div');
            slot.className = 'craft-slot';
            
            slot.onmousedown = (function(index, self) {
                return function(e) {
                    e.preventDefault();
                    let clickType = 'left';
                    if (e.button === 0) clickType = 'left';
                    else if (e.button === 1) clickType = 'middle';
                    else if (e.button === 2) clickType = 'right';
                    self.handleSlotClick(index, clickType);
                };
            })(i, this);
            
            slot.oncontextmenu = function(e) { e.preventDefault(); };
            
            const self = this;
            slot.onmouseenter = function(e) {
                const chest = self.getOrCreateChest(self.currentChestPos.x, self.currentChestPos.y);
                if (chest.slots[i]) self.game.showTooltip(e, chest.slots[i].id);
            };
            slot.onmousemove = this.game.moveTooltip.bind(this.game);
            slot.onmouseleave = this.game.hideTooltip.bind(this.game);
            
            chestGrid.appendChild(slot);
        }
    }
}
/**
 * Système de rendu - gère l'affichage
 */
class Renderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        this.tempCanvas = null;
        this.stars = this.generateStars(100);
    }

    /**
     * Génère les étoiles de fond
     */
    generateStars(count) {
        return Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2,
            speed: 0.1 + Math.random() * 0.3
        }));
    }

    /**
     * Redimensionne le canvas
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.viewWidth = Math.ceil(this.canvas.width / CONSTANTS.BLOCK_SIZE);
        this.viewHeight = Math.ceil(this.canvas.height / CONSTANTS.BLOCK_SIZE);
        
        // Recréer le canvas temporaire pour le fog
        this.tempCanvas = document.createElement('canvas');
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
    }

    /**
     * Rendu principal
     */
    render(camera, player, chunkManager, inventory, saplings) {
        this.clear();
        this.drawBackground(camera);
        this.drawWorld(camera, chunkManager);
        this.drawMinableBlockOutline(camera);
        this.drawMiningProgress(camera);
        this.drawDroppedItems(camera, this.game.droppedItems);
        this.drawLighting(camera, player, chunkManager);
        this.drawPlayer(player, camera, inventory);
    }

    clear() {
        this.ctx.fillStyle = '#050510';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground(camera) {
        this.ctx.fillStyle = "white";
        this.stars.forEach(star => {
            let sx = (star.x - camera.x * star.speed * 10) % this.canvas.width;
            let sy = (star.y - camera.y * star.speed * 10) % this.canvas.height;
            if (sx < 0) sx += this.canvas.width;
            if (sy < 0) sy += this.canvas.height;
            
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawWorld(camera, chunkManager) {
        // Calculer l'offset sub-pixel pour la fluidité
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const startX = Math.floor(camera.x);
        const startY = Math.floor(camera.y);
        
        for (let x = startX; x < startX + this.viewWidth + 1; x++) {
            for (let y = startY; y < startY + this.viewHeight + 1; y++) {
                const id = chunkManager.getBlockId(x, y);
                if (id === 0) continue;

                // Calcul fluide sans arrondir la caméra
                const screenX = Math.floor(x * CONSTANTS.BLOCK_SIZE - offsetX);
                const screenY = Math.floor(y * CONSTANTS.BLOCK_SIZE - offsetY);

                if (id === 11) {
                    this.drawTorch(screenX, screenY, x, y);
                } else if (id === 12) {
                    this.drawSapling(screenX, screenY);
                } else if (id === 13) {
                    this.drawLadder(screenX, screenY);
                } else {
                    this.ctx.fillStyle = BLOCK_TYPES[id].color;
                    this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
                }
            }
        }
        for (let x = startX; x < startX + this.viewWidth + 1; x++) {
            for (let y = startY; y < startY + this.viewHeight + 1; y++) {
                const id = chunkManager.getBlockId(x, y);
                if (id === 0) continue;

                const screenX = Math.floor(x * CONSTANTS.BLOCK_SIZE - offsetX);
                const screenY = Math.floor(y * CONSTANTS.BLOCK_SIZE - offsetY);

                if (id === 11) {
                    this.drawTorch(screenX, screenY, x, y);
                } else if (id === 12) {
                    this.drawSapling(screenX, screenY);
                } else if (id === 13) {
                    this.drawLadder(screenX, screenY);
                } else if (id === 14) {
                    this.drawFurnace(screenX, screenY, x, y);
                } else if (id === 18) {
                    this.drawChest(screenX, screenY);
                } else {
                    this.ctx.fillStyle = BLOCK_TYPES[id].color;
                    this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
                }
            }
        }
    }

    drawFurnace(screenX, screenY, worldX, worldY) {
        // Base du four
        this.ctx.fillStyle = '#383736';
        this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
        
        // Détail du haut
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(screenX + 4, screenY + 4, CONSTANTS.BLOCK_SIZE - 8, 8);
        
        // Vérifier si le four est actif
        const furnace = this.game.furnaceManager.furnaces.get(`${worldX},${worldY}`);
        const isBurning = furnace && furnace.isBurning;
        
        // Ouverture du four
        if (isBurning) {
            // Four allumé - animation de feu
            const flicker = Math.sin(Date.now() / 80) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(255, 100, 0, ${flicker})`;
            this.ctx.fillRect(screenX + 8, screenY + 16, CONSTANTS.BLOCK_SIZE - 16, 10);
            
            // Lueur orange
            this.ctx.fillStyle = 'rgba(255, 150, 50, 0.3)';
            this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
        } else {
            // Four éteint
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.fillRect(screenX + 8, screenY + 16, CONSTANTS.BLOCK_SIZE - 16, 10);
        }
        
        // Bordure
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
    }

    drawChest(screenX, screenY) {
        // Base du coffre (bois)
        this.ctx.fillStyle = '#8b5a3c';
        this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
        
        // Détail du couvercle (bois plus foncé)
        this.ctx.fillStyle = '#6d4c37';
        this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, 10);
        
        // Serrure (métal)
        this.ctx.fillStyle = '#d4af37';
        this.ctx.fillRect(screenX + 12, screenY + 14, 8, 10);
        
        // Détail de la serrure
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(screenX + 14, screenY + 18, 4, 3);
        
        // Bordures du coffre
        this.ctx.strokeStyle = '#4d3319';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
        
        // Lignes de détail du bois
        this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(screenX, screenY + 10);
        this.ctx.lineTo(screenX + CONSTANTS.BLOCK_SIZE, screenY + 10);
        this.ctx.stroke();
    }

    drawLadder(screenX, screenY) {
        // Montants verticaux
        this.ctx.fillStyle = '#8b6f47';
        this.ctx.fillRect(screenX + 4, screenY, 6, CONSTANTS.BLOCK_SIZE);
        this.ctx.fillRect(screenX + 22, screenY, 6, CONSTANTS.BLOCK_SIZE);
        
        // Barreaux horizontaux
        this.ctx.fillStyle = '#6d5435';
        this.ctx.fillRect(screenX + 4, screenY + 6, 24, 4);
        this.ctx.fillRect(screenX + 4, screenY + 16, 24, 4);
        this.ctx.fillRect(screenX + 4, screenY + 26, 24, 4);
    }

    drawSapling(screenX, screenY) {
        const bSize = CONSTANTS.BLOCK_SIZE;
        // Tige
        this.ctx.fillStyle = '#5d4037'; 
        this.ctx.fillRect(screenX + bSize/2 - 1, screenY + bSize - 8, 2, 8);
        // Feuilles (Vert clair)
        this.ctx.fillStyle = '#8bc34a';
        this.ctx.fillRect(screenX + bSize/2 - 4, screenY + bSize - 10, 4, 3);
        this.ctx.fillRect(screenX + bSize/2 + 1, screenY + bSize - 12, 4, 3);
    }
    
    drawDroppedItems(camera, droppedItems) {
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;

        droppedItems.forEach(item => {
            const screenX = Math.floor(item.x * CONSTANTS.BLOCK_SIZE - offsetX);
            const screenY = Math.floor(item.y * CONSTANTS.BLOCK_SIZE - offsetY);

            // Animation de rebond subtile
            const bounce = Math.sin(Date.now() / 200) * 2;

            // Dessiner l'item (version miniature)
            const size = 12;
            this.ctx.save();
            this.ctx.translate(screenX, screenY + bounce);
            
            // Rotation lente
            const rotation = (Date.now() / 1000) % (Math.PI * 2);
            this.ctx.rotate(rotation);

            if (item.id === 10) {
                // Bâton
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(-size/2, -size/2, 3, size);
            } else if (item.id === 11) {
                // Torche
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(-size/3, -size/2, 3, size - 2);
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(-size/3, -size/2 - 2, 3, 2);
            } else if (item.id === 13) {
                // Échelle
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(-size/2, -size/2, 2, size);
                this.ctx.fillRect(size/2 - 2, -size/2, 2, size);
                this.ctx.fillStyle = '#6d5435';
                this.ctx.fillRect(-size/2, -2, size, 2);
                this.ctx.fillRect(-size/2, 3, size, 2);
            } else {
                // Bloc standard
                this.ctx.fillStyle = BLOCK_TYPES[item.id].color;
                this.ctx.fillRect(-size/2, -size/2, size, size);
            }

            this.ctx.restore();
        });
    }

    drawTorch(screenX, screenY, worldX, worldY) {
        // Bâton
        this.ctx.fillStyle = '#6d4c41';
        this.ctx.fillRect(screenX + 12, screenY + 12, 8, 20);

        // Mèche
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(screenX + 12, screenY + 8, 8, 4);

        // Animation de la flamme
        const offset = (worldX * 7919 + worldY * 104729);
        const flicker = Math.floor(Math.sin((Date.now() + offset) / 150) * 3);

        // Flamme
        this.ctx.fillStyle = '#ff9800';
        this.ctx.fillRect(screenX + 10, screenY + 2 + flicker, 12, 8 - flicker);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(screenX + 14, screenY + 4 + flicker, 4, 4 - flicker);
    }

    drawLighting(camera, player, chunkManager) {
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const px = Math.floor(player.x * CONSTANTS.BLOCK_SIZE - offsetX);
        const py = Math.floor(player.y * CONSTANTS.BLOCK_SIZE - offsetY);

        const tempCtx = this.tempCanvas.getContext('2d');
        
        // Réinitialiser le canvas temporaire - FOG DE BASE
        tempCtx.globalCompositeOperation = 'source-over';
        tempCtx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        tempCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Passer en mode "gomme" pour percer le noir
        tempCtx.globalCompositeOperation = 'destination-out';

        // Lumière du joueur
        this.drawLightSource(tempCtx, px, py + 12, CONSTANTS.PLAYER_LIGHT_RADIUS);

        // Lumière des torches
        const flicker = Math.sin(Date.now() / 100) * 3;
        const startX = Math.floor(camera.x);
        const startY = Math.floor(camera.y);
        
        for (let x = startX; x < startX + this.viewWidth + 1; x++) {
            for (let y = startY; y < startY + this.viewHeight + 1; y++) {
                if (chunkManager.getBlockId(x, y) === 11) {
                    const tx = Math.floor(x * CONSTANTS.BLOCK_SIZE - offsetX) + 16;
                    const ty = Math.floor(y * CONSTANTS.BLOCK_SIZE - offsetY) + 16;
                    this.drawLightSource(tempCtx, tx, ty, CONSTANTS.TORCH_LIGHT_RADIUS + flicker);
                }
            }
        }

        // Appliquer le fog
        this.ctx.drawImage(this.tempCanvas, 0, 0);
    }

    drawLightSource(ctx, x, y, radius) {
        const gradient = ctx.createRadialGradient(x, y, 30, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPlayer(player, camera, inventory) {
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const px = Math.floor(player.x * CONSTANTS.BLOCK_SIZE - offsetX);
        const py = Math.floor(player.y * CONSTANTS.BLOCK_SIZE - offsetY);
        const pSize = Math.floor(player.width * CONSTANTS.BLOCK_SIZE);
        const pHeight = Math.floor(player.height * CONSTANTS.BLOCK_SIZE);

        this.ctx.save();

        // 1. On déplace le contexte au niveau des PIEDS du joueur (le pivot)
        this.ctx.translate(px, py + pHeight);

        // 2. On applique l'échelle (si player.scaleX n'existe pas encore, on met 1 par défaut)
        const sx = player.scaleX || 1;
        const sy = player.scaleY || 1;
        this.ctx.scale(sx, sy);

        // 3. On dessine les parties du corps par rapport au nouveau point (0,0) qui est aux pieds
        // On remonte de pHeight pour dessiner le haut
        
        // Head (Tête)
        this.ctx.fillStyle = '#a9ab2b';
        this.ctx.fillRect(-pSize / 2, -pHeight, pSize, 12);
        
        // Body (Corps)
        this.ctx.fillStyle = '#15288a';
        this.ctx.fillRect(-pSize / 2, -pHeight + 12, pSize, 12);

        // Item en main
        const selectedItem = inventory.getSelectedItem();
        if (selectedItem) {
            // On ajuste la position car on est dans le repère transformé
            this.drawHeldItem(0, -pHeight + 10, selectedItem.id);
        }

        this.ctx.restore();
    }

    drawHeldItem(x, y, itemId) {
        this.ctx.save();
        this.ctx.translate(x, y);

        switch (itemId) {
            case 10: // Bâton
                this.ctx.rotate(Math.PI / 4);
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(0, -12, 4, 24);
                break;
            case 11: // Torche
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(4, -10, 4, 15);
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(4, -14, 4, 4);
                break;
            case 12: // sapling
                this.ctx.fillStyle = '#4d2c12';
                this.ctx.fillRect(4, -10, 4, 15);
                this.ctx.fillStyle = '#499946'; //vert
                this.ctx.fillRect(2, -14, 8, 8);
                break;
            case 13: // Échelle
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(2, -8, 3, 16);
                this.ctx.fillRect(10, -8, 3, 16);
                this.ctx.fillStyle = '#6d5435';
                this.ctx.fillRect(2, -6, 11, 2);
                this.ctx.fillRect(2, 0, 11, 2);
                this.ctx.fillRect(2, 6, 11, 2);
                break;
            case 19: // Pioche en fer
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(6, -2, 4, 18);
                this.ctx.fillStyle = '#78909c';
                this.ctx.fillRect(2, -8, 20, 6);
                this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
                this.ctx.fillRect(2, -8, 20, 2);
                break;
            case 20: // Hache en fer
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(6, -2, 4, 18);
                this.ctx.fillStyle = '#78909c';
                this.ctx.fillRect(8, -10, 12, 10);
                this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
                this.ctx.fillRect(8, -10, 12, 2);
                break;
            case 21: // Pelle en fer
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(6, -4, 4, 18);
                this.ctx.fillStyle = '#78909c';
                this.ctx.fillRect(4, 12, 8, 8);
                this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
                this.ctx.fillRect(4, 12, 8, 2);
                break;
            case 22: // Épée en fer
                this.ctx.fillStyle = '#78909c';
                this.ctx.fillRect(6, -12, 5, 22);
                this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
                this.ctx.fillRect(7, -12, 2, 22);
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(4, 10, 9, 6);
                this.ctx.strokeStyle = '#4a3729';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(4, 10, 9, 6);
                break;
            case 23: // Pioche en bois
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(6, -2, 4, 18);
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(2, -8, 20, 6);
                this.ctx.fillStyle = 'rgba(139,90,43,0.6)';
                this.ctx.fillRect(2, -8, 20, 2);
                break;
            case 24: // Hache en bois
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(6, -2, 4, 18);
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(8, -10, 12, 10);
                this.ctx.fillStyle = 'rgba(139,90,43,0.6)';
                this.ctx.fillRect(8, -10, 12, 2);
                break;
            case 25: // Pelle en bois
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(6, -4, 4, 18);
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(4, 12, 8, 8);
                this.ctx.fillStyle = 'rgba(139,90,43,0.6)';
                this.ctx.fillRect(4, 12, 8, 2);
                break;
            case 26: // Épée en bois
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(6, -12, 5, 22);
                this.ctx.fillStyle = 'rgba(139,90,43,0.6)';
                this.ctx.fillRect(7, -12, 2, 22);
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(4, 10, 9, 6);
                this.ctx.strokeStyle = '#4a3729';
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(4, 10, 9, 6);
                break;
            default: // Bloc
                this.ctx.fillStyle = BLOCK_TYPES[itemId].color;
                this.ctx.fillRect(4, -4, 12, 12);
        }
        
        this.ctx.restore();
    }

    /**
     * Dessine un liseré gris discret sur le bloc survolé s'il peut être miné
     * Ce liseré suit la souris et indique au joueur s'il a le bon outil
     */
/**
     * Dessine le liseré sur le bloc survolé s'il est à portée et minable
     */
    drawMinableBlockOutline(camera) {
        if (this.game.paused || this.game.inventoryOpen) return;
        
        // Calcul de la position du bloc sous la souris en coordonnées monde
        const mouseWorldX = (this.game.input.mouse.x / CONSTANTS.BLOCK_SIZE) + camera.x;
        const mouseWorldY = (this.game.input.mouse.y / CONSTANTS.BLOCK_SIZE) + camera.y;
        
        const wx = Math.floor(mouseWorldX);
        const wy = Math.floor(mouseWorldY);
        
        // Calcul de la distance entre le centre du joueur et le centre du bloc
        const dx = (wx + 0.5) - this.game.player.x;
        const dy = (wy + 0.5) - (this.game.player.y + 0.5);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        // Si trop loin, on ne dessine rien
        if (distance > CONSTANTS.REACH_DISTANCE) return;
        
        // Vérifier si c'est un bloc réel (pas de l'air)
        const blockId = this.game.chunkManager.getBlockId(wx, wy);
        if (!blockId || blockId === 0) return;

        // Vérifier si le bloc est minable avec l'item actuel (via ta fonction game.js)
        const miningData = this.game.canMineBlock(blockId);
        if (!miningData.canMine) return;

        // --- DESSIN DU LISERÉ ---
        const screenX = Math.floor((wx - camera.x) * CONSTANTS.BLOCK_SIZE);
        const screenY = Math.floor((wy - camera.y) * CONSTANTS.BLOCK_SIZE);
        
        this.ctx.save();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)'; // Blanc semi-transparent
        this.ctx.lineWidth = 2;
        // On dessine un rectangle légèrement plus petit que le bloc pour l'effet "intérieur"
        this.ctx.strokeRect(screenX + 1, screenY + 1, CONSTANTS.BLOCK_SIZE - 2, CONSTANTS.BLOCK_SIZE - 2);
        this.ctx.restore();
    }

    /**
     * Dessine la progression de minage sur le bloc ciblé
     */
    drawMiningProgress(camera) {
        if (!this.game.miningState.active) return;

        const wx = this.game.miningState.x;
        const wy = this.game.miningState.y;
        const progress = this.game.miningState.progress;

        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const screenX = Math.floor(wx * CONSTANTS.BLOCK_SIZE - offsetX);
        const screenY = Math.floor(wy * CONSTANTS.BLOCK_SIZE - offsetY);

        // Effet de fissures progressives
        const crackLevel = Math.floor(progress * 10);
        
        this.ctx.save();
        this.ctx.globalAlpha = 0.6;
        
        // Dessiner les fissures
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        if (crackLevel >= 3) {
            // Première fissure diagonale
            this.ctx.moveTo(screenX, screenY);
            this.ctx.lineTo(screenX + CONSTANTS.BLOCK_SIZE, screenY + CONSTANTS.BLOCK_SIZE);
        }
        
        if (crackLevel >= 5) {
            // Deuxième fissure
            this.ctx.moveTo(screenX + CONSTANTS.BLOCK_SIZE, screenY);
            this.ctx.lineTo(screenX, screenY + CONSTANTS.BLOCK_SIZE);
        }
        
        if (crackLevel >= 7) {
            // Fissures verticales et horizontales
            this.ctx.moveTo(screenX + CONSTANTS.BLOCK_SIZE / 2, screenY);
            this.ctx.lineTo(screenX + CONSTANTS.BLOCK_SIZE / 2, screenY + CONSTANTS.BLOCK_SIZE);
            this.ctx.moveTo(screenX, screenY + CONSTANTS.BLOCK_SIZE / 2);
            this.ctx.lineTo(screenX + CONSTANTS.BLOCK_SIZE, screenY + CONSTANTS.BLOCK_SIZE / 2);
        }
        
        this.ctx.stroke();
        
        // Le liseré gris fixe est déjà affiché par drawMinableBlockOutline
        // Pas besoin de bordure clignotante ici
        
        this.ctx.restore();

        // Barre de progression en dessous du bloc
        const barWidth = CONSTANTS.BLOCK_SIZE;
        const barHeight = 4;
        const barX = screenX;
        const barY = screenY + CONSTANTS.BLOCK_SIZE + 4;

        // Fond de la barre
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(barX, barY, barWidth, barHeight);

        // Progression
        this.ctx.fillStyle = '#4caf50';
        this.ctx.fillRect(barX, barY, barWidth * progress, barHeight);

        // Bordure
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(barX, barY, barWidth, barHeight);
    }
}
/**
 * Gestionnaire d'entrees - clavier et souris
 */
class InputManager {
    constructor(game) {
        this.game = game;
        this.keys = {};
        this.mouse = { x: 0, y: 0, down: false };
        this.setupListeners();
    }

    setupListeners() {
        const self = this;
        
        window.addEventListener('keydown', function(e) { self.handleKeyDown(e); });
        window.addEventListener('keyup', function(e) { self.handleKeyUp(e); });
        window.addEventListener('mousemove', function(e) { self.handleMouseMove(e); });
        window.addEventListener('mousedown', function(e) { self.handleMouseDown(e); });
        window.addEventListener('mouseup', function(e) { self.handleMouseUp(e); });
        window.addEventListener('contextmenu', function(e) { e.preventDefault(); });
        window.addEventListener('wheel', function(e) { self.handleWheel(e); }, { passive: false });
    }

    handleKeyDown(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            return;
        }
        const key = e.key.toLowerCase();
        this.keys[key] = true;

        if (key === 'e' && !this.game.paused) {
            this.game.toggleInventory();
        } else if (key === 'escape') {
            this.game.handleEscape();
        }
    }

    handleKeyUp(e) {
        this.keys[e.key.toLowerCase()] = false;
    }

    handleMouseMove(e) {
        this.mouse.x = e.clientX;
        this.mouse.y = e.clientY;
        
        // Si on mine en maintenant le clic, vérifier si on change de bloc
        if (this.mouse.down && !this.game.paused && !this.game.inventoryOpen) {
            const wx = Math.floor(this.game.camera.x + this.mouse.x / CONSTANTS.BLOCK_SIZE);
            const wy = Math.floor(this.game.camera.y + this.mouse.y / CONSTANTS.BLOCK_SIZE);
            
            // Si on vise un bloc différent, recommencer le minage
            if (this.game.miningState.active && 
                (wx !== this.game.miningState.x || wy !== this.game.miningState.y)) {
                const dx = wx + 0.5 - this.game.player.x;
                const dy = wy + 0.5 - (this.game.player.y + 0.5);
                
                if (Math.sqrt(dx * dx + dy * dy) <= CONSTANTS.REACH_DISTANCE) {
                    this.game.startMining(wx, wy);
                } else {
                    this.game.cancelMining();
                }
            }
        }
        
        // Appeler ui.updateDragPosition au lieu de game.updateDragPosition
        if (this.game.ui) {
            this.game.ui.updateDragPosition(e.clientX, e.clientY);
        }
    }

    handleMouseDown(e) {
        if (this.game.paused || this.game.inventoryOpen) return;
        
        if (e.button === 0) {
            this.mouse.down = true;
            // Démarrer immédiatement le minage
            const wx = Math.floor(this.game.camera.x + this.mouse.x / CONSTANTS.BLOCK_SIZE);
            const wy = Math.floor(this.game.camera.y + this.mouse.y / CONSTANTS.BLOCK_SIZE);
            
            const dx = wx + 0.5 - this.game.player.x;
            const dy = wy + 0.5 - (this.game.player.y + 0.5);
            
            if (Math.sqrt(dx * dx + dy * dy) <= CONSTANTS.REACH_DISTANCE) {
                this.game.startMining(wx, wy);
            }
        }
        if (e.button === 2) this.game.placeBlock();
    }

    handleMouseUp(e) {
        if (e.button === 0) {
            this.mouse.down = false;
            // Annuler le minage en cours
            this.game.cancelMining();
        }
    }

    handleWheel(e) {
        if (this.game.paused || this.game.inventoryOpen) {
            e.preventDefault();
            return;
        }
        
        e.preventDefault();
        const delta = e.deltaY > 0 ? 1 : -1;
        this.game.inventory.changeSelection(delta);
        this.game.ui.update();
    }
}
/**
 * Gestion du joueur - mouvement, physique, collision
 */
class PlayerManager {
    constructor(game) {
        this.game = game;
        this.player = {
            x: 75,
            y: 30,
            vx: 0,
            vy: 0,
            width: CONSTANTS.PLAYER_WIDTH,
            height: CONSTANTS.PLAYER_HEIGHT,
            onGround: false,
            lastJumpTime: 0,
            jumpDelay: 500,
            scaleX: 1,
            scaleY: 1
        };
    }

    reset() {
        this.player.x = 75;
        this.player.y = 30;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.onGround = false;
    }

    update(dt, currentTime) {
        const speed = CONSTANTS.SPEED * dt;
        const gravity = CONSTANTS.GRAVITY * dt;

        // Échelle
        const playerBlockX = Math.floor(this.player.x);
        const playerBlockY = Math.floor(this.player.y + this.player.height / 2);
        const onLadder = this.game.getBlock(playerBlockX, playerBlockY).climbable;

        // Horizontal
        if (this.game.input.keys['q'] || this.game.input.keys['arrowleft']) {
            this.player.vx = -speed;
        } else if (this.game.input.keys['d'] || this.game.input.keys['arrowright']) {
            this.player.vx = speed;
        } else {
            this.player.vx = 0;
        }

        // Vertical
        if (onLadder) {
            this.player.vy = 0;
            if (this.game.input.keys['z'] || this.game.input.keys[' '] || this.game.input.keys['arrowup']) {
                this.player.vy = -speed * 1.2;
            } else if (this.game.input.keys['s'] || this.game.input.keys['arrowdown']) {
                this.player.vy = speed * 1.2;
            }
        } else {
            if ((this.game.input.keys['z'] || this.game.input.keys[' '] || this.game.input.keys['arrowup']) && 
                this.player.onGround && 
                (currentTime - this.player.lastJumpTime) > this.player.jumpDelay) {
                this.player.vy = CONSTANTS.JUMP_FORCE;
                this.player.onGround = false;
                this.player.lastJumpTime = currentTime;
                this.player.scaleX = 0.7;
                this.player.scaleY = 1.3;
            }
            this.player.vy += gravity;
        }

        this.moveX(this.player.vx);
        this.moveY(this.player.vy);

        // Animation squash/stretch
        this.player.scaleX += (1 - this.player.scaleX) * 0.2;
        this.player.scaleY += (1 - this.player.scaleY) * 0.2;
    }

    moveX(dx) {
        const hw = this.player.width / 2;
        const nextX = this.player.x + dx;
        const sideX = Math.floor(nextX + (dx > 0 ? hw : -hw));

        for (let y = Math.floor(this.player.y); y <= Math.floor(this.player.y + this.player.height); y++) {
            if (this.game.getBlock(sideX, y).solid) {
                this.player.vx = 0;
                return;
            }
        }
        this.player.x = nextX;
    }

    moveY(dy) {
        const hw = this.player.width / 2;
        const nextY = this.player.y + dy;

        if (dy > 0) {
            const bottomY = Math.floor(nextY + this.player.height);
            for (let x = Math.floor(this.player.x - hw); x <= Math.floor(this.player.x + hw); x++) {
                if (this.game.getBlock(x, bottomY).solid) {
                    if (!this.player.onGround && dy > 0.1) {
                        this.player.scaleX = 1.3;
                        this.player.scaleY = 0.7;
                    }
                    this.player.y = bottomY - this.player.height - 0.01;
                    this.player.vy = 0;
                    this.player.onGround = true;
                    return;
                }
            }
        } else {
            const topY = Math.floor(nextY);
            for (let x = Math.floor(this.player.x - hw); x <= Math.floor(this.player.x + hw); x++) {
                if (this.game.getBlock(x, topY).solid) {
                    this.player.y = topY + 1 + 0.01;
                    this.player.vy = 0;
                    return;
                }
            }
        }
        
        this.player.y = nextY;
        this.player.onGround = false;
    }

    getPosition() {
        return this.player;
    }
}
/**
 * Système de crafting - grille 3x3 et recettes
 */
class CraftingSystem {
    constructor(game) {
        this.game = game;
        this.grid = [null, null, null, null, null, null, null, null, null];
        this.currentRecipe = null;
    }

    reset() {
        this.returnItemsToInventory();
    }

    toggle() {
        if (this.game.inventoryOpen && !this.game.furnaceManager.isUIOpen) {
            this.returnItemsToInventory();
            
            // Retourner l'item dragué à l'inventaire
            if (this.game.inventory.draggedItem) {
                this.game.inventory.addItem(
                    this.game.inventory.draggedItem.id, 
                    this.game.inventory.draggedItem.count
                );
                this.game.inventory.draggedItem = null;
            }
        }
        
        this.game.inventoryOpen = !this.game.inventoryOpen;
        const grid = document.getElementById('inventoryGrid');
        const craftPanel = document.getElementById('craftingPanel');
        const furnacePanel = document.getElementById('furnacePanel');
        
        if (this.game.inventoryOpen) {
            grid.classList.add('show');
            craftPanel.style.display = 'block';
            if (furnacePanel) furnacePanel.style.display = 'none';
            this.updateUI();
        } else {
            grid.classList.remove('show');
            craftPanel.style.display = 'none';
            this.game.ui.update(); // Mettre à jour l'UI
        }
    }

    handleSlotClick(index, clickType) {
        const slotContent = this.grid[index];
        const draggedItem = this.game.inventory.draggedItem;

        if (clickType === 'middle' && slotContent && !draggedItem) {
            const halfCount = Math.floor(slotContent.count / 2);
            if (halfCount > 0) {
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) this.grid[index] = null;
            }
            this.game.updateUI();
            this.updateUI();
            return;
        }

        if (clickType === 'right') {
            if (draggedItem && !slotContent) {
                this.grid[index] = { id: draggedItem.id, count: 1 };
                draggedItem.count--;
                if (draggedItem.count <= 0) this.game.inventory.draggedItem = null;
                this.game.updateUI();
                this.updateUI();
                return;
            } else if (draggedItem && slotContent && slotContent.id === draggedItem.id) {
                slotContent.count++;
                draggedItem.count--;
                if (draggedItem.count <= 0) this.game.inventory.draggedItem = null;
                this.game.updateUI();
                this.updateUI();
                return;
            } else if (!draggedItem && slotContent) {
                const halfCount = Math.ceil(slotContent.count / 2);
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) this.grid[index] = null;
                this.game.updateUI();
                this.updateUI();
                return;
            }
        }

        if (!draggedItem && slotContent) {
            this.game.inventory.draggedItem = { id: slotContent.id, count: slotContent.count };
            this.grid[index] = null;
        } else if (draggedItem) {
            if (slotContent && slotContent.id === draggedItem.id) {
                slotContent.count += draggedItem.count;
                this.game.inventory.draggedItem = null;
            } else if (!slotContent) {
                this.grid[index] = { id: draggedItem.id, count: draggedItem.count };
                this.game.inventory.draggedItem = null;
            } else {
                const temp = { id: slotContent.id, count: slotContent.count };
                this.grid[index] = { id: draggedItem.id, count: draggedItem.count };
                this.game.inventory.draggedItem = temp;
            }
        }

        this.game.updateUI();
        this.updateUI();
    }

    checkRecipe() {
        const outputSlot = document.getElementById('craftOutputSlot');
        const craftBtn = document.getElementById('craftButton');
        
        if (!outputSlot || !craftBtn) return;

        const currentPattern = [];
        for (let row = 0; row < 3; row++) {
            currentPattern[row] = [];
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                const item = this.grid[index];
                currentPattern[row][col] = item ? item.id : null;
            }
        }

        let matchedRecipe = null;
        
        for (let i = 0; i < RECIPES.length; i++) {
            const recipe = RECIPES[i];
            
            // Recette shapeless (sans forme)
            if (recipe.shapeless) {
                if (this.matchesShapeless(currentPattern, recipe.ingredients)) {
                    matchedRecipe = recipe;
                    break;
                }
            }
            // Recette shaped (avec forme)
            else if (recipe.pattern) {
                if (this.matchesShaped(currentPattern, recipe.pattern)) {
                    matchedRecipe = recipe;
                    break;
                }
            }
        }

        if (matchedRecipe) {
            outputSlot.innerHTML = this.game.getIconHTML(matchedRecipe.output.id) + 
                '<span class="inv-count">' + matchedRecipe.output.count + '</span>';
            craftBtn.disabled = false;
            this.currentRecipe = matchedRecipe;
        } else {
            outputSlot.innerHTML = '';
            craftBtn.disabled = true;
            this.currentRecipe = null;
        }
    }

    /**
     * Vérifie si le pattern correspond à une recette shapeless
     */
    matchesShapeless(currentPattern, ingredients) {
        // Compter les items dans la grille
        const gridItems = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (currentPattern[row][col] !== null) {
                    gridItems.push(currentPattern[row][col]);
                }
            }
        }

        // Vérifier si on a le bon nombre d'items
        if (gridItems.length !== ingredients.length) return false;

        // Compter chaque type d'item requis
        const requiredCounts = {};
        for (let i = 0; i < ingredients.length; i++) {
            const id = ingredients[i];
            requiredCounts[id] = (requiredCounts[id] || 0) + 1;
        }

        // Compter chaque type d'item présent
        const gridCounts = {};
        for (let i = 0; i < gridItems.length; i++) {
            const id = gridItems[i];
            gridCounts[id] = (gridCounts[id] || 0) + 1;
        }

        // Vérifier que les comptes correspondent
        for (const id in requiredCounts) {
            if (gridCounts[id] !== requiredCounts[id]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Vérifie si le pattern correspond à une recette shaped (avec position flexible)
     */
    matchesShaped(currentPattern, recipePattern) {
        // Essayer toutes les positions possibles (décalages)
        for (let offsetRow = 0; offsetRow <= 3 - recipePattern.length; offsetRow++) {
            for (let offsetCol = 0; offsetCol <= 3 - recipePattern[0].length; offsetCol++) {
                if (this.matchesAtOffset(currentPattern, recipePattern, offsetRow, offsetCol)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Vérifie si le pattern correspond à un décalage spécifique
     */
    matchesAtOffset(currentPattern, recipePattern, offsetRow, offsetCol) {
        // Vérifier que la zone du pattern correspond
        for (let row = 0; row < recipePattern.length; row++) {
            for (let col = 0; col < recipePattern[row].length; col++) {
                const gridRow = offsetRow + row;
                const gridCol = offsetCol + col;
                
                if (currentPattern[gridRow][gridCol] !== recipePattern[row][col]) {
                    return false;
                }
            }
        }

        // Vérifier que le reste de la grille est vide
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const isInRecipe = 
                    row >= offsetRow && 
                    row < offsetRow + recipePattern.length &&
                    col >= offsetCol && 
                    col < offsetCol + recipePattern[0].length;
                
                if (!isInRecipe && currentPattern[row][col] !== null) {
                    return false;
                }
            }
        }

        return true;
    }

    patternsMatch(current, recipe) {
        if (!recipe || !Array.isArray(recipe) || recipe.length !== 3) return false;
        
        for (let row = 0; row < 3; row++) {
            if (!recipe[row] || !Array.isArray(recipe[row]) || recipe[row].length !== 3) return false;
            for (let col = 0; col < 3; col++) {
                if (current[row][col] !== recipe[row][col]) return false;
            }
        }
        return true;
    }

    executeCraft() {
        if (!this.currentRecipe) return;

        for (let i = 0; i < 9; i++) {
            const item = this.grid[i];
            if (item) {
                item.count--;
                if (item.count <= 0) this.grid[i] = null;
            }
        }

        this.game.inventory.addItem(this.currentRecipe.output.id, this.currentRecipe.output.count);
        this.game.updateUI();
        this.updateUI();
    }

    returnItemsToInventory() {
        for (let i = 0; i < 9; i++) {
            const item = this.grid[i];
            if (item) {
                this.game.inventory.addItem(item.id, item.count);
                this.grid[i] = null;
            }
        }
        this.game.updateUI();
    }

    updateUI() {
        const grid = document.getElementById('craftingGrid');
        if (!grid) return;
        
        for (let i = 0; i < 9; i++) {
            const slot = grid.children[i];
            const item = this.grid[i];
            if (slot) {
                if (item) {
                    slot.innerHTML = this.game.getIconHTML(item.id) + 
                        '<span class="inv-count">' + item.count + '</span>';
                } else {
                    slot.innerHTML = '';
                }
            }
        }
        
        this.checkRecipe();
    }

    initUI() {
        const grid = document.getElementById('craftingGrid');
        if (!grid || grid.children.length > 0) return;

        for (let i = 0; i < 9; i++) {
            const slot = document.createElement('div');
            slot.className = 'craft-slot';
            
            slot.onmousedown = (function(index, self) {
                return function(e) {
                    e.preventDefault();
                    let clickType = 'left';
                    if (e.button === 0) clickType = 'left';
                    else if (e.button === 1) clickType = 'middle';
                    else if (e.button === 2) clickType = 'right';
                    self.handleSlotClick(index, clickType);
                };
            })(i, this);
            
            slot.oncontextmenu = function(e) { e.preventDefault(); };
            
            const self = this;
            slot.onmouseenter = function(e) {
                if (self.grid[i]) self.game.showTooltip(e, self.grid[i].id);
            };
            slot.onmousemove = this.game.moveTooltip.bind(this.game);
            slot.onmouseleave = this.game.hideTooltip.bind(this.game);
            
            grid.appendChild(slot);
        }
        
        const craftBtn = document.getElementById('craftButton');
        if (craftBtn) {
            craftBtn.onclick = this.executeCraft.bind(this);
        }
    }
}
/**
 * Gestion de l'interface utilisateur
 */
class UIManager {
    constructor(game) {
        this.game = game;
    }

    update() {
        this.renderHotbar();
        this.renderInventoryGrid();
        this.updateDragSlot();
    }

    renderHotbar() {
        const hotbar = document.getElementById('inventoryBar');
        if (!hotbar) return;
        hotbar.innerHTML = '';

        for (let i = 0; i < this.game.inventory.hotbarSize; i++) {
            const item = this.game.inventory.slots[i];
            const slot = this.createSlotElement(item, i === this.game.inventory.selectedSlot, 'inv-slot');
            this.attachTooltipEvents(slot, item);
            hotbar.appendChild(slot);
        }
    }

    renderInventoryGrid() {
        const grid = document.getElementById('inventoryGrid');
        if (!grid) return;
        grid.innerHTML = '';

        const self = this;
        this.game.inventory.slots.forEach(function(item, i) {
            const slot = self.createSlotElement(item, false, 'inv-slot-grid ' + (i < 5 ? 'hotbar-sync' : ''));
            
            slot.onmousedown = (function(index) {
                return function(e) {
                    e.preventDefault();
                    self.game.hideTooltip();
                    
                    let clickType = 'left';
                    if (e.button === 0) clickType = 'left';
                    else if (e.button === 1) clickType = 'middle';
                    else if (e.button === 2) clickType = 'right';
                    
                    self.game.inventory.handleSlotClick(index, clickType);
                    self.game.ui.update();
                };
            })(i);
            
            slot.oncontextmenu = function(e) { e.preventDefault(); };
            
            self.attachTooltipEvents(slot, item);
            grid.appendChild(slot);
        });
    }

    createSlotElement(item, isSelected, className) {
        const slot = document.createElement('div');
        slot.className = className + (isSelected ? ' selected' : '');
        
        if (item) {
            slot.innerHTML = this.game.getIconHTML(item.id) + 
                '<span class="inv-count">' + item.count + '</span>';
        }
        
        return slot;
    }

    attachTooltipEvents(element, item) {
        const self = this;
        element.onmouseenter = function(e) { 
            if (item) self.game.showTooltip(e, item.id); 
        };
        element.onmousemove = this.game.moveTooltip.bind(this.game);
        element.onmouseleave = this.game.hideTooltip.bind(this.game);
    }

    updateDragSlot() {
        const dragSlot = document.getElementById('dragSlot');
        if (!dragSlot) return;
        
        if (this.game.inventory.draggedItem) {
            dragSlot.innerHTML = this.game.getIconHTML(this.game.inventory.draggedItem.id);
            dragSlot.style.display = 'block';
            dragSlot.style.left = this.game.input.mouse.x + 'px';
            dragSlot.style.top = this.game.input.mouse.y + 'px';
        } else {
            dragSlot.style.display = 'none';
        }
    }

    showTooltip(e, id) {
        if (id === null || id === undefined || this.game.inventory.draggedItem) return;
        const tooltip = document.getElementById('tooltip');
        if (!tooltip) return;
        tooltip.style.display = 'block';
        tooltip.innerText = BLOCK_TYPES[id].name;
        this.moveTooltip(e);
    }

    moveTooltip(e) {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.left = (e.clientX + 15) + 'px';
            tooltip.style.top = (e.clientY - 30) + 'px';
        }
    }

    hideTooltip() {
        const tooltip = document.getElementById('tooltip');
        if (tooltip) {
            tooltip.style.display = 'none';
            tooltip.innerText = '';
        }
    }

    updateDragPosition(x, y) {
        const dragSlot = document.getElementById('dragSlot');
        if (dragSlot && this.game.inventory.draggedItem) {
            dragSlot.style.left = x + 'px';
            dragSlot.style.top = y + 'px';
        }
    }
}
/**
 * Gestion du monde - saplings, items au sol, four
 */
class WorldManager {
    constructor(game) {
        this.game = game;
        this.saplings = [];
        this.droppedItems = [];
    }

    reset() {
        this.saplings = [];
        this.droppedItems = [];
    }

    update(dt) {
        this.updateSaplings();
        this.updateDroppedItems(dt);
    }

    updateSaplings() {
        const now = performance.now();
        const self = this;

        this.saplings = this.saplings.filter(function(s) {
            if (now < s.time) return true;

            if (self.game.chunkManager.getBlockId(s.x, s.y) !== 12) return false;

            const soil = self.game.chunkManager.getBlockId(s.x, s.y + 1);
            if (soil !== 1 && soil !== 3) return false;

            const chunkInfo = self.game.chunkManager.worldToChunk(s.x);
            const chunk = self.game.chunkManager.get(chunkInfo.chunkX);

            self.game.chunkManager.setBlockId(s.x, s.y, 0);
            self.game.chunkManager.generateTree(chunk.blocks, chunkInfo.localX, s.y + 1, s.x);

            return false;
        });
    }

    updateDroppedItems(dt) {
        const now = performance.now();
        const gravity = CONSTANTS.GRAVITY * dt;
        const self = this;

        this.droppedItems = this.droppedItems.filter(function(item) {
            if (now - item.spawnTime > item.lifetime) return false;

            item.vy += gravity;
            item.vx *= 0.95;

            const nextX = item.x + item.vx;
            const checkX = Math.floor(nextX);
            const checkY = Math.floor(item.y);
            
            if (!self.game.getBlock(checkX, checkY).solid) {
                item.x = nextX;
            } else {
                item.vx = 0;
            }

            const nextY = item.y + item.vy;
            const bottomY = Math.floor(nextY + 0.2);
            
            if (self.game.getBlock(Math.floor(item.x), bottomY).solid) {
                item.y = bottomY - 0.2;
                item.vy = 0;
            } else {
                item.y = nextY;
            }

            const dx = item.x - self.game.playerManager.player.x;
            const dy = item.y - (self.game.playerManager.player.y + self.game.playerManager.player.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 1.5) {
                self.game.inventory.addItem(item.id, item.count);
                self.game.ui.update();
                return false;
            }

            return true;
        });
    }

    dropItem(x, y, id, count) {
        this.droppedItems.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.1,
            vy: -0.05,
            id: id,
            count: count,
            spawnTime: performance.now(),
            lifetime: 60000
        });
    }

    addSapling(x, y) {
        this.saplings.push({
            x: x,
            y: y,
            time: performance.now() + 5000 + Math.random() * 8000
        });
    }

     breakFurnace(x, y) {
        // Appeler le furnaceManager pour qu'il drop les items
        this.game.furnaceManager.breakFurnace(x, y);
    }

    breakChest(x, y) {
        // Appeler le chestManager pour qu'il drop les items
        this.game.chestManager.breakChest(x, y);
    }
}
/**
 * Gestionnaire de Mods - Permet d'ajouter des blocs, outils et recettes personnalisés
 */
class ModManager {
    constructor() {
        this.loadedMods = [];
        this.customBlocks = {};
        this.customRecipes = [];
        this.customOres = []; // NOUVEAU : Liste des minerais à générer
        this.nextBlockId = 100; // ID de départ pour les blocs de mods
        this.blockIdMap = new Map(); // Map pour convertir les noms en IDs
    }

    /**
     * Charge un mod en exécutant son script
     */
    loadMod(modData) {
        try {
            console.log(`[MOD] Chargement de "${modData.name}" v${modData.version}`);

            // Valider le mod
            if (!this.validateMod(modData)) {
                console.error(`[MOD] Erreur : Le mod "${modData.name}" est invalide`);
                return false;
            }

            // Créer une map locale pour ce mod (nom → ID)
            const localIdMap = {};

            // Appliquer les blocs personnalisés
            if (modData.blocks) {
                for (const blockName in modData.blocks) {
                    const blockData = modData.blocks[blockName];
                    const assignedId = this.nextBlockId++;
                    
                    // Stocker la correspondance nom → ID
                    localIdMap[blockName] = assignedId;
                    this.blockIdMap.set(modData.name + ':' + blockName, assignedId);
                    
                    // Ajouter au jeu
                    BLOCK_TYPES[assignedId] = blockData;
                    this.customBlocks[assignedId] = blockData;
                    
                    console.log(`  ✓ Bloc ajouté : ${blockData.name} (${blockName} → ID: ${assignedId})`);
                    
                    // Si c'est un minerai avec génération, l'enregistrer
                    if (blockData.worldGen) {
                        this.customOres.push({
                            id: assignedId,
                            name: blockData.name,
                            rarity: blockData.worldGen.rarity || 0.01,
                            minDepth: blockData.worldGen.minDepth || 0,
                            maxDepth: blockData.worldGen.maxDepth || 80,
                            veinSize: blockData.worldGen.veinSize || 3
                        });
                        console.log(`    → Génération activée : rareté ${(blockData.worldGen.rarity * 100).toFixed(1)}%, profondeur ${blockData.worldGen.minDepth}-${blockData.worldGen.maxDepth}`);
                    }
                }
            }

            // Appliquer les recettes personnalisées (remplacer les noms par les IDs)
            if (modData.recipes) {
                for (let i = 0; i < modData.recipes.length; i++) {
                    const recipe = modData.recipes[i];
                    const processedRecipe = this.processRecipe(recipe, localIdMap);
                    RECIPES.push(processedRecipe);
                    this.customRecipes.push(processedRecipe);
                    console.log(`  ✓ Recette ajoutée : ${recipe.name}`);
                }
            }

            // Appliquer les recettes de fusion (remplacer les noms par les IDs)
            if (modData.smeltingRecipes) {
                for (const inputName in modData.smeltingRecipes) {
                    const inputId = localIdMap[inputName];
                    const smeltingData = modData.smeltingRecipes[inputName];
                    const outputId = localIdMap[smeltingData.output] || smeltingData.output;
                    
                    if (inputId) {
                        SMELTING_RECIPES[inputId] = {
                            id: outputId,
                            count: smeltingData.count,
                            time: smeltingData.time
                        };
                        console.log(`  ✓ Recette de fusion ajoutée : ${inputName} (ID:${inputId}) → ${smeltingData.output} (ID:${outputId})`);
                    }
                }
            }

            // Appeler l'initialisation du mod si elle existe
            if (modData.onLoad) {
                modData.onLoad(localIdMap);
            }

            this.loadedMods.push(modData);
            console.log(`[MOD] "${modData.name}" chargé avec succès !`);
            console.log(`[MOD] IDs attribués :`, localIdMap);
            return true;

        } catch (error) {
            console.error(`[MOD] Erreur lors du chargement :`, error);
            return false;
        }
    }

    /**
     * Traite une recette en remplaçant les noms de blocs par leurs IDs
     */
    processRecipe(recipe, idMap) {
        const processed = { ...recipe };

        // Traiter le output
        if (recipe.output) {
            processed.output = {
                id: typeof recipe.output.id === 'string' ? idMap[recipe.output.id] : recipe.output.id,
                count: recipe.output.count
            };
        }

        // Traiter les ingredients (shapeless)
        if (recipe.ingredients) {
            processed.ingredients = recipe.ingredients.map(ing => 
                typeof ing === 'string' ? idMap[ing] : ing
            );
        }

        // Traiter le pattern (shaped)
        if (recipe.pattern) {
            processed.pattern = recipe.pattern.map(row =>
                row.map(cell => {
                    if (cell === null) return null;
                    return typeof cell === 'string' ? idMap[cell] : cell;
                })
            );
        }

        return processed;
    }

    /**
     * Valide la structure d'un mod
     */
    validateMod(mod) {
        if (!mod.name || !mod.version || !mod.author) {
            console.error('[MOD] Erreur : Le mod doit avoir name, version et author');
            return false;
        }

        // Valider les blocs
        if (mod.blocks) {
            for (const blockName in mod.blocks) {
                const block = mod.blocks[blockName];
                if (!block.name || block.color === undefined) {
                    console.error(`[MOD] Erreur : Bloc ${blockName} invalide (name et color requis)`);
                    return false;
                }
            }
        }

        // Valider les recettes
        if (mod.recipes) {
            for (let i = 0; i < mod.recipes.length; i++) {
                const recipe = mod.recipes[i];
                if (!recipe.name || !recipe.output) {
                    console.error(`[MOD] Erreur : Recette ${i} invalide`);
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Charge tous les mods depuis la variable globale MODS
     */
    loadAllMods() {
        if (typeof MODS === 'undefined' || !MODS) {
            console.log('[MOD] Aucun mod trouvé');
            return false;
        }

        console.log('[MOD] Chargement des mods...');
        
        let loadedCount = 0;
        for (let i = 0; i < MODS.length; i++) {
            if (this.loadMod(MODS[i])) {
                loadedCount++;
            }
        }

        console.log(`[MOD] ${loadedCount} mod(s) chargé(s)`);
        console.log(`[MOD] Prochain ID disponible : ${this.nextBlockId}`);
        return true;
    }

    /**
     * Obtient la liste des mods chargés
     */
    getLoadedMods() {
        return this.loadedMods.map(mod => ({
            name: mod.name,
            version: mod.version,
            author: mod.author,
            description: mod.description
        }));
    }

    /**
     * Affiche les informations des mods dans la console
     */
    listMods() {
        if (this.loadedMods.length === 0) {
            console.log('[MOD] Aucun mod chargé');
            return;
        }
        
        console.log('=== MODS CHARGÉS ===');
        this.loadedMods.forEach(mod => {
            console.log(`📦 ${mod.name} v${mod.version} par ${mod.author}`);
            if (mod.description) {
                console.log(`   ${mod.description}`);
            }
        });
        console.log('===================');
    }
}
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
            minableWith: ['pickaxe', 'hand'], // Outils acceptés
            // GÉNÉRATION DANS LE MONDE (optionnel)
            worldGen: {
                rarity: 0.01,      // 1% de chance de génération
                minDepth: 0,       // Profondeur minimale (Y)
                maxDepth: 80,      // Profondeur maximale (Y)
                veinSize: 2        // Taille des filons (2x2)
            }
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
                rarity: 0.8,      // 1.8% de chance (entre charbon 2% et fer 1.5%)
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
/**
 * Gestionnaire de sauvegarde pour NightMine v0.3
 * Sauvegarde automatique + Import/Export
 */
class SaveManager {
    constructor(game) {
        this.game = game;
        this.saveKey = 'nightmine_save_v03';
        this.autoSaveInterval = 30000; // Sauvegarde toutes les 30 secondes
        this.autoSaveTimer = null;
        
        this.startAutoSave();
    }

    /**
     * Démarre la sauvegarde automatique
     */
    startAutoSave() {
        // Sauvegarde initiale après 5 secondes
        setTimeout(() => this.autoSave(), 5000);
        
        // Puis toutes les 30 secondes
        this.autoSaveTimer = setInterval(() => {
            this.autoSave();
        }, this.autoSaveInterval);
    }

    /**
     * Arrête la sauvegarde automatique
     */
    stopAutoSave() {
        if (this.autoSaveTimer) {
            clearInterval(this.autoSaveTimer);
            this.autoSaveTimer = null;
        }
    }

    /**
     * Sauvegarde automatique en localStorage
     */
    autoSave() {
        try {
            const saveData = this.createSaveData();
            localStorage.setItem(this.saveKey, JSON.stringify(saveData));
            console.log('[SaveManager] Sauvegarde automatique effectuée');
        } catch (error) {
            console.error('[SaveManager] Erreur lors de la sauvegarde automatique:', error);
        }
    }

    /**
     * Crée les données de sauvegarde
     */
    createSaveData() {
        return {
            version: '0.3',
            timestamp: Date.now(),
            seed: this.game.chunkManager.seed,
            
            // Joueur
            player: {
                x: this.game.player.x,
                y: this.game.player.y,
                vx: this.game.player.vx,
                vy: this.game.player.vy
            },
            
            // Inventaire
            inventory: {
                slots: this.game.inventory.slots.map(slot => 
                    slot ? { id: slot.id, count: slot.count } : null
                ),
                selectedSlot: this.game.inventory.selectedSlot
            },
            
            // Monde
            world: {
                saplings: this.game.world.saplings,
                droppedItems: this.game.world.droppedItems,
                furnaces: this.game.world.furnaces,
                chests: this.game.world.chests
            },
            
            // Chunks modifiés
            chunks: this.serializeChunks()
        };
    }

    /**
     * Sérialise les chunks modifiés
     */
    serializeChunks() {
        const chunksData = {};
        
        for (let [chunkKey, chunk] of this.game.chunkManager.chunks) {
            // Ne sauvegarder que les chunks qui ont été modifiés
            if (chunk.modified) {
                // Convertir le tableau 2D en tableau 1D pour la sérialisation
                const flatBlocks = [];
                for (let x = 0; x < chunk.blocks.length; x++) {
                    for (let y = 0; y < chunk.blocks[x].length; y++) {
                        flatBlocks.push(chunk.blocks[x][y]);
                    }
                }
                
                chunksData[chunkKey] = {
                    blocks: flatBlocks,
                    width: chunk.blocks.length,
                    height: chunk.blocks[0].length,
                    modified: true
                };
            }
        }
        
        return chunksData;
    }

    /**
     * Charge une sauvegarde depuis localStorage
     */
    loadSave() {
        try {
            const saveString = localStorage.getItem(this.saveKey);
            if (!saveString) {
                console.log('[SaveManager] Aucune sauvegarde trouvée');
                return false;
            }
            
            const saveData = JSON.parse(saveString);
            this.applySaveData(saveData);
            console.log('[SaveManager] Sauvegarde chargée avec succès');
            return true;
        } catch (error) {
            console.error('[SaveManager] Erreur lors du chargement:', error);
            return false;
        }
    }

    /**
     * Applique les données de sauvegarde au jeu
     */
    applySaveData(saveData) {
        // Recréer le monde avec le bon seed
        this.game.chunkManager = new ChunkManager(saveData.seed, this.game.modManager);
        
        // Restaurer le joueur
        this.game.player.x = saveData.player.x;
        this.game.player.y = saveData.player.y;
        this.game.player.vx = saveData.player.vx;
        this.game.player.vy = saveData.player.vy;
        
        // Restaurer l'inventaire
        this.game.inventory.slots = saveData.inventory.slots.map(slot => 
            slot ? { id: slot.id, count: slot.count } : null
        );
        this.game.inventory.selectedSlot = saveData.inventory.selectedSlot;
        
        // Restaurer le monde
        this.game.world.saplings = saveData.world.saplings || [];
        this.game.world.droppedItems = saveData.world.droppedItems || [];
        this.game.world.furnaces = saveData.world.furnaces || {};
        this.game.world.chests = saveData.world.chests || {};
        
        // Restaurer les chunks modifiés
        this.deserializeChunks(saveData.chunks);
        
        // Mettre à jour l'UI
        this.game.ui.update();
        this.game.crafting.updateUI();
    }

    /**
     * Désérialise et charge les chunks
     */
    deserializeChunks(chunksData) {
        if (!chunksData) return;
        
        for (let chunkKey in chunksData) {
            const chunkData = chunksData[chunkKey];
            const chunkX = parseInt(chunkKey);
            
            // Créer ou récupérer le chunk
            const chunk = this.game.chunkManager.getChunk(chunkX, 0);
            
            // Reconstruire le tableau 2D à partir du tableau 1D
            const width = chunkData.width || CONSTANTS.CHUNK_WIDTH;
            const height = chunkData.height || CONSTANTS.WORLD_HEIGHT;
            
            let idx = 0;
            for (let x = 0; x < width; x++) {
                if (!chunk.blocks[x]) {
                    chunk.blocks[x] = [];
                }
                for (let y = 0; y < height; y++) {
                    chunk.blocks[x][y] = chunkData.blocks[idx++];
                }
            }
            
            chunk.modified = true;
        }
    }

    /**
     * Exporte la sauvegarde en fichier JSON
     */
    exportSave() {
        try {
            const saveData = this.createSaveData();
            const saveString = JSON.stringify(saveData, null, 2);
            const blob = new Blob([saveString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `nightmine_save_${Date.now()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('[SaveManager] Sauvegarde exportée');
            this.showNotification('Sauvegarde exportée !');
        } catch (error) {
            console.error('[SaveManager] Erreur lors de l\'export:', error);
            this.showNotification('Erreur lors de l\'export');
        }
    }

    /**
     * Importe une sauvegarde depuis un fichier JSON
     */
    importSave(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const saveData = JSON.parse(e.target.result);
                    
                    // Vérifier la version
                    if (!saveData.version) {
                        throw new Error('Format de sauvegarde invalide');
                    }
                    
                    // Appliquer la sauvegarde
                    this.applySaveData(saveData);
                    
                    // Sauvegarder dans localStorage
                    localStorage.setItem(this.saveKey, JSON.stringify(saveData));
                    
                    console.log('[SaveManager] Sauvegarde importée');
                    this.showNotification('Sauvegarde importée !');
                    resolve(true);
                } catch (error) {
                    console.error('[SaveManager] Erreur lors de l\'import:', error);
                    this.showNotification('Erreur lors de l\'import');
                    reject(error);
                }
            };
            
            reader.onerror = () => {
                reject(new Error('Erreur de lecture du fichier'));
            };
            
            reader.readAsText(file);
        });
    }

    /**
     * Supprime la sauvegarde
     */
    deleteSave() {
        try {
            localStorage.removeItem(this.saveKey);
            console.log('[SaveManager] Sauvegarde supprimée');
            this.showNotification('Sauvegarde supprimée');
        } catch (error) {
            console.error('[SaveManager] Erreur lors de la suppression:', error);
        }
    }

    /**
     * Vérifie si une sauvegarde existe
     */
    hasSave() {
        return localStorage.getItem(this.saveKey) !== null;
    }

    /**
     * Obtient les informations sur la sauvegarde
     */
    getSaveInfo() {
        try {
            const saveString = localStorage.getItem(this.saveKey);
            if (!saveString) return null;
            
            const saveData = JSON.parse(saveString);
            return {
                version: saveData.version,
                timestamp: saveData.timestamp,
                seed: saveData.seed,
                date: new Date(saveData.timestamp).toLocaleString('fr-FR')
            };
        } catch (error) {
            console.error('[SaveManager] Erreur lors de la lecture des infos:', error);
            return null;
        }
    }

    /**
     * Affiche une notification temporaire
     */
    showNotification(message) {
        const notification = document.getElementById('saveNotification');
        if (notification) {
            notification.textContent = message;
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 2000);
        }
    }
}
/**
 * Classe principale du jeu - orchestrateur
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Initialiser le ModManager en premier
        this.modManager = new ModManager();
        
        // Sous-systèmes
        this.playerManager = new PlayerManager(this);
        this.inventory = new InventoryManager(CONSTANTS.INVENTORY_SIZE, CONSTANTS.HOTBAR_SIZE);
        this.chunkManager = new ChunkManager(Math.floor(Math.random() * 999999), this.modManager);
        this.furnaceManager = new FurnaceManager(this);
        this.chestManager = new ChestManager(this);
        this.crafting = new CraftingSystem(this);
        this.world = new WorldManager(this);
        this.ui = new UIManager(this);
        this.renderer = new Renderer(this.canvas, this);
        this.input = new InputManager(this);
        this.saveManager = new SaveManager(this); // NOUVEAU : Gestionnaire de sauvegarde

        // État
        this.paused = false;
        this.inventoryOpen = false;
        this.camera = { x: 0, y: 0 };
        this.lastTime = performance.now();
        this.dt = 1;

        // Système de minage progressif
        this.miningState = {
            active: false,
            x: null,
            y: null,
            progress: 0,
            totalTime: 0,
            startTime: 0
        };

        // Items de départ (seulement si pas de sauvegarde)
        if (!this.saveManager.hasSave()) {
            this.inventory.addItem(1, 5);
            this.inventory.addItem(2, 16);
            this.inventory.addItem(11, 10);
            this.inventory.addItem(9, 10); // 10 planches pour crafter des outils en bois
            this.inventory.addItem(16, 3); // 3 lingots de fer pour tester
        }

        this.init();
    }

    init() {
        const self = this;
        window.addEventListener('resize', function() {
            self.renderer.resize();
        });
        this.renderer.resize();
        
        // Charger les mods AVANT de créer les chunks
        this.modManager.loadAllMods();
        this.modManager.listMods();
        
        // Charger la sauvegarde si elle existe
        if (this.saveManager.hasSave()) {
            this.saveManager.loadSave();
        }
        
        this.crafting.initUI();
        this.chestManager.initUI();
        this.ui.update();
        
        this.gameLoop();
    }

    // Getters pour compatibilité
    get player() { return this.playerManager.player; }
    get saplings() { return this.world.saplings; }
    get droppedItems() { return this.world.droppedItems; }

    togglePause() {
        this.paused = !this.paused;
        document.getElementById('seedInput').value = this.chunkManager.seed;
        
        // Mettre à jour les infos de sauvegarde
        this.updateSaveInfo();
        
        document.getElementById('pauseOverlay').classList.toggle('show', this.paused);
    }

    regenerateWorld(newSeed) {
        if (newSeed === "" || newSeed === undefined) return;
        
        const seed = parseInt(newSeed);
        this.chunkManager = new ChunkManager(seed);
        
        this.playerManager.reset();
        this.world.reset();
        
        // Réinitialiser l'inventaire
        this.inventory = new InventoryManager(CONSTANTS.INVENTORY_SIZE, CONSTANTS.HOTBAR_SIZE);
        
        // Ajouter les items de départ
        this.inventory.addItem(1, 5); //5 blocs de terre
        this.inventory.addItem(2, 16); // 16 blocs de pierre
        this.inventory.addItem(11, 10); // 10 torches
        this.inventory.addItem(9, 10); // 10 planches pour crafter des outils en bois
        this.inventory.addItem(16, 3); // 3 lingots de fer pour tester
        
        // Mettre à jour l'UI
        this.ui.update();
        this.crafting.updateUI();
        
        document.getElementById('seedInput').value = seed;
        this.togglePause();
    }

    toggleInventory() {
        this.crafting.toggle();
    }

    handleEscape() {
        if (this.furnaceManager.isUIOpen) {
            this.furnaceManager.closeFurnace();
            this.hideTooltip();
            return;
        }
        
        if (this.chestManager.isUIOpen) {
            this.chestManager.closeChest();
            this.hideTooltip();
            return;
        }
        
        if (this.inventoryOpen) {
            this.crafting.returnItemsToInventory();
            
            // Retourner l'item dragué à l'inventaire
            if (this.inventory.draggedItem) {
                this.inventory.addItem(this.inventory.draggedItem.id, this.inventory.draggedItem.count);
                this.inventory.draggedItem = null;
            }
            
            this.inventoryOpen = false;
            
            const grid = document.getElementById('inventoryGrid');
            const craftPanel = document.getElementById('craftingPanel');
            const furnacePanel = document.getElementById('furnacePanel');
            
            if (grid) grid.classList.remove('show');
            if (craftPanel) craftPanel.style.display = 'none';
            if (furnacePanel) furnacePanel.style.display = 'none';
            
            this.ui.hideTooltip();
            this.ui.update(); // Mettre à jour l'UI pour refléter les changements
        } else {
            this.togglePause();
        }
    }

    update() {
        const currentTime = Date.now();
        this.dt = Math.min((performance.now() - this.lastTime) / 16.6, 3);
        this.lastTime = performance.now();

        this.furnaceManager.update();

        if (this.paused || this.inventoryOpen) return;
        
        this.world.update(this.dt);
        this.playerManager.update(this.dt, currentTime);
        this.updateMining();
        this.checkContinuousMining(); // Nouvelle vérification
        this.updateCamera();
    }

    updateMining() {
        if (!this.miningState.active) return;

        const now = performance.now();
        const elapsed = now - this.miningState.startTime;
        this.miningState.progress = Math.min(elapsed / this.miningState.totalTime, 1);

        // Vérifier si le bloc est toujours là et à portée
        const wx = this.miningState.x;
        const wy = this.miningState.y;
        const dx = wx + 0.5 - this.player.x;
        const dy = wy + 0.5 - (this.player.y + 0.5);
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > CONSTANTS.REACH_DISTANCE || this.chunkManager.getBlockId(wx, wy) === 0) {
            this.cancelMining();
            return;
        }

        // Minage complété
        if (this.miningState.progress >= 1) {
            this.completeBlockBreak(wx, wy);
        }
    }

    // Vérifie si on doit démarrer un nouveau minage avec le clic maintenu
    checkContinuousMining() {
        // Si pas de minage actif ET clic maintenu
        if (!this.miningState.active && this.input.mouse.down) {
            const wx = Math.floor(this.camera.x + this.input.mouse.x / CONSTANTS.BLOCK_SIZE);
            const wy = Math.floor(this.camera.y + this.input.mouse.y / CONSTANTS.BLOCK_SIZE);
            
            const dx = wx + 0.5 - this.player.x;
            const dy = wy + 0.5 - (this.player.y + 0.5);
            
            if (Math.sqrt(dx * dx + dy * dy) <= CONSTANTS.REACH_DISTANCE) {
                const blockId = this.chunkManager.getBlockId(wx, wy);
                if (blockId && blockId !== 0) {
                    this.startMining(wx, wy);
                }
            }
        }
    }

    startMining(wx, wy) {
        const id = this.chunkManager.getBlockId(wx, wy);
        if (!id || id === 0 || BLOCK_TYPES[id].unbreakable) return;

        // Vérifier si on peut miner ce bloc avec l'outil actuel
        const miningData = this.canMineBlock(id);
        if (!miningData.canMine) return;

        this.miningState = {
            active: true,
            x: wx,
            y: wy,
            progress: 0,
            totalTime: miningData.time,
            startTime: performance.now()
        };
    }

    cancelMining() {
        this.miningState = {
            active: false,
            x: null,
            y: null,
            progress: 0,
            totalTime: 0,
            startTime: 0
        };
    }

    canMineBlock(blockId) {
        const block = BLOCK_TYPES[blockId];
        if (!block || block.unbreakable) return { canMine: false, time: 0 };

        const selectedItem = this.inventory.getSelectedItem();
        let toolType = 'hand';
        let efficiency = 0.2; // Main = très lent

        if (selectedItem) {
            const tool = BLOCK_TYPES[selectedItem.id];
            if (tool && tool.tool) {
                toolType = tool.toolType;
                efficiency = tool.efficiency || 1;
            }
        }

        // Vérifier si le bloc peut être miné avec cet outil
        if (!block.minableWith) {
            return { canMine: true, time: (block.hardness || 1) * 1000 / efficiency };
        }

        if (!block.minableWith.includes(toolType)) {
            return { canMine: false, time: 0 };
        }

        // Calculer le temps de minage en millisecondes
        const baseTime = (block.hardness || 1) * 1000;
        const finalTime = baseTime / efficiency;

        return { canMine: true, time: finalTime };
    }

    completeBlockBreak(wx, wy) {
        const id = this.chunkManager.getBlockId(wx, wy);
        
        if (id === 14) {
            this.world.breakFurnace(wx, wy);
        }
        
        if (id === 18) {
            this.world.breakChest(wx, wy);
        }
        
        this.world.dropItem(wx + 0.5, wy + 0.5, id, 1);
        this.chunkManager.setBlockId(wx, wy, 0);
        this.checkAndBreakUnsupportedTorches(wx, wy);
        this.ui.update();
        this.cancelMining();
        
        // checkContinuousMining() dans update() s'occupera de redémarrer le minage
    }

    checkAndBreakUnsupportedTorches(wx, wy) {
        const adjacent = [
            { x: wx - 1, y: wy },
            { x: wx + 1, y: wy },
            { x: wx, y: wy - 1 },
            { x: wx, y: wy + 1 }
        ];

        for (let i = 0; i < adjacent.length; i++) {
            const pos = adjacent[i];
            const blockId = this.chunkManager.getBlockId(pos.x, pos.y);
            
            if (blockId === 11) {
                const hasSupport = 
                    this.getBlock(pos.x - 1, pos.y).solid ||
                    this.getBlock(pos.x + 1, pos.y).solid ||
                    this.getBlock(pos.x, pos.y - 1).solid ||
                    this.getBlock(pos.x, pos.y + 1).solid;
                
                if (!hasSupport) {
                    this.world.dropItem(pos.x + 0.5, pos.y + 0.5, 11, 1);
                    this.chunkManager.setBlockId(pos.x, pos.y, 0);
                }
            }
        }
    }

    placeBlock() {
        const wx = Math.floor(this.camera.x + this.input.mouse.x / CONSTANTS.BLOCK_SIZE);
        const wy = Math.floor(this.camera.y + this.input.mouse.y / CONSTANTS.BLOCK_SIZE);

        const dx = wx + 0.5 - this.player.x;
        const dy = wy + 0.5 - (this.player.y + 0.5);
        
        if (Math.sqrt(dx * dx + dy * dy) > CONSTANTS.REACH_DISTANCE) return;
        
        const existingBlock = this.chunkManager.getBlockId(wx, wy);
        
        if (existingBlock === 14) {
            this.furnaceManager.openFurnace(wx, wy);
            return;
        }
        
        if (existingBlock === 18) {
            this.chestManager.openChest(wx, wy);
            return;
        }
        
        if (existingBlock !== 0) return;

        const selectedItem = this.inventory.getSelectedItem();
        if (!selectedItem || selectedItem.count <= 0) return;

        const blockData = BLOCK_TYPES[selectedItem.id];
        
        if (selectedItem.id === 12) {
            const below = this.chunkManager.getBlockId(wx, wy + 1);
            if (below !== 1 && below !== 3) return;
        }
        
        if (selectedItem.id === 11) {
            const hasAdjacentBlock = 
                this.getBlock(wx - 1, wy).solid ||
                this.getBlock(wx + 1, wy).solid ||
                this.getBlock(wx, wy + 1).solid;
            
            if (!hasAdjacentBlock) return;
        }
        
        if (blockData.isItem) return;

        this.chunkManager.setBlockId(wx, wy, selectedItem.id);
        
        if (selectedItem.id === 12) {
            this.world.addSapling(wx, wy);
        }
        
        selectedItem.count--;
        if (selectedItem.count <= 0) {
            this.inventory.slots[this.inventory.selectedSlot] = null;
        }
        
        this.ui.update();
        this.crafting.updateUI();
    }

    getBlock(x, y) {
        const blockId = this.chunkManager.getBlockId(Math.floor(x), Math.floor(y));
        return BLOCK_TYPES[blockId] || { solid: false };
    }

    updateCamera() {
        const player = this.player;
        this.camera.x = player.x - this.renderer.viewWidth / 2;
        this.camera.y = Math.max(
            0,
            Math.min(
                player.y - this.renderer.viewHeight / 2,
                CONSTANTS.WORLD_HEIGHT - this.renderer.viewHeight
            )
        );
    }

    // Méthodes de sauvegarde
    updateSaveInfo() {
        const saveInfo = this.saveManager.getSaveInfo();
        const saveInfoElement = document.getElementById('saveInfo');
        
        if (saveInfoElement) {
            if (saveInfo) {
                saveInfoElement.textContent = `Dernière sauvegarde: ${saveInfo.date}`;
            } else {
                saveInfoElement.textContent = 'Aucune sauvegarde';
            }
        }
    }

    exportSave() {
        this.saveManager.exportSave();
    }

    importSave() {
        const fileInput = document.getElementById('importFileInput');
        fileInput.click();
    }

    handleImportFile(file) {
        if (file) {
            this.saveManager.importSave(file).then(() => {
                // Fermer le menu pause après import
                this.togglePause();
            }).catch(error => {
                console.error('Erreur import:', error);
            });
        }
    }

    deleteSave() {
        if (confirm('Voulez-vous vraiment supprimer la sauvegarde ?')) {
            this.saveManager.deleteSave();
            this.updateSaveInfo();
        }
    }

    newGame() {
        if (confirm('Commencer une nouvelle partie ? (La sauvegarde actuelle sera supprimée)')) {
            this.saveManager.deleteSave();
            location.reload();
        }
    }

    // Méthodes utilitaires exposées
    getIconHTML(id) {
        if (id === 10) return '<div class="pixel-icon icon-stick"></div>';
        if (id === 11) return '<div class="pixel-icon icon-torch"></div>';
        if (id === 12) return '<div class="pixel-icon icon-sapling"></div>';
        if (id === 13) return '<div class="pixel-icon icon-ladder"></div>';
        if (id === 14) return '<div class="pixel-icon icon-furnace"></div>';
        if (id === 15) return '<div class="block-icon" style="background:#2a2a2a"></div>'; // Charbon de bois
        if (id === 16) return '<div class="pixel-icon icon-iron-ingot"></div>';
        if (id === 17) return '<div class="pixel-icon icon-gold-ingot"></div>';
        if (id === 18) return '<div class="pixel-icon icon-chest"></div>';
        if (id === 19) return '<div class="pixel-icon icon-pickaxe"></div>';
        if (id === 20) return '<div class="pixel-icon icon-axe"></div>';
        if (id === 21) return '<div class="pixel-icon icon-shovel"></div>';
        if (id === 22) return '<div class="pixel-icon icon-sword"></div>';
        if (id === 23) return '<div class="pixel-icon icon-wood-pickaxe"></div>';
        if (id === 24) return '<div class="pixel-icon icon-wood-axe"></div>';
        if (id === 25) return '<div class="pixel-icon icon-wood-shovel"></div>';
        if (id === 26) return '<div class="pixel-icon icon-wood-sword"></div>';
        return '<div class="block-icon" style="background:' + BLOCK_TYPES[id].color + '"></div>';
    }

    showTooltip(e, id) { this.ui.showTooltip(e, id); }
    moveTooltip(e) { this.ui.moveTooltip(e); }
    hideTooltip() { this.ui.hideTooltip(); }
    updateUI() { this.ui.update(); }

    gameLoop() {
        this.update();
        this.renderer.render(this.camera, this.player, this.chunkManager, this.inventory, this.world.saplings);
        requestAnimationFrame(this.gameLoop.bind(this));
    }
}

const game = new Game();
