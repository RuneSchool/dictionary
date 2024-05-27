import pandas as pd
import re
import argparse

# Setup argument parser to accept flags
parser = argparse.ArgumentParser(description='Calculate the most common runes for the Rune School Spelling System.')
parser.add_argument('--weighted', action='store_true', help='Apply weighting based on frequency')
parser.add_argument('--shortcuts', action='store_true', help='Use shortcut runes ᛇᛠᚪ')
parser.add_argument('--v', action='store_true', help='Use the Double Feoh bindrune for /v/ phoneme')
parser.add_argument('--kw', action='store_true', help='Use Cweorth rune for /kw/ phoneme')
parser.add_argument('--st', action='store_true', help='(Naively) Use Stan rune for /st/ phoneme')

# Parse the command line arguments
args = parser.parse_args()

# Sample regular expressions and phonemes data
phonemes = {
    re.compile(r'(?<![aeɔ])ɪ'): {'ᛁ': 1},
    re.compile(r'i(?!ː)'): {'ᛄ': 1},
    re.compile(r'e(?!ə)'): {'ᛖ': 1},
    re.compile(r'æ'): {'ᚫ': 1},
    re.compile(r'ɒ(?!ː)'): {'ᚩ': 1},
    re.compile(r'ɔːR'): {'ᚩ': 1, 'ᚱ': 1},
    re.compile(r'ʊ'): {'ᚣ': 1},
    re.compile(r'ʊəR'): {'ᚣ': 1, 'ᚱ': 1},
    re.compile(r'ʌ'): {'ᚢ': 1},
    re.compile(r'ɜːR'): {'ᚢ': 1, 'ᚱ': 1},
    re.compile(r'ə(?!R)|I'): {'ᛟ': 1},
    re.compile(r'əR'): {'ᛟ': 1, 'ᚱ': 1},
    re.compile(r'iə(?!R)'): {'ᛠ': 1} if args.shortcuts else {'ᛁ': 2},
    re.compile(r'iəR'): {'ᛠ': 1, 'ᚱ': 1} if args.shortcuts else {'ᛁ': 2, 'ᚱ': 1},
    re.compile(r'eəR'): {'ᛖ': 1, 'ᚱ': 1},
    re.compile(r'(ɑː|Ɑ)(?!R)'): {'ᚪ': 1} if args.shortcuts else {'ᚫ': 2},
    re.compile(r'(ɑː|Ɑ)R'): {'ᚪ': 1, 'ᚱ': 1} if args.shortcuts else {'ᚫ': 2, 'ᚱ': 1},
    re.compile(r'ɔː'): {'ᚩ': 2},
    re.compile(r'iː'): {'ᛇ': 1} if args.shortcuts else {'ᛁ': 1, 'ᛡ': 1},
    re.compile(r'eɪ'): {'ᛖ': 1, 'ᛡ': 1},
    re.compile(r'aɪ'): {'ᚫ': 1, 'ᛡ': 1},
    re.compile(r'ɔɪ'): {'ᚩ': 1, 'ᛡ': 1},
    re.compile(r'aʊ'): {'ᚫ': 1, 'ᚹ': 1},
    re.compile(r'əʊ'): {'ᚩ': 1, 'ᚹ': 1},
    re.compile(r'uː'): {'ᚣ': 1, 'ᚹ': 1},
    re.compile(r'p'): {'ᛈ': 1},
    re.compile(r'b'): {'ᛒ': 1},
    re.compile(r'st'): {'ᛥ': 1} if args.st else {'ᛋ': 1, 'ᛏ': 1},
    re.compile(r't(?!ʃ)'): {'ᛏ': 1},
    re.compile(r'd'): {'ᛞ': 1},
    re.compile(r'kw'): {'ᛢ': 1} if args.kw else {'ᛣ': 1, 'ᚹ': 1},
    re.compile(r'k'): {'ᛣ': 1},
    re.compile(r'(ɡ|g)'): {'ᚸ': 1},
    re.compile(r'f'): {'ᚠ': 1},
    re.compile(r'v'): {'v': 1} if args.v else {'ᚠ': 1},
    re.compile(r'(θ|ð|Ð)'): {'ᚦ': 1},
    re.compile(r's'): {'ᛋ': 1},
    re.compile(r'z'): {'ᛉ': 1},
    re.compile(r'(?<!t)ʃ'): {'ᛋ': 1, 'ᚳ': 1},
    re.compile(r'(?<!d)ʒ'): {'ᛉ': 1, 'ᚳ': 1},
    re.compile(r'tʃ'): {'ᚳ': 1},
    re.compile(r'dʒ'): {'ᚷ': 1},
    re.compile(r'j'): {'ᛡ': 1},
    re.compile(r'w'): {'ᚹ': 1},
    re.compile(r'ŋ'): {'ᛝ': 1},
    re.compile(r'h'): {'ᚻ': 1},
    re.compile(r'l'): {'ᛚ': 1},
    re.compile(r'r'): {'ᚱ': 1},
    re.compile(r'm'): {'ᛗ': 1},
    re.compile(r'n'): {'ᚾ': 1}
}

