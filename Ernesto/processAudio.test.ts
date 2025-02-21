// processAudio.test.ts
import { test, expect, beforeEach, vi } from "bun:test";
import { processAudioFile, ProcessAudioDeps } from "./processAudio";

let deps: ProcessAudioDeps;

beforeEach(() => {
  // Reinitialize the mocks for each test
  deps = {
    openai: {} as any, // not used directly in processAudioFile
    anthropic: {
      messages: {
        create: vi.fn(),
      },
    } as any,
    fileHandler: {
      checkIfValid: vi.fn(),
    } as any,
    transcriptHandler: {
      getTranscription: vi.fn(),
    } as any,
  };
});

test("should throw an error if the audio file is not valid", async () => {
  // Setup: simulate invalid audio file
  deps.fileHandler.checkIfValid.mockReturnValue(false);

  await expect(processAudioFile("invalid_audio.m4a", deps))
    .rejects
    .toThrow("Error: audio file not valid.");
});

test("should throw an error if no transcript is obtained", async () => {
  deps.fileHandler.checkIfValid.mockReturnValue(true);
  deps.transcriptHandler.getTranscription.mockResolvedValue("");

  await expect(processAudioFile("jokes.m4a", deps))
    .rejects
    .toThrow("No transcript obtained.");
});

test("should return the AI response text on success", async () => {
  const dummyTranscript = "This is a dummy transcript.";
  const dummyResponseText = "This is a dummy AI response.";

  deps.fileHandler.checkIfValid.mockReturnValue(true);
  deps.transcriptHandler.getTranscription.mockResolvedValue(dummyTranscript);
  deps.anthropic.messages.create.mockResolvedValue({
    content: [{ text: dummyResponseText }],
  });

  const result = await processAudioFile("jokes.m4a", deps);
  expect(result).toBe(dummyResponseText);

  // Optionally, check that mocks were called with the correct arguments
  expect(deps.fileHandler.checkIfValid).toHaveBeenCalledWith("jokes.m4a");
  expect(deps.transcriptHandler.getTranscription).toHaveBeenCalledWith("jokes.m4a");
  expect(deps.anthropic.messages.create).toHaveBeenCalled();
});
