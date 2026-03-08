/**
 * Text-to-Speech for Brazilian Portuguese
 * Uses Google Translate TTS for high-quality neural voice
 * Falls back to Web Speech API only if Google TTS fails
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

            // Google Translate TTS — same engine as the Google Translate app
            var encoded = encodeURIComponent(text);
            var url = 'https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=pt-BR&q=' + encoded;

            this.audio = new Audio(url);

            this.audio.onended = function() {
                if (onComplete) onComplete();
            };

            this.audio.onerror = function() {
                console.warn('Google TTS failed, trying Web Speech API');
                Speech._webSpeechFallback(text, onComplete);
            };

            var playPromise = this.audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(function() {
                    console.warn('Google TTS play rejected, trying Web Speech API');
                    Speech._webSpeechFallback(text, onComplete);
                });
            }

        } catch (e) {
            console.warn('Speech error:', e);
            this._webSpeechFallback(text, onComplete);
        }
    },

    /**
     * Fallback only if Google TTS is blocked
     */
    _webSpeechFallback: function(text, onComplete) {
        if (!('speechSynthesis' in window)) {
            if (onComplete) onComplete();
            return;
        }

        var synth = window.speechSynthesis;
        synth.cancel();

        var utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        var voices = synth.getVoices();
        var ptVoice = null;
        for (var i = 0; i < voices.length; i++) {
            if (voices[i].lang === 'pt-BR' || voices[i].lang === 'pt_BR') {
                ptVoice = voices[i];
                break;
            }
        }
        if (!ptVoice) {
            for (var i = 0; i < voices.length; i++) {
                if (voices[i].lang.indexOf('pt') === 0) {
                    ptVoice = voices[i];
                    break;
                }
            }
        }
        if (ptVoice) utterance.voice = ptVoice;

        utterance.onend = function() { if (onComplete) onComplete(); };
        utterance.onerror = function() { if (onComplete) onComplete(); };

        synth.speak(utterance);
    },

    isSupported: function() {
        return true;
    }
};

window.Speech = Speech;
