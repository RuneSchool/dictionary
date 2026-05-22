let dictionary = {};
let displayMode = 'default'; // 'default' | 'ascii' | 'runes' | 'blended'

// Sources treated as native (rune-converted) in blended mode.
const RUNE_SOURCES = new Set(['native', 'norse', 'celtic', 'dutch']);

function isRuneSource(source) {
    if (!source) return false;
    const lower = source.toLowerCase();
    return [...RUNE_SOURCES].some(s => lower.includes(s));
}

// Native affixes (etym spelling). In blended mode these are always runes,
// regardless of whether the root is native. Edit freely.
const NATIVE_PREFIXES = ['ųn', 'ye', 'be', 'ąn’', 'o’', 'on', 'oa', 'for', 'fore', 'mis', 'out', 'ofer', 'ųnder', 'ųp', 'with'];
const NATIVE_SUFFIXES = ['n', 'ish', 'en', 's', 'es', 't', 'th', 'ing', 'doom', 'd',  'ed', 'er', 'est', 'st', 'nes', 'hoad', 'leach', 'leạs', 'loac', 'shįp', 'lei’', 'ful', 'sųm', 'wạrd', 'weis', 'iy', 'ol', 'el', 'ling'];

function normalizeText(text) {
    return text.replace(/[‘’‚‛′‵]/g, "'");
}

function matchCasing(original, translated) {
    if (!translated) return original;

    if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) {
        return translated.toUpperCase();
    }

    if (original[0] === original[0].toUpperCase()) {
        return translated.charAt(0).toUpperCase() + translated.slice(1);
    }

    return translated;
}

