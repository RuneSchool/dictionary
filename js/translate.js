// Function to load the dictionary from TSV file
function loadDictionary(file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            const dictionary = {};
            const rows = text.split('\n');
            rows.forEach(row => {
                const columns = row.split('\t');
                const latinWord = columns[0];
                const runicSpelling = columns[1];
                const shavianSpelling = columns[2];
                const partOfSpeech = columns[3];
                const pronunciation = columns[4];
                const frequency = columns[5];
                if (!(latinWord in dictionary)) {
                    dictionary[latinWord] = [{ runic: runicSpelling, shavian: shavianSpelling }];
                } else {
                    dictionary[latinWord].push({ runic: runicSpelling, shavian: shavianSpelling });
                }
            });
            callback(dictionary);
        })
        .catch(error => console.error('Error loading dictionary:', error));
}

// Function to translate Latin text to Runic text
function translateLatinToRunic(text, dictionary) {
    const translatedText = [];
    const words = text.split(' ');
    words.forEach(word => {
        // Check if word is punctuation
        const isPunctuation = /^[.,:;!?]+$/.test(word);
        if (isPunctuation) {
            // Translate punctuation characters as desired
            const punctuationTranslation = {
                '.': '᛫​', // assume that periods are followed by spaces so there will be a ᛫​᛫​
                ',': '᛬​', 
                ';': '⁝​​', 
                ':': '⁝​​', 
                ',': '᛬​', 
                '?': '?',
                '!': '᛬​᛬​', // delete any following spaces like ᛬​᛬᛫​
            };
            const translatedPunctuation = word.split('').map(char => punctuationTranslation[char] || char).join('');
            translatedText.push(translatedPunctuation);
        } else if (word in dictionary) {
            const runicOptions = dictionary[word];
            if (runicOptions.length === 1) {
                if (runicOptions[0].partOfSpeech == "NP0") {
                    translatedText.push("᛭​" + runicOptions[0].runic);
                } else {
                    translatedText.push(runicOptions[0].runic);
                }
            } else {
                const options = runicOptions.map(option => option.runic).join(' or ');
                translatedText.push(`(${options})`);
            }
        } else {
            translatedText.push(word); // If word not found in dictionary, keep it as is
        }
    });
    return translatedText.join('᛫​').replace("᛬​᛬᛫​", "᛬​᛬");
}


// Example usage:
const dictionaryFile = 'data/runelex.tsv';
const latinText = 'the cat sat on the mat';
loadDictionary(dictionaryFile, dictionary => {
    const runicText = translateLatinToRunic(latinText, dictionary);
    console.log(runicText);
});
