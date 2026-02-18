import { EncounterState } from './EncounterState.js';
import { DifficultyCalc } from './DifficultyCalc.js';
import { InitiativeTracker } from './InitiativeTracker.js';
import { EncounterIO } from './EncounterIO.js';
import { CONDITIONS } from '../data/conditions.js';
import { MONSTERS, searchMonsters } from '../data/monsters.js';
import { formatCR } from '../data/encounter-tables.js';
import { el, $, clearChildren, showModal } from '../utils/dom.js';

const CONDITION_MAP = {};
for (const c of CONDITIONS) CONDITION_MAP[c.id] = c;

export class EncounterUI {
    constructor(container) {
        this.container = container;
        this.state = new EncounterState();
        this.state.loadRoster();
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

        const left = el('div', { className: 'encounter-left' });
        left.appendChild(this._buildPartyConfig());
        left.appendChild(this._buildMonsterBrowser());
        layout.appendChild(left);

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
                    this._refreshPlayerNames();
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

        // Player name inputs
        this._playerNamesEl = el('div', { className: 'party-names' });
        this._buildPlayerNames();
        card.appendChild(this._playerNamesEl);

        const saveRosterBtn = el('button', {
            className: 'btn btn--sm',
            textContent: 'Save Roster',
            style: 'margin-top: 8px;',
            onClick: () => {
                this._syncPlayersFromInputs();
                this.state.saveRoster();
            },
        });
        card.appendChild(saveRosterBtn);

        return card;
    }

    _buildPlayerNames() {
        clearChildren(this._playerNamesEl);
        this._playerNamesEl.appendChild(
            el('div', { className: 'toolbar-section__title', textContent: 'Player Names & HP', style: 'margin-top: 8px;' })
        );
        const roster = this.state._savedRoster || [];
        this._playerInputs = [];

        for (let i = 0; i < this.state.party.size; i++) {
            const saved = roster[i];
            const row = el('div', { className: 'form-row party-name-row' });
            const nameInput = el('input', {
                className: 'input input--sm',
                type: 'text',
                placeholder: `Player ${i + 1}`,
                value: saved ? saved.name : `Player ${i + 1}`,
            });
            const hpInput = el('input', {
                className: 'input input--sm party-hp-input',
                type: 'number',
                placeholder: 'Max HP',
                value: saved && saved.maxHp ? String(saved.maxHp) : '',
                min: '0',
            });
            row.appendChild(nameInput);
            row.appendChild(hpInput);
            this._playerNamesEl.appendChild(row);
            this._playerInputs.push({ nameInput, hpInput });
        }
    }

    _refreshPlayerNames() {
        if (this._playerNamesEl) this._buildPlayerNames();
    }

    _syncPlayersFromInputs() {
        if (!this._playerInputs) return;
        const roster = [];
        for (const { nameInput, hpInput } of this._playerInputs) {
            roster.push({
                name: nameInput.value.trim() || nameInput.placeholder,
                maxHp: parseInt(hpInput.value) || 0,
            });
        }
        this.state._savedRoster = roster;
        this.state.party.size = roster.length;
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
        if (this._monsterListEl) this._populateMonsterList();
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

        const calc = DifficultyCalc.calculate(
            this.state.party.size,
            this.state.party.level,
            this.state.monsters
        );

        this._summaryCard.appendChild(el('div', { className: 'divider', textContent: 'Difficulty' }));

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

        if (this.state.monsters.length > 0) {
            const startBtn = el('button', {
                className: 'btn btn--primary encounter-start-btn',
                textContent: 'Start Encounter',
                onClick: () => {
                    this._syncPlayersFromInputs();
                    this.mode = 'combat';
                    this.tracker.rollAll();
                    this.render();
                },
            });
            this._summaryCard.appendChild(startBtn);
        }
    }

