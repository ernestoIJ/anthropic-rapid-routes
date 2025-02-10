// index.ts
import "dotenv/config";
import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { FileHandler } from "./fileHandler";
import { Transcript } from "./transcription";
import { processAudioFile } from "./processAudio";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const fileHandler = new FileHandler();
const transcriptHandler = new Transcript(openai);

const audioFile: string = "jokes.m4a";

processAudioFile(audioFile, { openai, anthropic, fileHandler, transcriptHandler })
  .then((result) => {
    console.log("AI Response:", result);
  })
  .catch((err) => {
    console.error(err);
  });
