// This won't work, this was just added to show what I worked on. It needs other files for this work


import { OpenAiConnection } from './utils';
import { OpenAiConfig, OpenAiModel } from './types';
import { createTestCases } from './testCases';
import path from 'path';
import fs from 'fs';
import dotenv, { config } from 'dotenv';
import { describe, test, expect, jest, beforeAll } from '@jest/globals';

// Load environment variables
dotenv.config();
const temp = 0.6;

describe('OpenAI Whisper API Integration Tests', () => {
  // Set timeout to a higher value as API calls might take time
  jest.setTimeout(60000);

  let openAiConnection: OpenAiConnection;
  
  beforeAll(() => {
    // Configure OpenAI connection
    const config: OpenAiConfig = {
      apiKey: process.env.OPENAI_API_KEY || '',
      baseUrl: process.env.OPENAI_API_BASE_URL || 'https://api.openai.com/v1',
      model: OpenAiModel.GPT_WHISPER_1,
      temperature: temp
    };
    
    openAiConnection = new OpenAiConnection(config);
  });

  test('should transcribe audio clips correctly', async () => {
    // Path to the validated.tsv file
    const tsvFilePath = path.join(__dirname, '../data/validated.tsv');
    // Root directory for the dataset
    const datasetRoot = path.join(__dirname, '../data');
    // Number of test cases to run
    const numberOfTests = 50;

    // Create test cases
    const testCases = createTestCases(tsvFilePath, datasetRoot, numberOfTests);
    
    // Ensure we have test cases
    expect(testCases.length).toBeGreaterThan(0);
    console.log(`Running tests on ${testCases.length} audio clips`);

    // Track results
    const results = {
      total: testCases.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      details: [] as Array<{
        filePath: string,
        expected: string,
        actual: string,
        success: boolean,
        error?: string
      }>
    };

    // Process each test case
    for (const [index, testCase] of testCases.entries()) {
      console.log(`Processing test case ${index + 1}/${testCases.length}: ${path.basename(testCase.filePath)}`);
      
      try {
        // Check if file exists
        if (!fs.existsSync(testCase.filePath)) {
          console.warn(`File not found: ${testCase.filePath}`);
          results.skipped++;
          results.details.push({
            filePath: testCase.filePath,
            expected: testCase.expectedSentence,
            actual: '',
            success: false,
            error: 'File not found'
          });
          continue;
        }

        // Read the audio file
        const audioFile = fs.readFileSync(testCase.filePath);
        
        // Create a File object from the buffer
        const file = new File([audioFile], path.basename(testCase.filePath), {
          type: 'audio/mp3'
        });

        // Transcribe the audio
        const transcription = await openAiConnection.transcribeScript(file);
        
        // Compare with expected result (case insensitive comparison)
        const normalizedExpected = testCase.expectedSentence.toLowerCase().trim();
        const normalizedActual = transcription.toString().toLowerCase().trim();
        
        const success = normalizedActual === normalizedExpected;
        
        if (success) {
          results.successful++;
        } else {
          results.failed++;
        }
        
        results.details.push({
          filePath: testCase.filePath,
          expected: testCase.expectedSentence,
          actual: transcription.toString(),
          success
        });
        
        // Log progress
        console.log(`Result: ${success ? 'SUCCESS' : 'FAILED'}`);
        if (!success) {
          console.log(`Expected: "${testCase.expectedSentence}"`);
          console.log(`Actual: "${transcription}"`);
        }
        console.log('\n');
        
      } catch (error) {
        console.error(`Error processing ${testCase.filePath}:`, error);
        results.failed++;
        results.details.push({
          filePath: testCase.filePath,
          expected: testCase.expectedSentence,
          actual: '',
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }

    // Log summary
    console.log('\nTest Summary:');
    console.log(`Total: ${results.total}`);
    console.log(`Temperature used: ${temp}`);
    console.log(`Successful: ${results.successful}`);
    console.log(`Failed: ${results.failed}`);
    console.log(`Skipped: ${results.skipped}`);
    console.log(`Success Rate: ${((results.successful / (results.total - results.skipped)) * 100).toFixed(2)}%`);

    // Write detailed results to a file for analysis
    const resultsFilePath = path.join(__dirname, '../data/transcription_test_results.json');
    fs.writeFileSync(resultsFilePath, JSON.stringify(results, null, 2));
    console.log(`Detailed results written to: ${resultsFilePath}`);

    // Assert that at least 80% of the tests passed
    const successRate = results.successful / (results.total - results.skipped);
    expect(successRate).toBeGreaterThanOrEqual(0.8);
  });
});
