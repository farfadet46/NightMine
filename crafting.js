/**
 * Système de crafting - grille 3x3 et recettes
 */
class CraftingSystem {
    constructor(game) {
        this.game = game;
        this.grid = [null, null, null, null, null, null, null, null, null];
        this.currentRecipe = null;
    }

    reset() {
        this.returnItemsToInventory();
    }

    toggle() {
        if (this.game.inventoryOpen && !this.game.furnaceManager.isUIOpen) {
            this.returnItemsToInventory();
            
            // Retourner l'item dragué à l'inventaire
            if (this.game.inventory.draggedItem) {
                this.game.inventory.addItem(
                    this.game.inventory.draggedItem.id, 
                    this.game.inventory.draggedItem.count
                );
                this.game.inventory.draggedItem = null;
            }
        }
        
        this.game.inventoryOpen = !this.game.inventoryOpen;
        const grid = document.getElementById('inventoryGrid');
        const craftPanel = document.getElementById('craftingPanel');
        const furnacePanel = document.getElementById('furnacePanel');
        
        if (this.game.inventoryOpen) {
            grid.classList.add('show');
            craftPanel.style.display = 'block';
            if (furnacePanel) furnacePanel.style.display = 'none';
            this.updateUI();
        } else {
            grid.classList.remove('show');
            craftPanel.style.display = 'none';
            this.game.ui.update(); // Mettre à jour l'UI
        }
    }

    handleSlotClick(index, clickType) {
        const slotContent = this.grid[index];
        const draggedItem = this.game.inventory.draggedItem;

        if (clickType === 'middle' && slotContent && !draggedItem) {
            const halfCount = Math.floor(slotContent.count / 2);
            if (halfCount > 0) {
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) this.grid[index] = null;
            }
            this.game.updateUI();
            this.updateUI();
            return;
        }

