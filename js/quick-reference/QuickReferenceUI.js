import { QUICK_REFERENCE_CATEGORIES } from '../data/quick-reference-data.js';
import { el, clearChildren } from '../utils/dom.js';

export class QuickReferenceUI {
    constructor(container) {
        this.container = container;
        this.activeCategory = 'all';
        this.searchQuery = '';
        this._debounceTimer = 0;
        this._expandedCards = new Set();
        this._build();
    }

    _build() {
        clearChildren(this.container);
        this.container.classList.add('qref');

        // Search bar
        const searchBar = el('div', { className: 'qref__search-bar' }, [
            el('input', {
                className: 'input qref__search-input',
                type: 'text',
                placeholder: 'Search rules, conditions, actions...',
                onInput: (e) => {
                    clearTimeout(this._debounceTimer);
                    this._debounceTimer = setTimeout(() => {
                        this.searchQuery = e.target.value.trim().toLowerCase();
                        this._renderCards();
                    }, 150);
                },
            }),
        ]);

        // Category pills
        this._pillsEl = el('div', { className: 'qref__pills' });
        this._buildPills();

        // Card grid
        this._gridEl = el('div', { className: 'qref__grid' });
        this._renderCards();

        this.container.append(searchBar, this._pillsEl, this._gridEl);
    }

    _buildPills() {
        clearChildren(this._pillsEl);

        const allPill = el('button', {
            className: `qref__pill ${this.activeCategory === 'all' ? 'qref__pill--active' : ''}`,
            textContent: 'All',
            onClick: () => { this.activeCategory = 'all'; this._buildPills(); this._renderCards(); },
        });
        this._pillsEl.appendChild(allPill);

        for (const cat of QUICK_REFERENCE_CATEGORIES) {
            const pill = el('button', {
                className: `qref__pill ${this.activeCategory === cat.id ? 'qref__pill--active' : ''}`,
                textContent: cat.title,
                onClick: () => { this.activeCategory = cat.id; this._buildPills(); this._renderCards(); },
            });
            this._pillsEl.appendChild(pill);
        }
    }

    _renderCards() {
        clearChildren(this._gridEl);

        for (const cat of QUICK_REFERENCE_CATEGORIES) {
            if (this.activeCategory !== 'all' && this.activeCategory !== cat.id) continue;

            const cards = this.searchQuery
                ? cat.cards.filter(c =>
                    c.title.toLowerCase().includes(this.searchQuery) ||
                    c.summary.toLowerCase().includes(this.searchQuery))
                : cat.cards;

            if (cards.length === 0) continue;

            // Category header
            if (this.activeCategory === 'all') {
                this._gridEl.appendChild(
                    el('h3', { className: 'qref__category-header', textContent: cat.title })
                );
            }

            const cardGrid = el('div', { className: 'qref__card-grid' });
            for (const card of cards) {
                cardGrid.appendChild(this._buildCard(card));
            }
            this._gridEl.appendChild(cardGrid);
        }

        if (this._gridEl.children.length === 0) {
            this._gridEl.appendChild(
                el('p', { className: 'qref__empty', textContent: 'No results found.' })
            );
        }
    }

    _buildCard(card) {
        const isExpanded = this._expandedCards.has(card.id);
        const accent = card.color || 'var(--color-gold)';

        const headerEl = el('div', { className: 'qref__card-header', style: `border-left-color: ${accent};` }, [
            el('h4', { className: 'qref__card-title', textContent: card.title }),
            el('span', { className: 'qref__card-toggle', textContent: isExpanded ? '\u25B2' : '\u25BC' }),
        ]);

        const summaryEl = el('p', { className: 'qref__card-summary', textContent: card.summary });

        const bodyEl = el('div', {
            className: 'qref__card-body',
            style: isExpanded ? '' : 'display: none;',
        });

        if (card.body) {
            for (const block of card.body) {
                bodyEl.appendChild(this._renderBlock(block));
            }
        }

        const cardEl = el('div', { className: `qref__card ${isExpanded ? 'qref__card--expanded' : ''}` }, [
            headerEl, summaryEl, bodyEl,
        ]);

        headerEl.addEventListener('click', () => {
            if (this._expandedCards.has(card.id)) {
                this._expandedCards.delete(card.id);
            } else {
                this._expandedCards.add(card.id);
            }
            const expanded = this._expandedCards.has(card.id);
            bodyEl.style.display = expanded ? '' : 'none';
            cardEl.classList.toggle('qref__card--expanded', expanded);
            headerEl.querySelector('.qref__card-toggle').textContent = expanded ? '\u25B2' : '\u25BC';
        });

        return cardEl;
    }

    _renderBlock(block) {
        switch (block.type) {
            case 'paragraph':
                return el('p', { className: 'qref__block-para', textContent: block.text });

            case 'list':
                return el('ul', { className: 'qref__block-list' },
                    (block.items || []).map(item => el('li', { textContent: item }))
                );

            case 'table': {
                const thead = el('thead', {}, [
                    el('tr', {}, (block.headers || []).map(h => el('th', { textContent: h })))
                ]);
                const tbody = el('tbody', {},
                    (block.rows || []).map(row =>
                        el('tr', {}, row.map(cell => el('td', { textContent: cell })))
                    )
                );
                return el('table', { className: 'qref__block-table' }, [thead, tbody]);
            }

            case 'stat':
                return el('div', { className: 'qref__block-stat' }, [
                    el('span', { className: 'qref__stat-label', textContent: block.label }),
                    el('span', { className: 'qref__stat-value', textContent: block.value }),
                ]);

            case 'note':
                return el('div', { className: 'qref__block-note', textContent: block.text });

            default:
                return el('span');
        }
    }
}
