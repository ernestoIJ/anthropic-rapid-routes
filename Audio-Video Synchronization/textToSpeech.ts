import * as dotenv from 'dotenv';
dotenv.config();

import fs from "fs";
import path from "path";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAI({ apiKey });
const speechFile = path.resolve("./speech.mp3");

const mp3 = await openai.audio.speech.create({
  model: "gpt-4o-mini-tts",
  voice: "coral",
  input: "Today is a wonderful day to build something people love!",
  instructions: "Speak in a cheerful and positive tone.",
});

const buffer = Buffer.from(await mp3.arrayBuffer());
await fs.promises.writeFile(speechFile, buffer);