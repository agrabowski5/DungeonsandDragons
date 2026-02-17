// ─── NPC Generator UI ───────────────────────────────────────────────
import { el, $, clearChildren, showModal } from '../utils/dom.js';
import { abilityMod } from '../utils/dice.js';
import { Storage } from '../utils/storage.js';
import { NPCGenerator } from './NPCGenerator.js';
import { RACES, ABILITY_NAMES, ABILITY_LABELS, ABILITY_FULL_NAMES } from '../data/npc-tables.js';

const STORAGE_PREFIX = 'dnd_npc_';
const STORAGE_LIST_KEY = STORAGE_PREFIX + 'saved_list';

export class NPCGeneratorUI {
    constructor(container) {
        this.container = container;
        this.currentNPC = null;
        this.savedNPCs = this._loadSavedList();
        this.render();
    }

    // ─── Render ─────────────────────────────────────────────────

    render() {
        clearChildren(this.container);

        const layout = el('div', { className: 'npc-layout' });

        // Left column: controls + NPC card
        const main = el('div', { className: 'npc-main' });
        main.appendChild(this._buildControls());
        this._cardContainer = el('div', { className: 'npc-card-container' });
        if (this.currentNPC) {
            this._cardContainer.appendChild(this._buildNPCCard(this.currentNPC));
        } else {
            this._cardContainer.appendChild(this._buildEmptyState());
        }
        main.appendChild(this._cardContainer);
        layout.appendChild(main);

        // Right column: saved NPCs sidebar
        const sidebar = el('div', { className: 'npc-sidebar' });
        sidebar.appendChild(this._buildSavedList());
        layout.appendChild(sidebar);

        this.container.appendChild(layout);
    }

    // ─── Controls ───────────────────────────────────────────────

    _buildControls() {
        const card = el('div', { className: 'card npc-controls' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'NPC Generator' }));

        const row = el('div', { className: 'form-row npc-controls__row' });

