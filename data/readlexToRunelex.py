import csv

# Mapping without shortcut runes and no bindrunes
ipa_to_runes_simple = [
    ('eɪ', 'ᛖᛡ'),
    ('aɪ', 'ᚫᛡ'),
    ('ɔɪ', 'ᚩᛡ'),
    ('ɪəR', 'ᛁᛁᚱ'),
    ('iː', 'ᛁᛡ'),
    ('ɪə', 'ᛁᛁ'),
    ('eəR', 'ᛖᛖᚱ'),
    ('eər', 'ᛖᛖᚱ'),
    ('ɔːR', 'ᚩᚩᚱ'),
    ('ɔːr', 'ᚩᚩᚱ'),
    ('ɑːR', 'ᚫᚫᚱ'),
    ('ɑːr', 'ᚫᚫᚱ'),
    ('ⱭR', 'ᚫᚫᚱ'),
    ('Ɑr', 'ᚫᚫᚱ'),
    ('aʊ', 'ᚫᚹ'),
    ('əʊ', 'ᚩᚹ'),
    ('ʊəR', 'ᚣᚣᚱ'),
    ('ʊər', 'ᚣᚣᚱ'),
    ('ɜːR', 'ᚢᚢᚱ'),
    ('ɜːr', 'ᚢᚢᚱ'),
    ('əR', 'ᛟᚱ'),
    ('uː', 'ᚣᚹ'),
    ('i', 'ᛄ'),
    ('ɪ', 'ᛁ'),
    ('e', 'ᛖ'),
    ('ɒ', 'ᚩ'),
    ('ɔː', 'ᚩᚩ'),
    ('u', 'ᚣ'),
    ('ʊ', 'ᚣ'),
    ('æ', 'ᚫ'),
    ('Æ', 'ᚫ'),
    ('ɑː', 'ᚫᚫ'),
    ('Ɑ', 'ᚫᚫ'),
    ('ʌ', 'ᚢ'),
    ('ə', 'ᛟ'),
    ('Ə', 'ᛟ'),
    ('tʃ', 'ᚳ'),
    ('dʒ', 'ᚷ'),
    ('ʍ', 'ᚻᚹ'),
    ('θ', 'ᚦ'),
    ('ð', 'ᚦ'),
    ('Ð', 'ᚦ'),
    ('r', 'ᚱ'),
    ('ʃ', 'ᛋᚳ'),
    ('p', 'ᛈ'),
    ('b', 'ᛒ'),
    ('t', 'ᛏ'),
    ('T', 'ᛏ'),
    ('d', 'ᛞ'),
    ('k', 'ᛣ'),
    ('ɡ', 'ᚸ'),
    ('g', 'ᚸ'),
    ('f', 'ᚠ'),
    ('F', 'ᚠᚱ'),
    ('v', 'ᚠ'),
    ('V', 'ᚠ'),
    ('s', 'ᛋ'),
    ('z', 'ᛉ'),
    ('ʒ', 'ᛉᚳ'),
    ('j', 'ᛡ'),
    ('w', 'ᚹ'),
    ('ŋ', 'ᛝ'),
    ('h', 'ᚻ'),
    ('l', 'ᛚ'),
    ('m', 'ᛗ'),
    ('n', 'ᚾ'),
    ('N', 'ᚾ'),
    (' ', '᛫​'),
    ('-', '᛫​'),
    ('.', ''),
    ('+', ''),
    ('ː', ''),
    ('ˈ', ''),
    ('ˌ', ''),
]

