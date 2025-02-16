// import React from "react";

// export default function PracticeSentencePage({
//   setPage,
//   newSentenceButton,
//   practiceSomethingSimilar,
//   CameraComponent,
//   TextCard,
//   sentence,
//   setSentence,
// }) {
//   return (
//     <>
//       <div class="headerBar">
//         <button className="homeButton" onClick={() => setPage("Menu")}>
//           Home
//         </button>
//         <button className="homeButton">Logout</button>
//       </div>
//       <div className="belowHeaderBar">
//         <div className="screenLeft">
//           <div className="buttons">
//             <button
//               className="topBarButton"
//               onClick={() => newSentenceButton()}
//             >
//               New Sentence
//             </button>
//           </div>
//           <TextCard />
//           <button
//             className="practiceSimilarButton"
//             onClick={() => practiceSomethingSimilar()}
//           >
//             Practice Similar Sentence
//           </button>
//         </div>

//         <div className="screenRight">
//           <CameraComponent />
//         </div>
//       </div>
//       <div className="bottomBar">
//         <div className="feedBack">Feedback</div>
//       </div>
//     </>
//   );
// }

import React, { useState } from "react";
import AudioRecorder from "./AudioRecorderSentence";
import OpenAI from "openai";
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

export default function PracticeSentencePage({
  setPage,
  newSentenceButton,
  practiceSomethingSimilar,
  CameraComponent,
  TextCard,
  sentence,
  setSentence,
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
        <button className="homeButton">Logout</button>
      </div>

      <div className="belowHeaderBar">
        <div className="screenLeft">
          <div className="buttons">
            <button
              className="newSentenceButton"
              onClick={() => newSentenceButton()}
            >
              New Sentence
            </button>
            <button
              className="practiceSimilarButton"
              onClick={() => practiceSomethingSimilar()}
            >
              Practice Similar Sentence
            </button>
          </div>

          <TextCard />

          {/* Pass expected sentence and feedback function */}
          <AudioRecorder
            expectedSentence={sentence}
            onFeedback={handleFeedback}
            feedBack={feedBack}
            setFeedBack={setFeedBack}
          />

          {/* Show feedback when user pronounces the sentences */}
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
