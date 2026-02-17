export function rollD(sides) {
    return Math.floor(Math.random() * sides) + 1;
}

export function rollD20() {
    return rollD(20);
}

export function rollInitiative(bonus = 0) {
    return rollD20() + bonus;
}

export function rollFormula(formula) {
    const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/);
    if (!match) return 0;
    const [, count, sides, mod] = match;
    let total = 0;
    for (let i = 0; i < parseInt(count); i++) {
        total += rollD(parseInt(sides));
    }
    return total + (parseInt(mod) || 0);
}

export function abilityMod(score) {
    return Math.floor((score - 10) / 2);
}
