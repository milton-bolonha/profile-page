// utils.js - Funções utilitárias
import * as THREE from 'three';

export function randomSeed(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    };
}

export function getFaceUVs(type, faceName, BLOCKS, UV_MAP) {
    const key = Object.keys(BLOCKS).find(k => BLOCKS[k] === type);
    let mapping = UV_MAP[key] || UV_MAP.STONE;
    let coords = mapping.all || (faceName === 'top' ? mapping.top : faceName === 'bottom' ? mapping.bottom : mapping.side);
    
    const EPS = 0.003;
    const u = coords[0] * 0.25 + EPS;
    const v = 1.0 - ((coords[1] + 1) * 0.20) + EPS;
    const su = 0.25 - (EPS * 2);
    const sv = 0.20 - (EPS * 2);
    
    return [u, v, u + su, v, u, v + sv, u + su, v + sv];
}

export async function createTextureAtlas() {
    // Carregar atlas pré-gerado (PNG) para melhor performance
    const textureLoader = new THREE.TextureLoader();

    return new Promise((resolve, reject) => {
        textureLoader.load(
            './lib/texture-atlas.png?t=' + Date.now(),
            (texture) => {
                texture.magFilter = THREE.NearestFilter;
                texture.minFilter = THREE.NearestFilter;
                texture.colorSpace = THREE.SRGBColorSpace;
                resolve(texture);
            },
            undefined,
            (error) => {
                console.warn('Atlas PNG não encontrado, gerando dinamicamente...', error);
                // Fallback: gerar dinamicamente se PNG não existir
                resolve(createTextureAtlasDynamic());
            }
        );
    });
}

// Função fallback para gerar atlas dinamicamente
function createTextureAtlasDynamic() {
    const canvas = document.createElement('canvas');
    const size = 64;
    const cols = 4;
    const rows = 5;
    canvas.width = size * cols;
    canvas.height = size * rows;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    function drawBlock(x, y, color, noiseAlpha = 0.1) {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, size, size);
        for(let i = 0; i < 300; i++) {
            ctx.fillStyle = `rgba(0,0,0,${Math.random() * noiseAlpha})`;
            ctx.fillRect(x + Math.random() * size, y + Math.random() * size, 2, 2);
        }
    }

    // Versão simplificada para fallback
    const colors = [
        ['#5DAF61', '#795548', '#795548', '#9E9E9E'], // Linha 0
        ['#F0E68C', '#5D4037', '#8D6E63', '#388E3C'], // Linha 1
        ['#A1887F', '#2196F3', '#212121', '#2c3e50'], // Linha 2
        ['#2D2D2D', '#3E2723', '#1B1B1B', '#4A0E2E'], // Linha 3
        ['#999999', '#222222', '#AA5544', '#FFFFCC']  // Linha 4
    ];

    for(let row = 0; row < rows; row++) {
        for(let col = 0; col < cols; col++) {
            const alpha = (row === 1 && col === 1) || (row === 2 && col === 0) ? 0.8 : 0.1;
            drawBlock(col * size, row * size, colors[row][col], alpha);
        }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
}
