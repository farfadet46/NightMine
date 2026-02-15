/**
 * Gestion du monde - saplings, items au sol, four
 */
class WorldManager {
    constructor(game) {
        this.game = game;
        this.saplings = [];
        this.droppedItems = [];
    }

    reset() {
        this.saplings = [];
        this.droppedItems = [];
    }

    update(dt) {
        this.updateSaplings();
        this.updateDroppedItems(dt);
    }

    updateSaplings() {
        const now = performance.now();
        const self = this;

        this.saplings = this.saplings.filter(function(s) {
            if (now < s.time) return true;

            if (self.game.chunkManager.getBlockId(s.x, s.y) !== 12) return false;

            const soil = self.game.chunkManager.getBlockId(s.x, s.y + 1);
            if (soil !== 1 && soil !== 3) return false;

            const chunkInfo = self.game.chunkManager.worldToChunk(s.x);
            const chunk = self.game.chunkManager.get(chunkInfo.chunkX);

            self.game.chunkManager.setBlockId(s.x, s.y, 0);
            self.game.chunkManager.generateTree(chunk, chunkInfo.localX, s.y + 1, s.x);

            return false;
        });
    }

    updateDroppedItems(dt) {
        const now = performance.now();
        const gravity = CONSTANTS.GRAVITY * dt;
        const self = this;

        this.droppedItems = this.droppedItems.filter(function(item) {
            if (now - item.spawnTime > item.lifetime) return false;

            item.vy += gravity;
            item.vx *= 0.95;

            const nextX = item.x + item.vx;
            const checkX = Math.floor(nextX);
            const checkY = Math.floor(item.y);
            
            if (!self.game.getBlock(checkX, checkY).solid) {
                item.x = nextX;
            } else {
                item.vx = 0;
            }

            const nextY = item.y + item.vy;
            const bottomY = Math.floor(nextY + 0.2);
            
            if (self.game.getBlock(Math.floor(item.x), bottomY).solid) {
                item.y = bottomY - 0.2;
                item.vy = 0;
            } else {
                item.y = nextY;
            }

            const dx = item.x - self.game.playerManager.player.x;
            const dy = item.y - (self.game.playerManager.player.y + self.game.playerManager.player.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 1.5) {
                self.game.inventory.addItem(item.id, item.count);
                self.game.ui.update();
                return false;
            }

            return true;
        });
    }

    dropItem(x, y, id, count) {
        this.droppedItems.push({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 0.1,
            vy: -0.05,
            id: id,
            count: count,
            spawnTime: performance.now(),
            lifetime: 60000
        });
    }

    addSapling(x, y) {
        this.saplings.push({
            x: x,
            y: y,
            time: performance.now() + 5000 + Math.random() * 8000
        });
    }

     breakFurnace(x, y) {
        // Appeler le furnaceManager pour qu'il drop les items
        this.game.furnaceManager.breakFurnace(x, y);
    }

    breakChest(x, y) {
        // Appeler le chestManager pour qu'il drop les items
        this.game.chestManager.breakChest(x, y);
    }
}
