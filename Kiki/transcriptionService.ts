import OpenAI from "openai";
import fs from "fs"

export class TranscriptionService {
    openai: OpenAI
   
    constructor(access_token: string) {
        this.openai = new OpenAI({apiKey: access_token})
    }

    async transcribe(audioStream: fs.ReadStream) : Promise<string> {
        const transcription = await this.openai.audio.transcriptions.create({
            file: audioStream,
            model: "whisper-1",
          });
          
        return transcription.text
    }
  }
   