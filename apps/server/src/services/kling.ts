export interface KlingImageInput {
  image: string; // Base64 or URL
}

export interface KlingMultiImageOptions {
  image_list: KlingImageInput[];
  prompt?: string;
  negative_prompt?: string;
  mode?: 'std' | 'pro';
  duration?: '5' | '10';
  aspect_ratio?: '16:9' | '9:16' | '1:1';
  model_name?: 'kling-v1-6';
  callback_url?: string;
  external_task_id?: string;
}

export interface KlingTaskResponse {
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

export class KlingService {
  private accessKey: string;
  private secretKey: string;
  private baseUrl = 'https://api-singapore.klingai.com/v1';

  constructor() {
    // Make API keys optional for frontend development
    if (!process.env.KLING_ACCESS_KEY || !process.env.KLING_SECRET_KEY) {
      console.warn('KLING_ACCESS_KEY and KLING_SECRET_KEY not set - Kling video generation will be disabled');
      this.accessKey = '';
      this.secretKey = '';
    } else {
      this.accessKey = process.env.KLING_ACCESS_KEY;
      this.secretKey = process.env.KLING_SECRET_KEY;
    }
  }

  private generateJWTToken(): string {
    const jwt = require('jsonwebtoken');
    
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
    if (!this.accessKey || !this.secretKey) {
      throw new Error('Kling API keys not configured - service disabled');
    }
    
    console.log('🎬 Starting Kling Multi-Image to Video Generation\n');
    
    if (!options.image_list || options.image_list.length === 0) {
      throw new Error('At least one image is required');
    }

    if (options.image_list.length > 4) {
      throw new Error('Maximum 4 images allowed');
    }

    console.log('🖼️ Using NFT character images:');
    options.image_list.forEach((imageInput, index) => {
      console.log(`  ${index + 1}. ${imageInput.image}`);
    });
    console.log();

    // Use images directly for Kling AI (no need to convert to base64)
    console.log('🖼️ Using images directly for Kling AI...');
    const processedImageList = options.image_list;

    const payload = {
      model_name: options.model_name || 'kling-v1-6',
      image_list: processedImageList,
      prompt: options.prompt,
      negative_prompt: options.negative_prompt,
      mode: options.mode || 'std', // Use cheapest mode by default
      duration: options.duration || '5', // Use shortest duration by default
      aspect_ratio: options.aspect_ratio || '16:9',
      callback_url: options.callback_url,
      external_task_id: options.external_task_id || `nft_flow_${Date.now()}`
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

      console.log(`✅ Generation started successfully!`);
      console.log(`📝 Task ID: ${result.data.task_id}`);
      console.log(`📊 Status: ${result.data.task_status}`);
      console.log(`⏰ Created at: ${new Date(result.data.created_at).toISOString()}\n`);

      return result;
    } catch (error) {
      console.error('Kling multi-image video creation failed:', error);
      throw new Error(`Failed to create multi-image video: ${error}`);
    }
  }

  async getTaskStatus(taskId: string): Promise<KlingTaskResponse> {
    if (!this.accessKey || !this.secretKey) {
      throw new Error('Kling API keys not configured - service disabled');
    }
    
    try {
      console.log(`🔄 Checking Kling status for task: ${taskId}...`);
      
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

      console.log(`📊 Status: ${result.data.task_status}`);
      if (result.data.task_status_msg) {
        console.log(`💬 Message: ${result.data.task_status_msg}`);
      }

      if (result.data.task_status === 'succeed') {
        console.log('🎉 Generation completed successfully!\n');
        if (result.data.task_result?.videos?.length) {
          const video = result.data.task_result.videos[0];
          console.log(`🎥 Video Details:`);
          console.log(`   ID: ${video.id}`);
          console.log(`   Duration: ${video.duration}`);
          console.log(`   URL: ${video.url}`);
        }
      } else if (result.data.task_status === 'failed') {
        console.log(`❌ Generation failed: ${result.data.task_status_msg}`);
      } else {
        console.log(`⏳ Status: ${result.data.task_status}... waiting...\n`);
      }

      return result;
    } catch (error) {
      console.error('Failed to get Kling task status:', error);
      throw new Error(`Failed to get task status: ${error}`);
    }
  }

  async waitForCompletion(taskId: string, maxWaitTime = 300000): Promise<KlingTaskResponse> {
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getTaskStatus(taskId);
      
      if (result.data.task_status === 'succeed') {
        return result;
      } else if (result.data.task_status === 'failed') {
        throw new Error(`Video generation failed: ${result.data.task_status_msg}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    }
    
    throw new Error('Video generation timed out');
  }

  async getAllTasks(pageNum = 1, pageSize = 30): Promise<KlingTaskResponse[]> {
    try {
      const response = await fetch(`${this.baseUrl}/videos/multi-image2video?pageNum=${pageNum}&pageSize=${pageSize}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.generateJWTToken()}`
        }
      });

      if (!response.ok) {
        throw new Error(`Kling API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.code !== 0) {
        throw new Error(`Kling API error: ${result.message}`);
      }

      return result.data;
    } catch (error) {
      console.error('Failed to get Kling tasks:', error);
      throw new Error(`Failed to get tasks: ${error}`);
    }
  }
}

export const klingService = new KlingService();