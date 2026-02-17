import { $, $$ } from './utils/dom.js';
import { Storage } from './utils/storage.js';
import { MapController } from './map-builder/MapController.js';
import { EncounterUI } from './encounter/EncounterUI.js';
import { OnboardingManager } from './onboarding/OnboardingManager.js';

const ACTIVE_TAB_KEY = 'dnd_active_tab';

class App {
    constructor() {
        this.tabs = $$('.tab-nav__btn');
        this.panels = $$('.tab-panel');
        this.modules = {};
        this.onboarding = new OnboardingManager();

        this._bindTabs();
        this._bindHelp();
        this._restoreTab();

        // Start onboarding for first-time visitors (slight delay for DOM)
        setTimeout(() => this.onboarding.start(), 500);
    }

    _bindHelp() {
        const helpBtn = $('#help-btn');
        if (helpBtn) {
            helpBtn.addEventListener('click', () => {
                OnboardingManager.reset();
                this.onboarding = new OnboardingManager();
                this.onboarding.start();
            });
        }
    }

    _bindTabs() {
        for (const tab of this.tabs) {
            tab.addEventListener('click', () => {
                this._switchTab(tab.dataset.tab);
            });
        }
    }

    _switchTab(tabId) {
        for (const tab of this.tabs) {
            const isActive = tab.dataset.tab === tabId;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive);
        }

        for (const panel of this.panels) {
            panel.classList.toggle('active', panel.id === tabId);
        }

        Storage.save(ACTIVE_TAB_KEY, tabId);
        this._ensureModule(tabId);
    }

    _restoreTab() {
        const saved = Storage.load(ACTIVE_TAB_KEY, 'map-builder');
        this._switchTab(saved);
    }

    async _ensureModule(tabId) {
        if (this.modules[tabId]) {
            if (this.modules[tabId].onTabActivated) {
                this.modules[tabId].onTabActivated();
            }
            return;
        }

        const panel = document.getElementById(tabId);
        if (!panel) return;

        try {
            switch (tabId) {
                case 'map-builder':
                    this.modules[tabId] = new MapController(panel);
                    break;
                case 'encounter-creator':
                    this.modules[tabId] = new EncounterUI(panel);
                    break;
                case 'character-sheets': {
                    const { CharacterSheetUI } = await import('./character/CharacterSheetUI.js');
                    this.modules[tabId] = new CharacterSheetUI(panel);
                    break;
                }
                case 'spell-book': {
                    const { SpellBookUI } = await import('./spellbook/SpellBookUI.js');
                    this.modules[tabId] = new SpellBookUI(panel);
                    break;
                }
                case 'dice-roller': {
                    const { DiceRollerUI } = await import('./dice-roller/DiceRollerUI.js');
                    this.modules[tabId] = new DiceRollerUI(panel);
                    break;
                }
                case 'loot-generator': {
                    const { LootGeneratorUI } = await import('./loot/LootGeneratorUI.js');
                    this.modules[tabId] = new LootGeneratorUI(panel);
                    break;
                }
                case 'npc-generator': {
                    const { NPCGeneratorUI } = await import('./npc/NPCGeneratorUI.js');
                    this.modules[tabId] = new NPCGeneratorUI(panel);
                    break;
                }
                case 'session-notes': {
                    const { SessionNotesUI } = await import('./notes/SessionNotesUI.js');
                    this.modules[tabId] = new SessionNotesUI(panel);
                    break;
                }
            }
        } catch (err) {
            console.error(`Failed to load module for ${tabId}:`, err);
            panel.innerHTML = '<div class="card"><h3 class="card__header">Loading Error</h3><p>Failed to load this module. Please refresh the page.</p></div>';
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
