import { Storage } from '../utils/storage.js';
import { EncounterState } from './EncounterState.js';

const PREFIX = 'dnd_encounter_';

export const EncounterIO = {
    save(name, encounterState) {
        return Storage.save(PREFIX + name, encounterState.toJSON());
    },

    load(name) {
        const data = Storage.load(PREFIX + name);
        return data ? EncounterState.fromJSON(data) : null;
    },

    listSaved() {
        return Storage.listKeys(PREFIX).map(k => k.replace(PREFIX, ''));
    },

    delete(name) {
        Storage.remove(PREFIX + name);
    },

    exportJSON(encounterState) {
        const blob = new Blob(
            [JSON.stringify(encounterState.toJSON(), null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dnd-encounter.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    importJSON(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(EncounterState.fromJSON(data));
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },
};
