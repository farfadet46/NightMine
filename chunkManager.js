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
        const chunk = this.createBaseTerrain(chunkX);
        this.addCaves(chunk, chunkX);  // NOUVEAU : Grottes
        this.addOreVeins(chunk, chunkX);
        this.addCustomOres(chunk, chunkX); // NOUVEAU : Minerais des mods
        this.addTrees(chunk, chunkX);
        return chunk;
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
        return chunk[localX]?.[worldY] || 0;
    }

    /**
     * Définit l'ID d'un bloc aux coordonnées monde
     */
    setBlockId(worldX, worldY, blockId) {
        if (worldY < 0 || worldY >= CONSTANTS.WORLD_HEIGHT) return;
        const { chunkX, localX } = this.worldToChunk(worldX);
        const chunk = this.get(chunkX);
        if (chunk[localX]) {
            chunk[localX][worldY] = blockId;
        }
    }
}
