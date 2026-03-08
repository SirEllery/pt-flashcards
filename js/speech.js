/**
 * Text-to-Speech for Brazilian Portuguese
 * Uses Google Translate TTS — reliable, accurate pt-BR on all devices
 */

const Speech = {
    audio: null,
    initialized: false,

    init() {
        this.audio = new Audio();
        this.initialized = true;
        console.log('Speech initialized (Google Translate TTS)');
        return true;
    },

    /**
     * Speak a word or phrase in Brazilian Portuguese
     */
    speak(text, onComplete) {
        if (!text) {
            if (onComplete) onComplete();
            return;
        }

        if (!this.initialized) {
            this.init();
        }

        try {
            // Stop any current audio
            if (this.audio) {
                this.audio.pause();
                this.audio.currentTime = 0;
            }

            // Google Translate TTS endpoint
            const encoded = encodeURIComponent(text);
            const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=pt-BR&q=${encoded}`;

            this.audio = new Audio(url);
            this.audio.playbackRate = 0.9;

            this.audio.onended = () => {
                if (onComplete) onComplete();
            };

            this.audio.onerror = (e) => {
                console.warn('TTS audio error, falling back to Web Speech API:', e);
                this.speakFallback(text, onComplete);
            };

            this.audio.play().catch((e) => {
                console.warn('TTS play failed, falling back to Web Speech API:', e);
                this.speakFallback(text, onComplete);
            });

        } catch (e) {
            console.warn('Speech error:', e);
            this.speakFallback(text, onComplete);
        }
    },

    /**
     * Fallback to Web Speech API if Google TTS fails
     */
    speakFallback(text, onComplete) {
        if (!('speechSynthesis' in window)) {
            if (onComplete) onComplete();
            return;
        }

        const synth = window.speechSynthesis;
        synth.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.85;

        // Try to find pt-BR voice
        const voices = synth.getVoices();
        const ptVoice = voices.find(v => v.lang === 'pt-BR' || v.lang === 'pt_BR') 
                     || voices.find(v => v.lang.startsWith('pt'));
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onend = () => { if (onComplete) onComplete(); };
        utterance.onerror = () => { if (onComplete) onComplete(); };

        synth.speak(utterance);
    },

    isSupported() {
        return true; // Audio element is universally supported
    }
};

window.Speech = Speech;
