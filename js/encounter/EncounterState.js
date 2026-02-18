import { rollInitiative } from '../utils/dice.js';
import { Storage } from '../utils/storage.js';

let nextId = 1;
const ROSTER_KEY = 'dnd_party_roster';

export class EncounterState {
    constructor() {
        this.name = 'New Encounter';
        this.party = { size: 4, level: 1 };
        this.monsters = [];
        this.players = [];
        this.initiativeOrder = [];
        this.currentTurnIndex = 0;
        this.round = 1;
        this.combatLog = [];
        this.autoSkipDefeated = false;
    }

    // ─── Party Roster Persistence ─────────────────────────────

    saveRoster() {
        const roster = this.players.map(p => ({
            name: p.name,
            maxHp: p.maxHp || 0,
        }));
        Storage.save(ROSTER_KEY, { size: this.party.size, level: this.party.level, roster });
    }

    loadRoster() {
        const data = Storage.load(ROSTER_KEY);
        if (!data) return;
        this.party.size = data.size || 4;
        this.party.level = data.level || 1;
        if (data.roster && data.roster.length > 0) {
            this._savedRoster = data.roster;
        }
    }

    // ─── Monsters ──────────────────────────────────────────────

    addMonster(template, count = 1) {
        for (let i = 0; i < count; i++) {
            this.monsters.push({
                ...template,
                instanceId: nextId++,
                currentHp: template.hp,
                initiative: 0,
                conditions: [],
                concentration: { active: false, spell: '' },
            });
        }
    }

    removeMonster(instanceId) {
        this.monsters = this.monsters.filter(m => m.instanceId !== instanceId);
    }

    removeMonstersByName(name) {
        this.monsters = this.monsters.filter(m => m.name !== name);
    }

    getMonsterGroups() {
        const groups = {};
        for (const m of this.monsters) {
            if (!groups[m.name]) {
                groups[m.name] = { template: m, count: 0, instances: [] };
            }
            groups[m.name].count++;
            groups[m.name].instances.push(m);
        }
        return Object.values(groups);
    }

    // ─── Players ───────────────────────────────────────────────

    initPlayers() {
        this.players = [];
        const roster = this._savedRoster || [];
        for (let i = 0; i < this.party.size; i++) {
            const saved = roster[i];
            this.players.push({
                name: saved ? saved.name : `Player ${i + 1}`,
                initiative: 0,
                instanceId: nextId++,
                type: 'player',
                currentHp: saved ? (saved.maxHp || 0) : 0,
                maxHp: saved ? (saved.maxHp || 0) : 0,
                conditions: [],
                concentration: { active: false, spell: '' },
                deathSaves: { successes: 0, failures: 0, stabilized: false, dead: false },
            });
        }
    }

    setPlayerName(instanceId, name) {
        const player = this.players.find(p => p.instanceId === instanceId);
        if (player) player.name = name;
        const entry = this.initiativeOrder.find(e => e.instanceId === instanceId);
        if (entry) entry.name = name;
    }

    setPlayerMaxHp(instanceId, maxHp) {
        const player = this.players.find(p => p.instanceId === instanceId);
        if (player) {
            player.maxHp = maxHp;
            player.currentHp = Math.min(player.currentHp || maxHp, maxHp);
        }
    }

    // ─── Initiative ────────────────────────────────────────────

    rollAllInitiative() {
        for (const m of this.monsters) {
            m.initiative = rollInitiative(m.initiativeBonus || 0);
        }

        this.initiativeOrder = [
            ...this.monsters.map(m => ({
                instanceId: m.instanceId,
                name: m.name,
                initiative: m.initiative,
                type: 'monster',
            })),
            ...this.players.map(p => ({
                instanceId: p.instanceId,
                name: p.name,
                initiative: p.initiative,
                type: 'player',
            })),
        ].sort((a, b) => b.initiative - a.initiative);

        this.currentTurnIndex = 0;
        this.round = 1;
        this.combatLog = [];
        this.logEvent('Combat started');
    }

    setPlayerInitiative(instanceId, value) {
        const player = this.players.find(p => p.instanceId === instanceId);
        if (player) player.initiative = value;

        const entry = this.initiativeOrder.find(e => e.instanceId === instanceId);
        if (entry) {
            entry.initiative = value;
            this.initiativeOrder.sort((a, b) => b.initiative - a.initiative);
        }
    }

