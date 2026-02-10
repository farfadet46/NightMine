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
