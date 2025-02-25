import { OpenAI } from "openai";

export class LLMService {
  openai: OpenAI
  system_message: string

  constructor(access_token: string, system_message: string | undefined = undefined) {
    this.openai = new OpenAI({ apiKey: access_token })
    this.system_message = system_message === undefined ? "You are a useful assistant" : system_message
  }

  async completion(prompt: string): Promise<string> {
    let params: OpenAI.Chat.ChatCompletionCreateParamsNonStreaming = {
      model: "gpt-4o",
      messages: [
        { "role": "developer", "content": this.system_message },
        { role: "user", content: prompt }
      ],
      temperature: 0,
    }

    const completion = await this.openai.chat.completions.create(params)

    let choice = completion.choices[0]
    let message = choice.message.content
    if (message === null) 
      throw new Error("Completion Failed")
    
    return message
  }
}
