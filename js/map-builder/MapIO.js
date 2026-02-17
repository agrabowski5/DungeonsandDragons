import { Storage } from '../utils/storage.js';
import { MapGrid } from './MapGrid.js';

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
};
