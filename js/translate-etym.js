let dictionary = {};

// 1. Wait for the page to load
document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('translateButton');
    const input = document.getElementById('latinInput');
    const output = document.getElementById('runicOutput');

    // 2. Load the dictionary using PapaParse
    fetch('data/etym.tsv')
        .then(res => res.text())
        .then(text => {
            Papa.parse(text, {
                delimiter: '\t',
                skipEmptyLines: true,
                complete: (results) => {
                    // Turn the array into a simple { "latin": "runic" } map
                    results.data.forEach(row => {
                        if (row[0] && row[1]) {
                            dictionary[row[0].toLowerCase()] = row[1];
                        }
                    });
                    console.log("Dictionary ready.");
                }
            });
        });

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