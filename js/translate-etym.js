let dictionary = {};
let asciiMode = false;

function normalizeText(text) {
    return text.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
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

// Strip HTML tags → convert → restore
function applyAsciiToHTML(html) {
    const temp = document.createElement("div");
    temp.innerHTML = html;

    function walk(node) {
        if (node.nodeType === Node.TEXT_NODE) {
            node.nodeValue = toAsciiOutput(node.nodeValue);
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
    const asciiToggle = document.getElementById('asciiToggle');

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
        const wordRegex = /([a-zA-Z0-9'\u2018\u2019\u201A\u201B\u2032\u2035-]+)/g;
        const segments = text.split(wordRegex);

        let translatedHTML = segments.map(segment => {
            if (!/[a-zA-Z0-9'\u2018\u2019\u201A\u201B\u2032\u2035-]/.test(segment)) return segment;

            const normalizedSegment = normalizeText(segment.toLowerCase());
            const replacement = dictionary[normalizedSegment];

            if (replacement) {
                return matchCasing(segment, replacement);
            } else {
                return `<mark>${segment}</mark>`;
            }
        }).join('');

        if (asciiMode) {
            translatedHTML = applyAsciiToHTML(translatedHTML);
        }

        output.innerHTML = translatedHTML;
    }

    btn.addEventListener('click', translate);

    asciiToggle.addEventListener('click', () => {
        asciiMode = !asciiMode;
        asciiToggle.textContent = asciiMode ? "Go back to normal" : "See ASCII";
        asciiToggle.setAttribute("aria-pressed", String(asciiMode));

        if (!btn.disabled) {
            translate();
        }
    });
});
