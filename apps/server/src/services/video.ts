import { LumaAI } from 'lumaai';

export interface VideoGenerationOptions {
  prompt: string;
  model?: 'ray-flash-2' | 'ray-2' | 'ray-1-6';
  resolution?: '540p' | '720p' | '1080p' | '4k';
  duration?: '5s' | '10s';
  imageUrl?: string; // For image-to-video generation
}

export interface VideoGenerationResult {
  id: string;
  status: 'pending' | 'dreaming' | 'completed' | 'failed';
  videoUrl?: string;
  failureReason?: string;
}

export class VideoService {
  private client: LumaAI | null;

  constructor() {
    // Make API key optional for frontend development
    if (!process.env.LUMAAI_API_KEY) {
      console.warn('LUMAAI_API_KEY not set - video generation will be disabled');
      this.client = null;
    } else {
      this.client = new LumaAI({
        authToken: process.env.LUMAAI_API_KEY
      });
    }
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    if (!this.client) {
      throw new Error('LumaAI client not initialized - API key required');
    }
    
    try {
      const generationParams: any = {
        prompt: options.prompt,
        model: options.model || 'ray-flash-2' // Use ray-flash-2 for low quality/fast generation
      };

      // Add keyframes for image-to-video generation
      if (options.imageUrl) {
        console.log('Adding keyframes for image-to-video generation:', {
          imageUrl: options.imageUrl,
          prompt: options.prompt
        });
        
        // Handle different types of image URLs
        let proxyUrl = options.imageUrl;
        
        if (options.imageUrl.includes('seadn.io') || options.imageUrl.includes('opensea.io')) {
          proxyUrl = `https://images.weserv.nl/?url=${encodeURIComponent(options.imageUrl)}`;
          console.log('Using weserv proxy for OpenSea image:', proxyUrl);
        }
        
        generationParams.keyframes = {
          frame0: {
            type: "image",
            url: proxyUrl
          }
        };
        console.log('Using image-to-video mode - excluding resolution and duration');
      } else {
        // Only add these for text-to-video
        generationParams.resolution = options.resolution || '720p';
        generationParams.duration = options.duration || '5s';
        console.log('Using text-to-video mode - including resolution and duration');
      }

      console.log('Sending to LumaAI:', JSON.stringify(generationParams, null, 2));

      const generation = await this.client.generations.create(generationParams);

      return {
        id: generation.id || '',
        status: this.mapStatus(generation.state ?? 'pending')
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error(`Failed to start video generation: ${error}`);
    }
  }

  async getGenerationStatus(id: string): Promise<VideoGenerationResult> {
    if (!this.client) {
      throw new Error('LumaAI client not initialized - API key required');
    }
    
    try {
      const generation = await this.client.generations.get(id);
      
      return {
        id: generation.id || '',
        status: this.mapStatus(generation.state ?? 'pending'),
        videoUrl: generation.assets?.video,
        failureReason: generation.failure_reason
      };
    } catch (error) {
      console.error('Failed to get generation status:', error);
      throw new Error(`Failed to get generation status: ${error}`);
    }
  }

  async waitForCompletion(id: string, maxWaitTime = 300000): Promise<VideoGenerationResult> {
    if (!this.client) {
      throw new Error('LumaAI client not initialized - API key required');
    }
    
    const startTime = Date.now();
    
    while (Date.now() - startTime < maxWaitTime) {
      const result = await this.getGenerationStatus(id);
      
      if (result.status === 'completed') {
        return result;
      } else if (result.status === 'failed') {
        throw new Error(`Video generation failed: ${result.failureReason}`);
      }
      
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
    
    throw new Error('Video generation timed out');
  }

  private mapStatus(lumaStatus: string): VideoGenerationResult['status'] {
    switch (lumaStatus) {
      case 'completed':
        return 'completed';
      case 'failed':
        return 'failed';
      case 'queued':
      case 'dreaming':
        return 'dreaming';
      default:
        return 'pending';
    }
  }
}

export const videoService = new VideoService();