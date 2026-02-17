import { Storage } from '../utils/storage.js';

const STORAGE_KEY = 'dnd_dice_history';
const MAX_HISTORY = 50;

export class DiceRollerState {
    constructor() {
        this.history = [];
        this.modifier = 0;
        this.advantageMode = 'normal'; // 'normal' | 'advantage' | 'disadvantage'
        this._load();
    }

    /**
     * Record a single die roll.
     * @param {object} entry
     * @param {string} entry.dieType - e.g. 'd20', 'd6', 'formula'
     * @param {string} entry.formula - the formula string, e.g. '1d20', '2d6+3'
     * @param {number[]} entry.rolls - individual die results
     * @param {number} entry.modifier - modifier applied
     * @param {number} entry.total - final total after modifier
     * @param {string|null} entry.advantageMode - 'advantage', 'disadvantage', or null
     * @param {number|null} entry.keptRoll - which roll was kept (for adv/disadv)
     * @param {number|null} entry.discardedRoll - which roll was discarded
     */
    addRoll(entry) {
        const record = {
            id: Date.now() + Math.random(),
            timestamp: new Date().toISOString(),
            dieType: entry.dieType,
            formula: entry.formula,
            rolls: entry.rolls,
            modifier: entry.modifier || 0,
            total: entry.total,
            advantageMode: entry.advantageMode || null,
            keptRoll: entry.keptRoll ?? null,
            discardedRoll: entry.discardedRoll ?? null,
        };

        this.history.unshift(record);

        if (this.history.length > MAX_HISTORY) {
            this.history = this.history.slice(0, MAX_HISTORY);
        }

        this._save();
        return record;
    }

    getHistory() {
        return this.history;
    }

    clearHistory() {
        this.history = [];
        this._save();
    }

    setModifier(value) {
        this.modifier = parseInt(value) || 0;
    }

    getModifier() {
        return this.modifier;
    }

    setAdvantageMode(mode) {
        if (['normal', 'advantage', 'disadvantage'].includes(mode)) {
            this.advantageMode = mode;
        }
    }

    getAdvantageMode() {
        return this.advantageMode;
    }

    toggleAdvantageMode(mode) {
        if (this.advantageMode === mode) {
            this.advantageMode = 'normal';
        } else {
            this.advantageMode = mode;
        }
    }

    _save() {
        Storage.save(STORAGE_KEY, this.history);
    }

    _load() {
        this.history = Storage.load(STORAGE_KEY, []);
    }
}
