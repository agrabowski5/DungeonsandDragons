/**
 * D&D 5e Conditions — shared by combat tracker and Quick Reference.
 */
export const CONDITIONS = [
    {
        id: 'blinded',
        name: 'Blinded',
        color: '#4a9ead',
        shortDesc: "Can't see. Auto-fail sight checks. Attack rolls have disadvantage.",
        effects: [
            'Automatically fails any ability check that requires sight.',
            "Attack rolls against the creature have advantage, and the creature's attack rolls have disadvantage.",
        ],
    },
    {
        id: 'charmed',
        name: 'Charmed',
        color: '#7b5ea7',
        shortDesc: "Can't attack the charmer. Charmer has advantage on social checks.",
        effects: [
            "Can't attack the charmer or target the charmer with harmful abilities or magical effects.",
            'The charmer has advantage on any ability check to interact socially with the creature.',
        ],
    },
    {
        id: 'deafened',
        name: 'Deafened',
        color: '#4a9ead',
        shortDesc: "Can't hear. Auto-fail hearing checks.",
        effects: [
            "Can't hear and automatically fails any ability check that requires hearing.",
        ],
    },
    {
        id: 'frightened',
        name: 'Frightened',
        color: '#7b5ea7',
        shortDesc: 'Disadvantage on checks/attacks while source is in sight.',
        effects: [
            'Has disadvantage on ability checks and attack rolls while the source of its fear is within line of sight.',
            "Can't willingly move closer to the source of its fear.",
        ],
    },
    {
        id: 'grappled',
        name: 'Grappled',
        color: '#d4a017',
        shortDesc: 'Speed becomes 0. Ends if grappler is incapacitated or forced apart.',
        effects: [
            "Speed becomes 0 and can't benefit from any bonus to speed.",
            'Ends if the grappler is incapacitated or the creature is moved outside the grapple range.',
        ],
    },
    {
        id: 'incapacitated',
        name: 'Incapacitated',
        color: '#8b6914',
        shortDesc: "Can't take actions or reactions.",
        effects: [
            "Can't take actions or reactions.",
        ],
    },
    {
        id: 'invisible',
        name: 'Invisible',
        color: '#4a9ead',
        shortDesc: 'Impossible to see without magic. Advantage on attacks, attackers have disadvantage.',
        effects: [
            "Impossible to see without the aid of magic or a special sense. Considered heavily obscured for hiding purposes.",
            "Attack rolls against the creature have disadvantage, and the creature's attack rolls have advantage.",
        ],
    },
    {
        id: 'paralyzed',
        name: 'Paralyzed',
        color: '#dc143c',
        shortDesc: "Incapacitated. Can't move or speak. Auto-fail STR/DEX saves.",
        effects: [
            "Is incapacitated and can't move or speak.",
            'Automatically fails Strength and Dexterity saving throws.',
            'Attack rolls against the creature have advantage.',
            'Any attack that hits is a critical hit if the attacker is within 5 feet.',
        ],
    },
    {
        id: 'petrified',
        name: 'Petrified',
        color: '#dc143c',
        shortDesc: 'Transformed to stone. Incapacitated, unaware. Resistance to all damage.',
        effects: [
            'Transformed along with nonmagical objects into a solid inanimate substance (usually stone).',
            'Weight increases by a factor of ten and ceases aging.',
            "Is incapacitated, can't move or speak, and is unaware of its surroundings.",
            'Attack rolls against the creature have advantage.',
            'Automatically fails Strength and Dexterity saving throws.',
            'Has resistance to all damage.',
            'Is immune to poison and disease (existing poison/disease is suspended).',
        ],
    },
    {
        id: 'poisoned',
        name: 'Poisoned',
        color: '#2d7d46',
        shortDesc: 'Disadvantage on attack rolls and ability checks.',
        effects: [
            'Has disadvantage on attack rolls and ability checks.',
        ],
    },
    {
        id: 'prone',
        name: 'Prone',
        color: '#d4a017',
        shortDesc: 'Can only crawl. Disadvantage on attacks. Melee attacks have advantage against.',
        effects: [
            'Can only crawl unless it stands up (costs half movement).',
            'Has disadvantage on attack rolls.',
            'Attacks within 5 feet have advantage; attacks from further have disadvantage.',
        ],
    },
    {
        id: 'restrained',
        name: 'Restrained',
        color: '#d4a017',
        shortDesc: 'Speed 0. Disadvantage on attacks and DEX saves. Attacks have advantage against.',
        effects: [
            "Speed becomes 0 and can't benefit from any bonus to speed.",
            'Attack rolls against the creature have advantage.',
            "The creature's attack rolls have disadvantage.",
            'Has disadvantage on Dexterity saving throws.',
        ],
    },
    {
        id: 'stunned',
        name: 'Stunned',
        color: '#dc143c',
        shortDesc: "Incapacitated. Can't move. Can speak only falteringly. Auto-fail STR/DEX saves.",
        effects: [
            "Is incapacitated, can't move, and can speak only falteringly.",
            'Automatically fails Strength and Dexterity saving throws.',
            'Attack rolls against the creature have advantage.',
        ],
    },
    {
        id: 'unconscious',
        name: 'Unconscious',
        color: '#dc143c',
        shortDesc: "Incapacitated. Can't move or speak. Unaware. Drops what it's holding. Falls prone.",
        effects: [
            "Is incapacitated, can't move or speak, and is unaware of its surroundings.",
            "Drops whatever it's holding and falls prone.",
            'Automatically fails Strength and Dexterity saving throws.',
            'Attack rolls against the creature have advantage.',
            'Any attack that hits is a critical hit if the attacker is within 5 feet.',
        ],
    },
    {
        id: 'exhaustion',
        name: 'Exhaustion',
        color: '#8b6914',
        shortDesc: 'Cumulative levels 1-6 with increasingly severe penalties.',
        effects: [
            'Level 1: Disadvantage on ability checks.',
            'Level 2: Speed halved.',
            'Level 3: Disadvantage on attack rolls and saving throws.',
            'Level 4: Hit point maximum halved.',
            'Level 5: Speed reduced to 0.',
            'Level 6: Death.',
            'Finishing a long rest reduces exhaustion by 1 level (if food/drink available).',
        ],
    },
    {
        id: 'concentration',
        name: 'Concentration',
        color: '#2d7d46',
        shortDesc: 'Maintaining a spell. Broken by damage (CON save), casting another, or incapacitation.',
        effects: [
            'Taking damage requires a Constitution saving throw (DC = half damage or 10, whichever is higher).',
            'Casting another concentration spell ends the current one.',
            'Being incapacitated or killed ends concentration.',
            'DM may rule environmental phenomena require a DC 10 Constitution save.',
        ],
    },
];
