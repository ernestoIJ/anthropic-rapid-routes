import OpenAI from "openai"
import fs from "fs";

class Ai {
    protected openai: OpenAI

    constructor(apiKey: string) {
        this.openai = new OpenAI({ apiKey });
    }
}

export class Transcriber extends Ai {

    public async transcribe(filePath: string): Promise<string> {
        if (!fs.existsSync(filePath)) {
            throw new Error(`File does not exist: ${filePath}`);
        }        

        try {
            const transcription = await this.openai.audio.transcriptions.create({
                file: fs.createReadStream(filePath),
                model: "whisper-1",
            });
            return transcription.text
        } catch (error) {
            throw new Error(`Transcription failed: ${error}`)
        }
    }
}

export class TextGenerator {
    protected openai: OpenAI

    constructor(apiKey: string) {
        this.openai = new OpenAI({
            baseURL: 'https://api.deepseek.com',
            apiKey: apiKey
    });
    }

    public async respond(prompt: string): Promise<string> {
        if (prompt == "") {
            throw new Error("Prompt is empty");
        }        

        try {
            const completion = await this.openai.chat.completions.create({
                model: "deepseek-chat",
                messages: [
                    { role: "system", content: "You are a helpful assistant." },
                    { role: "user", content: prompt },
                ],
            });
            
            return completion.choices[0].message.content ?? "";

        } catch (error) {
            throw new Error(`AI Response failed: ${error}`)
        }
    }
}