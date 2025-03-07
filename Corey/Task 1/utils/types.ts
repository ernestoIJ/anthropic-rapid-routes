export type AnthropicConfig = {
    apiKey: String;
    baseUrl: String;
    temperature: Number | 0;
    model: AnthropicModel;
    maxTokens: Number | 1000;
}

export enum AnthropicModel {
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet-20240620",
    CLAUDE_3_5_HAIKU = "claude-3-5-haiku-20240307",
    CLAUDE_3_5_HAIKU_20240229 = "claude-3-5-haiku-20240229",
    CLAUDE_3_5_SONNET_20240620 = "claude-3-5-sonnet-20240620",
};

export type OpenAIConfig = {
    apiKey: String;
    model: String;
    prompt: String;
}