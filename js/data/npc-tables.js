// ─── NPC Generation Tables ──────────────────────────────────────────
// Comprehensive data for random NPC generation across all D&D 5e races.

export const NPC_RACES = [
    'Human', 'Elf', 'Dwarf', 'Halfling', 'Half-Elf',
    'Half-Orc', 'Gnome', 'Tiefling', 'Dragonborn', 'Goliath'
];

// Keep backward-compat alias
export const RACES = NPC_RACES;

export const NPC_CLASSES = [
    'Fighter', 'Wizard', 'Rogue', 'Cleric', 'Ranger',
    'Bard', 'Paladin', 'Warlock', 'Sorcerer', 'Druid',
    'Barbarian', 'Monk', 'Commoner', 'Noble', 'Guard',
    'Merchant', 'Scholar', 'Artisan'
];

export const GENDERS = ['Male', 'Female'];

export const NPC_ALIGNMENTS = [
    'Lawful Good', 'Neutral Good', 'Chaotic Good',
    'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

// ─── Names ──────────────────────────────────────────────────────────
// At least 20 first names per gender per race, 15+ surnames per race.

export const NPC_FIRST_NAMES = {
    Human: {
        male: [
            'Aldric', 'Bram', 'Cedric', 'Dorian', 'Edmund',
            'Farlan', 'Gareth', 'Hadrian', 'Isen', 'Jorik',
            'Kael', 'Lothar', 'Marcus', 'Nolan', 'Osric',
            'Percival', 'Roland', 'Stefan', 'Theron', 'Varis',
            'Wulfric', 'Brennan'
        ],
        female: [
            'Alara', 'Brenna', 'Celia', 'Darya', 'Elena',
            'Fiona', 'Gwen', 'Helena', 'Isolde', 'Joanna',
            'Katrin', 'Lyra', 'Mirela', 'Nessa', 'Ophelia',
            'Petra', 'Rowena', 'Saria', 'Thalia', 'Vivian',
            'Wenora', 'Ysmay'
        ]
    },
    Elf: {
        male: [
            'Aelar', 'Berrian', 'Carric', 'Dayereth', 'Erevan',
            'Fivin', 'Galinndan', 'Hadarai', 'Immeral', 'Jorildyn',
            'Kevran', 'Laucian', 'Mindartis', 'Naeris', 'Orym',
            'Paelias', 'Quarion', 'Riardon', 'Soveliss', 'Thamior',
            'Varis', 'Aelindros'
        ],
        female: [
            'Adrie', 'Birel', 'Caelynn', 'Drusilia', 'Enna',
            'Felosial', 'Galanodel', 'Holimion', 'Ielenia', 'Jelenneth',
            'Keyleth', 'Lia', 'Meriele', 'Naivara', 'Quelenna',
            'Sariel', 'Shanairra', 'Thia', 'Valanthe', 'Xanaphia',
            'Aelindra', 'Yralissa'
        ]
    },
    Dwarf: {
        male: [
            'Adrik', 'Baern', 'Connerad', 'Dain', 'Eberk',
            'Flint', 'Gardain', 'Harbek', 'Ilian', 'Jord',
            'Kildrak', 'Morgran', 'Nordak', 'Orsik', 'Rangrim',
            'Rurik', 'Storn', 'Thoradin', 'Ulfgar', 'Vondal',
            'Dolgrin', 'Brumgar'
        ],
        female: [
            'Amber', 'Bardryn', 'Dagnal', 'Eldeth', 'Finellen',
            'Gunnloda', 'Helja', 'Ilde', 'Kathra', 'Liftrasa',
            'Mardred', 'Nurit', 'Orla', 'Riswynn', 'Sannl',
            'Torbera', 'Urshar', 'Vistra', 'Wrenli', 'Yurda',
            'Brylda', 'Dallera'
        ]
    },
    Halfling: {
        male: [
            'Alton', 'Beau', 'Cade', 'Dunstan', 'Eldon',
            'Finnan', 'Garret', 'Hob', 'Iden', 'Jasper',
            'Kellan', 'Lyle', 'Merric', 'Nikolas', 'Osborn',
            'Perrin', 'Reed', 'Roscoe', 'Sam', 'Tobin',
            'Wellby', 'Corrin'
        ],
        female: [
            'Andry', 'Bree', 'Callie', 'Delia', 'Ellyn',
            'Faya', 'Gilda', 'Hildy', 'Jillian', 'Kithri',
            'Lavinia', 'Maegan', 'Nedda', 'Ophira', 'Paela',
            'Rosalind', 'Seraphina', 'Tilly', 'Vani', 'Wren',
            'Lidda', 'Portia'
        ]
    },
    'Half-Elf': {
        male: [
            'Aedan', 'Beren', 'Caladrel', 'Draven', 'Elowen',
            'Faelan', 'Gavin', 'Haldor', 'Ivor', 'Jaren',
            'Kiran', 'Lorcan', 'Marek', 'Niall', 'Owen',
            'Phelan', 'Quinn', 'Ronan', 'Sylas', 'Taran',
            'Variel', 'Daeran'
        ],
        female: [
            'Aeris', 'Brielle', 'Cerys', 'Dahlia', 'Elara',
            'Freya', 'Gwyneth', 'Halia', 'Iris', 'Jessamine',
            'Kaira', 'Linara', 'Maren', 'Niamh', 'Oriana',
            'Penelope', 'Rhiannon', 'Sylvaine', 'Tamsin', 'Ursa',
            'Veyla', 'Aravae'
        ]
    },
    'Half-Orc': {
        male: [
            'Argash', 'Brug', 'Crag', 'Dench', 'Erg',
            'Feng', 'Grag', 'Henk', 'Imsh', 'Jorek',
            'Krusk', 'Lorg', 'Mhurren', 'Narg', 'Oshgir',
            'Prug', 'Ront', 'Shump', 'Thokk', 'Urzul',
            'Varg', 'Grukk'
        ],
        female: [
            'Arha', 'Baggi', 'Catha', 'Droga', 'Emen',
            'Farga', 'Gresha', 'Huga', 'Ilda', 'Jura',
            'Kansif', 'Lagazi', 'Murook', 'Neega', 'Ownka',
            'Pukha', 'Roga', 'Shava', 'Tahra', 'Vola',
            'Yevelda', 'Zurga'
        ]
    },
    Gnome: {
        male: [
            'Alston', 'Boddynock', 'Colbarn', 'Dimble', 'Eldon',
            'Fonkin', 'Gerbo', 'Himo', 'Igan', 'Jebeddo',
            'Kelgorn', 'Lugdor', 'Murnig', 'Namfoodle', 'Orryn',
            'Pog', 'Qualen', 'Roondar', 'Sindri', 'Warryn',
            'Zook', 'Fibblestib'
        ],
        female: [
            'Abalaba', 'Bimpnottin', 'Caramip', 'Donella', 'Ellywick',
            'Fenthick', 'Gimble', 'Heddwyn', 'Iri', 'Jillia',
            'Kelris', 'Lilli', 'Mardnab', 'Nissa', 'Orla',
            'Panana', 'Quilla', 'Roywyn', 'Shamil', 'Tana',
            'Wrena', 'Zanna'
        ]
    },
    Tiefling: {
        male: [
            'Akmenos', 'Baal', 'Castiel', 'Damakos', 'Ekemon',
            'Forneus', 'Gadreel', 'Hadriel', 'Iados', 'Kairon',
            'Leucis', 'Melech', 'Nethys', 'Oriax', 'Pelaios',
            'Raziel', 'Sariel', 'Therai', 'Valafar', 'Zariel',
            'Mordai', 'Amnon'
        ],
        female: [
            'Akta', 'Bryseis', 'Callista', 'Damaia', 'Ea',
            'Felixia', 'Gwendolyn', 'Haelith', 'Irethia', 'Jezebeth',
            'Kallista', 'Lerissa', 'Makaria', 'Nemeia', 'Orianna',
            'Phelaia', 'Rieta', 'Seraphyx', 'Tava', 'Velara',
            'Criella', 'Nyx'
        ]
    },
    Dragonborn: {
        male: [
            'Arjhan', 'Balasar', 'Bharash', 'Donaar', 'Ghesh',
            'Heskan', 'Ildrex', 'Jaykel', 'Kriv', 'Lorzan',
            'Medrash', 'Nadarr', 'Pandjed', 'Quarethon', 'Rhogar',
            'Shamash', 'Tarhun', 'Torinn', 'Verthisathurgiesh', 'Wulren',
            'Surina', 'Gorazh'
        ],
        female: [
            'Akra', 'Biri', 'Calabeth', 'Daar', 'Erliza',
            'Farideh', 'Gor', 'Harann', 'Ixen', 'Jheri',
            'Kava', 'Liora', 'Mishann', 'Nala', 'Ophinshtalajir',
            'Perra', 'Raiann', 'Sora', 'Thava', 'Uadjit',
            'Vylara', 'Zofila'
        ]
    },
    Goliath: {
        male: [
            'Aukan', 'Eglath', 'Gae-Al', 'Gauthak', 'Ilikan',
            'Keothi', 'Kuori', 'Lo-Kag', 'Manneo', 'Maveith',
            'Nalla', 'Orilo', 'Paavu', 'Pethani', 'Thalai',
            'Thotham', 'Uthal', 'Vaunea', 'Vimak', 'Zakull',
            'Kavaki', 'Dulgrim'
        ],
        female: [
            'Agara', 'Beatha', 'Dorenna', 'Gaanath', 'Gathi',
            'Ilatha', 'Katho-Olavi', 'Kuori', 'Manneo', 'Nalla',
            'Orilo', 'Paavu', 'Pethani', 'Thalai', 'Uthai',
            'Vaunea', 'Wetha', 'Zugath', 'Kalevi', 'Menathe',
            'Elania', 'Thulaga'
        ]
    }
};

export const NPC_LAST_NAMES = {
    Human: [
        'Ashford', 'Blackwood', 'Crowley', 'Dunmore', 'Edgeworth',
        'Fairfax', 'Greystone', 'Hawkwood', 'Ironside', 'Jasper',
        'Kingsley', 'Langford', 'Morwen', 'Northcott', 'Oakheart',
        'Pembroke', 'Ravencrest', 'Stormwind', 'Thornwall', 'Whitmore'
    ],
    Elf: [
        'Amakiir', 'Brightblade', 'Caerdonel', 'Dalanthan', 'Eirenion',
        'Galanodel', 'Holimion', 'Ilphelkiir', 'Liadon', 'Meliamne',
        'Nailo', 'Oakenheel', 'Phiarlan', 'Siannodel', 'Starweaver',
        'Thalassan', 'Ulathien', 'Windwhisper', 'Xiloscient', 'Yaeldrin'
    ],
    Dwarf: [
        'Battlehammer', 'Brawnanvil', 'Coppervein', 'Deepforge', 'Earthshaker',
        'Fireforge', 'Goldhand', 'Hammerfist', 'Ironfist', 'Jundeth',
        'Kettlegard', 'Loderr', 'Mithrilaxe', 'Narlagh', 'Onyxheart',
        'Platemail', 'Rumnaheim', 'Stoneshield', 'Torunn', 'Ungart'
    ],
    Halfling: [
        'Appleblossom', 'Brushgather', 'Cherrycheek', 'Dewfoot', 'Elderberry',
        'Fernwhistle', 'Goodbarrel', 'Highhill', 'Ivywood', 'Jambottom',
        'Kettlebrook', 'Leagallow', 'Mossbottom', 'Nimblefingers', 'Overhill',
        'Pebblethrow', 'Quickstep', 'Rumblefoot', 'Stoutbridge', 'Tealeaf'
    ],
    'Half-Elf': [
        'Autumnvale', 'Brightmeadow', 'Cyrendale', 'Dawnstrider', 'Evenwood',
        'Fallowmere', 'Greenveil', 'Halfmoon', 'Ivywood', 'Jasperleaf',
        'Kingswood', 'Larkspur', 'Moonfire', 'Nightbreeze', 'Oakmere',
        'Pinecrest', 'Ravensong', 'Silverbrook', 'Thornrose', 'Willowmist'
    ],
    'Half-Orc': [
        'Ashbringer', 'Bonecrusher', 'Cleftjaw', 'Doomhammer', 'Earthsplitter',
        'Fleshrender', 'Goretusk', 'Hellscream', 'Ironfang', 'Jawbreaker',
        'Knifethrower', 'Longtooth', 'Mauler', 'Nightstalker', 'Orcfist',
        'Pitfighter', 'Rageclaw', 'Skullsplitter', 'Thunderfist', 'Warcry'
    ],
    Gnome: [
        'Bafflestone', 'Beren', 'Cogsworth', 'Daergel', 'Ermintrude',
        'Fizzlebang', 'Garrick', 'Humperdink', 'Ironquill', 'Jingletink',
        'Kneecap', 'Leffery', 'Murnig', 'Nackle', 'Ookook',
        'Pindlewick', 'Quinkle', 'Raulnor', 'Scheppen', 'Turen'
    ],
    Tiefling: [
        'Ashveil', 'Brimstone', 'Cinderfall', 'Darkfire', 'Emberheart',
        'Fellthorn', 'Gloomweaver', 'Hellspark', 'Infernax', 'Jadewing',
        'Karaxis', 'Lightbane', 'Mournveil', 'Nightflame', 'Obsidian',
        'Pyrebrand', 'Ravenscroft', 'Shadowmire', 'Thornblood', 'Voidwalker'
    ],
    Dragonborn: [
        'Argenthrixus', 'Baharoosh', 'Clethtinthiallor', 'Daardendrian', 'Esstyrlynn',
        'Fenkenkabradon', 'Grigoritha', 'Hammerwing', 'Iymrith', 'Jaraskh',
        'Kerrhylon', 'Linxakasendalor', 'Myastan', 'Nemmonis', 'Ophinshtalajir',
        'Prexijandilin', 'Raghthroknaar', 'Shestendeliath', 'Turnuroth', 'Verthisathurgiesh'
    ],
    Goliath: [
        'Aga-Thunukalathi', 'Bearkiller', 'Dawncaller', 'Elanithino',
        'Fearless', 'Gathakanathi', 'Highpeak', 'Icevein',
        'Keenstone', 'Lonehunter', 'Mastbreaker', 'Nightwalker',
        'Ogolakanu', 'Peakclimber', 'Rootbreaker', 'Skywatcher',
        'Steadyhand', 'Stormborn', 'Thunderfist', 'Windstrider'
    ]
};

// Backward-compat alias: combined NAMES object with male/female/surnames per race
export const NAMES = {};
for (const race of NPC_RACES) {
    NAMES[race] = {
        male: NPC_FIRST_NAMES[race]?.male || [],
        female: NPC_FIRST_NAMES[race]?.female || [],
        surnames: NPC_LAST_NAMES[race] || []
    };
}

// ─── Age Categories ─────────────────────────────────────────────────

export const AGE_RANGES = {
    Human:      { young: [16, 25],  adult: [26, 50],  middle: [51, 65],  old: [66, 90] },
    Elf:        { young: [20, 100], adult: [101, 400], middle: [401, 600], old: [601, 750] },
    Dwarf:      { young: [18, 50],  adult: [51, 200],  middle: [201, 300], old: [301, 400] },
    Halfling:   { young: [16, 30],  adult: [31, 80],   middle: [81, 120],  old: [121, 150] },
    'Half-Elf': { young: [16, 30],  adult: [31, 80],   middle: [81, 140],  old: [141, 180] },
    'Half-Orc': { young: [12, 20],  adult: [21, 40],   middle: [41, 55],   old: [56, 75] },
    Tiefling:   { young: [16, 25],  adult: [26, 50],   middle: [51, 70],   old: [71, 100] },
    Gnome:      { young: [18, 50],  adult: [51, 200],  middle: [201, 350], old: [351, 500] },
    Dragonborn: { young: [5, 15],   adult: [16, 40],   middle: [41, 60],   old: [61, 80] },
    Goliath:    { young: [12, 20],  adult: [21, 45],   middle: [46, 65],   old: [66, 80] }
};

// ─── Class Data ─────────────────────────────────────────────────────

export const CLASS_HIT_DICE = {
    Fighter: 10, Wizard: 6, Rogue: 8, Cleric: 8, Ranger: 10,
    Bard: 8, Paladin: 10, Warlock: 8, Sorcerer: 6, Druid: 8,
    Barbarian: 12, Monk: 8, Commoner: 6, Noble: 8, Guard: 10,
    Merchant: 6, Scholar: 6, Artisan: 8
};

export const CLASS_BASE_AC = {
    Fighter: 16, Wizard: 12, Rogue: 13, Cleric: 16, Ranger: 14,
    Bard: 12, Paladin: 18, Warlock: 12, Sorcerer: 12, Druid: 13,
    Barbarian: 13, Monk: 14, Commoner: 10, Noble: 11, Guard: 14,
    Merchant: 10, Scholar: 10, Artisan: 11
};

// ─── Occupations ────────────────────────────────────────────────────

export const NPC_OCCUPATIONS = [
    'Blacksmith', 'Innkeeper', 'Guard', 'Merchant', 'Scholar',
    'Farmer', 'Fisher', 'Alchemist', 'Priest', 'Bard',
    'Hunter', 'Sailor', 'Noble', 'Beggar', 'Thief',
    'Herbalist', 'Brewer', 'Baker', 'Carpenter', 'Mason',
    'Miner', 'Woodcutter', 'Weaver', 'Tanner', 'Jeweler',
    'Scribe', 'Librarian', 'Cook', 'Stable Hand', 'Courier',
    'Fortune Teller', 'Gravedigger', 'Bounty Hunter', 'Street Performer',
    'Apothecary', 'Cartographer', 'Clockmaker', 'Tattoo Artist',
    'Smuggler', 'Hermit', 'Tavern Keeper', 'Traveling Merchant',
    'Court Wizard', 'Spy', 'Midwife'
];

export const OCCUPATIONS = [
    { name: 'Blacksmith',       statBias: { str: 2, con: 1 } },
    { name: 'Innkeeper',        statBias: { cha: 2, wis: 1 } },
    { name: 'Guard',            statBias: { str: 1, con: 2 } },
    { name: 'Merchant',         statBias: { cha: 2, int: 1 } },
    { name: 'Scholar',          statBias: { int: 3 } },
    { name: 'Farmer',           statBias: { con: 2, str: 1 } },
    { name: 'Fisher',           statBias: { wis: 1, dex: 1, con: 1 } },
    { name: 'Alchemist',        statBias: { int: 2, wis: 1 } },
    { name: 'Priest',           statBias: { wis: 2, cha: 1 } },
    { name: 'Bard',             statBias: { cha: 3 } },
    { name: 'Hunter',           statBias: { dex: 2, wis: 1 } },
    { name: 'Sailor',           statBias: { str: 1, con: 1, dex: 1 } },
    { name: 'Noble',            statBias: { cha: 2, int: 1 } },
    { name: 'Beggar',           statBias: { wis: 1, con: 1, dex: 1 } },
    { name: 'Thief',            statBias: { dex: 3 } },
    { name: 'Herbalist',        statBias: { wis: 2, int: 1 } },
    { name: 'Brewer',           statBias: { con: 2, wis: 1 } },
    { name: 'Baker',            statBias: { con: 1, wis: 1, cha: 1 } },
    { name: 'Carpenter',        statBias: { str: 1, dex: 1, int: 1 } },
    { name: 'Mason',            statBias: { str: 2, con: 1 } },
    { name: 'Miner',            statBias: { str: 2, con: 1 } },
    { name: 'Woodcutter',       statBias: { str: 2, con: 1 } },
    { name: 'Weaver',           statBias: { dex: 2, int: 1 } },
    { name: 'Tanner',           statBias: { con: 2, str: 1 } },
    { name: 'Jeweler',          statBias: { dex: 2, int: 1 } },
    { name: 'Scribe',           statBias: { int: 2, dex: 1 } },
    { name: 'Librarian',        statBias: { int: 3 } },
    { name: 'Cook',             statBias: { wis: 1, con: 1, cha: 1 } },
    { name: 'Stable Hand',      statBias: { str: 1, wis: 1, con: 1 } },
    { name: 'Courier',          statBias: { dex: 2, con: 1 } },
    { name: 'Fortune Teller',   statBias: { cha: 2, wis: 1 } },
    { name: 'Gravedigger',      statBias: { str: 1, con: 2 } },
    { name: 'Bounty Hunter',    statBias: { str: 1, dex: 1, wis: 1 } },
    { name: 'Street Performer', statBias: { cha: 2, dex: 1 } },
    { name: 'Apothecary',       statBias: { int: 2, wis: 1 } },
    { name: 'Cartographer',     statBias: { int: 2, wis: 1 } },
    { name: 'Clockmaker',       statBias: { int: 2, dex: 1 } },
    { name: 'Tattoo Artist',    statBias: { dex: 2, cha: 1 } },
    { name: 'Smuggler',         statBias: { dex: 1, cha: 1, wis: 1 } },
    { name: 'Hermit',           statBias: { wis: 3 } },
    { name: 'Tavern Keeper',    statBias: { cha: 2, con: 1 } },
    { name: 'Traveling Merchant', statBias: { cha: 2, wis: 1 } },
    { name: 'Court Wizard',     statBias: { int: 3 } },
    { name: 'Spy',              statBias: { dex: 2, cha: 1 } },
    { name: 'Midwife',          statBias: { wis: 2, cha: 1 } }
];

// ─── Personality Traits ─────────────────────────────────────────────

export const NPC_PERSONALITY_TRAITS = [
    'Brave and headstrong',
    'Cautious to a fault',
    'Quick-witted and sarcastic',
    'Gentle and soft-spoken',
    'Gruff but secretly kindhearted',
    'Endlessly curious about everything',
    'Fiercely loyal to friends and family',
    'Deeply superstitious and wary of omens',
    'Boisterous and loves to be the center of attention',
    'Quiet and observant, speaks only when necessary',
    'Cynical and distrustful of authority',
    'Warm and welcoming to strangers',
    'Competitive and hates to lose',
    'Philosophical and always asking deep questions',
    'Impatient and always in a hurry',
    'Melancholic and prone to brooding',
    'Cheerful and optimistic no matter the circumstances',
    'Stoic and emotionally reserved',
    'Dramatic and prone to exaggeration',
    'Methodical and obsessed with organization',
    'Absent-minded and easily distracted',
    'Protective and parental toward everyone',
    'Mischievous and loves practical jokes',
    'Honorable to the point of inflexibility',
    'Charming and effortlessly charismatic',
    'Paranoid and constantly looking over their shoulder',
    'Humble and deflects all praise',
    'Arrogant and convinced of their own superiority',
    'Nostalgic and constantly reminiscing about the past',
    'Blunt and incapable of sugarcoating the truth',
    'Shy and uncomfortable in large groups'
];

export const PERSONALITY_TRAITS = [
    'I always have a plan for what to do when things go wrong.',
    'I am incredibly slow to trust. Those who seem the fairest often have the most to hide.',
    'I fall in and out of love easily, and am always pursuing someone.',
    'I have a crude sense of humor that others find inappropriate.',
    'The best way to get me to do something is to tell me I cannot do it.',
    'I pocket anything I see that might have some value.',
    'I bluntly say what others are hinting at or hiding.',
    'I begin or end my day with small traditional rituals that are unfamiliar to most.',
    'I feel more comfortable around animals than people.',
    'I am horribly, irredeemably awkward in social situations.',
    'I was, in fact, raised by wolves.',
    'I judge people by their actions, not their words.',
    'I am fiercely protective of those I call my friends.',
    'Nothing can shake my optimistic attitude.',
    'I quote sacred texts and proverbs in almost every conversation.',
    'I am always calm, no matter the situation. I never raise my voice or let my emotions control me.',
    'When I set my mind to something, I follow through no matter what gets in my way.',
    'I get bored easily. When am I going to get on with my destiny?',
    'I often get lost in my own thoughts and contemplation, becoming oblivious to my surroundings.',
    'I am easily distracted by the promise of information.',
    'I keep multiple small journals and scribble in them obsessively.',
    'I speak in elaborate metaphors that confuse everyone around me.',
    'I cannot resist a good wager, even when the odds are against me.',
    'I always seem to know a little bit about everything.',
    'I hum or sing quietly to myself whenever I am not in immediate danger.',
    'I try to find the best in everybody and every situation.',
    'I idolize a particular hero of mine and constantly refer to their deeds.',
    'I can stare down a hell hound without flinching.',
    'I never pass up a friendly wager.',
    'I misuse long words in an attempt to sound smarter.'
];

// ─── Ideals ─────────────────────────────────────────────────────────

export const NPC_IDEALS = [
    'Honor above all',
    'Knowledge is power',
    'Freedom for everyone',
    'The strong should protect the weak',
    'Coin is the only true measure of worth',
    'Tradition must be upheld at any cost',
    'Change is the only constant worth embracing',
    'Power should be earned, never given',
    'Nature must be preserved above civilization',
    'Loyalty to friends and family above all else',
    'Justice must be blind and impartial',
    'Beauty and art give life its meaning',
    'Redemption is always possible for those who seek it',
    'Logic and reason should guide all decisions',
    'Faith in something greater than oneself',
    'Independence is the highest virtue',
    'The greater good justifies any sacrifice',
    'Self-improvement is a lifelong duty',
    'Mercy is the mark of true strength',
    'Ambition drives the world forward',
    'Balance in all things leads to harmony'
];

export const IDEALS = [
    'Greater Good. Our lot is to lay down our lives in defense of others.',
    'Tradition. The ancient traditions of worship and sacrifice must be preserved and upheld.',
    'Charity. I always try to help those in need, no matter what the personal cost.',
    'Change. We must help bring about the changes the gods are constantly working in the world.',
    'Power. I hope to one day rise to the top of my faith\'s hierarchy.',
    'Faith. I trust that my deity will guide my actions; I have faith that if I work hard, things will go well.',
    'Independence. I am a free spirit, and no one tells me what to do.',
    'Greed. I will do whatever it takes to become wealthy.',
    'People. I am committed to the people I care about, not to ideals.',
    'Honor. I do not steal from others in the trade.',
    'Freedom. Chains are meant to be broken, as are those who would forge them.',
    'Might. The strongest are meant to rule.',
    'Sincerity. There is no good in pretending to be something I am not.',
    'Nature. The natural world is more important than all the constructs of civilization.',
    'Knowledge. The path to power and self-improvement is through knowledge.',
    'Beauty. What is beautiful points us beyond itself toward what is true.',
    'Logic. Emotions must not cloud our sense of what is right and true.',
    'Fairness. No one should get preferential treatment before the law.',
    'Redemption. There is a spark of good in everyone.',
    'Aspiration. I work hard to be the best there is at my craft.'
];

// ─── Bonds ──────────────────────────────────────────────────────────

export const NPC_BONDS = [
    'Seeking a lost family member',
    'Protecting a sacred relic',
    'Sworn to a mysterious patron',
    'Owes a life debt to a stranger',
    'Guarding a dangerous secret',
    'Bound by an unbreakable oath to a fallen order',
    'Searching for the cure to a loved one\'s illness',
    'Carrying out the last wish of a dying mentor',
    'Trying to rebuild a destroyed homeland',
    'Linked to a prophetic vision they cannot escape',
    'In love with someone they can never be with',
    'Responsible for a child who is not their own',
    'Hunting the creature that killed their family',
    'Devoted to a temple that was desecrated',
    'Carrying a message that must reach its destination at any cost',
    'Bound to protect a bloodline of great importance',
    'Seeking to clear their name of a crime they did not commit',
    'Haunted by the ghost of someone they failed to save',
    'Building a legacy that will outlast their mortal life',
    'Trying to repay a debt that can never truly be settled'
];

export const BONDS = [
    'I would die to recover an ancient relic of my faith that was lost long ago.',
    'I will someday get revenge on the corrupt temple hierarchy who branded me a heretic.',
    'I owe my life to the priest who took me in when my parents died.',
    'Everything I do is for the common people.',
    'I will do anything to protect the temple where I served.',
    'I seek to preserve a sacred text that my enemies consider heretical.',
    'I fleeced the wrong person and must work to ensure they can never take revenge on me.',
    'I owe everything to my mentor, a horrible person who is probably rotting in jail.',
    'Somewhere out there, I have a child who does not know me. I want to find them.',
    'I come from a noble family, and one day I will reclaim my lands and title from those who stole them.',
    'The workshop where I learned my trade is the most important place in the world to me.',
    'I created a great work for someone, and then found them unworthy to receive it.',
    'Someone I loved died because of a mistake I made. That will never happen again.',
    'My town or city is my home, and I will fight to defend it.',
    'I pursue wealth to secure someone else\'s happiness.',
    'An injury to the unspoiled wilderness of my home is an injury to me.',
    'I am the last of my tribe, and it is up to me to ensure their names enter legend.',
    'I protect those who cannot protect themselves.',
    'A powerful person killed someone I love. Someday I will have my revenge.',
    'I have an ancient text that holds terrible secrets that must not fall into the wrong hands.'
];

// ─── Flaws ──────────────────────────────────────────────────────────

export const NPC_FLAWS = [
    'Crippling fear of the dark',
    'Can\'t resist a wager',
    'Trusts no one',
    'Prone to violent outbursts when provoked',
    'Hoards wealth and refuses to share',
    'Addicted to a dangerous substance',
    'Pathological liar who cannot stop embellishing',
    'Deeply envious of those with more power',
    'Cowardly when facing real danger',
    'Obsessed with a grudge from long ago',
    'Incapable of forgiving even minor slights',
    'Recklessly overconfident in their abilities',
    'Easily manipulated by flattery',
    'Cannot resist stealing something from every place they visit',
    'Terrible at keeping secrets',
    'Deeply prejudiced against a particular group',
    'Self-destructive and takes unnecessary risks',
    'Paralyzed by indecision in critical moments',
    'Blindly devoted to a leader who does not deserve it',
    'Haunted by guilt that manifests as nightmares',
    'Refuses to ask for help even when desperately needed'
];

export const FLAWS = [
    'I judge others harshly, and myself even more severely.',
    'I put too much trust in those who wield power within my institution\'s hierarchy.',
    'My piety sometimes leads me to blindly trust those who profess faith in my god.',
    'I am inflexible in my thinking.',
    'I am suspicious of strangers and expect the worst of them.',
    'Once I pick a goal, I become obsessed with it to the detriment of everything else.',
    'I cannot keep a secret to save my life, or anyone else\'s.',
    'I am slow to trust members of other races, towns, and societies.',
    'I would rather eat my armor than admit when I am wrong.',
    'I turn tail and run when things look bad.',
    'I have a weakness for the vices of the city, especially hard drink.',
    'Secretly, I believe that things would be better if I were a tyrant lording over the land.',
    'I am dogmatic in my morals and condemn others who do not match my sense of virtue.',
    'I have trouble keeping my true feelings hidden. My sharp tongue lands me in trouble.',
    'Violence is my answer to almost any challenge.',
    'I cannot resist a pretty face.',
    'I remember every insult I have received and nurse a silent resentment toward anyone who has ever wronged me.',
    'I am convinced of the significance of my destiny, and blind to my shortcomings.',
    'I have a tell that reveals when I am lying.',
    'I follow orders even if I think they are wrong.'
];

// ─── Appearance Descriptors ─────────────────────────────────────────

export const NPC_APPEARANCES = [
    'Tall with striking silver hair',
    'Scarred face with an eye patch',
    'Rotund with a bushy red beard',
    'Willowy and pale with piercing green eyes',
    'Muscular and covered in tribal tattoos',
    'Short and wiry with quick, darting eyes',
    'Weathered skin and calloused hands from years of labor',
    'Strikingly beautiful with an unsettling gaze',
    'Missing several teeth with a crooked smile',
    'Impeccably dressed despite modest means',
    'Wild, unkempt hair and dirt-streaked face',
    'Elegant bearing with high cheekbones and a regal posture',
    'Stocky build with a broken nose that healed crooked',
    'Covered in freckles with warm amber eyes',
    'Gaunt and hollow-cheeked with sunken eyes',
    'Broad-shouldered with a booming laugh',
    'Delicate features with an intricate facial tattoo',
    'Burns along one arm from an old accident',
    'Heterochromatic eyes, one blue and one brown',
    'Walks with a pronounced limp',
    'Always seen carrying a worn leather satchel',
    'Prematurely gray hair that contrasts their youthful face',
    'A jagged scar running from temple to chin',
    'Unusually tall for their race with long limbs',
    'Compact and powerfully built like a coiled spring',
    'Soft-featured with an ever-present look of concern'
];

export const APPEARANCES = [
    'Has a prominent scar running across their left cheek.',
    'Their hair is prematurely streaked with silver, giving them a distinguished look.',
    'One eye is a noticeably different color from the other.',
    'Their hands are covered in old burn marks from years of working near fire.',
    'Tall and gaunt, with sharp features that make them look perpetually hungry.',
    'Short and stocky, built like a barrel with arms like tree trunks.',
    'Has an intricate tattoo of vines and thorns winding up one arm.',
    'Their nose has been broken at least twice and sits slightly crooked.',
    'Keeps their hair meticulously braided in an elaborate style unique to their homeland.',
    'Wears a weathered leather eyepatch over their right eye.',
    'Has a warm, inviting smile that puts everyone at ease.',
    'Their face is dotted with freckles, and they have a gap between their front teeth.',
    'Missing the tip of their left ring finger.',
    'Has unusually pale, almost translucent skin that shows the veins beneath.',
    'Their posture is impeccable, ramrod-straight at all times, as if standing at attention.',
    'Wears several small earrings along one ear, each from a different metal.',
    'Their clothing is always immaculately clean, even after a long day of travel.',
    'Has a deep, resonant voice that seems to carry even when they whisper.',
    'Their eyes are sharp and hawklike, constantly scanning their surroundings.',
    'A large, ornate brooch or clasp holds their cloak, clearly their most valued possession.',
    'Walks with a slight limp, favoring their right leg.',
    'Their fingernails are stained with ink or dye that never quite washes out.',
    'Has a thick, bushy beard that they frequently stroke while thinking.',
    'Wears a perpetual expression of mild amusement, as if they know a joke no one else does.',
    'Covered in faded, barely visible runic markings that seem to shimmer in certain light.'
];

// ─── Motivations ────────────────────────────────────────────────────

export const NPC_MOTIVATIONS = [
    'Seeks revenge for a past wrong',
    'Wants to prove their worth to a disapproving family',
    'Hiding from a dark past',
    'Trying to earn enough gold to retire peacefully',
    'Driven by an insatiable thirst for knowledge',
    'Searching for a legendary lost treasure',
    'Wants to rise to political power',
    'Desperate to break a family curse',
    'Protecting someone who cannot protect themselves',
    'Running from a powerful enemy',
    'Seeking atonement for a terrible deed',
    'Fulfilling a prophecy they do not fully understand',
    'Building a name worthy of being remembered in song',
    'Gathering allies for a coming war',
    'Trying to find their true homeland',
    'Attempting to master a forbidden art',
    'Hoping to restore their family\'s lost honor',
    'Working to overthrow a tyrant in their homeland',
    'Collecting rare ingredients for a powerful ritual',
    'Simply trying to survive in a dangerous world',
    'Chasing rumors of a miracle cure for a rare disease'
];

// ─── Quirks and Mannerisms ──────────────────────────────────────────

export const NPC_QUIRKS = [
    'Always speaks in rhymes',
    'Collects unusual stones',
    'Whistles when nervous',
    'Constantly fidgets with a coin',
    'Refers to themselves in the third person',
    'Speaks in a noticeably lower pitch when lying',
    'Always sniffs food before eating',
    'Taps their foot rhythmically when thinking',
    'Laughs at inappropriate times',
    'Compulsively counts objects in the room',
    'Speaks with exaggerated hand gestures',
    'Chews on a piece of dried leather while thinking',
    'Always positions themselves with their back to a wall',
    'Gives everyone a nickname within minutes of meeting them',
    'Mutters calculations under their breath',
    'Always carries a wilted flower for good luck',
    'Mimics the accent of whoever they are speaking to',
    'Refuses to step on cracks in stone floors',
    'Scratches their nose before saying something important',
    'Has an unusually firm handshake',
    'Constantly adjusts their clothing',
    'Hums loudly in dark places',
    'Blinks much more frequently than normal',
    'Never makes direct eye contact',
    'Insists on sitting in the same spot at every tavern',
    'Talks to an imaginary companion when they think no one is watching'
];

export const QUIRKS = [
    'Constantly fidgets with a ring or coin, rolling it across their knuckles.',
    'Speaks in a noticeably lower or higher pitch when lying.',
    'Always sniffs food before eating it, even in polite company.',
    'Taps their foot rhythmically when thinking, as if keeping time to an unheard melody.',
    'Refers to themselves in the third person when nervous.',
    'Has a habit of collecting small, worthless trinkets from every place they visit.',
    'Laughs at inappropriate times and cannot seem to help it.',
    'Whistles the same haunting tune whenever they are alone.',
    'Compulsively counts objects in the room, like ceiling beams or candles.',
    'Speaks with exaggerated hand gestures, often accidentally knocking things over.',
    'Squints at everyone as if trying to read fine print on their face.',
    'Chews on a piece of dried leather or jerky while thinking.',
    'Always positions themselves with their back to a wall.',
    'Has a nervous habit of braiding and unbraiding a strand of their hair.',
    'Gives everyone a nickname within minutes of meeting them.',
    'Mutters calculations or lists under their breath.',
    'Blinks much more frequently than normal.',
    'Always carries a small, wilted flower that they claim brings good luck.',
    'Unconsciously mimics the accents of whoever they are speaking to.',
    'Refuses to step on cracks in stone floors.',
    'Scratches their nose whenever they are about to say something important.',
    'Ends most sentences with a rhetorical question, do they not?',
    'Has an unusually firm handshake that borders on painful.',
    'Constantly adjusts their clothing, as if nothing ever fits quite right.',
    'Hums loudly and off-key when walking through dark or scary places.'
];

// ─── Backstory Hooks ────────────────────────────────────────────────

export const BACKSTORY_HOOKS = [
    'Fled their homeland after witnessing something terrible; they refuse to speak of it.',
    'Once served a powerful lord but was cast out after being framed for a crime they did not commit.',
    'Lost their entire family to a plague and now wanders, searching for a cure that came too late.',
    'Was raised in a monastery but left after questioning the teachings of the elders.',
    'Carries a mysterious scar that pulses with faint magical light during thunderstorms.',
    'Made a bargain with a fey creature in their youth and still owes a debt they cannot name.',
    'Discovered a hidden talent for magic after nearly dying in a terrible accident.',
    'Was once wealthy and influential, but a rival destroyed everything they had built.',
    'Survived alone in the wilderness for years after being separated from a traveling caravan.',
    'Receives cryptic dreams that seem to foretell events that have not yet happened.',
    'Searches for a long-lost sibling who was taken by raiders when they were children.',
    'Once belonged to a secret society but fled when they learned its true, sinister purpose.',
    'Bears a cursed heirloom that they cannot part with, no matter how hard they try.',
    'Trained under a legendary artisan who disappeared without a trace, leaving behind only a half-finished masterwork.',
    'Was shipwrecked on a strange island for months and came back... different.',
    'Stole something precious from a dragon\'s hoard and lives in constant fear of its wrath.',
    'Lost their memory of the past five years and is slowly piecing together what happened.',
    'Made an oath to a dying stranger to deliver a sealed letter to someone across the continent.',
    'Is secretly the illegitimate heir to a minor noble house, a fact that could spark conflict.',
    'Once freed a trapped spirit that now occasionally whispers advice, whether wanted or not.',
    'Was petrified by a basilisk for decades and only recently restored; the world has changed around them.',
    'Carries a locket with a portrait of someone they have never met but feel compelled to find.',
    'Abandoned their post during a battle and the guilt has haunted them ever since.',
    'Was marked by a celestial being at birth; they do not yet understand what it means.',
    'Ran away from an arranged marriage and has been living under an assumed name ever since.',
    'Accidentally opened a portal that released something into the world, and now hunts it.',
    'Inherited a tavern from a mysterious benefactor they have never met, along with a cryptic message.',
    'Was a prisoner of war for years before escaping; still flinches at the sound of chains.',
    'Found a treasure map tattooed on the inside of a book cover, and it leads somewhere dangerous.',
    'Used to be part of a thieves\' guild but betrayed them to save an innocent life, and now has a bounty on their head.'
];

// ─── Stat Generation Helpers ────────────────────────────────────────

export const ABILITY_NAMES = ['str', 'dex', 'con', 'int', 'wis', 'cha'];

export const ABILITY_LABELS = {
    str: 'STR', dex: 'DEX', con: 'CON',
    int: 'INT', wis: 'WIS', cha: 'CHA'
};

export const ABILITY_FULL_NAMES = {
    str: 'Strength', dex: 'Dexterity', con: 'Constitution',
    int: 'Intelligence', wis: 'Wisdom', cha: 'Charisma'
};
