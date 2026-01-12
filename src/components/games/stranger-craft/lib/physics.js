// physics.js - Sistema de física com Rapier
import RAPIER from '@dimforge/rapier3d-compat';

export async function initPhysics(PLAYER_HALF_HEIGHT, PLAYER_RADIUS, getTerrainHeight) {
    await RAPIER.init();
    const gravity = { x: 0.0, y: -80.0, z: 0.0 }; // Heavy gravity for arcade feel
    const physicsWorld = new RAPIER.World(gravity);
    const bodyDesc = RAPIER.RigidBodyDesc.dynamic().setTranslation(0.0, 30.0, 0.0).lockRotations().setCcdEnabled(true);
    const playerBody = physicsWorld.createRigidBody(bodyDesc);
    // Reverted to Capsule: Cylinder edges catch on chunk seams.
    // Winding Order fix in rendering.js should prevent the original "Jumping/Pop" issues.
    const colliderDesc = RAPIER.ColliderDesc.capsule(PLAYER_HALF_HEIGHT, PLAYER_RADIUS)
        .setTranslation(0.0, 0.0, 0.0)
        .setFriction(0.0)
        .setRestitution(0.0)
        .setCollisionGroups(0x0002FFFF);
    const playerCollider = physicsWorld.createCollider(colliderDesc, playerBody);
    
    // Check if getTerrainHeight returns a valid object or handle potential errors
    // Assuming getTerrainHeight is available and works as expected
    try {
        const h = getTerrainHeight(5, 5).height;
        playerBody.setTranslation({x: 5, y: h + 5, z: 5}, true);
    } catch (e) {
        console.warn("Could not set initial player height from terrain:", e);
        playerBody.setTranslation({x: 5, y: 50, z: 5}, true);
    }
    
    return { physicsWorld, playerBody, playerCollider };
}
