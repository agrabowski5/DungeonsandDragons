// ─── NPC Generator UI ───────────────────────────────────────────────
// Main UI controller for the D&D 5e NPC Generator module.

import { el, $, clearChildren, showModal } from '../utils/dom.js';
import { abilityMod } from '../utils/dice.js';
import { Storage } from '../utils/storage.js';
import { NPCGenerator } from './NPCGenerator.js';
import { NPC_RACES, NPC_CLASSES, ABILITY_NAMES, ABILITY_LABELS } from '../data/npc-tables.js';

const STORAGE_KEY = 'dnd_saved_npcs';

export class NPCGeneratorUI {
    constructor(container) {
        this.container = container;
        this.currentNPC = null;
        this.savedNPCs = Storage.load(STORAGE_KEY, []);
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
        sidebar.appendChild(this._buildIOPanel());
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
        for (const race of NPC_RACES) {
            this._raceSelect.appendChild(el('option', { value: race, textContent: race }));
        }
        raceGroup.appendChild(this._raceSelect);
        row.appendChild(raceGroup);

        // Class dropdown
        const classGroup = el('div', { className: 'form-group' }, [
            el('label', { className: 'label', textContent: 'Class' }),
        ]);
        this._classSelect = el('select', { className: 'select npc-controls__select' });
        this._classSelect.appendChild(el('option', { value: 'Any', textContent: 'Any Class' }));
        for (const cls of NPC_CLASSES) {
            this._classSelect.appendChild(el('option', { value: cls, textContent: cls }));
        }
        classGroup.appendChild(this._classSelect);
        row.appendChild(classGroup);

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
            onClick: () => this._generate(),
        }, [
            el('span', { className: 'npc-controls__generate-icon', textContent: '\u2694\uFE0F' }),
            el('span', { textContent: 'Generate NPC' }),
        ]);
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
            el('span', { className: 'npc-card__separator', textContent: '\u2022' }),
            el('span', { className: 'npc-card__class', textContent: npc.npcClass || 'Commoner' }),
            el('span', { className: 'npc-card__separator', textContent: '\u2022' }),
            el('span', { className: 'npc-card__alignment', textContent: npc.alignment || 'True Neutral' }),
        ]));
        headerLeft.appendChild(el('div', { className: 'npc-card__age', textContent: npc.ageDescription }));
        header.appendChild(headerLeft);

        const headerActions = el('div', { className: 'npc-card__actions' }, [
            el('button', {
                className: 'btn btn--sm btn--primary',
                textContent: 'Save',
                onClick: () => this._saveNPC(npc),
            }),
            el('button', {
                className: 'btn btn--sm',
                textContent: 'Copy',
                onClick: (e) => this._exportNPC(npc, e.target),
            }),
        ]);
        header.appendChild(headerActions);
        card.appendChild(header);

        // Identity section
        card.appendChild(el('div', { className: 'npc-card__divider' }));
        card.appendChild(this._buildIdentitySection(npc));

        // Stat block
        card.appendChild(el('div', { className: 'npc-card__divider' }));
        card.appendChild(this._buildStatBlock(npc));

        // Personality section
        card.appendChild(el('div', { className: 'npc-card__divider' }));
        card.appendChild(el('h4', { className: 'npc-card__section-title', textContent: 'Personality' }));

        card.appendChild(this._buildSection('Trait', npc.personality || npc.personalityTrait, 'personality', 'Re-roll trait'));
        card.appendChild(this._buildSection('Ideal', npc.ideal, 'ideal', 'Re-roll ideal'));
        card.appendChild(this._buildSection('Bond', npc.bond, 'bond', 'Re-roll bond'));
        card.appendChild(this._buildSection('Flaw', npc.flaw, 'flaw', 'Re-roll flaw'));

        // Details section
        card.appendChild(el('div', { className: 'npc-card__divider' }));
        card.appendChild(el('h4', { className: 'npc-card__section-title', textContent: 'Details' }));

        card.appendChild(this._buildSection('Backstory', npc.backstory, 'backstory', 'Re-roll backstory'));
        card.appendChild(this._buildSection('Motivation', npc.motivation || 'Unknown', 'motivation', 'Re-roll motivation'));
        card.appendChild(this._buildSection('Quirk', npc.quirk, 'quirk', 'Re-roll quirk'));
        card.appendChild(this._buildSection('Appearance', npc.appearance, 'appearance', 'Re-roll appearance'));

        return card;
    }

    _buildIdentitySection(npc) {
        const section = el('div', { className: 'npc-card__identity' });

        const grid = el('div', { className: 'npc-card__identity-grid' });
        grid.appendChild(this._buildInfoTag('Race', npc.race));
        grid.appendChild(this._buildInfoTag('Class', npc.npcClass || 'Commoner'));
        grid.appendChild(this._buildInfoTag('Gender', npc.gender));
        grid.appendChild(this._buildInfoTag('Alignment', npc.alignment || 'True Neutral'));
        grid.appendChild(this._buildInfoTag('Age', npc.ageDescription));
        grid.appendChild(this._buildInfoTag('Occupation', npc.occupation));

        section.appendChild(grid);
        return section;
    }

    _buildInfoTag(label, value) {
        return el('div', { className: 'npc-card__info-tag' }, [
            el('span', { className: 'npc-card__info-label', textContent: label }),
            el('span', { className: 'npc-card__info-value', textContent: value }),
        ]);
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

        // AC & HP
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
                    el('span', {
                        className: 'npc-saved__item-meta',
                        textContent: `${npc.race} ${npc.npcClass || npc.occupation || 'Commoner'}`,
                    }),
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

    // ─── Import / Export Panel ────────────────────────────────────

    _buildIOPanel() {
        const card = el('div', { className: 'card npc-io' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'Import / Export' }));

        const row = el('div', { className: 'npc-io__row' });

        row.appendChild(el('button', {
            className: 'btn btn--sm',
            textContent: 'Export JSON',
            onClick: () => this._exportAllNPCs(),
        }));

        const fileInput = el('input', {
            type: 'file',
            accept: '.json',
        });
        fileInput.style.display = 'none';
        fileInput.addEventListener('change', (e) => this._importNPCs(e));

        row.appendChild(el('button', {
            className: 'btn btn--sm',
            textContent: 'Import JSON',
            onClick: () => fileInput.click(),
        }));
        row.appendChild(fileInput);

        card.appendChild(row);
        return card;
    }

    _exportAllNPCs() {
        if (this.savedNPCs.length === 0) {
            this._showToast('No NPCs to export.');
            return;
        }

        const blob = new Blob([JSON.stringify(this.savedNPCs, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'dnd-npcs-export.json';
        a.click();
        URL.revokeObjectURL(url);
        this._showToast('NPCs exported!');
    }

    _importNPCs(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                if (!Array.isArray(data)) {
                    this._showToast('Invalid file format.');
                    return;
                }

                const existingIds = new Set(this.savedNPCs.map(n => n.id));
                let added = 0;
                for (const npc of data) {
                    if (npc.id && !existingIds.has(npc.id)) {
                        this.savedNPCs.push(npc);
                        existingIds.add(npc.id);
                        added++;
                    }
                }

                if (added > 0) {
                    this._persistSavedList();
                    this._renderSavedItems();
                    this._showToast(`Imported ${added} NPC${added > 1 ? 's' : ''}.`);
                } else {
                    this._showToast('No new NPCs to import.');
                }
            } catch (err) {
                console.warn('NPC import failed:', err);
                this._showToast('Import failed. Invalid JSON file.');
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }

    // ─── Actions ────────────────────────────────────────────────

    _generate() {
        const race = this._raceSelect.value;
        const gender = this._genderSelect.value;
        const npcClass = this._classSelect.value;

        this.currentNPC = NPCGenerator.generate({ race, gender, npcClass });
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
        const existing = this.savedNPCs.find(n => n.id === npc.id);
        if (existing) {
            const idx = this.savedNPCs.indexOf(existing);
            this.savedNPCs[idx] = { ...npc };
        } else {
            this.savedNPCs.unshift({ ...npc });
        }
        this._persistSavedList();
        this._renderSavedItems();
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

    _exportNPC(npc, btnEl) {
        const text = NPCGenerator.toText(npc);
        navigator.clipboard.writeText(text).then(() => {
            const original = btnEl.textContent;
            btnEl.textContent = 'Copied!';
            setTimeout(() => { btnEl.textContent = original; }, 1500);
        }).catch(() => {
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

    _persistSavedList() {
        Storage.save(STORAGE_KEY, this.savedNPCs);
    }

    // ─── Tab Lifecycle ──────────────────────────────────────────

    onTabActivated() {
        // Nothing special needed on re-activation
    }
}
