import "./style.css";
import CameraComponent from "./camera";
import { useState } from "react";
import "./menu.css";
import Statistics from "./Statistics";
import AudioRecorder from "./AudioRecorderWord";
import axios from "axios";

import OpenAI from "openai";
import PracticeSentencePage from "./PracticeSentencePage";
import PracticeWordPage from "./PracticeWordPage";
import supabase from "./supabase";
import Log_in_form from "./login";
import Create_Account_Form from "./create-account";

import { ElevenLabsClient } from "elevenlabs";
const client = new ElevenLabsClient({
  apiKey: "sk_806607eed3b3f018225c0c0522f9d045f2f85c46e5b44826",
});

const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

async function getSimilarWord({
  word,
  setWord,
  baseCopyMispronouncedWord,
  setBaseCopyMispronouncedWord,
}) {
  console.log(baseCopyMispronouncedWord);
  if (baseCopyMispronouncedWord.length == "") {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `You are a speech therapist who is trying to help someone learn to pronounce words. Return a word that is similar to ${word}'. Please only return a word and nothing else.`,
          },
        ],
      });
      console.log("API Response:", response);
      console.log(response.choices);
      console.log(response.choices[0]);

      setWord(response.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  } else {
    /* Case where the user mispronounced the last word */
    console.log("previously wrong");
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: `You are a speech therapist helping someone improve their pronunciation. The user mistakenly said ${baseCopyMispronouncedWord} instead of ${word}.
             Provide one word that contains the sound they mispronounced in the expected word. Respond with only the word that contains the mispronounced sound.`,
          },
        ],
      });
      console.log("API Response:", response);
      console.log(response.choices);
      console.log(response.choices[0]);

      setWord(response.choices[0].message.content);
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }
  }
  setBaseCopyMispronouncedWord("");
}

async function getSimilarSentence({ sentence, setSentence }) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `You are a speech therapist who is trying to help someone learn to pronounce sentence. Return a sentence that is similar to ${sentence}'. Please only return a sentence without anything additional text or quotations.`,
        },
      ],
    });
    console.log("API Response:", response);
    console.log(response.choices);
    console.log(response.choices[0]);

    setSentence(response.choices[0].message.content);
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

