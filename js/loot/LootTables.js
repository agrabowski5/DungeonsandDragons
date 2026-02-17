// ─── Loot Generation Engine ──────────────────────────────────────────────
// Rolls on 5e SRD treasure tables and returns structured loot results.

import { rollD, rollFormula } from '../utils/dice.js';
import {
    INDIVIDUAL_TREASURE,
    INDIVIDUAL_COIN_MULTIPLIERS,
    TREASURE_HOARDS,
    HOARD_COIN_MULTIPLIERS,
    GEMS,
    ART_OBJECTS,
} from '../data/loot-tables.js';
import {
    MAGIC_ITEMS,
    MAGIC_ITEM_TABLES,
} from '../data/magic-items.js';

// ─── CR Tier Resolution ──────────────────────────────────────────────────

const CR_TIERS = ['0-4', '5-10', '11-16', '17+'];

function resolveTier(tierLabel) {
    if (CR_TIERS.includes(tierLabel)) return tierLabel;
    return '0-4';
}

// ─── Dice Helpers ────────────────────────────────────────────────────────

function rollCoins(coinFormulas, multipliers) {
    const result = {};
    const coinTypes = ['cp', 'sp', 'ep', 'gp', 'pp'];
    for (const type of coinTypes) {
        if (coinFormulas[type]) {
            const base = rollFormula(coinFormulas[type]);
            const mult = (multipliers && multipliers[type]) || 1;
            result[type] = base * mult;
        }
    }
    return result;
}

function rollOnD100Table(table) {
    const roll = rollD(100);
    for (const entry of table) {
        if (roll >= entry.d100Min && roll <= entry.d100Max) {
            return { entry, roll };
        }
    }
    // Fallback to last entry
    return { entry: table[table.length - 1], roll };
}

// ─── Pick Random From Array ──────────────────────────────────────────────

function pickRandom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ─── Weighted Random Selection ───────────────────────────────────────────

function weightedPick(entries) {
    const totalWeight = entries.reduce((sum, e) => sum + e.weight, 0);
    let roll = Math.random() * totalWeight;
    for (const entry of entries) {
        roll -= entry.weight;
        if (roll <= 0) return entry;
    }
    return entries[entries.length - 1];
}

// ─── Magic Item Resolution ───────────────────────────────────────────────

function rollMagicItem(tableKey) {
    const table = MAGIC_ITEM_TABLES[tableKey];
    if (!table) return null;

    const { rarity } = weightedPick(table);
    const pool = MAGIC_ITEMS[rarity];
    if (!pool || pool.length === 0) return null;

    return { ...pickRandom(pool) };
}

function rollMagicItems(magicItemSpec) {
    if (!magicItemSpec) return [];

    const count = rollFormula(magicItemSpec.roll);
    const items = [];
    for (let i = 0; i < count; i++) {
        const item = rollMagicItem(magicItemSpec.table);
        if (item) items.push(item);
    }
    return items;
}

// ─── Gem / Art Object Resolution ─────────────────────────────────────────

function rollGems(gemSpec) {
    if (!gemSpec) return [];

    const count = rollFormula(gemSpec.count);
    const pool = GEMS[gemSpec.value];
    if (!pool || pool.length === 0) return [];

    const results = [];
    for (let i = 0; i < count; i++) {
        results.push({
            name: pickRandom(pool),
            value: gemSpec.value,
            type: 'gem',
        });
    }
    return results;
}

function rollArtObjects(artSpec) {
    if (!artSpec) return [];

    const count = rollFormula(artSpec.count);
    const pool = ART_OBJECTS[artSpec.value];
    if (!pool || pool.length === 0) return [];

    const results = [];
    for (let i = 0; i < count; i++) {
        results.push({
            name: pickRandom(pool),
            value: artSpec.value,
            type: 'art',
        });
    }
    return results;
}

// ─── Consolidation Helpers ───────────────────────────────────────────────

function consolidateValueItems(items) {
    // Group by name and sum counts
    const map = new Map();
    for (const item of items) {
        const key = `${item.name}|${item.value}`;
        if (map.has(key)) {
            map.get(key).count += 1;
        } else {
            map.set(key, { ...item, count: 1 });
        }
    }
    return [...map.values()];
}

function mergeCoins(a, b) {
    const result = {};
    const types = ['cp', 'sp', 'ep', 'gp', 'pp'];
    for (const t of types) {
        const sum = (a[t] || 0) + (b[t] || 0);
        if (sum > 0) result[t] = sum;
    }
    return result;
}

// ─── Total Value Calculation ─────────────────────────────────────────────

const COIN_VALUES_IN_GP = { cp: 0.01, sp: 0.1, ep: 0.5, gp: 1, pp: 10 };

