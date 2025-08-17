import { LumaAI } from 'lumaai';

export interface VideoGenerationOptions {
  prompt: string;
  model?: 'ray-flash-2' | 'ray-2' | 'ray-1-6';
  resolution?: '540p' | '720p' | '1080p' | '4k';
  duration?: '5s' | '10s';
}

export interface VideoGenerationResult {
  id: string;
  status: 'pending' | 'dreaming' | 'completed' | 'failed';
  videoUrl?: string;
  failureReason?: string;
}

export class VideoService {
  private client: LumaAI;

  constructor() {
    if (!process.env.LUMAAI_API_KEY) {
      throw new Error('LUMAAI_API_KEY environment variable is required');
    }
    
    this.client = new LumaAI({
      authToken: process.env.LUMAAI_API_KEY
    });
  }

  async generateVideo(options: VideoGenerationOptions): Promise<VideoGenerationResult> {
    try {
      const generation = await this.client.generations.create({
        prompt: options.prompt,
        model: options.model || 'ray-flash-2',
        resolution: options.resolution || '720p',
        duration: options.duration || '5s'
      });

      return {
        id: generation.id,
        status: this.mapStatus(generation.state || 'pending')
      };
    } catch (error) {
      console.error('Video generation failed:', error);
      throw new Error(`Failed to start video generation: ${error}`);
    }
  }

  async getGenerationStatus(id: string): Promise<VideoGenerationResult> {
    try {
      const generation = await this.client.generations.get(id);
      
      return {
        id: generation.id,
        status: this.mapStatus(generation.state || 'pending'),
        videoUrl: generation.assets?.video,
        failureReason: generation.failure_reason
      };
    } catch (error) {
      console.error('Failed to get generation status:', error);
      throw new Error(`Failed to get generation status: ${error}`);
    }
  }

  async waitForCompletion(id: string, maxWaitTime = 300000): Promise<VideoGenerationResult> {
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