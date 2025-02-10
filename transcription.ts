import OpenAI from "openai";
import fs from "fs";

export class Transcript {
    private openai: OpenAI;

    constructor(openai: OpenAI) {
        this.openai = openai;
    }

    async getTranscription(audioFile: string): Promise<string> {
        try {
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(`audioDataset/${audioFile}`),
                model: "whisper-1",
            });
            return transcription.text;
        }
        catch (error) {
            console.error(`Error trying to get the transcription: ${error}`);
            return "";
        }
    }
}