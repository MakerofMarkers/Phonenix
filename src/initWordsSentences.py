import requests
import sqlite3
import openai

conn = sqlite3.connect('initialWordsSentences.db')
cursor = conn.cursor()

cursor.execute('''
CREATE TABLE IF NOT EXISTS initialWords (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_word TEXT
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS initialSentences (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    input_sentence TEXT               
)
'''
)

cursor.execute("SELECT (SELECT COUNT(*) FROM initialWords) AS initialWords_count, (SELECT COUNT(*) FROM initialSentences) AS initialSentences_count;")
result = cursor.fetchone()

initialWords_count, initialSentences_count = result

if initialWords_count == 0 and initialSentences_count == 0:
    wordsUrl = "https://random-word-api.vercel.app/api?words=50"
    wordsResponse = requests.get(wordsUrl)
    if wordsResponse.status_code == 200:
        words = wordsResponse.json()
        for word in words:
            cursor.execute('''
            INSERT INTO initialWords (input_word)
            VALUES (?)
            ''', (word,))
    else:
        print("There was an error populating the initial words table.")

    from openai import OpenAI
    client = OpenAI(api_key="")

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "developer", "content": ""},
        {
            "role": "user",
            "content": "Can you please come up with a paragraph consisting of 50 English sentences that are grammatically correct, for speech therapy purposes? Respond with only those sentences in paragraph form. Do not give me anything else at all.",
        }
    ]
    )
    sentences = (completion.choices[0].message.content)
    sentence_list = sentences.split('. ') 

    for sentence in sentence_list:
        sentence = sentence.strip() + '.' if sentence[-1] != '.' else sentence.strip()
        
        cursor.execute('''
        INSERT INTO initialSentences (input_sentence)
        VALUES (?)
        ''', (sentence,))
    
    conn.commit()

elif initialWords_count > 0 and initialSentences_count == 0:
    from openai import OpenAI
    client = OpenAI(api_key="")

    completion = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "developer", "content": ""},
        {
            "role": "user",
            "content": "Can you please come up with a paragraph consisting of 50 English sentences that are grammatically correct, for speech therapy purposes? Respond with only those sentences in paragraph form. Do not give me anything else at all.",
        }
    ]
    )
    sentences = (completion.choices[0].message.content)
    print(sentences)
    sentence_list = sentences.split('. ') 

    for sentence in sentence_list:
        sentence = sentence.strip() + '.' if sentence[-1] != '.' else sentence.strip()
        
        cursor.execute('''
        INSERT INTO initialSentences (input_sentence)
        VALUES (?)
        ''', (sentence,))
    
    conn.commit()

elif initialSentences_count > 0 and initialWords_count == 0:
    wordsUrl = "https://random-word-api.vercel.app/api?words=50"
    wordsResponse = requests.get(wordsUrl)
    if wordsResponse.status_code == 200:
        words = wordsResponse.json()
        for word in words:
            cursor.execute('''
            INSERT INTO initialWords (input_word)
            VALUES (?)
            ''', (word,))
    else:
        print("There was an error populating the initial words table.")
    
    conn.commit()

cursor.execute("SELECT * FROM initialWords")
words = cursor.fetchall()
print("\n--- initialWords Table ---")
for word in words:
    print(word)

cursor.execute("SELECT * FROM initialSentences")
sentences = cursor.fetchall()
print("\n--- initialSentences Table ---")
for sentence in sentences:
    print(sentence)

cursor.close()
conn.close()
