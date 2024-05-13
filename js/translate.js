// Function to load the dictionary from TSV file using Papa.parse
function loadDictionary(file, callback) {
    fetch(file)
        .then(response => response.text())
        .then(text => {
            const parsedData = Papa.parse(text, {
                delimiter: '\t',
                header: false,
                skipEmptyLines: true,
            });
            const dictionary = {};
            parsedData.data.forEach(columns => {
                const latinWord = columns[0];
                const runicSpelling = columns[1];
                const shavianSpelling = columns[2];
                const partOfSpeech = columns[3];
                const pronunciation = columns[4];
                const frequency = columns[5];
                if (!(latinWord in dictionary)) {
                    dictionary[latinWord] = [{ runic: runicSpelling, shavian: shavianSpelling, partOfSpeech: partOfSpeech }];
                } else {
                    // Check if dictionary[latinWord] is an array, if not, initialize it as an array
                    if (!Array.isArray(dictionary[latinWord])) {
                        dictionary[latinWord] = [dictionary[latinWord]];
                    }
                    dictionary[latinWord].push({ runic: runicSpelling, shavian: shavianSpelling, partOfSpeech: partOfSpeech });
                }
            });
            callback(dictionary);
        })
        .catch(error => console.error('Error loading dictionary:', error));
}


// Function to translate Latin text to Runic text
function translateLatinToRunic(text, dictionary) {
    const translatedText = [];
    const words = text.split(/\b/);
    words.forEach(word => {
        word = word.toLowerCase()
        // Check if word is punctuation
        /*const isPunctuation = /^[.,:;!?"']+$/.test(word);
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
        } else*/ if (word in dictionary) {
            const runicOptions = dictionary[word];
            if (runicOptions.length === 1) {
                if (runicOptions[0].partOfSpeech == "NP0") {
                    translatedText.push("᛭​" + runicOptions[0].runic);
                } else {
                    translatedText.push(runicOptions[0].runic);
                }
            } else {
                const uniqueOptions = new Set(runicOptions.map(option => option.runic));
                if (uniqueOptions.size === 1) {
                    translatedText.push([...uniqueOptions][0]); // Push the single option directly without parentheses
                } else if (uniqueOptions.has('ᛖ‍ᛡ')) {
                    translatedText.push("ᛟ");
                } else {
                    const options = [...uniqueOptions].join('|');
                    translatedText.push(`(${options})`);
                }
            }
        } else {
            translatedText.push(word); // If word not found in dictionary, keep it as is
        }
    });
    const translatedTextWithPunct = translatedText.join("")
                                                    .replaceAll("...", "᛫᛫᛫​")
                                                    .replaceAll(". ", "᛫᛫​")
                                                    .replaceAll(".", "᛫᛫​")
                                                    .replaceAll(", ", "᛬​")
                                                    .replaceAll("!?", "?᛬​")
                                                    .replaceAll("?!", "?᛬​")
                                                    .replaceAll("? ", "?᛫​")
                                                    .replaceAll("; ", "⁝​")
                                                    .replaceAll(": ", "⁝​")
                                                    .replaceAll("! ", "᛬᛬​")
                                                    .replaceAll(" ", "᛫​")
    return translatedTextWithPunct
}


// Example usage:
const dictionaryFile = 'data/runelex.tsv';
const latinText = 'the cat sat on the mat. the dog ate the food.\nThen there was a big fight. Fiona said, "Hello!" I replied "Hi."';
loadDictionary(dictionaryFile, dictionary => {
    const runicText = translateLatinToRunic(latinText, dictionary);
    console.log(latinText);
    console.log(runicText);
});
