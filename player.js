/**
 * Gestion du joueur - mouvement, physique, collision
 */
class PlayerManager {
    constructor(game) {
        this.game = game;
        this.player = {
            x: 75,
            y: 30,
            vx: 0,
            vy: 0,
            width: CONSTANTS.PLAYER_WIDTH,
            height: CONSTANTS.PLAYER_HEIGHT,
            onGround: false,
            lastJumpTime: 0,
            jumpDelay: 500,
            scaleX: 1,
            scaleY: 1
        };
    }

    reset() {
        this.player.x = 75;
        this.player.y = 30;
        this.player.vx = 0;
        this.player.vy = 0;
        this.player.onGround = false;
    }

    update(dt, currentTime) {
        const speed = CONSTANTS.SPEED * dt;
        const gravity = CONSTANTS.GRAVITY * dt;

        // Échelle
        const playerBlockX = Math.floor(this.player.x);
        const playerBlockY = Math.floor(this.player.y + this.player.height / 2);
        const onLadder = this.game.getBlock(playerBlockX, playerBlockY).climbable;

        // Horizontal
        if (this.game.input.keys['q'] || this.game.input.keys['arrowleft']) {
            this.player.vx = -speed;
        } else if (this.game.input.keys['d'] || this.game.input.keys['arrowright']) {
            this.player.vx = speed;
        } else {
            this.player.vx = 0;
        }

        // Vertical
        if (onLadder) {
            this.player.vy = 0;
            if (this.game.input.keys['z'] || this.game.input.keys[' '] || this.game.input.keys['arrowup']) {
                this.player.vy = -speed * 1.2;
            } else if (this.game.input.keys['s'] || this.game.input.keys['arrowdown']) {
                this.player.vy = speed * 1.2;
            }
        } else {
            if ((this.game.input.keys['z'] || this.game.input.keys[' '] || this.game.input.keys['arrowup']) && 
                this.player.onGround && 
                (currentTime - this.player.lastJumpTime) > this.player.jumpDelay) {
                this.player.vy = CONSTANTS.JUMP_FORCE;
                this.player.onGround = false;
                this.player.lastJumpTime = currentTime;
                this.player.scaleX = 0.7;
                this.player.scaleY = 1.3;
            }
            this.player.vy += gravity;
        }

        this.moveX(this.player.vx);
        this.moveY(this.player.vy);

        // Animation squash/stretch
        this.player.scaleX += (1 - this.player.scaleX) * 0.2;
        this.player.scaleY += (1 - this.player.scaleY) * 0.2;
    }

    moveX(dx) {
        const hw = this.player.width / 2;
        const nextX = this.player.x + dx;
        const sideX = Math.floor(nextX + (dx > 0 ? hw : -hw));

        for (let y = Math.floor(this.player.y); y <= Math.floor(this.player.y + this.player.height); y++) {
            if (this.game.getBlock(sideX, y).solid) {
                this.player.vx = 0;
                return;
            }
        }
        this.player.x = nextX;
    }

    moveY(dy) {
        const hw = this.player.width / 2;
        const nextY = this.player.y + dy;

        if (dy > 0) {
            const bottomY = Math.floor(nextY + this.player.height);
            for (let x = Math.floor(this.player.x - hw); x <= Math.floor(this.player.x + hw); x++) {
                if (this.game.getBlock(x, bottomY).solid) {
                    if (!this.player.onGround && dy > 0.1) {
                        this.player.scaleX = 1.3;
                        this.player.scaleY = 0.7;
                    }
                    this.player.y = bottomY - this.player.height - 0.01;
                    this.player.vy = 0;
                    this.player.onGround = true;
                    return;
                }
            }
        } else {
            const topY = Math.floor(nextY);
            for (let x = Math.floor(this.player.x - hw); x <= Math.floor(this.player.x + hw); x++) {
                if (this.game.getBlock(x, topY).solid) {
                    this.player.y = topY + 1 + 0.01;
                    this.player.vy = 0;
                    return;
                }
            }
        }
        
        this.player.y = nextY;
        this.player.onGround = false;
    }

    getPosition() {
        return this.player;
    }
}
