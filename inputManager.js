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
