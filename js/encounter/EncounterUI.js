import { EncounterState } from './EncounterState.js';
import { DifficultyCalc } from './DifficultyCalc.js';
import { InitiativeTracker } from './InitiativeTracker.js';
import { EncounterIO } from './EncounterIO.js';
import { MONSTERS, searchMonsters } from '../data/monsters.js';
import { formatCR } from '../data/encounter-tables.js';
import { el, $, clearChildren, showModal } from '../utils/dom.js';

export class EncounterUI {
    constructor(container) {
        this.container = container;
        this.state = new EncounterState();
        this.tracker = new InitiativeTracker(this.state);
        this.mode = 'setup'; // 'setup' | 'combat'
        this.searchQuery = '';
        this.render();
    }

    render() {
        clearChildren(this.container);
        if (this.mode === 'setup') {
            this._renderSetup();
        } else {
            this._renderCombat();
        }
    }

    // ─── SETUP MODE ──────────────────────────────────────────

    _renderSetup() {
        const layout = el('div', { className: 'encounter-layout' });

        // Left column
        const left = el('div', { className: 'encounter-left' });
        left.appendChild(this._buildPartyConfig());
        left.appendChild(this._buildMonsterBrowser());
        layout.appendChild(left);

        // Right column
        const right = el('div', { className: 'encounter-right' });
        right.appendChild(this._buildEncounterSummary());
        right.appendChild(this._buildActionBar());
        layout.appendChild(right);

        this.container.appendChild(layout);
    }

    _buildPartyConfig() {
        const card = el('div', { className: 'card' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'Party Configuration' }));

        const row = el('div', { className: 'form-row' });

