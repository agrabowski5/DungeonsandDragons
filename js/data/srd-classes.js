/**
 * D&D 5e SRD Classes
 * All 12 standard classes with hit dice, primary abilities,
 * saving throw proficiencies, and skill options.
 */
export const SRD_CLASSES = [
    {
        name: 'Barbarian',
        hitDie: 12,
        primaryAbility: ['strength'],
        savingThrows: ['strength', 'constitution'],
        armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
        weaponProficiencies: ['Simple weapons', 'Martial weapons'],
        skillChoices: {
            count: 2,
            options: [
                'Animal Handling', 'Athletics', 'Intimidation',
                'Nature', 'Perception', 'Survival'
            ]
        },
        spellcaster: false,
        description: 'A fierce warrior who can enter a battle rage.'
    },
    {
        name: 'Bard',
        hitDie: 8,
        primaryAbility: ['charisma'],
        savingThrows: ['dexterity', 'charisma'],
        armorProficiencies: ['Light armor'],
        weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
        skillChoices: {
            count: 3,
            options: [
                'Acrobatics', 'Animal Handling', 'Arcana', 'Athletics',
                'Deception', 'History', 'Insight', 'Intimidation',
                'Investigation', 'Medicine', 'Nature', 'Perception',
                'Performance', 'Persuasion', 'Religion', 'Sleight of Hand',
                'Stealth', 'Survival'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'charisma',
        description: 'An inspiring magician whose power echoes the music of creation.'
    },
    {
        name: 'Cleric',
        hitDie: 8,
        primaryAbility: ['wisdom'],
        savingThrows: ['wisdom', 'charisma'],
        armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
        weaponProficiencies: ['Simple weapons'],
        skillChoices: {
            count: 2,
            options: [
                'History', 'Insight', 'Medicine',
                'Persuasion', 'Religion'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'wisdom',
        description: 'A priestly champion who wields divine magic in service of a higher power.'
    },
    {
        name: 'Druid',
        hitDie: 8,
        primaryAbility: ['wisdom'],
        savingThrows: ['intelligence', 'wisdom'],
        armorProficiencies: ['Light armor', 'Medium armor', 'Shields (non-metal)'],
        weaponProficiencies: ['Clubs', 'Daggers', 'Darts', 'Javelins', 'Maces', 'Quarterstaffs', 'Scimitars', 'Sickles', 'Slings', 'Spears'],
        skillChoices: {
            count: 2,
            options: [
                'Arcana', 'Animal Handling', 'Insight',
                'Medicine', 'Nature', 'Perception',
                'Religion', 'Survival'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'wisdom',
        description: 'A priest of the Old Faith, wielding the powers of nature and adopting animal forms.'
    },
    {
        name: 'Fighter',
        hitDie: 10,
        primaryAbility: ['strength'],
        savingThrows: ['strength', 'constitution'],
        armorProficiencies: ['All armor', 'Shields'],
        weaponProficiencies: ['Simple weapons', 'Martial weapons'],
        skillChoices: {
            count: 2,
            options: [
                'Acrobatics', 'Animal Handling', 'Athletics',
                'History', 'Insight', 'Intimidation',
                'Perception', 'Survival'
            ]
        },
        spellcaster: false,
        description: 'A master of martial combat, skilled with a variety of weapons and armor.'
    },
    {
        name: 'Monk',
        hitDie: 8,
        primaryAbility: ['dexterity', 'wisdom'],
        savingThrows: ['strength', 'dexterity'],
        armorProficiencies: [],
        weaponProficiencies: ['Simple weapons', 'Shortswords'],
        skillChoices: {
            count: 2,
            options: [
                'Acrobatics', 'Athletics', 'History',
                'Insight', 'Religion', 'Stealth'
            ]
        },
        spellcaster: false,
        description: 'A master of martial arts, harnessing the power of the body in pursuit of physical and spiritual perfection.'
    },
    {
        name: 'Paladin',
        hitDie: 10,
        primaryAbility: ['strength', 'charisma'],
        savingThrows: ['wisdom', 'charisma'],
        armorProficiencies: ['All armor', 'Shields'],
        weaponProficiencies: ['Simple weapons', 'Martial weapons'],
        skillChoices: {
            count: 2,
            options: [
                'Athletics', 'Insight', 'Intimidation',
                'Medicine', 'Persuasion', 'Religion'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'charisma',
        description: 'A holy warrior bound to a sacred oath.'
    },
    {
        name: 'Ranger',
        hitDie: 10,
        primaryAbility: ['dexterity', 'wisdom'],
        savingThrows: ['strength', 'dexterity'],
        armorProficiencies: ['Light armor', 'Medium armor', 'Shields'],
        weaponProficiencies: ['Simple weapons', 'Martial weapons'],
        skillChoices: {
            count: 3,
            options: [
                'Animal Handling', 'Athletics', 'Insight',
                'Investigation', 'Nature', 'Perception',
                'Stealth', 'Survival'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'wisdom',
        description: 'A warrior who combats threats on the edges of civilization.'
    },
    {
        name: 'Rogue',
        hitDie: 8,
        primaryAbility: ['dexterity'],
        savingThrows: ['dexterity', 'intelligence'],
        armorProficiencies: ['Light armor'],
        weaponProficiencies: ['Simple weapons', 'Hand crossbows', 'Longswords', 'Rapiers', 'Shortswords'],
        skillChoices: {
            count: 4,
            options: [
                'Acrobatics', 'Athletics', 'Deception',
                'Insight', 'Intimidation', 'Investigation',
                'Perception', 'Performance', 'Persuasion',
                'Sleight of Hand', 'Stealth'
            ]
        },
        spellcaster: false,
        description: 'A scoundrel who uses stealth and trickery to overcome obstacles and enemies.'
    },
    {
        name: 'Sorcerer',
        hitDie: 6,
        primaryAbility: ['charisma'],
        savingThrows: ['constitution', 'charisma'],
        armorProficiencies: [],
        weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
        skillChoices: {
            count: 2,
            options: [
                'Arcana', 'Deception', 'Insight',
                'Intimidation', 'Persuasion', 'Religion'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'charisma',
        description: 'A spellcaster who draws on inherent magic from a gift or bloodline.'
    },
    {
        name: 'Warlock',
        hitDie: 8,
        primaryAbility: ['charisma'],
        savingThrows: ['wisdom', 'charisma'],
        armorProficiencies: ['Light armor'],
        weaponProficiencies: ['Simple weapons'],
        skillChoices: {
            count: 2,
            options: [
                'Arcana', 'Deception', 'History',
                'Intimidation', 'Investigation',
                'Nature', 'Religion'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'charisma',
        description: 'A wielder of magic that is derived from a bargain with an extraplanar entity.'
    },
    {
        name: 'Wizard',
        hitDie: 6,
        primaryAbility: ['intelligence'],
        savingThrows: ['intelligence', 'wisdom'],
        armorProficiencies: [],
        weaponProficiencies: ['Daggers', 'Darts', 'Slings', 'Quarterstaffs', 'Light crossbows'],
        skillChoices: {
            count: 2,
            options: [
                'Arcana', 'History', 'Insight',
                'Investigation', 'Medicine', 'Religion'
            ]
        },
        spellcaster: true,
        spellcastingAbility: 'intelligence',
        description: 'A scholarly magic-user capable of manipulating the structures of reality.'
    }
];

/**
 * Quick lookup: class name -> class data
 */
export const CLASS_MAP = Object.freeze(
    SRD_CLASSES.reduce((map, cls) => {
        map[cls.name] = cls;
        return map;
    }, {})
);

/**
 * Proficiency bonus by character level (levels 1-20).
 * Index 0 = level 1, index 19 = level 20.
 */
export const PROFICIENCY_BY_LEVEL = [
    2, 2, 2, 2,     // Levels 1-4
    3, 3, 3, 3,     // Levels 5-8
    4, 4, 4, 4,     // Levels 9-12
    5, 5, 5, 5,     // Levels 13-16
    6, 6, 6, 6      // Levels 17-20
];

/**
 * Returns the proficiency bonus for a given level.
 * @param {number} level - Character level (1-20)
 * @returns {number}
 */
export function getProficiencyBonus(level) {
    const clamped = Math.max(1, Math.min(20, level));
    return PROFICIENCY_BY_LEVEL[clamped - 1];
}
