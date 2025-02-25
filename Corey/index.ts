import dotenv from "dotenv"
import RESPONSE from "./openai-functions/openai-prompt";

dotenv.config();

// Log hardcoded sample response to hardcoded sample transcription
console.log(`Response:\n${RESPONSE}`);