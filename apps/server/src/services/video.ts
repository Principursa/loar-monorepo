import ffmpeg from 'fluent-ffmpeg';
import { writeFileSync, unlinkSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';

/**
 * Downloads a video from a URL to a temporary file
 */
async function downloadVideo(url: string, outputPath: string): Promise<void> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download video from ${url}: ${response.statusText}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  writeFileSync(outputPath, buffer);
}

/**
 * Concatenates multiple videos into a single video
 * @param videoUrls - Array of video URLs to concatenate
 * @returns Path to the concatenated video file
 */
export async function concatenateVideos(videoUrls: string[]): Promise<string> {
  if (videoUrls.length === 0) {
    throw new Error('No video URLs provided for concatenation');
  }

  // If only one video, no need to concatenate
  if (videoUrls.length === 1) {
    console.log('Only one video provided, skipping concatenation');
    // Download and return the single video
    const tmpDir = join(tmpdir(), 'loar-video-concat');
    if (!existsSync(tmpDir)) {
      mkdirSync(tmpDir, { recursive: true });
    }
    const singleVideoPath = join(tmpDir, `single-${Date.now()}.mp4`);
    await downloadVideo(videoUrls[0], singleVideoPath);
    return singleVideoPath;
  }

  console.log(`🎬 Starting video concatenation for ${videoUrls.length} videos`);

  // Create temp directory for processing
  const tmpDir = join(tmpdir(), 'loar-video-concat');
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  const timestamp = Date.now();
  const downloadedVideos: string[] = [];
  const concatListPath = join(tmpDir, `concat-list-${timestamp}.txt`);
  const outputPath = join(tmpDir, `concatenated-${timestamp}.mp4`);

  try {
    // Step 1: Download all videos
    console.log('📥 Downloading videos...');
    for (let i = 0; i < videoUrls.length; i++) {
      const videoPath = join(tmpDir, `video-${timestamp}-${i}.mp4`);
      console.log(`Downloading video ${i + 1}/${videoUrls.length}: ${videoUrls[i]}`);
      await downloadVideo(videoUrls[i], videoPath);
      downloadedVideos.push(videoPath);
    }

    // Step 2: Create concat list file for FFmpeg
    const concatListContent = downloadedVideos
      .map(path => `file '${path}'`)
      .join('\n');
    writeFileSync(concatListPath, concatListContent);
    console.log('📝 Created concat list file');

    // Step 3: Concatenate videos using FFmpeg
    console.log('🔗 Concatenating videos with FFmpeg...');
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(concatListPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions(['-c', 'copy']) // Copy streams without re-encoding (fast!)
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent?.toFixed(2)}% done`);
        })
        .on('end', () => {
          console.log('✅ Concatenation completed successfully');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    // Step 4: Cleanup downloaded videos and concat list
    console.log('🧹 Cleaning up temporary files...');
    downloadedVideos.forEach(path => {
      try {
        unlinkSync(path);
      } catch (err) {
        console.warn(`Failed to delete temp file ${path}:`, err);
      }
    });

    try {
      unlinkSync(concatListPath);
    } catch (err) {
      console.warn(`Failed to delete concat list ${concatListPath}:`, err);
    }

    console.log(`🎉 Video concatenation complete: ${outputPath}`);
    return outputPath;

  } catch (error) {
    // Cleanup on error
    console.error('Error during concatenation, cleaning up...', error);
    downloadedVideos.forEach(path => {
      try {
        unlinkSync(path);
      } catch {}
    });
    try {
      unlinkSync(concatListPath);
    } catch {}
    try {
      unlinkSync(outputPath);
    } catch {}
    throw error;
  }
}

/**
 * Concatenates multiple local video files into a single video
 * Similar to concatenateVideos but works with local file paths instead of URLs
 * @param videoPaths - Array of local file paths to concatenate
 * @returns Path to the concatenated video file
 */
export async function concatenateLocalVideos(videoPaths: string[]): Promise<string> {
  if (videoPaths.length === 0) {
    throw new Error('No video paths provided for concatenation');
  }

  // If only one video, just return its path
  if (videoPaths.length === 1) {
    console.log('Only one video provided, skipping concatenation');
    return videoPaths[0];
  }

  console.log(`🎬 Starting local video concatenation for ${videoPaths.length} videos`);

  // Create temp directory for processing
  const tmpDir = join(tmpdir(), 'loar-video-concat');
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  const timestamp = Date.now();
  const concatListPath = join(tmpDir, `concat-list-${timestamp}.txt`);
  const outputPath = join(tmpDir, `concatenated-${timestamp}.mp4`);

  try {
    // Create concat list file for FFmpeg
    const concatListContent = videoPaths
      .map(path => `file '${path}'`)
      .join('\n');
    writeFileSync(concatListPath, concatListContent);
    console.log('📝 Created concat list file');

    // Concatenate videos using FFmpeg
    console.log('🔗 Concatenating videos with FFmpeg...');
    await new Promise<void>((resolve, reject) => {
      ffmpeg()
        .input(concatListPath)
        .inputOptions(['-f', 'concat', '-safe', '0'])
        .outputOptions(['-c', 'copy']) // Copy streams without re-encoding (fast!)
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('progress', (progress) => {
          console.log(`Processing: ${progress.percent?.toFixed(2)}% done`);
        })
        .on('end', () => {
          console.log('✅ Concatenation completed successfully');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    // Cleanup concat list
    try {
      unlinkSync(concatListPath);
    } catch (err) {
      console.warn(`Failed to delete concat list ${concatListPath}:`, err);
    }

    console.log(`🎉 Video concatenation complete: ${outputPath}`);
    return outputPath;

  } catch (error) {
    // Cleanup on error
    console.error('Error during concatenation, cleaning up...', error);
    try {
      unlinkSync(concatListPath);
    } catch {}
    try {
      unlinkSync(outputPath);
    } catch {}
    throw error;
  }
}

/**
 * Trims a video to a specific time range
 * @param videoUrl - URL of the video to trim
 * @param startTime - Start time in seconds
 * @param endTime - End time in seconds
 * @returns Path to the trimmed video file
 */
export async function trimVideo(
  videoUrl: string,
  startTime: number,
  endTime: number
): Promise<string> {
  console.log(`✂️ Trimming video from ${startTime}s to ${endTime}s`);

  const tmpDir = join(tmpdir(), 'loar-video-trim');
  if (!existsSync(tmpDir)) {
    mkdirSync(tmpDir, { recursive: true });
  }

  const timestamp = Date.now();
  const inputPath = join(tmpDir, `input-${timestamp}.mp4`);
  const outputPath = join(tmpDir, `trimmed-${timestamp}.mp4`);

  try {
    // Download video
    console.log('📥 Downloading video...');
    await downloadVideo(videoUrl, inputPath);

    // Trim video
    console.log('✂️ Trimming with FFmpeg...');
    await new Promise<void>((resolve, reject) => {
      ffmpeg(inputPath)
        .setStartTime(startTime)
        .setDuration(endTime - startTime)
        .outputOptions(['-c', 'copy']) // Copy without re-encoding
        .output(outputPath)
        .on('start', (commandLine) => {
          console.log('FFmpeg command:', commandLine);
        })
        .on('end', () => {
          console.log('✅ Trimming completed successfully');
          resolve();
        })
        .on('error', (err) => {
          console.error('❌ FFmpeg error:', err);
          reject(err);
        })
        .run();
    });

    // Cleanup input
    unlinkSync(inputPath);

    console.log(`🎉 Video trimming complete: ${outputPath}`);
    return outputPath;

  } catch (error) {
    // Cleanup on error
    console.error('Error during trimming, cleaning up...', error);
    try {
      unlinkSync(inputPath);
    } catch {}
    try {
      unlinkSync(outputPath);
    } catch {}
    throw error;
  }
}
