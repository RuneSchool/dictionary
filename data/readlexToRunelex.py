import csv

# Mapping without shortcut runes and no bindrunes, but with double feoh
ipa_to_runes_simple = {
    'iː': 'ᛁᛡ',
    'ɪə': 'ᛁᛁ',
    'ɪəR': 'ᛁᛁᚱ',
    'i': 'ᛄ',
    'ɪ': 'ᛁ',
    'eəR': 'ᛖᛖᚱ',
    'ɔːR': 'ᚩᚩᚱ',
    'ɒ': 'ᚩ',
    'ɔː': 'ᚩᚩ',
    'ɔɪ': 'ᚩᛡ',
    'əʊ': 'ᚩᚹ',
    'ʊ': 'ᚣ',
    'uː': 'ᚣᚹ',
    'ʊəR': 'ᚣᚣᚱ',
    'æ': 'ᚫ',
    'ɑː': 'ᚫᚫ',
    'Ɑ': 'ᚫᚫ',
    'ɑːR': 'ᚫᚫᚱ',
    'ⱭR': 'ᚫᚫᚱ',
    'aɪ': 'ᚫᛡ',
    'aʊ': 'ᚫᚹ',
    'ʌ': 'ᚢ',
    'ɜːR': 'ᚢᚢᚱ',

}

# Mapping with all runes and bindrunes
ipa_to_runes_standard = {
    'iː': 'ᛇ',
    'ɪəR': 'ᛠᚱ',
    'ɪə': 'ᛠ',
    'i': 'ᛄ',
    'ɪ': 'ᛁ',
    'eəR': 'ᛖ‍ᚱ',
    'ɔːR': 'ᚩ‍ᚱ',
    'ɒ': 'ᚩ',
    'ɔː': 'ᚩ‍ᚩ',
    'ɔɪ': 'ᚩ‍ᛡ',
    'əʊ': 'ᚩ‍ᚹ',
    'ʊ': 'ᚣ',
    'uː': 'ᚣ‍ᚹ',
    'ʊəR': 'ᚣ‍ᚱ',
    'æ': 'ᚫ',
    'ɑː': 'ᚪ',
    'Ɑ': 'ᚪ',
    'ɑːR': 'ᚪ‍ᚱ',
    'ⱭR': 'ᚪ‍ᚱ',
    'aɪ': 'ᚫ‍ᛡ',
    'aʊ': 'ᚫ‍ᚹ',
    'ʌ': 'ᚢ',
    'ɜːR': 'ᚢ‍ᚱ',
}

def replace_with_runes(ipa_text, ipa_to_runes: dict):
    """ Replace IPA symbols in the text with corresponding runes, checking groups and symbols """
    # Sort the keys by length in descending order to replace larger groups first
    for key in sorted(ipa_to_runes, key=len, reverse=True):
        ipa_text = ipa_text.replace(key, ipa_to_runes[key])
    return ipa_text

def process_tsv(input_file, output_file):
    with open(input_file, newline='', encoding='utf-8') as infile, \
         open(output_file, 'w', newline='', encoding='utf-8') as outfile:
        reader = csv.reader(infile, delimiter='\t')
        writer = csv.writer(outfile, delimiter='\t')

        # Read and write the header with a new column
        headers = next(reader)
        headers.append('Runic_IPA')
        writer.writerow(headers)

        # Process each row
        for row in reader:
            if row:
                ipa_text = row[3]  # Index 3 for the IPA column
                rune_text_simple = replace_with_runes(ipa_text, ipa_to_runes_simple)
                row.append(rune_text_simple)  # Append the new column with simple runes
                rune_text_standard = replace_with_runes(ipa_text, ipa_to_runes_standard)
                row.append(rune_text_standard)  # Append the new column with standard runes
                writer.writerow(row)

# Specify the path to your input and output files
input_tsv_path = 'kingsleyreadlexicon.tsv'
output_tsv_path = 'output.tsv'

# Process the file
process_tsv(input_tsv_path, output_tsv_path)
