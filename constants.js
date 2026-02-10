/**
 * Constantes du jeu
 */
const CONSTANTS = {
    BLOCK_SIZE: 32,
    CHUNK_WIDTH: 16,
    WORLD_SEED: 123456,
    WORLD_HEIGHT: 80,
    PLAYER_WIDTH: 0.75,
    PLAYER_HEIGHT: 0.75,
    GRAVITY: 0.02,
    SPEED: 0.12,
    JUMP_FORCE: -0.18,
    MINING_COOLDOWN: 15,
    REACH_DISTANCE: 4.5,
    TORCH_LIGHT_RADIUS: 150,
    PLAYER_LIGHT_RADIUS: 220,
    INVENTORY_SIZE: 20,
    HOTBAR_SIZE: 5,
    SEED_MULTIPLIERS: {
        GROUND: 100,
        ORE: 1000,
        IRON: 1500,
        TREE: 50,
        CAVE: 3000,
        CAVE_DETAIL: 5000
    },
    CAVE: {
        FREQUENCY: 0.04,
        THRESHOLD: 0.35,
        DETAIL_SCALE: 0.12,
        MIN_DEPTH: 3,
        MAX_DEPTH: 60
    },
    FURNACE: {
        SMELT_TIME: 3000,
        FUEL_TIME: 8000,
        SLOTS: {
            INPUT: 0,
            FUEL: 1,
            OUTPUT: 2
        }
    }
};
