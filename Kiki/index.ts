import { FileLoader } from "./fileLoader"
import { LLMService } from "./LLMService"
import { TranscriptionService } from "./transcriptionService"


let openai_access_token: string | undefined = process.env.OPENAI_ACCESS_TOKEN

if (openai_access_token === undefined) {
    console.error("Set OPENAI_ACCESS_TOKEN in .env file.")
    process.exit(-1)
}

// Create service objects
const transcriber = new TranscriptionService(openai_access_token)
const llm = new LLMService(openai_access_token)

// Process audio
const audio_stream = new FileLoader("./audio.mp3")
const transcription = await transcriber.transcribe(audio_stream.stream())
const completion = await llm.completion(transcription)

// Print output
console.log(`Transcript: ${transcription}\nResponse: ${completion}`)