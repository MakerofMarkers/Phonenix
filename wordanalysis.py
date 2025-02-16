import eng_to_ipa as p
# from allosaurus.app import *

# define letters
EN_VOWELS = "aeiouy"
IPA_VOWELS = "ɑɒæəɛɜɪiʊuʌʏoɔ"
EN_LETTERS = "abcdefghijklmnopqrstuvwxyz"
IPA_LETTERS = "aeiouɑɛɪɔʊəæœɒpbtdʈɖcɟkgqɢʡʔmɱnɳɲŋɴʙrʀⱱɾɽɸβfvθðszʃʒʂʐɕʑçʝxɣχʁħʕhɦɬɮʋɹɻjɰlɭʎʟɺɧʧ"

# 
# `flatten_list`
# 
# This function flattens a list of tuples and lists of tuples into a list of
# just tuples.
# 
# @param input_list     list to be flattened
#
# @return flattened     flattened list of tuples
def flatten_list(input_list):
    flattened = []
    
    for item in input_list:
        if isinstance(item, tuple):
            flattened.append(item)
        elif isinstance(item, list):
            flattened.extend(flatten_list(item))
    
    return flattened

# 
# `clean`
# 
# This function cleans a string of all non-letter and non-space characters
# and converts the string to lowercase.
# 
# @param text           string to be cleaned
#
# @return clean_text    text cleared of non-letter and non-space characters
def clean(text):
    text = text.lower()
    valid_char = set(EN_LETTERS + IPA_LETTERS + " ")
    clean_text = "".join(char for char in text if char in valid_char)
    return clean_text

# 
# `syllabify_ipa`
# 
# This function takes in a word in IPA and splits it into a list of syllables
# using vowels as syllable boundaries
# 
# @param ipa_word       word in IPA
#
# @return syllables     list of syllables in `ipa_word`
def syllabify_ipa(ipa_word):
    syllables = []
    curr_syll = ""
    i = 0

    # Iterate through the IPA word
    while i < len(ipa_word):
        curr_syll += ipa_word[i]
        
        # Check if we've encountered a diphthong or multi-character IPA symbol
        if ipa_word[i] in IPA_VOWELS and (i == len(ipa_word) - 1 or ipa_word[i + 1] not in IPA_VOWELS):
            syllables.append(curr_syll)
            curr_syll = ""
        
        # Move to next character
        i += 1

    if curr_syll and len(syllables) > 0:  # Add remaining consonants
        syllables[-1] += curr_syll

    return syllables

# 
# `syllabify_english`
# 
# This function takes in a word in English and splits it into a list of
# syllables using vowels as syllable boundaries
# 
# @param ipa_word       word in English
#
# @return syllables     list of syllables in `english_word`
def syllabify_english(english_word):
    syllables = []
    current_syllable = ""

    i = 0
    while i < len(english_word):
        current_syllable += english_word[i]
        
        # If the character is a vowel and next character is not a vowel, it's the end of a syllable
        if english_word[i] in EN_VOWELS:
            # Check if next character is not a vowel or it's the last character
            if i == len(english_word) - 1 or english_word[i + 1] not in EN_VOWELS:
                syllables.append(current_syllable)
                current_syllable = ""
        
        i += 1

    # Append remaining characters to last syllable
    if current_syllable:
        if syllables:
            syllables[-1] += current_syllable
        else:
            syllables.append(current_syllable)

    return syllables

# 
# `align_ipa_to_english`
# 
# This function aligns IPA syllables to English word syllables.
# 
# @param ipa_syllables
# @param english_syllables
# 
# @return aligned_syllables list of pairs (IPA syllable, English syllable)
def align_ipa_to_english(ipa_syllables, english_syllables):
    aligned_syllables = []

    min_len = min(len(ipa_syllables), len(english_syllables))
    for i in range(min_len):
        aligned_syllables.append((ipa_syllables[i], english_syllables[i]))

    return aligned_syllables

# 
# `word_to_syllables`
# 
# This function first converts a given word to IPA. Then, the word is 
# converted to a list of its syllables. The syllable in IPA is matched to the
# corresponding letters in the English word. A dictionary mapping IPA
# syllables to their corresponding English syllable is returned.
# 
# @param english_word   word in plain English
#
# @return syllables     syllables as a list of pairs, where the first element
#                       in the pair is an IPA syllable, and the second 
#                       element in the pair is the corresponding English 
#                       syllable. For example, 
#                       word_to_syllables("kəˈtæstrəfi", "catastrophe") returns
#                       { "kə": "ca", "tæ": "ta", "strə": "stro", "fi": "phe" }
def word_to_syllables(english_word):
    ipa_word = clean(p.convert(english_word))  # Convert to IPA
    ipa_syll = syllabify_ipa(ipa_word)  # Get IPA syllables
    english_syll = syllabify_english(english_word)  # Get English syllables
    
    syllables = align_ipa_to_english(ipa_syll, english_syll)

    # Return each syllable along with its corresponding word (essentially tagging the syllable with its word)
    syllables_with_word = [(ipa_syllable, english_syllable, english_word) for (ipa_syllable, english_syllable) in syllables]

    return syllables_with_word

# 
# `string_to_syllables`
# 
# This function first splits a sentence as a string into a list of its words.
# Next, `word_to_syllables` is called on each of its words, and the lists
# returned by each call are concatenated and returned.
# 
# @param sentence       input sentence
#
# @return syllables     syllables as a list of pairs (IPA syllable, corresponding English substring of word)
def string_to_syllables(sentence):
    words = clean(sentence).split()

    syllables = []

    for word in words:
        syllables.append((word_to_syllables(word)))
    
    return flatten_list(syllables)

# 
# `get_diff`
# 
# This function takes in the transcribed sentence (string), target 
# sentence (string), and an optional similarity threshold. Then, a
# list of syllables (IPA syllables and corresponding English
# substring of respective word) that are in target but not in
# transcribed is returned.
# 
# @param transcribed_sentence transcribed sentence
# @param target_sentence    target sentence
# 
# @return diff_syll         a list of syllables in target but not in 
#                           transcribed sentence; each element of the list is
#                           a pair (word, syllable)
def get_diff(transcribed_sentence, target_sentence):
    # Convert both sentences to syllables (IPA syllables and corresponding English words)
    transcribed_syllables = string_to_syllables(transcribed_sentence)
    target_syllables = string_to_syllables(target_sentence)

    diff_syllables = []

    # Get IPA syllable
    transcribed_ipa = [pair[0] for pair in transcribed_syllables]
    target_ipa = [pair[0] for pair in target_syllables]

    # Compare IPA syllables in target with transcribed
    for target_pair in target_syllables:
        target_ipa_syllable = target_pair[0]
        target_english_syllable = target_pair[1]
        target_word = target_pair[2]

        # Append all (word, English syllable) pairs for mispronounced or missing syllable
        if target_ipa_syllable not in transcribed_ipa:
            diff_syllables.append((target_word, target_english_syllable))

    return diff_syllables

# TESTING
# def testing():
#     audio_path = "speechtest.wav"
#    time_stamps = get_time_stamps(audio_path)
#    print(time_stamps)

#     # print(word_to_syllables("catastrophe"))

#     # str0 = "hello my name is olivia. this is a test!"
#     # print(string_to_syllables(str0))

#     transcribed = "i like silhouette"
#     target = "i like syllable"
    
#     missing = get_diff(transcribed, target)
#     print("Missing syllables:")

# if __name__ == "__main__":
#     testing()