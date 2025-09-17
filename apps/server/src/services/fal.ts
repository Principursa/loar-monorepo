import * as fal from "@fal-ai/serverless-client";

export interface FalVideoGenerationOptions {
  prompt: string;
  model?: 'fal-ai/hunyuan-video' | 'fal-ai/ltx-video' | 'fal-ai/cogvideox-5b' | 'fal-ai/runway-gen3' | 'fal-ai/veo3/fast/image-to-video';
  imageUrl?: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  aspectRatio?: string;
  motionStrength?: number;
}

export interface FalVideoGenerationResult {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  videoUrl?: string;
  error?: string;
}

export class FalService {
  constructor() {
    if (!process.env.FAL_KEY) {
      throw new Error('FAL_KEY environment variable is required');
    }
    
    fal.config({
      credentials: process.env.FAL_KEY
    });
  }

  async generateVideo(options: FalVideoGenerationOptions): Promise<FalVideoGenerationResult> {
    try {
      const model = options.model || 'fal-ai/ltx-video';
      
      const input: any = {
        prompt: options.prompt
      };

      // Configure input based on model type
      if (model === 'fal-ai/veo3/fast/image-to-video') {
        // Veo3 specific parameters
        if (!options.imageUrl) {
          throw new Error('Image URL is required for Veo3 image-to-video model');
        }
        input.image_url = options.imageUrl;
        input.duration = options.duration || 5; // 5 or 10 seconds
        input.aspect_ratio = options.aspectRatio || "16:9"; // "16:9", "9:16", "1:1"
        input.motion_strength = options.motionStrength || 127; // 1-255, default 127
      } else {
        // Other models' parameters
        input.duration = options.duration || 5;
        input.fps = options.fps || 25;
        input.width = options.width || 768;
        input.height = options.height || 512;
        input.guidance_scale = options.guidanceScale || 3;
        input.num_inference_steps = options.numInferenceSteps || 30;
        
        // Add image input if provided
        if (options.imageUrl) {
          input.image_url = options.imageUrl;
        }
      }

      console.log(`Starting Fal AI video generation with model: ${model}`);
      console.log('Input parameters:', JSON.stringify(input, null, 2));

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          console.log('Fal AI queue update:', update);
        }
      });

      if (result.data) {
        return {
          id: result.requestId || '',
          status: 'completed',
          videoUrl: (result.data as any).video?.url
        };
      } else {
        throw new Error('No video data returned from Fal AI');
      }
    } catch (error) {
      console.error('Fal AI video generation failed:', error);
      return {
        id: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getGenerationStatus(id: string): Promise<FalVideoGenerationResult> {
    try {
      const result = await fal.queue.status(id, { logs: true });
      
      return {
        id,
        status: this.mapStatus((result as any).status),
        videoUrl: (result as any).response_url,
        error: (result as any).status === 'FAILED' ? 'Generation failed' : undefined
      };
    } catch (error) {
      console.error('Failed to get Fal AI generation status:', error);
      return {
        id,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private mapStatus(falStatus: string): FalVideoGenerationResult['status'] {
    switch (falStatus) {
      case 'COMPLETED':
        return 'completed';
      case 'FAILED':
        return 'failed';
      case 'IN_PROGRESS':
        return 'in_progress';
      case 'IN_QUEUE':
      default:
        return 'pending';
    }
  }
}

export const falService = new FalService();