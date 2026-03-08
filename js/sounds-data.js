/**
 * Portuguese Pronunciation Cards Data
 * 13 sound drills with mouth position, tips, and examples
 */

const PRONUNCIATION_CARDS = [
  {
    id: "nasal-ao",
    sound: "ão",
    title: "The Nasal ÃO",
    difficulty: 5,
    category: "nasal",
    description: "The most iconic Brazilian Portuguese sound. A nasal diphthong that doesn't exist anywhere in English.",
    mouth: "Start with your mouth open and relaxed, jaw dropped like you're saying 'uh' in 'sun'. Your tongue should be flat and low in your mouth. Now, as you make the sound, let air flow through BOTH your mouth and nose simultaneously — this is the nasal part. While sustaining that nasal airflow, round your lips forward and close them slightly, gliding toward an 'oo' shape. Think of it as one smooth motion: open relaxed mouth → rounding forward. Your soft palate (the back of the roof of your mouth) stays LOWERED the whole time, which is what lets air through your nose.",
    tip: "Put your fingers on the bridge of your nose. You should feel vibration the entire time. If you don't feel it, you're not nasalizing. Practice humming first to feel what nasal airflow is like, then try to keep that buzzy nose-feeling while saying 'ow'.",
    common_mistake: "English speakers say a clean 'ow' like in 'cow' with no nasal quality. Others try to add an 'ng' at the end — don't. The nasality should be continuous throughout the whole sound, not tacked on at the end.",
    sounds_like: "Closest English approximation: say 'uh' + 'oom' quickly as one syllable, but push air through your nose the whole time. Or imagine saying 'sung' but replace the 'ng' with lip rounding.",
    examples: [
      {pt: "não", en: "no/not"},
      {pt: "coração", en: "heart"},
      {pt: "irmão", en: "brother"},
      {pt: "pão", en: "bread"},
      {pt: "mão", en: "hand"}
    ]
  },
  {
    id: "nasal-ae",
    sound: "ãe",
    title: "The Nasal ÃE",
    difficulty: 5,
    category: "nasal",
    description: "Another nasal diphthong. Common in one of the first words you'll learn — mãe (mother).",
    mouth: "Start with your mouth open, jaw relaxed and dropped, tongue low — same starting position as ão. Let air flow through your nose AND mouth together (nasal). Now instead of rounding your lips, spread them — pull the corners of your mouth back and raise your tongue toward the front of your mouth, gliding toward an 'ee' shape. It's one smooth motion: open nasal 'ah' → spreading into nasal 'ee'.",
    tip: "Practice saying 'mine' but nasalize the whole vowel. Keep your fingers on your nose to check for vibration. The glide from 'ah' to 'ee' should be smooth and continuous, not two separate sounds.",
    common_mistake: "English speakers say 'my' or 'mine' with zero nasal quality. The nasalization must be present from start to finish — it's not an 'ah' followed by an 'n' followed by 'ee'.",
    sounds_like: "Imagine saying 'mine' while humming through your nose at the same time. Or like 'ang' + 'ee' blended into one nasal syllable.",
    examples: [
      {pt: "mãe", en: "mother"},
      {pt: "cães", en: "dogs"},
      {pt: "pães", en: "breads"},
      {pt: "alemães", en: "Germans"},
      {pt: "capitães", en: "captains"}
    ]
  },
  {
    id: "nasal-oe",
    sound: "õe",
    title: "The Nasal ÕE",
    difficulty: 4,
    category: "nasal",
    description: "The third nasal diphthong. Shows up in many plurals of words ending in ão.",
    mouth: "Start with rounded lips like you're saying 'oh', but with nasal airflow — air coming through both nose and mouth. Your tongue is in the middle of your mouth, slightly back. Now glide forward: unround your lips, spread them, and raise your tongue toward the front, moving toward an 'ee' sound. Keep the nasal airflow going the entire time.",
    tip: "This one is actually the easiest of the three nasal diphthongs because the starting 'oh' position feels more natural to English speakers. Focus on keeping the nasality constant as you glide from 'oh' to 'ee'.",
    common_mistake: "Saying 'oy' like in 'boy' without any nasal quality. The 'oy' mouth movements are actually close — you just need to add the nose vibration throughout.",
    sounds_like: "Like 'oy' in 'boy' but hummed through the nose. Or 'going' — isolate the 'oing' part and nasalize it.",
    examples: [
      {pt: "limões", en: "lemons"},
      {pt: "corações", en: "hearts"},
      {pt: "opções", en: "options"},
      {pt: "aviões", en: "airplanes"},
      {pt: "eleições", en: "elections"}
    ]
  },
  {
    id: "nasal-vowels-general",
    sound: "ã, em, im, om, um",
    title: "Nasal Simple Vowels",
    difficulty: 4,
    category: "nasal",
    description: "Any vowel before M at the end of a word, or before M/N followed by another consonant, becomes nasalized. The M or N isn't really pronounced — it just nasalizes the vowel before it.",
    mouth: "For each nasal vowel, form the mouth shape of the regular vowel (ah, eh, ee, oh, oo) but lower your soft palate to let air flow through your nose simultaneously. The key physical sensation: your mouth is doing the vowel shape, your nose is buzzing. The M or N that follows in spelling is NOT a separate consonant — don't close your lips for M or touch your tongue to the roof for N. They're just signals to nasalize.",
    tip: "Practice pairs: 'la' (non-nasal) vs 'lã' (nasal). The mouth position is identical — the only difference is whether air comes through your nose. Hum an 'mmm' first to activate nasal airflow, then open into the vowel while keeping the nasal channel open.",
    common_mistake: "English speakers pronounce the M or N as a full consonant: 'bom' becomes 'bomm' with lips closing. In Brazilian Portuguese, 'bom' ends with an open nasalized 'oh' — your lips never fully close. Think of the M as invisible.",
    sounds_like: "The 'un' in 'sung' is the closest English gets to a nasalized vowel — but even there, English speakers fully pronounce the 'ng'. In Portuguese, you want that vowel quality WITHOUT the tongue hitting the roof of your mouth at the end.",
    examples: [
      {pt: "bom", en: "good"},
      {pt: "sim", en: "yes"},
      {pt: "tem", en: "has"},
      {pt: "um", en: "one/a"},
      {pt: "campo", en: "field"}
    ]
  },
  {
    id: "r-initial-rr",
    sound: "R (initial) / RR",
    title: "The H-like R",
    difficulty: 3,
    category: "consonant",
    description: "When R starts a word, or when you see RR in the middle of a word, it sounds like the English H. This is the opposite of what English speakers expect.",
    mouth: "Open your mouth slightly. Your tongue stays relaxed and LOW — do NOT lift it like you would for an English R. The sound comes from a slight constriction in your throat, right at the back — similar to a gentle exhale. Think of fogging up a mirror, or the 'h' in 'hot'. Some speakers use a slightly more guttural version (like clearing your throat gently), but the simple H sound is perfectly acceptable and understood everywhere in Brazil.",
    tip: "The biggest mental hurdle: STOP moving your tongue. English R requires curling or bunching your tongue. Brazilian initial R/RR requires your tongue to do NOTHING. It's literally easier to pronounce than English R — you just have to unlearn the instinct to move your tongue.",
    common_mistake: "Using the English R sound (tongue curled). 'Rio' should sound like 'HEE-oo', not 'REE-oh'. If your tongue is doing anything, you're doing it wrong.",
    sounds_like: "The H in 'happy', 'hot', 'house'. That's it. Rio = Hee-oo. Carro = Ka-hoo. Cachorro = Ka-sho-hoo.",
    examples: [
      {pt: "rio", en: "river"},
      {pt: "roupa", en: "clothes"},
      {pt: "carro", en: "car"},
      {pt: "cachorro", en: "dog"},
      {pt: "rua", en: "street"}
    ]
  },
  {
    id: "r-tap",
    sound: "R (between vowels)",
    title: "The Tapped R",
    difficulty: 3,
    category: "consonant",
    description: "When a single R appears between two vowels, it's a quick, light tap of the tongue — completely different from both the English R and the H-like R above.",
    mouth: "Touch the TIP of your tongue very briefly to the ridge right behind your upper front teeth (the alveolar ridge). It's a single, quick tap — your tongue bounces off immediately. It should take a fraction of a second. Your lips stay relaxed and open. This is identical to the sound Americans make for the D and T in words like 'butter', 'water', 'ladder', 'better'. That quick flap? That's exactly the Brazilian Portuguese R between vowels.",
    tip: "Say 'butter' in a normal American accent. That sound in the middle — not a clean D, not a clean T, but that quick flap — THAT is the Portuguese intervocalic R. You already make this sound dozens of times a day in English. Just use it where you see R between vowels in Portuguese.",
    common_mistake: "Using the English R (tongue curled) or the H-sound (wrong position for this R). Between vowels, it's always the quick tap. 'Caro' = 'KA-ɾoo' (with that butter-flap), NOT 'KA-roo' and NOT 'KA-hoo'.",
    sounds_like: "The middle sound in American English 'butter', 'water', 'better', 'ladder'. Quick tongue tap. Portuguese 'caro' rhymes exactly with how you'd say 'motto' with that flapped T.",
    examples: [
      {pt: "caro", en: "expensive"},
      {pt: "para", en: "for/to"},
      {pt: "hora", en: "hour"},
      {pt: "claro", en: "clear/of course"},
      {pt: "quero", en: "I want"}
    ]
  },
  {
    id: "d-palatalization",
    sound: "D before I/E",
    title: "The DJee Sound",
    difficulty: 2,
    category: "consonant",
    description: "In Brazilian Portuguese, D before an 'ee' sound (spelled I, or unstressed E at end of words) becomes 'dj' — like the J in 'judge'.",
    mouth: "Start with your tongue in the D position — tip pressed against the ridge behind your upper teeth. But instead of releasing it cleanly into a 'D', let it release with friction, like you're saying 'J' in 'judge' or 'gym'. Your tongue peels away from the ridge more slowly, creating that 'dzh' friction. The sides of your tongue should be touching your upper molars, channeling the air through the center.",
    tip: "Say 'jeans' in English. That initial J sound is exactly what D becomes before I in Portuguese. 'Dia' = 'DJEE-ah'. Once you internalize this rule, it becomes automatic — any time you see DI or DE (at end of words), think J.",
    common_mistake: "Pronouncing a hard, clean English D. 'Dia' is NOT 'DEE-ah' — it's 'DJEE-ah'. This is one of the biggest tells of a foreign accent. Your wife does this in reverse — she says 'Bra-djee' for 'Brad' because this rule is so deeply wired in her brain.",
    sounds_like: "The J in 'judge', 'jeans', 'gym'. Dia = Jee-ah. Cidade = see-DA-djee. Diferente = djee-feh-REN-chee.",
    examples: [
      {pt: "dia", en: "day"},
      {pt: "cidade", en: "city"},
      {pt: "diferente", en: "different"},
      {pt: "onde", en: "where"},
      {pt: "grande", en: "big"}
    ]
  },
  {
    id: "t-palatalization",
    sound: "T before I/E",
    title: "The CHee Sound",
    difficulty: 2,
    category: "consonant",
    description: "Same rule as D, but for T. Before an 'ee' sound, T becomes 'ch' — like the CH in 'cheese'.",
    mouth: "Tongue tip starts at the ridge behind your upper teeth, same as for English T. But release it with friction — let the air hiss through as your tongue peels away. It's the exact same mouth position as saying 'cheese' or 'church'. Lips slightly spread. This is the voiceless partner of the DJ sound above.",
    tip: "Say 'cheese'. That CH sound is what T becomes before I and unstressed final E. 'Noite' = 'NOY-chee'. Every word ending in '-te' in Brazilian Portuguese ends in 'chee'. It's incredibly consistent.",
    common_mistake: "Saying a hard English T. 'Noite' is NOT 'NOY-teh' — it's 'NOY-chee'. 'Gente' is NOT 'JEN-teh' — it's 'JEN-chee'. Missing this makes you sound textbook European Portuguese, not Brazilian.",
    sounds_like: "CH in 'cheese', 'church', 'watch'. Noite = noy-CHEE. Gente = JEN-chee. Interessante = een-teh-reh-SAHN-chee.",
    examples: [
      {pt: "noite", en: "night"},
      {pt: "gente", en: "people"},
      {pt: "leite", en: "milk"},
      {pt: "interessante", en: "interesting"},
      {pt: "quente", en: "hot"}
    ]
  },
  {
    id: "l-final",
    sound: "L (end of syllable)",
    title: "The W-Sound L",
    difficulty: 2,
    category: "consonant",
    description: "When L appears at the end of a syllable or word in Brazilian Portuguese, it becomes a W sound. Your tongue should NOT touch anything.",
    mouth: "Round your lips slightly and push them forward, just like you're starting to say 'w' in 'wow'. Your tongue stays LOW and BACK — do NOT lift the tip to the ridge behind your teeth like you would for English L. The back of your tongue rises slightly toward the soft palate. It's pure lip rounding with a dark, back-of-mouth quality.",
    tip: "Say 'cow'. That 'ow' ending is the sound you want. 'Brasil' = 'bra-ZEW'. 'Futebol' = 'foo-chee-BOW'. Every time you see L at the end of a word, just say W.",
    common_mistake: "Making a clear English L with tongue tip touching the ridge behind your teeth. 'Brasil' is NOT 'bra-ZEEL' — it's 'bra-ZEW'. If your tongue tip is touching anything, you're doing it wrong. This is the mirror of your wife's struggle — she says W where English needs L (like 'little' → 'lit-too').",
    sounds_like: "W in 'wow', or the 'ow' in 'cow'. Brasil = bra-ZEW. Legal = leh-GOW. Papel = pa-PEW. Futebol = foo-chee-BOW.",
    examples: [
      {pt: "Brasil", en: "Brazil"},
      {pt: "legal", en: "cool"},
      {pt: "futebol", en: "soccer"},
      {pt: "papel", en: "paper"},
      {pt: "hospital", en: "hospital"}
    ]
  },
  {
    id: "nh-sound",
    sound: "NH",
    title: "The NY Sound",
    difficulty: 2,
    category: "consonant",
    description: "NH in Portuguese makes a 'ny' sound — like the Ñ in Spanish or the middle sound in 'onion'.",
    mouth: "Press the FLAT middle part of your tongue (not the tip) firmly against the hard palate — the roof of your mouth, further back than where you'd put your tongue for N. The tip of your tongue should be down, resting behind your lower front teeth. Air is briefly blocked, then released through your mouth as your tongue drops away. Your lips should be relaxed or slightly spread.",
    tip: "Say 'onion' slowly. Isolate that middle 'ny' sound — that's exactly it. Or say 'canyon'. The NY in canyon = NH in Portuguese. Practice: 'veen-yo' (vinho), 'ah-mah-NYAH' (amanhã).",
    common_mistake: "Saying a plain N followed by a separate H sound. NH is ONE sound, not two. Also, don't say 'nee' — it's 'ny' as one unit. 'Vinho' is NOT 'vin-ho' — it's 'VEEN-yo'.",
    sounds_like: "The NY in 'canyon', 'onion', 'lasagna'. One blended sound, not N + Y as separate pieces.",
    examples: [
      {pt: "vinho", en: "wine"},
      {pt: "amanhã", en: "tomorrow"},
      {pt: "banho", en: "bath/shower"},
      {pt: "cozinha", en: "kitchen"},
      {pt: "sonho", en: "dream"}
    ]
  },
  {
    id: "lh-sound",
    sound: "LH",
    title: "The LY Sound",
    difficulty: 3,
    category: "consonant",
    description: "LH makes a 'ly' sound — like the LLI in 'million'. It's a palatal lateral sound that doesn't exist as a single unit in English.",
    mouth: "This is similar to NH but with a lateral quality — air escapes over the SIDES of your tongue instead of through the center. Press the flat middle of your tongue against the hard palate (roof of mouth), tip down behind lower teeth — same as NH. But now, instead of blocking airflow completely, let air flow around the sides of your tongue, past your molars. It's like saying L and Y at the exact same time.",
    tip: "Say 'million' very slowly. That 'lli' in the middle — freeze on that sound. That's LH. Or try saying 'yell' but start with your tongue in the L position. With practice, it becomes one fluid sound.",
    common_mistake: "Saying L + Y as two separate sounds, or just saying a plain L. 'Filho' is NOT 'feel-yo' with a gap — it's 'FEE-lyoo' as one smooth motion. The tongue never leaves the palate between the L and Y quality.",
    sounds_like: "The LLI in 'million', 'billion', 'brilliant'. Or the GL in Italian 'famiglia'. One blended sound.",
    examples: [
      {pt: "filho", en: "son"},
      {pt: "trabalho", en: "work"},
      {pt: "olho", en: "eye"},
      {pt: "coelho", en: "rabbit"},
      {pt: "espelho", en: "mirror"}
    ]
  },
  {
    id: "open-closed-vowels",
    sound: "é/ê, ó/ô",
    title: "Open vs Closed Vowels",
    difficulty: 3,
    category: "vowel",
    description: "Portuguese distinguishes between open and closed versions of E and O. This can change word meaning. English only has one version of each.",
    mouth: "OPEN É (like 'bet'): Drop your jaw noticeably. Your mouth is more open, tongue lower and further forward. Think of the vowel in 'bed' or 'said'. CLOSED Ê (like 'bay' without the glide): Jaw higher, mouth more closed. Tongue higher and more tense. Like you're starting to smile slightly. Think of the 'ay' in 'bay' but STOP before your mouth glides to 'ee'. OPEN Ó (like 'dog'): Jaw drops, lips round but wide open. Think of the 'o' in British 'hot' or American 'dog'. CLOSED Ô (like 'boat' without the glide): Lips round tighter, jaw higher, less open. Like the 'o' in 'bone' but DON'T let it glide to 'oo'.",
    tip: "The key physical difference is jaw height. Open = jaw dropped lower, more space in your mouth. Closed = jaw higher, tighter. Practice pairs: 'avó' (grandmother, open O, jaw drops) vs 'avô' (grandfather, closed O, jaw stays higher).",
    common_mistake: "English speakers use the same vowel for both and add glides — saying 'ay-ee' instead of a pure 'e', or 'oh-oo' instead of a pure 'o'. Portuguese vowels are PURE — they don't glide. Hold one steady position.",
    sounds_like: "É = 'bet', 'said'. Ê = the start of 'bay' (freeze before gliding). Ó = 'dog', 'hot'. Ô = the start of 'boat' (freeze before gliding).",
    examples: [
      {pt: "avó", en: "grandmother (open ó)"},
      {pt: "avô", en: "grandfather (closed ô)"},
      {pt: "café", en: "coffee (open é)"},
      {pt: "você", en: "you (closed ê)"},
      {pt: "só", en: "only (open ó)"}
    ]
  },
  {
    id: "s-between-vowels",
    sound: "S between vowels",
    title: "S Becomes Z",
    difficulty: 1,
    category: "consonant",
    description: "When S appears between two vowels, it's always pronounced as Z. This is a simple rule but English speakers miss it constantly.",
    mouth: "Same mouth position as English Z: tongue tip near (but not touching) the ridge behind your upper teeth, air flowing through the narrow gap creating buzzing friction. Your vocal cords vibrate — put your hand on your throat to feel the buzz. This is different from S, where the vocal cords are silent.",
    tip: "Just remember: S between vowels = Z. Always. No exceptions. 'Casa' = 'KA-za', not 'KA-sa'. Read any Portuguese word — if you see S with a vowel on both sides, say Z.",
    common_mistake: "Pronouncing S as S even between vowels. This makes you sound like you're reading Spanish, not Portuguese. It's one of the quickest accent fixes — just flip the mental switch.",
    sounds_like: "English Z in 'zoo', 'buzz', 'lazy'. Casa = KA-za. Brasil = bra-ZEW. Coisa = COY-za.",
    examples: [
      {pt: "casa", en: "house"},
      {pt: "coisa", en: "thing"},
      {pt: "mesa", en: "table"},
      {pt: "Brasil", en: "Brazil"},
      {pt: "rosa", en: "rose/pink"}
    ]
  }
];

// Group by category
const SOUNDS_BY_CATEGORY = {
  nasal: PRONUNCIATION_CARDS.filter(c => c.category === 'nasal'),
  consonant: PRONUNCIATION_CARDS.filter(c => c.category === 'consonant'),
  vowel: PRONUNCIATION_CARDS.filter(c => c.category === 'vowel')
};

const CATEGORY_LABELS = {
  nasal: 'Nasal Sounds',
  consonant: 'Consonants',
  vowel: 'Vowels'
};

// Export for use in app
window.PRONUNCIATION_CARDS = PRONUNCIATION_CARDS;
window.SOUNDS_BY_CATEGORY = SOUNDS_BY_CATEGORY;
window.CATEGORY_LABELS = CATEGORY_LABELS;
