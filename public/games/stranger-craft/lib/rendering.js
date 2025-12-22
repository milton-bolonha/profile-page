// rendering.js - Renderização de chunks
import * as THREE from 'three';
import RAPIER from '@dimforge/rapier3d-compat';

export function calculateAO(side1, side2, corner) {
    let occlusion = 0;
    if (side1) occlusion++;
    if (side2) occlusion++;
    if (corner) occlusion++;
    if (side1 && side2) occlusion = 3;
    return 1.0 - (occlusion * 0.2);
}

export function buildChunk(cx, cz, chunks, scene, physicsWorld, playerBody, CHUNK_SIZE, CHUNK_HEIGHT, PHYSICS_DISTANCE, BLOCKS, BLOCK_PROPS, materialOpaque, materialTrans, getFaceUVs, isSolid, getBlock) {
    const chunk = chunks[`${cx},${cz}`];
    if (!chunk || !chunk.data) return;

    // Dispose agressivo do chunk anterior
    disposeChunk(chunk, scene, physicsWorld);
    chunk.mesh = null;
    chunk.transMesh = null;
    chunk.collider = null;
    chunk.rigidBody = null;

    const opaque = { pos: [], norm: [], uv: [], idx: [], col: [] };
    const trans = { pos: [], norm: [], uv: [], idx: [], col: [] };
    let opIdx = 0, trIdx = 0;
    const dirs = [
        { dx:1, dy:0, dz:0, name:'side', light: 0.8 },
        { dx:-1, dy:0, dz:0, name:'side', light: 0.7 },
        { dx:0, dy:1, dz:0, name:'top', light: 1.0 },
        { dx:0, dy:-1, dz:0, name:'bottom', light: 0.5 },
        { dx:0, dy:0, dz:1, name:'side', light: 0.85 },
        { dx:0, dy:0, dz:-1, name:'side', light: 0.75 }
    ];

    for(let x=0; x<CHUNK_SIZE; x++) {
        for(let y=0; y<CHUNK_HEIGHT; y++) {
            for(let z=0; z<CHUNK_SIZE; z++) {
                const type = chunk.data[x][y][z];
                if(type === BLOCKS.AIR) continue;
                const props = BLOCK_PROPS[type];
                const gx = cx * CHUNK_SIZE + x, gz = cz * CHUNK_SIZE + z;

                for(const dir of dirs) {
                    const nx = x + dir.dx, ny = y + dir.dy, nz = z + dir.dz;
                    let nType = BLOCKS.AIR;
                    if(nx>=0 && nx<CHUNK_SIZE && ny>=0 && ny<CHUNK_HEIGHT && nz>=0 && nz<CHUNK_SIZE) nType = chunk.data[nx][ny][nz];
                    else nType = getBlock(gx + dir.dx, y + dir.dy, gz + dir.dz);
                    const nProps = BLOCK_PROPS[nType];
                    let visible = false;
                    if(nType === BLOCKS.AIR) visible = true;
                    else if(nProps.transparent) { if(type !== nType) visible = true; else if(!props.fluid) visible = true; }

                    if(visible) {
                        const target = props.transparent ? trans : opaque;
                        const idxOffset = props.transparent ? trIdx : opIdx;
                        const px = x + (dir.dx>0?1:0), py = y + (dir.dy>0?1:0), pz = z + (dir.dz>0?1:0);
                        let v = []; let aos = [];
                        let sx = gx + dir.dx, sy = y + dir.dy, sz = gz + dir.dz;
                        const sld = (dx, dy, dz) => isSolid(sx + dx, sy + dy, sz + dz);

                        if(dir.dx !== 0) {
                            v = [px,y,z, px,y,z+1, px,y+1,z, px,y+1,z+1];
                            aos.push(calculateAO(sld(0,-1,0), sld(0,0,-1), sld(0,-1,-1)));
                            aos.push(calculateAO(sld(0,-1,0), sld(0,0,1), sld(0,-1,1)));
                            aos.push(calculateAO(sld(0,1,0), sld(0,0,-1), sld(0,1,-1)));
                            aos.push(calculateAO(sld(0,1,0), sld(0,0,1), sld(0,1,1)));
                        } else if(dir.dy !== 0) {
                            v = [x,py,z, x+1,py,z, x,py,z+1, x+1,py,z+1];
                            aos.push(calculateAO(sld(-1,0,0), sld(0,0,-1), sld(-1,0,-1)));
                            aos.push(calculateAO(sld(1,0,0), sld(0,0,-1), sld(1,0,-1)));
                            aos.push(calculateAO(sld(-1,0,0), sld(0,0,1), sld(-1,0,1)));
                            aos.push(calculateAO(sld(1,0,0), sld(0,0,1), sld(1,0,1)));
                        } else {
                            v = [x,y,pz, x,y+1,pz, x+1,y,pz, x+1,y+1,pz];
                            aos.push(calculateAO(sld(-1,0,0), sld(0,-1,0), sld(-1,-1,0)));
                            aos.push(calculateAO(sld(-1,0,0), sld(0,1,0), sld(-1,1,0)));
                            aos.push(calculateAO(sld(1,0,0), sld(0,-1,0), sld(1,-1,0)));
                            aos.push(calculateAO(sld(1,0,0), sld(0,1,0), sld(1,1,0)));
                        }

                        for(let k=0; k<v.length; k+=3) {
                            target.pos.push(v[k], v[k+1], v[k+2]);
                            target.norm.push(dir.dx, dir.dy, dir.dz);
                            const lightFactor = dir.light * aos[Math.floor(k/3)];
                            target.col.push(lightFactor, lightFactor, lightFactor);
                        }
                        const uvs = getFaceUVs(type, dir.name);
                        let m = [0,1,2,3];
                        
                        // CORREÇÃO: Faces Z precisam de rotação UV para alinhar com a ordem dos vértices
                        // Vértices Z: [x,y,pz, x,y+1,pz, x+1,y,pz, x+1,y+1,pz]
                        // Ordem correta UV: [0,2,1,3] para rotacionar 90° no sentido horário
                        if(dir.dz !== 0) m = [0,2,1,3];
                        
                        for(let k=0; k<4; k++) target.uv.push(uvs[m[k]*2], uvs[m[k]*2+1]);
                        if(dir.dx===1 || dir.dy===1 || dir.dz===1) target.idx.push(idxOffset, idxOffset+2, idxOffset+1, idxOffset+2, idxOffset+3, idxOffset+1);
                        else target.idx.push(idxOffset, idxOffset+1, idxOffset+2, idxOffset+2, idxOffset+1, idxOffset+3);
                        if(props.transparent) trIdx += 4; else opIdx += 4;
                    }
                }
            }
        }
    }

    const createMesh = (d, mat) => {
        if(d.pos.length === 0) return null;
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(d.pos, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(d.norm, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(d.uv, 2));
        geo.setAttribute('color', new THREE.Float32BufferAttribute(d.col, 3));
        geo.setIndex(d.idx);
        const mesh = new THREE.Mesh(geo, mat);
        mesh.position.set(cx*CHUNK_SIZE, 0, cz*CHUNK_SIZE);
        mesh.castShadow = true; mesh.receiveShadow = true;
        scene.add(mesh);
        return mesh;
    };

    chunk.mesh = createMesh(opaque, materialOpaque);
    chunk.transMesh = createMesh(trans, materialTrans);

    const pPos = playerBody ? playerBody.translation() : {x:0,y:0,z:0};
    const pcx = Math.floor(pPos.x / CHUNK_SIZE);
    const pcz = Math.floor(pPos.z / CHUNK_SIZE);
    
    if (opaque.pos.length > 0 && Math.abs(cx - pcx) <= PHYSICS_DISTANCE && Math.abs(cz - pcz) <= PHYSICS_DISTANCE) {
        const rigidBodyDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(cx * CHUNK_SIZE, 0, cz * CHUNK_SIZE);
        chunk.rigidBody = physicsWorld.createRigidBody(rigidBodyDesc);
        const vertices = new Float32Array(opaque.pos);
        const indices = new Uint32Array(opaque.idx);
        const colliderDesc = RAPIER.ColliderDesc.trimesh(vertices, indices).setFriction(0.0).setRestitution(0.0);
        chunk.collider = physicsWorld.createCollider(colliderDesc, chunk.rigidBody);
    }
    chunk.dirty = false;
}

// Função para dispose agressivo de chunks
export function disposeChunk(chunk, scene, physicsWorld) {
    // Remover meshes da cena e fazer dispose completo
    if (chunk.mesh) {
        scene.remove(chunk.mesh);
        if (chunk.mesh.geometry) {
            chunk.mesh.geometry.dispose();
            // Dispose dos atributos do buffer
            if (chunk.mesh.geometry.attributes) {
                Object.values(chunk.mesh.geometry.attributes).forEach(attribute => {
                    if (attribute.buffer) attribute.buffer = null;
                });
                chunk.mesh.geometry.attributes = {};
            }
            // Dispose dos índices
            if (chunk.mesh.geometry.index) {
                chunk.mesh.geometry.index = null;
            }
        }
        chunk.mesh.material = null;
        chunk.mesh = null;
    }

    if (chunk.transMesh) {
        scene.remove(chunk.transMesh);
        if (chunk.transMesh.geometry) {
            chunk.transMesh.geometry.dispose();
            // Dispose dos atributos do buffer
            if (chunk.transMesh.geometry.attributes) {
                Object.values(chunk.transMesh.geometry.attributes).forEach(attribute => {
                    if (attribute.buffer) attribute.buffer = null;
                });
                chunk.transMesh.geometry.attributes = {};
            }
            // Dispose dos índices
            if (chunk.transMesh.geometry.index) {
                chunk.transMesh.geometry.index = null;
            }
        }
        chunk.transMesh.material = null;
        chunk.transMesh = null;
    }

    // Remover física
    if (chunk.collider) {
        physicsWorld.removeCollider(chunk.collider, false);
        chunk.collider = null;
    }
    if (chunk.rigidBody) {
        physicsWorld.removeRigidBody(chunk.rigidBody);
        chunk.rigidBody = null;
    }

    // Limpar referências de dados se necessário
    if (chunk.data && chunk.data.length > 0) {
        // Opcional: limpar array de dados para liberar memória
        // chunk.data = null;
    }
}
