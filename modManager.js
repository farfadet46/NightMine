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
