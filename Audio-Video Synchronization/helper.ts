import ffmpeg from 'fluent-ffmpeg';

export function getVideoOrAudioDuration(videoPath: string): Promise<number> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        console.error("Error retrieving video metadata:", err);
        return reject(err);
      }
      // Duration is in seconds
      const duration = metadata.format.duration;
      if (duration !== undefined) {
        // Ensure the duration is a floating point number
        const floatDuration = typeof duration === 'number' ? duration : parseFloat(duration.toString());
        resolve(floatDuration);
      } else {
        const errorMsg = "Could not determine video duration.";
        reject(new Error(errorMsg));
      }
    });
  });
}

