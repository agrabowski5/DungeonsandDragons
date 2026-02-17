// ─── Spell Book UI ──────────────────────────────────────────────────
// Main UI controller for the D&D 5e Spell Book Database feature.

import { SpellBookState } from './SpellBookState.js';
import { SpellBookIO } from './SpellBookIO.js';
import { SCHOOLS, CLASSES, formatSpellLevel } from '../data/srd-spells.js';
import { el, $, clearChildren, showModal } from '../utils/dom.js';

/** Map each spell school to its accent color. */
const SCHOOL_COLORS = {
    Abjuration:    '#4fc3f7', // blue
    Conjuration:   '#ffd54f', // amber
    Divination:    '#ce93d8', // purple
    Enchantment:   '#f48fb1', // pink
    Evocation:     '#ef5350', // red
    Illusion:      '#90caf9', // light blue
    Necromancy:    '#a5d6a7', // green
    Transmutation: '#ffab40', // orange
};

export class SpellBookUI {
    /**
     * @param {HTMLElement} containerElement - The root element to render into.
     */
    constructor(containerElement) {
        this.container = containerElement;
        this.state = new SpellBookState();

        // Debounce timer for search input
        this._searchTimer = null;

        // Element references for partial updates
        this._gridEl = null;
        this._countEl = null;
        this._pillsEl = null;
        this._favoritesEl = null;
        this._searchInput = null;

        // Bind state changes to re-render the results
        this.state.onChange(() => this._refreshResults());

        this.render();
    }

    // ─── Full render ────────────────────────────────────────

    render() {
        clearChildren(this.container);

        const layout = el('div', { className: 'spellbook' });

        layout.appendChild(this._buildHeader());
        layout.appendChild(this._buildFilters());
        layout.appendChild(this._buildFilterPills());
        layout.appendChild(this._buildFavoritesSection());
        layout.appendChild(this._buildCountBar());
        layout.appendChild(this._buildGrid());

        this.container.appendChild(layout);

        // Initial population
        this._refreshResults();
    }

    // ─── Header ─────────────────────────────────────────────

    _buildHeader() {
        const header = el('div', { className: 'spellbook__header' }, [
            el('h2', { className: 'spellbook__title', textContent: 'Spell Book' }),
            el('p', { className: 'spellbook__subtitle', textContent: 'Search and browse the SRD 5e spell compendium' }),
        ]);
        return header;
    }

    // ─── Search + Filters ───────────────────────────────────

    _buildFilters() {
        const bar = el('div', { className: 'spellbook__filters card' });

        // Search row
        const searchRow = el('div', { className: 'spellbook__search-row' });

        this._searchInput = el('input', {
            className: 'input spellbook__search',
            type: 'text',
            placeholder: 'Search spells by name...',
            value: this.state.searchQuery,
            onInput: (e) => {
                clearTimeout(this._searchTimer);
                this._searchTimer = setTimeout(() => {
                    this.state.setSearch(e.target.value);
                }, 150);
            },
        });
        searchRow.appendChild(this._searchInput);

        // Clear filters button
        const clearBtn = el('button', {
            className: 'btn btn--sm spellbook__clear-btn',
            textContent: 'Clear All',
            onClick: () => {
                this.state.clearFilters();
                this._syncFilterControls();
            },
        });
        searchRow.appendChild(clearBtn);

        bar.appendChild(searchRow);

        // Dropdown row
        const dropdownRow = el('div', { className: 'spellbook__dropdown-row' });

        // Level filter
        dropdownRow.appendChild(this._buildSelect(
            'Level',
            [
                { value: '', label: 'All Levels' },
                { value: '0', label: 'Cantrip' },
                ...Array.from({ length: 9 }, (_, i) => ({
                    value: String(i + 1),
                    label: formatSpellLevel(i + 1),
                })),
            ],
            (val) => this.state.setLevel(val === '' ? null : parseInt(val)),
            'spellbook__filter-level',
        ));

        // School filter
        dropdownRow.appendChild(this._buildSelect(
            'School',
            [{ value: '', label: 'All Schools' }, ...SCHOOLS.map(s => ({ value: s, label: s }))],
            (val) => this.state.setSchool(val || null),
            'spellbook__filter-school',
        ));

        // Class filter
        dropdownRow.appendChild(this._buildSelect(
            'Class',
            [{ value: '', label: 'All Classes' }, ...CLASSES.map(c => ({ value: c, label: c }))],
            (val) => this.state.setClass(val || null),
            'spellbook__filter-class',
        ));

        // Concentration filter
        dropdownRow.appendChild(this._buildSelect(
            'Concentration',
            [
                { value: '', label: 'Any' },
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
            ],
            (val) => this.state.setConcentration(val === '' ? null : val === 'true'),
            'spellbook__filter-conc',
        ));

        // Ritual filter
        dropdownRow.appendChild(this._buildSelect(
            'Ritual',
            [
                { value: '', label: 'Any' },
                { value: 'true', label: 'Yes' },
                { value: 'false', label: 'No' },
            ],
            (val) => this.state.setRitual(val === '' ? null : val === 'true'),
            'spellbook__filter-ritual',
        ));

        bar.appendChild(dropdownRow);
        return bar;
    }