// ASCII normalizer
function toAsciiOutput(text) {
    return text
        .replace(/[·’]/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        // --- OPTIONAL ASCII FALLBACKS (easy to disable) ---
        .replace(/æ/g, "a")
        .replace(/Æ/g, "a")
        .replace(/œ/g, "e")
        .replace(/Œ/g, "E")
        // --------------------------------------------------
}

// Runes normalizer
// Order matters: longer / more-specific patterns must run before any shorter
// pattern they contain (e.g. "eạ" before "ạ", "uy" before "y") or the
// longer rule never fires. Diacritics are significant — do NOT NFD here.
function toRunesOutput(text) {
    var regspace = " ";
    var enspace = " ";
    return text
        // /y/ vowel-cluster digraphs — must precede y-as-glide so they
        // stay as ᚣ instead of decomposing.
        .replace(/uy/gi, "ᚣ")
        .replace(/ui/gi, "ᚣ")
        // y as consonantal glide: any other y next to a vowel → gyfu.
        // Lookbehind/lookahead so the adjacent vowel is preserved for the
        // vowel rules below. Must precede vowel digraphs that would
        // otherwise consume the adjacent vowel (e.g. "yea" → "ᚷᚫ").
        // ᚣ is in the class because `uy`/`ui` above can leave a ᚣ behind
        // (e.g. "buiy" → "bᚣy" → must still see ᚣ as a vowel for the y).
        .replace(/(?<=[aąạäæeẹiịįoœuųᚣ])y|y(?=[aąạäæeẹiịįoœuųᚣ])/gi, "ᚷ")
        // S was added later onto heo. So keep H here.
        .replace(/sheo/gi, "ᛋᚻᛇ")
        // Three-character patterns
        .replace(/cch/gi, "ᚳᚳ")
        .replace(/tth/gi, "ᚦᚦ")
        // Two-character patterns — must precede their single-char components
        .replace(/eạ/gi, "ᛠ")
        .replace(/eo/gi, "ᛇ")
        .replace(/ea/gi, "ᚫ")
        .replace(/eị/gi, "ᛡ")
        .replace(/eį/gi, "ᛁᛖ")
        .replace(/ei/gi, "ᛁ")
        .replace(/ee/gi, "ᛖ")
        .replace(/œe/gi, "ᛟ")
        .replace(/oo/gi, "ᚩ")
        .replace(/oa/gi, "ᚪ")
        .replace(/oą/gi, "ᚪ")
        .replace(/ou/gi, "ᚢ")
        .replace(/th/gi, "ᚦ")
        .replace(/ng/gi, "ᛝ")
        .replace(/ph/gi, "ᚠ")
        .replace(/qu/gi, "ᚳᚹ")
        .replace(/ch/gi, "ᚳ")
        .replace(/sh/gi, "ᛋᚳ")
        .replace(/bh/gi, "ᛒ")
        .replace(/dh/gi, "ᛞ")
        .replace(/gh/gi, "ᚷ")
        .replace(/ge\b/gi, "ᚳᚷ")
        // favor ᚳ when we can
        .replace(/c(?=[nwl])/gi, "ᚳ")
        // Single-character patterns — vowels
        .replace(/ạ/gi, "ᛠ")
        .replace(/ą/gi, "ᚪ")
        .replace(/ä/gi, "ᚪ")
        .replace(/æ/gi, "ᚫ")
        .replace(/a/gi, "ᚪ")
        .replace(/ẹ/gi, "ᛇ")
        .replace(/e/gi, "ᛖ")
        .replace(/ị/gi, "ᛡ")
        .replace(/į/gi, "ᛁᛖ")
        .replace(/i/gi, "ᛁ")
        .replace(/œ/gi, "ᛟ")
        .replace(/o/gi, "ᚩ")
        .replace(/u/gi, "ᚢ")
        .replace(/ų/gi, "ᚢ")
        .replace(/y/gi, "ᚣ")
        // Single-character patterns — consonants (Anglo-Saxon Futhorc)
        .replace(/b/gi, "ᛒ")
        .replace(/c/gi, "ᛣ")
        .replace(/d/gi, "ᛞ")
        .replace(/f/gi, "ᚠ")
        .replace(/g/gi, "ᚸ")
        .replace(/h/gi, "ᚻ")
        .replace(/j/gi, "ᚳᚷ")
        .replace(/k/gi, "ᛣ")
        .replace(/l/gi, "ᛚ")
        .replace(/m/gi, "ᛗ")
        .replace(/n/gi, "ᚾ")
        .replace(/p/gi, "ᛈ")
        .replace(/q/gi, "ᛢ")
        .replace(/r/gi, "ᚱ")
        .replace(/s/gi, "ᛋ")
        .replace(/t/gi, "ᛏ")
        .replace(/v/gi, "ᚠ")
        .replace(/w/gi, "ᚹ")
        .replace(/x/gi, "ᛉ")
        .replace(/z/gi, "ᛋ")
        //
        // punctuation
        //
        // .replace(/’/gi, "᛫")
        // .replace(/·/gi, "᛬")
        // .replace(/,/gi, "᛬")
        .replace(/[ ]/gi, enspace)
        // .replace(/\./gi, "᛫")
        // .replace(/;/gi, "⁝")
        // .replace(/\?/gi, "?")
        // .replace(/\!/gi, "᛬᛬")
}



// Strip HTML tags → convert → restore
function applyTransformToHTML(html, transform) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = transform(node.nodeValue);
        } else {
            node.childNodes.forEach(walk);
        }
    }

    walk(temp);
    return temp.innerHTML;
}

