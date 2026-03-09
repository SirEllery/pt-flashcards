/**
 * Text-to-Speech for Brazilian Portuguese
 * Uses Web Speech API with explicit pt-BR voice selection
 */

const Speech = {
    synth: null,
    voices: [],
    ptBrVoice: null,
    initialized: false,

    init() {
        if (!('speechSynthesis' in window)) {
            console.warn('Speech synthesis not supported');
            return false;
        }

        this.synth = window.speechSynthesis;

        var self = this;
        var loadVoices = function() {
            self.voices = self.synth.getVoices();
            
            // MUST prefer pt-BR (Brazilian) over pt-PT (European Portuguese)
            // Look for pt-BR first
            self.ptBrVoice = null;
            for (var i = 0; i < self.voices.length; i++) {
                if (self.voices[i].lang === 'pt-BR' || self.voices[i].lang === 'pt_BR') {
                    self.ptBrVoice = self.voices[i];
                    break;
                }
            }
            // Only fall back to generic pt if no pt-BR found
            if (!self.ptBrVoice) {
                for (var i = 0; i < self.voices.length; i++) {
                    if (self.voices[i].lang.indexOf('pt') === 0) {
                        self.ptBrVoice = self.voices[i];
                        break;
                    }
                }
            }

            self.initialized = true;
            console.log('Speech initialized, voice:', self.ptBrVoice ? self.ptBrVoice.name + ' (' + self.ptBrVoice.lang + ')' : 'default');
        };

        loadVoices();

        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }

        return true;
    },

    speak(text, onComplete) {
        if (!text) {
            if (onComplete) onComplete();
            return;
        }

        if (!('speechSynthesis' in window)) {
            if (onComplete) onComplete();
            return;
        }

        if (!this.initialized) {
            this.init();
        }

        try {
            var utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'pt-BR';
            utterance.rate = 0.9;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            if (this.ptBrVoice) {
                utterance.voice = this.ptBrVoice;
            }

            utterance.onend = function() {
                if (onComplete) onComplete();
            };

            utterance.onerror = function() {
                if (onComplete) onComplete();
            };

            this.synth.speak(utterance);
        } catch (e) {
            console.warn('Speech error:', e);
            if (onComplete) onComplete();
        }
    },

    isSupported() {
        return 'speechSynthesis' in window;
    }
};

window.Speech = Speech;
