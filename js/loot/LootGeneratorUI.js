// ─── Loot Generator UI ───────────────────────────────────────────────────
// Main UI controller for the D&D 5e Loot Generator module.

import { el, $, clearChildren } from '../utils/dom.js';
import { LootGenerator } from './LootTables.js';

const CR_TIERS = [
    { label: 'CR 0-4', value: '0-4' },
    { label: 'CR 5-10', value: '5-10' },
    { label: 'CR 11-16', value: '11-16' },
    { label: 'CR 17+', value: '17+' },
];

const LOOT_TYPES = [
    { label: 'Individual Treasure', value: 'individual' },
    { label: 'Treasure Hoard', value: 'hoard' },
];

const COIN_META = {
    cp: { label: 'Copper', icon: '\u{1FA99}', className: 'loot-coin--copper' },
    sp: { label: 'Silver', icon: '\u{1FA99}', className: 'loot-coin--silver' },
    ep: { label: 'Electrum', icon: '\u{1FA99}', className: 'loot-coin--electrum' },
    gp: { label: 'Gold', icon: '\u{1FA99}', className: 'loot-coin--gold' },
    pp: { label: 'Platinum', icon: '\u{1FA99}', className: 'loot-coin--platinum' },
};

const RARITY_COLORS = {
    common: '#78909c',
    uncommon: '#4caf50',
    rare: '#2196f3',
    'very rare': '#9c27b0',
    legendary: '#ff9800',
};

const MAX_HISTORY = 10;

export class LootGeneratorUI {
    constructor(container) {
        this.container = container;
        this.selectedTier = '0-4';
        this.selectedType = 'individual';
        this.currentResult = null;
        this.history = [];

        this.render();
    }

    // ─── Full Render ─────────────────────────────────────────────────

    render() {
        clearChildren(this.container);

        const layout = el('div', { className: 'loot-layout' });

        // Left column: controls
        const left = el('div', { className: 'loot-controls' });
        left.appendChild(this._buildCRSelector());
        left.appendChild(this._buildTypeToggle());
        left.appendChild(this._buildGenerateButton());
        left.appendChild(this._buildHistoryPanel());
        layout.appendChild(left);

        // Right column: results
        const right = el('div', { className: 'loot-results' });
        this._resultContainer = right;
        if (this.currentResult) {
            right.appendChild(this._buildResultCard(this.currentResult));
        } else {
            right.appendChild(this._buildEmptyState());
        }
        layout.appendChild(right);

        this.container.appendChild(layout);
    }

    // ─── CR Range Selector ───────────────────────────────────────────

    _buildCRSelector() {
        const card = el('div', { className: 'card' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'Challenge Rating' }));

