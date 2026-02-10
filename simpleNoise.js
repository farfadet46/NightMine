/**
 * Générateur de bruit de Perlin simplifié pour les grottes
 */
class SimpleNoise {
    constructor(seed = 0) {
        this.perm = new Uint8Array(512);
        const random = this.seededRandom(seed);

        for (let i = 0; i < 256; i++) this.perm[i] = i;
        for (let i = 0; i < 256; i++) {
            const j = Math.floor(random() * 256);
            [this.perm[i], this.perm[j]] = [this.perm[j], this.perm[i]];
            this.perm[i + 256] = this.perm[i];
        }
    }
    
    seededRandom(seed) {
        let x = seed;
        return () => {
            x = Math.sin(x++) * 10000;
            return x - Math.floor(x);
        };
    }

    fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
    lerp(t, a, b) { return a + t * (b - a); }
    grad(hash, x, y) {
        const h = hash & 15;
        const u = h < 8 ? x : y;
        const v = h < 4 ? y : h === 12 || h === 14 ? x : 0;
        return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
    }

    noise(x, y) {
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        x -= Math.floor(x);
        y -= Math.floor(y);
        const u = this.fade(x);
        const v = this.fade(y);
        const A = this.perm[X] + Y, B = this.perm[X + 1] + Y;
        
        return this.lerp(v, 
            this.lerp(u, this.grad(this.perm[A], x, y), this.grad(this.perm[B], x - 1, y)),
            this.lerp(u, this.grad(this.perm[A + 1], x, y - 1), this.grad(this.perm[B + 1], x - 1, y - 1))
        );
    }

    // Bruit fractal (octaves)
    fractalNoise(x, y, octaves = 3, persistence = 0.5) {
        let total = 0;
        let frequency = 1;
        let amplitude = 1;
        let maxValue = 0;
        
        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }
        
        return total / maxValue;
    }
}
