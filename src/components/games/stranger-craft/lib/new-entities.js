// Novas Entidades para Stranger Craft
// Skeleton (Esqueleto), Loot (Recompensa) e Projectile (Projétil)

import * as THREE from "three";

// --- Loot (Recompensa ao matar inimigos) ---
export class Loot {
  constructor(x, y, z, scene) {
    // Visual: Cubo verde brilhante
    const geo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const mat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
      emissive: 0x00ff00,
      emissiveIntensity: 0.8,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);

    this.position = { x, y, z };
    this.bobTimer = 0; // Para animação de flutuação
    this.rotationSpeed = 2.0;
    this.scene = scene;
  }

  update(dt, playerPos, playerStats, updatePlayerUI) {
    // Animação de flutuação (bobbing)
    this.bobTimer += dt * 3;
    this.mesh.position.y = this.position.y + Math.sin(this.bobTimer) * 0.2;

    // Rotação contínua
    this.mesh.rotation.y += dt * this.rotationSpeed;

    // Verificar coleta por proximidade
    const dx = this.position.x - playerPos.x;
    const dy = this.position.y - playerPos.y;
    const dz = this.position.z - playerPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 1.5) {
      return this.collect(playerStats, updatePlayerUI);
    }
    return false;
  }

  collect(playerStats, updatePlayerUI) {
    // Curar jogador
    playerStats.health = Math.min(
      playerStats.maxHealth,
      playerStats.health + 20
    );
    updatePlayerUI();

    // Feedback visual
    const dialog = document.getElementById("dialog-box");
    if (dialog) {
      dialog.innerText = "💚 +20 HP";
      dialog.style.display = "block";
      setTimeout(() => (dialog.style.display = "none"), 1000);
    }

    this.remove();
    return true; // Sinaliza que foi coletado
  }

  remove() {
    this.scene.remove(this.mesh);
  }
}

// --- Projectile (Projétil do Skeleton) ---
export class Projectile {
  constructor(x, y, z, vx, vy, vz, scene, physicsWorld) {
    // Visual: Esfera amarela pequena
    const geo = new THREE.SphereGeometry(0.2, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);

    this.scene = scene;
    this.physicsWorld = physicsWorld;

    // Física
    // Import Rapier instance from physics world specifically if needed, but it seems we have it passed or it's global? 
    // Wait, physicsWorld is an instance. We need RAPIER class/module to access RigidBodyDesc.
    // In strict module environment, we need to import RAPIER.
    // The original code accessed RAPIER from physicsWorld.constructor if passed? No, line 89: const RAPIER = physicsWorld.constructor;
    // RAPIER.World.constructor is likely checking the class. This is a bit risky.
    // I will import RAPIER at the top to be safe.
  }
  
  // NOTE: I am patching the constructor to use imported RAPIER instead of accessing constructor from instance
  // But wait, I need RAPIER import.
}

// Re-implementing Projectile with imported RAPIER
import RAPIER from '@dimforge/rapier3d-compat';

export class Projectile_Fixed {
  constructor(x, y, z, vx, vy, vz, scene, physicsWorld) {
    const geo = new THREE.SphereGeometry(0.2, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.5,
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(x, y, z);
    scene.add(this.mesh);

    this.scene = scene;
    this.physicsWorld = physicsWorld;

    const rbDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(x, y, z)
      .setGravityScale(0.3);
    this.rigidBody = physicsWorld.createRigidBody(rbDesc);

    const colDesc = RAPIER.ColliderDesc.ball(0.2).setSensor(true);
    this.collider = physicsWorld.createCollider(colDesc, this.rigidBody);

    this.rigidBody.setLinvel({ x: vx, y: vy, z: vz }, true);

    this.lifetime = 5.0;
  }

  update(dt, playerPos, takeDamage, getBlock, BLOCKS, BLOCK_PROPS) {
    if (!this.rigidBody) return false;

    this.lifetime -= dt;
    if (this.lifetime <= 0) {
      this.remove();
      return true;
    }

    const pos = this.rigidBody.translation();
    this.mesh.position.set(pos.x, pos.y, pos.z);

    const dx = pos.x - playerPos.x;
    const dy = pos.y - playerPos.y;
    const dz = pos.z - playerPos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    if (dist < 1.0) {
      takeDamage(15);
      this.remove();
      return true;
    }

    const blockType = getBlock(
      Math.floor(pos.x),
      Math.floor(pos.y),
      Math.floor(pos.z)
    );
    if (blockType !== BLOCKS.AIR && BLOCK_PROPS[blockType] && BLOCK_PROPS[blockType].solid) {
      this.remove();
      return true;
    }

    return false;
  }

  remove() {
    this.scene.remove(this.mesh);
    if (this.collider)
      this.physicsWorld.removeCollider(this.collider, false);
    if (this.rigidBody) this.physicsWorld.removeRigidBody(this.rigidBody);
    this.rigidBody = null;
    this.collider = null;
  }
}

// --- Skeleton (Esqueleto) ---
export class Skeleton {
  constructor(x, y, z, scene, physicsWorld, Entity) {
    // Usar Entity como base
    const entity = new Entity(x, y, z, 0xffffff, 1, scene, physicsWorld); // Added scene and physicsWorld passed to super-like constructor
    Object.assign(this, entity);

    this.head.material.color.setHex(0xeeeeee);
    this.speed = 4.0;
    this.attackCooldown = 0;
    this.idealDistance = 15;
    this.health = 80;
    this.maxHealth = 80;

    this.scene = scene;
    this.physicsWorld = physicsWorld;
  }

