// physics.js - Sistema de física com Rapier
import RAPIER from '@dimforge/rapier3d-compat';

export async function initPhysics(PLAYER_HALF_HEIGHT, PLAYER_RADIUS, getTerrainHeight) {
    await RAPIER.init();
    const gravity = { x: 0.0, y: -80.0, z: 0.0 };
    const physicsWorld = new RAPIER.World(gravity);
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 30.0, 0.0).lockRotations().setCcdEnabled(true);
    const playerBody = physicsWorld.createRigidBody(bodyDesc);
    const colliderDesc = RAPIER.ColliderDesc.capsule(PLAYER_HALF_HEIGHT, PLAYER_RADIUS).setTranslation(0.0, 0.0, 0.0).setFriction(0.0).setRestitution(0.0);
    const playerCollider = physicsWorld.createCollider(colliderDesc, playerBody);
    
    const h = getTerrainHeight(5, 5).height;
    playerBody.setTranslation({x: 5, y: h + 5, z: 5}, true);
    
    return { physicsWorld, playerBody, playerCollider };
}
