/**
 * CharacterState - D&D 5e Character Data Model
 *
 * Provides factory functions for creating blank characters and
 * computing derived stats (proficiency bonus, skill modifiers, etc.).
 */

import { getProficiencyBonus } from '../data/srd-classes.js';
import { SRD_SKILLS, ABILITIES } from '../data/srd-skills.js';
import { abilityMod } from '../utils/dice.js';

/**
 * Generate a unique ID for a new character.
 * @returns {string}
 */
export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

/**
 * Create a blank character data object with all default values.
 * @returns {object} A fresh character data object.
 */
export function createBlankCharacter() {
    const skills = {};
    for (const skill of SRD_SKILLS) {
        skills[skill.name] = { proficient: false };
    }

    const savingThrows = {};
    for (const ability of ABILITIES) {
        savingThrows[ability] = { proficient: false };
    }

    const spellSlots = {};
    for (let i = 1; i <= 9; i++) {
        spellSlots[i] = { total: 0, used: 0 };
    }

    return {
        id: generateId(),
        name: 'New Character',
        playerName: '',
        race: '',
        class: '',
        subclass: '',
        level: 1,
        background: '',
        alignment: '',
        experiencePoints: 0,

        abilities: {
            strength: 10,
            dexterity: 10,
            constitution: 10,
            intelligence: 10,
            wisdom: 10,
            charisma: 10
        },

        armorClass: 10,
        speed: 30,

        hitPoints: {
            current: 10,
            max: 10,
            temp: 0
        },

        hitDice: {
            total: '1d10',
            current: 1
        },

        deathSaves: {
            successes: 0,
            failures: 0
        },

        proficiencyBonus: 2,

        savingThrows,
        skills,

        features: [],

        inventory: [],

        currency: {
            cp: 0,
            sp: 0,
            ep: 0,
            gp: 0,
            pp: 0
        },

        spellcastingAbility: '',
        spellSaveDC: 0,
        spellAttackBonus: 0,
        spellSlots,

        personalityTraits: '',
        ideals: '',
        bonds: '',
        flaws: '',
        backstory: '',

        createdAt: Date.now(),
        updatedAt: Date.now()
    };
}

/**
 * Recompute all derived stats on a character data object (mutates in place).
 *   - proficiencyBonus from level
 *   - skill modifiers
 *   - saving throw modifiers
 *   - spell save DC & attack bonus
 *   - initiative
 *
 * @param {object} char - The character data object.
 * @returns {object} The same object, updated.
 */
export function recomputeDerived(char) {
    // Proficiency bonus
    char.proficiencyBonus = getProficiencyBonus(char.level || 1);

    // Hit dice string
    if (char.class) {
        // hitDice.total is a display string like "5d10"
        // Keep current count at most equal to level
        char.hitDice.current = Math.min(char.hitDice.current, char.level);
    }

    // Spell save DC and attack bonus
    if (char.spellcastingAbility && char.abilities[char.spellcastingAbility] !== undefined) {
        const mod = abilityMod(char.abilities[char.spellcastingAbility]);
        char.spellSaveDC = 8 + char.proficiencyBonus + mod;
        char.spellAttackBonus = char.proficiencyBonus + mod;
    }

    char.updatedAt = Date.now();
    return char;
}

/**
 * Get the modifier for a specific skill.
 * @param {object} char - Character data object
 * @param {string} skillName - Skill name (e.g. 'Perception')
 * @param {string} abilityKey - Governing ability (e.g. 'wisdom')
 * @returns {number}
 */
export function getSkillModifier(char, skillName, abilityKey) {
    const base = abilityMod(char.abilities[abilityKey] || 10);
    const proficient = char.skills[skillName]?.proficient || false;
    return base + (proficient ? char.proficiencyBonus : 0);
}

/**
 * Get the modifier for a saving throw.
 * @param {object} char - Character data object
 * @param {string} abilityKey - Ability (e.g. 'dexterity')
 * @returns {number}
 */
export function getSavingThrowModifier(char, abilityKey) {
    const base = abilityMod(char.abilities[abilityKey] || 10);
    const proficient = char.savingThrows[abilityKey]?.proficient || false;
    return base + (proficient ? char.proficiencyBonus : 0);
}

/**
 * Get the initiative modifier (DEX mod).
 * @param {object} char
 * @returns {number}
 */
export function getInitiative(char) {
    return abilityMod(char.abilities.dexterity || 10);
}

/**
 * Get passive perception.
 * @param {object} char
 * @returns {number}
 */
export function getPassivePerception(char) {
    return 10 + getSkillModifier(char, 'Perception', 'wisdom');
}

/**
 * Format a modifier number as a signed string (e.g. +2, -1, +0).
 * @param {number} mod
 * @returns {string}
 */
export function formatMod(mod) {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

/**
 * Deep clone a character object.
 * @param {object} char
 * @returns {object}
 */
export function cloneCharacter(char) {
    return JSON.parse(JSON.stringify(char));
}
