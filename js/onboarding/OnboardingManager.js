import { el } from '../utils/dom.js';
import { Storage } from '../utils/storage.js';

const ONBOARDING_KEY = 'dnd_onboarding_complete';

const STEPS = [
    {
        title: 'Welcome, Adventurer!',
        message: 'Welcome to the D&D Homebrew Toolkit — your all-in-one companion for tabletop gaming. Let me show you around.',
        target: null,
        position: 'center',
    },
    {
        title: 'Navigation',
        message: 'Use these tabs to switch between all the tools in your toolkit. Each one is built for a different part of your D&D experience.',
        target: '.tab-nav',
        position: 'bottom',
    },
    {
        title: 'Map Builder',
        message: 'Create battle maps with terrain painting, tokens, drawing tools, stamps, fog of war, and more. Perfect for tactical combat.',
        target: '[data-tab="map-builder"]',
        position: 'bottom',
    },
    {
        title: 'Encounter Creator',
        message: 'Build balanced combat encounters with 70+ monsters, automatic difficulty calculation, and a full initiative tracker.',
        target: '[data-tab="encounter-creator"]',
        position: 'bottom',
    },
    {
        title: 'Character Sheets',
        message: 'Create and manage full 5e character sheets with ability scores, skills, inventory, spellcasting, and more.',
        target: '[data-tab="character-sheets"]',
        position: 'bottom',
    },
    {
        title: 'Spell Book',
        message: 'Browse and search hundreds of SRD spells. Filter by level, school, class, and save your favorites.',
        target: '[data-tab="spell-book"]',
        position: 'bottom',
    },
    {
        title: 'Dice Roller',
        message: 'Roll any die with animated visuals, advantage/disadvantage, custom formulas, and a roll history log.',
        target: '[data-tab="dice-roller"]',
        position: 'bottom',
    },
    {
        title: 'More Tools',
        message: 'Generate random loot and treasure, create NPCs with backstories, and keep session notes organized by campaign.',
        target: '[data-tab="loot-generator"]',
        position: 'bottom',
    },
    {
        title: 'You\'re All Set!',
        message: 'Everything saves automatically to your browser. Click the ? button anytime for help. Now go forth and roll some dice!',
        target: null,
        position: 'center',
    },
];

export class OnboardingManager {
    constructor() {
        this.currentStep = 0;
        this.overlay = null;
    }

    shouldShow() {
        return !Storage.load(ONBOARDING_KEY, false);
    }

    start() {
        if (!this.shouldShow()) return;
        this.currentStep = 0;
        this._showStep();
    }

    _showStep() {
        this._removeOverlay();
        if (this.currentStep >= STEPS.length) {
            this._complete();
            return;
        }

        const step = STEPS[this.currentStep];
        this.overlay = el('div', { className: 'onboarding-overlay' });

        // Spotlight
        if (step.target) {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                const spotlight = el('div', { className: 'onboarding-spotlight' });
                spotlight.style.top = (rect.top - 8) + 'px';
                spotlight.style.left = (rect.left - 8) + 'px';
                spotlight.style.width = (rect.width + 16) + 'px';
                spotlight.style.height = (rect.height + 16) + 'px';
                this.overlay.appendChild(spotlight);
            }
        }

        // Tooltip
        const tooltip = el('div', { className: `onboarding-tooltip onboarding-tooltip--${step.position}` }, [
            el('div', { className: 'onboarding-tooltip__step', textContent: `${this.currentStep + 1} / ${STEPS.length}` }),
            el('h3', { className: 'onboarding-tooltip__title', textContent: step.title }),
            el('p', { className: 'onboarding-tooltip__message', textContent: step.message }),
            el('div', { className: 'onboarding-tooltip__actions' }, [
                el('button', {
                    className: 'btn btn--sm',
                    textContent: 'Skip Tour',
                    onClick: () => this._complete(),
                }),
                el('button', {
                    className: 'btn btn--sm btn--primary',
                    textContent: this.currentStep === STEPS.length - 1 ? 'Get Started' : 'Next',
                    onClick: () => { this.currentStep++; this._showStep(); },
                }),
            ]),
        ]);

        if (step.target && step.position !== 'center') {
            const targetEl = document.querySelector(step.target);
            if (targetEl) {
                const rect = targetEl.getBoundingClientRect();
                tooltip.style.position = 'fixed';
                tooltip.style.left = Math.max(16, rect.left) + 'px';
                tooltip.style.top = (rect.bottom + 16) + 'px';
            }
        }

        this.overlay.appendChild(tooltip);
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay) {
                this.currentStep++;
                this._showStep();
            }
        });

        document.body.appendChild(this.overlay);
    }

    _removeOverlay() {
        if (this.overlay) {
            this.overlay.remove();
            this.overlay = null;
        }
    }

    _complete() {
        this._removeOverlay();
        Storage.save(ONBOARDING_KEY, true);
    }

    static reset() {
        Storage.remove(ONBOARDING_KEY);
    }
}
