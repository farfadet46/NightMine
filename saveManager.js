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
