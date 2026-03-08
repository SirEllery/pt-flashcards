/**
 * Text-to-Speech for Brazilian Portuguese
 * Uses Web Speech API with pt-BR voice
 * 
 * Includes workarounds for known mobile browser bugs:
 * - iOS Safari: cancel() can permanently kill audio session
 * - Chrome Mobile: speech stops after page backgrounding
 * - All mobile: cancel()+speak() in quick succession silently fails
 */

const Speech = {
    synth: null,
    voices: [],
    ptVoice: null,
    initialized: false,
    speaking: false,

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
            console.log('Speech initialized, pt-BR voice:', this.ptVoice?.name || 'default', 
                        'Total voices:', this.voices.length);
        };

        loadVoices();
        
        // Chrome loads voices asynchronously
        if (this.synth.onvoiceschanged !== undefined) {
            this.synth.onvoiceschanged = loadVoices;
        }

        // iOS/Chrome workaround: keep speech synthesis alive
        // Some mobile browsers pause/kill the synth when page is backgrounded
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && this.synth) {
                // Page came back to foreground — re-init voices
                this.voices = this.synth.getVoices();
                if (this.voices.length > 0) {
                    this.ptVoice = this.voices.find(voice => 
                        voice.lang === 'pt-BR' || 
                        voice.lang === 'pt_BR' ||
                        (voice.lang.startsWith('pt') && voice.name.includes('Brazil'))
                    ) || this.voices.find(voice => 
                        voice.lang.startsWith('pt')
                    );
                }
            }
        });

        return true;
    },

    /**
     * Speak a word or phrase in Brazilian Portuguese
     * @param {string} text - Text to speak
     * @param {Function} onComplete - Callback when finished
     */
    speak(text, onComplete) {
        if (!text) {
            if (onComplete) onComplete();
            return;
        }

        if (!this.isSupported()) {
            console.warn('Speech synthesis not supported');
            if (onComplete) onComplete();
            return;
        }

        if (!this.initialized) {
            this.init();
        }

        try {
            // Workaround: On mobile, cancel() can kill the audio session.
            // Instead of cancel + immediate speak, we use a small delay.
            // Also, on iOS Safari, we need to resume() before speaking.
            
            if (this.synth.speaking || this.synth.pending) {
                this.synth.cancel();
            }

            const doSpeak = () => {
                // iOS workaround: resume() in case the synth got paused
                if (this.synth.paused) {
                    this.synth.resume();
                }

                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'pt-BR';
                utterance.rate = 0.85;
                utterance.pitch = 1.0;
                utterance.volume = 1.0;

                if (this.ptVoice) {
                    utterance.voice = this.ptVoice;
                }

                utterance.onend = () => {
                    this.speaking = false;
                    if (onComplete) onComplete();
                };

                utterance.onerror = (e) => {
                    console.warn('Speech error:', e.error);
                    this.speaking = false;
                    
                    // If error is 'interrupted' or 'canceled', try once more
                    if (e.error === 'interrupted' || e.error === 'canceled') {
                        console.log('Retrying speech...');
                        setTimeout(() => {
                            const retry = new SpeechSynthesisUtterance(text);
                            retry.lang = 'pt-BR';
                            retry.rate = 0.85;
                            retry.pitch = 1.0;
                            retry.volume = 1.0;
                            if (this.ptVoice) retry.voice = this.ptVoice;
                            retry.onend = () => { if (onComplete) onComplete(); };
                            retry.onerror = () => { if (onComplete) onComplete(); };
                            this.synth.speak(retry);
                        }, 200);
                    } else {
                        if (onComplete) onComplete();
                    }
                };

                this.speaking = true;
                this.synth.speak(utterance);

                // Chrome bug workaround: speech can get stuck in a paused state
                // after ~15 seconds. We set a watchdog to resume it.
                setTimeout(() => {
                    if (this.synth.paused) {
                        console.log('Speech was paused, resuming...');
                        this.synth.resume();
                    }
                }, 500);
            };

            // Delay after cancel to let the audio session recover
            if (this.synth.speaking || this.speaking) {
                setTimeout(doSpeak, 150);
            } else {
                // Small delay even without cancel — helps on iOS
                setTimeout(doSpeak, 50);
            }

        } catch (e) {
            console.warn('Speech synthesis error:', e);
            this.speaking = false;
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
