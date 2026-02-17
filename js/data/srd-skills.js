/**
 * D&D 5e SRD Skills
 * Each skill mapped to its governing ability score.
 */
export const SRD_SKILLS = [
    { name: 'Acrobatics',       ability: 'dexterity' },
    { name: 'Animal Handling',  ability: 'wisdom' },
    { name: 'Arcana',           ability: 'intelligence' },
    { name: 'Athletics',        ability: 'strength' },
    { name: 'Deception',        ability: 'charisma' },
    { name: 'History',          ability: 'intelligence' },
    { name: 'Insight',          ability: 'wisdom' },
    { name: 'Intimidation',     ability: 'charisma' },
    { name: 'Investigation',    ability: 'intelligence' },
    { name: 'Medicine',         ability: 'wisdom' },
    { name: 'Nature',           ability: 'intelligence' },
    { name: 'Perception',       ability: 'wisdom' },
    { name: 'Performance',      ability: 'charisma' },
    { name: 'Persuasion',       ability: 'charisma' },
    { name: 'Religion',         ability: 'intelligence' },
    { name: 'Sleight of Hand',  ability: 'dexterity' },
    { name: 'Stealth',          ability: 'dexterity' },
    { name: 'Survival',         ability: 'wisdom' }
];

/**
 * Lookup map: skill name -> ability key
 */
export const SKILL_ABILITY_MAP = Object.freeze(
    SRD_SKILLS.reduce((map, skill) => {
        map[skill.name] = skill.ability;
        return map;
    }, {})
);

/**
 * All six ability score names (lowercase keys used in character data).
 */
export const ABILITIES = [
    'strength',
    'dexterity',
    'constitution',
    'intelligence',
    'wisdom',
    'charisma'
];

/**
 * Short labels for display.
 */
export const ABILITY_LABELS = {
    strength:     'STR',
    dexterity:    'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom:       'WIS',
    charisma:     'CHA'
};
