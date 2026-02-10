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
        // Appeler ui.updateDragPosition au lieu de game.updateDragPosition
        if (this.game.ui) {
            this.game.ui.updateDragPosition(e.clientX, e.clientY);
        }
    }

    handleMouseDown(e) {
        if (this.game.paused || this.game.inventoryOpen) return;
        
        if (e.button === 0) this.mouse.down = true;
        if (e.button === 2) this.game.placeBlock();
    }

    handleMouseUp(e) {
        if (e.button === 0) this.mouse.down = false;
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
