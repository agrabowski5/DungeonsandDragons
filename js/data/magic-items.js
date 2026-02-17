// ─── D&D 5e SRD Magic Items by Rarity ────────────────────────────────────
// Each item: { name, rarity, description, attunement? }

export const MAGIC_ITEMS = {
    common: [
        { name: 'Potion of Healing', rarity: 'common', description: 'Restores 2d4+2 hit points when consumed.' },
        { name: 'Potion of Climbing', rarity: 'common', description: 'Gain a climbing speed equal to your walking speed for 1 hour.' },
        { name: 'Driftglobe', rarity: 'common', description: 'A small glass sphere that can cast Light or Daylight.' },
        { name: 'Candle of the Deep', rarity: 'common', description: 'A candle that cannot be extinguished by water and sheds light underwater.' },
        { name: 'Cloak of Many Fashions', rarity: 'common', description: 'You can change the style, color, and apparent quality of this cloak at will.' },
        { name: 'Clockwork Amulet', rarity: 'common', description: 'Once per day, you can forgo rolling an attack and treat the d20 as a 10.' },
        { name: 'Ear Horn of Hearing', rarity: 'common', description: 'While held, this horn suppresses the deafened condition.' },
        { name: 'Hat of Wizardry', rarity: 'common', description: 'You can use it as a spellcasting focus. Once per long rest, cast a cantrip you don\'t know.', attunement: true },
        { name: 'Heward\'s Handy Spice Pouch', rarity: 'common', description: 'Reach inside to find 1d4 pinches of a desired seasoning. 10 charges, regains 1d6+4 at dawn.' },
        { name: 'Moon-Touched Sword', rarity: 'common', description: 'A sword that glows with moonlight, shedding 15 ft bright light and 15 ft dim light in darkness.' },
        { name: 'Mystery Key', rarity: 'common', description: 'A key that has a 5% chance of unlocking any lock into which it is inserted.' },
        { name: 'Orb of Direction', rarity: 'common', description: 'Hold the orb to determine which way is north.' },
        { name: 'Pot of Awakening', rarity: 'common', description: 'Plant a shrub seedling and after 30 days it becomes an awakened shrub.' },
        { name: 'Rope of Mending', rarity: 'common', description: 'You can cut this 50-foot rope into pieces and reattach them by holding the ends together.' },
        { name: 'Staff of Adornment', rarity: 'common', description: 'Harmless intangible ornaments appear at the tip of this staff, giving off dim light.' },
        { name: 'Tankard of Sobriety', rarity: 'common', description: 'Drinking from this tankard makes you immune to being intoxicated.' },
    ],
    uncommon: [
        { name: '+1 Weapon', rarity: 'uncommon', description: 'You have a +1 bonus to attack and damage rolls made with this magic weapon.' },
        { name: '+1 Shield', rarity: 'uncommon', description: 'You have a +1 bonus to AC while wielding this shield.' },
        { name: 'Bag of Holding', rarity: 'uncommon', description: 'This bag has an interior space considerably larger than its outside dimensions. Holds up to 500 lb.' },
        { name: 'Boots of Elvenkind', rarity: 'uncommon', description: 'Your steps make no sound. Advantage on Stealth checks that rely on moving silently.' },
        { name: 'Cloak of Elvenkind', rarity: 'uncommon', description: 'While wearing this cloak with the hood up, Stealth checks have advantage.', attunement: true },
        { name: 'Cloak of Protection', rarity: 'uncommon', description: '+1 bonus to AC and saving throws while wearing this cloak.', attunement: true },
        { name: 'Gauntlets of Ogre Power', rarity: 'uncommon', description: 'Your Strength score is 19 while wearing these gauntlets.', attunement: true },
        { name: 'Goggles of Night', rarity: 'uncommon', description: 'You have darkvision out to 60 feet while wearing these goggles.' },
        { name: 'Headband of Intellect', rarity: 'uncommon', description: 'Your Intelligence score is 19 while wearing this headband.', attunement: true },
        { name: 'Immovable Rod', rarity: 'uncommon', description: 'Press the button to fix the rod magically in place. Holds up to 8,000 pounds.' },
        { name: 'Javelin of Lightning', rarity: 'uncommon', description: 'Throw to create a 5 ft wide, 120 ft line of lightning. 4d6 lightning damage.' },
        { name: 'Lantern of Revealing', rarity: 'uncommon', description: 'Invisible creatures and objects are visible in the lantern\'s bright light.' },
        { name: 'Necklace of Adaptation', rarity: 'uncommon', description: 'You can breathe normally in any environment.', attunement: true },
        { name: 'Pearl of Power', rarity: 'uncommon', description: 'Recover one expended spell slot of 3rd level or lower once per dawn.', attunement: true },
        { name: 'Periapt of Wound Closure', rarity: 'uncommon', description: 'Stabilize at 0 HP automatically. Double HP regained from hit dice.', attunement: true },
        { name: 'Potion of Greater Healing', rarity: 'uncommon', description: 'Restores 4d4+4 hit points when consumed.' },
        { name: 'Ring of Jumping', rarity: 'uncommon', description: 'You can cast Jump on yourself at will.', attunement: true },
        { name: 'Ring of Swimming', rarity: 'uncommon', description: 'You have a swimming speed of 40 feet while wearing this ring.' },
        { name: 'Ring of Water Walking', rarity: 'uncommon', description: 'You can stand on and move across any liquid surface as if it were solid ground.' },
        { name: 'Rope of Climbing', rarity: 'uncommon', description: 'This 60-foot silk rope can be commanded to move and knot itself.' },
        { name: 'Sending Stones', rarity: 'uncommon', description: 'A pair of stones. Once per day, cast Sending between the two stones.' },
        { name: 'Stone of Good Luck (Luckstone)', rarity: 'uncommon', description: '+1 bonus to ability checks and saving throws.', attunement: true },
        { name: 'Wand of Magic Detection', rarity: 'uncommon', description: 'Cast Detect Magic at will. 3 charges, regains 1d3 charges at dawn.' },
        { name: 'Wand of Magic Missiles', rarity: 'uncommon', description: '7 charges. Expend charges to cast Magic Missile. Regains 1d6+1 at dawn.' },
        { name: 'Winged Boots', rarity: 'uncommon', description: 'Gain a flying speed equal to walking speed for 4 hours per day.', attunement: true },
    ],
    rare: [
        { name: '+2 Weapon', rarity: 'rare', description: 'You have a +2 bonus to attack and damage rolls made with this magic weapon.' },
        { name: '+2 Shield', rarity: 'rare', description: 'You have a +2 bonus to AC while wielding this shield.' },
        { name: '+1 Armor', rarity: 'rare', description: 'You have a +1 bonus to AC while wearing this armor.' },
        { name: 'Amulet of Health', rarity: 'rare', description: 'Your Constitution score is 19 while wearing this amulet.', attunement: true },
        { name: 'Belt of Hill Giant Strength', rarity: 'rare', description: 'Your Strength score is 21 while wearing this belt.', attunement: true },
        { name: 'Cloak of Displacement', rarity: 'rare', description: 'Creatures have disadvantage on attack rolls against you.', attunement: true },
        { name: 'Cloak of the Bat', rarity: 'rare', description: 'Advantage on Stealth checks. Fly in dim light or darkness.', attunement: true },
        { name: 'Flame Tongue', rarity: 'rare', description: 'When you speak the command word, the blade erupts in flames, dealing an extra 2d6 fire damage.', attunement: true },
        { name: 'Helm of Teleportation', rarity: 'rare', description: 'Cast Teleport targeting yourself. 3 charges, regains 1d3 at dawn.', attunement: true },
        { name: 'Mantle of Spell Resistance', rarity: 'rare', description: 'Advantage on saving throws against spells.', attunement: true },
        { name: 'Periapt of Proof Against Poison', rarity: 'rare', description: 'Immune to poison damage and the poisoned condition.' },
        { name: 'Potion of Superior Healing', rarity: 'rare', description: 'Restores 8d4+8 hit points when consumed.' },
        { name: 'Ring of Protection', rarity: 'rare', description: '+1 bonus to AC and saving throws.', attunement: true },
        { name: 'Ring of Spell Storing', rarity: 'rare', description: 'Store up to 5 levels worth of spells. Any creature can cast them.', attunement: true },
        { name: 'Rope of Entanglement', rarity: 'rare', description: 'Command the rope to entangle a creature within 20 feet.' },
        { name: 'Staff of Healing', rarity: 'rare', description: '10 charges. Cast Cure Wounds, Lesser Restoration, or Mass Cure Wounds.', attunement: true },
        { name: 'Sun Blade', rarity: 'rare', description: 'A blade of pure radiance. +2 bonus, deals radiant damage, extra damage to undead.', attunement: true },
        { name: 'Wand of Fireballs', rarity: 'rare', description: '7 charges. Expend charges to cast Fireball. Regains 1d6+1 at dawn.', attunement: true },
        { name: 'Wand of Lightning Bolts', rarity: 'rare', description: '7 charges. Expend charges to cast Lightning Bolt. Regains 1d6+1 at dawn.', attunement: true },
        { name: 'Wings of Flying', rarity: 'rare', description: 'While wearing this cloak, you can fly with a speed of 60 feet.', attunement: true },
    ],
    'very rare': [
        { name: '+3 Weapon', rarity: 'very rare', description: 'You have a +3 bonus to attack and damage rolls made with this magic weapon.' },
        { name: '+3 Shield', rarity: 'very rare', description: 'You have a +3 bonus to AC while wielding this shield.' },
        { name: '+2 Armor', rarity: 'very rare', description: 'You have a +2 bonus to AC while wearing this armor.' },
        { name: 'Animated Shield', rarity: 'very rare', description: 'Bonus action to animate. The shield floats and protects you without being held.', attunement: true },
        { name: 'Belt of Fire Giant Strength', rarity: 'very rare', description: 'Your Strength score is 25 while wearing this belt.', attunement: true },
        { name: 'Cloak of Invisibility', rarity: 'very rare', description: 'Pull the hood up to become invisible. 2 hours of use, regains at dawn.', attunement: true },
        { name: 'Crystal Ball', rarity: 'very rare', description: 'Cast Scrying at will while touching the ball.', attunement: true },
        { name: 'Dancing Sword', rarity: 'very rare', description: 'Bonus action to toss and command the sword to fight on its own.', attunement: true },
        { name: 'Frost Brand', rarity: 'very rare', description: 'Deals an extra 1d6 cold damage. Resistance to fire damage.', attunement: true },
        { name: 'Manual of Bodily Health', rarity: 'very rare', description: 'Increases your Constitution score and maximum by 2.' },
        { name: 'Potion of Supreme Healing', rarity: 'very rare', description: 'Restores 10d4+20 hit points when consumed.' },
        { name: 'Ring of Regeneration', rarity: 'very rare', description: 'Regain 1d6 HP every 10 minutes. Regrow severed body parts.', attunement: true },
        { name: 'Ring of Telekinesis', rarity: 'very rare', description: 'Cast Telekinesis at will.', attunement: true },
        { name: 'Robe of Stars', rarity: 'very rare', description: '+1 bonus to saving throws. 6 stars that can be used to cast Magic Missile.', attunement: true },
        { name: 'Rod of Alertness', rarity: 'very rare', description: 'Advantage on initiative and Perception checks. Multiple detection spells.', attunement: true },
        { name: 'Staff of Fire', rarity: 'very rare', description: '10 charges. Cast Burning Hands, Fireball, or Wall of Fire.', attunement: true },
        { name: 'Staff of Power', rarity: 'very rare', description: '+2 bonus to AC, spell attacks, and saving throws. 20 charges for multiple spells.', attunement: true },
        { name: 'Staff of Thunder and Lightning', rarity: 'very rare', description: '+2 weapon with thunder strike, lightning strike, and thunder and lightning powers.', attunement: true },
        { name: 'Tome of Understanding', rarity: 'very rare', description: 'Increases your Wisdom score and maximum by 2.' },
    ],
    legendary: [
        { name: 'Holy Avenger', rarity: 'legendary', description: '+3 weapon. Extra 2d10 radiant damage to fiends/undead. Spell resistance aura.', attunement: true },
        { name: 'Vorpal Sword', rarity: 'legendary', description: '+3 weapon. On a roll of 20, severs the head of the target.', attunement: true },
        { name: 'Ring of Three Wishes', rarity: 'legendary', description: 'Contains 3 charges. Each charge can cast the Wish spell.' },
        { name: 'Armor of Invulnerability', rarity: 'legendary', description: 'Resistance to nonmagical damage. Action to gain immunity for 10 minutes.', attunement: true },
        { name: 'Belt of Storm Giant Strength', rarity: 'legendary', description: 'Your Strength score is 29 while wearing this belt.', attunement: true },
        { name: 'Cloak of Invisibility (Legendary)', rarity: 'legendary', description: 'Become invisible indefinitely. Does not end when you attack or cast spells.', attunement: true },
        { name: 'Cubic Gate', rarity: 'legendary', description: 'A cube with 6 faces, each keyed to a different plane. Open portals between planes.' },
        { name: 'Deck of Many Things', rarity: 'legendary', description: 'Draw cards for powerful, unpredictable magical effects. Use at your own peril.' },
        { name: 'Efreeti Chain', rarity: 'legendary', description: '+3 chain mail. Immune to fire damage. Understand and speak Ignan.', attunement: true },
        { name: 'Iron Flask', rarity: 'legendary', description: 'Trap a creature from another plane inside. Command it to serve you.' },
        { name: 'Luck Blade', rarity: 'legendary', description: '+1 weapon with +1 to saving throws. Contains 1d4-1 wishes.', attunement: true },
        { name: 'Ring of Djinni Summoning', rarity: 'legendary', description: 'Summon a djinni that serves you. It remains until dismissed.', attunement: true },
        { name: 'Ring of Spell Turning', rarity: 'legendary', description: 'Advantage on saves vs spells. Spells targeting only you may be reflected.', attunement: true },
        { name: 'Robe of the Archmagi', rarity: 'legendary', description: 'Base AC 15 + Dex. Advantage on spell saves. +2 spell attack rolls and save DC.', attunement: true },
        { name: 'Rod of Lordly Might', rarity: 'legendary', description: 'A versatile rod that can become a weapon, ladder, battering ram, or compass.', attunement: true },
        { name: 'Scarab of Protection', rarity: 'legendary', description: 'Advantage on saves vs spells. Absorb up to 12 necromancy/undead effects.', attunement: true },
        { name: 'Staff of the Magi', rarity: 'legendary', description: '+2 bonus. 50 charges for many powerful spells. Spell absorption.', attunement: true },
        { name: 'Sphere of Annihilation', rarity: 'legendary', description: 'A 2-foot black sphere that destroys anything it touches.' },
        { name: 'Talisman of Pure Good', rarity: 'legendary', description: '7 charges. Destroy an evil-aligned creature\'s link to its plane, banishing it.', attunement: true },
        { name: 'Tome of the Stilled Tongue', rarity: 'legendary', description: 'Spellcasting focus. Cast a spell as a bonus action once per day.', attunement: true },
    ],
};

