/**
 * Système de rendu - gère l'affichage
 */
class Renderer {
    constructor(canvas, game) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.game = game;
        this.tempCanvas = null;
        this.stars = this.generateStars(100);
    }

    /**
     * Génère les étoiles de fond
     */
    generateStars(count) {
        return Array.from({ length: count }, () => ({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            size: Math.random() * 2,
            speed: 0.1 + Math.random() * 0.3
        }));
    }

    /**
     * Redimensionne le canvas
     */
    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.viewWidth = Math.ceil(this.canvas.width / CONSTANTS.BLOCK_SIZE);
        this.viewHeight = Math.ceil(this.canvas.height / CONSTANTS.BLOCK_SIZE);
        
        // Recréer le canvas temporaire pour le fog
        this.tempCanvas = document.createElement('canvas');
        this.tempCanvas.width = this.canvas.width;
        this.tempCanvas.height = this.canvas.height;
    }

    /**
     * Rendu principal
     */
    render(camera, player, chunkManager, inventory, saplings) {
        this.clear();
        this.drawBackground(camera);
        this.drawWorld(camera, chunkManager);
        this.drawDroppedItems(camera, this.game.droppedItems);
        this.drawLighting(camera, player, chunkManager);
        this.drawPlayer(player, camera, inventory);
    }

    clear() {
        this.ctx.fillStyle = '#050510';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground(camera) {
        this.ctx.fillStyle = "white";
        this.stars.forEach(star => {
            let sx = (star.x - camera.x * star.speed * 10) % this.canvas.width;
            let sy = (star.y - camera.y * star.speed * 10) % this.canvas.height;
            if (sx < 0) sx += this.canvas.width;
            if (sy < 0) sy += this.canvas.height;
            
            this.ctx.beginPath();
            this.ctx.arc(sx, sy, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    drawWorld(camera, chunkManager) {
        // Calculer l'offset sub-pixel pour la fluidité
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const startX = Math.floor(camera.x);
        const startY = Math.floor(camera.y);
        
        for (let x = startX; x < startX + this.viewWidth + 1; x++) {
            for (let y = startY; y < startY + this.viewHeight + 1; y++) {
                const id = chunkManager.getBlockId(x, y);
                if (id === 0) continue;

                // Calcul fluide sans arrondir la caméra
                const screenX = Math.floor(x * CONSTANTS.BLOCK_SIZE - offsetX);
                const screenY = Math.floor(y * CONSTANTS.BLOCK_SIZE - offsetY);

                if (id === 11) {
                    this.drawTorch(screenX, screenY, x, y);
                } else if (id === 12) {
                    this.drawSapling(screenX, screenY);
                } else if (id === 13) {
                    this.drawLadder(screenX, screenY);
                } else {
                    this.ctx.fillStyle = BLOCK_TYPES[id].color;
                    this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
                }
            }
        }
        for (let x = startX; x < startX + this.viewWidth + 1; x++) {
            for (let y = startY; y < startY + this.viewHeight + 1; y++) {
                const id = chunkManager.getBlockId(x, y);
                if (id === 0) continue;

                const screenX = Math.floor(x * CONSTANTS.BLOCK_SIZE - offsetX);
                const screenY = Math.floor(y * CONSTANTS.BLOCK_SIZE - offsetY);

                if (id === 11) {
                    this.drawTorch(screenX, screenY, x, y);
                } else if (id === 12) {
                    this.drawSapling(screenX, screenY);
                } else if (id === 13) {
                    this.drawLadder(screenX, screenY);
                } else if (id === 14) {
                    this.drawFurnace(screenX, screenY, x, y);
                } else {
                    this.ctx.fillStyle = BLOCK_TYPES[id].color;
                    this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
                }
            }
        }
    }

    drawFurnace(screenX, screenY, worldX, worldY) {
        // Base du four
        this.ctx.fillStyle = '#3';
        this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
        
        // Détail du haut
        this.ctx.fillStyle = '#2a2a2a';
        this.ctx.fillRect(screenX + 4, screenY + 4, CONSTANTS.BLOCK_SIZE - 8, 8);
        
        // Vérifier si le four est actif
        const furnace = this.game.furnaceManager.furnaces.get(`${worldX},${worldY}`);
        const isBurning = furnace && furnace.isBurning;
        
        // Ouverture du four
        if (isBurning) {
            // Four allumé - animation de feu
            const flicker = Math.sin(Date.now() / 80) * 0.3 + 0.7;
            this.ctx.fillStyle = `rgba(255, 100, 0, ${flicker})`;
            this.ctx.fillRect(screenX + 8, screenY + 16, CONSTANTS.BLOCK_SIZE - 16, 10);
            
            // Lueur orange
            this.ctx.fillStyle = 'rgba(255, 150, 50, 0.3)';
            this.ctx.fillRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
        } else {
            // Four éteint
            this.ctx.fillStyle = '#1a1a1a';
            this.ctx.fillRect(screenX + 8, screenY + 16, CONSTANTS.BLOCK_SIZE - 16, 10);
        }
        
        // Bordure
        this.ctx.strokeStyle = '#555';
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(screenX, screenY, CONSTANTS.BLOCK_SIZE, CONSTANTS.BLOCK_SIZE);
    }

    drawLadder(screenX, screenY) {
        // Montants verticaux
        this.ctx.fillStyle = '#8b6f47';
        this.ctx.fillRect(screenX + 4, screenY, 6, CONSTANTS.BLOCK_SIZE);
        this.ctx.fillRect(screenX + 22, screenY, 6, CONSTANTS.BLOCK_SIZE);
        
        // Barreaux horizontaux
        this.ctx.fillStyle = '#6d5435';
        this.ctx.fillRect(screenX + 4, screenY + 6, 24, 4);
        this.ctx.fillRect(screenX + 4, screenY + 16, 24, 4);
        this.ctx.fillRect(screenX + 4, screenY + 26, 24, 4);
    }

    drawSapling(screenX, screenY) {
        const bSize = CONSTANTS.BLOCK_SIZE;
        // Tige
        this.ctx.fillStyle = '#5d4037'; 
        this.ctx.fillRect(screenX + bSize/2 - 1, screenY + bSize - 8, 2, 8);
        // Feuilles (Vert clair)
        this.ctx.fillStyle = '#8bc34a';
        this.ctx.fillRect(screenX + bSize/2 - 4, screenY + bSize - 10, 4, 3);
        this.ctx.fillRect(screenX + bSize/2 + 1, screenY + bSize - 12, 4, 3);
    }
    
    drawDroppedItems(camera, droppedItems) {
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;

        droppedItems.forEach(item => {
            const screenX = Math.floor(item.x * CONSTANTS.BLOCK_SIZE - offsetX);
            const screenY = Math.floor(item.y * CONSTANTS.BLOCK_SIZE - offsetY);

            // Animation de rebond subtile
            const bounce = Math.sin(Date.now() / 200) * 2;

            // Dessiner l'item (version miniature)
            const size = 12;
            this.ctx.save();
            this.ctx.translate(screenX, screenY + bounce);
            
            // Rotation lente
            const rotation = (Date.now() / 1000) % (Math.PI * 2);
            this.ctx.rotate(rotation);

            if (item.id === 10) {
                // Bâton
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(-size/2, -size/2, 3, size);
            } else if (item.id === 11) {
                // Torche
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(-size/3, -size/2, 3, size - 2);
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(-size/3, -size/2 - 2, 3, 2);
            } else if (item.id === 13) {
                // Échelle
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(-size/2, -size/2, 2, size);
                this.ctx.fillRect(size/2 - 2, -size/2, 2, size);
                this.ctx.fillStyle = '#6d5435';
                this.ctx.fillRect(-size/2, -2, size, 2);
                this.ctx.fillRect(-size/2, 3, size, 2);
            } else {
                // Bloc standard
                this.ctx.fillStyle = BLOCK_TYPES[item.id].color;
                this.ctx.fillRect(-size/2, -size/2, size, size);
            }

            this.ctx.restore();
        });
    }

    drawTorch(screenX, screenY, worldX, worldY) {
        // Bâton
        this.ctx.fillStyle = '#6d4c41';
        this.ctx.fillRect(screenX + 12, screenY + 12, 8, 20);

        // Mèche
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(screenX + 12, screenY + 8, 8, 4);

        // Animation de la flamme
        const offset = (worldX * 7919 + worldY * 104729);
        const flicker = Math.floor(Math.sin((Date.now() + offset) / 150) * 3);

        // Flamme
        this.ctx.fillStyle = '#ff9800';
        this.ctx.fillRect(screenX + 10, screenY + 2 + flicker, 12, 8 - flicker);
        
        this.ctx.fillStyle = '#ffff00';
        this.ctx.fillRect(screenX + 14, screenY + 4 + flicker, 4, 4 - flicker);
    }

    drawLighting(camera, player, chunkManager) {
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const px = Math.floor(player.x * CONSTANTS.BLOCK_SIZE - offsetX);
        const py = Math.floor(player.y * CONSTANTS.BLOCK_SIZE - offsetY);

        const tempCtx = this.tempCanvas.getContext('2d');
        
        // Réinitialiser le canvas temporaire - FOG DE BASE
        tempCtx.globalCompositeOperation = 'source-over';
        tempCtx.fillStyle = 'rgba(0, 0, 0, 0.92)';
        tempCtx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Passer en mode "gomme" pour percer le noir
        tempCtx.globalCompositeOperation = 'destination-out';

        // Lumière du joueur
        this.drawLightSource(tempCtx, px, py + 12, CONSTANTS.PLAYER_LIGHT_RADIUS);

        // Lumière des torches
        const flicker = Math.sin(Date.now() / 100) * 3;
        const startX = Math.floor(camera.x);
        const startY = Math.floor(camera.y);
        
        for (let x = startX; x < startX + this.viewWidth + 1; x++) {
            for (let y = startY; y < startY + this.viewHeight + 1; y++) {
                if (chunkManager.getBlockId(x, y) === 11) {
                    const tx = Math.floor(x * CONSTANTS.BLOCK_SIZE - offsetX) + 16;
                    const ty = Math.floor(y * CONSTANTS.BLOCK_SIZE - offsetY) + 16;
                    this.drawLightSource(tempCtx, tx, ty, CONSTANTS.TORCH_LIGHT_RADIUS + flicker);
                }
            }
        }

        // Appliquer le fog
        this.ctx.drawImage(this.tempCanvas, 0, 0);
    }

    drawLightSource(ctx, x, y, radius) {
        const gradient = ctx.createRadialGradient(x, y, 30, x, y, radius);
        gradient.addColorStop(0, 'rgba(0, 0, 0, 1)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
    }

    drawPlayer(player, camera, inventory) {
        const offsetX = camera.x * CONSTANTS.BLOCK_SIZE;
        const offsetY = camera.y * CONSTANTS.BLOCK_SIZE;
        
        const px = Math.floor(player.x * CONSTANTS.BLOCK_SIZE - offsetX);
        const py = Math.floor(player.y * CONSTANTS.BLOCK_SIZE - offsetY);
        const pSize = Math.floor(player.width * CONSTANTS.BLOCK_SIZE);
        const pHeight = Math.floor(player.height * CONSTANTS.BLOCK_SIZE);

        this.ctx.save();

        // 1. On déplace le contexte au niveau des PIEDS du joueur (le pivot)
        this.ctx.translate(px, py + pHeight);

        // 2. On applique l'échelle (si player.scaleX n'existe pas encore, on met 1 par défaut)
        const sx = player.scaleX || 1;
        const sy = player.scaleY || 1;
        this.ctx.scale(sx, sy);

        // 3. On dessine les parties du corps par rapport au nouveau point (0,0) qui est aux pieds
        // On remonte de pHeight pour dessiner le haut
        
        // Head (Tête)
        this.ctx.fillStyle = '#a9ab2b';
        this.ctx.fillRect(-pSize / 2, -pHeight, pSize, 12);
        
        // Body (Corps)
        this.ctx.fillStyle = '#15288a';
        this.ctx.fillRect(-pSize / 2, -pHeight + 12, pSize, 12);

        // Item en main
        const selectedItem = inventory.getSelectedItem();
        if (selectedItem) {
            // On ajuste la position car on est dans le repère transformé
            this.drawHeldItem(0, -pHeight + 10, selectedItem.id);
        }

        this.ctx.restore();
    }

    drawHeldItem(x, y, itemId) {
        this.ctx.save();
        this.ctx.translate(x, y);

        switch (itemId) {
            case 10: // Bâton
                this.ctx.rotate(Math.PI / 4);
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(0, -12, 4, 24);
                break;
            case 11: // Torche
                this.ctx.fillStyle = '#6d4c41';
                this.ctx.fillRect(4, -10, 4, 15);
                this.ctx.fillStyle = '#333';
                this.ctx.fillRect(4, -14, 4, 4);
                break;
            case 12: // sapling
                this.ctx.fillStyle = '#4d2c12';
                this.ctx.fillRect(4, -10, 4, 15);
                this.ctx.fillStyle = '#499946'; //vert
                this.ctx.fillRect(2, -14, 8, 8);
                break;
            case 13: // Échelle
                this.ctx.fillStyle = '#8b6f47';
                this.ctx.fillRect(2, -8, 3, 16);
                this.ctx.fillRect(10, -8, 3, 16);
                this.ctx.fillStyle = '#6d5435';
                this.ctx.fillRect(2, -6, 11, 2);
                this.ctx.fillRect(2, 0, 11, 2);
                this.ctx.fillRect(2, 6, 11, 2);
                break;
            default: // Bloc
                this.ctx.fillStyle = BLOCK_TYPES[itemId].color;
                this.ctx.fillRect(4, -4, 12, 12);
        }
        
        this.ctx.restore();
    }
}
