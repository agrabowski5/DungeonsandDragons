// ─── Spell Book State ───────────────────────────────────────────────
// Manages filter state, search query, and favorites for the spell book.

import { SRD_SPELLS, SCHOOLS, CLASSES } from '../data/srd-spells.js';
import { SpellBookIO } from './SpellBookIO.js';

export class SpellBookState {
    constructor() {
        /** @type {string} */
        this.searchQuery = '';

        /** @type {number|null} Filter by level (null = all) */
        this.filterLevel = null;

        /** @type {string|null} Filter by school (null = all) */
        this.filterSchool = null;

        /** @type {string|null} Filter by class (null = all) */
        this.filterClass = null;

        /** @type {boolean|null} Filter by concentration (null = all) */
        this.filterConcentration = null;

        /** @type {boolean|null} Filter by ritual (null = all) */
        this.filterRitual = null;

        /** @type {Set<string>} Favorite spell names */
        this.favorites = new Set(SpellBookIO.loadFavorites());

        /** @type {Function[]} Change listeners */
        this._listeners = [];
    }

    // ─── Filter application ─────────────────────────────────

    /**
     * Returns filtered spell list based on the current state.
     * @returns {object[]}
     */
    getFilteredSpells() {
        return SRD_SPELLS.filter(spell => {
            // Text search
            if (this.searchQuery) {
                const q = this.searchQuery.toLowerCase();
                if (!spell.name.toLowerCase().includes(q)) return false;
            }

            // Level
            if (this.filterLevel !== null && spell.level !== this.filterLevel) {
                return false;
            }

            // School
            if (this.filterSchool !== null && spell.school !== this.filterSchool) {
                return false;
            }

            // Class
            if (this.filterClass !== null && !spell.classes.includes(this.filterClass)) {
                return false;
            }

            // Concentration
            if (this.filterConcentration !== null && spell.concentration !== this.filterConcentration) {
                return false;
            }

            // Ritual
            if (this.filterRitual !== null && spell.ritual !== this.filterRitual) {
                return false;
            }

            return true;
        });
    }

    /**
     * Returns only favorited spells from the full database.
     * @returns {object[]}
     */
    getFavoriteSpells() {
        return SRD_SPELLS.filter(spell => this.favorites.has(spell.name));
    }

    /**
     * Total count of spells in the database.
     */
    get totalSpellCount() {
        return SRD_SPELLS.length;
    }

    // ─── Setters ────────────────────────────────────────────

    setSearch(query) {
        this.searchQuery = query;
        this._notify();
    }

    setLevel(level) {
        this.filterLevel = level;
        this._notify();
    }

    setSchool(school) {
        this.filterSchool = school;
        this._notify();
    }

    setClass(cls) {
        this.filterClass = cls;
        this._notify();
    }

    setConcentration(value) {
        this.filterConcentration = value;
        this._notify();
    }

    setRitual(value) {
        this.filterRitual = value;
        this._notify();
    }

    clearFilters() {
        this.searchQuery = '';
        this.filterLevel = null;
        this.filterSchool = null;
        this.filterClass = null;
        this.filterConcentration = null;
        this.filterRitual = null;
        this._notify();
    }

    /** @returns {boolean} True if any filter is active */
    hasActiveFilters() {
        return !!(
            this.searchQuery ||
            this.filterLevel !== null ||
            this.filterSchool !== null ||
            this.filterClass !== null ||
            this.filterConcentration !== null ||
            this.filterRitual !== null
        );
    }

    // ─── Favorites ──────────────────────────────────────────

    toggleFavorite(spellName) {
        if (this.favorites.has(spellName)) {
            this.favorites.delete(spellName);
        } else {
            this.favorites.add(spellName);
        }
        SpellBookIO.saveFavorites([...this.favorites]);
        this._notify();
    }

    isFavorite(spellName) {
        return this.favorites.has(spellName);
    }

    // ─── Observer pattern ───────────────────────────────────

    onChange(fn) {
        this._listeners.push(fn);
    }

    removeListener(fn) {
        this._listeners = this._listeners.filter(l => l !== fn);
    }

    _notify() {
        for (const fn of this._listeners) {
            fn(this);
        }
    }
}
