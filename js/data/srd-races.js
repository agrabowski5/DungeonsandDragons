/**
 * D&D 5e SRD Races
 * All 9 standard races with ability bonuses, traits, speed, and size.
 */
export const SRD_RACES = [
    {
        name: 'Human',
        abilityBonuses: {
            strength: 1,
            dexterity: 1,
            constitution: 1,
            intelligence: 1,
            wisdom: 1,
            charisma: 1
        },
        speed: 30,
        size: 'Medium',
        languages: ['Common', 'One extra language'],
        traits: [
            {
                name: 'Versatile',
                description: '+1 to all ability scores. Extra language of your choice.'
            }
        ]
    },
    {
        name: 'Elf',
        abilityBonuses: {
            dexterity: 2
        },
        speed: 30,
        size: 'Medium',
        languages: ['Common', 'Elvish'],
        traits: [
            {
                name: 'Darkvision',
                description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.'
            },
            {
                name: 'Keen Senses',
                description: 'You have proficiency in the Perception skill.'
            },
            {
                name: 'Fey Ancestry',
                description: 'You have advantage on saving throws against being charmed, and magic cannot put you to sleep.'
            },
            {
                name: 'Trance',
                description: 'Elves do not need to sleep. Instead, they meditate deeply for 4 hours a day.'
            }
        ]
    },
    {
        name: 'Dwarf',
        abilityBonuses: {
            constitution: 2
        },
        speed: 25,
        size: 'Medium',
        languages: ['Common', 'Dwarvish'],
        traits: [
            {
                name: 'Darkvision',
                description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.'
            },
            {
                name: 'Dwarven Resilience',
                description: 'You have advantage on saving throws against poison, and you have resistance against poison damage.'
            },
            {
                name: 'Dwarven Combat Training',
                description: 'You have proficiency with the battleaxe, handaxe, light hammer, and warhammer.'
            },
            {
                name: 'Stonecunning',
                description: 'Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient and add double your proficiency bonus.'
            }
        ]
    },
    {
        name: 'Halfling',
        abilityBonuses: {
            dexterity: 2
        },
        speed: 25,
        size: 'Small',
        languages: ['Common', 'Halfling'],
        traits: [
            {
                name: 'Lucky',
                description: 'When you roll a 1 on the d20 for an attack roll, ability check, or saving throw, you can reroll the die and must use the new roll.'
            },
            {
                name: 'Brave',
                description: 'You have advantage on saving throws against being frightened.'
            },
            {
                name: 'Halfling Nimbleness',
                description: 'You can move through the space of any creature that is of a size larger than yours.'
            }
        ]
    },
    {
        name: 'Half-Elf',
        abilityBonuses: {
            charisma: 2
            // +1 to two other abilities of player's choice (handled in UI)
        },
        speed: 30,
        size: 'Medium',
        languages: ['Common', 'Elvish', 'One extra language'],
        traits: [
            {
                name: 'Darkvision',
                description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.'
            },
            {
                name: 'Fey Ancestry',
                description: 'You have advantage on saving throws against being charmed, and magic cannot put you to sleep.'
            },
            {
                name: 'Skill Versatility',
                description: 'You gain proficiency in two skills of your choice.'
            },
            {
                name: 'Flexible Ability Increase',
                description: 'Two ability scores of your choice (other than Charisma) each increase by 1.'
            }
        ],
        extraAbilityChoices: 2
    },
    {
        name: 'Half-Orc',
        abilityBonuses: {
            strength: 2,
            constitution: 1
        },
        speed: 30,
        size: 'Medium',
        languages: ['Common', 'Orc'],
        traits: [
            {
                name: 'Darkvision',
                description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.'
            },
            {
                name: 'Menacing',
                description: 'You gain proficiency in the Intimidation skill.'
            },
            {
                name: 'Relentless Endurance',
                description: 'When you are reduced to 0 hit points but not killed outright, you can drop to 1 hit point instead. Once per long rest.'
            },
            {
                name: 'Savage Attacks',
                description: 'When you score a critical hit with a melee weapon attack, you can roll one of the weapon\'s damage dice one additional time and add it to the extra damage.'
            }
        ]
    },
    {
        name: 'Tiefling',
        abilityBonuses: {
            charisma: 2,
            intelligence: 1
        },
        speed: 30,
        size: 'Medium',
        languages: ['Common', 'Infernal'],
        traits: [
            {
                name: 'Darkvision',
                description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.'
            },
            {
                name: 'Hellish Resistance',
                description: 'You have resistance to fire damage.'
            },
            {
                name: 'Infernal Legacy',
                description: 'You know the thaumaturgy cantrip. At 3rd level you can cast hellish rebuke once per day as a 2nd-level spell. At 5th level you can cast darkness once per day.'
            }
        ]
    },
    {
        name: 'Gnome',
        abilityBonuses: {
            intelligence: 2
        },
        speed: 25,
        size: 'Small',
        languages: ['Common', 'Gnomish'],
        traits: [
            {
                name: 'Darkvision',
                description: 'You can see in dim light within 60 feet as if it were bright light, and in darkness as if it were dim light.'
            },
            {
                name: 'Gnome Cunning',
                description: 'You have advantage on all Intelligence, Wisdom, and Charisma saving throws against magic.'
            }
        ]
    },
    {
        name: 'Dragonborn',
        abilityBonuses: {
            strength: 2,
            charisma: 1
        },
        speed: 30,
        size: 'Medium',
        languages: ['Common', 'Draconic'],
        traits: [
            {
                name: 'Breath Weapon',
                description: 'You can use your action to exhale destructive energy. The damage type and area depend on your draconic ancestry.'
            },
            {
                name: 'Damage Resistance',
                description: 'You have resistance to the damage type associated with your draconic ancestry.'
            }
        ]
    }
];

/**
 * Quick lookup: race name -> race data
 */
export const RACE_MAP = Object.freeze(
    SRD_RACES.reduce((map, race) => {
        map[race.name] = race;
        return map;
    }, {})
);
