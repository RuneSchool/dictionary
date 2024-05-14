document.addEventListener('DOMContentLoaded', function () {
    const translateButton = document.getElementById('translateButton');
    translateButton.addEventListener('click', function() {
        console.log('Button clicked'); // Debugging statement
        translate(); // Call the translate function
    });
})

function translate() {
    const latinInput = document.getElementById('latinInput').value;
    const runicOutput = translateLatinToRunic(latinInput, dictionary);
    document.getElementById('runicOutput').innerHTML = runicOutput;
}

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
    text.replaceAll("’", "'");
    const words = text.split(/(?<!')\b(?!')/);
    words.forEach(word => {
        word = word.toLowerCase()
        if (word in dictionary) {
            //console.log(word + " is in dictionary")
            const runicOptions = dictionary[word];
            //console.log(`${[...runicOptions]} are the runic options`)
            if (runicOptions.length === 1) {
                //console.log(`runicOptions are just 1`)
                if (runicOptions[0].partOfSpeech == "NP0") {
                    translatedText.push("᛭​" + runicOptions[0].runic);
                    //console.log(`POS is NP0, so I pushed ᛭${runicOptions[0].runic}`)
                } else {
                    translatedText.push(runicOptions[0].runic);
                    //console.log(`POS is not NP0, so I pushed ${runicOptions[0].runic}`)
                }
            } else {
                //console.log(`runicOptions are longer than 1`)
                runicOptions.forEach(w => {
                    if (w.partOfSpeech == "NP0") {
                        w.runic = "᛭​" + w.runic;
                        //console.log(`POS is NP0, so I changed it to ᛭${w.runic}`)
                    }
                })
                //console.log([...runicOptions])
                const uniqueOptions = new Set(runicOptions.map(option => option.runic));
                //console.log(`the array has been reduced to this set ${uniqueOptions}`)
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
                                                    .replaceAll(".", "᛫​")
                                                    .replaceAll(", ", "᛬​")
                                                    .replaceAll("!?", "?᛬​")
                                                    .replaceAll("?!", "?᛬​")
                                                    .replaceAll("?", "?")
                                                    .replaceAll("; ", "⁝​")
                                                    .replaceAll(": ", "⁝​")
                                                    .replaceAll("—", "⁝")
                                                    .replaceAll("-", "᛫")
                                                    .replaceAll("! ", "᛬᛬​")
                                                    .replaceAll("!", "᛬᛬​")
                                                    .replaceAll(" ", "᛫​")
                                                    .replaceAll("᛫​᛭", "᛭")
                                                    //.replaceAll("​᛫​᛭​", "​᛭​")
    return translatedTextWithPunct
}


const dictionaryFile = 'data/runelex.tsv';

// Load the dictionary and provide a callback function to handle the loaded dictionary
loadDictionary(dictionaryFile, function (loadedDictionary) {
    // Use the loaded dictionary
    dictionary = loadedDictionary;

    // Now the dictionary is loaded and available for translation
    // You can perform any further actions here, such as initializing UI elements or starting translation tasks
    const testLatin = 'the cat sat on the mat. the dog ate the food.\nThen there was a big fight. Fiona said to Tom, "Hello!" I replied "Hi."';
    const testRunic = translateLatinToRunic(testLatin, dictionary);
    console.log(testLatin);
    console.log(testRunic);
});