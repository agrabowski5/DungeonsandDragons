/**
 * CharacterSheetUI - Main UI for the D&D 5e Character Sheet Creator.
 *
 * Usage:
 *   const ui = new CharacterSheetUI(document.getElementById('character-tab'));
 *
 * Renders a left sidebar (character list) and a right content area
 * (the actual character sheet) inside the given container element.
 */

import { el, $, $$, clearChildren, showModal } from '../utils/dom.js';
import { abilityMod, rollFormula } from '../utils/dice.js';
import { CharacterIO } from './CharacterIO.js';
import {
    createBlankCharacter,
    recomputeDerived,
    getSkillModifier,
    getSavingThrowModifier,
    getInitiative,
    getPassivePerception,
    formatMod,
    cloneCharacter
} from './CharacterState.js';
import { SRD_CLASSES, CLASS_MAP, getProficiencyBonus } from '../data/srd-classes.js';
import { SRD_RACES, RACE_MAP } from '../data/srd-races.js';
import { SRD_SKILLS, ABILITIES, ABILITY_LABELS, SKILL_ABILITY_MAP } from '../data/srd-skills.js';

const ALIGNMENTS = [
    'Lawful Good', 'Neutral Good', 'Chaotic Good',
    'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
    'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export class CharacterSheetUI {
    /**
     * @param {HTMLElement} containerElement - The parent DOM element this UI is rendered into.
     */
    constructor(containerElement) {
        /** @type {HTMLElement} */
        this.container = containerElement;

        /** @type {object|null} The currently-loaded character data */
        this.character = null;

        /** @type {number} Debounce timer id for auto-save */
        this._saveTimer = 0;

        this._build();
        this._refreshSidebar();

        // Auto-load the most recent character if any exist
        const list = CharacterIO.list();
        if (list.length > 0) {
            this._loadCharacter(list[0].id);
        }
    }

    /* ================================================================ */
    /*  SCAFFOLD                                                        */
    /* ================================================================ */

    /** Build the top-level layout: sidebar + sheet area. */
    _build() {
        this.container.classList.add('charsheet');

        // --- Sidebar ---
        this.sidebar = el('aside', { className: 'charsheet__sidebar' });
        this.sidebarHeader = el('div', { className: 'charsheet__sidebar-header' }, [
            el('h3', { className: 'charsheet__sidebar-title', textContent: 'Characters' })
        ]);
        this.sidebarList = el('ul', { className: 'charsheet__list' });
        this.sidebarActions = el('div', { className: 'charsheet__sidebar-actions' }, [
            el('button', { className: 'btn btn--primary btn--sm', textContent: 'New', onClick: () => this._onNewCharacter() }),
            el('button', { className: 'btn btn--sm', textContent: 'Import', onClick: () => this._onImport() })
        ]);
        this.sidebar.append(this.sidebarHeader, this.sidebarList, this.sidebarActions);

        // --- Sheet (right side) ---
        this.sheet = el('div', { className: 'charsheet__sheet' });
        this.emptyState = el('div', { className: 'charsheet__empty' }, [
            el('p', { className: 'charsheet__empty-text', textContent: 'Select or create a character to begin.' })
        ]);
        this.sheet.appendChild(this.emptyState);

        this.container.append(this.sidebar, this.sheet);
    }

    /* ================================================================ */
    /*  SIDEBAR                                                         */
    /* ================================================================ */

    /** Refresh the character list in the sidebar. */
    _refreshSidebar() {
        clearChildren(this.sidebarList);
        const chars = CharacterIO.list();
        if (chars.length === 0) {
            this.sidebarList.appendChild(
                el('li', { className: 'charsheet__list-empty', textContent: 'No characters yet.' })
            );
            return;
        }
        for (const entry of chars) {
            const isActive = this.character && this.character.id === entry.id;
            const li = el('li', {
                className: `charsheet__list-item${isActive ? ' charsheet__list-item--active' : ''}`,
                onClick: () => this._loadCharacter(entry.id)
            }, [
                el('span', { className: 'charsheet__list-name', textContent: entry.name || 'Unnamed' }),
                el('button', {
                    className: 'btn btn--danger btn--sm charsheet__list-delete',
                    textContent: 'Del',
                    onClick: (e) => { e.stopPropagation(); this._onDeleteCharacter(entry.id, entry.name); }
                })
            ]);
            this.sidebarList.appendChild(li);
        }
    }

    /* ================================================================ */
    /*  CHARACTER CRUD                                                  */
    /* ================================================================ */

    _onNewCharacter() {
        const char = CharacterIO.createNew();
        this._loadCharacter(char.id);
    }

    _loadCharacter(id) {
        const char = CharacterIO.load(id);
        if (!char) return;
        this.character = char;
        this._renderSheet();
        this._refreshSidebar();
    }

    _onDeleteCharacter(id, name) {
        const content = el('p', { textContent: `Delete "${name || 'Unnamed'}"? This cannot be undone.` });
        showModal('Delete Character', content, () => {
            CharacterIO.delete(id);
            if (this.character && this.character.id === id) {
                this.character = null;
                clearChildren(this.sheet);
                this.sheet.appendChild(this.emptyState);
            }
            this._refreshSidebar();
        }, () => {});
    }

    _onImport() {
        CharacterIO.uploadCharacter()
            .then(char => {
                this._loadCharacter(char.id);
            })
            .catch(err => {
                const content = el('p', { textContent: `Import failed: ${err.message}` });
                showModal('Import Error', content, () => {}, null);
            });
    }

    _onExport() {
        if (!this.character) return;
        CharacterIO.downloadCharacter(this.character);
    }

    /* ================================================================ */
    /*  AUTO-SAVE                                                       */
    /* ================================================================ */

    /** Schedule a debounced save (300ms). */
    _scheduleSave() {
        clearTimeout(this._saveTimer);
        this._saveTimer = setTimeout(() => {
            if (this.character) {
                recomputeDerived(this.character);
                CharacterIO.save(this.character);
                this._refreshSidebar();
                this._updateDerivedDisplays();
            }
        }, 300);
    }

    /**
     * Generic change handler: write a value into the character data
     * at the given path and trigger auto-save.
     */
    _set(path, value) {
        if (!this.character) return;
        const keys = path.split('.');
        let obj = this.character;
        for (let i = 0; i < keys.length - 1; i++) {
            obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = value;
        this._scheduleSave();
    }

    /* ================================================================ */
    /*  RENDER: FULL SHEET                                              */
    /* ================================================================ */

    _renderSheet() {
        clearChildren(this.sheet);
        if (!this.character) {
            this.sheet.appendChild(this.emptyState);
            return;
        }

        // Top toolbar
        const toolbar = el('div', { className: 'charsheet__toolbar' }, [
            el('button', { className: 'btn btn--sm', textContent: 'Export JSON', onClick: () => this._onExport() }),
            el('button', { className: 'btn btn--sm', textContent: 'Duplicate', onClick: () => this._onDuplicate() })
        ]);

        this.sheet.append(
            toolbar,
            this._renderIdentitySection(),
            this._renderAbilitiesAndSkills(),
            this._renderCombatSection(),
            this._renderFeaturesSection(),
            this._renderInventorySection(),
            this._renderSpellcastingSection(),
            this._renderNotesSection()
        );
    }

    _onDuplicate() {
        if (!this.character) return;
        const copy = cloneCharacter(this.character);
        copy.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
        copy.name = `${copy.name} (Copy)`;
        copy.createdAt = Date.now();
        copy.updatedAt = Date.now();
        CharacterIO.save(copy);
        this._loadCharacter(copy.id);
    }

    /* ================================================================ */
    /*  SECTION: IDENTITY                                               */
    /* ================================================================ */

    _renderIdentitySection() {
        const c = this.character;

        const raceSelect = this._select('race', SRD_RACES.map(r => r.name), c.race, (v) => {
            this._set('race', v);
            const raceData = RACE_MAP[v];
            if (raceData) {
                this._set('speed', raceData.speed);
            }
        });

        const classSelect = this._select('class', SRD_CLASSES.map(cl => cl.name), c.class, (v) => {
            this._set('class', v);
            const cls = CLASS_MAP[v];
            if (cls) {
                this._set('hitDice.total', `${c.level}d${cls.hitDie}`);
                if (cls.spellcaster && cls.spellcastingAbility) {
                    this._set('spellcastingAbility', cls.spellcastingAbility);
                } else {
                    this._set('spellcastingAbility', '');
                }
                // Auto-set saving throw proficiencies
                for (const ab of ABILITIES) {
                    this._set(`savingThrows.${ab}.proficient`, cls.savingThrows.includes(ab));
                }
            }
        });

        return el('section', { className: 'charsheet__section card' }, [
            el('h3', { className: 'card__header', textContent: 'Identity' }),
            el('div', { className: 'charsheet__identity-grid' }, [
                this._field('Name', 'input', c.name, v => { this._set('name', v); this._refreshSidebar(); }),
                this._field('Player Name', 'input', c.playerName, v => this._set('playerName', v)),
                this._fieldCustom('Race', raceSelect),
                this._fieldCustom('Class', classSelect),
                this._field('Subclass', 'input', c.subclass, v => this._set('subclass', v)),
                this._field('Level', 'number', c.level, v => {
                    const lvl = Math.max(1, Math.min(20, parseInt(v) || 1));
                    this._set('level', lvl);
                    const cls = CLASS_MAP[this.character.class];
                    if (cls) {
                        this._set('hitDice.total', `${lvl}d${cls.hitDie}`);
                    }
                }, { min: '1', max: '20' }),
                this._field('Background', 'input', c.background, v => this._set('background', v)),
                this._fieldCustom('Alignment', this._select('alignment', ALIGNMENTS, c.alignment, v => this._set('alignment', v))),
                this._field('Experience Points', 'number', c.experiencePoints, v => this._set('experiencePoints', parseInt(v) || 0), { min: '0' })
            ])
        ]);
    }

    /* ================================================================ */
    /*  SECTION: ABILITIES + SKILLS (side by side)                      */
    /* ================================================================ */

    _renderAbilitiesAndSkills() {
        return el('div', { className: 'charsheet__abilities-skills' }, [
            this._renderAbilitiesCard(),
            this._renderSavingThrowsCard(),
            this._renderSkillsCard()
        ]);
    }

    _renderAbilitiesCard() {
        const c = this.character;
        const rows = ABILITIES.map(ab => {
            const score = c.abilities[ab];
            const mod = abilityMod(score);
            const modSpan = el('span', {
                className: 'charsheet__ability-mod',
                textContent: formatMod(mod),
                'data-ability-mod': ab
            });
            return el('div', { className: 'charsheet__ability-row' }, [
                el('span', { className: 'charsheet__ability-label', textContent: ABILITY_LABELS[ab] }),
                el('input', {
                    className: 'input input--sm charsheet__ability-input',
                    type: 'number',
                    value: String(score),
                    min: '1',
                    max: '30',
                    onInput: (e) => {
                        const val = Math.max(1, Math.min(30, parseInt(e.target.value) || 10));
                        this._set(`abilities.${ab}`, val);
                        modSpan.textContent = formatMod(abilityMod(val));
                    }
                }),
                modSpan
            ]);
        });

        const profDisplay = el('div', {
            className: 'charsheet__proficiency-display',
            'data-prof-display': 'true'
        }, [
            el('span', { className: 'label', textContent: 'Proficiency Bonus' }),
            el('span', { className: 'charsheet__proficiency-value', textContent: formatMod(c.proficiencyBonus) })
        ]);

        return el('div', { className: 'charsheet__section card charsheet__abilities-card' }, [
            el('h3', { className: 'card__header', textContent: 'Ability Scores' }),
            ...rows,
            profDisplay
        ]);
    }

    _renderSavingThrowsCard() {
        const c = this.character;
        const rows = ABILITIES.map(ab => {
            const mod = getSavingThrowModifier(c, ab);
            const modSpan = el('span', {
                className: 'charsheet__save-mod',
                textContent: formatMod(mod),
                'data-save-mod': ab
            });

            const checkbox = el('input', {
                type: 'checkbox',
                className: 'charsheet__prof-check',
                ...(c.savingThrows[ab]?.proficient ? { checked: '' } : {})
            });
            checkbox.checked = !!c.savingThrows[ab]?.proficient;
            checkbox.addEventListener('change', () => {
                this._set(`savingThrows.${ab}.proficient`, checkbox.checked);
            });

            return el('div', { className: 'charsheet__save-row' }, [
                checkbox,
                el('span', { className: 'charsheet__save-label', textContent: ABILITY_LABELS[ab] }),
                modSpan
            ]);
        });

        return el('div', { className: 'charsheet__section card charsheet__saves-card' }, [
            el('h3', { className: 'card__header', textContent: 'Saving Throws' }),
            ...rows
        ]);
    }

    _renderSkillsCard() {
        const c = this.character;
        const rows = SRD_SKILLS.map(skill => {
            const ab = skill.ability;
            const mod = getSkillModifier(c, skill.name, ab);
            const modSpan = el('span', {
                className: 'charsheet__skill-mod',
                textContent: formatMod(mod),
                'data-skill-mod': skill.name
            });

            const checkbox = el('input', {
                type: 'checkbox',
                className: 'charsheet__prof-check'
            });
            checkbox.checked = !!c.skills[skill.name]?.proficient;
            checkbox.addEventListener('change', () => {
                this._set(`skills.${skill.name}.proficient`, checkbox.checked);
            });

            return el('div', { className: 'charsheet__skill-row' }, [
                checkbox,
                modSpan,
                el('span', { className: 'charsheet__skill-name', textContent: skill.name }),
                el('span', { className: 'charsheet__skill-ability', textContent: `(${ABILITY_LABELS[ab]})` })
            ]);
        });

        const passivePerc = el('div', { className: 'charsheet__passive-perception', 'data-passive-perc': 'true' }, [
            el('span', { className: 'label', textContent: 'Passive Perception' }),
            el('span', { className: 'charsheet__passive-value', textContent: String(getPassivePerception(c)) })
        ]);

        return el('div', { className: 'charsheet__section card charsheet__skills-card' }, [
            el('h3', { className: 'card__header', textContent: 'Skills' }),
            ...rows,
            passivePerc
        ]);
    }

    /* ================================================================ */
    /*  SECTION: COMBAT                                                 */
    /* ================================================================ */

    _renderCombatSection() {
        const c = this.character;

        // HP bar
        const hpPct = c.hitPoints.max > 0 ? Math.round((c.hitPoints.current / c.hitPoints.max) * 100) : 0;
        const hpBarFill = el('div', {
            className: 'hp-bar__fill',
            style: `width:${hpPct}%;background:${hpPct > 50 ? 'var(--color-easy)' : hpPct > 25 ? 'var(--color-medium)' : 'var(--color-crimson)'}`
        });
        const hpBarText = el('div', {
            className: 'hp-bar__text',
            textContent: `${c.hitPoints.current} / ${c.hitPoints.max}`
        });

        // Death saves
        const deathSuccesses = this._deathSaveGroup('successes', c.deathSaves.successes);
        const deathFailures = this._deathSaveGroup('failures', c.deathSaves.failures);

        return el('section', { className: 'charsheet__section card' }, [
            el('h3', { className: 'card__header', textContent: 'Combat' }),
            el('div', { className: 'charsheet__combat-grid' }, [
                // AC
                this._field('Armor Class', 'number', c.armorClass, v => this._set('armorClass', parseInt(v) || 10), { min: '0' }),

                // Initiative (auto from DEX)
                el('div', { className: 'form-group' }, [
                    el('label', { className: 'label', textContent: 'Initiative' }),
                    el('span', {
                        className: 'charsheet__computed-value',
                        textContent: formatMod(getInitiative(c)),
                        'data-initiative': 'true'
                    })
                ]),

                // Speed
                this._field('Speed', 'number', c.speed, v => this._set('speed', parseInt(v) || 30), { min: '0' }),

                // HP
                el('div', { className: 'form-group charsheet__hp-group' }, [
                    el('label', { className: 'label', textContent: 'Hit Points' }),
                    el('div', { className: 'hp-bar' }, [hpBarFill, hpBarText]),
                    el('div', { className: 'form-row' }, [
                        this._miniField('Current', 'number', c.hitPoints.current, v => {
                            this._set('hitPoints.current', parseInt(v) || 0);
                        }, { min: '0' }),
                        this._miniField('Max', 'number', c.hitPoints.max, v => {
                            this._set('hitPoints.max', parseInt(v) || 1);
                        }, { min: '1' }),
                        this._miniField('Temp', 'number', c.hitPoints.temp, v => {
                            this._set('hitPoints.temp', parseInt(v) || 0);
                        }, { min: '0' })
                    ])
                ]),

                // Hit Dice
                el('div', { className: 'form-group' }, [
                    el('label', { className: 'label', textContent: 'Hit Dice' }),
                    el('div', { className: 'form-row' }, [
                        this._miniField('Total', 'input', c.hitDice.total, v => this._set('hitDice.total', v)),
                        this._miniField('Remaining', 'number', c.hitDice.current, v => {
                            this._set('hitDice.current', Math.max(0, parseInt(v) || 0));
                        }, { min: '0' })
                    ])
                ]),

                // Death Saves
                el('div', { className: 'form-group charsheet__death-saves' }, [
                    el('label', { className: 'label', textContent: 'Death Saves' }),
                    el('div', { className: 'charsheet__death-row' }, [
                        el('span', { className: 'charsheet__death-label', textContent: 'Successes' }),
                        deathSuccesses
                    ]),
                    el('div', { className: 'charsheet__death-row' }, [
                        el('span', { className: 'charsheet__death-label charsheet__death-label--fail', textContent: 'Failures' }),
                        deathFailures
                    ])
                ])
            ])
        ]);
    }

    /**
     * Render 3 checkboxes for death save successes/failures.
     */
    _deathSaveGroup(type, currentCount) {
        const group = el('div', { className: 'charsheet__death-checks' });
        for (let i = 0; i < 3; i++) {
            const cb = el('input', {
                type: 'checkbox',
                className: `charsheet__death-check charsheet__death-check--${type}`
            });
            cb.checked = i < currentCount;
            cb.addEventListener('change', () => {
                // Count checked boxes
                const checks = $$('input[type="checkbox"]', group);
                const count = checks.filter(c => c.checked).length;
                this._set(`deathSaves.${type}`, count);
            });
            group.appendChild(cb);
        }
        return group;
    }

    /* ================================================================ */
    /*  SECTION: FEATURES & TRAITS                                      */
    /* ================================================================ */

    _renderFeaturesSection() {
        const c = this.character;

        const listContainer = el('div', { className: 'charsheet__features-list' });
        this._renderFeatureItems(listContainer);

        const addBtn = el('button', { className: 'btn btn--sm', textContent: '+ Add Feature', onClick: () => {
            c.features.push({ name: '', description: '' });
            this._renderFeatureItems(listContainer);
            this._scheduleSave();
        }});

        return el('section', { className: 'charsheet__section card' }, [
            el('h3', { className: 'card__header', textContent: 'Features & Traits' }),
            listContainer,
            addBtn
        ]);
    }

    _renderFeatureItems(container) {
        clearChildren(container);
        const c = this.character;
        c.features.forEach((feat, idx) => {
            const item = el('div', { className: 'charsheet__feature-item' }, [
                el('input', {
                    className: 'input input--sm charsheet__feature-name',
                    placeholder: 'Feature name',
                    value: feat.name,
                    onInput: (e) => { c.features[idx].name = e.target.value; this._scheduleSave(); }
                }),
                el('textarea', {
                    className: 'input charsheet__feature-desc',
                    placeholder: 'Description...',
                    rows: '2',
                    onInput: (e) => { c.features[idx].description = e.target.value; this._scheduleSave(); }
                }),
                el('button', {
                    className: 'btn btn--danger btn--sm',
                    textContent: 'Remove',
                    onClick: () => {
                        c.features.splice(idx, 1);
                        this._renderFeatureItems(container);
                        this._scheduleSave();
                    }
                })
            ]);
            // Set textarea value after creation (value attr doesn't work for textareas)
            const textarea = $('textarea', item);
            if (textarea) textarea.value = feat.description;
            container.appendChild(item);
        });
    }

    /* ================================================================ */
    /*  SECTION: INVENTORY & CURRENCY                                   */
    /* ================================================================ */

    _renderInventorySection() {
        const c = this.character;

        // Currency tracker
        const currencyRow = el('div', { className: 'charsheet__currency-row' });
        for (const coin of ['cp', 'sp', 'ep', 'gp', 'pp']) {
            currencyRow.appendChild(
                this._miniField(coin.toUpperCase(), 'number', c.currency[coin], v => {
                    this._set(`currency.${coin}`, Math.max(0, parseInt(v) || 0));
                }, { min: '0' })
            );
        }

        // Inventory table
        const tableBody = el('tbody', { className: 'charsheet__inv-body' });
        this._renderInventoryRows(tableBody);

        const table = el('table', { className: 'charsheet__inv-table' }, [
            el('thead', {}, [
                el('tr', {}, [
                    el('th', { textContent: 'Item' }),
                    el('th', { textContent: 'Qty' }),
                    el('th', { textContent: 'Weight' }),
                    el('th', { textContent: 'Equipped' }),
                    el('th', { textContent: '' })
                ])
            ]),
            tableBody
        ]);

        const addBtn = el('button', { className: 'btn btn--sm', textContent: '+ Add Item', onClick: () => {
            c.inventory.push({ name: '', quantity: 1, weight: 0, equipped: false });
            this._renderInventoryRows(tableBody);
            this._scheduleSave();
        }});

        // Total weight
        const totalWeight = c.inventory.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
        const weightDisplay = el('div', {
            className: 'charsheet__weight-total',
            textContent: `Total Weight: ${totalWeight.toFixed(1)} lb`
        });

        return el('section', { className: 'charsheet__section card' }, [
            el('h3', { className: 'card__header', textContent: 'Equipment & Inventory' }),
            el('div', { className: 'charsheet__currency-section' }, [
                el('label', { className: 'label', textContent: 'Currency' }),
                currencyRow
            ]),
            table,
            el('div', { className: 'form-row' }, [addBtn, weightDisplay])
        ]);
    }

    _renderInventoryRows(tbody) {
        clearChildren(tbody);
        const c = this.character;
        c.inventory.forEach((item, idx) => {
            const equippedCb = el('input', { type: 'checkbox', className: 'charsheet__prof-check' });
            equippedCb.checked = !!item.equipped;
            equippedCb.addEventListener('change', () => {
                c.inventory[idx].equipped = equippedCb.checked;
                this._scheduleSave();
            });

            const row = el('tr', {}, [
                el('td', {}, [
                    el('input', {
                        className: 'input input--sm',
                        value: item.name,
                        placeholder: 'Item name',
                        onInput: (e) => { c.inventory[idx].name = e.target.value; this._scheduleSave(); }
                    })
                ]),
                el('td', {}, [
                    el('input', {
                        className: 'input input--sm',
                        type: 'number',
                        value: String(item.quantity),
                        min: '0',
                        onInput: (e) => { c.inventory[idx].quantity = parseInt(e.target.value) || 0; this._scheduleSave(); }
                    })
                ]),
                el('td', {}, [
                    el('input', {
                        className: 'input input--sm',
                        type: 'number',
                        value: String(item.weight),
                        min: '0',
                        step: '0.1',
                        onInput: (e) => { c.inventory[idx].weight = parseFloat(e.target.value) || 0; this._scheduleSave(); }
                    })
                ]),
                el('td', {}, [equippedCb]),
                el('td', {}, [
                    el('button', {
                        className: 'btn btn--danger btn--sm',
                        textContent: 'X',
                        onClick: () => {
                            c.inventory.splice(idx, 1);
                            this._renderInventoryRows(tbody);
                            this._scheduleSave();
                        }
                    })
                ])
            ]);
            tbody.appendChild(row);
        });
    }

    /* ================================================================ */
    /*  SECTION: SPELLCASTING                                           */
    /* ================================================================ */

    _renderSpellcastingSection() {
        const c = this.character;

        // Spellcasting ability selector
        const abilitySelect = this._select(
            'spellcastingAbility',
            ['', ...ABILITIES],
            c.spellcastingAbility,
            v => this._set('spellcastingAbility', v)
        );

        const spellDC = el('span', {
            className: 'charsheet__computed-value',
            textContent: c.spellSaveDC > 0 ? String(c.spellSaveDC) : '--',
            'data-spell-dc': 'true'
        });

        const spellAtk = el('span', {
            className: 'charsheet__computed-value',
            textContent: c.spellAttackBonus !== 0 || c.spellcastingAbility ? formatMod(c.spellAttackBonus) : '--',
            'data-spell-atk': 'true'
        });

        // Spell slots grid
        const slotsGrid = el('div', { className: 'charsheet__slots-grid' });
        for (let lvl = 1; lvl <= 9; lvl++) {
            const slot = c.spellSlots[lvl] || { total: 0, used: 0 };
            slotsGrid.appendChild(
                el('div', { className: 'charsheet__slot-group' }, [
                    el('span', { className: 'charsheet__slot-level', textContent: `Level ${lvl}` }),
                    el('div', { className: 'form-row' }, [
                        this._miniField('Total', 'number', slot.total, v => {
                            this._set(`spellSlots.${lvl}.total`, Math.max(0, parseInt(v) || 0));
                        }, { min: '0' }),
                        this._miniField('Used', 'number', slot.used, v => {
                            this._set(`spellSlots.${lvl}.used`, Math.max(0, parseInt(v) || 0));
                        }, { min: '0' })
                    ])
                ])
            );
        }

        return el('section', { className: 'charsheet__section card' }, [
            el('h3', { className: 'card__header', textContent: 'Spellcasting' }),
            el('div', { className: 'charsheet__spell-header' }, [
                this._fieldCustom('Spellcasting Ability', abilitySelect),
                el('div', { className: 'form-group' }, [
                    el('label', { className: 'label', textContent: 'Spell Save DC' }),
                    spellDC
                ]),
                el('div', { className: 'form-group' }, [
                    el('label', { className: 'label', textContent: 'Spell Attack Bonus' }),
                    spellAtk
                ])
            ]),
            el('h4', { className: 'charsheet__sub-header', textContent: 'Spell Slots' }),
            slotsGrid
        ]);
    }

    /* ================================================================ */
    /*  SECTION: NOTES                                                  */
    /* ================================================================ */

    _renderNotesSection() {
        const c = this.character;
        return el('section', { className: 'charsheet__section card' }, [
            el('h3', { className: 'card__header', textContent: 'Notes & Personality' }),
            el('div', { className: 'charsheet__notes-grid' }, [
                this._textarea('Personality Traits', c.personalityTraits, v => this._set('personalityTraits', v)),
                this._textarea('Ideals', c.ideals, v => this._set('ideals', v)),
                this._textarea('Bonds', c.bonds, v => this._set('bonds', v)),
                this._textarea('Flaws', c.flaws, v => this._set('flaws', v)),
                this._textarea('Backstory', c.backstory, v => this._set('backstory', v), 6)
            ])
        ]);
    }

    /* ================================================================ */
    /*  DERIVED DISPLAY UPDATES                                         */
    /* ================================================================ */

    /**
     * After a save / recompute, update all computed-value displays
     * without tearing down the entire DOM.
     */
    _updateDerivedDisplays() {
        if (!this.character) return;
        const c = this.character;

        // Ability modifiers
        for (const ab of ABILITIES) {
            const modEl = $(`[data-ability-mod="${ab}"]`, this.sheet);
            if (modEl) modEl.textContent = formatMod(abilityMod(c.abilities[ab]));
        }

        // Saving throw modifiers
        for (const ab of ABILITIES) {
            const modEl = $(`[data-save-mod="${ab}"]`, this.sheet);
            if (modEl) modEl.textContent = formatMod(getSavingThrowModifier(c, ab));
        }

        // Skill modifiers
        for (const skill of SRD_SKILLS) {
            const modEl = $(`[data-skill-mod="${skill.name}"]`, this.sheet);
            if (modEl) modEl.textContent = formatMod(getSkillModifier(c, skill.name, skill.ability));
        }

        // Proficiency bonus
        const profEl = $('[data-prof-display] .charsheet__proficiency-value', this.sheet);
        if (profEl) profEl.textContent = formatMod(c.proficiencyBonus);

        // Initiative
        const initEl = $('[data-initiative]', this.sheet);
        if (initEl) initEl.textContent = formatMod(getInitiative(c));

        // Passive perception
        const percEl = $('[data-passive-perc] .charsheet__passive-value', this.sheet);
        if (percEl) percEl.textContent = String(getPassivePerception(c));

        // Spell DC / attack
        const dcEl = $('[data-spell-dc]', this.sheet);
        if (dcEl) dcEl.textContent = c.spellSaveDC > 0 ? String(c.spellSaveDC) : '--';
        const atkEl = $('[data-spell-atk]', this.sheet);
        if (atkEl) atkEl.textContent = c.spellcastingAbility ? formatMod(c.spellAttackBonus) : '--';
    }

    /* ================================================================ */
    /*  HELPERS: Field builders                                         */
    /* ================================================================ */

    /**
     * Build a form-group with label and input/number field.
     */
    _field(label, type, value, onChange, extraAttrs = {}) {
        const isNumber = type === 'number';
        const input = el('input', {
            className: `input${isNumber ? ' input--sm' : ''}`,
            type: isNumber ? 'number' : 'text',
            value: String(value ?? ''),
            onInput: (e) => onChange(e.target.value),
            ...extraAttrs
        });
        return el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: label }),
            input
        ]);
    }

    /**
     * Build a small inline field (label above, compact input).
     */
    _miniField(label, type, value, onChange, extraAttrs = {}) {
        const isNumber = type === 'number';
        const input = el('input', {
            className: 'input input--sm',
            type: isNumber ? 'number' : 'text',
            value: String(value ?? ''),
            onInput: (e) => onChange(e.target.value),
            ...extraAttrs
        });
        return el('div', { className: 'form-group charsheet__mini-field' }, [
            el('label', { className: 'label', textContent: label }),
            input
        ]);
    }

    /**
     * Wrap a custom element with a label.
     */
    _fieldCustom(label, element) {
        return el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: label }),
            element
        ]);
    }

    /**
     * Build a <select> dropdown.
     */
    _select(name, options, currentValue, onChange) {
        const select = el('select', {
            className: 'select',
            name,
            onChange: (e) => onChange(e.target.value)
        });
        // Empty option
        select.appendChild(el('option', { value: '', textContent: '-- Select --' }));
        for (const opt of options) {
            if (!opt) continue; // skip empty strings in the list
            const label = typeof opt === 'string' ? opt : opt;
            const optionEl = el('option', { value: label, textContent: label });
            if (label === currentValue) optionEl.selected = true;
            select.appendChild(optionEl);
        }
        return select;
    }

    /**
     * Build a textarea with label.
     */
    _textarea(label, value, onChange, rows = 3) {
        const ta = el('textarea', {
            className: 'input charsheet__textarea',
            rows: String(rows),
            placeholder: `${label}...`,
            onInput: (e) => onChange(e.target.value)
        });
        ta.value = value || '';
        return el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: label }),
            ta
        ]);
    }
}
