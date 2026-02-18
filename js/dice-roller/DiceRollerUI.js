import { el, $, clearChildren } from '../utils/dom.js';
import { rollD, rollD20, rollFormula } from '../utils/dice.js';
import { DiceRollerState } from './DiceRollerState.js';
import { DiceAnimator } from './DiceAnimator.js';

const DICE_TYPES = [
    { sides: 4,   label: 'd4',   color: '#e74c3c',  shape: 'triangle' },
    { sides: 6,   label: 'd6',   color: '#e67e22',  shape: 'square' },
    { sides: 8,   label: 'd8',   color: '#f1c40f',  shape: 'diamond' },
    { sides: 10,  label: 'd10',  color: '#2ecc71',  shape: 'pentagon' },
    { sides: 12,  label: 'd12',  color: '#3498db',  shape: 'hexagon' },
    { sides: 20,  label: 'd20',  color: '#9b59b6',  shape: 'icosahedron' },
    { sides: 100, label: 'd100', color: '#e91e63',  shape: 'circle' },
];

export class DiceRollerUI {
    constructor(container) {
        this.container = container;
        this.state = new DiceRollerState();
        this.animator = new DiceAnimator();
        this._dieButtons = new Map();
        this._isRolling = false;
        this.render();
    }

    render() {
        clearChildren(this.container);

        const wrapper = el('div', { className: 'dice-roller' });

        // Title
        wrapper.appendChild(el('h2', {
            className: 'dice-roller__title',
            textContent: 'Dice Roller',
        }));

        // Main area: dice + result + controls
        const mainArea = el('div', { className: 'dice-roller__main' });

        // Die buttons row
        mainArea.appendChild(this._buildDiceRow());

        // Result display
        this._resultContainer = this._buildResultDisplay();
        mainArea.appendChild(this._resultContainer);

        // Controls row: advantage, modifier, formula
        mainArea.appendChild(this._buildControls());

        wrapper.appendChild(mainArea);

        // History section
        wrapper.appendChild(this._buildHistory());

        this.container.appendChild(wrapper);
    }

    // ---- Die Buttons -------------------------------------------------------

    _buildDiceRow() {
        const row = el('div', { className: 'dice-row' });

        for (const die of DICE_TYPES) {
            const btn = this._buildDieButton(die);
            this._dieButtons.set(die.sides, btn);
            row.appendChild(btn);
        }

        return row;
    }

    _buildDieButton(die) {
        const svg = this._createDieSVG(die);

        const label = el('span', {
            className: 'dice-btn__label',
            textContent: die.label,
        });

        const btn = el('button', {
            className: 'dice-btn',
            'data-tooltip': `Roll ${die.label}`,
            'aria-label': `Roll ${die.label}`,
            onClick: () => this._rollDie(die, btn),
        }, [svg, label]);

        btn.style.setProperty('--die-color', die.color);

        return btn;
    }

    _createDieSVG(die) {
        const svgNS = 'http://www.w3.org/2000/svg';
        const svg = document.createElementNS(svgNS, 'svg');
        svg.setAttribute('viewBox', '0 0 80 80');
        svg.setAttribute('class', 'dice-btn__svg');
        svg.setAttribute('aria-hidden', 'true');

        const shape = document.createElementNS(svgNS, 'g');

        switch (die.shape) {
            case 'triangle': { // d4
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', '40,8 72,68 8,68');
                poly.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(poly);
                break;
            }
            case 'square': { // d6
                const rect = document.createElementNS(svgNS, 'rect');
                rect.setAttribute('x', '12');
                rect.setAttribute('y', '12');
                rect.setAttribute('width', '56');
                rect.setAttribute('height', '56');
                rect.setAttribute('rx', '6');
                rect.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(rect);
                break;
            }
            case 'diamond': { // d8
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', '40,4 74,40 40,76 6,40');
                poly.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(poly);
                break;
            }
            case 'pentagon': { // d10
                const pts = this._regularPolygon(40, 40, 34, 5, -90);
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', pts);
                poly.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(poly);
                break;
            }
            case 'hexagon': { // d12
                const pts = this._regularPolygon(40, 40, 36, 6, -90);
                const poly = document.createElementNS(svgNS, 'polygon');
                poly.setAttribute('points', pts);
                poly.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(poly);
                break;
            }
            case 'icosahedron': { // d20 - triangle with inner detail
                const outer = document.createElementNS(svgNS, 'polygon');
                outer.setAttribute('points', '40,4 76,68 4,68');
                outer.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(outer);
                // Inner inverted triangle for d20 look
                const inner = document.createElementNS(svgNS, 'polygon');
                inner.setAttribute('points', '40,56 22,24 58,24');
                inner.setAttribute('class', 'dice-btn__shape-inner');
                shape.appendChild(inner);
                break;
            }
            case 'circle': { // d100
                const circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('cx', '40');
                circle.setAttribute('cy', '40');
                circle.setAttribute('r', '34');
                circle.setAttribute('class', 'dice-btn__shape');
                shape.appendChild(circle);
                // Second smaller circle for percentile look
                const inner = document.createElementNS(svgNS, 'circle');
                inner.setAttribute('cx', '40');
                inner.setAttribute('cy', '40');
                inner.setAttribute('r', '22');
                inner.setAttribute('class', 'dice-btn__shape-inner');
                shape.appendChild(inner);
                break;
            }
        }

        svg.appendChild(shape);
        return svg;
    }

