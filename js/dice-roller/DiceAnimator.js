/**
 * DiceAnimator handles all roll animations: die button shaking,
 * result number reveal, and rolling number cascade.
 */
export class DiceAnimator {
    constructor() {
        this._activeAnimations = new Map();
    }

    /**
     * Animate a die button with a shake/bounce effect.
     * @param {HTMLElement} buttonEl - The die button element
     * @returns {Promise<void>} resolves when animation completes
     */
    shakeButton(buttonEl) {
        return new Promise((resolve) => {
            // Cancel any running animation on this button
            if (this._activeAnimations.has(buttonEl)) {
                buttonEl.classList.remove('dice-btn--rolling');
                this._activeAnimations.get(buttonEl)();
            }

            buttonEl.classList.add('dice-btn--rolling');

            const onEnd = () => {
                buttonEl.classList.remove('dice-btn--rolling');
                buttonEl.removeEventListener('animationend', onEnd);
                this._activeAnimations.delete(buttonEl);
                resolve();
            };

            this._activeAnimations.set(buttonEl, () => {
                buttonEl.removeEventListener('animationend', onEnd);
                resolve();
            });

            buttonEl.addEventListener('animationend', onEnd, { once: true });
        });
    }

    /**
     * Animate the result display with a cascading number effect
     * that settles on the final value.
     * @param {HTMLElement} resultEl - The result number element
     * @param {number} finalValue - The final number to display
     * @param {number} maxSides - Max die sides (for random range)
     * @param {number} [duration=600] - Total animation duration in ms
     * @returns {Promise<void>}
     */
    animateResult(resultEl, finalValue, maxSides, duration = 600) {
        return new Promise((resolve) => {
            resultEl.classList.remove('dice-result__number--revealed');

            const startTime = performance.now();
            const intervalCount = Math.floor(duration / 50);
            let frame = 0;

            const cascade = () => {
                const elapsed = performance.now() - startTime;
                const progress = Math.min(elapsed / duration, 1);

                if (progress < 1) {
                    // Show random numbers that cascade
                    const randomVal = Math.floor(Math.random() * maxSides) + 1;
                    resultEl.textContent = randomVal;

                    // Slow down the updates as we approach the end
                    const delay = 30 + (progress * 120);
                    frame = requestAnimationFrame(() => {
                        setTimeout(cascade, delay);
                    });
                } else {
                    // Land on final value
                    resultEl.textContent = finalValue;
                    resultEl.classList.add('dice-result__number--revealed');
                    resolve();
                }
            };

            cascade();
        });
    }

    /**
     * Animate the entire result display container (fade in + scale).
     * @param {HTMLElement} containerEl - The result display container
     */
    revealResult(containerEl) {
        containerEl.classList.remove('dice-result--visible');
        // Force reflow so re-adding the class triggers animation
        void containerEl.offsetWidth;
        containerEl.classList.add('dice-result--visible');
    }

    /**
     * Animate a history entry sliding in.
     * @param {HTMLElement} entryEl - The history row element
     */
    slideInEntry(entryEl) {
        entryEl.classList.add('dice-history__entry--new');
        setTimeout(() => {
            entryEl.classList.remove('dice-history__entry--new');
        }, 500);
    }

    /**
     * Flash a critical hit or critical miss effect.
     * @param {HTMLElement} resultEl - The result container
     * @param {'crit'|'fumble'} type
     */
    flashCritical(resultEl, type) {
        const cls = type === 'crit'
            ? 'dice-result--crit'
            : 'dice-result--fumble';

        resultEl.classList.remove('dice-result--crit', 'dice-result--fumble');
        void resultEl.offsetWidth;
        resultEl.classList.add(cls);

        setTimeout(() => {
            resultEl.classList.remove(cls);
        }, 2000);
    }
}
