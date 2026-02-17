import { rollInitiative } from '../utils/dice.js';

let nextId = 1;

export class EncounterState {
    constructor() {
        this.name = 'New Encounter';
        this.party = { size: 4, level: 1 };
        this.monsters = []; // Array of { ...monsterData, instanceId, currentHp }
        this.players = []; // Array of { name, initiative, instanceId }
        this.initiativeOrder = [];
        this.currentTurnIndex = 0;
        this.round = 1;
    }

    addMonster(template, count = 1) {
        for (let i = 0; i < count; i++) {
            this.monsters.push({
                ...template,
                instanceId: nextId++,
                currentHp: template.hp,
                initiative: 0,
                conditions: [],
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

    initPlayers() {
        this.players = [];
        for (let i = 0; i < this.party.size; i++) {
            this.players.push({
                name: `Player ${i + 1}`,
                initiative: 0,
                instanceId: nextId++,
                type: 'player',
            });
        }
    }

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
        this.currentTurnIndex++;
        if (this.currentTurnIndex >= this.initiativeOrder.length) {
            this.currentTurnIndex = 0;
            this.round++;
        }
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

    findCreature(instanceId) {
        return this.monsters.find(m => m.instanceId === instanceId) || null;
    }

    damage(instanceId, amount) {
        const creature = this.findCreature(instanceId);
        if (creature) {
            creature.currentHp = Math.max(0, creature.currentHp - amount);
        }
    }

    heal(instanceId, amount) {
        const creature = this.findCreature(instanceId);
        if (creature) {
            creature.currentHp = Math.min(creature.hp, creature.currentHp + amount);
        }
    }

    isDefeated(instanceId) {
        const creature = this.findCreature(instanceId);
        return creature ? creature.currentHp <= 0 : false;
    }

    getTotalMonsterXP() {
        return this.monsters.reduce((sum, m) => sum + m.xp, 0);
    }

    toJSON() {
        return {
            name: this.name,
            party: { ...this.party },
            monsters: this.monsters.map(m => ({
                name: m.name, cr: m.cr, xp: m.xp, ac: m.ac,
                hp: m.hp, hpFormula: m.hpFormula, type: m.type,
                size: m.size, initiativeBonus: m.initiativeBonus,
                instanceId: m.instanceId, currentHp: m.currentHp,
            })),
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
            initiative: 0,
            conditions: [],
        }));
        return state;
    }
}