    _regularPolygon(cx, cy, r, sides, startAngle) {
        const pts = [];
        for (let i = 0; i < sides; i++) {
            const angle = (startAngle + (360 / sides) * i) * (Math.PI / 180);
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
        }
        return pts.join(' ');
    }

    // ---- Result Display ----------------------------------------------------

    _buildResultDisplay() {
        const container = el('div', { className: 'dice-result' });

        this._resultLabel = el('div', {
            className: 'dice-result__label',
            textContent: 'Roll a die to begin',
        });

        this._resultNumber = el('div', {
            className: 'dice-result__number',
            textContent: '--',
        });

        this._resultDetail = el('div', { className: 'dice-result__detail' });

        container.appendChild(this._resultLabel);
        container.appendChild(this._resultNumber);
        container.appendChild(this._resultDetail);

        return container;
    }

    // ---- Controls ----------------------------------------------------------

    _buildControls() {
        const controls = el('div', { className: 'dice-controls' });

        // Advantage / Disadvantage toggles
        const advRow = el('div', { className: 'dice-controls__adv-row' });

        this._advBtn = el('button', {
            className: 'btn dice-controls__adv-btn',
            textContent: 'Advantage',
            'data-tooltip': 'Roll 2d20, keep highest',
            onClick: () => {
                this.state.toggleAdvantageMode('advantage');
                this._updateAdvButtons();
            },
        });

        this._disadvBtn = el('button', {
            className: 'btn dice-controls__adv-btn',
            textContent: 'Disadvantage',
            'data-tooltip': 'Roll 2d20, keep lowest',
            onClick: () => {
                this.state.toggleAdvantageMode('disadvantage');
                this._updateAdvButtons();
            },
        });

        advRow.appendChild(this._advBtn);
        advRow.appendChild(this._disadvBtn);
        controls.appendChild(advRow);

        // Modifier input
        const modGroup = el('div', { className: 'dice-controls__mod-group' });
        modGroup.appendChild(el('label', {
            className: 'label',
            textContent: 'Modifier',
        }));

        this._modInput = el('input', {
            className: 'input input--sm dice-controls__mod-input',
            type: 'number',
            value: '0',
            onInput: (e) => {
                this.state.setModifier(e.target.value);
            },
        });
        modGroup.appendChild(this._modInput);
        controls.appendChild(modGroup);

        // Formula input
        const formulaGroup = el('div', { className: 'dice-controls__formula-group' });
        formulaGroup.appendChild(el('label', {
            className: 'label',
            textContent: 'Custom Formula',
        }));

        const formulaRow = el('div', { className: 'dice-controls__formula-row' });

        this._formulaInput = el('input', {
            className: 'input dice-controls__formula-input',
            type: 'text',
            placeholder: '2d6+3',
            onKeydown: (e) => {
                if (e.key === 'Enter') this._rollFormula();
            },
        });

        const formulaBtn = el('button', {
            className: 'btn btn--primary dice-controls__formula-btn',
            textContent: 'Roll',
            onClick: () => this._rollFormula(),
        });

        formulaRow.appendChild(this._formulaInput);
        formulaRow.appendChild(formulaBtn);
        formulaGroup.appendChild(formulaRow);
        controls.appendChild(formulaGroup);

        this._updateAdvButtons();
        return controls;
    }

    _updateAdvButtons() {
        const mode = this.state.getAdvantageMode();

        this._advBtn.classList.toggle('btn--active', mode === 'advantage');
        this._advBtn.classList.toggle('dice-controls__adv-btn--active', mode === 'advantage');

        this._disadvBtn.classList.toggle('btn--active', mode === 'disadvantage');
        this._disadvBtn.classList.toggle('dice-controls__disadv-btn--active', mode === 'disadvantage');
    }

    // ---- History -----------------------------------------------------------

