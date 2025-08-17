import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

config();

interface KlingImageInput {
  image: string;
}

interface KlingMultiImageOptions {
  image_list: KlingImageInput[];
  prompt?: string;
  negative_prompt?: string;
  mode?: 'std' | 'pro';
  duration?: '5' | '10';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  model_name?: 'kling-v1-6';
  external_task_id?: string;
}

interface KlingTaskResponse {
  code: number;
  message: string;
  request_id: string;
  data: {
    task_id: string;
    task_status: 'submitted' | 'processing' | 'succeed' | 'failed';
    task_status_msg: string;
    task_info: {
      external_task_id?: string;
    };
    created_at: number;
    updated_at: number;
    task_result?: {
      videos: Array<{
        id: string;
        url: string;
        duration: string;
      }>;
    };
  };
}

class KlingTestClient {
  private accessKey: string;
  private secretKey: string;
  private baseUrl = 'https://api-singapore.klingai.com/v1';

  constructor() {
    if (!process.env.KLING_ACCESS_KEY || !process.env.KLING_SECRET_KEY) {
      throw new Error('KLING_ACCESS_KEY and KLING_SECRET_KEY environment variables are required');
    }
    this.accessKey = process.env.KLING_ACCESS_KEY;
    this.secretKey = process.env.KLING_SECRET_KEY;
  }

  private generateJWTToken(): string {
    const headers = {
      alg: "HS256",
      typ: "JWT"
    };

    const currentTime = Math.floor(Date.now() / 1000);
    const payload = {
      iss: this.accessKey,
      exp: currentTime + 1800, // 30 minutes from now
      nbf: currentTime - 5     // 5 seconds ago
    };

    return jwt.sign(payload, this.secretKey, { header: headers });
  }

  private async downloadImageAsBase64(imageUrl: string): Promise<string> {
    try {
      console.log(`📥 Downloading image: ${imageUrl}`);
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64 = buffer.toString('base64');

      console.log(`✅ Image converted to base64 (${Math.round(base64.length / 1024)}KB)`);
      return base64;
    } catch (error) {
      console.error(`❌ Failed to download image ${imageUrl}:`, error);
      throw new Error(`Failed to download image: ${error}`);
    }
  }


  async createMultiImageVideo(options: KlingMultiImageOptions): Promise<KlingTaskResponse> {
    console.log('🖼️ Using images directly for Kling AI...');

    const payload = {
      model_name: options.model_name || 'kling-v1-6',
      image_list: options.image_list,
      prompt: options.prompt,
      negative_prompt: options.negative_prompt,
      mode: options.mode || 'std',
      duration: options.duration || '5',
      aspect_ratio: options.aspect_ratio || '16:9',
      external_task_id: options.external_task_id
    };

    console.log('🚀 Creating multi-image video with payload:', JSON.stringify(payload, null, 2));

    try {
      const response = await fetch(`${this.baseUrl}/videos/multi-image2video`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.generateJWTToken()}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json() as KlingTaskResponse;

      if (!response.ok) {
        console.error('❌ API Response Error:', response.status, response.statusText);
        console.error('❌ Error Details:', result);
        throw new Error(`Kling API error: ${response.status} ${response.statusText}`);
      }

      if (result.code !== 0) {
        throw new Error(`Kling API error: ${result.message}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Multi-image video creation failed:', error);
      throw error;
    }
  }

  async getTaskStatus(taskId: string): Promise<KlingTaskResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/multi-image2video/${taskId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.generateJWTToken()}`
        }
      });

      const result = await response.json() as KlingTaskResponse;

      if (!response.ok) {
        console.error('❌ API Response Error:', response.status, response.statusText);
        console.error('❌ Error Details:', result);
        throw new Error(`Kling API error: ${response.status} ${response.statusText}`);
      }

      if (result.code !== 0) {
        throw new Error(`Kling API error: ${result.message}`);
      }

      return result;
    } catch (error) {
      console.error('❌ Failed to get task status:', error);
      throw error;
    }
  }
}

