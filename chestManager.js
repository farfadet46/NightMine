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