    /**
     * Helper: build a labeled <select>.
     */
    _buildSelect(labelText, options, onChange, id) {
        const group = el('div', { className: 'spellbook__filter-group' });
        group.appendChild(el('label', { className: 'label', textContent: labelText }));

        const select = el('select', {
            className: 'select spellbook__select',
            id,
            onChange: (e) => onChange(e.target.value),
        });

        for (const opt of options) {
            select.appendChild(el('option', { value: opt.value, textContent: opt.label }));
        }

        group.appendChild(select);
        return group;
    }

    /**
     * Reset all filter dropdowns and search input to default.
     */
    _syncFilterControls() {
        if (this._searchInput) this._searchInput.value = '';

        const selects = this.container.querySelectorAll('.spellbook__select');
        selects.forEach(s => { s.selectedIndex = 0; });
    }

    // ─── Filter pills ──────────────────────────────────────

    _buildFilterPills() {
        this._pillsEl = el('div', { className: 'spellbook__pills' });
        return this._pillsEl;
    }

    _renderFilterPills() {
        clearChildren(this._pillsEl);
        if (!this.state.hasActiveFilters()) {
            this._pillsEl.classList.add('spellbook__pills--empty');
            return;
        }
        this._pillsEl.classList.remove('spellbook__pills--empty');

        if (this.state.searchQuery) {
            this._pillsEl.appendChild(this._makePill(
                `Search: "${this.state.searchQuery}"`,
                () => { this.state.setSearch(''); if (this._searchInput) this._searchInput.value = ''; }
            ));
        }
        if (this.state.filterLevel !== null) {
            const label = this.state.filterLevel === 0 ? 'Cantrip' : `Level ${this.state.filterLevel}`;
            this._pillsEl.appendChild(this._makePill(
                label,
                () => { this.state.setLevel(null); this._resetSelect('spellbook__filter-level'); }
            ));
        }
        if (this.state.filterSchool !== null) {
            this._pillsEl.appendChild(this._makePill(
                this.state.filterSchool,
                () => { this.state.setSchool(null); this._resetSelect('spellbook__filter-school'); }
            ));
        }
        if (this.state.filterClass !== null) {
            this._pillsEl.appendChild(this._makePill(
                this.state.filterClass,
                () => { this.state.setClass(null); this._resetSelect('spellbook__filter-class'); }
            ));
        }
        if (this.state.filterConcentration !== null) {
            this._pillsEl.appendChild(this._makePill(
                `Conc: ${this.state.filterConcentration ? 'Yes' : 'No'}`,
                () => { this.state.setConcentration(null); this._resetSelect('spellbook__filter-conc'); }
            ));
        }
        if (this.state.filterRitual !== null) {
            this._pillsEl.appendChild(this._makePill(
                `Ritual: ${this.state.filterRitual ? 'Yes' : 'No'}`,
                () => { this.state.setRitual(null); this._resetSelect('spellbook__filter-ritual'); }
            ));
        }
    }

    _makePill(text, onRemove) {
        return el('span', { className: 'spellbook__pill' }, [
            el('span', { className: 'spellbook__pill-text', textContent: text }),
            el('button', {
                className: 'spellbook__pill-remove',
                textContent: '\u2715',
                onClick: (e) => { e.stopPropagation(); onRemove(); },
            }),
        ]);
    }

    _resetSelect(id) {
        const selectEl = this.container.querySelector(`#${id}`);
        if (selectEl) selectEl.selectedIndex = 0;
    }

    // ─── Favorites section ──────────────────────────────────

    _buildFavoritesSection() {
        this._favoritesEl = el('div', { className: 'spellbook__favorites' });
        return this._favoritesEl;
    }

