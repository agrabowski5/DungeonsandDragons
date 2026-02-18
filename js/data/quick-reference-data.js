import { CONDITIONS } from './conditions.js';

export const QUICK_REFERENCE_CATEGORIES = [
    {
        id: 'conditions',
        title: 'Conditions',
        cards: CONDITIONS.map(c => ({
            id: `cond-${c.id}`,
            title: c.name,
            summary: c.shortDesc,
            body: [{ type: 'list', items: c.effects }],
            color: c.color,
        })),
    },
    {
        id: 'actions',
        title: 'Actions in Combat',
        cards: [
            { id: 'act-attack', title: 'Attack', summary: 'Make one melee or ranged attack (or more with Extra Attack).', body: [{ type: 'paragraph', text: 'Make one melee or ranged attack. Some features let you make multiple attacks with this action.' }] },
            { id: 'act-cast', title: 'Cast a Spell', summary: 'Cast a spell with a casting time of 1 action.', body: [{ type: 'paragraph', text: 'Cast one spell with a casting time of 1 action. See the spell description for specific rules.' }] },
            { id: 'act-dash', title: 'Dash', summary: 'Gain extra movement equal to your speed.', body: [{ type: 'paragraph', text: 'You gain extra movement for the current turn. The increase equals your speed, after applying any modifiers.' }] },
            { id: 'act-disengage', title: 'Disengage', summary: 'Your movement doesn\'t provoke opportunity attacks.', body: [{ type: 'paragraph', text: 'Your movement doesn\'t provoke opportunity attacks for the rest of the turn.' }] },
            { id: 'act-dodge', title: 'Dodge', summary: 'Attacks against you have disadvantage; DEX saves have advantage.', body: [{ type: 'paragraph', text: 'Until the start of your next turn, attack rolls against you have disadvantage (if you can see the attacker), and you make Dexterity saving throws with advantage. You lose this benefit if you are incapacitated or your speed drops to 0.' }] },
            { id: 'act-help', title: 'Help', summary: 'Give an ally advantage on their next ability check or attack.', body: [{ type: 'paragraph', text: 'The creature you aid gains advantage on the next ability check or attack roll it makes before the start of your next turn. The target must be within 5 feet of you for combat help.' }] },
            { id: 'act-hide', title: 'Hide', summary: 'Make a Dexterity (Stealth) check to become hidden.', body: [{ type: 'paragraph', text: 'Make a Dexterity (Stealth) check. Until you are discovered or stop hiding, that check is contested by the Wisdom (Perception) of any creature that searches for you. You can\'t hide from a creature that can see you clearly.' }] },
            { id: 'act-ready', title: 'Ready', summary: 'Prepare a reaction to a specific trigger.', body: [{ type: 'paragraph', text: 'Choose a perceivable trigger and an action. When the trigger occurs, you can use your reaction to perform the action. If you ready a spell, you must concentrate on it and use your reaction to cast it.' }] },
            { id: 'act-search', title: 'Search', summary: 'Devote attention to finding something.', body: [{ type: 'paragraph', text: 'Make a Wisdom (Perception) or Intelligence (Investigation) check to find something.' }] },
            { id: 'act-use', title: 'Use an Object', summary: 'Interact with a second object or use a special object.', body: [{ type: 'paragraph', text: 'You normally interact with one object for free during your turn. This action lets you interact with a second object, or use an object that requires an action (potion, magic item, etc.).' }] },
        ],
    },
    {
        id: 'cover',
        title: 'Cover Rules',
        cards: [
            { id: 'cover-half', title: 'Half Cover', summary: '+2 bonus to AC and Dexterity saving throws.', body: [{ type: 'paragraph', text: 'A target has half cover if an obstacle blocks at least half of its body. The obstacle might be a low wall, a large piece of furniture, a narrow tree trunk, or a creature. A target with half cover has a +2 bonus to AC and Dexterity saving throws.' }], color: '#4a90d9' },
            { id: 'cover-three', title: 'Three-Quarters Cover', summary: '+5 bonus to AC and Dexterity saving throws.', body: [{ type: 'paragraph', text: 'A target has three-quarters cover if about three-quarters of it is covered by an obstacle. The obstacle might be a portcullis, an arrow slit, or a thick tree trunk. A target with three-quarters cover has a +5 bonus to AC and Dexterity saving throws.' }], color: '#d4a017' },
            { id: 'cover-full', title: 'Full Cover', summary: 'Can\'t be targeted directly by attacks or spells.', body: [{ type: 'paragraph', text: 'A target with total cover can\'t be targeted directly by an attack or a spell, although some spells can reach such a target by including it in an area of effect. A target has total cover if it is completely concealed by an obstacle.' }], color: '#dc143c' },
        ],
    },
    {
        id: 'dc',
        title: 'Difficulty Classes',
        cards: [
            {
                id: 'dc-table', title: 'Typical DCs', summary: 'Standard difficulty benchmarks for ability checks.',
                body: [{
                    type: 'table',
                    headers: ['DC', 'Difficulty'],
                    rows: [
                        ['5', 'Very Easy'],
                        ['10', 'Easy'],
                        ['15', 'Medium'],
                        ['20', 'Hard'],
                        ['25', 'Very Hard'],
                        ['30', 'Nearly Impossible'],
                    ],
                }],
            },
        ],
    },
    {
        id: 'damage-types',
        title: 'Damage Types',
        cards: [
            { id: 'dmg-bludgeoning', title: 'Bludgeoning', summary: 'Blunt force attacks — hammers, falling, constriction.' },
            { id: 'dmg-piercing', title: 'Piercing', summary: 'Puncturing and impaling — spears, bites, arrows.' },
            { id: 'dmg-slashing', title: 'Slashing', summary: 'Cutting attacks — swords, axes, claws.' },
            { id: 'dmg-fire', title: 'Fire', summary: 'Red dragons and fireballs. The element of scorching heat.', color: '#ef4444' },
            { id: 'dmg-cold', title: 'Cold', summary: 'Infernal chill — ice storms, white dragon breath.', color: '#60a5fa' },
            { id: 'dmg-lightning', title: 'Lightning', summary: 'Electrical energy — lightning bolt, blue dragon breath.', color: '#a78bfa' },
            { id: 'dmg-thunder', title: 'Thunder', summary: 'Concussive burst of sound — shatter, thunderwave.' },
            { id: 'dmg-poison', title: 'Poison', summary: 'Venomous stings, toxic gas, noxious substances.', color: '#22c55e' },
            { id: 'dmg-acid', title: 'Acid', summary: 'Corrosive spray — black dragon breath, acid splash.', color: '#facc15' },
            { id: 'dmg-necrotic', title: 'Necrotic', summary: 'Withering life force — inflict wounds, chill touch.', color: '#4ade80' },
            { id: 'dmg-radiant', title: 'Radiant', summary: 'Divine and searing light — guiding bolt, sacred flame.', color: '#fbbf24' },
            { id: 'dmg-force', title: 'Force', summary: 'Pure magical energy — magic missile, eldritch blast.', color: '#c084fc' },
            { id: 'dmg-psychic', title: 'Psychic', summary: 'Mental damage — mind blast, vicious mockery.', color: '#f472b6' },
        ],
    },
    {
        id: 'rest',
        title: 'Rest Rules',
        cards: [
            {
                id: 'rest-short', title: 'Short Rest', summary: 'At least 1 hour of downtime.',
                body: [
                    { type: 'list', items: [
                        'Duration: At least 1 hour.',
                        'You can spend one or more Hit Dice (up to your maximum) to heal.',
                        'Roll each Hit Die, add your Constitution modifier — regain that many HP.',
                        'Some class features recharge on a short rest (e.g., Fighter\'s Action Surge, Warlock spell slots).',
                    ]},
                ],
            },
            {
                id: 'rest-long', title: 'Long Rest', summary: 'At least 8 hours; regain HP and resources.',
                body: [
                    { type: 'list', items: [
                        'Duration: At least 8 hours (sleep for at least 6; light activity for up to 2).',
                        'You regain all lost hit points.',
                        'You regain spent Hit Dice up to half your total (minimum of one die).',
                        'You can\'t benefit from more than one long rest in a 24-hour period.',
                        'Most class features and spell slots recharge on a long rest.',
                        'Exhaustion is reduced by 1 level (with food and drink).',
                    ]},
                ],
            },
        ],
    },
    {
        id: 'abilities',
        title: 'Ability Scores',
        cards: [
            { id: 'ab-str', title: 'Strength (STR)', summary: 'Physical power: melee attacks, carrying, jumping, climbing.', body: [{ type: 'list', items: ['Athletics checks', 'Melee attack and damage rolls (default)', 'Carrying capacity = STR \u00d7 15 lb', 'Encumbrance, push, drag, lift'] }], color: '#ef4444' },
            { id: 'ab-dex', title: 'Dexterity (DEX)', summary: 'Agility and reflexes: AC, initiative, ranged/finesse attacks.', body: [{ type: 'list', items: ['Acrobatics, Sleight of Hand, Stealth', 'Initiative rolls', 'AC (when wearing light/no armor)', 'Ranged and finesse weapon attacks'] }], color: '#22c55e' },
            { id: 'ab-con', title: 'Constitution (CON)', summary: 'Endurance and vitality: HP, concentration, stamina.', body: [{ type: 'list', items: ['Hit point maximum (CON mod \u00d7 level)', 'Concentration saving throws', 'No associated skills', 'Resisting poison, disease, exhaustion'] }], color: '#f97316' },
            { id: 'ab-int', title: 'Intelligence (INT)', summary: 'Memory and reasoning: Arcana, History, Investigation.', body: [{ type: 'list', items: ['Arcana, History, Investigation, Nature, Religion', 'Wizard spellcasting ability', 'Recalls lore and deduces clues'] }], color: '#60a5fa' },
            { id: 'ab-wis', title: 'Wisdom (WIS)', summary: 'Perception and intuition: awareness, Insight, Medicine.', body: [{ type: 'list', items: ['Animal Handling, Insight, Medicine, Perception, Survival', 'Cleric, Druid, Ranger spellcasting ability', 'Passive Perception = 10 + WIS mod'] }], color: '#a78bfa' },
            { id: 'ab-cha', title: 'Charisma (CHA)', summary: 'Force of personality: social, Bard/Sorcerer/Warlock/Paladin spellcasting.', body: [{ type: 'list', items: ['Deception, Intimidation, Performance, Persuasion', 'Bard, Paladin, Sorcerer, Warlock spellcasting ability', 'Social interactions and leadership'] }], color: '#f472b6' },
        ],
    },
    {
        id: 'movement',
        title: 'Movement & Travel',
        cards: [
            {
                id: 'mv-pace', title: 'Travel Pace', summary: 'Speed and distance for overland travel.',
                body: [{
                    type: 'table',
                    headers: ['Pace', 'Minute', 'Hour', 'Day', 'Effect'],
                    rows: [
                        ['Fast', '400 ft', '4 miles', '30 miles', '-5 passive Perception'],
                        ['Normal', '300 ft', '3 miles', '24 miles', '—'],
                        ['Slow', '200 ft', '2 miles', '18 miles', 'Able to use Stealth'],
                    ],
                }],
            },
            {
                id: 'mv-difficult', title: 'Difficult Terrain', summary: 'Every foot costs 1 extra foot of movement.',
                body: [{ type: 'paragraph', text: 'Moving in difficult terrain costs 1 extra foot per foot of movement. Applies to dense forests, deep swamps, rubble-strewn ruins, steep mountains, ice-covered ground, etc.' }],
            },
            {
                id: 'mv-special', title: 'Special Movement', summary: 'Climbing, swimming, crawling, jumping.',
                body: [{ type: 'list', items: [
                    'Climbing/swimming: each foot costs 1 extra foot (2 extra in difficult terrain) unless you have a climb/swim speed.',
                    'Crawling: each foot costs 1 extra foot.',
                    'Long jump: up to STR score in feet (running) or half (standing).',
                    'High jump: 3 + STR modifier feet (running) or half (standing).',
                ]}],
            },
        ],
    },
];
