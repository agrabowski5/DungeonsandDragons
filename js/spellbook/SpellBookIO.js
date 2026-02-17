// ─── Spell Book I/O ─────────────────────────────────────────────────
// Persistence layer for spell book favorites using localStorage.

import { Storage } from '../utils/storage.js';

const PREFIX = 'dnd_spells_';
const FAVORITES_KEY = PREFIX + 'favorites';

export const SpellBookIO = {
    /**
     * Save the list of favorited spell names to localStorage.
     * @param {string[]} favorites - Array of spell names
     * @returns {boolean}
     */
    saveFavorites(favorites) {
        return Storage.save(FAVORITES_KEY, favorites);
    },

    /**
     * Load favorited spell names from localStorage.
     * @returns {string[]}
     */
    loadFavorites() {
        return Storage.load(FAVORITES_KEY, []);
    },

    /**
     * Clear all saved favorites.
     */
    clearFavorites() {
        Storage.remove(FAVORITES_KEY);
    },

    /**
     * Export favorites as a JSON file download.
     * @param {string[]} favorites
     */
    exportFavorites(favorites) {
        const data = { version: 1, favorites };
        const blob = new Blob(
            [JSON.stringify(data, null, 2)],
            { type: 'application/json' }
        );
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dnd-spellbook-favorites.json';
        a.click();
        URL.revokeObjectURL(url);
    },

    /**
     * Import favorites from a JSON file.
     * @param {File} file
     * @returns {Promise<string[]>}
     */
    importFavorites(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    const favorites = Array.isArray(data.favorites) ? data.favorites : [];
                    resolve(favorites);
                } catch (err) {
                    reject(err);
                }
            };
            reader.onerror = reject;
            reader.readAsText(file);
        });
    },

    /**
     * List all spell-book-related keys in localStorage.
     * @returns {string[]}
     */
    listKeys() {
        return Storage.listKeys(PREFIX);
    },
};
