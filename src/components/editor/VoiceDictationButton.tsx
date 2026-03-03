"use client";

import { type Editor } from "@tiptap/react";
import { useState } from "react";

interface Props {
  editor: Editor | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
  }
}

export default function VoiceDictationButton({ editor }: Props) {
  const [recording, setRecording] = useState(false);
  const SpeechRecognition = typeof window !== "undefined"
    ? window.SpeechRecognition || window.webkitSpeechRecognition
    : null;

  if (!SpeechRecognition) return null;

  function toggleRecording() {
    if (!editor) return;

    if (recording) {
      setRecording(false);
      return;
    }

    const recognition = new SpeechRecognition!();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      editor.chain().focus().insertContent(transcript + " ").run();
    };

    recognition.onend = () => setRecording(false);
    recognition.onerror = () => setRecording(false);

    recognition.start();
    setRecording(true);
  }

  return (
    <button
      type="button"
      onClick={toggleRecording}
      title={recording ? "Stop dictation" : "Voice dictation"}
      className={`px-2 py-1 text-[12px] rounded transition-colors ${
        recording ? "bg-red-500 text-white" : "text-muted hover:text-foreground hover:bg-surface-hover"
      }`}
    >
      {recording ? "🔴" : "🎤"}
    </button>
  );
}