        // Race dropdown
        const raceGroup = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Race' }),
        ]);
        this._raceSelect = el('select', { className: 'select npc-controls__select' });
        this._raceSelect.appendChild(el('option', { value: 'Any', textContent: 'Any Race' }));
        for (const race of RACES) {
            this._raceSelect.appendChild(el('option', { value: race, textContent: race }));
        }
        raceGroup.appendChild(this._raceSelect);
        row.appendChild(raceGroup);

        // Gender dropdown
        const genderGroup = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Gender' }),
        ]);
        this._genderSelect = el('select', { className: 'select npc-controls__select' });
        for (const opt of ['Any', 'Male', 'Female']) {
            this._genderSelect.appendChild(el('option', { value: opt, textContent: opt }));
        }
        genderGroup.appendChild(this._genderSelect);
        row.appendChild(genderGroup);

        // Generate button
        const generateBtn = el('button', {
            className: 'btn btn--primary npc-controls__generate',
            textContent: 'Generate NPC',
            onClick: () => this._generate(),
        });
        row.appendChild(generateBtn);

        card.appendChild(row);
        return card;
    }

    // ─── Empty State ────────────────────────────────────────────

    _buildEmptyState() {
        return el('div', { className: 'npc-empty' }, [
            el('div', { className: 'npc-empty__icon', textContent: '\u{1F9D9}' }),
            el('p', { className: 'npc-empty__text', textContent: 'Click "Generate NPC" to conjure a new character from the aether.' }),
        ]);
    }

    // ─── NPC Card ───────────────────────────────────────────────

    _buildNPCCard(npc) {
        const card = el('div', { className: 'npc-card' });

        // Card header with name and actions
        const header = el('div', { className: 'npc-card__header' });
        const headerLeft = el('div', { className: 'npc-card__header-info' });
        headerLeft.appendChild(
            this._rerollableField('npc-card__name', npc.name, 'name', 'Re-roll name')
        );
        headerLeft.appendChild(el('div', { className: 'npc-card__subtitle' }, [
            el('span', { className: 'npc-card__race', textContent: `${npc.race} ${npc.gender}` }),
            el('span', { className: 'npc-card__age', textContent: npc.ageDescription }),
        ]));
        header.appendChild(headerLeft);

        const headerActions = el('div', { className: 'npc-card__actions' }, [
            el('button', {
                className: 'btn btn--sm btn--primary',
                textContent: 'Save',
                onClick: () => this._saveNPC(npc),
            }),
            el('button', {
                className: 'btn btn--sm',
                textContent: 'Export',
                onClick: () => this._exportNPC(npc),
            }),
        ]);
        header.appendChild(headerActions);
        card.appendChild(header);

        // Ornamental divider
        card.appendChild(el('div', { className: 'npc-card__divider' }));

        // Occupation
        card.appendChild(this._buildSection(
            'Occupation',
            npc.occupation,
            'occupation',
            'Re-roll occupation'
        ));

        // Stat block
        card.appendChild(this._buildStatBlock(npc));

        // Personality section
        card.appendChild(el('div', { className: 'npc-card__divider' }));
        card.appendChild(el('h4', { className: 'npc-card__section-title', textContent: 'Personality' }));

        card.appendChild(this._buildSection('Trait', npc.personalityTrait, 'personality', 'Re-roll trait'));
        card.appendChild(this._buildSection('Ideal', npc.ideal, 'ideal', 'Re-roll ideal'));
        card.appendChild(this._buildSection('Bond', npc.bond, 'bond', 'Re-roll bond'));
        card.appendChild(this._buildSection('Flaw', npc.flaw, 'flaw', 'Re-roll flaw'));

        // Details section
        card.appendChild(el('div', { className: 'npc-card__divider' }));
        card.appendChild(el('h4', { className: 'npc-card__section-title', textContent: 'Details' }));

        card.appendChild(this._buildSection('Backstory', npc.backstory, 'backstory', 'Re-roll backstory'));
        card.appendChild(this._buildSection('Quirk', npc.quirk, 'quirk', 'Re-roll quirk'));
        card.appendChild(this._buildSection('Appearance', npc.appearance, 'appearance', 'Re-roll appearance'));

        return card;
    }

    _buildSection(label, value, section, tooltip) {
        const row = el('div', {
            className: 'npc-card__field',
            'data-tooltip': tooltip,
            onClick: () => this._rerollSection(section),
        });
        row.appendChild(el('span', { className: 'npc-card__field-label', textContent: label }));
        row.appendChild(el('span', { className: 'npc-card__field-value', textContent: value }));
        row.appendChild(el('span', { className: 'npc-card__reroll-icon', textContent: '\u{21BB}' }));
        return row;
    }

    _rerollableField(className, text, section, tooltip) {
        return el('span', {
            className: `${className} npc-card__rerollable`,
            textContent: text,
            'data-tooltip': tooltip,
            onClick: (e) => {
                e.stopPropagation();
                this._rerollSection(section);
            },
        });
    }

    // ─── Stat Block ─────────────────────────────────────────────

    _buildStatBlock(npc) {
        const block = el('div', {
            className: 'npc-card__stat-block',
            'data-tooltip': 'Re-roll stats',
            onClick: () => this._rerollSection('stats'),
        });

        const statsRow = el('div', { className: 'npc-card__stats-grid' });

        for (const ability of ABILITY_NAMES) {
            const score = npc.stats[ability];
            const mod = abilityMod(score);
            const modStr = mod >= 0 ? `+${mod}` : `${mod}`;

            const statEl = el('div', { className: 'npc-stat' }, [
                el('div', { className: 'npc-stat__label', textContent: ABILITY_LABELS[ability] }),
                el('div', { className: 'npc-stat__score', textContent: String(score) }),
                el('div', { className: 'npc-stat__mod', textContent: modStr }),
            ]);
            statsRow.appendChild(statEl);
        }

        block.appendChild(statsRow);

        // AC & HP bar
        const combat = el('div', { className: 'npc-card__combat-stats' }, [
            el('div', { className: 'npc-combat-stat' }, [
                el('span', { className: 'npc-combat-stat__label', textContent: 'AC' }),
                el('span', { className: 'npc-combat-stat__value', textContent: String(npc.ac) }),
            ]),
            el('div', { className: 'npc-combat-stat' }, [
                el('span', { className: 'npc-combat-stat__label', textContent: 'HP' }),
                el('span', { className: 'npc-combat-stat__value', textContent: String(npc.hp) }),
            ]),
        ]);
        block.appendChild(combat);

        // Re-roll indicator
        block.appendChild(el('span', { className: 'npc-card__reroll-icon npc-card__reroll-icon--stats', textContent: '\u{21BB}' }));

        return block;
    }

    // ─── Saved NPCs Sidebar ─────────────────────────────────────

    _buildSavedList() {
        const card = el('div', { className: 'card npc-saved' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'Saved NPCs' }));

        this._savedListEl = el('div', { className: 'npc-saved__list' });
        this._renderSavedItems();
        card.appendChild(this._savedListEl);

        return card;
    }

    _renderSavedItems() {
        clearChildren(this._savedListEl);

        if (this.savedNPCs.length === 0) {
            this._savedListEl.appendChild(
                el('p', { className: 'npc-saved__empty', textContent: 'No saved NPCs yet. Generate and save one!' })
            );
            return;
        }

        for (const npc of this.savedNPCs) {
            const item = el('div', { className: 'npc-saved__item' }, [
                el('div', {
                    className: 'npc-saved__item-info',
                    onClick: () => this._viewSavedNPC(npc),
                }, [
                    el('span', { className: 'npc-saved__item-name', textContent: npc.name }),
                    el('span', { className: 'npc-saved__item-meta', textContent: `${npc.race} ${npc.occupation}` }),
                ]),
                el('button', {
                    className: 'btn btn--sm btn--danger',
                    textContent: 'Del',
                    onClick: (e) => {
                        e.stopPropagation();
                        this._deleteSavedNPC(npc.id);
                    },
                }),
            ]);
            this._savedListEl.appendChild(item);
        }
    }

    // ─── Actions ────────────────────────────────────────────────

    _generate() {
        const race = this._raceSelect.value;
        const gender = this._genderSelect.value;

        this.currentNPC = NPCGenerator.generate({ race, gender });
        this._refreshCard();
    }

    _rerollSection(section) {
        if (!this.currentNPC) return;
        this.currentNPC = NPCGenerator.regenerateSection(this.currentNPC, section);
        this._refreshCard();
    }

    _refreshCard() {
        if (!this._cardContainer) return;
        clearChildren(this._cardContainer);
        if (this.currentNPC) {
            this._cardContainer.appendChild(this._buildNPCCard(this.currentNPC));
        } else {
            this._cardContainer.appendChild(this._buildEmptyState());
        }
    }

    _saveNPC(npc) {
        // Check if already saved
        const existing = this.savedNPCs.find(n => n.id === npc.id);
        if (existing) {
            // Update existing
            const idx = this.savedNPCs.indexOf(existing);
            this.savedNPCs[idx] = { ...npc };
        } else {
            this.savedNPCs.unshift({ ...npc });
        }
        this._persistSavedList();
        this._renderSavedItems();

        // Show brief confirmation
        this._showToast('NPC saved!');
    }

    _viewSavedNPC(npc) {
        this.currentNPC = { ...npc };
        this._refreshCard();
    }

    _deleteSavedNPC(id) {
        this.savedNPCs = this.savedNPCs.filter(n => n.id !== id);
        this._persistSavedList();
        this._renderSavedItems();
    }

    _exportNPC(npc) {
        const text = NPCGenerator.toText(npc);
        navigator.clipboard.writeText(text).then(() => {
            this._showToast('NPC copied to clipboard!');
        }).catch(() => {
            // Fallback: show in modal
            const pre = el('pre', {
                className: 'npc-export-text',
                textContent: text,
            });
            showModal('Export NPC', pre);
        });
    }

    // ─── Toast ──────────────────────────────────────────────────

    _showToast(message) {
        const existing = $('.npc-toast', this.container);
        if (existing) existing.remove();

        const toast = el('div', { className: 'npc-toast', textContent: message });
        this.container.appendChild(toast);

        // Force reflow for animation
        toast.offsetHeight; // eslint-disable-line no-unused-expressions
        toast.classList.add('npc-toast--visible');

        setTimeout(() => {
            toast.classList.remove('npc-toast--visible');
            setTimeout(() => toast.remove(), 300);
        }, 2000);
    }

    // ─── Persistence ────────────────────────────────────────────

    _loadSavedList() {
        return Storage.load(STORAGE_LIST_KEY, []);
    }

    _persistSavedList() {
        Storage.save(STORAGE_LIST_KEY, this.savedNPCs);
    }
}