        if (clickType === 'right') {
            if (draggedItem && !slotContent) {
                this.grid[index] = { id: draggedItem.id, count: 1 };
                draggedItem.count--;
                if (draggedItem.count <= 0) this.game.inventory.draggedItem = null;
                this.game.updateUI();
                this.updateUI();
                return;
            } else if (draggedItem && slotContent && slotContent.id === draggedItem.id) {
                slotContent.count++;
                draggedItem.count--;
                if (draggedItem.count <= 0) this.game.inventory.draggedItem = null;
                this.game.updateUI();
                this.updateUI();
                return;
            } else if (!draggedItem && slotContent) {
                const halfCount = Math.ceil(slotContent.count / 2);
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) this.grid[index] = null;
                this.game.updateUI();
                this.updateUI();
                return;
            }
        }

        if (!draggedItem && slotContent) {
            this.game.inventory.draggedItem = { id: slotContent.id, count: slotContent.count };
            this.grid[index] = null;
        } else if (draggedItem) {
            if (slotContent && slotContent.id === draggedItem.id) {
                slotContent.count += draggedItem.count;
                this.game.inventory.draggedItem = null;
            } else if (!slotContent) {
                this.grid[index] = { id: draggedItem.id, count: draggedItem.count };
                this.game.inventory.draggedItem = null;
            } else {
                const temp = { id: slotContent.id, count: slotContent.count };
                this.grid[index] = { id: draggedItem.id, count: draggedItem.count };
                this.game.inventory.draggedItem = temp;
            }
        }

        this.game.updateUI();
        this.updateUI();
    }

    checkRecipe() {
        const outputSlot = document.getElementById('craftOutputSlot');
        const craftBtn = document.getElementById('craftButton');
        
        if (!outputSlot || !craftBtn) return;

        const currentPattern = [];
        for (let row = 0; row < 3; row++) {
            currentPattern[row] = [];
            for (let col = 0; col < 3; col++) {
                const index = row * 3 + col;
                const item = this.grid[index];
                currentPattern[row][col] = item ? item.id : null;
            }
        }

        let matchedRecipe = null;
        
        for (let i = 0; i < RECIPES.length; i++) {
            const recipe = RECIPES[i];
            
            // Recette shapeless (sans forme)
            if (recipe.shapeless) {
                if (this.matchesShapeless(currentPattern, recipe.ingredients)) {
                    matchedRecipe = recipe;
                    break;
                }
            }
            // Recette shaped (avec forme)
            else if (recipe.pattern) {
                if (this.matchesShaped(currentPattern, recipe.pattern)) {
                    matchedRecipe = recipe;
                    break;
                }
            }
        }

        if (matchedRecipe) {
            outputSlot.innerHTML = this.game.getIconHTML(matchedRecipe.output.id) + 
                '<span class="inv-count">' + matchedRecipe.output.count + '</span>';
            craftBtn.disabled = false;
            this.currentRecipe = matchedRecipe;
        } else {
            outputSlot.innerHTML = '';
            craftBtn.disabled = true;
            this.currentRecipe = null;
        }
    }

    /**
     * Vérifie si le pattern correspond à une recette shapeless
     */
    matchesShapeless(currentPattern, ingredients) {
        // Compter les items dans la grille
        const gridItems = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (currentPattern[row][col] !== null) {
                    gridItems.push(currentPattern[row][col]);
                }
            }
        }

        // Vérifier si on a le bon nombre d'items
        if (gridItems.length !== ingredients.length) return false;

        // Compter chaque type d'item requis
        const requiredCounts = {};
        for (let i = 0; i < ingredients.length; i++) {
            const id = ingredients[i];
            requiredCounts[id] = (requiredCounts[id] || 0) + 1;
        }

        // Compter chaque type d'item présent
        const gridCounts = {};
        for (let i = 0; i < gridItems.length; i++) {
            const id = gridItems[i];
            gridCounts[id] = (gridCounts[id] || 0) + 1;
        }

        // Vérifier que les comptes correspondent
        for (const id in requiredCounts) {
            if (gridCounts[id] !== requiredCounts[id]) {
                return false;
            }
        }

        return true;
    }

    /**
     * Vérifie si le pattern correspond à une recette shaped (avec position flexible)
     */
    matchesShaped(currentPattern, recipePattern) {
        // Essayer toutes les positions possibles (décalages)
        for (let offsetRow = 0; offsetRow <= 3 - recipePattern.length; offsetRow++) {
            for (let offsetCol = 0; offsetCol <= 3 - recipePattern[0].length; offsetCol++) {
                if (this.matchesAtOffset(currentPattern, recipePattern, offsetRow, offsetCol)) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Vérifie si le pattern correspond à un décalage spécifique
     */
    matchesAtOffset(currentPattern, recipePattern, offsetRow, offsetCol) {
        // Vérifier que la zone du pattern correspond
        for (let row = 0; row < recipePattern.length; row++) {
            for (let col = 0; col < recipePattern[row].length; col++) {
                const gridRow = offsetRow + row;
                const gridCol = offsetCol + col;
                
                if (currentPattern[gridRow][gridCol] !== recipePattern[row][col]) {
                    return false;
                }
            }
        }

        // Vérifier que le reste de la grille est vide
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const isInRecipe = 
                    row >= offsetRow && 
                    row < offsetRow + recipePattern.length &&
                    col >= offsetCol && 
                    col < offsetCol + recipePattern[0].length;
                
                if (!isInRecipe && currentPattern[row][col] !== null) {
                    return false;
                }
            }
        }

        return true;
    }

    patternsMatch(current, recipe) {
        if (!recipe || !Array.isArray(recipe) || recipe.length !== 3) return false;
        
        for (let row = 0; row < 3; row++) {
            if (!recipe[row] || !Array.isArray(recipe[row]) || recipe[row].length !== 3) return false;
            for (let col = 0; col < 3; col++) {
                if (current[row][col] !== recipe[row][col]) return false;
            }
        }
        return true;
    }

    executeCraft() {
        if (!this.currentRecipe) return;

        for (let i = 0; i < 9; i++) {
            const item = this.grid[i];
            if (item) {
                item.count--;
                if (item.count <= 0) this.grid[i] = null;
            }
        }

        this.game.inventory.addItem(this.currentRecipe.output.id, this.currentRecipe.output.count);
        this.game.updateUI();
        this.updateUI();
    }

    returnItemsToInventory() {
        for (let i = 0; i < 9; i++) {
            const item = this.grid[i];
            if (item) {
                this.game.inventory.addItem(item.id, item.count);
                this.grid[i] = null;
            }
        }
        this.game.updateUI();
    }

    updateUI() {
        const grid = document.getElementById('craftingGrid');
        if (!grid) return;
        
        for (let i = 0; i < 9; i++) {
            const slot = grid.children[i];
            const item = this.grid[i];
            if (slot) {
                if (item) {
                    slot.innerHTML = this.game.getIconHTML(item.id) + 
                        '<span class="inv-count">' + item.count + '</span>';
                } else {
                    slot.innerHTML = '';
                }
            }
        }
        
        this.checkRecipe();
    }

    initUI() {
        const grid = document.getElementById('craftingGrid');
        if (!grid || grid.children.length > 0) return;

        for (let i = 0; i < 9; i++) {
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
                if (self.grid[i]) self.game.showTooltip(e, self.grid[i].id);
            };
            slot.onmousemove = this.game.moveTooltip.bind(this.game);
            slot.onmouseleave = this.game.hideTooltip.bind(this.game);
            
            grid.appendChild(slot);
        }
        
        const craftBtn = document.getElementById('craftButton');
        if (craftBtn) {
            craftBtn.onclick = this.executeCraft.bind(this);
        }
    }
}
