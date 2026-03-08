# Portuguese Flashcards

A minimal, modern flashcard app for learning Brazilian Portuguese vocabulary.

## Features

- **460 Words** — 60 function words + 400 content words (verbs, nouns, adjectives, adverbs)
- **Spaced Repetition (SM-2)** — Intelligent scheduling based on SuperMemo-2 algorithm
- **Pronunciation** — Text-to-speech with Brazilian Portuguese voice
- **Quiz Mode** — Multiple choice testing with instant feedback
- **Progress Tracking** — Words learned, daily goals, accuracy stats, streak counter
- **Filtering** — Study by word type (verbs, nouns, etc.) or all words
- **Dark Mode** — Automatic based on system preference or manual toggle
- **Offline First** — All data stored locally, works without internet
- **Mobile Friendly** — Responsive design optimized for phone use

## Quick Start

### Local Development

```bash
# Open in browser
open index.html

# Or use a local server
npx serve .
```

### Deploy to GitHub Pages

```bash
# Commit and push
git add .
git commit -m "Initial commit"
git remote add origin git@github.com:SirEllery/pt-flashcards.git
git push -u origin main

# Enable GitHub Pages in repo settings → Pages → Source: main branch
```

## Usage

### Flashcard Mode

1. **View** — See Portuguese word on front
2. **Think** — Recall the English meaning
3. **Tap** — Flip card to reveal answer
4. **Listen** — Tap 🔊 to hear pronunciation
5. **Rate** — Select your recall level:
   - ❌ **Missed** — Reset interval, review soon
   - 🔶 **Almost** — Keep current interval
   - ✅ **Got it** — Extend interval (1d → 3d → 7d → 14d → 30d)

### Quiz Mode

- 10 random questions per session
- Multiple choice (4 options)
- Same word type for distractors
- Track accuracy percentage

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| Space | Flip card |
| ← | Previous card |
| → | Next card |
| 1 | Rate: Missed |
| 2 | Rate: Almost |
| 3 | Rate: Got it |

## Data Structure

### Word Format

```json
{
  "pt": "fazer",
  "en": "to do/make",
  "type": "verb",
  "example_pt": "Eu vou fazer amanhã.",
  "example_en": "I will do it tomorrow.",
  "rank": 1
}
```

### Spaced Repetition Data

Stored in `localStorage`:

```json
{
  "wordId": 0,
  "ease": 2.5,
  "interval": 7,
  "repetitions": 3,
  "dueDate": 1709856000000,
  "lastReviewed": 1709251200000,
  "correctCount": 3,
  "incorrectCount": 0
}
```

## SM-2 Algorithm

Simplified SuperMemo-2 implementation:

- **Quality 0 (Missed)**: Reset repetitions, interval = 1 day
- **Quality 1 (Almost)**: Keep interval, no ease change
- **Quality 2 (Got it)**: 
  - Rep 1: interval = 1 day
  - Rep 2: interval = 3 days
  - Rep 3+: interval = previous × ease factor

Ease factor adjusts based on performance (1.3–2.5 range).

## File Structure

```
pt-flashcards/
├── index.html          # Main HTML (single page app)
├── css/
│   └── style.css       # All styles (dark mode support)
├── js/
│   ├── data.js         # 460 words embedded
│   ├── sm2.js          # Spaced repetition algorithm
│   ├── speech.js       # Text-to-speech wrapper
│   └── app.js          # Main application logic
└── README.md
```

## Design Principles

- **Minimal** — No clutter, no gamification cheese
- **Modern** — Clean whites, subtle grays, one accent color (#1a73e8)
- **Mobile-first** — Big tap targets, responsive layout
- **Offline** — No backend, no login, localStorage only
- **Fast** — No frameworks, pure vanilla JS

## Browser Support

- Chrome/Edge (recommended for pt-BR voice)
- Firefox
- Safari (iOS/macOS)
- Works offline after first load

## Data Files

Source vocabulary:
- `function-words.json` — 60 high-frequency function words
- `content-words.json` — 400 ranked content words

## License

MIT — Use freely for personal learning.

---

**Built for Kyle** — Learning Portuguese, one word at a time. 🇧🇷
