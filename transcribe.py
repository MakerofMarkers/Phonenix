import whisper
from wordanalysis import string_to_syllables

# Ignore the annoying warnings :(
import warnings
warnings.filterwarnings("ignore")

# This function takes in the path to an audio file and returns a string
# with the transcribed text (transcribed using whisper)
def transcribe(file_name):
    model = whisper.load_model("base")
    result = model.transcribe(file_name)
    return result["text"]

# This function takes in the path to an audio file and returns the speech
# as a list of syllables in IPA
def process_audio(file_name):
    # Transcribe audio file
    transcribed_text = transcribe(file_name)
    
    # Convert transcribed text to syllables
    syllables = string_to_syllables(transcribed_text)
    
    return syllables

# TESTING
def testing():
    s = transcribe("speechtestwrong.m4a")
    target = transcribe("speechtest.wav")
    print("Speech to text:", s)
    syllables = process_audio("speechtestwrong.m4a")
    print("Syllables:", syllables)
    print(get_diff(s, target))

if __name__ == "__main__":
    testing()