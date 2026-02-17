export const TERRAINS = {
    grass:  { label: 'Grass',   color: '#4a7c3f', icon: '\u{1F33F}' },
    forest: { label: 'Forest',  color: '#2d5a1e', icon: '\u{1F332}' },
    water:  { label: 'Water',   color: '#2a6496', icon: '\u{1F30A}' },
    stone:  { label: 'Stone',   color: '#7a7a7a', icon: '\u{1FAA8}' },
    dirt:   { label: 'Dirt',    color: '#8b6914', icon: '\u{1F7E4}' },
    sand:   { label: 'Sand',    color: '#d4b957', icon: '\u{1F3DC}' },
    lava:   { label: 'Lava',    color: '#cc3300', icon: '\u{1F30B}' },
    ice:    { label: 'Ice',     color: '#a8d8ea', icon: '\u{1F9CA}' },
    wood:   { label: 'Wood',    color: '#8b5e3c', icon: '\u{1FAB5}' },
    void:   { label: 'Void',    color: '#1a1a2e', icon: '\u{2B1B}' },
};

export const DEFAULT_TERRAIN = 'grass';

export function drawTerrainPattern(ctx, x, y, size, key) {
    const terrain = TERRAINS[key];
    if (!terrain) return;

    ctx.fillStyle = terrain.color;
    ctx.fillRect(x, y, size, size);

    ctx.globalAlpha = 0.3;

    switch (key) {
        case 'water':
            ctx.strokeStyle = '#4a9fd4';
            ctx.lineWidth = 1;
            for (let i = 0; i < 3; i++) {
                const wy = y + size * 0.25 + i * (size * 0.25);
                ctx.beginPath();
                ctx.moveTo(x + 2, wy);
                ctx.quadraticCurveTo(x + size * 0.25, wy - 3, x + size * 0.5, wy);
                ctx.quadraticCurveTo(x + size * 0.75, wy + 3, x + size - 2, wy);
                ctx.stroke();
            }
            break;

        case 'forest':
            ctx.fillStyle = '#1a4010';
            for (let i = 0; i < 2; i++) {
                const tx = x + size * 0.25 + i * size * 0.35;
                const ty = y + size * 0.7;
                ctx.beginPath();
                ctx.moveTo(tx, ty - size * 0.4);
                ctx.lineTo(tx + size * 0.15, ty);
                ctx.lineTo(tx - size * 0.15, ty);
                ctx.closePath();
                ctx.fill();
            }
            break;

        case 'stone':
            ctx.fillStyle = '#999';
            for (let i = 0; i < 6; i++) {
                const sx = x + Math.random() * size;
                const sy = y + Math.random() * size;
                ctx.beginPath();
                ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'lava':
            ctx.fillStyle = '#ff6600';
            for (let i = 0; i < 3; i++) {
                const lx = x + Math.random() * size;
                const ly = y + Math.random() * size;
                ctx.beginPath();
                ctx.arc(lx, ly, 2 + Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'sand':
            ctx.fillStyle = '#c4a847';
            for (let i = 0; i < 8; i++) {
                const sx = x + Math.random() * size;
                const sy = y + Math.random() * size;
                ctx.beginPath();
                ctx.arc(sx, sy, 0.8, 0, Math.PI * 2);
                ctx.fill();
            }
            break;

        case 'ice':
            ctx.strokeStyle = '#d0f0ff';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(x + size * 0.2, y + size * 0.3);
            ctx.lineTo(x + size * 0.6, y + size * 0.7);
            ctx.moveTo(x + size * 0.5, y + size * 0.2);
            ctx.lineTo(x + size * 0.3, y + size * 0.8);
            ctx.stroke();
            break;

        case 'wood':
            ctx.strokeStyle = '#6b4226';
            ctx.lineWidth = 0.8;
            for (let i = 0; i < 3; i++) {
                const gy = y + size * 0.2 + i * (size * 0.25);
                ctx.beginPath();
                ctx.moveTo(x, gy);
                ctx.lineTo(x + size, gy + 2);
                ctx.stroke();
            }
            break;

        default:
            break;
    }

    ctx.globalAlpha = 1.0;
}
