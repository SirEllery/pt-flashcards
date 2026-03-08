/**
 * Portuguese Flashcards - Main Application
 * Minimal, modern flashcard app with SM-2 spaced repetition
 */

const App = {
    // State
    state: {
        currentMode: 'flashcard', // 'flashcard', 'quiz', or 'sounds'
        currentFilter: 'all',
        currentWordIndex: 0,
        isFlipped: false,
        quizState: {
            currentQuestion: 0,
            score: 0,
            totalQuestions: 10,
            selectedOption: null,
            answered: false
        },
        soundsState: {
            currentSoundIndex: 0,
            showingDetail: false
        },
        dailyGoal: 20,
        wordsStudiedToday: 0,
        lastStudyDate: null
    },

    // Data
    words: [],
    cards: {}, // wordId -> card data
    stats: {
        totalReviews: 0,
        correctReviews: 0,
        streak: 0,
        lastStudyDate: null,
        wordsLearned: 0
    },

    /**
     * Initialize the app
     */
    async init() {
        // Initialize speech
        Speech.init();

        // Load data and progress
        this.loadProgress();
        this.applyFilter();
        this.checkDailyReset();

        // Setup event listeners
        this.setupEventListeners();

        // Render initial state
        this.renderCard();
        this.updateProgress();
        this.updateStats();

        // Check for dark mode preference
        this.loadTheme();

        console.log('App initialized');
    },

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const savedCards = localStorage.getItem('pt-flashcards-cards');
            const savedStats = localStorage.getItem('pt-flashcards-stats');
            const savedDaily = localStorage.getItem('pt-flashcards-daily');

            if (savedCards) {
                this.cards = JSON.parse(savedCards);
            }

            if (savedStats) {
                this.stats = JSON.parse(savedStats);
            }

            if (savedDaily) {
                const daily = JSON.parse(savedDaily);
                this.state.wordsStudiedToday = daily.wordsStudiedToday || 0;
                this.state.lastStudyDate = daily.lastStudyDate;
            }

            // Initialize cards for words that don't have them yet
            WORDS.forEach(word => {
                if (!this.cards[word.id]) {
                    this.cards[word.id] = SM2.initCard(word.id);
                }
            });
        } catch (e) {
            console.error('Error loading progress:', e);
            this.cards = {};
            this.stats = {
                totalReviews: 0,
                correctReviews: 0,
                streak: 0,
                lastStudyDate: null,
                wordsLearned: 0
            };
        }
    },

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            localStorage.setItem('pt-flashcards-cards', JSON.stringify(this.cards));
            localStorage.setItem('pt-flashcards-stats', JSON.stringify(this.stats));
            localStorage.setItem('pt-flashcards-daily', JSON.stringify({
                wordsStudiedToday: this.state.wordsStudiedToday,
                lastStudyDate: this.state.lastStudyDate
            }));
        } catch (e) {
            console.error('Error saving progress:', e);
        }
    },

    /**
     * Check and reset daily goal if new day
     */
    checkDailyReset() {
        const today = new Date().toDateString();
        
        if (this.state.lastStudyDate !== today) {
            // Check if we're continuing a streak
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (this.state.lastStudyDate === yesterday.toDateString()) {
                // Streak continues
            } else if (this.state.lastStudyDate && this.state.lastStudyDate !== today) {
                // Streak broken
                this.stats.streak = 0;
            }
            
            // Reset daily count
            this.state.wordsStudiedToday = 0;
            this.state.lastStudyDate = today;
            this.saveProgress();
        }
    },

    /**
     * Apply current filter to word list
     */
    applyFilter() {
        const filter = this.state.currentFilter;
        this.words = WORD_TYPES[filter] || WORD_TYPES.all;
        
        // Update filter select count display
        const select = document.getElementById('filter-select');
        const counts = {
            all: WORDS.length,
            function: FUNCTION_WORDS.length,
            verb: WORD_TYPES.verb.length,
            noun: WORD_TYPES.noun.length,
            adjective: WORD_TYPES.adjective.length,
            adverb: WORD_TYPES.adverb.length,
            pronoun: WORD_TYPES.pronoun.length,
            article: WORD_TYPES.article.length,
            preposition: WORD_TYPES.preposition.length,
            conjunction: WORD_TYPES.conjunction.length
        };
        
        select.innerHTML = Object.entries(counts).map(([key, count]) => {
            const label = key === 'all' ? 'All Words' : 
                         key === 'function' ? 'Function Words' :
                         key + 's' + ' (' + count + ')';
            return `<option value="${key}" ${key === filter ? 'selected' : ''}>${label}</option>`;
        }).join('');
        
        this.state.currentWordIndex = 0;
    },

    /**
     * Get the current word
     */
    getCurrentWord() {
        if (!this.words || this.words.length === 0) {
            return WORDS[0]; // Fallback to all words
        }
        return this.words[this.state.currentWordIndex] || WORDS[0];
    },

    /**
     * Get next word prioritizing due cards
     */
    getNextWord() {
        // Filter to words in current category
        const categoryWords = this.words;
        
        // Find due cards
        const dueCards = categoryWords
            .map(w => this.cards[w.id])
            .filter(card => SM2.isDue(card));
        
        if (dueCards.length > 0) {
            // Pick a due card (random from top 5 for variety)
            const pick = dueCards[Math.min(Math.floor(Math.random() * 5), dueCards.length - 1)];
            return WORDS.find(w => w.id === pick.wordId);
        }
        
        // No due cards - pick new/learning card
        const learningCards = categoryWords
            .filter(w => this.cards[w.id].repetitions < 3);
        
        if (learningCards.length > 0) {
            return learningCards[Math.floor(Math.random() * learningCards.length)];
        }
        
        // Fall back to random
        return categoryWords[Math.floor(Math.random() * categoryWords.length)];
    },

    /**
     * Render the current flashcard
     */
    renderCard() {
        const word = this.getCurrentWord();
        if (!word) return;

        const card = document.getElementById('flashcard');
        const cardWord = document.getElementById('card-word');
        const cardAnswer = document.getElementById('card-answer');
        const cardType = document.getElementById('card-type');
        const examplePt = document.getElementById('example-pt');
        const exampleEn = document.getElementById('example-en');
        const speakExample = document.getElementById('speak-example');

        // Reset flip state
        this.state.isFlipped = false;
        card.classList.remove('flipped');

        // Update content
        cardWord.textContent = word.pt;
        cardAnswer.textContent = word.en;
        cardType.textContent = word.type;
        examplePt.textContent = word.example_pt;
        exampleEn.textContent = word.example_en;

        // Show/hide example button based on word type
        speakExample.style.display = word.example_pt ? 'inline-flex' : 'none';

        // Hide actions until flipped
        document.getElementById('card-actions').style.opacity = '0';
        document.getElementById('card-actions').style.pointerEvents = 'none';
    },

    /**
     * Flip the card
     */
    flipCard() {
        const card = document.getElementById('flashcard');
        this.state.isFlipped = !this.state.isFlipped;
        card.classList.toggle('flipped');

        // Show actions when flipped
        const actions = document.getElementById('card-actions');
        if (this.state.isFlipped) {
            actions.style.opacity = '1';
            actions.style.pointerEvents = 'auto';
        } else {
            actions.style.opacity = '0';
            actions.style.pointerEvents = 'none';
        }
    },

    /**
     * Handle rating button click
     */
    rateCard(rating) {
        const word = this.getCurrentWord();
        const card = this.cards[word.id];

        // Convert rating to SM-2 quality (0-2 scale)
        const quality = rating === 'gotit' ? 2 : rating === 'almost' ? 1 : 0;

        // Update card with SM-2
        const newCard = SM2.review(card, quality);
        this.cards[word.id] = newCard;

        // Update stats
        this.stats.totalReviews++;
        if (quality >= 2) {
            this.stats.correctReviews++;
        }
        this.state.wordsStudiedToday++;

        // Check if word is "learned" (5+ repetitions, 30+ day interval)
        if (newCard.repetitions >= 5 && newCard.interval >= 30) {
            this.stats.wordsLearned = Object.values(this.cards).filter(
                c => c.repetitions >= 5 && c.interval >= 30
            ).length;
        }

        // Save progress
        this.saveProgress();
        this.updateProgress();
        this.updateStats();

        // Move to next word
        this.nextCard();
    },

    /**
     * Go to next card
     */
    nextCard() {
        const nextWord = this.getNextWord();
        const newIndex = this.words.findIndex(w => w.id === nextWord.id);
        this.state.currentWordIndex = newIndex >= 0 ? newIndex : 0;
        this.renderCard();
    },

    /**
     * Go to previous card
     */
    prevCard() {
        if (this.state.currentWordIndex > 0) {
            this.state.currentWordIndex--;
            this.renderCard();
        }
    },

    /**
     * Update progress bar
     */
    updateProgress() {
        const learned = this.stats.wordsLearned;
        const total = WORDS.length;
        const pct = (learned / total) * 100;

        document.getElementById('progress-count').textContent = `${learned} / ${total}`;
        document.getElementById('progress-fill').style.width = `${pct}%`;
        document.getElementById('goal-count').textContent = `${this.state.wordsStudiedToday} / ${this.state.dailyGoal}`;
    },

    /**
     * Update stats display
     */
    updateStats() {
        const accuracy = this.stats.totalReviews > 0 
            ? Math.round((this.stats.correctReviews / this.stats.totalReviews) * 100) 
            : 0;

        document.getElementById('stat-total').textContent = WORDS.length;
        document.getElementById('stat-learned').textContent = this.stats.wordsLearned;
        document.getElementById('stat-streak').textContent = this.stats.streak;
        document.getElementById('stat-accuracy').textContent = `${accuracy}%`;

        // Queue stats
        const queueStats = SM2.getStats(Object.values(this.cards));
        document.getElementById('queue-due').textContent = queueStats.due;
        document.getElementById('queue-learning').textContent = queueStats.learning;
        document.getElementById('queue-mastered').textContent = queueStats.mastered;

        // By type stats
        const byType = {};
        ['verb', 'noun', 'adjective', 'adverb'].forEach(type => {
            const typeWords = WORD_TYPES[type] || [];
            byType[type] = { total: typeWords.length, learned: 0 };
            typeWords.forEach(w => {
                const card = this.cards[w.id];
                if (card && card.repetitions >= 5 && card.interval >= 30) {
                    byType[type].learned++;
                }
            });
        });

        document.getElementById('stats-by-type').innerHTML = Object.entries(byType).map(([type, data]) => `
            <div class="stat-type-row">
                <span class="stat-type-label">${type}s</span>
                <span class="stat-type-value">${data.learned}/${data.total}</span>
            </div>
        `).join('');
    },

    /**
     * Setup quiz mode
     */
    startQuiz() {
        this.state.quizState = {
            currentQuestion: 0,
            score: 0,
            totalQuestions: 10,
            selectedOption: null,
            answered: false
        };
        this.renderQuizQuestion();
    },

    /**
     * Render quiz question
     */
    renderQuizQuestion() {
        const quizState = this.state.quizState;
        
        if (quizState.currentQuestion >= quizState.totalQuestions) {
            this.endQuiz();
            return;
        }

        // Get random word
        const word = this.words[Math.floor(Math.random() * this.words.length)];
        const card = this.cards[word.id];

        // Update question count
        document.getElementById('quiz-count').textContent = 
            `Question ${quizState.currentQuestion + 1} of ${quizState.totalQuestions}`;
        document.getElementById('quiz-score').textContent = 
            `Score: ${Math.round((quizState.score / quizState.totalQuestions) * 100)}%`;

        // Show Portuguese, ask for English
        document.getElementById('question-word').textContent = word.pt;
        document.getElementById('question-hint').textContent = 'Select the correct translation';

        // Generate options (1 correct + 3 wrong from same type)
        const sameType = WORDS.filter(w => w.type === word.type && w.id !== word.id);
        const wrongOptions = sameType.sort(() => 0.5 - Math.random()).slice(0, 3);
        const options = [word, ...wrongOptions].sort(() => 0.5 - Math.random());

        document.getElementById('quiz-options').innerHTML = options.map(opt => `
            <button class="quiz-option" data-id="${opt.id}">${opt.en}</button>
        `).join('');

        // Setup option click handlers
        document.querySelectorAll('.quiz-option').forEach(btn => {
            btn.addEventListener('click', () => this.handleQuizAnswer(btn, word.id));
        });

        // Reset state
        quizState.selectedOption = null;
        quizState.answered = false;
        document.getElementById('quiz-feedback').className = 'quiz-feedback';
        document.getElementById('quiz-next').style.display = 'none';
    },

    /**
     * Handle quiz answer selection
     */
    handleQuizAnswer(btn, correctId) {
        const quizState = this.state.quizState;
        if (quizState.answered) return;

        quizState.answered = true;
        quizState.selectedOption = btn.dataset.id;

        const isCorrect = btn.dataset.id === correctId.toString();
        const feedback = document.getElementById('quiz-feedback');
        const nextBtn = document.getElementById('quiz-next');

        // Mark options
        document.querySelectorAll('.quiz-option').forEach(opt => {
            if (opt.dataset.id === correctId.toString()) {
                opt.classList.add('correct');
            } else if (opt.dataset.id === btn.dataset.id && !isCorrect) {
                opt.classList.add('incorrect');
            }
        });

        // Update score
        if (isCorrect) {
            quizState.score++;
            feedback.className = 'quiz-feedback show correct';
            feedback.innerHTML = '<div class="feedback-icon">✅</div><div class="feedback-text">Correct!</div>';
        } else {
            feedback.className = 'quiz-feedback show incorrect';
            const correctWord = WORDS.find(w => w.id === parseInt(correctId));
            feedback.innerHTML = `<div class="feedback-icon">❌</div><div class="feedback-text">The correct answer was: ${correctWord.en}</div>`;
        }

        // Update stats
        this.stats.totalReviews++;
        if (isCorrect) {
            this.stats.correctReviews++;
        }
        this.saveProgress();
        document.getElementById('quiz-score').textContent = 
            `Score: ${Math.round((quizState.score / quizState.totalQuestions) * 100)}%`;

        nextBtn.style.display = 'block';
    },

    /**
     * End quiz and show results
     */
    endQuiz() {
        const quizState = this.state.quizState;
        const percentage = Math.round((quizState.score / quizState.totalQuestions) * 100);
        
        document.getElementById('quiz-count').textContent = 'Quiz Complete!';
        document.getElementById('question-word').textContent = `${quizState.score}/${quizState.totalQuestions}`;
        document.getElementById('question-hint').textContent = `${percentage}% accuracy`;
        document.getElementById('quiz-options').innerHTML = '';
        document.getElementById('quiz-feedback').className = 'quiz-feedback';
        document.getElementById('quiz-next').style.display = 'none';

        // Update streak if good performance
        if (percentage >= 70) {
            this.state.wordsStudiedToday += 5; // Bonus for quiz
            this.saveProgress();
            this.updateProgress();
        }
    },

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Card flip
        document.getElementById('flashcard').addEventListener('click', () => this.flipCard());

        // Rating buttons
        document.querySelectorAll('.rating-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.rateCard(btn.dataset.rating);
            });
        });

        // Navigation
        document.getElementById('prev-card').addEventListener('click', (e) => {
            e.stopPropagation();
            this.prevCard();
        });
        document.getElementById('next-card').addEventListener('click', (e) => {
            e.stopPropagation();
            this.nextCard();
        });

        // Speak buttons
        document.getElementById('speak-word').addEventListener('click', (e) => {
            e.stopPropagation();
            const word = this.getCurrentWord();
            Speech.speak(word.pt);
        });
        document.getElementById('speak-example').addEventListener('click', (e) => {
            e.stopPropagation();
            const word = this.getCurrentWord();
            Speech.speak(word.example_pt);
        });

        // Mode tabs
        document.querySelectorAll('.mode-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.mode-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.mode-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                const mode = tab.dataset.mode;
                this.state.currentMode = mode;
                
                if (mode === 'flashcard') {
                    document.getElementById('flashcard-mode').classList.add('active');
                    this.renderCard();
                } else if (mode === 'quiz') {
                    document.getElementById('quiz-mode').classList.add('active');
                    this.startQuiz();
                } else if (mode === 'sounds') {
                    document.getElementById('sounds-mode').classList.add('active');
                    this.renderSoundsList();
                }
            });
        });

        // Filter select
        document.getElementById('filter-select').addEventListener('change', (e) => {
            this.state.currentFilter = e.target.value;
            this.applyFilter();
            this.renderCard();
        });

        // Quiz next button
        document.getElementById('quiz-next').addEventListener('click', () => {
            this.state.quizState.currentQuestion++;
            this.renderQuizQuestion();
        });

        // Stats modal
        document.getElementById('stats-btn').addEventListener('click', () => {
            this.updateStats();
            document.getElementById('stats-modal').classList.remove('hidden');
        });
        document.getElementById('stats-close').addEventListener('click', () => {
            document.getElementById('stats-modal').classList.add('hidden');
        });
        document.querySelector('#stats-modal .modal-overlay').addEventListener('click', () => {
            document.getElementById('stats-modal').classList.add('hidden');
        });

        // Reset modal
        document.getElementById('reset-progress').addEventListener('click', () => {
            document.getElementById('stats-modal').classList.add('hidden');
            document.getElementById('reset-modal').classList.remove('hidden');
        });
        document.getElementById('reset-close').addEventListener('click', () => {
            document.getElementById('reset-modal').classList.add('hidden');
        });
        document.getElementById('reset-cancel').addEventListener('click', () => {
            document.getElementById('reset-modal').classList.add('hidden');
        });
        document.querySelector('#reset-modal .modal-overlay').addEventListener('click', () => {
            document.getElementById('reset-modal').classList.add('hidden');
        });
        document.getElementById('reset-confirm').addEventListener('click', () => {
            this.resetProgress();
        });

        // Dark mode toggle
        document.getElementById('dark-toggle').addEventListener('click', () => {
            const body = document.body;
            const isDark = body.getAttribute('data-theme') === 'dark';
            body.setAttribute('data-theme', isDark ? 'light' : 'dark');
            document.getElementById('dark-toggle').textContent = isDark ? '🌙' : '☀️';
            localStorage.setItem('pt-flashcards-theme', isDark ? 'light' : 'dark');
        });

        // Sounds mode navigation
        document.getElementById('sound-back-btn').addEventListener('click', () => {
            this.renderSoundsList();
        });
        document.getElementById('prev-sound').addEventListener('click', () => {
            this.navigateSound(-1);
        });
        document.getElementById('next-sound').addEventListener('click', () => {
            this.navigateSound(1);
        });
        document.getElementById('speak-sound').addEventListener('click', () => {
            const sound = PRONUNCIATION_CARDS[this.state.soundsState.currentSoundIndex];
            if (sound && sound.examples && sound.examples.length > 0) {
                // Speak the first few example words slowly
                sound.examples.slice(0, 3).forEach((ex, i) => {
                    setTimeout(() => Speech.speak(ex.pt), i * 800);
                });
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;
            
            if (this.state.currentMode === 'flashcard') {
                if (e.code === 'Space') {
                    e.preventDefault();
                    this.flipCard();
                } else if (e.code === 'ArrowRight') {
                    this.nextCard();
                } else if (e.code === 'ArrowLeft') {
                    this.prevCard();
                } else if (e.key === '1') {
                    this.rateCard('missed');
                } else if (e.key === '2') {
                    this.rateCard('almost');
                } else if (e.key === '3') {
                    this.rateCard('gotit');
                }
            }
        });
    },

    /**
     * Reset all progress
     */
    resetProgress() {
        this.cards = {};
        this.stats = {
            totalReviews: 0,
            correctReviews: 0,
            streak: 0,
            lastStudyDate: null,
            wordsLearned: 0
        };
        this.state.wordsStudiedToday = 0;
        this.saveProgress();
        this.updateProgress();
        this.updateStats();
        document.getElementById('reset-modal').classList.add('hidden');
    },

    /**
     * Load theme preference
     */
    loadTheme() {
        const savedTheme = localStorage.getItem('pt-flashcards-theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const theme = savedTheme || (prefersDark ? 'dark' : 'light');
        
        document.body.setAttribute('data-theme', theme);
        document.getElementById('dark-toggle').textContent = theme === 'dark' ? '☀️' : '🌙';
    },

    /**
     * Render sounds list view
     */
    renderSoundsList() {
        this.state.soundsState.showingDetail = false;
        document.getElementById('sound-list-view').classList.remove('hidden');
        document.getElementById('sound-detail-view').classList.add('hidden');

        // Render each category
        ['nasal', 'consonant', 'vowel'].forEach(category => {
            const grid = document.getElementById(`sound-grid-${category}`);
            const sounds = SOUNDS_BY_CATEGORY[category] || [];
            
            grid.innerHTML = sounds.map(sound => `
                <div class="sound-card" data-id="${sound.id}">
                    <div class="sound-card-sound">${sound.sound}</div>
                    <div class="sound-card-title">${sound.title}</div>
                    <div class="sound-difficulty-dots">
                        ${[1,2,3,4,5].map(i => `
                            <div class="difficulty-dot ${i <= sound.difficulty ? 'filled' : ''} ${i <= sound.difficulty && sound.difficulty >= 4 ? 'hard' : ''}"></div>
                        `).join('')}
                    </div>
                </div>
            `).join('');

            // Add click handlers
            grid.querySelectorAll('.sound-card').forEach(card => {
                card.addEventListener('click', () => {
                    const soundId = card.dataset.id;
                    this.showSoundDetail(soundId);
                });
            });
        });
    },

    /**
     * Show sound detail view
     */
    showSoundDetail(soundId) {
        const sound = PRONUNCIATION_CARDS.find(s => s.id === soundId);
        if (!sound) return;

        this.state.soundsState.showingDetail = true;
        this.state.soundsState.currentSoundIndex = PRONUNCIATION_CARDS.findIndex(s => s.id === soundId);

        document.getElementById('sound-list-view').classList.add('hidden');
        document.getElementById('sound-detail-view').classList.remove('hidden');

        // Populate detail view
        document.getElementById('detail-sound').textContent = sound.sound;
        document.getElementById('detail-title').textContent = sound.title;
        
        const diffEl = document.getElementById('detail-difficulty');
        diffEl.innerHTML = `Difficulty: ${'●'.repeat(sound.difficulty)}${'○'.repeat(5 - sound.difficulty)}`;
        
        document.getElementById('detail-sounds-like').textContent = sound.sounds_like;
        document.getElementById('detail-mouth').textContent = sound.mouth;
        document.getElementById('detail-mistake').textContent = sound.common_mistake;
        document.getElementById('detail-tip').textContent = sound.tip;

        // Practice words
        const examplesEl = document.getElementById('detail-examples');
        examplesEl.innerHTML = sound.examples.map(ex => `
            <div class="practice-word-item">
                <div>
                    <div class="practice-word-pt">${ex.pt}</div>
                    <div class="practice-word-en">${ex.en}</div>
                </div>
                <button class="speak-btn practice-word-speak" data-word="${ex.pt}">🔊</button>
            </div>
        `).join('');

        // Add speak handlers for practice words
        examplesEl.querySelectorAll('.practice-word-speak').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                Speech.speak(btn.dataset.word);
            });
        });
    },

    /**
     * Navigate to previous/next sound
     */
    navigateSound(direction) {
        let newIndex = this.state.soundsState.currentSoundIndex + direction;
        if (newIndex < 0) newIndex = PRONUNCIATION_CARDS.length - 1;
        if (newIndex >= PRONUNCIATION_CARDS.length) newIndex = 0;
        
        const sound = PRONUNCIATION_CARDS[newIndex];
        this.showSoundDetail(sound.id);
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Export for debugging
window.App = App;
