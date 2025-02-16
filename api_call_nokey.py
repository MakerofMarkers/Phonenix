from transcribe import analyze_pronunciation

from openai import OpenAI
client = OpenAI(api_key="")

# 
# `generate_words`
# 
# This function calls OpenAI's GPT 4o-mini model to generate five words with
# syllable `struggle_pron` in `input_word`.
# 
# @param input_word     the word that user struggles to pronounce
# @param struggle_pron  the syllable in `input_word` that user struggles with
#
# @return words         five new words as a list 
def generate_words(input_word, struggle_pron):
    completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
        {"role": "developer", "content": "You are a helpful assistant who is a linguistic expert in the English language."},
            {
                "role": "user",
                "content": "Can you please come up with 5 words with less than 10 letters each that contain the sound " + struggle_pron + " in the word " + input_word + ", for speech therapy purposes? Respond with only the five words in lowercase, formatted in a single line, separated by commas. The words should contain the full syllable.",
            }
        ]
    )

    response_text = completion.choices[0].message.content
    words = [word.strip() for word in response_text.split("\n") if word.strip()][0]

    # Return a list of strings (of words)
    return [word.strip() for word in words.split(",")]

# 
# `new_words_given_audio`
# 
# This function 
# 
# @param audio_path     file to audio path 
# @param target_sentence    target pronounced sentence  
#
# @return words         list of all new words
def new_words_given_audio(audio_path, target_sentence):
    syllables = analyze_pronunciation(audio_path, target_sentence)

    words = []

    for input_word, struggle_pron in syllables:
        words.append(generate_words(input_word, struggle_pron))

    return [word for lists in words for word in lists]

# TESTING
# def testing():
#     words = new_words_given_audio("speechtest.wav", "Kids are running by the fence.")
#     print(words)

# if __name__ == "__main__":
#     testing()
