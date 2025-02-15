!pip install requests
!pip install openai

import requests
import openai

from openai import OpenAI
client = OpenAI(api_key="")

inputWord = "cat"
strugglePron = "c"

completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
      {"role": "developer", "content": ""},
        {
            "role": "user",
            "content": "Can you please come up with 5 words that contain the sound " + strugglePron + " in the word " + inputWord + ", for speech therapy purposes? Respond with only those words, nothing else.",
        }
    ]
)
print(completion.choices[0].message)
