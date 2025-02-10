import path from "path";

export class FileHandler {
    private validExtensions: Set<string> = new Set([".mp3", ".mp4", ".mpeg", ".mpga", ".m4a", ".wav", ".webm"]);

    checkIfValid(fileName: string): boolean {
        try {
            const extension: string = path.extname(fileName);
            return this.validExtensions.has(extension);
        }
        catch (error) {
            console.error(`Error while checking if the audio file was valid: ${error}`);
            return false;
        }
    }
}