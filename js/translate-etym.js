let dictionary = {};

function normalizeText(text) {
    return text.replace(/[\u2018\u2019\u201A\u201B\u2032\u2035]/g, "'");
}

function matchCasing(original, translated) {
    if (!translated) return original;

    // Check if original is ALL CAPS AND longer than 1 character
    // This prevents single-letter "I" from forcing "IH"
    if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) {
        return translated.toUpperCase();
    }
    
    // Check if original starts with a Capital (covers "I", "Latin", etc.)
    if (original[0] === original[0].toUpperCase()) {
        // If the translated word from the sheet is "ih", this makes it "Ih"
        return translated.charAt(0).toUpperCase() + translated.slice(1);
    }
    
    // Return exactly what is in the spreadsheet for lowercase/standard matches
    return translated;
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('translateButton');
    const input = document.getElementById('latinInput');
    const output = document.getElementById('etymOutput');

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

    btn.addEventListener('click', () => {
        const text = input.value;
        const wordRegex = /([a-zA-Z0-9'\u2018\u2019\u201A\u201B\u2032\u2035-]+)/g;
        const segments = text.split(wordRegex);
        
        const translatedHTML = segments.map(segment => {
            if (!/[a-zA-Z0-9'\u2018\u2019\u201A\u201B\u2032\u2035-]/.test(segment)) return segment;

            const normalizedSegment = normalizeText(segment.toLowerCase());
            const replacement = dictionary[normalizedSegment];
            
            if (replacement) {
                return matchCasing(segment, replacement);
            } else {
                return `<mark>${segment}</mark>`;
            }
        }).join('');

        output.innerHTML = translatedHTML;
    });
});
