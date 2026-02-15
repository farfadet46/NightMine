/**
 * Gestionnaire de four - gere la cuisson des items
 */
class FurnaceManager {
    constructor(game) {
        this.game = game;
        this.furnaces = new Map();
        this.currentFurnacePos = null;
        this.isUIOpen = false;
    }

    getOrCreateFurnace(x, y) {
        const key = x + ',' + y;
        if (!this.furnaces.has(key)) {
            this.furnaces.set(key, {
                input: null,
                fuel: null,
                output: null,
                progress: 0,
                burnProgress: 0,
                isBurning: false,
                lastUpdate: performance.now()
            });
        }
        return this.furnaces.get(key);
    }

    openFurnace(x, y) {
        this.currentFurnacePos = { x: x, y: y };
        this.isUIOpen = true;
        this.game.paused = true;
        this.game.inventoryOpen = true;
        
        // Afficher l'inventaire
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            grid.classList.add('show');
        }
        
        // CACHER le craft
        const craftPanel = document.getElementById('craftingPanel');
        if (craftPanel) {
            craftPanel.style.display = 'none';
        }
        
        // Afficher le four
        const furnacePanel = document.getElementById('furnacePanel');
        if (furnacePanel) {
            furnacePanel.style.display = 'block';
        }
        
        this.updateUI();
        this.game.updateUI();
    }

    closeFurnace() {
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
        this.currentFurnacePos = null;
        this.game.paused = false;
        this.game.inventoryOpen = false;
        
        const grid = document.getElementById('inventoryGrid');
        if (grid) {
            grid.classList.remove('show');
        }
        
        const furnacePanel = document.getElementById('furnacePanel');
        if (furnacePanel) {
            furnacePanel.style.display = 'none';
        }
        
        this.game.updateUI();
    }

    // Cette méthode est appelée quand on CASSSE le four (pas quand on ferme l'UI)
    breakFurnace(x, y) {
        const key = x + ',' + y;
        const furnace = this.furnaces.get(key);
        if (!furnace) return;
        
        // Dropper tous les items au sol
        const slots = ['input', 'fuel', 'output'];
        for (let i = 0; i < slots.length; i++) {
            const slot = slots[i];
            if (furnace[slot]) {
                this.game.world.dropItem(x + 0.5, y + 0.5, furnace[slot].id, furnace[slot].count);
            }
        }
        
        // Supprimer le four de la liste
        this.furnaces.delete(key);
    }

    update() {
        const now = performance.now();
        const self = this;
        
        this.furnaces.forEach(function(furnace, key) {
            const dt = now - furnace.lastUpdate;
            furnace.lastUpdate = now;

            // Vérifier s'il y a quelque chose à cuire
            const hasSmeltableInput = furnace.input && SMELTING_RECIPES[furnace.input.id];

            if (furnace.isBurning) {
                furnace.burnProgress -= (dt / CONSTANTS.FURNACE.FUEL_TIME) * 100;
                
                // Arrêter si plus de fuel OU plus rien à cuire
                if (furnace.burnProgress <= 0 || !hasSmeltableInput) {
                    furnace.isBurning = false;
                    furnace.burnProgress = 0;
                    
                    // Ne reconsummer que si on a encore quelque chose à cuire ET du fuel
                    if (hasSmeltableInput && furnace.fuel && furnace.fuel.count > 0) {
                        self.consumeFuel(furnace);
                    }
                }
            }

            // Cuisson uniquement si on brûle ET on a un input valide
            if (furnace.isBurning && hasSmeltableInput) {
                const recipe = SMELTING_RECIPES[furnace.input.id];
                furnace.progress += (dt / recipe.time) * 100;
                
                if (furnace.progress >= 100) {
                    self.completeSmelting(furnace, recipe);
                }
            }

            // Auto-start : démarrer uniquement si on a input + fuel
            if (!furnace.isBurning && hasSmeltableInput && furnace.fuel && BLOCK_TYPES[furnace.fuel.id].isFuel) {
                self.consumeFuel(furnace);
            }

            // Mise à jour UI
            if (self.isUIOpen && self.currentFurnacePos) {
                const currentKey = self.currentFurnacePos.x + ',' + self.currentFurnacePos.y;
                if (key === currentKey) {
                    self.updateUIFurnace(furnace);
                }
            }
        });
    }

    consumeFuel(furnace) {
        const fuelData = BLOCK_TYPES[furnace.fuel.id];
        if (!fuelData || !fuelData.isFuel) return;

        furnace.fuel.count--;
        furnace.isBurning = true;
        furnace.burnProgress = 100;
        
        if (furnace.fuel.count <= 0) {
            furnace.fuel = null;
        }
    }

    completeSmelting(furnace, recipe) {
        furnace.progress = 0;
        furnace.input.count--;
        
        if (furnace.input.count <= 0) {
            furnace.input = null;
        }

        if (furnace.output && furnace.output.id === recipe.id) {
            furnace.output.count += recipe.count;
        } else if (!furnace.output) {
            furnace.output = { id: recipe.id, count: recipe.count };
        }
    }

    handleSlotClick(slotType, clickType) {
        const furnace = this.getOrCreateFurnace(this.currentFurnacePos.x, this.currentFurnacePos.y);
        const slotContent = furnace[slotType];
        const draggedItem = this.game.inventory.draggedItem;

        // Le slot output ne permet que de prendre, pas de poser
        if (slotType === 'output') {
            if (!slotContent) return; // Rien à prendre
            
            // Clic droit ou molette : prendre la moitié
            if (clickType === 'right' || clickType === 'middle') {
                const halfCount = Math.ceil(slotContent.count / 2);
                if (!draggedItem) {
                    // Prendre la moitié dans le curseur
                    this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                    slotContent.count -= halfCount;
                    if (slotContent.count <= 0) {
                        furnace.output = null;
                    }
                } else if (draggedItem.id === slotContent.id) {
                    // Empiler sur l'item draggué
                    draggedItem.count += halfCount;
                    slotContent.count -= halfCount;
                    if (slotContent.count <= 0) {
                        furnace.output = null;
                    }
                }
            } 
            // Clic gauche : prendre tout
            else {
                if (!draggedItem) {
                    // Prendre tout dans le curseur
                    this.game.inventory.draggedItem = { id: slotContent.id, count: slotContent.count };
                    furnace.output = null;
                } else if (draggedItem.id === slotContent.id) {
                    // Empiler sur l'item draggué
                    draggedItem.count += slotContent.count;
                    furnace.output = null;
                } else {
                    // Echanger
                    const temp = { id: draggedItem.id, count: draggedItem.count };
                    this.game.inventory.draggedItem = { id: slotContent.id, count: slotContent.count };
                    furnace.output = temp;
                }
            }
            
            this.game.updateUI();
            this.updateUI();
            return;
        }

        // Clic molette : diviser (pour input et fuel)
        if (clickType === 'middle' && slotContent && !draggedItem) {
            const halfCount = Math.floor(slotContent.count / 2);
            if (halfCount > 0) {
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    furnace[slotType] = null;
                }
            }
            this.game.updateUI();
            this.updateUI();
            return;
        }

        // Clic droit (pour input et fuel)
        if (clickType === 'right') {
            // Deposer 1 item
            if (draggedItem && !slotContent) {
                if (!this.canPlaceInSlot(slotType, draggedItem.id)) return;
                furnace[slotType] = { id: draggedItem.id, count: 1 };
                draggedItem.count--;
                if (draggedItem.count <= 0) {
                    this.game.inventory.draggedItem = null;
                }
                this.checkAutoStart(furnace);
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
            // Prendre la moitie
            else if (!draggedItem && slotContent) {
                const halfCount = Math.ceil(slotContent.count / 2);
                this.game.inventory.draggedItem = { id: slotContent.id, count: halfCount };
                slotContent.count -= halfCount;
                if (slotContent.count <= 0) {
                    furnace[slotType] = null;
                }
                this.checkAutoStop(furnace);
                this.game.updateUI();
                this.updateUI();
                return;
            }
        }

        // Clic gauche (pour input et fuel)
        if (!draggedItem && slotContent) {
            // Prendre tout
            this.game.inventory.draggedItem = { 
                id: slotContent.id, 
                count: slotContent.count 
            };
            furnace[slotType] = null;
            this.checkAutoStop(furnace);
        } else if (draggedItem) {
            if (!this.canPlaceInSlot(slotType, draggedItem.id)) return;

            if (slotContent && slotContent.id === draggedItem.id) {
                // Empiler
                slotContent.count += draggedItem.count;
                this.game.inventory.draggedItem = null;
            } else if (!slotContent) {
                // Placer
                furnace[slotType] = { 
                    id: draggedItem.id, 
                    count: draggedItem.count 
                };
                this.game.inventory.draggedItem = null;
            } else {
                // Echanger
                const temp = { 
                    id: slotContent.id, 
                    count: slotContent.count 
                };
                furnace[slotType] = { 
                    id: draggedItem.id, 
                    count: draggedItem.count 
                };
                this.game.inventory.draggedItem = temp;
            }
            this.checkAutoStart(furnace);
        }

        this.game.updateUI();
        this.updateUI();
    }

    canPlaceInSlot(slotType, itemId) {
        const itemData = BLOCK_TYPES[itemId];
        
        if (slotType === 'input') {
            return SMELTING_RECIPES.hasOwnProperty(itemId);
        } else if (slotType === 'fuel') {
            return itemData && itemData.isFuel;
        } else if (slotType === 'output') {
            return false;
        }
        return true;
    }

    checkAutoStart(furnace) {
        if (furnace.isBurning) return;
        if (!furnace.input) return;
        if (!SMELTING_RECIPES[furnace.input.id]) return;

        if (furnace.fuel && BLOCK_TYPES[furnace.fuel.id].isFuel) {
            this.consumeFuel(furnace);
        }
    }

    checkAutoStop(furnace) {
        if (!furnace.input || !SMELTING_RECIPES[furnace.input.id]) {
            furnace.progress = 0;
        }
    }

    updateUI() {
        if (!this.isUIOpen) return;
        
        const furnace = this.getOrCreateFurnace(this.currentFurnacePos.x, this.currentFurnacePos.y);
        this.updateUIFurnace(furnace);
    }

    updateUIFurnace(furnace) {
        const inputSlot = document.getElementById('furnaceInput');
        const fuelSlot = document.getElementById('furnaceFuel');
        const outputSlot = document.getElementById('furnaceOutput');
        
        if (inputSlot) this.updateSlotDisplay(inputSlot, furnace.input);
        if (fuelSlot) this.updateSlotDisplay(fuelSlot, furnace.fuel);
        if (outputSlot) this.updateSlotDisplay(outputSlot, furnace.output);

        const burnBar = document.getElementById('burnProgress');
        const smeltBar = document.getElementById('smeltProgress');
        
        if (burnBar) {
            burnBar.style.width = furnace.burnProgress + '%';
            burnBar.style.opacity = furnace.isBurning ? '1' : '0.3';
        }
        
        if (smeltBar) {
            smeltBar.style.width = furnace.progress + '%';
            smeltBar.style.opacity = (furnace.isBurning && furnace.input) ? '1' : '0.3';
        }

        const flame = document.getElementById('furnaceFlame');
        if (flame) {
            if (furnace.isBurning) {
                flame.style.display = 'block';
                flame.style.opacity = 0.7 + Math.sin(Date.now() / 100) * 0.3;
            } else {
                flame.style.display = 'none';
            }
        }
    }

    updateSlotDisplay(element, item) {
        if (item) {
            element.innerHTML = this.game.getIconHTML(item.id) + 
                '<span class="inv-count">' + item.count + '</span>';
        } else {
            element.innerHTML = '';
        }
    }
}
