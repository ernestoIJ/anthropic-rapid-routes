import * as fs from "fs/promises"
import * as path from "path"

export class FileHandler {
    constructor(private directory: string) {}

    async getAllFilePaths(): Promise<string[]> {
        try {
            const files: string[] = await fs.readdir(this.directory);
            return files.map(file => path.join(this.directory, file));
        } catch (error){
            throw new Error(`Could not gather files: ${error}`);
        }
    }
}