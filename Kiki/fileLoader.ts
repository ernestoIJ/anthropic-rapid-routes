import fs from "fs";

export class FileLoader {
    path: string

    constructor(path: string) {
        this.path = path
    }

    stream() : fs.ReadStream {
        return fs.createReadStream(this.path)
    }
  }
   