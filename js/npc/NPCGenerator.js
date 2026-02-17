// ─── NPC Random Generation Logic ────────────────────────────────────
import { rollD, rollFormula, abilityMod } from '../utils/dice.js';
import {
    RACES, NPC_RACES, NPC_CLASSES, GENDERS, NAMES,
    NPC_FIRST_NAMES, NPC_LAST_NAMES, NPC_ALIGNMENTS,
    AGE_RANGES, OCCUPATIONS, NPC_OCCUPATIONS,
    PERSONALITY_TRAITS, NPC_PERSONALITY_TRAITS,
    IDEALS, NPC_IDEALS,
    BONDS, NPC_BONDS,
    FLAWS, NPC_FLAWS,
    BACKSTORY_HOOKS,
    QUIRKS, NPC_QUIRKS,
    APPEARANCES, NPC_APPEARANCES,
    NPC_MOTIVATIONS,
    ABILITY_NAMES,
    CLASS_HIT_DICE, CLASS_BASE_AC
} from '../data/npc-tables.js';

// ─── Helpers ────────────────────────────────────────────────────────

function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickExcluding(arr, ...excluded) {
    const filtered = arr.filter(item => !excluded.includes(item));
    return filtered.length > 0 ? pick(filtered) : pick(arr);
}

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ─── Stat Generation ────────────────────────────────────────────────

function roll3d6() {
    return rollFormula('3d6');
}

function roll4d6DropLowest() {
    const rolls = [rollD(6), rollD(6), rollD(6), rollD(6)];
    rolls.sort((a, b) => a - b);
    return rolls[1] + rolls[2] + rolls[3];
}

function generateBaseStats(heroic = false) {
    const stats = {};
    const rollFn = heroic ? roll4d6DropLowest : roll3d6;
    for (const ability of ABILITY_NAMES) {
        stats[ability] = rollFn();
    }
    return stats;
}

function applyOccupationBias(stats, occupation) {
    if (!occupation || !occupation.statBias) return stats;
    const biased = { ...stats };
    for (const [ability, bonus] of Object.entries(occupation.statBias)) {
        biased[ability] = Math.min(20, biased[ability] + bonus);
    }
    return biased;
}

// ─── Age ────────────────────────────────────────────────────────────

function generateAge(race) {
    const ranges = AGE_RANGES[race];
    if (!ranges) return { age: 30, category: 'adult' };

    const categories = Object.keys(ranges);
    const category = pick(categories);
    const [min, max] = ranges[category];
    const age = randomBetween(min, max);

    return { age, category };
}

function ageDescription(age, category) {
    const labels = {
        young: 'Young',
        adult: 'Adult',
        middle: 'Middle-aged',
        old: 'Elderly'
    };
    return `${labels[category] || 'Adult'} (${age} years)`;
}

// ─── HP & AC ────────────────────────────────────────────────────────

function calculateHP(stats, npcClass) {
    const conMod = abilityMod(stats.con);
    const hitDie = CLASS_HIT_DICE[npcClass] || 8;
    // NPC level 1: max hit die + CON mod
    const hp = Math.max(1, hitDie + conMod);
    return hp;
}

function calculateAC(stats, npcClass) {
    const baseAC = CLASS_BASE_AC[npcClass];
    if (baseAC !== undefined) {
        // For unarmored classes (Monk, Barbarian, Commoner, etc.), add DEX mod
        const unarmoredClasses = ['Commoner', 'Monk', 'Barbarian', 'Merchant', 'Scholar', 'Noble', 'Artisan'];
        if (unarmoredClasses.includes(npcClass)) {
            const dexMod = abilityMod(stats.dex);
            return baseAC + dexMod;
        }
        return baseAC;
    }
    // Fallback: 10 + dex mod
    return 10 + abilityMod(stats.dex);
}

// ─── Main Generator ─────────────────────────────────────────────────

export class NPCGenerator {

    /**
     * Generate a complete NPC.
     * @param {Object} options
     * @param {string} [options.race] - Force a specific race, or 'Any'
     * @param {string} [options.gender] - Force a specific gender, or 'Any'
     * @param {string} [options.npcClass] - Force a specific class, or 'Any'
     * @returns {Object} Full NPC data object
     */
    static generate(options = {}) {
        const race = (options.race && options.race !== 'Any')
            ? options.race
            : pick(NPC_RACES);

        const gender = (options.gender && options.gender !== 'Any')
            ? options.gender
            : pick(GENDERS);

        const npcClass = (options.npcClass && options.npcClass !== 'Any')
            ? options.npcClass
            : pick(NPC_CLASSES);

        const raceNames = NAMES[race] || NAMES['Human'];
        const firstName = gender === 'Male'
            ? pick(raceNames.male)
            : pick(raceNames.female);
        const surname = pick(raceNames.surnames);
        const name = `${firstName} ${surname}`;

        const { age, category } = generateAge(race);
        const occupation = pick(OCCUPATIONS);
        const alignment = pick(NPC_ALIGNMENTS);

        // Heroic classes get 4d6-drop-lowest, common NPCs get 3d6
        const heroicClasses = ['Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger',
            'Bard', 'Paladin', 'Warlock', 'Sorcerer', 'Druid', 'Barbarian', 'Monk'];
        const isHeroic = heroicClasses.includes(npcClass);

        const baseStats = generateBaseStats(isHeroic);
        const stats = applyOccupationBias(baseStats, occupation);
        const hp = calculateHP(stats, npcClass);
        const ac = calculateAC(stats, npcClass);

        const personality = pick(NPC_PERSONALITY_TRAITS);
        const ideal = pick(NPC_IDEALS);
        const bond = pick(NPC_BONDS);
        const flaw = pick(NPC_FLAWS);
        const backstory = pick(BACKSTORY_HOOKS);
        const quirk = pick(NPC_QUIRKS);
        const appearance = pick(NPC_APPEARANCES);
        const motivation = pick(NPC_MOTIVATIONS);

        return {
            id: generateId(),
            name,
            firstName,
            surname,
            race,
            gender,
            npcClass,
            alignment,
            age,
            ageCategory: category,
            ageDescription: ageDescription(age, category),
            occupation: occupation.name,
            occupationData: occupation,
            stats,
            hp,
            ac,
            personality,
            ideal,
            bond,
            flaw,
            backstory,
            quirk,
            appearance,
            motivation,
            // Backward compat
            personalityTrait: personality,
            createdAt: Date.now()
        };
    }