    _refreshSummary() {
        if (this._summaryCard) this._renderSummaryContent();
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
                    this.state.loadRoster();
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
        const wrapper = el('div', { className: 'combat-wrapper' });

        // Header
        const header = el('div', { className: 'combat-header' }, [
            el('h2', { className: 'combat-header__title', textContent: `Round ${this.tracker.getRound()}` }),
            el('div', { className: 'combat-header__actions' }, [
                this._buildAutoSkipToggle(),
                el('button', {
                    className: 'btn btn--sm',
                    textContent: 'Prev',
                    onClick: () => { this.tracker.prevTurn(); this._refreshCombat(); },
                }),
                el('button', {
                    className: 'btn btn--sm btn--primary',
                    textContent: 'Next Turn',
                    onClick: () => { this.tracker.nextTurn(); this._refreshCombat(); },
                }),
                el('button', {
                    className: 'btn btn--sm',
                    textContent: 'Save Mid-Combat',
                    onClick: () => this._showSaveDialog(),
                }),
                el('button', {
                    className: 'btn btn--sm btn--danger',
                    textContent: 'End Encounter',
                    onClick: () => { this.mode = 'setup'; this.render(); },
                }),
            ]),
        ]);
        this._roundTitle = header.querySelector('.combat-header__title');
        wrapper.appendChild(header);

        // Two-column layout
        const columns = el('div', { className: 'combat-columns' });

        // Left: initiative list
        this._combatListEl = el('div', { className: 'combat-list' });
        this._renderCombatList();
        columns.appendChild(this._combatListEl);

        // Right: combat log
        this._combatLogEl = el('div', { className: 'combat-log-panel' });
        this._combatLogEl.appendChild(el('h3', { className: 'card__header', textContent: 'Combat Log' }));
        this._logListEl = el('div', { className: 'combat-log-list' });
        this._combatLogEl.appendChild(this._logListEl);
        this._refreshCombatLog();
        columns.appendChild(this._combatLogEl);

        wrapper.appendChild(columns);
        this.container.appendChild(wrapper);
    }

    _buildAutoSkipToggle() {
        const label = el('label', { className: 'auto-skip-label' });
        const cb = el('input', {
            type: 'checkbox',
            className: 'auto-skip-checkbox',
            checked: this.state.autoSkipDefeated ? 'checked' : undefined,
            onChange: (e) => { this.state.autoSkipDefeated = e.target.checked; },
        });
        if (this.state.autoSkipDefeated) cb.checked = true;
        label.appendChild(cb);
        label.appendChild(document.createTextNode(' Skip Defeated'));
        return label;
    }