    _buildHistory() {
        const section = el('div', { className: 'dice-history card' });

        const header = el('div', { className: 'dice-history__header' });
        header.appendChild(el('h3', {
            className: 'card__header dice-history__title',
            textContent: 'Roll History',
        }));

        const clearBtn = el('button', {
            className: 'btn btn--sm btn--danger',
            textContent: 'Clear History',
            onClick: () => {
                this.state.clearHistory();
                this._renderHistoryList();
            },
        });
        header.appendChild(clearBtn);
        section.appendChild(header);

        this._historyList = el('div', { className: 'dice-history__list' });
        section.appendChild(this._historyList);

        this._renderHistoryList();
        return section;
    }

    _renderHistoryList() {
        clearChildren(this._historyList);
        const history = this.state.getHistory();

        if (history.length === 0) {
            this._historyList.appendChild(el('div', {
                className: 'dice-history__empty',
                textContent: 'No rolls yet. Click a die to get started!',
            }));
            return;
        }

        for (const entry of history) {
            this._historyList.appendChild(this._buildHistoryEntry(entry));
        }
    }

    _buildHistoryEntry(entry) {
        const time = new Date(entry.timestamp);
        const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

        const row = el('div', { className: 'dice-history__entry' });

        // Timestamp
        row.appendChild(el('span', {
            className: 'dice-history__time',
            textContent: timeStr,
        }));

        // Die type badge
        const dieBadge = el('span', {
            className: `dice-history__die dice-history__die--${entry.dieType}`,
            textContent: entry.dieType === 'formula' ? entry.formula : entry.dieType,
        });
        row.appendChild(dieBadge);

        // Rolls detail
        let rollsText = entry.rolls.join(', ');
        if (entry.advantageMode) {
            const kept = entry.keptRoll;
            const discarded = entry.discardedRoll;
            rollsText = entry.rolls.map((r) => {
                if (r === kept && kept !== discarded) {
                    return r;
                }
                return r;
            }).join(', ');
        }
        row.appendChild(el('span', {
            className: 'dice-history__rolls',
            textContent: `[${rollsText}]`,
        }));

        // Modifier
        const modStr = entry.modifier > 0 ? `+${entry.modifier}` : entry.modifier < 0 ? `${entry.modifier}` : '';
        if (modStr) {
            row.appendChild(el('span', {
                className: 'dice-history__mod',
                textContent: modStr,
            }));
        }

        // Total
        const totalEl = el('span', {
            className: 'dice-history__total',
            textContent: entry.total,
        });

        // Highlight nat 20 / nat 1 on d20
        if (entry.dieType === 'd20') {
            const keptVal = entry.keptRoll ?? entry.rolls[0];
            if (keptVal === 20) totalEl.classList.add('dice-history__total--crit');
            if (keptVal === 1) totalEl.classList.add('dice-history__total--fumble');
        }

        row.appendChild(totalEl);

        // Advantage indicator
        if (entry.advantageMode) {
            const advLabel = entry.advantageMode === 'advantage' ? 'ADV' : 'DIS';
            const advClass = entry.advantageMode === 'advantage'
                ? 'dice-history__adv--advantage'
                : 'dice-history__adv--disadvantage';
            row.appendChild(el('span', {
                className: `dice-history__adv ${advClass}`,
                textContent: advLabel,
            }));
        }

        return row;
    }

    // ---- Roll Logic --------------------------------------------------------

    async _rollDie(die, btnEl) {
        if (this._isRolling) return;
        this._isRolling = true;

        const modifier = this.state.getModifier();
        const advMode = this.state.getAdvantageMode();
        const isD20 = die.sides === 20;
        const useAdvantage = isD20 && advMode !== 'normal';

        // Start button animation
        const shakePromise = this.animator.shakeButton(btnEl);

        let rolls;
        let keptRoll = null;
        let discardedRoll = null;
        let baseTotal;

        if (useAdvantage) {
            const roll1 = rollD(20);
            const roll2 = rollD(20);
            rolls = [roll1, roll2];

            if (advMode === 'advantage') {
                keptRoll = Math.max(roll1, roll2);
                discardedRoll = Math.min(roll1, roll2);
            } else {
                keptRoll = Math.min(roll1, roll2);
                discardedRoll = Math.max(roll1, roll2);
            }
            baseTotal = keptRoll;
        } else {
            const result = rollD(die.sides);
            rolls = [result];
            baseTotal = result;
        }

        const total = baseTotal + modifier;

        // Animate result
        this.animator.revealResult(this._resultContainer);

        // Update label
        const labelParts = [die.label];
        if (useAdvantage) {
            labelParts.push(advMode === 'advantage' ? '(Advantage)' : '(Disadvantage)');
        }
        this._resultLabel.textContent = labelParts.join(' ');

        // Cascade number animation
        const cascadePromise = this.animator.animateResult(
            this._resultNumber, total, die.sides, 600
        );

        // Update detail text
        this._updateResultDetail(rolls, modifier, keptRoll, discardedRoll, useAdvantage, advMode);

        // Check for crit/fumble on d20
        if (isD20) {
            const natRoll = keptRoll ?? rolls[0];
            if (natRoll === 20) {
                this.animator.flashCritical(this._resultContainer, 'crit');
            } else if (natRoll === 1) {
                this.animator.flashCritical(this._resultContainer, 'fumble');
            }
        }

        // Record in state
        const record = this.state.addRoll({
            dieType: die.label,
            formula: useAdvantage ? `2d20(${advMode.slice(0, 3)})` : `1${die.label}`,
            rolls,
            modifier,
            total,
            advantageMode: useAdvantage ? advMode : null,
            keptRoll,
            discardedRoll,
        });

        // Wait for animations
        await Promise.all([shakePromise, cascadePromise]);

        // Update history
        this._renderHistoryList();

        // Animate the new entry
        const firstEntry = this._historyList.firstElementChild;
        if (firstEntry) {
            this.animator.slideInEntry(firstEntry);
        }

        this._isRolling = false;
    }