    // ─── Ability Scores (standalone) ───────────────────────────

    /**
     * Generate ability scores using the 4d6-drop-lowest method.
     * @returns {Object} { str, dex, con, int, wis, cha }
     */
    static generateAbilityScores() {
        const stats = {};
        for (const ability of ABILITY_NAMES) {
            stats[ability] = roll4d6DropLowest();
        }
        return stats;
    }

    // ─── Partial Regeneration ───────────────────────────────────

    /**
     * Re-roll a specific section of an existing NPC.
     * Returns a new object with the section replaced.
     */
    static regenerateSection(npc, section) {
        const updated = { ...npc };

        switch (section) {
            case 'name': {
                const raceNames = NAMES[npc.race] || NAMES['Human'];
                updated.firstName = npc.gender === 'Male'
                    ? pick(raceNames.male)
                    : pick(raceNames.female);
                updated.surname = pick(raceNames.surnames);
                updated.name = `${updated.firstName} ${updated.surname}`;
                break;
            }
            case 'class': {
                updated.npcClass = pickExcluding(NPC_CLASSES, npc.npcClass);
                updated.hp = calculateHP(updated.stats, updated.npcClass);
                updated.ac = calculateAC(updated.stats, updated.npcClass);
                break;
            }
            case 'alignment':
                updated.alignment = pickExcluding(NPC_ALIGNMENTS, npc.alignment);
                break;
            case 'occupation': {
                const occupation = pickExcluding(OCCUPATIONS, npc.occupationData);
                updated.occupation = occupation.name;
                updated.occupationData = occupation;
                const baseStats = generateBaseStats();
                updated.stats = applyOccupationBias(baseStats, occupation);
                updated.hp = calculateHP(updated.stats, updated.npcClass);
                updated.ac = calculateAC(updated.stats, updated.npcClass);
                break;
            }
            case 'stats': {
                const baseStats = generateBaseStats();
                updated.stats = applyOccupationBias(baseStats, npc.occupationData);
                updated.hp = calculateHP(updated.stats, updated.npcClass);
                updated.ac = calculateAC(updated.stats, updated.npcClass);
                break;
            }
            case 'personality':
                updated.personality = pickExcluding(NPC_PERSONALITY_TRAITS, npc.personality);
                updated.personalityTrait = updated.personality;
                break;
            case 'ideal':
                updated.ideal = pickExcluding(NPC_IDEALS, npc.ideal);
                break;
            case 'bond':
                updated.bond = pickExcluding(NPC_BONDS, npc.bond);
                break;
            case 'flaw':
                updated.flaw = pickExcluding(NPC_FLAWS, npc.flaw);
                break;
            case 'backstory':
                updated.backstory = pickExcluding(BACKSTORY_HOOKS, npc.backstory);
                break;
            case 'quirk':
                updated.quirk = pickExcluding(NPC_QUIRKS, npc.quirk);
                break;
            case 'appearance':
                updated.appearance = pickExcluding(NPC_APPEARANCES, npc.appearance);
                break;
            case 'motivation':
                updated.motivation = pickExcluding(NPC_MOTIVATIONS, npc.motivation);
                break;
            default:
                break;
        }

        return updated;
    }

    // ─── Export ─────────────────────────────────────────────────

    /**
     * Format an NPC as a plain-text string for clipboard export.
     */
    static toText(npc) {
        const modStr = (score) => {
            const mod = abilityMod(score);
            return mod >= 0 ? `+${mod}` : `${mod}`;
        };

        const lines = [
            `=== ${npc.name} ===`,
            `Race: ${npc.race}  |  Gender: ${npc.gender}  |  Age: ${npc.ageDescription}`,
            `Class: ${npc.npcClass || 'Commoner'}  |  Alignment: ${npc.alignment || 'True Neutral'}`,
            `Occupation: ${npc.occupation}`,
            '',
            `--- Ability Scores ---`,
            `STR: ${npc.stats.str} (${modStr(npc.stats.str)})  DEX: ${npc.stats.dex} (${modStr(npc.stats.dex)})  CON: ${npc.stats.con} (${modStr(npc.stats.con)})`,
            `INT: ${npc.stats.int} (${modStr(npc.stats.int)})  WIS: ${npc.stats.wis} (${modStr(npc.stats.wis)})  CHA: ${npc.stats.cha} (${modStr(npc.stats.cha)})`,
            `AC: ${npc.ac}  |  HP: ${npc.hp}`,
            '',
            `--- Personality ---`,
            `Trait: ${npc.personality || npc.personalityTrait}`,
            `Ideal: ${npc.ideal}`,
            `Bond: ${npc.bond}`,
            `Flaw: ${npc.flaw}`,
            '',
            `--- Details ---`,
            `Backstory: ${npc.backstory}`,
            `Motivation: ${npc.motivation || 'Unknown'}`,
            `Quirk: ${npc.quirk}`,
            `Appearance: ${npc.appearance}`,
        ];

        return lines.join('\n');
    }
}