function App() {
  const words = [
    "Bee",
    "Bow",
    "Day",
    "Echo",
    "Eye",
    "Owl",
    "Ice",
    "Oak",
    "Up",
    "Ear",
    "Pop",
    "Top",
    "Kick",
    "Dock",
    "Gap",
    "Zap",
    "Shush",
    "Fizz",
    "Jazz",
    "Chop",
    "Flip",
    "Trip",
    "Broom",
    "Slam",
    "Grow",
    "Snap",
    "Twist",
    "Crack",
    "Plop",
    "Flick",
    "Earth",
    "Bath",
    "Judge",
    "Measure",
    "Wrist",
    "Gnome",
    "Knot",
    "Psych",
    "Honest",
    "Subtle",
    "Mmm",
    "Nose",
    "Ring",
    "Honk",
    "Bong",
    "Whoosh",
    "Yawn",
    "Zap",
    "Fuzz",
    "Whirl",
  ];

  const sentences = [
    "The black cat jumps high.",
    "Tom wears a red hat.",
    "She really likes apples.",
    "Dogs love to run fast.",
    "Sam is eating hot soup.",
    "I can see a big fish.",
    "Ben throws the blue ball.",
    "We always play outside.",
    "The bright sun feels hot.",
    "Mom bakes a sweet cake.",
    "Birds sing in the morning.",
    "Dad drives a fast car.",
    "Anna holds her favorite doll.",
    "The green frog jumps far.",
    "Cold milk tastes so good.",
    "Max quickly kicks the ball.",
    "The little baby sleeps well.",
    "Emma gives mom a big hug.",
    "The brown dog barks loudly.",
    "I love to drink orange juice."
  ];
  

  /*------------------------------------------------------*/
  const [page, setPage] = useState("Menu");
  const [email, setEmail] = useState("");

  const getRandomWord = () => words[Math.floor(Math.random() * words.length)];

  // Function to get a random sentence
  const getRandomSentence = () =>
    sentences[Math.floor(Math.random() * sentences.length)];

  // Initialize state with a random word and sentence
  const [word, setWord] = useState(getRandomWord);
  const [sentence, setSentence] = useState(getRandomSentence);

  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("Mark");

  const [baseCopyMispronouncedWord, setBaseCopyMispronouncedWord] =
    useState("");

  // const handleSpeak = () => {
  //   const utterance = new SpeechSynthesisUtterance(word.trim());
  //   window.speechSynthesis.speak(utterance);
  // };

  const handleSpeak = async ({ text }) => {
    try {
      const voiceId = "JBFqnCBsd6RMkjVDRZzb";
      const apiKey = "sk_806607eed3b3f018225c0c0522f9d045f2f85c46e5b44826";

      const response = await fetch(
        `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`,
        {
          method: "POST",
          headers: {
            "xi-api-key": apiKey,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            text: text.trim(),
            model_id: "eleven_multilingual_v2",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }, // Optional
          }),
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        console.error("API Error Response:", errorMessage);
      }

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // const handleSpeak = async ({ text }) => {
  //   try {
  //     const response = await axios.post(
  //       "https://api.openai.com/v1/audio/speech",
  //       {
  //         model: "tts-1",
  //         input: `${text.trim()}.`,
  //         voice: "shimmer",
  //       },
  //       {
  //         headers: {
  //           Authorization:
  //             "Bearer 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",
  //           "Content-Type": "application/json",
  //         },
  //         responseType: "arraybuffer",
  //       }
  //     );

  //     const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
  //     const audioUrl = URL.createObjectURL(audioBlob);
  //     const audio = new Audio(audioUrl);
  //     audio.play();
  //   } catch (error) {
  //     console.error("Error generating speech:", error);
  //   }
  // };

  function TextCard() {
    if (page == "PracticeSentenceSession") {
      return (
        <div className="card">
          <div className="textSentence">{sentence}</div>
          <img
            src="./soundButton2.png"
            className="soundButton"
            onClick={() => handleSpeak({ text: sentence })}
            alt="Play Sound"
          />
        </div>
      );
    } else {
      return (
        <div className="card">
          <div className="textWord">{word}</div>
          <img
            src="./soundButton2.png"
            className="soundButton"
            onClick={() => handleSpeak({ text: word })}
            alt="Play Sound"
          />
        </div>
      );
    }
  }

  function practiceSomethingSimilar() {
    if (page == "PracticeWordSession") {
      getSimilarWord({
        word,
        setWord,
        baseCopyMispronouncedWord,
        setBaseCopyMispronouncedWord,
      });
    } else {
      getSimilarSentence({ sentence, setSentence });
    }
  }

  function newSentenceButton() {
    setSentence(sentences[Math.floor(Math.random() * sentences.length)]);
  }

  function newWordButton() {
    setWord(words[Math.floor(Math.random() * words.length)]);
  }

  async function attemptSignIn() {
    let { data: Users, error } = await supabase
      .from("Users")
      .select()
      .eq("email", email)
      .eq("password", password);
    if (Users.length == 1) {
      setPage("menu");
    }
    setEmail("");
    setPassword("");
  }
  if (page == "Create_Account") {
    return (
      <>
        <Create_Account_Form
          firstName={firstName}
          setFirstName={setFirstName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          page={page}
          setPage={setPage}
        />
        ;
      </>
    );
  } else if (page == "Login") {
    return (
      <>
        <Log_in_form
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          page={page}
          setPage={setPage}
        />
        ;
      </>
    );
  } else if (page == "Menu") {
    return (
      <div className="outer-container">
        <div className="menu-container">
          <h1 className="menu-title">Menu</h1>
          <div className="button-group">
            <button
              className="menu-button words"
              onClick={() => setPage("PracticeWordSession")}
            >
              Practice Words
            </button>
            <button
              className="menu-button sentences"
              onClick={() => setPage("PracticeSentenceSession")}
            >
              Practice Sentences
            </button>
            <button
              className="menu-button stats"
              onClick={() => setPage("UserStatistics")}
            >
              View Statistics
            </button>
          </div>
        </div>
      </div>
    );
  } else if (page == "PracticeWordSession") {
    return (
      <PracticeWordPage
        setPage={setPage}
        newWordButton={newWordButton}
        practiceSomethingSimilar={practiceSomethingSimilar}
        CameraComponent={CameraComponent}
        TextCard={TextCard}
        word={word}
        setWord={setWord}
        baseCopyMispronouncedWord={baseCopyMispronouncedWord}
        setBaseCopyMispronouncedWord={setBaseCopyMispronouncedWord}
      />
    );
  } else if (page == "PracticeSentenceSession") {
    return (
      <PracticeSentencePage
        setPage={setPage}
        newSentenceButton={newSentenceButton}
        practiceSomethingSimilar={practiceSomethingSimilar}
        CameraComponent={CameraComponent}
        TextCard={TextCard}
        sentence={sentence}
        setSentence={setSentence}
      />
    );
  } else if (page == "UserStatistics") {
    return <Statistics firstName={firstName} setPage={setPage} />;
  }
}

export default App;