ipa_to_runes_standard = [
    ('eɪ', 'ᛖ‍ᛡ'),
    ('aɪ', 'ᚫ‍ᛡ'),
    ('ɔɪ', 'ᚩ‍ᛡ'),
    ('ɪəR', 'ᛠᚱ'),
    ('iː', 'ᛇ'),
    ('ɪə', 'ᛠ'),
    ('eəR', 'ᛖ‍ᚱ'),
    ('eər', 'ᛖ‍ᚱ'),
    ('ɔːR', 'ᚩ‍ᚱ'),
    ('ɔːr', 'ᚩ‍ᚱ'),
    ('ɑːR', 'ᚪ‍ᚱ'),
    ('ɑːr', 'ᚪ‍ᚱ'),
    ('ⱭR', 'ᚪ‍ᚱ'),
    ('Ɑr', 'ᚪ‍ᚱ'),
    ('əʊ', 'ᚩ‍ᚹ'),
    ('aʊ', 'ᚫ‍ᚹ'),
    ('ʊəR', 'ᚣ‍ᚱ'),
    ('ʊər', 'ᚣ‍ᚱ'),
    ('ɜːR', 'ᚢ‍ᚱ'),
    ('ɜːr', 'ᚢ‍ᚱ'),
    ('əR', 'ᛟ‍ᚱ'),
    ('uː', 'ᚣ‍ᚹ'),
    ('i', 'ᛄ'),
    ('ɪ', 'ᛁ'),
    ('e', 'ᛖ'),
    ('ɒ', 'ᚩ'),
    ('ɔː', 'ᚩ‍ᚩ'),
    ('u', 'ᚣ'),
    ('ʊ', 'ᚣ'),
    ('æ', 'ᚫ'),
    ('Æ', 'ᚫ'),
    ('ɑː', 'ᚪ'),
    ('Ɑ', 'ᚪ'),
    ('ʌ', 'ᚢ'),
    ('ə', 'ᛟ'),
    ('Ə', 'ᛟ'),
    ('dʒ', 'ᚷ'),
    ('tʃ', 'ᚳ'),
    ('ʍ', 'ᚻ‍ᚹ'),
    ('θ', 'ᚦ'),
    ('ð', 'ᚦ'),
    ('Ð', 'ᚦ'),
    ('r', 'ᚱ'),
    ('ʃ', 'ᛋ‍ᚳ'),
    ('p', 'ᛈ'),
    ('b', 'ᛒ'),
    ('t', 'ᛏ'),
    ('T', 'ᛏ'),
    ('d', 'ᛞ'),
    ('k', 'ᛣ'),
    ('ɡ', 'ᚸ'),
    ('g', 'ᚸ'),
    ('f', 'ᚠ'),
    ('F', 'ᚠ'),
    ('v', 'ᚠ‍ᚠ'),
    ('V', 'ᚠ‍ᚠ'),
    ('s', 'ᛋ'),
    ('z', 'ᛉ'),
    ('ʒ', 'ᛉ‍ᚳ'),
    ('j', 'ᛡ'),
    ('w', 'ᚹ'),
    ('ŋ', 'ᛝ'),
    ('h', 'ᚻ'),
    ('l', 'ᛚ'),
    ('m', 'ᛗ'),
    ('n', 'ᚾ'),
    ('N', 'ᚾ'),
    (' ', '᛫​'),
    ('-', '᛫​'),
    ('.', ''),
    ('+', ''),
    ('ː', ''),
    ('ˈ', ''),
    ('ˌ', ''),
]

def replace_with_runes(ipa_text, ipa_to_runes: dict):
    """ Replace IPA symbols in the text with corresponding runes, checking groups and symbols """
    # Sort the keys by length in descending order to replace larger groups first
    for key, rune in ipa_to_runes:
        ipa_text = ipa_text.replace(key, rune)
    return ipa_text

def process_tsv(input_file, output_file):
    with open(input_file, newline='', encoding='utf-8') as infile, \
         open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile, delimiter='\t')
        writer = csv.writer(outfile, delimiter='\t')

        # Read and write the header with a new column
        # headers = next(reader)
        # headers.append('Runic_IPA')
        # writer.writerow(headers)

        # Process each row
        for row in reader:
            if row:
                ipa_text = row[3]  # Index 3 for the IPA column
                #rune_text_simple = replace_with_runes(ipa_text, ipa_to_runes_simple)
                #row.append(rune_text_simple)  # Append the new column with simple runes
                rune_text_standard = replace_with_runes(ipa_text, ipa_to_runes_standard)
                #row.append(rune_text_standard)  # Append the new column with standard runes
                row.insert(1, rune_text_standard)
                writer.writerow(row)

# Specify the path to your input and output files
input_tsv_path = 'readlex.tsv'
output_tsv_path = 'runelex.tsv'

# Process the file
process_tsv(input_tsv_path, output_tsv_path)
