import { LumaAI } from 'lumaai';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import { config } from 'dotenv';

config();

// Initialize the Luma AI client
const client = new LumaAI({
  authToken: process.env.LUMAAI_API_KEY || ''
});

/**
 * Generate a video from text prompt
 */
async function generateTextToVideo() {
  console.log('🎬 Starting text-to-video generation...');
  
  try {
    let generation = await client.generations.create({
      prompt: "A majestic digital character from an NFT collection walking through a futuristic cyberpunk city, neon lights reflecting off wet streets, cinematic lighting",
      model: "ray-2",
      resolution: "720p",
      duration: "5s"
    });

    console.log(`📝 Generation started with ID: ${generation.id}`);
    
    // Poll for completion
    let completed = false;
    while (!completed) {
      generation = await client.generations.get(generation.id);

      if (generation.state === "completed") {
        completed = true;
        console.log('✅ Generation completed!');
      } else if (generation.state === "failed") {
        throw new Error(`Generation failed: ${generation.failure_reason || 'Unknown reason'}`);
      } else {
        console.log(`⏳ Status: ${generation.state}... Dreaming...`);
        await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds
      }
    }

    // Download the video
    if (!generation.assets?.video) {
      throw new Error('No video URL in generation response');
    }
    const videoUrl = generation.assets.video;
    console.log(`📥 Downloading video from: ${videoUrl}`);
    
    const response = await fetch(videoUrl);
    const outputPath = path.join(__dirname, '..', 'output', `text_to_video_${generation.id}.mp4`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileStream = fs.createWriteStream(outputPath);
    await new Promise((resolve, reject) => {
      response.body?.pipe(fileStream);
      response.body?.on('error', reject);
      fileStream.on('finish', resolve);
    });

    console.log(`✅ Video saved as: ${outputPath}`);
    return outputPath;
    
  } catch (error) {
    console.error('❌ Text-to-video generation failed:', error);
    throw error;
  }
}

/**
 * Generate a video from an image
 */
async function generateImageToVideo(imageUrl: string) {
  console.log('🖼️ Starting image-to-video generation...');
  console.log('📸 Using image:', imageUrl);
  
  try {
    // Use the exact configuration that worked in debug
    let generation = await client.generations.create({
      prompt: "Make it move slightly",
      model: "ray-2",
      keyframes: {
        frame0: {
          type: "image",
          url: imageUrl
        }
      }
    });

    console.log(`📝 Generation started with ID: ${generation.id}`);
    
    // Poll for completion
    let completed = false;
    while (!completed) {
      generation = await client.generations.get(generation.id);

      if (generation.state === "completed") {
        completed = true;
        console.log('✅ Generation completed!');
      } else if (generation.state === "failed") {
        throw new Error(`Generation failed: ${generation.failure_reason || 'Unknown reason'}`);
      } else {
        console.log(`⏳ Status: ${generation.state}... Creating magic...`);
        await new Promise(r => setTimeout(r, 3000)); // Wait for 3 seconds
      }
    }

    // Download the video
    if (!generation.assets?.video) {
      throw new Error('No video URL in generation response');
    }
    const videoUrl = generation.assets.video;
    console.log(`📥 Downloading video from: ${videoUrl}`);
    
    const response = await fetch(videoUrl);
    const outputPath = path.join(__dirname, '..', 'output', `image_to_video_${generation.id}.mp4`);
    
    // Create output directory if it doesn't exist
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fileStream = fs.createWriteStream(outputPath);
    await new Promise((resolve, reject) => {
      response.body?.pipe(fileStream);
      response.body?.on('error', reject);
      fileStream.on('finish', resolve);
    });

    console.log(`✅ Video saved as: ${outputPath}`);
    return outputPath;
    
  } catch (error) {
    console.error('❌ Image-to-video generation failed:', error);
    throw error;
  }
}

/**
 * Main function to test both generation types
 */
async function main() {
  console.log('🚀 Luma AI Video Generation Test\n');
  
  // Check if API key is set
  if (!process.env.LUMAAI_API_KEY) {
    console.error('❌ Error: LUMAAI_API_KEY environment variable is not set');
    console.log('💡 Get your API key from: https://lumalabs.ai/dream-machine/api/keys');
    process.exit(1);
  }

  const args = process.argv.slice(2);
  const mode = args[0] || 'text';

  try {
    if (mode === 'text') {
      // Test text-to-video generation
      console.log('🎬 Testing Text-to-Video generation...\n');
      await generateTextToVideo();
      
    } else if (mode === 'image') {
      // Test image-to-video generation
      const imageUrl = args[1];
      
      if (!imageUrl) {
        // Use a test image that's publicly accessible
        // Alternative test images that should work:
        const testImages = [
          'https://images.unsplash.com/photo-1682695796954-bad0d0f59ff1?w=800&q=80', // Character portrait
          'https://raw.githubusercontent.com/anthropics/anthropic-cookbook/main/images/claude_logo.png', // Simple logo
          'https://picsum.photos/800/800', // Random image
        ];
        
        const testImageUrl = testImages[0];
        console.log('🖼️ No image URL provided, using test image:', testImageUrl);
        console.log('💡 Tip: The OpenSea CDN might be blocked. Try using a direct image URL.');
        await generateImageToVideo(testImageUrl);
      } else {
        console.log('🖼️ Testing Image-to-Video generation with:', imageUrl);
        console.log('💡 Note: If this fails, the image URL might not be accessible to Luma AI servers.');
        await generateImageToVideo(imageUrl);
      }
      
    } else {
      console.log('❌ Invalid mode. Use "text" or "image"');
      console.log('Usage:');
      console.log('  bun run test-lumaai.ts text');
      console.log('  bun run test-lumaai.ts image [imageUrl]');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

// Export functions for use in other modules
export { generateTextToVideo, generateImageToVideo };