function computeTotalGP(result) {
    let total = 0;

    // Coins
    for (const [type, amount] of Object.entries(result.coins)) {
        total += amount * (COIN_VALUES_IN_GP[type] || 0);
    }

    // Gems / Art
    for (const item of result.gemsAndArt) {
        total += item.value * (item.count || 1);
    }

    return Math.round(total * 100) / 100;
}

// ─── Public API ──────────────────────────────────────────────────────────

export class LootGenerator {

    /**
     * Generate individual treasure for a given CR tier.
     * @param {string} tier - '0-4', '5-10', '11-16', or '17+'
     * @returns {object} { coins, gemsAndArt, magicItems, totalGP, type, tier, timestamp }
     */
    static generateIndividual(tier) {
        tier = resolveTier(tier);
        const table = INDIVIDUAL_TREASURE[tier];
        const multipliers = INDIVIDUAL_COIN_MULTIPLIERS[tier];

        const { entry } = rollOnD100Table(table);
        const coins = rollCoins(entry.coins, multipliers);

        const result = {
            coins,
            gemsAndArt: [],
            magicItems: [],
            totalGP: 0,
            type: 'individual',
            tier,
            timestamp: Date.now(),
        };

        result.totalGP = computeTotalGP(result);
        return result;
    }

    /**
     * Generate a treasure hoard for a given CR tier.
     * @param {string} tier - '0-4', '5-10', '11-16', or '17+'
     * @returns {object} { coins, gemsAndArt, magicItems, totalGP, type, tier, timestamp }
     */
    static generateHoard(tier) {
        tier = resolveTier(tier);
        const hoard = TREASURE_HOARDS[tier];
        const multipliers = HOARD_COIN_MULTIPLIERS[tier];

        // Roll base coins
        const coins = rollCoins(hoard.baseCoins, multipliers);

        // Roll on the d100 table for extras
        const { entry } = rollOnD100Table(hoard.rolls);

        // Resolve gems and art objects
        const gems = rollGems(entry.gems);
        const art = rollArtObjects(entry.art);
        const gemsAndArt = consolidateValueItems([...gems, ...art]);

        // Resolve magic items
        const magicItems = rollMagicItems(entry.magicItems);

        const result = {
            coins,
            gemsAndArt,
            magicItems,
            totalGP: 0,
            type: 'hoard',
            tier,
            timestamp: Date.now(),
        };

        result.totalGP = computeTotalGP(result);
        return result;
    }

    /**
     * Generate loot based on type and tier.
     * @param {'individual'|'hoard'} type
     * @param {string} tier
     * @returns {object}
     */
    static generate(type, tier) {
        if (type === 'hoard') {
            return LootGenerator.generateHoard(tier);
        }
        return LootGenerator.generateIndividual(tier);
    }

    /**
     * Format a loot result as a plain text string for clipboard sharing.
     * @param {object} result - A loot result object
     * @returns {string}
     */
    static formatAsText(result) {
        const lines = [];
        const typeLabel = result.type === 'hoard' ? 'Treasure Hoard' : 'Individual Treasure';
        lines.push(`=== ${typeLabel} (CR ${result.tier}) ===`);
        lines.push('');

        // Coins
        const coinNames = { cp: 'Copper', sp: 'Silver', ep: 'Electrum', gp: 'Gold', pp: 'Platinum' };
        const coinParts = [];
        for (const [type, amount] of Object.entries(result.coins)) {
            if (amount > 0) {
                coinParts.push(`${amount.toLocaleString()} ${coinNames[type]}`);
            }
        }
        if (coinParts.length > 0) {
            lines.push('COINS:');
            for (const part of coinParts) {
                lines.push(`  ${part}`);
            }
            lines.push('');
        }

        // Gems & Art
        if (result.gemsAndArt.length > 0) {
            lines.push('GEMS & ART OBJECTS:');
            for (const item of result.gemsAndArt) {
                const qty = item.count > 1 ? ` x${item.count}` : '';
                const typeLabel = item.type === 'gem' ? 'Gem' : 'Art';
                lines.push(`  ${item.name}${qty} (${item.value} gp ${typeLabel})`);
            }
            lines.push('');
        }

        // Magic Items
        if (result.magicItems.length > 0) {
            lines.push('MAGIC ITEMS:');
            for (const item of result.magicItems) {
                const attn = item.attunement ? ' [Attunement]' : '';
                lines.push(`  ${item.name} (${item.rarity})${attn}`);
                lines.push(`    ${item.description}`);
            }
            lines.push('');
        }

        // Total
        lines.push(`ESTIMATED TOTAL VALUE: ${result.totalGP.toLocaleString()} gp`);

        return lines.join('\n');
    }
}
