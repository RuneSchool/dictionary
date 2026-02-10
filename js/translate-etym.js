let dictionary = {};

// 1. Load the dictionary (Simplified Fetch)
fetch('data/etym.tsv')
    .then(res => res.text())
    .then(text => {
        text.split('\n').forEach(line => {
            const cols = line.split('\t');
            if (cols[0]) dictionary[cols[0].toLowerCase()] = cols[1];
        });
        console.log("Dictionary loaded.");
    });

// 2. The Translation Logic
function translate() {
    const input = document.getElementById('latinInput').value;
    
    // Split by spaces, map to dictionary, join back together
    const output = input.split(/\s+/).map(word => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;]/g, '');
        return dictionary[cleanWord] || word; 
    }).join(' ');

    document.getElementById('runicOutput').innerText = output;
}

// 3. Simple Event Listener
document.getElementById('translateButton')?.addEventListener('click', translate);