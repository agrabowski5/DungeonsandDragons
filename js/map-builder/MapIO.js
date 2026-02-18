import { Storage } from '../utils/storage.js';
import { MapGrid } from './MapGrid.js';
import { drawTerrainPattern } from '../data/terrains.js';

const STORAGE_PREFIX = 'dnd_map_';
const AUTOSAVE_KEY = 'dnd_map__autosave';

export const MapIO = {
    save(name, mapGrid) {
        return Storage.save(STORAGE_PREFIX + name, mapGrid.toJSON());
    },

    load(name) {
        const data = Storage.load(STORAGE_PREFIX + name);
        return data ? MapGrid.fromJSON(data) : null;
    },

    listSaved() {
        return Storage.listKeys(STORAGE_PREFIX)
            .filter(k => k !== AUTOSAVE_KEY)
            .map(k => k.replace(STORAGE_PREFIX, ''));
    },

    delete(name) {
        Storage.remove(STORAGE_PREFIX + name);
    },

    autosave(mapGrid) {
        Storage.save(AUTOSAVE_KEY, mapGrid.toJSON());
    },

    loadAutosave() {
        const data = Storage.load(AUTOSAVE_KEY);
        return data ? MapGrid.fromJSON(data) : null;
    },

    exportJSON(mapGrid) {
        const blob = new Blob([JSON.stringify(mapGrid.toJSON(), null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dnd-map.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(MapGrid.fromJSON(data));
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    exportPNG(mapGrid, renderer) {
        const cs = renderer.cellSize;
        const width = mapGrid.cols * cs;
        const height = mapGrid.rows * cs;

        const offscreen = document.createElement('canvas');
        offscreen.width = width;
        offscreen.height = height;
        const ctx = offscreen.getContext('2d');

        for (let r = 0; r < mapGrid.rows; r++) {
            for (let c = 0; c < mapGrid.cols; c++) {
                drawTerrainPattern(ctx, c * cs, r * cs, cs, mapGrid.cells[r][c].terrain);
            }
        }

        if (renderer.showGrid) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            for (let r = 0; r <= mapGrid.rows; r++) {
                ctx.moveTo(0, r * cs);
                ctx.lineTo(width, r * cs);
            }
            for (let c = 0; c <= mapGrid.cols; c++) {
                ctx.moveTo(c * cs, 0);
                ctx.lineTo(c * cs, height);
            }
            ctx.stroke();
        }

        for (let r = 0; r < mapGrid.rows; r++) {
            for (let c = 0; c < mapGrid.cols; c++) {
                if (mapGrid.cells[r][c].token) {
                    renderer._drawToken(ctx, r, c, mapGrid.cells[r][c].token);
                }
            }
        }

        if (renderer.showFog) {
            for (let r = 0; r < mapGrid.rows; r++) {
                for (let c = 0; c < mapGrid.cols; c++) {
                    if (mapGrid.cells[r][c].fog) {
                        ctx.fillStyle = 'rgba(5, 5, 10, 0.85)';
                        ctx.fillRect(c * cs, r * cs, cs, cs);
                    }
                }
            }
        }

        offscreen.toBlob((blob) => {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'dnd-map.png';
            a.click();
            URL.revokeObjectURL(url);
        }, 'image/png');
    },
};
