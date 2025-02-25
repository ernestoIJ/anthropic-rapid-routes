import "dotenv/config"
import { FileHandler } from "./objects/fileHandler"
import { TextGenerator, Transcriber } from "./objects/ai";

const audioDir: FileHandler = new FileHandler('./audio_files');
const transcriber: Transcriber = new Transcriber(process.env.OPENAI_KEY ?? "");
// const textGenerator: TextGenerator = new TextGenerator(process.env.DEEPSEEK_KEY ?? "");

const filePath: string = (await audioDir.getAllFilePaths())[0];
const prompt: string = await transcriber.transcribe(filePath);
// const response: string = await textGenerator.respond(prompt);

console.log(prompt);
// console.log(response);
