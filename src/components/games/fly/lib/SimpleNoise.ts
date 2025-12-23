export class SimpleNoise {
  grad3: Float32Array;
  p: Uint8Array;
  perm: Uint8Array;

  constructor() {
    this.grad3 = new Float32Array([
      1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1, 0, 1, 0, 1, -1, 0, 1, 1, 0, -1, -1,
      0, -1, 0, 1, 1, 0, -1, 1, 0, 1, -1, 0, -1, -1,
    ]);
    this.p = new Uint8Array(256);
    this.perm = new Uint8Array(512);
    for (let i = 0; i < 256; i++) this.p[i] = Math.floor(Math.random() * 256);
    for (let i = 0; i < 512; i++) this.perm[i] = this.p[i & 255];
  }
  dot(g: Float32Array, x: number, y: number, z: number) {
    return g[0] * x + g[1] * y + g[2] * z;
  }
  mix(a: number, b: number, t: number) {
    return (1 - t) * a + t * b;
  }
  fade(t: number) {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }
  noise3D(x: number, y: number, z: number) {
    let X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    let u = this.fade(x),
      v = this.fade(y),
      w = this.fade(z);
    let A = this.perm[X] + Y,
      AA = this.perm[A] + Z,
      AB = this.perm[A + 1] + Z,
      B = this.perm[X + 1] + Y,
      BA = this.perm[B] + Z,
      BB = this.perm[B + 1] + Z;
    return this.mix(
      this.mix(
        this.mix(
          this.dot(
            this.grad3.subarray(
              (this.perm[AA] & 15) * 3,
              (this.perm[AA] & 15) * 3 + 3
            ),
            x,
            y,
            z
          ),
          this.dot(
            this.grad3.subarray(
              (this.perm[BA] & 15) * 3,
              (this.perm[BA] & 15) * 3 + 3
            ),
            x - 1,
            y,
            z
          ),
          u
        ),
        this.mix(
          this.dot(
            this.grad3.subarray(
              (this.perm[AB] & 15) * 3,
              (this.perm[AB] & 15) * 3 + 3
            ),
            x,
            y - 1,
            z
          ),
          this.dot(
            this.grad3.subarray(
              (this.perm[BB] & 15) * 3,
              (this.perm[BB] & 15) * 3 + 3
            ),
            x - 1,
            y - 1,
            z
          ),
          u
        ),
        v
      ),
      this.mix(
        this.mix(
          this.dot(
            this.grad3.subarray(
              (this.perm[AA + 1] & 15) * 3,
              (this.perm[AA + 1] & 15) * 3 + 3
            ),
            x,
            y,
            z - 1
          ),
          this.dot(
            this.grad3.subarray(
              (this.perm[BA + 1] & 15) * 3,
              (this.perm[BA + 1] & 15) * 3 + 3
            ),
            x - 1,
            y,
            z - 1
          ),
          u
        ),
        this.mix(
          this.dot(
            this.grad3.subarray(
              (this.perm[AB + 1] & 15) * 3,
              (this.perm[AB + 1] & 15) * 3 + 3
            ),
            x,
            y - 1,
            z - 1
          ),
          this.dot(
            this.grad3.subarray(
              (this.perm[BB + 1] & 15) * 3,
              (this.perm[BB + 1] & 15) * 3 + 3
            ),
            x - 1,
            y - 1,
            z - 1
          ),
          u
        ),
        v
      ),
      w
    );
  }
}
