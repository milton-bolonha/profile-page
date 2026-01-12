// blueprints.js - Sistema de construção com blueprints
export function createBlueprints(BLOCKS) {
    return [
        {
            name: "Casa Simples",
            icon: "🏠",
            width: 5,
            height: 5,
            depth: 5,
            build: (x, y, z) => {
                const changes = [];
                for(let i=0; i<5; i++) for(let j=0; j<5; j++) for(let k=0; k<5; k++) {
                    let b = BLOCKS.AIR;
                    if(j===0) b = BLOCKS.PLANKS;
                    else if(j===4) b = BLOCKS.LOG;
                    else if(i===0 || i===4 || k===0 || k===4) {
                        if(j===1 && i===2 && k===0) b = BLOCKS.AIR;
                        else if(j===2 && (i===2 || k===2)) b = BLOCKS.AIR;
                        else b = BLOCKS.PLANKS;
                    }
                    if((i===0||i===4) && (k===0||k===4)) b = BLOCKS.LOG;
                    changes.push({x:x+i, y:y+j, z:z+k, type:b});
                }
                return changes;
            }
        },
        {
            name: "Torre de Vigia",
            icon: "🏰",
            width: 3,
            height: 12,
            depth: 3,
            build: (x, y, z) => {
                const changes = [];
                for(let j=0; j<12; j++) {
                    for(let i=0; i<3; i++) for(let k=0; k<3; k++) {
                        let b = BLOCKS.AIR;
                        if (j < 10) {
                            if (i===0 || i===2 || k===0 || k===2) b = BLOCKS.STONE;
                            else b = BLOCKS.AIR;
                        } else {
                            b = BLOCKS.PLANKS;
                            if (j===11 && (i===1 && k===1)) b = BLOCKS.AIR;
                            else if (j===11) b = BLOCKS.STONE;
                        }
                        if(b !== BLOCKS.AIR) changes.push({x:x+i, y:y+j, z:z+k, type:b});
                    }
                }
                return changes;
            }
        },
        {
            name: "Muralha",
            icon: "🧱",
            width: 5,
            height: 4,
            depth: 1,
            build: (x, y, z) => {
                const changes = [];
                for(let i=0; i<5; i++) for(let j=0; j<4; j++) {
                    let b = BLOCKS.BRICKS;
                    if(j===3 && i%2!==0) b = BLOCKS.AIR;
                    changes.push({x:x+i, y:y+j, z:z, type:b});
                }
                return changes;
            }
        },
        {
            name: "Fonte",
            icon: "⛲",
            width: 5,
            height: 3,
            depth: 5,
            build: (x, y, z) => {
                const changes = [];
                for(let i=0; i<5; i++) for(let k=0; k<5; k++) {
                    changes.push({x:x+i, y:y, z:z+k, type:BLOCKS.STONE});
                    if(i===0 || i===4 || k===0 || k===4) changes.push({x:x+i, y:y+1, z:z+k, type:BLOCKS.STONE});
                    else changes.push({x:x+i, y:y+1, z:z+k, type:BLOCKS.WATER});
                }
                changes.push({x:x+2, y:y+1, z:z+2, type:BLOCKS.STONE});
                changes.push({x:x+2, y:y+2, z:z+2, type:BLOCKS.STONE});
                changes.push({x:x+2, y:y+3, z:z+2, type:BLOCKS.WATER});
                return changes;
            }
        },
        {
            name: "Ponte",
            icon: "🌉",
            width: 10,
            height: 2,
            depth: 3,
            build: (x, y, z) => {
                const changes = [];
                
                // Piso da ponte (madeira)
                for (let i = 0; i < 10; i++) {
                    for (let k = 0; k < 3; k++) {
                        changes.push({ x: x + i, y: y, z: z + k, type: BLOCKS.PLANKS });
                    }
                }
                
                // Corrimões laterais (troncos)
                for (let i = 0; i < 10; i++) {
                    changes.push({ x: x + i, y: y + 1, z: z, type: BLOCKS.LOG });
                    changes.push({ x: x + i, y: y + 1, z: z + 2, type: BLOCKS.LOG });
                }
                
                return changes;
            }
        },
        {
            name: "Piscina",
            icon: "🏊",
            width: 8,
            height: 4,
            depth: 8,
            build: (x, y, z) => {
                const changes = [];
                
                // Escavar buraco (ar)
                for (let i = 0; i < 8; i++) {
                    for (let k = 0; k < 8; k++) {
                        for (let j = 0; j < 3; j++) {
                            changes.push({ x: x + i, y: y - j, z: z + k, type: BLOCKS.AIR });
                        }
                    }
                }
                
                // Piso de pedra
                for (let i = 0; i < 8; i++) {
                    for (let k = 0; k < 8; k++) {
                        changes.push({ x: x + i, y: y - 3, z: z + k, type: BLOCKS.STONE });
                    }
                }
                
                // Paredes de pedra
                for (let i = 0; i < 8; i++) {
                    for (let j = -2; j < 0; j++) {
                        changes.push({ x: x + i, y: y + j, z: z, type: BLOCKS.STONE });
                        changes.push({ x: x + i, y: y + j, z: z + 7, type: BLOCKS.STONE });
                    }
                }
                for (let k = 0; k < 8; k++) {
                    for (let j = -2; j < 0; j++) {
                        changes.push({ x: x, y: y + j, z: z + k, type: BLOCKS.STONE });
                        changes.push({ x: x + 7, y: y + j, z: z + k, type: BLOCKS.STONE });
                    }
                }
                
                // Preencher com água
                for (let i = 1; i < 7; i++) {
                    for (let k = 1; k < 7; k++) {
                        for (let j = -2; j < 0; j++) {
                            changes.push({ x: x + i, y: y + j, z: z + k, type: BLOCKS.WATER });
                        }
                    }
                }
                
                return changes;
            }
        },
        {
            name: "Bunker",
            icon: "🛡️",
            width: 7,
            height: 5,
            depth: 7,
            build: (x, y, z) => {
                const changes = [];
                
                // Estrutura externa de Bedrock (indestrutível)
                for (let i = 0; i < 7; i++) {
                    for (let k = 0; k < 7; k++) {
                        for (let j = 0; j < 5; j++) {
                            // Paredes externas
                            if (i === 0 || i === 6 || k === 0 || k === 6 || j === 0 || j === 4) {
                                changes.push({ x: x + i, y: y + j, z: z + k, type: BLOCKS.BEDROCK });
                            } else {
                                // Interior oco
                                changes.push({ x: x + i, y: y + j, z: z + k, type: BLOCKS.AIR });
                            }
                        }
                    }
                }
                
                // Porta (entrada)
                changes.push({ x: x + 3, y: y + 1, z: z, type: BLOCKS.AIR });
                changes.push({ x: x + 3, y: y + 2, z: z, type: BLOCKS.AIR });
                
                // Iluminação interna (lâmpadas nos cantos)
                changes.push({ x: x + 1, y: y + 3, z: z + 1, type: BLOCKS.LAMP });
                changes.push({ x: x + 5, y: y + 3, z: z + 1, type: BLOCKS.LAMP });
                changes.push({ x: x + 1, y: y + 3, z: z + 5, type: BLOCKS.LAMP });
                changes.push({ x: x + 5, y: y + 3, z: z + 5, type: BLOCKS.LAMP });
                
                return changes;
            }
        }
    ];
}
