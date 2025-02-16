import React, { useState, useRef } from "react";
import axios from "axios";
import "./AudioRecorder.css";

import OpenAI from "openai";
const openai = new OpenAI({
  apiKey:
    "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",
  dangerouslyAllowBrowser: true,
});

async function generateFeedback({
  cleanedExpectedSentence,
  cleanedTranscription,
  setFeedBack,
}) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: `You are a speech therapist who is trying to help someone learn to pronounce sentences. The user pronounced "${cleanedTranscription}", but the correct sentence was "${cleanedExpectedSentence}". Provide feedback on how they can improve their pronunciation in under 15 words.`,
        },
      ],
    });

    console.log("API Response:", response);
    console.log(response.choices);

    if (response.choices && response.choices.length > 0) {
      console.log(response.choices[0].message.content);
      setFeedBack(response.choices[0].message.content);
    } else {
      console.warn("No choices found in response.");
    }
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
  }
}

const AudioRecorder = ({
  expectedSentence,
  onFeedback,
  feedBack,
  setFeedBack,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [progress, setProgress] = useState(0);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const progressIntervalRef = useRef(null);

  const sendAudioToWhisper = async (audioBlob) => {
    const formData = new FormData();
    const audioFile = new File([audioBlob], "audio.wav", { type: "audio/wav" });

    formData.append("file", audioFile);
    formData.append("model", "whisper-1");

    try {
      const response = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        formData,
        {
          headers: {
            Authorization:
              "Bearer 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",
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setTranscribedText(response.data.text);
      return response.data.text;
    } catch (error) {
      console.error(
        "Error sending audio to Whisper:",
        error.response?.data || error.message
      );
      return null;
    }
  };

  const startRecording = async () => {
    setIsRecording(true);
    setProgress(0);
    audioChunksRef.current = [];

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = async () => {
        setIsRecording(false);
        setProgress(100);
        clearInterval(progressIntervalRef.current);

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/wav",
        });
        setAudioUrl(URL.createObjectURL(audioBlob));

        // Send to Whisper API
        const transcription = await sendAudioToWhisper(audioBlob);

        // Compare transcription with expected sentence
        if (transcription) {
          const cleanedTranscription = transcription
            .toLowerCase()
            .trim()
            .replace(/[.,!?;…]+$/g, ""); // Removes punctuation at the end

          const cleanedExpectedSentence = expectedSentence
            .toLowerCase()
            .trim()
            .replace(/[.,!?;…]+$/g, ""); // Removes punctuation at the end

          if (cleanedTranscription === cleanedExpectedSentence) {
            onFeedback(true); // ✅ Correct pronunciation
            setFeedBack("");
          } else {
            onFeedback(false); // ❌ Incorrect pronunciation
            generateFeedback({
              cleanedExpectedSentence,
              cleanedTranscription,
              setFeedBack,
            });
          }
        }
      };

      mediaRecorderRef.current.start();

      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => (prev < 100 ? prev + 2 : 100));
      }, 100);

      setTimeout(() => {
        clearInterval(progressIntervalRef.current);
        if (mediaRecorderRef.current?.state !== "inactive") {
          mediaRecorderRef.current?.stop();
        }
      }, 5000);
    } catch (error) {
      console.error("Microphone access error:", error);
      setIsRecording(false);
      clearInterval(progressIntervalRef.current);
    }
  };

  return (
    <div className="recorder-container">
      <button
        onClick={startRecording}
        disabled={isRecording}
        className="record-button"
        style={{
          position: "relative",
          background: "green",
          color: "white",
          overflow: "hidden",
        }}
      >
        <span
          className="progress-bar"
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "darkgreen",
            position: "absolute",
            left: 0,
            top: 0,
            transition: "width 0.1s linear",
            zIndex: 0,
          }}
        ></span>
        <span
          className="button-text"
          style={{ position: "relative", zIndex: 1 }}
        >
          {isRecording ? "Recording..." : "Start Recording"}
        </span>
      </button>

      {/* {audioUrl && (
        <div>
          <p>Recorded Audio:</p>
          <audio controls>
            <source src={audioUrl} type="audio/wav" />
            Your browser does not support the audio element.
          </audio>
        </div>
      )} */}
    </div>
  );
};

export default AudioRecorder;
