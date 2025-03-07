import fs, { readdirSync, writeFile } from "fs";
import { AnthropicConnection, OpenAIConnection } from "./src/utils/utils";
import { AnthropicConfig, AnthropicModel, OpenAIConfig } from "./src/utils/types";

export {
    AnthropicConnection,
    AnthropicConfig,
    AnthropicModel,
    OpenAIConnection,
    OpenAIConfig
};

const dir = "";

const anthropic = new AnthropicConnection({
    apiKey: "", // API KEY HERE
    baseUrl: "https://api.anthropic.com",
    temperature: 0.000000000000001,
    model: AnthropicModel.CLAUDE_3_5_HAIKU_20240229,
    maxTokens: 1000
});

const openai = new OpenAIConnection({
    apiKey: "", // API KEY HERE
    model: "whisper-1",
    prompt: ""
})


const files = readdirSync(dir);
let transcriptions: string = "";
let i = 1;

files.forEach(file => {
    openai.transcribe(file).then(transcription1 => {
        openai.transcribe(file).then(transcription2 => {
            openai.transcribe(file).then(transcription3 => {
                if (transcription1 != transcription2 || transcription1 != transcription3) {
                    console.log("ERROR: ", i.toString(), "th transcription is inconsistent");
                    console.log(transcription1, "\n", transcription2, "\n", transcription3)
                }
            })
        })
    })
})
