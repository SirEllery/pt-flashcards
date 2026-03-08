/**
 * SM-2 Spaced Repetition Algorithm
 * Simplified SuperMemo-2 implementation for flashcard scheduling
 */

const SM2 = {
    // Default values for new cards
    DEFAULT_EASE: 2.5,
    DEFAULT_INTERVAL: 0,
    DEFAULT_REPETITIONS: 0,

    /**
     * Initialize a new card's SM2 data
     */
    initCard(wordId) {
        return {
            wordId,
            ease: this.DEFAULT_EASE,
            interval: this.DEFAULT_INTERVAL,
            repetitions: this.DEFAULT_REPETITIONS,
            dueDate: Date.now(), // Due immediately
            lastReviewed: null,
            correctCount: 0,
            incorrectCount: 0
        };
    },

    /**
     * Calculate new SM2 values after a review
     * @param {Object} card - Current card data
     * @param {number} quality - Rating: 0 (missed), 1 (almost), 2 (got it)
     * @returns {Object} Updated card data
     */
    review(card, quality) {
        const newCard = { ...card };
        
        // Update counts
        if (quality >= 2) {
            newCard.correctCount++;
        } else {
            newCard.incorrectCount++;
        }

        // SM-2 algorithm
        if (quality < 2) {
            // Failed - reset repetitions, keep ease mostly intact
            newCard.repetitions = 0;
            newCard.interval = 1; // Review in 1 day
        } else {
            // Success
            newCard.repetitions++;
            
            if (newCard.repetitions === 1) {
                newCard.interval = 1;
            } else if (newCard.repetitions === 2) {
                newCard.interval = 3;
            } else {
                newCard.interval = Math.round(newCard.interval * newCard.ease);
            }
        }

        // Update ease factor (SM-2 formula)
        // New ease = Old ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        // Simplified: quality 0-2 maps to SM-2's 0-5 scale
        const sm2Quality = quality * 2.5; // Convert 0-2 to 0-5
        const easeAdjustment = (0.1 - (5 - sm2Quality) * (0.08 + (5 - sm2Quality) * 0.02));
        newCard.ease = Math.max(1.3, Math.min(2.5, card.ease + easeAdjustment));

        // Set next due date
        newCard.lastReviewed = Date.now();
        newCard.dueDate = Date.now() + (newCard.interval * 24 * 60 * 60 * 1000);

        return newCard;
    },

    /**
     * Check if a card is due for review
     */
    isDue(card) {
        return card.dueDate <= Date.now();
    },

    /**
     * Get cards sorted by priority (due first, then by interval)
     */
    sortCards(cards) {
        return cards.sort((a, b) => {
            const aDue = this.isDue(a);
            const bDue = this.isDue(b);
            
            if (aDue && !bDue) return -1;
            if (!aDue && bDue) return 1;
            
            // Both due or both not due - sort by interval (shorter = higher priority)
            return a.interval - b.interval;
        });
    },

    /**
     * Get review statistics
     */
    getStats(cards) {
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;
        
        let due = 0;
        let learning = 0;
        let mastered = 0;
        
        for (const card of cards) {
            if (card.dueDate <= now) {
                due++;
            }
            
            if (card.repetitions < 5) {
                learning++;
            } else if (card.interval >= 30) {
                mastered++;
            }
        }
        
        return { due, learning, mastered };
    }
};

// Export for use in app
window.SM2 = SM2;
