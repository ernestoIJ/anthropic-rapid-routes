// processAudio.ts
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { FileHandler } from "./fileHandler";
import { Transcript } from "./transcription";

export interface ProcessAudioDeps {
  openai: OpenAI;
  anthropic: Anthropic;
  fileHandler: FileHandler;
  transcriptHandler: Transcript;
}

export async function processAudioFile(
  audioFile: string,
  deps: ProcessAudioDeps
): Promise<string> {
  if (!deps.fileHandler.checkIfValid(audioFile)) {
    throw new Error("Error: audio file not valid.");
  }

  const transcript = await deps.transcriptHandler.getTranscription(audioFile);
  if (!transcript) {
    throw new Error("No transcript obtained.");
  }

  const msg = await deps.anthropic.messages.create({
    model: "claude-3-5-sonnet-20241022",
    max_tokens: 1000,
    temperature: 0,
    system: "You are a helpful assistant.",
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: transcript,
          },
        ],
      },
    ],
  });
  
  // Assuming msg.content is an array and we want the first element’s text.
  return msg.content[0].text;
}
