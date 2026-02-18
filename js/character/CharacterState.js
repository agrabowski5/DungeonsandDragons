/**
 * CharacterState - D&D 5e Character Data Model
 */

import { getProficiencyBonus } from '../data/srd-classes.js';
import { SRD_SKILLS, ABILITIES } from '../data/srd-skills.js';
import { abilityMod } from '../utils/dice.js';

export function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

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

        racialBonuses: {
            strength: 0,
            dexterity: 0,
            constitution: 0,
            intelligence: 0,
            wisdom: 0,
            charisma: 0
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

        attacks: [],

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

        knownSpells: [],
        preparedSpells: [],

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
 * Get the total ability score including racial bonuses.
 */
export function getTotalAbilityScore(char, ability) {
    const base = char.abilities[ability] || 10;
    const racial = char.racialBonuses?.[ability] || 0;
    return base + racial;
}

/**
 * Recompute all derived stats on a character data object (mutates in place).
 */
export function recomputeDerived(char) {
    // Migration guards for old characters
    if (!char.racialBonuses) {
        char.racialBonuses = { strength: 0, dexterity: 0, constitution: 0, intelligence: 0, wisdom: 0, charisma: 0 };
    }
    if (!char.attacks) char.attacks = [];
    if (!char.knownSpells) char.knownSpells = [];
    if (!char.preparedSpells) char.preparedSpells = [];

    char.proficiencyBonus = getProficiencyBonus(char.level || 1);

    if (char.class) {
        char.hitDice.current = Math.min(char.hitDice.current, char.level);
    }

    if (char.spellcastingAbility && char.abilities[char.spellcastingAbility] !== undefined) {
        const mod = abilityMod(getTotalAbilityScore(char, char.spellcastingAbility));
        char.spellSaveDC = 8 + char.proficiencyBonus + mod;
        char.spellAttackBonus = char.proficiencyBonus + mod;
    }

    char.updatedAt = Date.now();
    return char;
}

export function getSkillModifier(char, skillName, abilityKey) {
    const base = abilityMod(getTotalAbilityScore(char, abilityKey));
    const proficient = char.skills[skillName]?.proficient || false;
    return base + (proficient ? char.proficiencyBonus : 0);
}

export function getSavingThrowModifier(char, abilityKey) {
    const base = abilityMod(getTotalAbilityScore(char, abilityKey));
    const proficient = char.savingThrows[abilityKey]?.proficient || false;
    return base + (proficient ? char.proficiencyBonus : 0);
}

export function getInitiative(char) {
    return abilityMod(getTotalAbilityScore(char, 'dexterity'));
}

export function getPassivePerception(char) {
    return 10 + getSkillModifier(char, 'Perception', 'wisdom');
}

/**
 * Compute attack bonus for a given attack entry.
 */
export function getAttackBonus(char, attack) {
    const ability = attack.ability || 'strength';
    const mod = abilityMod(getTotalAbilityScore(char, ability));
    const prof = attack.proficient ? char.proficiencyBonus : 0;
    return mod + prof + (attack.bonusMod || 0);
}

export function formatMod(mod) {
    return mod >= 0 ? `+${mod}` : `${mod}`;
}

export function cloneCharacter(char) {
    return JSON.parse(JSON.stringify(char));
}