    _renderFavorites() {
        clearChildren(this._favoritesEl);
        const favSpells = this.state.getFavoriteSpells();

        if (favSpells.length === 0) {
            this._favoritesEl.classList.add('spellbook__favorites--empty');
            return;
        }

        this._favoritesEl.classList.remove('spellbook__favorites--empty');

        const header = el('div', { className: 'spellbook__favorites-header' }, [
            el('h3', { className: 'spellbook__favorites-title', textContent: 'Favorite Spells' }),
            el('span', {
                className: 'badge spellbook__favorites-count',
                textContent: `${favSpells.length} spell${favSpells.length !== 1 ? 's' : ''}`,
            }),
        ]);
        this._favoritesEl.appendChild(header);

        const strip = el('div', { className: 'spellbook__favorites-strip' });
        for (const spell of favSpells) {
            const chip = el('div', {
                className: 'spellbook__fav-chip',
                style: `border-color: ${SCHOOL_COLORS[spell.school] || 'var(--color-gold)'}`,
                onClick: () => this._openSpellDetail(spell),
            }, [
                el('span', { className: 'spellbook__fav-chip-name', textContent: spell.name }),
                el('span', {
                    className: 'spellbook__fav-chip-level',
                    textContent: spell.level === 0 ? 'C' : String(spell.level),
                }),
                el('button', {
                    className: 'spellbook__fav-chip-remove',
                    textContent: '\u2715',
                    onClick: (e) => {
                        e.stopPropagation();
                        this.state.toggleFavorite(spell.name);
                    },
                }),
            ]);
            strip.appendChild(chip);
        }
        this._favoritesEl.appendChild(strip);
    }

    // ─── Count bar ──────────────────────────────────────────

    _buildCountBar() {
        this._countEl = el('div', { className: 'spellbook__count' });
        return this._countEl;
    }

    _renderCount(filteredCount) {
        const total = this.state.totalSpellCount;
        this._countEl.textContent = `Showing ${filteredCount} of ${total} spells`;
    }

    // ─── Results grid ───────────────────────────────────────

    _buildGrid() {
        this._gridEl = el('div', { className: 'spellbook__grid' });
        return this._gridEl;
    }

    _refreshResults() {
        const spells = this.state.getFilteredSpells();
        this._renderCount(spells.length);
        this._renderFilterPills();
        this._renderFavorites();
        this._renderGrid(spells);
    }

    _renderGrid(spells) {
        clearChildren(this._gridEl);

        if (spells.length === 0) {
            this._gridEl.appendChild(
                el('div', { className: 'spellbook__empty' }, [
                    el('p', { className: 'spellbook__empty-icon', textContent: '\u{1F4D6}' }),
                    el('p', { textContent: 'No spells match your current filters.' }),
                    el('button', {
                        className: 'btn btn--sm',
                        textContent: 'Clear Filters',
                        onClick: () => {
                            this.state.clearFilters();
                            this._syncFilterControls();
                        },
                    }),
                ])
            );
            return;
        }

        for (const spell of spells) {
            this._gridEl.appendChild(this._buildSpellCard(spell));
        }
    }

    // ─── Spell card ─────────────────────────────────────────

    _buildSpellCard(spell) {
        const accentColor = SCHOOL_COLORS[spell.school] || 'var(--color-gold)';
        const isFav = this.state.isFavorite(spell.name);

        const card = el('div', {
            className: 'spellbook-card card',
            style: `--spell-accent: ${accentColor}`,
            onClick: () => this._openSpellDetail(spell),
        });

        // School accent bar
        card.appendChild(el('div', { className: 'spellbook-card__accent' }));

        // Header row: name + favorite star
        const headerRow = el('div', { className: 'spellbook-card__header' });

        headerRow.appendChild(el('h4', {
            className: 'spellbook-card__name',
            textContent: spell.name,
        }));

        const star = el('button', {
            className: `spellbook-card__star ${isFav ? 'spellbook-card__star--active' : ''}`,
            textContent: isFav ? '\u2605' : '\u2606',
            title: isFav ? 'Remove from favorites' : 'Add to favorites',
            onClick: (e) => {
                e.stopPropagation();
                this.state.toggleFavorite(spell.name);
            },
        });
        headerRow.appendChild(star);
        card.appendChild(headerRow);

        // Badges: level + school
        const badges = el('div', { className: 'spellbook-card__badges' });
        badges.appendChild(el('span', {
            className: 'badge spellbook-card__level-badge',
            textContent: formatSpellLevel(spell.level),
        }));
        badges.appendChild(el('span', {
            className: 'badge spellbook-card__school-badge',
            style: `background: ${accentColor}22; color: ${accentColor}; border: 1px solid ${accentColor}55`,
            textContent: spell.school,
        }));
        if (spell.concentration) {
            badges.appendChild(el('span', {
                className: 'badge spellbook-card__conc-badge',
                textContent: 'C',
                title: 'Concentration',
            }));
        }
        if (spell.ritual) {
            badges.appendChild(el('span', {
                className: 'badge spellbook-card__ritual-badge',
                textContent: 'R',
                title: 'Ritual',
            }));
        }
        card.appendChild(badges);

        // Stats grid
        const stats = el('div', { className: 'spellbook-card__stats' });
        stats.appendChild(this._buildCardStat('Cast', spell.castingTime));
        stats.appendChild(this._buildCardStat('Range', spell.range));
        stats.appendChild(this._buildCardStat('Duration', spell.duration));
        stats.appendChild(this._buildCardStat('Comp.', spell.components));
        card.appendChild(stats);

        // Classes tag line
        const classLine = el('div', {
            className: 'spellbook-card__classes',
            textContent: spell.classes.join(', '),
        });
        card.appendChild(classLine);

        return card;
    }

