import Anthropic from '@anthropic-ai/sdk';
import OpenAI from "openai";
import fs, { readdirSync } from "fs";
import { AnthropicConfig, OpenAIConfig } from './types';
import { ContentBlock } from '@anthropic-ai/sdk/resources/index.mjs';

export class AnthropicConnection {
    private anthropic: Anthropic;
    private config: AnthropicConfig;

    constructor(config: AnthropicConfig) {
        this.anthropic = new Anthropic({ 
            apiKey: config.apiKey.toString(),
            baseURL: config.baseUrl.toString(),
        });
        this.config = config;
    }
    public generateScript = async (prompt: string): Promise<ContentBlock[]> => {
        const response = await this.anthropic.messages.create({
            model: this.config.model,
            messages: [
                {
                    role: "assistant",
                    content: "You are a helpful assistant that converts spoken transcripts into well-formatted scripts. Maintain the speaker's tone and style while improving clarity and structure."
                },
                { 
                    role: "user", 
                    content: prompt 
                }
            ],
            max_tokens: Number(this.config.maxTokens),
            temperature: Number(this.config.temperature),
        });
        return response.content;
    }
}

export class OpenAIConnection {
    private openai: OpenAI;
    private config: OpenAIConfig;

    constructor(config: OpenAIConfig) {
        this.openai = new OpenAI({ 
            apiKey: config.apiKey.toString(),
        });
        this.config = config;
    }

    public transcribe = async (path: string): Promise<string> => {
        const transcription = await this.openai.audio.transcriptions.create({
            file: fs.createReadStream(path),
            model: this.config.model.toString(),
          });
          return transcription.text;
    }
}