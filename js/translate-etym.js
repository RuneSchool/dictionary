let dictionary = {};

// 1. Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('translateButton');
    const input = document.getElementById('latinInput');
    const output = document.getElementById('etymOutput');

    const sheetUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRHeXINoWUcYATIgC3NFSolfN917H3VMN5t7gVti3NkB83VFK02aE1yrD4tpX33DuY0Jr4DBYXB_MPX/pub?gid=1557784562&single=true&output=tsv' + '&cachebuster=' + new Date().getTime();

    // 2. Load the dictionary using PapaParse
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
                    // NOW ENABLE THE BUTTON
                    const btn = document.getElementById('translateButton');
                    btn.disabled = false;
                    btn.innerText = "Translate"; 

                    console.log("Dictionary ready. Loaded " + Object.keys(dictionary).length + " words.");
                }
            });
        })
        .catch(err => console.error("Fetch error:", err));

    // 3. The simple translation logic
    btn.addEventListener('click', () => {
        const text = input.value;
        
        // Split by word boundaries to keep spaces/punctuation
        const translated = text.split(/(\b\w+\b)/g).map(segment => {
            const lower = segment.toLowerCase();
            // Return translated word if it exists, otherwise return original segment
            return dictionary[lower] || segment;
        }).join('');

        output.innerText = translated;
    });
});