        const group = el('div', { className: 'loot-cr-group' });
        for (const tier of CR_TIERS) {
            const isActive = tier.value === this.selectedTier;
            const btn = el('button', {
                className: `btn loot-cr-btn ${isActive ? 'btn--active' : ''}`,
                textContent: tier.label,
                onClick: () => {
                    this.selectedTier = tier.value;
                    this._refreshCRButtons(group);
                },
            });
            btn.dataset.tier = tier.value;
            group.appendChild(btn);
        }
        card.appendChild(group);
        return card;
    }

    _refreshCRButtons(group) {
        const buttons = group.querySelectorAll('.loot-cr-btn');
        for (const btn of buttons) {
            const isActive = btn.dataset.tier === this.selectedTier;
            btn.classList.toggle('btn--active', isActive);
        }
    }

    // ─── Loot Type Toggle ────────────────────────────────────────────

    _buildTypeToggle() {
        const card = el('div', { className: 'card' });
        card.appendChild(el('h3', { className: 'card__header', textContent: 'Loot Type' }));

        const toggle = el('div', { className: 'loot-type-toggle' });
        for (const type of LOOT_TYPES) {
            const isActive = type.value === this.selectedType;
            const btn = el('button', {
                className: `loot-type-btn ${isActive ? 'loot-type-btn--active' : ''}`,
                textContent: type.label,
                onClick: () => {
                    this.selectedType = type.value;
                    this._refreshTypeButtons(toggle);
                },
            });
            btn.dataset.type = type.value;
            toggle.appendChild(btn);
        }
        card.appendChild(toggle);
        return card;
    }

    _refreshTypeButtons(toggle) {
        const buttons = toggle.querySelectorAll('.loot-type-btn');
        for (const btn of buttons) {
            const isActive = btn.dataset.type === this.selectedType;
            btn.classList.toggle('loot-type-btn--active', isActive);
        }
    }

    // ─── Generate Button ─────────────────────────────────────────────

    _buildGenerateButton() {
        const wrapper = el('div', { className: 'loot-generate-wrapper' });
        const btn = el('button', {
            className: 'btn btn--primary loot-generate-btn',
            onClick: () => this._generateLoot(),
        }, [
            el('span', { className: 'loot-generate-btn__icon', textContent: '\u{1F4B0}' }),
            el('span', { textContent: 'Generate Loot' }),
        ]);
        wrapper.appendChild(btn);
        return wrapper;
    }

    // ─── Generation Logic ────────────────────────────────────────────

    _generateLoot() {
        const result = LootGenerator.generate(this.selectedType, this.selectedTier);
        this.currentResult = result;

        // Add to history
        this.history.unshift(result);
        if (this.history.length > MAX_HISTORY) {
            this.history.pop();
        }

        // Refresh result display
        this._refreshResult();
        this._refreshHistory();
    }

    _refreshResult() {
        if (!this._resultContainer) return;
        clearChildren(this._resultContainer);
        if (this.currentResult) {
            this._resultContainer.appendChild(this._buildResultCard(this.currentResult));
        } else {
            this._resultContainer.appendChild(this._buildEmptyState());
        }
    }

    // ─── Empty State ─────────────────────────────────────────────────

    _buildEmptyState() {
        const empty = el('div', { className: 'card loot-empty' });
        empty.appendChild(el('div', { className: 'loot-empty__icon', textContent: '\u{1F4E6}' }));
        empty.appendChild(el('h3', { className: 'loot-empty__title', textContent: 'No Loot Generated' }));
        empty.appendChild(el('p', {
            className: 'loot-empty__text',
            textContent: 'Select a challenge rating and loot type, then hit Generate to roll for treasure.',
        }));
        return empty;
    }

    // ─── Result Card ─────────────────────────────────────────────────

    _buildResultCard(result) {
        const card = el('div', { className: 'card loot-result-card' });

        // Header
        const typeLabel = result.type === 'hoard' ? 'Treasure Hoard' : 'Individual Treasure';
        const header = el('div', { className: 'loot-result-header' }, [
            el('h3', { className: 'card__header loot-result-title', textContent: `${typeLabel} \u2014 CR ${result.tier}` }),
            el('div', { className: 'loot-result-actions' }, [
                el('button', {
                    className: 'btn btn--sm',
                    textContent: 'Reroll',
                    onClick: () => this._generateLoot(),
                }),
                el('button', {
                    className: 'btn btn--sm',
                    textContent: 'Copy',
                    onClick: (e) => this._copyToClipboard(result, e.target),
                }),
            ]),
        ]);
        card.appendChild(header);

        // Coins section
        const hasCoins = Object.values(result.coins).some(v => v > 0);
        if (hasCoins) {
            card.appendChild(this._buildCoinsSection(result.coins));
        }

        // Gems & Art section
        if (result.gemsAndArt.length > 0) {
            card.appendChild(this._buildGemsArtSection(result.gemsAndArt));
        }

        // Magic Items section
        if (result.magicItems.length > 0) {
            card.appendChild(this._buildMagicItemsSection(result.magicItems));
        }

        // Total value footer
        card.appendChild(this._buildTotalValue(result.totalGP));

        return card;
    }

    // ─── Coins Display ───────────────────────────────────────────────

    _buildCoinsSection(coins) {
        const section = el('div', { className: 'loot-section' });
        section.appendChild(el('div', { className: 'divider', textContent: 'Coins' }));

        const grid = el('div', { className: 'loot-coins-grid' });
        const order = ['cp', 'sp', 'ep', 'gp', 'pp'];

        for (const type of order) {
            const amount = coins[type];
            if (!amount || amount <= 0) continue;

            const meta = COIN_META[type];
            const coin = el('div', { className: `loot-coin ${meta.className}` }, [
                el('div', { className: 'loot-coin__circle' }, [
                    el('span', { className: 'loot-coin__abbr', textContent: type.toUpperCase() }),
                ]),
                el('div', { className: 'loot-coin__info' }, [
                    el('span', { className: 'loot-coin__amount', textContent: amount.toLocaleString() }),
                    el('span', { className: 'loot-coin__label', textContent: meta.label }),
                ]),
            ]);
            grid.appendChild(coin);
        }

        section.appendChild(grid);
        return section;
    }

    // ─── Gems & Art Objects Display ──────────────────────────────────

    _buildGemsArtSection(items) {
        const section = el('div', { className: 'loot-section' });
        section.appendChild(el('div', { className: 'divider', textContent: 'Gems & Art Objects' }));

        const list = el('div', { className: 'loot-valuables-list' });
        for (const item of items) {
            const qty = item.count > 1 ? ` x${item.count}` : '';
            const typeIcon = item.type === 'gem' ? '\u{1F48E}' : '\u{1F3A8}';
            const totalVal = item.value * (item.count || 1);

            const row = el('div', { className: 'loot-valuable' }, [
                el('span', { className: 'loot-valuable__icon', textContent: typeIcon }),
                el('div', { className: 'loot-valuable__info' }, [
                    el('span', { className: 'loot-valuable__name', textContent: `${item.name}${qty}` }),
                    el('span', { className: 'loot-valuable__value', textContent: `${totalVal.toLocaleString()} gp` }),
                ]),
            ]);
            list.appendChild(row);
        }

        section.appendChild(list);
        return section;
    }

    // ─── Magic Items Display ─────────────────────────────────────────

    _buildMagicItemsSection(items) {
        const section = el('div', { className: 'loot-section' });
        section.appendChild(el('div', { className: 'divider', textContent: 'Magic Items' }));

        const list = el('div', { className: 'loot-magic-list' });
        for (const item of items) {
            const color = RARITY_COLORS[item.rarity] || RARITY_COLORS.common;

            const badge = el('span', {
                className: 'badge loot-rarity-badge',
                textContent: item.rarity,
                style: `background: ${color}22; color: ${color}; border: 1px solid ${color};`,
            });

            const attnBadge = item.attunement
                ? el('span', { className: 'loot-attunement-badge', textContent: 'Attunement' })
                : null;

            const nameRow = el('div', { className: 'loot-magic-item__header' }, [
                el('span', { className: 'loot-magic-item__name', textContent: item.name }),
                badge,
            ]);
            if (attnBadge) nameRow.appendChild(attnBadge);

            const entry = el('div', { className: 'loot-magic-item' }, [
                el('div', { className: 'loot-magic-item__icon', textContent: '\u{2728}' }),
                el('div', { className: 'loot-magic-item__body' }, [
                    nameRow,
                    el('p', { className: 'loot-magic-item__desc', textContent: item.description }),
                ]),
            ]);
            list.appendChild(entry);
        }

        section.appendChild(list);
        return section;
    }

    // ─── Total Value ─────────────────────────────────────────────────

    _buildTotalValue(totalGP) {
        return el('div', { className: 'loot-total' }, [
            el('span', { className: 'loot-total__label', textContent: 'Estimated Total Value' }),
            el('span', { className: 'loot-total__value', textContent: `${totalGP.toLocaleString()} gp` }),
        ]);
    }

    // ─── Copy to Clipboard ───────────────────────────────────────────

    _copyToClipboard(result, btnEl) {
        const text = LootGenerator.formatAsText(result);
        navigator.clipboard.writeText(text).then(() => {
            const original = btnEl.textContent;
            btnEl.textContent = 'Copied!';
            setTimeout(() => { btnEl.textContent = original; }, 1500);
        }).catch(() => {
            // Fallback
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);

            const original = btnEl.textContent;
            btnEl.textContent = 'Copied!';
            setTimeout(() => { btnEl.textContent = original; }, 1500);
        });
    }

    // ─── Loot History Panel ──────────────────────────────────────────

    _buildHistoryPanel() {
        const card = el('div', { className: 'card loot-history-card' });

        const headerRow = el('div', { className: 'loot-history-header' }, [
            el('h3', { className: 'card__header', textContent: 'Loot History' }),
        ]);
        card.appendChild(headerRow);

        this._historyList = el('div', { className: 'loot-history-list' });
        this._populateHistory();
        card.appendChild(this._historyList);

        return card;
    }

    _populateHistory() {
        if (!this._historyList) return;
        clearChildren(this._historyList);

        if (this.history.length === 0) {
            this._historyList.appendChild(
                el('p', { className: 'loot-history-empty', textContent: 'No loot generated yet.' })
            );
            return;
        }

        for (let i = 0; i < this.history.length; i++) {
            const result = this.history[i];
            const isCurrent = result === this.currentResult;
            const typeLabel = result.type === 'hoard' ? 'Hoard' : 'Individual';
            const time = new Date(result.timestamp);
            const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

            const item = el('div', {
                className: `loot-history-item ${isCurrent ? 'loot-history-item--active' : ''}`,
                onClick: () => {
                    this.currentResult = result;
                    this._refreshResult();
                    this._refreshHistory();
                },
            }, [
                el('div', { className: 'loot-history-item__info' }, [
                    el('span', {
                        className: 'loot-history-item__type',
                        textContent: `${typeLabel} \u2022 CR ${result.tier}`,
                    }),
                    el('span', {
                        className: 'loot-history-item__value',
                        textContent: `${result.totalGP.toLocaleString()} gp`,
                    }),
                ]),
                el('span', { className: 'loot-history-item__time', textContent: timeStr }),
            ]);

            this._historyList.appendChild(item);
        }
    }

    _refreshHistory() {
        this._populateHistory();
    }

    // ─── Tab Lifecycle ───────────────────────────────────────────────

    onTabActivated() {
        // Nothing special needed on re-activation
    }
}