        const sizeGroup = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Party Size' }),
            el('input', {
                className: 'input input--sm',
                type: 'number',
                value: String(this.state.party.size),
                min: '1',
                max: '10',
                onInput: (e) => {
                    this.state.party.size = Math.max(1, Math.min(10, parseInt(e.target.value) || 1));
                    this._refreshSummary();
                },
            }),
        ]);

        const levelGroup = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Party Level' }),
            el('input', {
                className: 'input input--sm',
                type: 'number',
                value: String(this.state.party.level),
                min: '1',
                max: '20',
                onInput: (e) => {
                    this.state.party.level = Math.max(1, Math.min(20, parseInt(e.target.value) || 1));
                    this._refreshSummary();
                },
            }),
        ]);

        row.appendChild(sizeGroup);
        row.appendChild(levelGroup);
        card.appendChild(row);
        return card;
    }

    _buildMonsterBrowser() {
        const card = el('div', { className: 'card encounter-monster-browser' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'Monster Browser' }));

        const search = el('input', {
            className: 'input',
            type: 'text',
            placeholder: 'Search monsters by name or type...',
            value: this.searchQuery,
            onInput: (e) => {
                this.searchQuery = e.target.value;
                this._refreshMonsterList();
            },
        });
        card.appendChild(search);

        this._monsterListEl = el('div', { className: 'monster-list' });
        this._populateMonsterList();
        card.appendChild(this._monsterListEl);

        return card;
    }

    _populateMonsterList() {
        clearChildren(this._monsterListEl);
        const monsters = searchMonsters(this.searchQuery);

        for (const monster of monsters) {
            const item = el('div', { className: 'monster-item' }, [
                el('div', { className: 'monster-item__info' }, [
                    el('span', { className: 'monster-item__name', textContent: monster.name }),
                    el('span', { className: 'monster-item__meta', textContent: `CR ${formatCR(monster.cr)} | ${monster.type} | AC ${monster.ac} | HP ${monster.hp}` }),
                ]),
                el('div', { className: 'monster-item__actions' }, [
                    el('button', {
                        className: 'btn btn--sm btn--primary',
                        textContent: '+ Add',
                        onClick: () => {
                            this.state.addMonster(monster, 1);
                            this._refreshSummary();
                        },
                    }),
                ]),
            ]);
            this._monsterListEl.appendChild(item);
        }

        if (monsters.length === 0) {
            this._monsterListEl.appendChild(
                el('p', { className: 'monster-list__empty', textContent: 'No monsters found.' })
            );
        }
    }

    _refreshMonsterList() {
        if (this._monsterListEl) {
            this._populateMonsterList();
        }
    }

    _buildEncounterSummary() {
        this._summaryCard = el('div', { className: 'card encounter-summary' });
        this._renderSummaryContent();
        return this._summaryCard;
    }

    _renderSummaryContent() {
        clearChildren(this._summaryCard);
        this._summaryCard.appendChild(el('h3', { className: 'card__header', textContent: 'Encounter Summary' }));

        const groups = this.state.getMonsterGroups();

        if (groups.length === 0) {
            this._summaryCard.appendChild(
                el('p', { className: 'encounter-summary__empty', textContent: 'Add monsters to build your encounter.' })
            );
            return;
        }

        // Monster groups
        const groupList = el('div', { className: 'encounter-groups' });
        for (const group of groups) {
            const row = el('div', { className: 'encounter-group' }, [
                el('span', { className: 'encounter-group__name', textContent: `${group.template.name} x${group.count}` }),
                el('span', { className: 'encounter-group__xp', textContent: `${group.count * group.template.xp} XP` }),
                el('button', {
                    className: 'btn btn--sm btn--danger',
                    textContent: 'Remove',
                    onClick: () => {
                        this.state.removeMonstersByName(group.template.name);
                        this._refreshSummary();
                    },
                }),
            ]);
            groupList.appendChild(row);
        }
        this._summaryCard.appendChild(groupList);

        // Difficulty calculation
        const calc = DifficultyCalc.calculate(
            this.state.party.size,
            this.state.party.level,
            this.state.monsters
        );

        const divider = el('div', { className: 'divider', textContent: 'Difficulty' });
        this._summaryCard.appendChild(divider);

        const diffClass = `badge--${calc.difficulty.toLowerCase()}`;
        const stats = el('div', { className: 'encounter-stats' }, [
            el('div', { className: 'encounter-stat' }, [
                el('span', { className: 'encounter-stat__label', textContent: 'Total XP' }),
                el('span', { className: 'encounter-stat__value', textContent: calc.rawXP.toLocaleString() }),
            ]),
            el('div', { className: 'encounter-stat' }, [
                el('span', { className: 'encounter-stat__label', textContent: 'Adjusted XP' }),
                el('span', { className: 'encounter-stat__value', textContent: `${calc.adjustedXP.toLocaleString()} (x${calc.multiplier})` }),
            ]),
            el('div', { className: 'encounter-stat encounter-stat--difficulty' }, [
                el('span', { className: 'encounter-stat__label', textContent: 'Difficulty' }),
                el('span', { className: `badge ${diffClass}`, textContent: calc.difficulty }),
            ]),
        ]);
        this._summaryCard.appendChild(stats);

        // Party thresholds
        const thresholds = el('div', { className: 'encounter-thresholds' }, [
            el('div', { className: 'encounter-threshold' }, [
                el('span', { className: 'badge badge--easy', textContent: 'Easy' }),
                el('span', { textContent: calc.partyThresholds.easy.toLocaleString() }),
            ]),
            el('div', { className: 'encounter-threshold' }, [
                el('span', { className: 'badge badge--medium', textContent: 'Medium' }),
                el('span', { textContent: calc.partyThresholds.medium.toLocaleString() }),
            ]),
            el('div', { className: 'encounter-threshold' }, [
                el('span', { className: 'badge badge--hard', textContent: 'Hard' }),
                el('span', { textContent: calc.partyThresholds.hard.toLocaleString() }),
            ]),
            el('div', { className: 'encounter-threshold' }, [
                el('span', { className: 'badge badge--deadly', textContent: 'Deadly' }),
                el('span', { textContent: calc.partyThresholds.deadly.toLocaleString() }),
            ]),
        ]);
        this._summaryCard.appendChild(thresholds);

        // Start encounter button
        if (this.state.monsters.length > 0) {
            const startBtn = el('button', {
                className: 'btn btn--primary encounter-start-btn',
                textContent: 'Start Encounter',
                onClick: () => {
                    this.mode = 'combat';
                    this.tracker.rollAll();
                    this.render();
                },
            });
            this._summaryCard.appendChild(startBtn);
        }
    }

    _refreshSummary() {
        if (this._summaryCard) {
            this._renderSummaryContent();
        }
    }

    _buildActionBar() {
        const bar = el('div', { className: 'card encounter-actions' });
        bar.appendChild(el('h3', { className: 'card__header', textContent: 'Save / Load' }));

        const row = el('div', { className: 'toolbar-actions' }, [
            el('button', {
                className: 'btn btn--sm btn--primary',
                textContent: 'Save',
                onClick: () => this._showSaveDialog(),
            }),
            el('button', {
                className: 'btn btn--sm',
                textContent: 'Load',
                onClick: () => this._showLoadDialog(),
            }),
            el('button', {
                className: 'btn btn--sm',
                textContent: 'Export',
                onClick: () => EncounterIO.exportJSON(this.state),
            }),
            el('button', {
                className: 'btn btn--sm',
                textContent: 'Import',
                onClick: () => this._triggerImport(),
            }),
            el('button', {
                className: 'btn btn--sm btn--danger',
                textContent: 'New',
                onClick: () => {
                    this.state = new EncounterState();
                    this.tracker = new InitiativeTracker(this.state);
                    this.render();
                },
            }),
        ]);
        bar.appendChild(row);
        return bar;
    }

    // ─── COMBAT MODE ─────────────────────────────────────────

    _renderCombat() {
        const layout = el('div', { className: 'combat-layout' });

        // Header
        const header = el('div', { className: 'combat-header' }, [
            el('h2', { className: 'combat-header__title', textContent: `Round ${this.tracker.getRound()}` }),
            el('div', { className: 'combat-header__actions' }, [
                el('button', {
                    className: 'btn btn--sm',
                    textContent: 'Prev',
                    onClick: () => { this.tracker.prevTurn(); this._renderCombatList(); this._updateRound(); },
                }),
                el('button', {
                    className: 'btn btn--sm btn--primary',
                    textContent: 'Next Turn',
                    onClick: () => { this.tracker.nextTurn(); this._renderCombatList(); this._updateRound(); },
                }),
                el('button', {
                    className: 'btn btn--sm btn--danger',
                    textContent: 'End Encounter',
                    onClick: () => { this.mode = 'setup'; this.render(); },
                }),
            ]),
        ]);
        this._roundTitle = header.querySelector('.combat-header__title');
        layout.appendChild(header);

        // Initiative list
        this._combatListEl = el('div', { className: 'combat-list' });
        this._renderCombatList();
        layout.appendChild(this._combatListEl);

        this.container.appendChild(layout);
    }

    _updateRound() {
        if (this._roundTitle) {
            this._roundTitle.textContent = `Round ${this.tracker.getRound()}`;
        }
    }

    _renderCombatList() {
        clearChildren(this._combatListEl);
        const order = this.tracker.getOrder();

        for (let i = 0; i < order.length; i++) {
            const entry = order[i];
            const isCurrent = i === this.state.currentTurnIndex;
            const isMonster = entry.type === 'monster';
            const creature = isMonster ? this.state.findCreature(entry.instanceId) : null;
            const defeated = creature ? creature.currentHp <= 0 : false;

            const row = el('div', {
                className: `combat-entry ${isCurrent ? 'combat-entry--active animate-turn' : ''} ${defeated ? 'combat-entry--defeated' : ''}`,
            });

            // Turn indicator
            row.appendChild(el('div', {
                className: 'combat-entry__indicator',
                textContent: isCurrent ? '\u{25B6}' : '',
            }));

            // Initiative
            if (entry.type === 'player') {
                const initInput = el('input', {
                    className: 'input input--sm combat-init-input',
                    type: 'number',
                    value: String(entry.initiative),
                    onInput: (e) => {
                        this.tracker.setPlayerInitiative(entry.instanceId, e.target.value);
                        // Don't re-render to avoid losing focus; sort on next action
                    },
                });
                row.appendChild(initInput);
            } else {
                row.appendChild(el('span', {
                    className: 'combat-entry__init',
                    textContent: entry.initiative,
                }));
            }

            // Name & Type
            const nameEl = el('div', { className: 'combat-entry__name' }, [
                el('span', { textContent: entry.name }),
                el('span', {
                    className: 'combat-entry__type',
                    textContent: entry.type === 'player' ? 'PC' : `CR ${formatCR(creature?.cr ?? 0)}`,
                }),
            ]);
            row.appendChild(nameEl);

            // HP bar + controls (monsters only)
            if (isMonster && creature) {
                const hpPct = Math.max(0, (creature.currentHp / creature.hp) * 100);
                let hpColor = '#4caf50';
                if (hpPct <= 25) hpColor = '#dc143c';
                else if (hpPct <= 50) hpColor = '#e67e22';
                else if (hpPct <= 75) hpColor = '#f0c040';

                const hpBar = el('div', { className: 'hp-bar' }, [
                    el('div', {
                        className: 'hp-bar__fill',
                        style: `width: ${hpPct}%; background-color: ${hpColor};`,
                    }),
                    el('div', {
                        className: 'hp-bar__text',
                        textContent: `${creature.currentHp} / ${creature.hp}`,
                    }),
                ]);
                row.appendChild(hpBar);

                // Damage/heal controls
                const hpInput = el('input', {
                    className: 'input input--sm combat-hp-input',
                    type: 'number',
                    value: '0',
                    min: '0',
                });
                const controls = el('div', { className: 'combat-entry__controls' }, [
                    el('button', {
                        className: 'btn btn--sm btn--danger',
                        textContent: 'DMG',
                        onClick: () => {
                            const val = parseInt(hpInput.value) || 0;
                            if (val > 0) {
                                this.tracker.damage(entry.instanceId, val);
                                hpInput.value = '0';
                                this._renderCombatList();
                            }
                        },
                    }),
                    hpInput,
                    el('button', {
                        className: 'btn btn--sm',
                        style: 'border-color: #4caf50; color: #4caf50;',
                        textContent: 'HEAL',
                        onClick: () => {
                            const val = parseInt(hpInput.value) || 0;
                            if (val > 0) {
                                this.tracker.heal(entry.instanceId, val);
                                hpInput.value = '0';
                                this._renderCombatList();
                            }
                        },
                    }),
                ]);
                row.appendChild(controls);

                // AC display
                row.appendChild(el('span', {
                    className: 'combat-entry__ac',
                    textContent: `AC ${creature.ac}`,
                }));
            }

            this._combatListEl.appendChild(row);
        }
    }

    // ─── SAVE / LOAD ──────────────────────────────────────────

    _showSaveDialog() {
        const input = el('input', {
            className: 'input',
            type: 'text',
            placeholder: 'Enter encounter name...',
        });
        const wrapper = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Encounter Name' }),
            input,
        ]);
        showModal('Save Encounter', wrapper, () => {
            const name = input.value.trim();
            if (name) EncounterIO.save(name, this.state);
        });
        setTimeout(() => input.focus(), 100);
    }

    _showLoadDialog() {
        const saved = EncounterIO.listSaved();
        if (saved.length === 0) {
            showModal('Load Encounter', el('p', { textContent: 'No saved encounters found.' }));
            return;
        }

        const list = el('div', { className: 'save-list' });
        for (const name of saved) {
            const row = el('div', { className: 'save-list__item' }, [
                el('span', { textContent: name, className: 'save-list__name' }),
                el('button', {
                    className: 'btn btn--sm btn--primary',
                    textContent: 'Load',
                    onClick: () => {
                        const loaded = EncounterIO.load(name);
                        if (loaded) {
                            this.state = loaded;
                            this.tracker = new InitiativeTracker(this.state);
                            this.mode = 'setup';
                            this.render();
                        }
                        document.querySelector('.modal-overlay')?.remove();
                    },
                }),
                el('button', {
                    className: 'btn btn--sm btn--danger',
                    textContent: 'Del',
                    onClick: () => {
                        EncounterIO.delete(name);
                        row.remove();
                    },
                }),
            ]);
            list.appendChild(row);
        }
        showModal('Load Encounter', list);
    }

    _triggerImport() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.addEventListener('change', async () => {
            if (input.files.length === 0) return;
            try {
                const loaded = await EncounterIO.importJSON(input.files[0]);
                this.state = loaded;
                this.tracker = new InitiativeTracker(this.state);
                this.mode = 'setup';
                this.render();
            } catch (err) {
                console.error('Import failed:', err);
            }
        });
        input.click();
    }
}
