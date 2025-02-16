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

const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

async function getSimilarWord({ word, setWord }) {
  console.log("hello");
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
    "She sells seashells by the seashore.",
    "Red roses are really rare.",
    "The big brown bear bounced a ball.",
    "Silly snakes slither slowly.",
    "Peter picked a peck of pickled peppers.",
    "The rabbit ran rapidly across the road.",
    "I think that the thunder is thrilling.",
    "Charlie chose a chunky chocolate chip cookie.",
    "The ship sailed smoothly on the sea.",
    "Lucy loves learning languages like Latin.",
    "Round and round the rugged rocks, the ragged rascal ran.",
    "My mother makes marvelous muffins on Mondays.",
    "Frank found five funny flamingos.",
    "Tina takes tiny, timid turtle steps.",
    "The quick cat quietly crept across the kitchen.",
    "Grandpa grows green grapes in the garden.",
    "Daring dogs dash down the dusty driveway.",
    "Vicky's violin vibrates very vividly.",
    "Yellow yarn yanked yesterday in yards.",
    "Quiet queens quickly quilt quilts.",
  ];

  /*------------------------------------------------------*/
  const [page, setPage] = useState("Menu");

  const [word, setWord] = useState("Cat");
  const [sentence, setSentence] = useState("Hello World!");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");

  // const handleSpeak = () => {
  //   const utterance = new SpeechSynthesisUtterance(word.trim());
  //   window.speechSynthesis.speak(utterance);
  // };

  const handleSpeak = async ({ text }) => {
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/speech",
        {
          model: "tts-1",
          input: `${text.trim()}.`,
          voice: "shimmer",
        },
        {
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "application/json",
          },
          responseType: "arraybuffer",
        }
      );

      const audioBlob = new Blob([response.data], { type: "audio/mpeg" });
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    } catch (error) {
      console.error("Error generating speech:", error);
    }
  };

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
      getSimilarWord({ word, setWord });
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
    return <Statistics setPage={setPage} />;
  }
}

export default App;
