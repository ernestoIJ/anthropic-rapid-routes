// This won't work, this was just added to show what I worked on. It needs other files for this work

import { readFileSync } from 'fs';
import path from 'path';

type TestCase = {
  filePath: string;
  expectedSentence: string;
};

export function createTestCases(tsvFilePath: string, datasetRoot: string, count: number = 50): TestCase[] {
  const content = readFileSync(tsvFilePath, 'utf-8');
  const lines = content.split('\n');
  // Remove the header (first line)
  lines.shift();

  const testCases: TestCase[] = [];
  
  for (const line of lines) {
    if (!line.trim()) continue; // Skip empty lines
    const cols = line.split('\t');
    // Assume the columns are: client_id, path, sentence, up_votes, down_votes, etc.
    if (cols.length < 3) continue;
    
    const relativeAudioPath = cols[1]; // "path" column from TSV
    const sentence = cols[3];          // "sentence" column from TSV
    // Construct the full audio file path
    const audioFilePath = path.join(datasetRoot, 'clips', relativeAudioPath);
    
    testCases.push({
      filePath: audioFilePath,
      expectedSentence: sentence,
    });
    
    if (testCases.length >= count) break;
  }
  
  return testCases;
}
