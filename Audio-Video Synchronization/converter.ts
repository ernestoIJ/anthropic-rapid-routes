import ffmpeg from 'fluent-ffmpeg';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Recursively processes the input directory. For each .avi file found,
 * the function converts it to an .mp4 file and saves it in the corresponding
 * location in the output directory.
 *
 * @param inputDir - The directory to scan for .avi files.
 * @param outputDir - The directory where the converted files will be saved.
 */
async function processFolder(inputDir: string, outputDir: string) {
  // Ensure the output folder exists
  await fs.promises.mkdir(outputDir, { recursive: true });
  const entries = await fs.promises.readdir(inputDir, { withFileTypes: true });

  for (const entry of entries) {
    const inputPath = path.join(inputDir, entry.name);
    const outputPath = path.join(outputDir, entry.name);

    if (entry.isDirectory()) {
      // Recursively process subdirectories
      await processFolder(inputPath, outputPath);
    } else if (entry.isFile() && path.extname(entry.name).toLowerCase() === '.avi') {
      // Create an output file path with the .mp4 extension
      const outputFile = path.join(outputDir, path.basename(entry.name, '.avi') + '.mp4');
      console.log(`Converting ${inputPath} to ${outputFile}...`);

      // Wrap the conversion in a promise to await completion
      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .videoCodec('libx264')
          .audioCodec('aac')
          .on('end', () => {
            console.log(`Successfully converted ${inputPath} to ${outputFile}`);
            resolve();
          })
          .on('error', (err: any) => {
            console.error(`Error converting ${inputPath}: ${err.message}`);
            reject(err);
          })
          .save(outputFile);
      });
    }
  }
}

async function main() {
  const inputRoot = path.join('data');            // Root input folder
  const outputRoot = path.join('converted_data');   // Root output folder

  try {
    await processFolder(inputRoot, outputRoot);
    console.log('All conversions completed.');
  } catch (err) {
    console.error('Error during processing:', err);
  }
}

main();
