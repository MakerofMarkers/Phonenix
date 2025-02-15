from transcribe import transcribe
from wordanalysis import compare_phonemes

# Ignore the annoying warnings :(
import warnings
warnings.filterwarnings("ignore")

# This function takes in the path to an audio file and a target sentence, and
# transcribes the audio file with whisper. Then, the syllables in the target
# sentence that are mispronounced are returned by calling `compare_phonemes`.
def analyze_pronunciation(audio_path, target_sentence):
    # Transcribe audio
    transcribed_sentence = transcribe(audio_path)
    
    # Compare syllables in two sentences
    incorrect_syllables = compare_phonemes(target_sentence, transcribed_sentence)

    return incorrect_syllables

# TESTING
def testing():
    audio_file = "speechtest.wav"
    target = "Kids are running by the fence"
    differences = analyze_pronunciation(audio_file, target)

    print(differences)
    
    for target_word, pronounced_word in differences.items():
        print(f"Word '{target_word}' pronounced as '{pronounced_word}'")


if __name__ == "__main__":
    testing()