import { readdir, unlink } from 'fs/promises';
import * as fs from 'fs';
import * as path from 'path';

/**
 * Processes a single folder by finding files with the given extension,
 * shuffling them, and deleting 50% (rounded down) of them.
 *
 * @param folder - The folder path.
 * @param extension - The file extension filter (e.g. ".avi" or ".mp4").
 */
async function processFolder(folder: string, extension: string): Promise<void> {
  try {
    const entries = await readdir(folder, { withFileTypes: true });
    // Filter files by the given extension.
    const videoFiles = entries.filter(
      (entry) =>
        entry.isFile() && path.extname(entry.name).toLowerCase() === extension
    );

    if (videoFiles.length === 0) {
      console.log(`No ${extension} files found in ${folder}`);
      return;
    }

    // Determine 50% (rounded down) of the files to delete.
    const countToDelete = Math.floor(videoFiles.length / 2);
    console.log(`Found ${videoFiles.length} ${extension} file(s) in ${folder}. Deleting ${countToDelete}.`);

    // Shuffle the array randomly.
    const shuffled = videoFiles.sort(() => Math.random() - 0.5);
    const filesToDelete = shuffled.slice(0, countToDelete);

    // Delete selected files.
    for (const file of filesToDelete) {
      const filePath = path.join(folder, file.name);
      console.log(`Deleting ${filePath}`);
      await unlink(filePath);
    }
  } catch (error) {
    console.error(`Error processing folder ${folder}:`, error);
  }
}

/**
 * Recursively processes all subdirectories of the given folder.
 *
 * @param root - The root folder to process.
 * @param extension - The file extension to filter by.
 */
async function processDirectory(root: string, extension: string): Promise<void> {
  try {
    // Process the current folder.
    await processFolder(root, extension);

    // List subdirectories.
    const entries = await readdir(root, { withFileTypes: true });
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const subFolder = path.join(root, entry.name);
        await processDirectory(subFolder, extension);
      }
    }
  } catch (error) {
    console.error(`Error processing directory ${root}:`, error);
  }
}

async function main() {
  // Process 'data' for .avi files.
  console.log("Processing 'data' folder for .avi files...");
  await processDirectory('data', '.avi');

  // Process 'converted_data' for .mp4 files.
  console.log("Processing 'converted_data' folder for .mp4 files...");
  await processDirectory('converted_data', '.mp4');

  console.log("Deletion process completed.");
}

main().catch((err) => console.error("Error in main execution:", err));
