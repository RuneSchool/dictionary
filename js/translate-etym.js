let dictionary = {};
let displayMode = 'default'; // 'default' | 'ascii' | 'runes'

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
        .replace(/j/gi, "ᚷᚳ")
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
        .replace(/’/gi, "")
        .replace(/·/gi, "")
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
                            dictionary[key] = row.etym.trim();
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
            const replacement = dictionary[normalizedSegment];

            if (replacement) {
                return matchCasing(segment, replacement);
            } else {
                return `<mark>${segment}</mark>`;
            }
        }).join('');

        if (displayMode === 'ascii') {
            translatedHTML = applyTransformToHTML(translatedHTML, toAsciiOutput);
        } else if (displayMode === 'runes') {
            translatedHTML = applyTransformToHTML(translatedHTML, toRunesOutput);
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
