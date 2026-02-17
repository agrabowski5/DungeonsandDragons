import { $, $$ } from './utils/dom.js';
import { Storage } from './utils/storage.js';
import { MapController } from './map-builder/MapController.js';
import { EncounterUI } from './encounter/EncounterUI.js';

const ACTIVE_TAB_KEY = 'dnd_active_tab';

class App {
    constructor() {
        this.tabs = $$('.tab-nav__btn');
        this.panels = $$('.tab-panel');
        this.mapController = null;
        this.encounterUI = null;

        this._bindTabs();
        this._restoreTab();
        this._initModules();
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

        if (tabId === 'map-builder' && this.mapController) {
            this.mapController.onTabActivated();
        }
    }

    _restoreTab() {
        const saved = Storage.load(ACTIVE_TAB_KEY, 'map-builder');
        this._switchTab(saved);
    }

    _initModules() {
        const mapPanel = $('#map-builder');
        const encounterPanel = $('#encounter-creator');

        if (mapPanel) {
            this.mapController = new MapController(mapPanel);
        }

        if (encounterPanel) {
            this.encounterUI = new EncounterUI(encounterPanel);
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});