    _buildCardStat(label, value) {
        return el('div', { className: 'spellbook-card__stat' }, [
            el('span', { className: 'spellbook-card__stat-label', textContent: label }),
            el('span', { className: 'spellbook-card__stat-value', textContent: value }),
        ]);
    }

    // ─── Spell detail modal ─────────────────────────────────

    _openSpellDetail(spell) {
        const accentColor = SCHOOL_COLORS[spell.school] || 'var(--color-gold)';
        const isFav = this.state.isFavorite(spell.name);

        // Build modal content
        const content = el('div', { className: 'spellbook-detail' });

        // Top info row
        const topRow = el('div', { className: 'spellbook-detail__top' });

        const badges = el('div', { className: 'spellbook-detail__badges' });
        badges.appendChild(el('span', {
            className: 'badge',
            textContent: formatSpellLevel(spell.level),
        }));
        badges.appendChild(el('span', {
            className: 'badge',
            style: `background: ${accentColor}22; color: ${accentColor}; border: 1px solid ${accentColor}55`,
            textContent: spell.school,
        }));
        if (spell.concentration) {
            badges.appendChild(el('span', {
                className: 'badge spellbook-card__conc-badge',
                textContent: 'Concentration',
            }));
        }
        if (spell.ritual) {
            badges.appendChild(el('span', {
                className: 'badge spellbook-card__ritual-badge',
                textContent: 'Ritual',
            }));
        }
        topRow.appendChild(badges);

        // Favorite toggle in modal
        const favBtn = el('button', {
            className: `btn btn--sm spellbook-detail__fav-btn ${isFav ? 'spellbook-detail__fav-btn--active' : ''}`,
            textContent: isFav ? '\u2605 Favorited' : '\u2606 Favorite',
            onClick: () => {
                this.state.toggleFavorite(spell.name);
                const nowFav = this.state.isFavorite(spell.name);
                favBtn.textContent = nowFav ? '\u2605 Favorited' : '\u2606 Favorite';
                favBtn.classList.toggle('spellbook-detail__fav-btn--active', nowFav);
            },
        });
        topRow.appendChild(favBtn);
        content.appendChild(topRow);

        // Stats table
        const statsTable = el('div', { className: 'spellbook-detail__stats' });
        const statRows = [
            ['Casting Time', spell.castingTime],
            ['Range', spell.range],
            ['Components', spell.components],
            ['Duration', spell.duration],
            ['Classes', spell.classes.join(', ')],
        ];
        for (const [label, value] of statRows) {
            statsTable.appendChild(el('div', { className: 'spellbook-detail__stat-row' }, [
                el('span', { className: 'spellbook-detail__stat-label', textContent: label }),
                el('span', { className: 'spellbook-detail__stat-value', textContent: value }),
            ]));
        }
        content.appendChild(statsTable);

        // Divider
        content.appendChild(el('div', { className: 'divider', textContent: 'Description' }));

        // Description
        content.appendChild(el('div', {
            className: 'spellbook-detail__description',
            textContent: spell.description,
        }));

        // At higher levels
        if (spell.atHigherLevels) {
            content.appendChild(el('div', { className: 'divider', textContent: 'At Higher Levels' }));
            content.appendChild(el('div', {
                className: 'spellbook-detail__higher-levels',
                textContent: spell.atHigherLevels,
            }));
        }

        // Show modal using the project's showModal utility.
        // We pass null for onCancel so clicking overlay closes it,
        // and the confirm button acts as a "Close" button.
        const overlay = el('div', { className: 'modal-overlay' });
        const modal = el('div', { className: 'modal spellbook-detail__modal' });
        const titleRow = el('div', { className: 'spellbook-detail__title-row' }, [
            el('h3', {
                className: 'modal__title',
                textContent: spell.name,
                style: `color: ${accentColor}`,
            }),
            el('button', {
                className: 'btn btn--sm spellbook-detail__close',
                textContent: '\u2715 Close',
                onClick: () => overlay.remove(),
            }),
        ]);

        modal.appendChild(titleRow);
        modal.appendChild(content);
        overlay.appendChild(modal);

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.remove();
        });

        // Close on Escape key
        const onKey = (e) => {
            if (e.key === 'Escape') {
                overlay.remove();
                document.removeEventListener('keydown', onKey);
            }
        };
        document.addEventListener('keydown', onKey);

        document.body.appendChild(overlay);
    }
}
