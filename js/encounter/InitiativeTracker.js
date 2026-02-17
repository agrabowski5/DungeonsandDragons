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
        this.state.damage(instanceId, parseInt(amount) || 0);
    }

    heal(instanceId, amount) {
        this.state.heal(instanceId, parseInt(amount) || 0);
    }

    getRound() {
        return this.state.round;
    }

    getOrder() {
        return this.state.initiativeOrder;
    }

    isCurrentTurn(instanceId) {
        const current = this.getCurrentTurn();
        return current && current.instanceId === instanceId;
    }
}
