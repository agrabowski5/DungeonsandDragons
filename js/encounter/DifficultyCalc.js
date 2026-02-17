import { XP_THRESHOLDS, getMultiplier, DIFFICULTY_LABELS } from '../data/encounter-tables.js';

export class DifficultyCalc {
    static calculate(partySize, partyLevel, monsters) {
        const level = Math.max(1, Math.min(20, partyLevel));
        const thresholds = XP_THRESHOLDS[level] || XP_THRESHOLDS[1];

        const partyThresholds = {
            easy: thresholds[0] * partySize,
            medium: thresholds[1] * partySize,
            hard: thresholds[2] * partySize,
            deadly: thresholds[3] * partySize,
        };

        const rawXP = monsters.reduce((sum, m) => sum + m.xp, 0);
        const multiplier = getMultiplier(monsters.length);
        const adjustedXP = Math.floor(rawXP * multiplier);

        let difficulty = 'Trivial';
        if (adjustedXP >= partyThresholds.deadly) difficulty = 'Deadly';
        else if (adjustedXP >= partyThresholds.hard) difficulty = 'Hard';
        else if (adjustedXP >= partyThresholds.medium) difficulty = 'Medium';
        else if (adjustedXP >= partyThresholds.easy) difficulty = 'Easy';

        return {
            rawXP,
            adjustedXP,
            multiplier,
            partyThresholds,
            difficulty,
        };
    }
}
