import * as ffmpeg from 'fluent-ffmpeg';
import * as path from 'path';

// Path to the .avi video file
const videoPath = path.join('converted_data','v_BoxingSpeedBag_g01_c03.mp4');

// Use ffprobe to get video metadata, including duration
ffmpeg.ffprobe(videoPath, (err, metadata) => {
    if (err) {
        console.error("Error retrieving video metadata:", err);
        return;
    }
    // Duration is in seconds
    const duration = metadata.format.duration;
    if (duration !== undefined) {
        console.log(`Video duration: ${duration.toFixed(2)} seconds`);
    } else {
        console.error("Could not determine video duration.");
    }
});
