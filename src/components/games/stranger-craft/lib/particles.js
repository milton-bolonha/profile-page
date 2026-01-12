// particles.js - Sistema de partículas otimizado com InstancedMesh
import * as THREE from 'three';

export class InstancedParticleSystem {
    constructor(scene, count = 10000) {
        this.scene = scene;
        this.count = count;
        this.active = false;

        // Geometria base para uma partícula
        this.geometry = new THREE.PlaneGeometry(0.15, 0.15);

        // Material
        this.material = new THREE.MeshBasicMaterial({
            color: 0xaa8888,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        // InstancedMesh
        this.instancedMesh = new THREE.InstancedMesh(this.geometry, this.material, count);
        this.instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.scene.add(this.instancedMesh);

        // Dados das partículas
        this.positions = new Array(count * 3).fill(0);
        this.velocities = new Array(count * 3).fill(0);
        this.lifetimes = new Array(count).fill(0);
        this.maxLifetime = 300; // frames

        // Matriz temporária para transformações
        this.tempMatrix = new THREE.Matrix4();
        this.tempPosition = new THREE.Vector3();

        this.initializeParticles();
    }

    initializeParticles() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            this.positions[i3] = (Math.random() - 0.5) * 50;
            this.positions[i3 + 1] = Math.random() * 25;
            this.positions[i3 + 2] = (Math.random() - 0.5) * 50;
            this.velocities[i3] = (Math.random() - 0.5) * 0.1;
            this.velocities[i3 + 1] = Math.random() * 0.1;
            this.velocities[i3 + 2] = (Math.random() - 0.5) * 0.1;
            this.lifetimes[i] = Math.random() * this.maxLifetime;
        }
        this.updateInstances();
    }

    updateInstances() {
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;
            this.tempPosition.set(
                this.positions[i3],
                this.positions[i3 + 1],
                this.positions[i3 + 2]
            );
            this.tempMatrix.setPosition(this.tempPosition);
            this.instancedMesh.setMatrixAt(i, this.tempMatrix);
        }
        this.instancedMesh.instanceMatrix.needsUpdate = true;
    }

    update(dt, playerPosition, active = true) {
        if (active !== this.active) {
            this.active = active;
            this.material.opacity = active ? 0.6 : 0;
        }

        if (!active) return;

        // Atualizar posições das partículas
        for (let i = 0; i < this.count; i++) {
            const i3 = i * 3;

            // Movimento
            this.positions[i3] += this.velocities[i3];
            this.positions[i3 + 1] += this.velocities[i3 + 1];
            this.positions[i3 + 2] += this.velocities[i3 + 2];

            // Wrap around boundaries
            if (this.positions[i3] > 25) this.positions[i3] = -25;
            if (this.positions[i3] < -25) this.positions[i3] = 25;
            if (this.positions[i3 + 1] > 25) this.positions[i3 + 1] = -25;
            if (this.positions[i3 + 1] < -25) this.positions[i3 + 1] = 25;
            if (this.positions[i3 + 2] > 25) this.positions[i3 + 2] = -25;
            if (this.positions[i3 + 2] < -25) this.positions[i3 + 2] = 25;

            // Reset lifetime
            this.lifetimes[i]++;
            if (this.lifetimes[i] > this.maxLifetime) {
                this.lifetimes[i] = 0;
                // Respawn com nova posição
                this.positions[i3] = playerPosition.x + (Math.random() - 0.5) * 50;
                this.positions[i3 + 1] = playerPosition.y + Math.random() * 25;
                this.positions[i3 + 2] = playerPosition.z + (Math.random() - 0.5) * 50;
            }
        }

        // Atualizar instâncias
        this.updateInstances();

        // Posicionar o sistema de partículas no jogador
        this.instancedMesh.position.copy(playerPosition);
    }

    setColor(color) {
        this.material.color.setHex(color);
    }

    setOpacity(opacity) {
        this.material.opacity = opacity;
    }

    dispose() {
        this.scene.remove(this.instancedMesh);
        this.geometry.dispose();
        this.material.dispose();
        this.instancedMesh.dispose();
    }
}

// Sistema legado para compatibilidade (Points-based)
export function createLegacyParticles(scene) {
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 2000;
    const posArray = new Float32Array(particleCount * 3);
    for(let i=0; i<particleCount*3; i++) posArray[i] = (Math.random() - 0.5) * 50;
    particleGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMat = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xaa8888,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);
    return particles;
}

export function updateLegacyParticles(particles, dt, playerPosition, gameState) {
    if (gameState.dimension === 'UPSIDE_DOWN') {
        particles.material.opacity = 0.6;
        const positions = particles.geometry.attributes.position.array;
        for(let i=0; i<positions.length; i+=3) {
            if (positions[i] > 25) positions[i] = -25;
            if (positions[i+1] > 25) positions[i+1] = -25;
            if (positions[i+2] > 25) positions[i+2] = -25;
            positions[i] += (Math.random() - 0.5) * 0.1;
            positions[i+1] += Math.random() * 0.1;
            positions[i+2] += (Math.random() - 0.5) * 0.1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
    } else {
        particles.material.opacity = 0;
    }
    particles.position.copy(playerPosition);
}
