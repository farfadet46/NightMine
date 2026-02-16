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
