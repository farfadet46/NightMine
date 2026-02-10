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
