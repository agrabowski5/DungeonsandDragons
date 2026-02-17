/**
 * CharacterIO - Save / Load / Export / Import characters via localStorage.
 *
 * All keys use the prefix `dnd_character_` followed by the character's id.
 * An index key `dnd_character__index` stores an array of { id, name, updatedAt }
 * for fast sidebar listing without deserializing every character.
 */

import { Storage } from '../utils/storage.js';
import { createBlankCharacter, recomputeDerived } from './CharacterState.js';

const PREFIX = 'dnd_character_';
const INDEX_KEY = `${PREFIX}_index`;

/* ------------------------------------------------------------------ */
/*  Index helpers                                                      */
/* ------------------------------------------------------------------ */

/**
 * Read the character index array from storage.
 * @returns {{ id: string, name: string, updatedAt: number }[]}
 */
function readIndex() {
    return Storage.load(INDEX_KEY, []);
}

/**
 * Write the character index array to storage.
 * @param {{ id: string, name: string, updatedAt: number }[]} index
 */
function writeIndex(index) {
    Storage.save(INDEX_KEY, index);
}

/**
 * Ensure an entry for `char` exists in the index, creating or updating it.
 * @param {object} char
 */
function upsertIndex(char) {
    const index = readIndex();
    const existing = index.findIndex(e => e.id === char.id);
    const entry = { id: char.id, name: char.name, updatedAt: char.updatedAt };
    if (existing >= 0) {
        index[existing] = entry;
    } else {
        index.push(entry);
    }
    writeIndex(index);
}

/**
 * Remove a character entry from the index.
 * @param {string} id
 */
function removeFromIndex(id) {
    const index = readIndex().filter(e => e.id !== id);
    writeIndex(index);
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

export const CharacterIO = {

    /**
     * List all saved characters (lightweight metadata only).
     * @returns {{ id: string, name: string, updatedAt: number }[]}
     */
    list() {
        return readIndex().sort((a, b) => b.updatedAt - a.updatedAt);
    },

    /**
     * Save a character to localStorage.
     * @param {object} char - Full character data object.
     * @returns {boolean}
     */
    save(char) {
        char.updatedAt = Date.now();
        const ok = Storage.save(`${PREFIX}${char.id}`, char);
        if (ok) upsertIndex(char);
        return ok;
    },

    /**
     * Load a character by id.
     * @param {string} id
     * @returns {object|null}
     */
    load(id) {
        const char = Storage.load(`${PREFIX}${id}`, null);
        if (char) recomputeDerived(char);
        return char;
    },

    /**
     * Delete a character by id.
     * @param {string} id
     */
    delete(id) {
        Storage.remove(`${PREFIX}${id}`);
        removeFromIndex(id);
    },

    /**
     * Create and persist a brand-new blank character.
     * @returns {object} The new character data.
     */
    createNew() {
        const char = createBlankCharacter();
        recomputeDerived(char);
        this.save(char);
        return char;
    },

    /**
     * Export a character as a JSON string (for file download).
     * @param {object} char
     * @returns {string}
     */
    exportJSON(char) {
        return JSON.stringify(char, null, 2);
    },

    /**
     * Import a character from a JSON string.
     * Assigns a new id to avoid collisions, then saves.
     * @param {string} jsonString
     * @returns {object} The imported character data.
     * @throws {Error} If JSON is invalid.
     */
    importJSON(jsonString) {
        const char = JSON.parse(jsonString);

        // Validate minimum required shape
        if (!char || typeof char !== 'object' || !char.name) {
            throw new Error('Invalid character data: missing name field.');
        }

        // Ensure we have a fresh unique ID to avoid overwriting existing characters
        const { generateId } = /** @type {any} */ (
            // Dynamic import would be async; inline a quick id generator instead
            { generateId: () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8) }
        );
        char.id = generateId();
        char.createdAt = Date.now();
        char.updatedAt = Date.now();

        recomputeDerived(char);
        this.save(char);
        return char;
    },

    /**
     * Trigger a browser file-download of the character JSON.
     * @param {object} char
     */
    downloadCharacter(char) {
        const json = this.exportJSON(char);
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${(char.name || 'character').replace(/\s+/g, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    },

    /**
     * Open a file-picker dialog, read the selected JSON file, import it.
     * Returns a Promise that resolves with the imported character.
     * @returns {Promise<object>}
     */
    uploadCharacter() {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json,application/json';
            input.addEventListener('change', () => {
                const file = input.files?.[0];
                if (!file) return reject(new Error('No file selected.'));
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const char = this.importJSON(/** @type {string} */ (reader.result));
                        resolve(char);
                    } catch (err) {
                        reject(err);
                    }
                };
                reader.onerror = () => reject(new Error('Failed to read file.'));
                reader.readAsText(file);
            });
            input.click();
        });
    }
};
