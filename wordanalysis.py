import eng_to_ipa as p
import difflib
import re

# define letters
EN_VOWELS = "aeiouy"
IPA_VOWELS = "ɑɒæəɛɜɪiʊuʌʏoɔ"
EN_LETTERS = "abcdefghijklmnopqrstuvwxyz"

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
    valid_char = set(EN_LETTERS + " ")
    clean_text = "".join(char for char in text if char in valid_char)
    return clean_text

# 
# `is_vowel`
# 
# This function checks if a given phoneme is a vowel based on IPA symbols
# 
# @param phoneme        IPA phoneme
#
# @return bool          true if a phoneme is a vowel based on IPA symbols,
#                       false otherwise
def is_vowel(phoneme):
    return any(char in phoneme for char in IPA_VOWELS)

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
# This function
# 
# @param 
# @param
# 
# @return
def align_ipa_to_english(ipa_syllables, english_syllables):
    """Aligns IPA syllables with their corresponding English syllables."""
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
    ipa_word = p.convert(english_word)  # Convert to IPA
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
    
    return syllables

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
# @return diff_words        a list of syllables in target but not in 
#                           transcribed sentence; each element of the list is
#                           a pair of an IPA syllable and its corresponding
#                           English substring of the respective word
def get_diff(transcribed_sentence, target_sentence):
    transcribed_syll = string_to_syllables(transcribed_sentence)
    target_syll = string_to_syllables(target_sentence)

    diff_syll = {}

    # Flatten syllables to just their IPA part
    transcribed_ipa = [pair[0] for pair in transcribed_syll]
    target_ipa = [pair[0] for pair in target_syll]

    # Compare syllables using difflib
    matcher = difflib.SequenceMatcher(None, target_ipa, transcribed_ipa)


    for opcode, i1, i2, j1, j2 in matcher.get_opcodes():
        if opcode in ["replace", "delete"]:  # Mispronounced or missing syllables
            for i in range(i1, i2):
                target_pair = target_syll[i]
                print("TARGET PAIR", target_pair)
                
                # Check if the IPA syllable in target exists in any IPA syllable in transcribed
                match_found = False
                for j in range(j1, j2):
                    transcribed_pair = transcribed_syll[j]
                    print("TRANSCRIBED PAIR", transcribed_pair)
                    if target_pair[0] == transcribed_pair[0]:
                        match_found = True
                        break
                
                if not match_found:
                    diff_syll[target_pair[2]] = target_pair[1]
                    target_

    print("DIFF SYLL", diff_syll)
    return diff_syll

# TESTING
def testing():

    print(word_to_syllables("catastrophe"))

    str0 = "hello my name is olivia. this is a test!"
    print(string_to_syllables(str0))

    str1 = "i like cats"
    str2 = "i like catastrophe"
    print(str1, string_to_syllables(str1))
    print(str2, string_to_syllables(str2))
    missing = get_diff(str1, str2)
    print("Missing syllables:", missing)

if __name__ == "__main__":
    testing()