    nextTurn() {
        if (this.initiativeOrder.length === 0) return;
        let safety = this.initiativeOrder.length + 1;
        do {
            this.currentTurnIndex++;
            if (this.currentTurnIndex >= this.initiativeOrder.length) {
                this.currentTurnIndex = 0;
                this.round++;
                this.logEvent(`Round ${this.round}`);
            }
            safety--;
        } while (this.autoSkipDefeated && this._isDefeatedEntry(this.initiativeOrder[this.currentTurnIndex]) && safety > 0);
    }

    prevTurn() {
        this.currentTurnIndex--;
        if (this.currentTurnIndex < 0) {
            this.currentTurnIndex = Math.max(0, this.initiativeOrder.length - 1);
            this.round = Math.max(1, this.round - 1);
        }
    }

    getCurrentTurn() {
        return this.initiativeOrder[this.currentTurnIndex] || null;
    }

    // ─── Creature Lookup ───────────────────────────────────────

    findCreature(instanceId) {
        return this.monsters.find(m => m.instanceId === instanceId)
            || this.players.find(p => p.instanceId === instanceId)
            || null;
    }

    _isDefeatedEntry(entry) {
        if (!entry) return false;
        const creature = this.findCreature(entry.instanceId);
        if (!creature) return false;
        if (creature.type === 'player') {
            return creature.deathSaves?.dead || false;
        }
        return creature.currentHp <= 0;
    }

    // ─── HP Management ─────────────────────────────────────────

    damage(instanceId, amount) {
        const creature = this.findCreature(instanceId);
        if (!creature) return null;

        const oldHp = creature.currentHp;
        creature.currentHp = Math.max(0, creature.currentHp - amount);
        this.logEvent(`${creature.name} takes ${amount} damage (${oldHp} → ${creature.currentHp} HP)`);

        const result = { creature, oldHp, newHp: creature.currentHp };

        if (creature.concentration?.active && amount > 0) {
            const dc = Math.max(10, Math.floor(amount / 2));
            result.concentrationCheck = dc;
            this.logEvent(`${creature.name} must make DC ${dc} CON save to maintain concentration`);
        }

        if (creature.currentHp <= 0 && creature.type === 'player' && oldHp > 0) {
            creature.deathSaves = { successes: 0, failures: 0, stabilized: false, dead: false };
            this.logEvent(`${creature.name} is dying!`);
        }

        return result;
    }

    heal(instanceId, amount) {
        const creature = this.findCreature(instanceId);
        if (!creature) return;

        const max = creature.hp || creature.maxHp || 999;
        const oldHp = creature.currentHp;
        creature.currentHp = Math.min(max, creature.currentHp + amount);
        this.logEvent(`${creature.name} healed ${amount} (${oldHp} → ${creature.currentHp} HP)`);

        if (creature.type === 'player' && oldHp <= 0 && creature.currentHp > 0) {
            creature.deathSaves = { successes: 0, failures: 0, stabilized: false, dead: false };
            this.logEvent(`${creature.name} is stabilized!`);
        }
    }

    isDefeated(instanceId) {
        const creature = this.findCreature(instanceId);
        if (!creature) return false;
        if (creature.type === 'player') return creature.deathSaves?.dead || false;
        return creature.currentHp <= 0;
    }

    // ─── Conditions ────────────────────────────────────────────

    addCondition(instanceId, conditionId) {
        const creature = this.findCreature(instanceId);
        if (!creature) return;
        if (!creature.conditions) creature.conditions = [];
        if (!creature.conditions.includes(conditionId)) {
            creature.conditions.push(conditionId);
            this.logEvent(`${creature.name} gains condition: ${conditionId}`);
        }
    }

    removeCondition(instanceId, conditionId) {
        const creature = this.findCreature(instanceId);
        if (!creature || !creature.conditions) return;
        creature.conditions = creature.conditions.filter(c => c !== conditionId);
        this.logEvent(`${creature.name} loses condition: ${conditionId}`);
    }

    getConditions(instanceId) {
        const creature = this.findCreature(instanceId);
        return creature?.conditions || [];
    }

