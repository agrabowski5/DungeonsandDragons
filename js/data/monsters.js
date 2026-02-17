export const MONSTERS = [
    // CR 0
    { name: 'Commoner', cr: 0, xp: 10, ac: 10, hp: 4, hpFormula: '1d8', type: 'Humanoid', size: 'Medium', initiativeBonus: 0 },

    // CR 1/8
    { name: 'Bandit', cr: 0.125, xp: 25, ac: 12, hp: 11, hpFormula: '2d8+2', type: 'Humanoid', size: 'Medium', initiativeBonus: 1 },
    { name: 'Kobold', cr: 0.125, xp: 25, ac: 12, hp: 5, hpFormula: '2d6-2', type: 'Humanoid', size: 'Small', initiativeBonus: 2 },
    { name: 'Giant Rat', cr: 0.125, xp: 25, ac: 12, hp: 7, hpFormula: '2d6', type: 'Beast', size: 'Small', initiativeBonus: 2 },
    { name: 'Stirge', cr: 0.125, xp: 25, ac: 14, hp: 2, hpFormula: '1d4', type: 'Beast', size: 'Tiny', initiativeBonus: 3 },

    // CR 1/4
    { name: 'Goblin', cr: 0.25, xp: 50, ac: 15, hp: 7, hpFormula: '2d6', type: 'Humanoid', size: 'Small', initiativeBonus: 2 },
    { name: 'Skeleton', cr: 0.25, xp: 50, ac: 13, hp: 13, hpFormula: '2d8+4', type: 'Undead', size: 'Medium', initiativeBonus: 2 },
    { name: 'Zombie', cr: 0.25, xp: 50, ac: 8, hp: 22, hpFormula: '3d8+9', type: 'Undead', size: 'Medium', initiativeBonus: -2 },
    { name: 'Wolf', cr: 0.25, xp: 50, ac: 13, hp: 11, hpFormula: '2d8+2', type: 'Beast', size: 'Medium', initiativeBonus: 2 },
    { name: 'Acolyte', cr: 0.25, xp: 50, ac: 10, hp: 9, hpFormula: '2d8', type: 'Humanoid', size: 'Medium', initiativeBonus: 0 },
    { name: 'Flying Sword', cr: 0.25, xp: 50, ac: 17, hp: 17, hpFormula: '5d6', type: 'Construct', size: 'Small', initiativeBonus: 2 },

    // CR 1/2
    { name: 'Orc', cr: 0.5, xp: 100, ac: 13, hp: 15, hpFormula: '2d8+6', type: 'Humanoid', size: 'Medium', initiativeBonus: 1 },
    { name: 'Hobgoblin', cr: 0.5, xp: 100, ac: 18, hp: 11, hpFormula: '2d8+2', type: 'Humanoid', size: 'Medium', initiativeBonus: 1 },
    { name: 'Gnoll', cr: 0.5, xp: 100, ac: 15, hp: 22, hpFormula: '5d8', type: 'Humanoid', size: 'Medium', initiativeBonus: 1 },
    { name: 'Shadow', cr: 0.5, xp: 100, ac: 12, hp: 16, hpFormula: '3d8+3', type: 'Undead', size: 'Medium', initiativeBonus: 2 },
    { name: 'Worg', cr: 0.5, xp: 100, ac: 13, hp: 26, hpFormula: '4d10+4', type: 'Monstrosity', size: 'Large', initiativeBonus: 1 },

    // CR 1
    { name: 'Bugbear', cr: 1, xp: 200, ac: 16, hp: 27, hpFormula: '5d8+5', type: 'Humanoid', size: 'Medium', initiativeBonus: 2 },
    { name: 'Ghoul', cr: 1, xp: 200, ac: 12, hp: 22, hpFormula: '5d8', type: 'Undead', size: 'Medium', initiativeBonus: 2 },
    { name: 'Giant Spider', cr: 1, xp: 200, ac: 14, hp: 26, hpFormula: '4d10+4', type: 'Beast', size: 'Large', initiativeBonus: 3 },
    { name: 'Dire Wolf', cr: 1, xp: 200, ac: 14, hp: 37, hpFormula: '5d10+10', type: 'Beast', size: 'Large', initiativeBonus: 2 },
    { name: 'Spy', cr: 1, xp: 200, ac: 12, hp: 27, hpFormula: '6d8', type: 'Humanoid', size: 'Medium', initiativeBonus: 2 },
    { name: 'Animated Armor', cr: 1, xp: 200, ac: 18, hp: 33, hpFormula: '6d8+6', type: 'Construct', size: 'Medium', initiativeBonus: 0 },
    { name: 'Harpy', cr: 1, xp: 200, ac: 11, hp: 38, hpFormula: '7d8+7', type: 'Monstrosity', size: 'Medium', initiativeBonus: 1 },

    // CR 2
    { name: 'Ogre', cr: 2, xp: 450, ac: 11, hp: 59, hpFormula: '7d10+21', type: 'Giant', size: 'Large', initiativeBonus: -1 },
    { name: 'Ghast', cr: 2, xp: 450, ac: 13, hp: 36, hpFormula: '8d8', type: 'Undead', size: 'Medium', initiativeBonus: 3 },
    { name: 'Gelatinous Cube', cr: 2, xp: 450, ac: 6, hp: 84, hpFormula: '8d10+40', type: 'Ooze', size: 'Large', initiativeBonus: -4 },
    { name: 'Gargoyle', cr: 2, xp: 450, ac: 15, hp: 52, hpFormula: '7d8+21', type: 'Elemental', size: 'Medium', initiativeBonus: 0 },
    { name: 'Mimic', cr: 2, xp: 450, ac: 12, hp: 58, hpFormula: '9d8+18', type: 'Monstrosity', size: 'Medium', initiativeBonus: 1 },
    { name: 'Ettercap', cr: 2, xp: 450, ac: 13, hp: 44, hpFormula: '8d8+8', type: 'Monstrosity', size: 'Medium', initiativeBonus: 2 },
    { name: 'Werewolf', cr: 3, xp: 700, ac: 12, hp: 58, hpFormula: '9d8+18', type: 'Humanoid', size: 'Medium', initiativeBonus: 1 },

    // CR 3
    { name: 'Owlbear', cr: 3, xp: 700, ac: 13, hp: 59, hpFormula: '7d10+21', type: 'Monstrosity', size: 'Large', initiativeBonus: 1 },
    { name: 'Manticore', cr: 3, xp: 700, ac: 14, hp: 68, hpFormula: '8d10+24', type: 'Monstrosity', size: 'Large', initiativeBonus: 3 },
    { name: 'Minotaur', cr: 3, xp: 700, ac: 14, hp: 76, hpFormula: '9d10+27', type: 'Monstrosity', size: 'Large', initiativeBonus: 0 },
    { name: 'Mummy', cr: 3, xp: 700, ac: 11, hp: 58, hpFormula: '9d8+18', type: 'Undead', size: 'Medium', initiativeBonus: -1 },
    { name: 'Phase Spider', cr: 3, xp: 700, ac: 13, hp: 32, hpFormula: '5d10+5', type: 'Monstrosity', size: 'Large', initiativeBonus: 2 },

    // CR 4
    { name: 'Ettin', cr: 4, xp: 1100, ac: 12, hp: 85, hpFormula: '10d10+30', type: 'Giant', size: 'Large', initiativeBonus: -1 },
    { name: 'Ghost', cr: 4, xp: 1100, ac: 11, hp: 45, hpFormula: '10d8', type: 'Undead', size: 'Medium', initiativeBonus: 1 },
    { name: 'Flameskull', cr: 4, xp: 1100, ac: 13, hp: 40, hpFormula: '9d4+18', type: 'Undead', size: 'Tiny', initiativeBonus: 3 },

    // CR 5
    { name: 'Troll', cr: 5, xp: 1800, ac: 15, hp: 84, hpFormula: '8d10+40', type: 'Giant', size: 'Large', initiativeBonus: 1 },
    { name: 'Hill Giant', cr: 5, xp: 1800, ac: 13, hp: 105, hpFormula: '10d12+40', type: 'Giant', size: 'Huge', initiativeBonus: -1 },
    { name: 'Basilisk', cr: 3, xp: 700, ac: 15, hp: 52, hpFormula: '8d8+16', type: 'Monstrosity', size: 'Medium', initiativeBonus: -1 },
    { name: 'Wraith', cr: 5, xp: 1800, ac: 13, hp: 67, hpFormula: '9d8+27', type: 'Undead', size: 'Medium', initiativeBonus: 3 },
    { name: 'Bulette', cr: 5, xp: 1800, ac: 17, hp: 94, hpFormula: '9d10+45', type: 'Monstrosity', size: 'Large', initiativeBonus: 0 },

    // CR 6
    { name: 'Wyvern', cr: 6, xp: 2300, ac: 13, hp: 110, hpFormula: '13d10+39', type: 'Dragon', size: 'Large', initiativeBonus: 0 },
    { name: 'Young White Dragon', cr: 6, xp: 2300, ac: 17, hp: 133, hpFormula: '14d10+56', type: 'Dragon', size: 'Large', initiativeBonus: 0 },
    { name: 'Medusa', cr: 6, xp: 2300, ac: 15, hp: 127, hpFormula: '17d8+51', type: 'Monstrosity', size: 'Medium', initiativeBonus: 2 },
    { name: 'Cyclops', cr: 6, xp: 2300, ac: 14, hp: 138, hpFormula: '12d12+60', type: 'Giant', size: 'Huge', initiativeBonus: 0 },

    // CR 7
    { name: 'Young Black Dragon', cr: 7, xp: 2900, ac: 18, hp: 127, hpFormula: '15d10+45', type: 'Dragon', size: 'Large', initiativeBonus: 2 },
    { name: 'Stone Giant', cr: 7, xp: 2900, ac: 17, hp: 126, hpFormula: '11d12+55', type: 'Giant', size: 'Huge', initiativeBonus: 2 },
    { name: 'Shield Guardian', cr: 7, xp: 2900, ac: 17, hp: 142, hpFormula: '15d10+60', type: 'Construct', size: 'Large', initiativeBonus: -1 },

    // CR 8
    { name: 'Young Green Dragon', cr: 8, xp: 3900, ac: 18, hp: 136, hpFormula: '16d10+48', type: 'Dragon', size: 'Large', initiativeBonus: 1 },
    { name: 'Frost Giant', cr: 8, xp: 3900, ac: 15, hp: 138, hpFormula: '12d12+60', type: 'Giant', size: 'Huge', initiativeBonus: -1 },
    { name: 'Mind Flayer', cr: 7, xp: 2900, ac: 15, hp: 71, hpFormula: '13d8+13', type: 'Aberration', size: 'Medium', initiativeBonus: 1 },
    { name: 'Hydra', cr: 8, xp: 3900, ac: 15, hp: 172, hpFormula: '15d12+75', type: 'Monstrosity', size: 'Huge', initiativeBonus: 1 },

    // CR 9
    { name: 'Young Blue Dragon', cr: 9, xp: 5000, ac: 18, hp: 152, hpFormula: '16d10+64', type: 'Dragon', size: 'Large', initiativeBonus: 0 },
    { name: 'Fire Giant', cr: 9, xp: 5000, ac: 18, hp: 162, hpFormula: '13d12+78', type: 'Giant', size: 'Huge', initiativeBonus: -1 },
    { name: 'Treant', cr: 9, xp: 5000, ac: 16, hp: 138, hpFormula: '12d12+60', type: 'Plant', size: 'Huge', initiativeBonus: -1 },

    // CR 10
    { name: 'Young Red Dragon', cr: 10, xp: 5900, ac: 18, hp: 178, hpFormula: '17d10+85', type: 'Dragon', size: 'Large', initiativeBonus: 0 },
    { name: 'Aboleth', cr: 10, xp: 5900, ac: 17, hp: 135, hpFormula: '18d10+36', type: 'Aberration', size: 'Large', initiativeBonus: -1 },
    { name: 'Guardian Naga', cr: 10, xp: 5900, ac: 18, hp: 127, hpFormula: '15d10+45', type: 'Monstrosity', size: 'Large', initiativeBonus: 3 },

    // CR 11
    { name: 'Remorhaz', cr: 11, xp: 7200, ac: 17, hp: 195, hpFormula: '17d12+85', type: 'Monstrosity', size: 'Huge', initiativeBonus: 1 },
    { name: 'Gynosphinx', cr: 11, xp: 7200, ac: 17, hp: 136, hpFormula: '16d10+48', type: 'Monstrosity', size: 'Large', initiativeBonus: 1 },
    { name: 'Behir', cr: 11, xp: 7200, ac: 17, hp: 168, hpFormula: '16d12+64', type: 'Monstrosity', size: 'Huge', initiativeBonus: 3 },

    // CR 13
    { name: 'Beholder', cr: 13, xp: 10000, ac: 18, hp: 180, hpFormula: '19d10+76', type: 'Aberration', size: 'Large', initiativeBonus: 2 },
    { name: 'Adult White Dragon', cr: 13, xp: 10000, ac: 18, hp: 200, hpFormula: '16d12+96', type: 'Dragon', size: 'Huge', initiativeBonus: 0 },
    { name: 'Vampire', cr: 13, xp: 10000, ac: 16, hp: 144, hpFormula: '17d8+68', type: 'Undead', size: 'Medium', initiativeBonus: 3 },

    // CR 14
    { name: 'Adult Black Dragon', cr: 14, xp: 11500, ac: 19, hp: 195, hpFormula: '17d12+85', type: 'Dragon', size: 'Huge', initiativeBonus: 2 },

    // CR 15
    { name: 'Adult Green Dragon', cr: 15, xp: 13000, ac: 19, hp: 207, hpFormula: '18d12+90', type: 'Dragon', size: 'Huge', initiativeBonus: 1 },
    { name: 'Purple Worm', cr: 15, xp: 13000, ac: 18, hp: 247, hpFormula: '15d20+90', type: 'Monstrosity', size: 'Gargantuan', initiativeBonus: -2 },
    { name: 'Mummy Lord', cr: 15, xp: 13000, ac: 17, hp: 97, hpFormula: '13d8+39', type: 'Undead', size: 'Medium', initiativeBonus: 0 },

    // CR 16
    { name: 'Adult Blue Dragon', cr: 16, xp: 15000, ac: 19, hp: 225, hpFormula: '18d12+108', type: 'Dragon', size: 'Huge', initiativeBonus: 0 },
    { name: 'Iron Golem', cr: 16, xp: 15000, ac: 20, hp: 210, hpFormula: '20d10+100', type: 'Construct', size: 'Large', initiativeBonus: -1 },

    // CR 17
    { name: 'Adult Red Dragon', cr: 17, xp: 18000, ac: 19, hp: 256, hpFormula: '19d12+133', type: 'Dragon', size: 'Huge', initiativeBonus: 0 },
    { name: 'Death Knight', cr: 17, xp: 18000, ac: 20, hp: 180, hpFormula: '19d8+95', type: 'Undead', size: 'Medium', initiativeBonus: 0 },

    // CR 20
    { name: 'Ancient White Dragon', cr: 20, xp: 25000, ac: 20, hp: 333, hpFormula: '18d20+144', type: 'Dragon', size: 'Gargantuan', initiativeBonus: 0 },
    { name: 'Pit Fiend', cr: 20, xp: 25000, ac: 19, hp: 300, hpFormula: '24d10+168', type: 'Fiend', size: 'Large', initiativeBonus: 0 },

    // CR 21
    { name: 'Ancient Black Dragon', cr: 21, xp: 33000, ac: 22, hp: 367, hpFormula: '21d20+147', type: 'Dragon', size: 'Gargantuan', initiativeBonus: 2 },
    { name: 'Lich', cr: 21, xp: 33000, ac: 17, hp: 135, hpFormula: '18d8+54', type: 'Undead', size: 'Medium', initiativeBonus: 3 },

    // CR 22
    { name: 'Ancient Green Dragon', cr: 22, xp: 41000, ac: 21, hp: 385, hpFormula: '22d20+154', type: 'Dragon', size: 'Gargantuan', initiativeBonus: 1 },

    // CR 23
    { name: 'Ancient Blue Dragon', cr: 23, xp: 50000, ac: 22, hp: 481, hpFormula: '26d20+208', type: 'Dragon', size: 'Gargantuan', initiativeBonus: 0 },

    // CR 24
    { name: 'Ancient Red Dragon', cr: 24, xp: 62000, ac: 22, hp: 546, hpFormula: '28d20+252', type: 'Dragon', size: 'Gargantuan', initiativeBonus: 0 },

    // CR 30
    { name: 'Tarrasque', cr: 30, xp: 155000, ac: 25, hp: 676, hpFormula: '33d20+330', type: 'Monstrosity', size: 'Gargantuan', initiativeBonus: 0 },
];

// Sort by CR then name
MONSTERS.sort((a, b) => a.cr - b.cr || a.name.localeCompare(b.name));

export function searchMonsters(query) {
    const q = query.toLowerCase().trim();
    if (!q) return MONSTERS;
    return MONSTERS.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.type.toLowerCase().includes(q)
    );
}

export function getMonstersByCR(cr) {
    return MONSTERS.filter(m => m.cr === cr);
}
