import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

const TRANSCRIPTION = (await openai.audio.transcriptions.create({
    file: fs.createReadStream("mp3-files/Transcribe.mp3"),
    model: "whisper-1",
})).text;

export default TRANSCRIPTION;