export class InitiativeTracker {
    constructor(encounterState) {
        this.state = encounterState;
    }

    rollAll() {
        this.state.initPlayers();
        this.state.rollAllInitiative();
    }

    setPlayerInitiative(instanceId, value) {
        this.state.setPlayerInitiative(instanceId, parseInt(value) || 0);
    }

    setPlayerName(instanceId, name) {
        this.state.setPlayerName(instanceId, name);
    }

    setPlayerMaxHp(instanceId, maxHp) {
        this.state.setPlayerMaxHp(instanceId, parseInt(maxHp) || 0);
    }

    nextTurn() {
        this.state.nextTurn();
    }

    prevTurn() {
        this.state.prevTurn();
    }

    getCurrentTurn() {
        return this.state.getCurrentTurn();
    }

    damage(instanceId, amount) {
        return this.state.damage(instanceId, parseInt(amount) || 0);
    }

    heal(instanceId, amount) {
        this.state.heal(instanceId, parseInt(amount) || 0);
    }

    addCondition(instanceId, conditionId) {
        this.state.addCondition(instanceId, conditionId);
    }

    removeCondition(instanceId, conditionId) {
        this.state.removeCondition(instanceId, conditionId);
    }

    getConditions(instanceId) {
        return this.state.getConditions(instanceId);
    }

    markDeathSave(instanceId, type, value) {
        this.state.markDeathSave(instanceId, type, value);
    }

    setConcentration(instanceId, active, spell) {
        this.state.setConcentration(instanceId, active, spell);
    }

    saveRoster() {
        this.state.saveRoster();
    }

    getRound() {
        return this.state.round;
    }

    getOrder() {
        return this.state.initiativeOrder;
    }

    getCombatLog() {
        return this.state.combatLog;
    }

    isCurrentTurn(instanceId) {
        const current = this.getCurrentTurn();
        return current && current.instanceId === instanceId;
    }
}
