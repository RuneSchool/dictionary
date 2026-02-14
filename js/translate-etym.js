let dictionary = {};

function matchCasing(original, translated) {
    if (!translated) return original;
    
    // Check if original is ALL CAPS (and longer than 1 character)
    if (original.length > 1 && original === original.toUpperCase() && original !== original.toLowerCase()) {
        return translated.toUpperCase();
    }
    
    // Check if original is Capitalized (Title Case)
    if (original[0] === original[0].toUpperCase()) {
        return translated.charAt(0).toUpperCase() + translated.slice(1).toLowerCase();
    }
    
    // Default to lowercase
    return translated.toLowerCase();
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('translateButton');
    const input = document.getElementById('latinInput');
    const output = document.getElementById('etymOutput');

    // BACK TO ORIGINAL TSV URL
    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHeXINoWUcYATIgC3NFSolfN917H3VMN5t7gVti3NkB83VFK02aE1yrD4tpX33DuY0Jr4DBYXB_MPX/pub?gid=1557784562&single=true&output=tsv' + '&cachebuster=' + new Date().getTime();

    fetch(sheetUrl)
        .then(res => {
            if (!res.ok) throw new Error('Network response was not ok');
            return res.text();
        })
        .then(text => {
            Papa.parse(text, {
                delimiter: '\t', 
                header: true,    
                skipEmptyLines: true,
                complete: (results) => {
                    results.data.forEach(row => {
                        if (row.latin && row.etym) {
                            dictionary[row.latin.trim().toLowerCase()] = row.etym.trim();
                        }
                    });
                    
                    btn.disabled = false;
                    btn.innerText = "Translate"; 
                    console.log("Dictionary ready. Loaded " + Object.keys(dictionary).length + " words.");
                }
            });
        })
        .catch(err => console.error("Fetch error:", err));

    btn.addEventListener('click', () => {
        const text = input.value;
        const wordRegex = /([a-zA-Z0-9'-]+)/g;
        const segments = text.split(wordRegex);
        
        const translatedHTML = segments.map(segment => {
            if (!/[a-zA-Z0-9'-]/.test(segment)) return segment;

            const lower = segment.toLowerCase();
            const replacement = dictionary[lower];
            
            if (replacement) {
                return matchCasing(segment, replacement);
            } else {
                return `<mark>${segment}</mark>`;
            }
        }).join('');

        output.innerHTML = translatedHTML;
    });
});
