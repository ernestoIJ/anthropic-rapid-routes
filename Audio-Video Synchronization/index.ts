import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';
import { getVideoOrAudioDuration } from './helper';
import { SpeechGenerator } from './textToSpeech';

const apiKey: string = process.env.OPENAI_API_KEY ?? '';
const speechGenerator: SpeechGenerator = new SpeechGenerator(apiKey);

speechGenerator.generateSpeech(
    "Today is a wonderful day to build something people love!",
    "Speak in a cheerful and positive tone.",
    "./speech3.mp3"
    );
      