async function testMultiImageVideo() {
  console.log('🎬 Starting Kling Multi-Image to Video Test\n');

  const client = new KlingTestClient();

  // Use the original NFT images - they'll be converted to base64
  const nftImages = [
    'https://images.weserv.nl/?url=https://i2.seadn.io/ethereum/0xbd3531da5cf5857e7cfaa92426877b022e612cf8/96be7f7caf4d36031db0a6757a1b110b.png',
  ];

  try {
    console.log('🖼️ Using NFT character images:');
    nftImages.forEach((url, index) => {
      console.log(`  ${index + 1}. ${url}`);
    });
    console.log();

    // Create video generation task with cheapest configuration
    const generation = await client.createMultiImageVideo({
      image_list: nftImages.map(url => ({ image: url })),
      prompt: "Smooth transition between characters",
      mode: 'std', // Cheapest mode
      duration: '5', // Shortest duration for cost efficiency
      aspect_ratio: '16:9',
      external_task_id: `nft_test_${Date.now()}`
    });

    console.log(`✅ Generation started successfully!`);
    console.log(`📝 Task ID: ${generation.data.task_id}`);
    console.log(`📊 Status: ${generation.data.task_status}`);
    console.log(`⏰ Created at: ${new Date(generation.data.created_at).toISOString()}\n`);

    // Poll for completion
    let completed = false;
    let attempts = 0;
    const maxAttempts = 60; // 5 minutes max (5 seconds * 60)

    while (!completed && attempts < maxAttempts) {
      attempts++;
      console.log(`🔄 Checking status (attempt ${attempts}/${maxAttempts})...`);

      const status = await client.getTaskStatus(generation.data.task_id);

      console.log(`📊 Status: ${status.data.task_status}`);
      if (status.data.task_status_msg) {
        console.log(`💬 Message: ${status.data.task_status_msg}`);
      }

      if (status.data.task_status === 'succeed') {
        completed = true;
        console.log('🎉 Generation completed successfully!\n');

        if (status.data.task_result?.videos?.length) {
          const video = status.data.task_result.videos[0];
          console.log(`🎥 Video Details:`);
          console.log(`   ID: ${video.id}`);
          console.log(`   Duration: ${video.duration}`);
          console.log(`   URL: ${video.url}`);

          // Download the video
          console.log('\n📥 Downloading video...');
          const videoResponse = await fetch(video.url);
          const outputPath = path.join(__dirname, '..', 'output', `nft_characters_${generation.data.task_id}.mp4`);

          // Create output directory if it doesn't exist
          const outputDir = path.dirname(outputPath);
          if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
          }

          const fileStream = fs.createWriteStream(outputPath);
          await new Promise((resolve, reject) => {
            videoResponse.body?.pipe(fileStream);
            videoResponse.body?.on('error', reject);
            fileStream.on('finish', resolve);
          });

          console.log(`✅ Video saved as: ${outputPath}`);
          return outputPath;
        }

      } else if (status.data.task_status === 'failed') {
        throw new Error(`Generation failed: ${status.data.task_status_msg}`);
      } else {
        console.log(`⏳ Status: ${status.data.task_status}... waiting...\n`);
        await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
      }
    }

    if (!completed) {
      console.log('⏰ Generation timed out after 5 minutes');
      console.log(`💡 Task ID ${generation.data.task_id} may still be processing. Check status later.`);
      return null;
    }

  } catch (error) {
    console.error('❌ Test failed:', error);
    if (error instanceof Error) {
      console.error('❌ Error details:', error.message);
    }
    throw error;
  }
}

async function main() {
  // Check if API keys are set
  if (!process.env.KLING_ACCESS_KEY || !process.env.KLING_SECRET_KEY) {
    console.error('❌ Error: KLING_ACCESS_KEY and KLING_SECRET_KEY environment variables are not set');
    console.log('💡 Add your Kling API credentials to the .env file');
    process.exit(1);
  }

  try {
    const videoPath = await testMultiImageVideo();
    if (videoPath) {
      console.log('\n🎉 Test completed successfully!');
      console.log(`🎬 NFT character video created: ${videoPath}`);
    } else {
      console.log('\n⏰ Test timed out - check task status later');
    }
  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

// Run the test
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { KlingTestClient, testMultiImageVideo };