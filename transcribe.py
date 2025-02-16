import whisper
from wordanalysis import get_diff

# Ignore the annoying warnings :(
import warnings
warnings.filterwarnings("ignore")

# This function takes in the path to an audio file and returns a string
# with the transcribed text (transcribed using whisper)
def transcribe(file_name):
    model = whisper.load_model("base")
    result = model.transcribe(file_name)
    return result["text"]

# This function takes in the path to an audio file and a target sentence, and
# transcribes the audio file with whisper. Then, the syllables in the target
# sentence that are mispronounced are returned by calling `compare_phonemes`.
def analyze_pronunciation(audio_path, target_sentence):
    # Transcribe audio
    transcribed_sentence = transcribe(audio_path)
    
    # Compare syllables in two sentences
    incorrect_syllables = get_diff(transcribed_sentence, target_sentence)

    return incorrect_syllables

# TESTING
# def testing():
#     s = transcribe("speechtestwrong.m4a")
#     target = transcribe("speechtest.wav")
#     print("Speech to text:", s)
#     syllables = process_audio("speechtestwrong.m4a")
#     print("Syllables:", syllables)
#     print(get_diff(s, target))

#     print("\nTESTING PART 2\n")
#     audio_file = "speechtest.wav"
#     target = "Kids are running by the fence"
#     differences = analyze_pronunciation(audio_file, target)

#     print(differences)
    
#     for target_word, pronounced_word in differences.items():
#         print(f"Word '{target_word}' pronounced as '{pronounced_word}'")

# if __name__ == "__main__":
#     testing()