// Blended: per-word, runes-translate native affixes (always) and the root (only
// if source === 'native').
function blendedTranslateWord(etymWord, source) {
    if (!etymWord.includes('·')) {
        return isRuneSource(source) ? toRunesOutput(etymWord) : etymWord;
    }

    const segments = etymWord.split('·');
    const lastIdx = segments.length - 1;
    const isNativeRoot = isRuneSource(source);

    const info = segments.map(seg => ({ text: seg, isRunes: isNativeRoot }));

    // Mark trailing native suffixes (consecutive, walking inward from the end).
    for (let i = lastIdx; i > 0; i--) {
        if (NATIVE_SUFFIXES.includes(info[i].text.toLowerCase())) {
            info[i].isRunes = true;
        } else {
            break;
        }
    }

    // Mark leading native prefixes (consecutive, walking outward from the start).
    for (let i = 0; i < lastIdx; i++) {
        if (NATIVE_PREFIXES.includes(info[i].text.toLowerCase())) {
            info[i].isRunes = true;
        } else {
            break;
        }
    }

    let result = '';
    info.forEach((piece, i) => {
        if (i > 0) {
            result += '·';
        }
        if (piece.isRunes) {
            result += toRunesOutput(piece.text);
        } else {
            result += piece.text;
        }
    });
    return result;
}

function applyBlendedTransform(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    temp.querySelectorAll('[data-source]').forEach(span => {
        const source = span.getAttribute('data-source');
        span.textContent = blendedTranslateWord(span.textContent, source);
    });

    // Final pass: regular space → en-space (U+2002) so the line breathes more.
    // Newlines untouched.
    function spaceWalk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = node.nodeValue.replace(/ /g, ' ');
        } else {
            node.childNodes.forEach(spaceWalk);
        }
    }
    spaceWalk(temp);

    return temp.innerHTML;
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('translateButton');
    const input = document.getElementById('latinInput');
    const output = document.getElementById('etymOutput');
    const modeSelector = document.getElementById('displayMode');

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHeXINoWUcYATIgC3NFSolfN917H3VMN5t7gVti3NkB83VFK02aE1yrD4tpX33DuY0Jr4DBYXB_MPX/pub?gid=1557784562&single=true&output=tsv' + '&cachebuster=' + new Date().getTime();

    fetch(sheetUrl)
        .then(res => res.text())
        .then(text => {
            Papa.parse(text, {
                delimiter: '\t',
                header: true,
                skipEmptyLines: true,
                complete: (results) => {
                    results.data.forEach(row => {
                        if (row.latin && row.etym) {
                            const key = normalizeText(row.latin.trim().toLowerCase());
                            dictionary[key] = {
                                etym: row.etym.trim(),
                                source: row.source ? row.source.trim().toLowerCase() : ''
                            };
                        }
                    });
                    btn.disabled = false;
                    btn.innerText = "Translate";
                }
            });
        });

    function translate() {
        const text = input.value;
        const wordRegex = /([a-zA-Z0-9'‘’‚‛′‵-]+)/g;
        const segments = text.split(wordRegex);

        let translatedHTML = segments.map(segment => {
            if (!/[a-zA-Z0-9'‘’‚‛′‵-]/.test(segment)) return segment;

            const normalizedSegment = normalizeText(segment.toLowerCase());
            const entry = dictionary[normalizedSegment];

            if (entry) {
                const cased = matchCasing(segment, entry.etym);
                if (displayMode === 'blended') {
                    return `<span data-source="${entry.source || ''}">${cased}</span>`;
                }
                return cased;
            } else {
                return `<mark>${segment}</mark>`;
            }
        }).join('');

        if (displayMode === 'ascii') {
            translatedHTML = applyTransformToHTML(translatedHTML, toAsciiOutput);
        } else if (displayMode === 'runes') {
            translatedHTML = applyTransformToHTML(translatedHTML, toRunesOutput);
        } else if (displayMode === 'blended') {
            translatedHTML = applyBlendedTransform(translatedHTML);
        }

        output.innerHTML = translatedHTML;
    }

    btn.addEventListener('click', translate);

    modeSelector.addEventListener('click', (e) => {
        const target = e.target.closest('button[data-mode]');
        if (!target) return;

        displayMode = target.dataset.mode;

        modeSelector.querySelectorAll('button[data-mode]').forEach(b => {
            b.setAttribute('aria-pressed', String(b === target));
        });

        if (!btn.disabled) {
            translate();
        }
    });
});