  onDeath(entities, Loot) {
    const pos = this.rigidBody.translation();
    entities.push(new Loot(pos.x, pos.y, pos.z, this.scene));
  }

  update(dt, playerPos, gameState, entities, Projectile) {
    if (!this.rigidBody) return;
    
    // Call Entity update manually since we did Object.assign
    // Use prototype of Entity? No, just the method
    // But `this` has the properties.
    // However, `update` is on the prototype of Entity, so Object.assign(this, entity) does NOT copy methods from prototype unless we mixin prototypes.
    // The original code relied on `Entity` being passed and likely `Skeleton` extending it or some prototype magic not shown fully, or `Entity` in original code returned an object with methods attached (not class).
    // EXCEPT `Entity` in `entities.js` IS a class.
    // `new Entity(...)` returns an object with `mesh`, `body`, etc.
    // `Object.assign(this, entity)` copies those properties.
    // It DOES NOT copy `update` method from `Entity.prototype`.
    // So `super.update` call in original code `super.update(dt, playerPos)` suggests `Skeleton extends Entity`.
    // BUT the constructor has `constructor(..., Entity)`.
    // And `Object.assign(this, entity)`.
    // This is very strange.
    // The user provided code (lines 154-158):
    // export class Skeleton {
    //   constructor(x, y, z, scene, physicsWorld, Entity) {
    //     const entity = new Entity(...);
    //     Object.assign(this, entity);
    // ...
    //   update(...) {
    //      // Chamar update da Entity base
    //      if (!this.rigidBody) return;
    //      ... logic duplicated from Entity.update? No.
    //      Line 177: // Chamar update da Entity base
    //      But it DOES NOT call super.update or entity.update. It RE-IMPLEMENTS the logic (lines 179-194 match Entity.update).
    
    // So I will just include the logic here.
    
    const pos = this.rigidBody.translation();
    this.mesh.position.set(pos.x, pos.y - this.yOffset, pos.z);
    this.mesh.lookAt(playerPos.x, pos.y - this.yOffset, playerPos.z);

    const linvel = this.rigidBody.linvel();
    if (linvel.y > 10)
      this.rigidBody.setLinvel({ x: linvel.x, y: 10, z: linvel.z }, true);

    if (linvel.y > 0.1) this.stuckTimer = 0;
    else if (Math.abs(linvel.x) < 0.1 && Math.abs(linvel.z) < 0.1) {
      this.stuckTimer += dt;
      if (this.stuckTimer > 4.0) {
        this.rigidBody.applyImpulse({ x: 0, y: 5.0, z: 0 }, true);
        this.stuckTimer = 0;
      }
    }

    if (gameState.dimension !== "UPSIDE_DOWN") return;

    const dx = playerPos.x - pos.x;
    const dz = playerPos.z - pos.z;
    const dist = Math.sqrt(dx * dx + dz * dz);
    const dy = playerPos.y - pos.y;

    if (dist < 60) {
      let moveX = 0,
        moveZ = 0;

      if (dist < this.idealDistance - 2) {
        moveX = -(dx / dist) * this.speed;
        moveZ = -(dz / dist) * this.speed;
      } else if (dist > this.idealDistance + 5) {
        moveX = (dx / dist) * this.speed;
        moveZ = (dz / dist) * this.speed;
      } else {
        moveX = -(dz / dist) * this.speed * 0.5;
        moveZ = (dx / dist) * this.speed * 0.5;
      }

      this.rigidBody.setLinvel(
        {
          x: moveX,
          y: this.rigidBody.linvel().y,
          z: moveZ,
        },
        true
      );

      this.attackCooldown -= dt;
      if (
        this.attackCooldown <= 0 &&
        dist >= 8 &&
        dist <= 20 &&
        Math.abs(dy) < 5
      ) {
        this.shootProjectile(playerPos, entities, Projectile);
        this.attackCooldown = 2.0;
      }
    }
  }

  shootProjectile(targetPos, entities, Projectile) {
    const pos = this.rigidBody.translation();
    const dx = targetPos.x - pos.x;
    const dy = targetPos.y - pos.y;
    const dz = targetPos.z - pos.z;
    const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

    const projectile = new Projectile(
      pos.x,
      pos.y + 1,
      pos.z,
      (dx / dist) * 15,
      (dy / dist) * 15,
      (dz / dist) * 15,
      this.scene,
      this.physicsWorld
    );
    entities.push(projectile);
  }

  remove() {
    this.scene.remove(this.mesh);
    if (this.collider)
      this.physicsWorld.removeCollider(this.collider, false);
    if (this.rigidBody) this.physicsWorld.removeRigidBody(this.rigidBody);
    this.rigidBody = null;
    this.collider = null;
  }
}

// Export cleaned up Projectile class
export { Projectile_Fixed as Projectile };