    _updateResultDetail(rolls, modifier, keptRoll, discardedRoll, useAdvantage, advMode) {
        clearChildren(this._resultDetail);

        if (useAdvantage) {
            const rollsDisplay = el('span', { className: 'dice-result__rolls-detail' });

            for (let i = 0; i < rolls.length; i++) {
                const r = rolls[i];
                const isKept = r === keptRoll && (i === rolls.indexOf(keptRoll === rolls[0] ? rolls[0] : rolls[1]));
                const span = el('span', {
                    className: r === keptRoll
                        ? 'dice-result__roll--kept'
                        : 'dice-result__roll--discarded',
                    textContent: r,
                });
                rollsDisplay.appendChild(span);
                if (i < rolls.length - 1) {
                    rollsDisplay.appendChild(document.createTextNode(' | '));
                }
            }

            this._resultDetail.appendChild(rollsDisplay);
        } else {
            this._resultDetail.appendChild(el('span', {
                className: 'dice-result__base',
                textContent: `Roll: ${rolls[0]}`,
            }));
        }

        if (modifier !== 0) {
            const modSign = modifier > 0 ? '+' : '';
            this._resultDetail.appendChild(el('span', {
                className: 'dice-result__modifier',
                textContent: ` ${modSign}${modifier}`,
            }));
        }
    }

    async _rollFormula() {
        const formula = this._formulaInput.value.trim();
        if (!formula) return;

        // Validate formula format
        const match = formula.match(/^(\d+)d(\d+)([+-]\d+)?$/);
        if (!match) {
            this._resultLabel.textContent = 'Invalid formula';
            this._resultNumber.textContent = '??';
            clearChildren(this._resultDetail);
            this._resultDetail.appendChild(el('span', {
                className: 'dice-result__error',
                textContent: 'Use format: NdS or NdS+M (e.g. 2d6+3)',
            }));
            return;
        }

        if (this._isRolling) return;
        this._isRolling = true;

        const [, countStr, sidesStr, modStr] = match;
        const count = parseInt(countStr);
        const sides = parseInt(sidesStr);
        const formulaMod = parseInt(modStr) || 0;
        const inputMod = this.state.getModifier();
        const totalMod = formulaMod + inputMod;

        // Roll individual dice
        const rolls = [];
        for (let i = 0; i < count; i++) {
            rolls.push(rollD(sides));
        }
        const diceSum = rolls.reduce((sum, r) => sum + r, 0);
        const total = diceSum + totalMod;

        // Animate
        this.animator.revealResult(this._resultContainer);
        this._resultLabel.textContent = formula + (inputMod ? ` (mod ${inputMod > 0 ? '+' : ''}${inputMod})` : '');

        const cascadePromise = this.animator.animateResult(
            this._resultNumber, total, sides * count, 600
        );

        // Detail
        clearChildren(this._resultDetail);
        this._resultDetail.appendChild(el('span', {
            className: 'dice-result__base',
            textContent: `Rolls: [${rolls.join(', ')}] = ${diceSum}`,
        }));
        if (totalMod !== 0) {
            const sign = totalMod > 0 ? '+' : '';
            this._resultDetail.appendChild(el('span', {
                className: 'dice-result__modifier',
                textContent: ` ${sign}${totalMod}`,
            }));
        }

        // Record
        this.state.addRoll({
            dieType: 'formula',
            formula,
            rolls,
            modifier: totalMod,
            total,
        });

        await cascadePromise;

        this._renderHistoryList();
        const firstEntry = this._historyList.firstElementChild;
        if (firstEntry) {
            this.animator.slideInEntry(firstEntry);
        }

        this._isRolling = false;
    }
}
