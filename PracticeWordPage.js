import React, { useState } from "react";
import AudioRecorder from "./AudioRecorderWord";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

export default function PracticeWordPage({
  setPage,
  newWordButton,
  practiceSomethingSimilar,
  CameraComponent,
  TextCard,
  word,
  setWord,
  baseCopyMispronouncedWord,
  setBaseCopyMispronouncedWord,
}) {
  const [correctAnswer, setCorrectAnswer] = useState(null);
  const [feedBack, setFeedBack] = useState("");

  // Function to handle pronunciation feedback
  const handleFeedback = (isCorrect) => {
    setCorrectAnswer(isCorrect);
  };

  return (
    <>
      <div className="headerBar">
        <button className="homeButton" onClick={() => setPage("Menu")}>
          Home
        </button>
        <button className="homeButton" onClick={() => setPage("Login")}>
          Logout
        </button>
      </div>

      <div className="belowHeaderBar">
        <div className="screenLeft">
          <div className="buttons">
            <button className="newWordButton" onClick={() => newWordButton()}>
              New Word
            </button>
            <button
              className="practiceSimilarButton"
              onClick={() => practiceSomethingSimilar()}
            >
              Practice Similar Word
            </button>
          </div>

          <TextCard />

          {/* Pass expected word and feedback function */}
          <AudioRecorder
            expectedWord={word}
            onFeedback={handleFeedback}
            feedBack={feedBack}
            setFeedBack={setFeedBack}
            setBaseCopyMispronouncedWord={setBaseCopyMispronouncedWord}
          />

          {/* Show feedback when user pronounces the word */}
        </div>

        <div className="screenRight">
          <CameraComponent />
        </div>
      </div>

      <div className="bottomBar">
        <div className="feedBack">
          {correctAnswer === true && (
            <div className="feedback correct">✅ Correct!</div>
          )}
          {correctAnswer === false && (
            <div className="feedback incorrect">
              ❌ Please Try Again! {feedBack}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
