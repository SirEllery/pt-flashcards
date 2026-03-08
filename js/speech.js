/**
 * Text-to-Speech for Brazilian Portuguese
 * Uses Web Speech API with pt-BR voice
 */

const Speech = {
    synth: null,
    voices: [],
    ptVoice: null,
    initialized: false,

    /**
     * Initialize speech synthesis and load voices
     */
    init() {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            return false;
        }

        this.synth = window.speechSynthesis;
        
        // Load voices
        const loadVoices = () => {
            this.voices = this.synth.getVoices();
            
            // Find Brazilian Portuguese voice
            this.ptVoice = this.voices.find(voice => 
                voice.lang === 'pt-BR' || 
                voice.lang === 'pt_BR' ||
                (voice.lang.startsWith('pt') && voice.name.includes('Brazil'))
            ) || this.voices.find(voice => 
                voice.lang.startsWith('pt')
            );

            this.initialized = true;
            console.log('Speech initialized, pt-BR voice:', this.ptVoice?.name || 'default');
        };

        loadVoices();
        
        // Chrome loads voices asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }

        return true;
    },

    /**
     * Speak a word or phrase in Brazilian Portuguese
     * @param {string} text - Text to speak
     * @param {Function} onComplete - Callback when finished
     */
    speak(text, onComplete) {
        if (!this.isSupported()) {
            console.warn('Speech synthesis not supported');
            if (onComplete) onComplete();
            return;
        }

        if (!this.initialized) {
            this.init();
        }

        // Cancel any ongoing speech
        this.synth.cancel();

        try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9; // Slightly slower for clarity
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            if (this.ptVoice) {
                utterance.voice = this.ptVoice;
            }

            if (onComplete) {
                utterance.onend = onComplete;
            }

            this.synth.speak(utterance);
        } catch (e) {
            console.warn('Speech synthesis error:', e);
            if (onComplete) onComplete();
        }
    },

    /**
     * Check if speech is supported
     */
    isSupported() {
        return 'speechSynthesis' in window;
    }
};

// Export for use in app
window.Speech = Speech;