    // ─── Death Saves ───────────────────────────────────────────

    markDeathSave(instanceId, type, value) {
        const creature = this.findCreature(instanceId);
        if (!creature || !creature.deathSaves) return;

        if (type === 'success') {
            creature.deathSaves.successes = Math.min(3, Math.max(0, value));
            if (creature.deathSaves.successes >= 3) {
                creature.deathSaves.stabilized = true;
                this.logEvent(`${creature.name} stabilized!`);
            }
        } else {
            creature.deathSaves.failures = Math.min(3, Math.max(0, value));
            if (creature.deathSaves.failures >= 3) {
                creature.deathSaves.dead = true;
                this.logEvent(`${creature.name} has died!`);
            }
        }
    }

    // ─── Concentration ─────────────────────────────────────────

    setConcentration(instanceId, active, spell = '') {
        const creature = this.findCreature(instanceId);
        if (!creature) return;
        if (!creature.concentration) creature.concentration = { active: false, spell: '' };
        creature.concentration.active = active;
        creature.concentration.spell = spell;
        if (active) {
            this.logEvent(`${creature.name} concentrating on: ${spell || 'a spell'}`);
        } else {
            this.logEvent(`${creature.name} lost concentration`);
        }
    }

    // ─── Combat Log ────────────────────────────────────────────

    logEvent(message) {
        this.combatLog.push({
            round: this.round,
            time: Date.now(),
            message,
        });
    }

    // ─── XP ────────────────────────────────────────────────────

    getTotalMonsterXP() {
        return this.monsters.reduce((sum, m) => sum + m.xp, 0);
    }

    // ─── Serialization ─────────────────────────────────────────

    toJSON() {
        return {
            name: this.name,
            party: { ...this.party },
            monsters: this.monsters.map(m => ({
                name: m.name, cr: m.cr, xp: m.xp, ac: m.ac,
                hp: m.hp, hpFormula: m.hpFormula, type: m.type,
                size: m.size, initiativeBonus: m.initiativeBonus,
                instanceId: m.instanceId, currentHp: m.currentHp,
                initiative: m.initiative,
                conditions: [...(m.conditions || [])],
                concentration: m.concentration ? { ...m.concentration } : { active: false, spell: '' },
            })),
            players: this.players.map(p => ({
                name: p.name, instanceId: p.instanceId,
                initiative: p.initiative, type: 'player',
                currentHp: p.currentHp, maxHp: p.maxHp,
                conditions: [...(p.conditions || [])],
                concentration: p.concentration ? { ...p.concentration } : { active: false, spell: '' },
                deathSaves: p.deathSaves ? { ...p.deathSaves } : { successes: 0, failures: 0, stabilized: false, dead: false },
            })),
            initiativeOrder: this.initiativeOrder.map(e => ({ ...e })),
            currentTurnIndex: this.currentTurnIndex,
            round: this.round,
            combatLog: [...this.combatLog],
            autoSkipDefeated: this.autoSkipDefeated,
        };
    }

    static fromJSON(json) {
        const state = new EncounterState();
        state.name = json.name || 'Loaded Encounter';
        state.party = json.party || { size: 4, level: 1 };
        state.monsters = (json.monsters || []).map(m => ({
            ...m,
            instanceId: m.instanceId || nextId++,
            currentHp: m.currentHp ?? m.hp,
            initiative: m.initiative || 0,
            conditions: m.conditions || [],
            concentration: m.concentration || { active: false, spell: '' },
        }));
        state.players = (json.players || []).map(p => ({
            ...p,
            instanceId: p.instanceId || nextId++,
            type: 'player',
            currentHp: p.currentHp || 0,
            maxHp: p.maxHp || 0,
            conditions: p.conditions || [],
            concentration: p.concentration || { active: false, spell: '' },
            deathSaves: p.deathSaves || { successes: 0, failures: 0, stabilized: false, dead: false },
        }));
        if (json.initiativeOrder && json.initiativeOrder.length > 0) {
            state.initiativeOrder = json.initiativeOrder;
            state.currentTurnIndex = json.currentTurnIndex || 0;
            state.round = json.round || 1;
        }
        state.combatLog = json.combatLog || [];
        state.autoSkipDefeated = json.autoSkipDefeated || false;
        return state;
    }
}
