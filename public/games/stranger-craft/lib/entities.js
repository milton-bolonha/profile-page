// entities.js - Classes de entidades (NPCs e inimigos)
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export class Entity {
    constructor(x, y, z, color, scale, scene, physicsWorld) {
        this.mesh = new THREE.Group();
        const bodyGeo = new THREE.BoxGeometry(0.6 * scale, 1.8 * scale, 0.6 * scale);
        const bodyMat = new THREE.MeshLambertMaterial({ color: color });
        this.body = new THREE.Mesh(bodyGeo, bodyMat);
        this.body.position.y = (1.8 * scale) / 2;
        this.mesh.add(this.body);
        const headGeo = new THREE.BoxGeometry(0.5 * scale, 0.5 * scale, 0.5 * scale);
        const headMat = new THREE.MeshLambertMaterial({ color: 0xffccaa });
        this.head = new THREE.Mesh(headGeo, headMat);
        this.head.position.y = (1.8 * scale) + (0.25 * scale);
        this.mesh.add(this.head);
        scene.add(this.mesh);
        const rbDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(x, y, z).lockRotations().setLinearDamping(5.0).setAngularDamping(1.0);
        this.rigidBody = physicsWorld.createRigidBody(rbDesc);
        const colDesc = RAPIER.ColliderDesc.capsule(0.5 * scale, 0.3 * scale).setFriction(2.0).setRestitution(0.0);
        this.collider = physicsWorld.createCollider(colDesc, this.rigidBody);
        this.yOffset = (0.5 * scale) + (0.3 * scale);
        this.stuckTimer = 0;
        this.scene = scene;
        this.physicsWorld = physicsWorld;
    }
    
    update(dt, playerPos) {
        if(!this.rigidBody) return;
        const pos = this.rigidBody.translation();
        this.mesh.position.set(pos.x, pos.y - this.yOffset, pos.z);
        this.mesh.lookAt(playerPos.x, pos.y - this.yOffset, playerPos.z);
        
        const linvel = this.rigidBody.linvel();
        if(linvel.y > 10) this.rigidBody.setLinvel({x:linvel.x, y:10, z:linvel.z}, true);

        if(linvel.y > 0.1) this.stuckTimer = 0;
        else if(Math.abs(linvel.x) < 0.1 && Math.abs(linvel.z) < 0.1) {
            this.stuckTimer += dt;
            if(this.stuckTimer > 4.0) {
                this.rigidBody.applyImpulse({x:0, y:5.0, z:0}, true);
                this.stuckTimer = 0;
            }
        }
    }
    
    remove() {
        this.scene.remove(this.mesh);
        if(this.collider) this.physicsWorld.removeCollider(this.collider, false);
        if(this.rigidBody) this.physicsWorld.removeRigidBody(this.rigidBody);
        this.rigidBody = null;
        this.collider = null;
    }
}

export class Zombie extends Entity {
    constructor(x, y, z, scene, physicsWorld) {
        super(x, y, z, 0x228b22, 1, scene, physicsWorld);
        this.head.material.color.setHex(0x1a441a);
        this.speed = 6.0;
        this.health = 100;
        this.maxHealth = 100;
    }
    
    onDeath(entities, Loot) {
        const pos = this.rigidBody.translation();
        entities.push(new Loot(pos.x, pos.y, pos.z, this.scene));
    }
    
    update(dt, playerPos, gameState, physicsWorld, takeDamage) {
        super.update(dt, playerPos);
        if(gameState.dimension !== 'UPSIDE_DOWN') return;
        const pos = this.rigidBody.translation();
        const dx = playerPos.x - pos.x, dz = playerPos.z - pos.z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        
        if(dist < 60 && dist > 0.8) {
            const vx = (dx/dist)*this.speed;
            const vz = (dz/dist)*this.speed;
            this.rigidBody.setLinvel({ x: vx, y: this.rigidBody.linvel().y, z: vz }, true);
        }
        const rayPos = { x: pos.x, y: pos.y - 1.0, z: pos.z };
        const groundHit = physicsWorld.castRay(new RAPIER.Ray(rayPos, {x:0, y:-1, z:0}), 0.5, true);
        if(dist < 60 && groundHit && groundHit.toi < 0.2) {
            const wallHit = physicsWorld.castRay(new RAPIER.Ray({x:pos.x, y:pos.y-0.5, z:pos.z}, {x:dx/dist, y:0, z:dz/dist}), 1.2, true);
            if(wallHit && wallHit.toi < 1.0) this.rigidBody.applyImpulse({x:0, y:12.0, z:0}, true);
        }
        const dy = playerPos.y - pos.y;
        if (dist < 1.5 && Math.abs(dy) < 2.0) {
            takeDamage(10 * dt);
        }
    }
}

export class MutantZombie extends Entity {
    constructor(x, y, z, scene, physicsWorld) {
        super(x, y, z, 0xDAA520, 1.5, scene, physicsWorld);
        this.head.material.color.setHex(0x8B8000);
        this.speed = 9.0;
        this.health = 150;
        this.maxHealth = 150;
    }
    