// ─── Magic Item Tables A through I ───────────────────────────────────────
// Maps the SRD hoard table letters to rarity pools with weighted probabilities.
// Each entry: { rarity, weight } (weights within a table determine relative probability)

export const MAGIC_ITEM_TABLES = {
    A: [
        { rarity: 'common', weight: 100 },
    ],
    B: [
        { rarity: 'common', weight: 50 },
        { rarity: 'uncommon', weight: 50 },
    ],
    C: [
        { rarity: 'uncommon', weight: 100 },
    ],
    D: [
        { rarity: 'uncommon', weight: 50 },
        { rarity: 'rare', weight: 50 },
    ],
    E: [
        { rarity: 'rare', weight: 100 },
    ],
    F: [
        { rarity: 'uncommon', weight: 40 },
        { rarity: 'rare', weight: 40 },
        { rarity: 'very rare', weight: 20 },
    ],
    G: [
        { rarity: 'rare', weight: 50 },
        { rarity: 'very rare', weight: 40 },
        { rarity: 'legendary', weight: 10 },
    ],
    H: [
        { rarity: 'very rare', weight: 60 },
        { rarity: 'legendary', weight: 40 },
    ],
    I: [
        { rarity: 'very rare', weight: 30 },
        { rarity: 'legendary', weight: 70 },
    ],
};

// Helper: get all items of a specific rarity
export function getItemsByRarity(rarity) {
    return MAGIC_ITEMS[rarity] || [];
}

// Helper: get all rarities
export function getAllRarities() {
    return ['common', 'uncommon', 'rare', 'very rare', 'legendary'];
}
