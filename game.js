/**
 * Classe principale du jeu - orchestrateur
 */
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Sous-systèmes
        this.playerManager = new PlayerManager(this);
        this.inventory = new InventoryManager(CONSTANTS.INVENTORY_SIZE, CONSTANTS.HOTBAR_SIZE);
        //this.chunkManager = new ChunkManager(CONSTANTS.WORLD_SEED);
        this.chunkManager = new ChunkManager(Math.floor(Math.random() * 999999));
        this.furnaceManager = new FurnaceManager(this);
        this.crafting = new CraftingSystem(this);
        this.world = new WorldManager(this);
        this.ui = new UIManager(this);
        this.renderer = new Renderer(this.canvas, this);
        this.input = new InputManager(this);

        // État
        this.paused = false;
        this.inventoryOpen = false;
        this.camera = { x: 0, y: 0 };
        this.miningCooldown = 0;
        this.lastTime = performance.now();
        this.dt = 1;

        // Items de départ
        this.inventory.addItem(1, 5);
        this.inventory.addItem(2, 16);
        this.inventory.addItem(11, 10);

        this.init();
    }

    init() {
        const self = this;
        window.addEventListener('resize', function() {
            self.renderer.resize();
        });
        this.renderer.resize();
        this.crafting.initUI();
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
        document.getElementById('pauseOverlay').classList.toggle('show', this.paused);
    }

    regenerateWorld(newSeed) {
        if (newSeed === "" || newSeed === undefined) return;
        
        const seed = parseInt(newSeed);
        this.chunkManager = new ChunkManager(seed);
        
        this.playerManager.reset();
        this.world.reset();
        
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
        
        if (this.inventoryOpen) {
            this.crafting.returnItemsToInventory();
            this.inventoryOpen = false;
            
            const grid = document.getElementById('inventoryGrid');
            const craftPanel = document.getElementById('craftingPanel');
            const furnacePanel = document.getElementById('furnacePanel');
            
            if (grid) grid.classList.remove('show');
            if (craftPanel) craftPanel.style.display = 'none';
            if (furnacePanel) furnacePanel.style.display = 'none';
            
            this.ui.hideTooltip();
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
        this.handleMining();
        this.updateCamera();
    }

    handleMining() {
        if (this.miningCooldown > 0) {
            this.miningCooldown -= this.dt;
        }
        
        if (this.input.mouse.down && this.miningCooldown <= 0) {
            this.mineBlock();
            this.miningCooldown = CONSTANTS.MINING_COOLDOWN;
        }
    }

    mineBlock() {
        const wx = Math.floor(this.camera.x + this.input.mouse.x / CONSTANTS.BLOCK_SIZE);
        const wy = Math.floor(this.camera.y + this.input.mouse.y / CONSTANTS.BLOCK_SIZE);
        
        const dx = wx + 0.5 - this.player.x;
        const dy = wy + 0.5 - (this.player.y + 0.5);
        
        if (Math.sqrt(dx * dx + dy * dy) > CONSTANTS.REACH_DISTANCE) return;

        const id = this.chunkManager.getBlockId(wx, wy);
        if (id && id !== 0 && !BLOCK_TYPES[id].unbreakable) {
            if (id === 14) {
                this.world.breakFurnace(wx, wy);
            }
            
            this.world.dropItem(wx + 0.5, wy + 0.5, id, 1);
            this.chunkManager.setBlockId(wx, wy, 0);
            this.checkAndBreakUnsupportedTorches(wx, wy);
            this.ui.update();
        }
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

    // Méthodes utilitaires exposées
    getIconHTML(id) {
        if (id === 10) return '<div class="pixel-icon icon-stick"></div>';
        if (id === 11) return '<div class="pixel-icon icon-torch"></div>';
        if (id === 12) return '<div class="pixel-icon icon-sapling"></div>';
        if (id === 13) return '<div class="pixel-icon icon-ladder"></div>';
        if (id === 14) return '<div class="pixel-icon icon-furnace"></div>';
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