    onDeath(entities, Loot) {
        const pos = this.rigidBody.translation();
        // Mutante dropa 2 loots
        entities.push(new Loot(pos.x, pos.y, pos.z, this.scene));
        entities.push(new Loot(pos.x + 0.5, pos.y, pos.z + 0.5, this.scene));
    }
    
    update(dt, playerPos, gameState, physicsWorld, takeDamage) {
        super.update(dt, playerPos);
        if(gameState.dimension !== 'UPSIDE_DOWN') return;
        const pos = this.rigidBody.translation();
        const dx = playerPos.x - pos.x, dz = playerPos.z - pos.z;
        const dist = Math.sqrt(dx*dx + dz*dz);
        
        if(dist < 80 && dist > 1.0) {
            const vx = (dx/dist)*this.speed;
            const vz = (dz/dist)*this.speed;
            this.rigidBody.setLinvel({ x: vx, y: this.rigidBody.linvel().y, z: vz }, true);
        }
        const groundHit = physicsWorld.castRay(new RAPIER.Ray({x:pos.x, y:pos.y-1, z:pos.z}, {x:0, y:-1, z:0}), 0.6, true);
        if(dist < 80 && groundHit && groundHit.toi < 0.2) {
            const wallHit = physicsWorld.castRay(new RAPIER.Ray({x:pos.x, y:pos.y-0.5, z:pos.z}, {x:dx/dist, y:0, z:dz/dist}), 1.5, true);
            if(wallHit && wallHit.toi < 1.3) this.rigidBody.applyImpulse({x:0, y:20.0, z:0}, true);
        }
        const dy = playerPos.y - pos.y;
        if (dist < 2.0 && Math.abs(dy) < 3.0) {
            takeDamage(20 * dt);
        }
    }
}

export class Builder extends Entity {
    constructor(x, y, z, scene, physicsWorld, BLOCKS, getTerrainHeight, setBlock, getCityInfo, CHUNK_SIZE, DESPAWN_DISTANCE) {
        super(x, y, z, 0x0000ff, 1, scene, physicsWorld);
        this.body.material.color.setHex(0xffff00);
        this.head.material.color.setHex(0xffaa00);
        this.state = 'IDLE';
        this.targetPos = null;
        this.buildTimer = 0;
        this.buildQueue = [];
        this.homePos = { x: Math.floor(x), y: Math.floor(y), z: Math.floor(z) };
        this.lastBuildPos = { ...this.homePos };
        this.waitTimer = 2.0;
        this.lastPos = new THREE.Vector3();
        this.BLOCKS = BLOCKS;
        this.getTerrainHeight = getTerrainHeight;
        this.setBlock = setBlock;
        this.getCityInfo = getCityInfo;
        this.CHUNK_SIZE = CHUNK_SIZE;
        this.DESPAWN_DISTANCE = DESPAWN_DISTANCE;
        this.WATER_LEVEL = 7;
    }
    
    update(dt, playerPos, gameState, physicsWorld) {
        super.update(dt, playerPos);
        const pos = this.rigidBody.translation();
        if (pos.y < -10 || Math.abs(pos.x - playerPos.x) > this.DESPAWN_DISTANCE) {
            const h = this.getTerrainHeight(Math.floor(playerPos.x), Math.floor(playerPos.z)).height;
            this.rigidBody.setTranslation({x: playerPos.x + 2, y: h + 10, z: playerPos.z + 2}, true);
            this.state = 'IDLE';
            return;
        }
        const city = this.getCityInfo(Math.floor(pos.x/this.CHUNK_SIZE), Math.floor(pos.z/this.CHUNK_SIZE), this.CHUNK_SIZE);
        if(city.exists) {
            const distToCity = Math.sqrt(Math.pow(pos.x - city.worldX, 2) + Math.pow(pos.z - city.worldZ, 2));
            if(distToCity < 50 && this.state !== 'FLEEING') {
                this.state = 'FLEEING';
                this.targetPos = new THREE.Vector3(pos.x + (pos.x - city.worldX), pos.y, pos.z + (pos.z - city.worldZ));
            }
        }
        if(this.state === 'IDLE') {
            this.waitTimer -= dt;
            if(this.waitTimer <= 0) {
                const rx = this.lastBuildPos.x + (Math.random()<0.5?15:-15), rz = this.lastBuildPos.z + (Math.random()<0.5?15:-15);
                const h = this.getTerrainHeight(rx, rz).height;
                if(h > this.WATER_LEVEL) {
                    this.targetPos = new THREE.Vector3(Math.floor(rx), h+1, Math.floor(rz));
                    this.state = 'MOVING';
                } else this.waitTimer = 0.5;
            }
        } else if(this.state === 'MOVING' || this.state === 'FLEEING') {
            const dx = this.targetPos.x - pos.x, dz = this.targetPos.z - pos.z, dist = Math.sqrt(dx*dx+dz*dz);
            if(dist > 3.0) {
                this.rigidBody.setLinvel({x:(dx/dist)*4, y:this.rigidBody.linvel().y, z:(dz/dist)*4}, true);
                const wallHit = physicsWorld.castRay(new RAPIER.Ray({x:pos.x, y:pos.y-0.5, z:pos.z}, {x:dx/dist, y:0, z:dz/dist}), 1.5, true);
                if(wallHit && wallHit.toi < 1.2) this.rigidBody.applyImpulse({x:0, y:8.0, z:0}, true);
            }
            else {
                if(this.state === 'FLEEING') this.state = 'IDLE';
                else {
                    this.state = 'BUILDING';
                    this.rigidBody.setLinvel({x:0,y:0,z:0}, true);
                    this.prepareBuild(this.targetPos);
                }
            }
        } else if(this.state === 'BUILDING') {
            this.buildTimer += dt;
            if(this.buildTimer > 0.05) {
                this.buildTimer = 0;
                if(this.buildQueue.length > 0) {
                    const b = this.buildQueue.shift();
                    this.setBlock(b.x, b.y, b.z, b.t);
                    if(Math.floor(pos.x)===b.x && Math.floor(pos.z)===b.z && Math.abs(pos.y-b.y)<2) {
                        this.rigidBody.setLinvel({x:0, y:6.0, z:0}, true);
                    }
                } else {
                    this.state = 'IDLE';
                    this.waitTimer = 5.0;
                    this.lastBuildPos = {x:this.targetPos.x, y:this.targetPos.y, z:this.targetPos.z};
                }
            }
        }
    }
    