# Sample regular expressions and phonemes data
historical_phonemes = {
    re.compile(r'(?<![aeɔ])ɪ'): {'ᛁ': 1},
    re.compile(r'i(?!ː)'): {'ᛄ': 1},
    re.compile(r'e(?!ə)'): {'ᛖ': 1},
    re.compile(r'æ'): {'ᚫ': 1},
    re.compile(r'ɒ(?!ː)'): {'ᚩ': 1},
    re.compile(r'ɔːR'): {'ᚩ': 1, 'ᚱ': 1},
    re.compile(r'ʊ'): {'ᚢ': 1},
    re.compile(r'ʊəR'): {'ᚢ': 1, 'ᚱ': 1},
    re.compile(r'ʌ'): {'ᚣ': 1},
    re.compile(r'ɜːR'): {'ᚣ': 1, 'ᚱ': 1},
    re.compile(r'ə(?!R)|I'): {'ᛟ': 1},
    re.compile(r'əR'): {'ᛟ': 1, 'ᚱ': 1},
    re.compile(r'iə(?!R)'): {'ᛁ': 2},
    re.compile(r'iəR'): {'ᛇ': 1, 'ᚱ': 1} if args.shortcuts else {'ᛁ': 2, 'ᚱ': 1},
    re.compile(r'eəR'): {'ᛠ': 1, 'ᚱ': 1} if args.shortcuts else {'ᛖ': 2, 'ᚱ': 1},
    re.compile(r'(ɑː|Ɑ)(?!R)'): {'ᚫ': 2},
    re.compile(r'(ɑː|Ɑ)R'): {'ᚫ': 2, 'ᚱ': 1}, 
    re.compile(r'ɔː'): {'ᚩ': 1, 'ᚻ': 1},
    re.compile(r'iː'): {'ᛇ': 1} if args.shortcuts else {'ᛁ': 2},
    re.compile(r'eɪ'): {'ᛠ': 1} if args.shortcuts else {'ᛖ': 2},
    re.compile(r'aɪ'): {'ᚣ': 1, 'ᛡ': 1},
    re.compile(r'ɔɪ'): {'ᚩ': 1, 'ᛡ': 1},
    re.compile(r'aʊ'): {'ᚣ': 1, 'ᚹ': 1},
    re.compile(r'əʊ'): {'ᚩ': 2},
    re.compile(r'uː'): {'ᚢ': 2},
    re.compile(r'p'): {'ᛈ': 1},
    re.compile(r'b'): {'ᛒ': 1},
    re.compile(r'st'): {'ᛥ': 1} if args.st else {'ᛋ': 1, 'ᛏ': 1},
    re.compile(r't(?!ʃ)'): {'ᛏ': 1},
    re.compile(r'd'): {'ᛞ': 1},
    re.compile(r'kw'): {'ᛢ': 1} if args.kw else {'ᛣ': 1, 'ᚹ': 1},
    re.compile(r'k'): {'ᛣ': 1},
    re.compile(r'(ɡ|g)'): {'ᚸ': 1},
    re.compile(r'f'): {'ᚠ': 1},
    re.compile(r'v'): {'v': 1} if args.v else {'ᚠ': 1},
    re.compile(r'(θ|ð|Ð)'): {'ᚦ': 1},
    re.compile(r's'): {'ᛋ': 1},
    re.compile(r'z'): {'ᛉ': 1},
    re.compile(r'(?<!t)ʃ'): {'ᛋ': 1, 'ᚳ': 1},
    re.compile(r'(?<!d)ʒ'): {'ᛉ': 1, 'ᚳ': 1},
    re.compile(r'tʃ'): {'ᚳ': 1},
    re.compile(r'dʒ'): {'ᚷ': 1},
    re.compile(r'j'): {'ᛡ': 1},
    re.compile(r'w'): {'ᚹ': 1},
    re.compile(r'ʍ'): {'ᚹ': 1, 'ᚻ': 1},
    re.compile(r'ŋ'): {'ᛝ': 1},
    re.compile(r'h'): {'ᚻ': 1},
    re.compile(r'l'): {'ᛚ': 1},
    re.compile(r'r'): {'ᚱ': 1},
    re.compile(r'm'): {'ᛗ': 1},
    re.compile(r'n'): {'ᚾ': 1}
}

# Initialize running_total dictionary
running_total = {}

# Function to update running_total based on phonemes match
def update_running_total(phoneme_dict, frequency, weighted: bool):
    for key, value in phoneme_dict.items():
        value = value * frequency if weighted else value
        if key in running_total:
            running_total[key] += value
        else:
            running_total[key] = value

# Function to initialize readlex DataFrame from TSV file
def initialize_readlex(file_path):
    try:
        readlex_df = pd.read_csv(file_path, sep='\t', header=None, usecols=[3, 4])
        readlex_df.columns = ['Pronunciation', 'Frequency']
        return readlex_df
    except Exception as e:
        print(f"Error occurred while initializing readlex: {e}")
        return None

# Sample data for testing
readlex_df = initialize_readlex('./kingsleyreadlexicon.tsv')
if readlex_df is not None:
    # Iterate through readlex
    for index, row in readlex_df.iterrows():
        pronunciation = row['Pronunciation']
        frequency = row['Frequency']
        
        # Check against all keys in phonemes
        for regex, phoneme_dict in historical_phonemes.items():
            matches = regex.findall(pronunciation)
            for match in matches:
                update_running_total(phoneme_dict, frequency, weighted=args.weighted)

running_total_sum = sum(running_total.values())
for key, value in running_total.items():
    running_total[key] = value / running_total_sum
running_total_sorted = dict(sorted(running_total.items(), key=lambda item: item[1], reverse=True))
print("| order | rune | frequency |\n| --- | --- |")
count = 1
for key, value in running_total_sorted.items():
    print(f'| {count} | {key} | {round(100 * value,2)} |')
    count += 1