    _refreshCombat() {
        this._updateRound();
        this._renderCombatList();
        this._refreshCombatLog();
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
            const creature = this.state.findCreature(entry.instanceId);
            const isPlayer = entry.type === 'player';
            const defeated = this._isCreatureDefeated(creature, isPlayer);

            const row = el('div', {
                className: `combat-entry ${isCurrent ? 'combat-entry--active animate-turn' : ''} ${defeated ? 'combat-entry--defeated' : ''}`,
            });

            // Turn indicator
            row.appendChild(el('div', {
                className: 'combat-entry__indicator',
                textContent: isCurrent ? '\u25B6' : '',
            }));

            // Initiative
            if (isPlayer) {
                const initInput = el('input', {
                    className: 'input input--sm combat-init-input',
                    type: 'number',
                    value: String(entry.initiative),
                    onInput: (e) => {
                        this.tracker.setPlayerInitiative(entry.instanceId, e.target.value);
                    },
                });
                row.appendChild(initInput);
            } else {
                row.appendChild(el('span', {
                    className: 'combat-entry__init',
                    textContent: entry.initiative,
                }));
            }

            // Name
            const nameEl = el('div', { className: 'combat-entry__name' }, [
                el('span', { textContent: entry.name }),
                el('span', {
                    className: 'combat-entry__type',
                    textContent: isPlayer ? 'PC' : `CR ${formatCR(creature?.cr ?? 0)}`,
                }),
            ]);
            row.appendChild(nameEl);

            // Conditions badges
            const condBadges = this._buildConditionBadges(entry.instanceId, creature);
            row.appendChild(condBadges);

            // Concentration badge
            if (creature?.concentration?.active) {
                const concBadge = el('span', {
                    className: 'conc-badge',
                    textContent: `Conc: ${creature.concentration.spell || 'Spell'}`,
                    onClick: () => {
                        this.tracker.setConcentration(entry.instanceId, false);
                        this._refreshCombat();
                    },
                });
                row.appendChild(concBadge);
            }

            // HP bar + controls (monsters)
            if (isMonster && creature) {
                this._buildCreatureHpSection(row, entry, creature);
            }

            // Player HP + Death saves
            if (isPlayer && creature) {
                this._buildPlayerHpSection(row, entry, creature);
            }

            this._combatListEl.appendChild(row);
        }
    }

    _isCreatureDefeated(creature, isPlayer) {
        if (!creature) return false;
        if (isPlayer) return creature.deathSaves?.dead || false;
        return creature.currentHp <= 0;
    }

    _buildConditionBadges(instanceId, creature) {
        const wrap = el('div', { className: 'condition-badges' });
        const conditions = creature?.conditions || [];

        for (const cid of conditions) {
            const cond = CONDITION_MAP[cid];
            if (!cond) continue;
            const badge = el('span', {
                className: 'condition-badge',
                style: `background-color: ${cond.color}22; border-color: ${cond.color}; color: ${cond.color};`,
                'data-tooltip': cond.shortDesc,
            }, [
                document.createTextNode(cond.name),
                el('button', {
                    className: 'condition-badge__remove',
                    textContent: '\u00D7',
                    onClick: (e) => {
                        e.stopPropagation();
                        this.tracker.removeCondition(instanceId, cid);
                        this._refreshCombat();
                    },
                }),
            ]);
            wrap.appendChild(badge);
        }

        // Add condition button
        const addBtn = el('button', {
            className: 'btn btn--xs condition-add-btn',
            textContent: '+',
            onClick: () => this._showAddConditionMenu(instanceId, addBtn),
        });
        wrap.appendChild(addBtn);

        return wrap;
    }

    _showAddConditionMenu(instanceId, anchorEl) {
        // Remove any existing menu
        document.querySelectorAll('.condition-menu').forEach(m => m.remove());

        const menu = el('div', { className: 'condition-menu' });
        for (const cond of CONDITIONS) {
            if (cond.id === 'concentration') continue; // handled separately
            const item = el('button', {
                className: 'condition-menu__item',
                textContent: cond.name,
                style: `border-left: 3px solid ${cond.color};`,
                onClick: () => {
                    this.tracker.addCondition(instanceId, cond.id);
                    menu.remove();
                    this._refreshCombat();
                },
            });
            menu.appendChild(item);
        }

        // Concentration with spell name
        const concRow = el('div', { className: 'condition-menu__conc-row' });
        const concInput = el('input', {
            className: 'input input--sm',
            type: 'text',
            placeholder: 'Spell name...',
            style: 'flex: 1;',
        });
        const concBtn = el('button', {
            className: 'btn btn--xs btn--primary',
            textContent: 'Conc.',
            onClick: () => {
                this.tracker.setConcentration(instanceId, true, concInput.value || 'Spell');
                menu.remove();
                this._refreshCombat();
            },
        });
        concRow.appendChild(concInput);
        concRow.appendChild(concBtn);
        menu.appendChild(concRow);

        // Position menu
        document.body.appendChild(menu);
        const rect = anchorEl.getBoundingClientRect();
        menu.style.top = (rect.bottom + 4) + 'px';
        menu.style.left = rect.left + 'px';

        // Close on outside click
        const closeHandler = (e) => {
            if (!menu.contains(e.target) && e.target !== anchorEl) {
                menu.remove();
                document.removeEventListener('pointerdown', closeHandler);
            }
        };
        setTimeout(() => document.addEventListener('pointerdown', closeHandler), 0);
    }

    _buildCreatureHpSection(row, entry, creature) {
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
                        const result = this.tracker.damage(entry.instanceId, val);
                        hpInput.value = '0';
                        this._handleDamageResult(result);
                        this._refreshCombat();
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
                        this._refreshCombat();
                    }
                },
            }),
        ]);
        row.appendChild(controls);

        row.appendChild(el('span', {
            className: 'combat-entry__ac',
            textContent: `AC ${creature.ac}`,
        }));
    }

    _buildPlayerHpSection(row, entry, creature) {
        if (creature.maxHp > 0) {
            const hpPct = Math.max(0, (creature.currentHp / creature.maxHp) * 100);
            let hpColor = '#4a90d9';
            if (hpPct <= 25) hpColor = '#dc143c';
            else if (hpPct <= 50) hpColor = '#e67e22';
            else if (hpPct <= 75) hpColor = '#f0c040';

            const hpBar = el('div', { className: 'hp-bar hp-bar--player' }, [
                el('div', {
                    className: 'hp-bar__fill',
                    style: `width: ${hpPct}%; background-color: ${hpColor};`,
                }),
                el('div', {
                    className: 'hp-bar__text',
                    textContent: `${creature.currentHp} / ${creature.maxHp}`,
                }),
            ]);
            row.appendChild(hpBar);

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
                            const result = this.tracker.damage(entry.instanceId, val);
                            hpInput.value = '0';
                            this._handleDamageResult(result);
                            this._refreshCombat();
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
                            this._refreshCombat();
                        }
                    },
                }),
            ]);
            row.appendChild(controls);
        }

        // Death saves (shown when at 0 HP and not dead)
        if (creature.currentHp <= 0 && creature.maxHp > 0 && !creature.deathSaves?.dead) {
            const ds = creature.deathSaves || { successes: 0, failures: 0 };
            const deathRow = el('div', { className: 'death-saves' });

            deathRow.appendChild(el('span', { className: 'death-saves__label', textContent: 'Death Saves:' }));

            // Successes
            const succGroup = el('span', { className: 'death-saves__group death-saves--success' });
            for (let s = 1; s <= 3; s++) {
                const circle = el('button', {
                    className: `death-save-circle ${s <= ds.successes ? 'death-save-circle--filled' : ''}`,
                    onClick: () => {
                        const newVal = s <= ds.successes ? s - 1 : s;
                        this.tracker.markDeathSave(entry.instanceId, 'success', newVal);
                        this._refreshCombat();
                    },
                });
                succGroup.appendChild(circle);
            }
            deathRow.appendChild(succGroup);

            // Failures
            const failGroup = el('span', { className: 'death-saves__group death-saves--failure' });
            for (let f = 1; f <= 3; f++) {
                const circle = el('button', {
                    className: `death-save-circle death-save-circle--fail ${f <= ds.failures ? 'death-save-circle--filled' : ''}`,
                    onClick: () => {
                        const newVal = f <= ds.failures ? f - 1 : f;
                        this.tracker.markDeathSave(entry.instanceId, 'failure', newVal);
                        this._refreshCombat();
                    },
                });
                failGroup.appendChild(circle);
            }
            deathRow.appendChild(failGroup);

            row.appendChild(deathRow);
        }

        // Dead indicator
        if (creature.deathSaves?.dead) {
            row.appendChild(el('span', { className: 'dead-badge', textContent: 'DEAD' }));
        }

        // Stabilized indicator
        if (creature.deathSaves?.stabilized && !creature.deathSaves?.dead && creature.currentHp <= 0) {
            row.appendChild(el('span', { className: 'stabilized-badge', textContent: 'STABLE' }));
        }
    }

    _handleDamageResult(result) {
        if (!result) return;
        if (result.concentrationCheck) {
            this._showConcentrationToast(result.creature.name, result.concentrationCheck);
        }
    }

    _showConcentrationToast(name, dc) {
        const toast = el('div', { className: 'conc-toast' });
        toast.textContent = `${name}: DC ${dc} CON save to maintain concentration!`;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('conc-toast--visible'), 10);
        setTimeout(() => {
            toast.classList.remove('conc-toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 4000);
    }

    _refreshCombatLog() {
        if (!this._logListEl) return;
        clearChildren(this._logListEl);
        const log = this.tracker.getCombatLog();
        for (const entry of log) {
            const item = el('div', { className: 'combat-log-entry' }, [
                el('span', { className: 'combat-log-entry__round', textContent: `R${entry.round}` }),
                el('span', { className: 'combat-log-entry__msg', textContent: entry.message }),
            ]);
            this._logListEl.appendChild(item);
        }
        this._logListEl.scrollTop = this._logListEl.scrollHeight;
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
                            // If it has initiative order, resume combat
                            if (this.state.initiativeOrder.length > 0) {
                                this.mode = 'combat';
                            } else {
                                this.mode = 'setup';
                            }
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
                if (this.state.initiativeOrder.length > 0) {
                    this.mode = 'combat';
                } else {
                    this.mode = 'setup';
                }
                this.render();
            } catch (err) {
                console.error('Import failed:', err);
            }
        });
        input.click();
    }
}