    prepareBuild(origin) {
        const ox=Math.floor(origin.x), oy=Math.floor(origin.y), oz=Math.floor(origin.z);
        this.buildQueue = [];
        const rand = Math.random();
        if(rand < 0.33) this.buildSimpleHouse(ox, oy, oz);
        else if(rand < 0.66) this.buildTallHouse(ox, oy, oz);
        else this.buildBigHouse(ox, oy, oz);
    }
    
    buildSimpleHouse(ox, oy, oz) {
        const size = 3;
        for(let x=-size; x<=size; x++) for(let z=-size; z<=size; z++) {
            this.buildQueue.push({x:ox+x, y:oy-1, z:oz+z, t:this.BLOCKS.STONE});
            for(let y=0; y<5; y++) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.AIR});
        }
        for(let y=0; y<5; y++) for(let x=-size; x<=size; x++) for(let z=-size; z<=size; z++) {
            if(y===0) this.buildQueue.push({x:ox+x, y:oy, z:oz+z, t:this.BLOCKS.PLANKS});
            else if(y===4) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.LOG});
            else if(x===-size || x===size || z===-size || z===size) {
                if (z===size && x===0 && y<3) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.AIR});
                else this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.LOG});
            }
        }
    }
    
    buildTallHouse(ox, oy, oz) {
        const size = 3;
        for(let x=-size; x<=size; x++) for(let z=-size; z<=size; z++) {
            this.buildQueue.push({x:ox+x, y:oy-1, z:oz+z, t:this.BLOCKS.STONE});
            for(let y=0; y<9; y++) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.AIR});
        }
        for(let y=0; y<9; y++) for(let x=-size; x<=size; x++) for(let z=-size; z<=size; z++) {
            if(y===0 || y===4 || y===8) {
                if (!(y===4 && x===1 && z===1)) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.PLANKS});
            }
            if(x===-size || x===size || z===-size || z===size) {
                if (z===size && x===0 && y<3) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.AIR});
                else {
                    if(!(y>4 && y<7 && x===0 && z===size)) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.BRICKS});
                    else this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.OFFICE});
                }
            }
            if (y>=1 && y<=3 && x===1 && z===1) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.PLANKS});
        }
    }
    
    buildBigHouse(ox, oy, oz) {
        const size = 4;
        for(let x=-size; x<=size; x++) for(let z=-size; z<=size; z++) {
            this.buildQueue.push({x:ox+x, y:oy-1, z:oz+z, t:this.BLOCKS.STONE});
            for(let y=0; y<6; y++) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.AIR});
        }
        for(let y=0; y<6; y++) for(let x=-size; x<=size; x++) for(let z=-size; z<=size; z++) {
            if(y===0) this.buildQueue.push({x:ox+x, y:oy, z:oz+z, t:this.BLOCKS.PLANKS});
            else if(y===5) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.LOG});
            else if(x===-size || x===size || z===-size || z===size) {
                if (z===size && x===0 && y<3) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.AIR});
                else this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.BRICKS});
            }
            if ((x===-2 || x===2) && (z===-2 || z===2) && y>0 && y<5) this.buildQueue.push({x:ox+x, y:oy+y, z:oz+z, t:this.BLOCKS.LOG});
        }
    }
    
    interact() {
        const b = document.getElementById('dialog-box');
        b.innerText = "Estou construindo uma vila para você!";
        b.style.display = 'block';
        setTimeout(() => b.style.display = 'none', 3000);
    }
}
