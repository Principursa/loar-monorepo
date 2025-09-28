import * as fal from "@fal-ai/serverless-client";

export interface FalImageGenerationOptions {
  prompt: string;
  model?: 'fal-ai/nano-banana' | 'fal-ai/flux/dev' | 'fal-ai/flux-pro' | 'fal-ai/flux/schnell';
  negativePrompt?: string;
  imageSize?: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9';
  numInferenceSteps?: number;
  guidanceScale?: number;
  numImages?: number;
  seed?: number;
  enableSafetyChecker?: boolean;
}

export interface FalImageEditOptions {
  prompt: string;
  imageUrls: string[];
  numImages?: number;
  strength?: number;
  negativePrompt?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
  seed?: number;
  enableSafetyChecker?: boolean;
}

export interface FalImageToImageOptions {
  prompt: string;
  imageUrls: string[];
  negativePrompt?: string;
  imageSize?: 'square_hd' | 'square' | 'portrait_4_3' | 'portrait_16_9' | 'landscape_4_3' | 'landscape_16_9' | { width: number; height: number };
  numImages?: number;
  seed?: number;
}

export interface FalImageGenerationResult {
  id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  imageUrl?: string;
  images?: Array<{ url: string; width?: number; height?: number; content_type?: string }>;
  seed?: number;
  error?: string;
}

export interface FalVideoGenerationOptions {
  prompt: string;
  model?: 'fal-ai/hunyuan-video' | 'fal-ai/ltx-video' | 'fal-ai/cogvideox-5b' | 'fal-ai/runway-gen3' | 'fal-ai/veo3/fast/image-to-video' | 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video' | 'fal-ai/wan-25-preview/image-to-video';
  imageUrl?: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  aspectRatio?: string;
  motionStrength?: number;
  negativePrompt?: string;
  cfgScale?: number;
  resolution?: '720p' | '1080p';
  enablePromptExpansion?: boolean;
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

  async generateImage(options: FalImageGenerationOptions): Promise<FalImageGenerationResult> {
    console.log('🎨 === FAL IMAGE GENERATION ===');
    console.log('Options:', JSON.stringify(options, null, 2));

    try {
      const model = options.model || 'fal-ai/nano-banana';

      const input: any = { prompt: options.prompt };
      if (options.negativePrompt) input.negative_prompt = options.negativePrompt;
      if (options.imageSize) input.image_size = options.imageSize;
      if (options.numInferenceSteps) input.num_inference_steps = options.numInferenceSteps;
      if (options.guidanceScale) input.guidance_scale = options.guidanceScale;
      if (options.numImages) input.num_images = options.numImages;
      if (options.seed) input.seed = options.seed;
      if (options.enableSafetyChecker !== undefined) input.enable_safety_checker = options.enableSafetyChecker;

      console.log(`🚀 Calling FAL API: ${model}`);
      console.log('Input:', JSON.stringify(input, null, 2));

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => console.log('📊 FAL Queue Update:', update)
      });

      console.log('📥 Raw FAL Response:', JSON.stringify(result, null, 2));

      // Parse the response
      let data: any;
      if ((result as any).data) data = (result as any).data;
      else if ((result as any).images || (result as any).image) data = result;
      else throw new Error(`No data in FAL response. Available keys: ${Object.keys(result as any).join(', ')}`);

      // Extract images
      let images: Array<{ url: string; width?: number; height?: number; content_type?: string }> = [];
      if (data.images && Array.isArray(data.images)) images = data.images;
      else if (data.image) images = [{ url: data.image }];
      else if (typeof data === 'string') images = [{ url: data }];
      else if (data.url) images = [{ url: data.url }];

      if (images.length === 0 || !images[0]?.url) {
        throw new Error(`No image URLs found. Response keys: ${Object.keys(data).join(', ')}`);
      }

      return {
        id: (result as any).requestId || Date.now().toString(),
        status: 'completed',
        imageUrl: images[0].url,
        images,
        seed: data.seed
      };
    } catch (error) {
      console.error('❌ FAL Image Generation Failed:', error);
      return {
        id: Date.now().toString(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async editImage(options: FalImageEditOptions): Promise<FalImageGenerationResult> {
    console.log('✏️ === FAL IMAGE EDITING ===');
    console.log('Options:', JSON.stringify(options, null, 2));

    try {
      const model = 'fal-ai/nano-banana/edit';
      const input: any = {
        prompt: options.prompt,
        image_urls: options.imageUrls,
        num_images: options.numImages || 1,
        output_format: "png",
        sync_mode: false
      };

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => console.log('📊 FAL Edit Queue Update:', update)
      });

      let responseData: any;
      if ((result as any).data) responseData = (result as any).data;
      else if ((result as any).images) responseData = result;
      else throw new Error(`Unexpected FAL response structure. Keys: ${Object.keys(result as any).join(', ')}`);

      if (!responseData.images || !Array.isArray(responseData.images)) {
        throw new Error(`Expected 'images' array in response. Got keys: ${Object.keys(responseData).join(', ')}`);
      }

      const images = responseData.images;
      if (images.length === 0 || !images[0]?.url) {
        throw new Error('Images array is empty or missing URLs');
      }

      return {
        id: (result as any).requestId || Date.now().toString(),
        status: 'completed',
        imageUrl: images[0].url,
        images,
        seed: responseData.seed
      };
    } catch (error) {
      console.error('❌ FAL Image Edit Failed:', error);
      return {
        id: Date.now().toString(),
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async imageToImage(options: FalImageToImageOptions): Promise<FalImageGenerationResult> {
    console.log('🖼️ === FAL IMAGE TO IMAGE ===');
    console.log('Options:', JSON.stringify(options, null, 2));

    try {
      const model = 'fal-ai/qwen-image-edit-plus';
      const input: any = {
        prompt: options.prompt,
        image_urls: options.imageUrls,
        num_images: options.numImages || 1,
      };

      if (options.negativePrompt) {
        input.negative_prompt = options.negativePrompt;
      }

      if (options.imageSize) {
        input.image_size = options.imageSize;
      }

      if (options.seed !== undefined) {
        input.seed = options.seed;
      }

      console.log('Final input for FAL Image-to-Image:', JSON.stringify(input, null, 2));

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      });

      console.log('📥 Raw FAL Image-to-Image Response:', JSON.stringify(result, null, 2));

      // Handle response structure - try different possible structures
      const resultAny = result as any;
      console.log('Result keys:', Object.keys(resultAny));

      let imageUrl: string | undefined;
      let images: Array<{ url: string; width?: number; height?: number; content_type?: string }> = [];

      // Try different response structures
      if (resultAny.data && resultAny.data.images && Array.isArray(resultAny.data.images)) {
        images = resultAny.data.images;
        imageUrl = images[0]?.url;
      } else if (resultAny.images && Array.isArray(resultAny.images)) {
        images = resultAny.images;
        imageUrl = images[0]?.url;
      } else if (resultAny.data && resultAny.data.image) {
        imageUrl = resultAny.data.image;
        if (imageUrl) images = [{ url: imageUrl }];
      } else if (resultAny.image) {
        imageUrl = resultAny.image;
        if (imageUrl) images = [{ url: imageUrl }];
      } else if (resultAny.url) {
        imageUrl = resultAny.url;
        if (imageUrl) images = [{ url: imageUrl }];
      }

      if (!imageUrl) {
        console.error('No image URL found in response');
        console.error('Available keys:', Object.keys(resultAny));
        if (resultAny.data) {
          console.error('Data keys:', Object.keys(resultAny.data));
        }
        throw new Error('No image URL found in FAL image-to-image response');
      }

      return {
        id: resultAny.requestId || Date.now().toString(),
        status: 'completed',
        imageUrl: imageUrl,
        images: images
      };
    } catch (error) {
      console.error('🚨 Fal AI image-to-image failed:', error);

      // Log detailed error information
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }

      // If it's a response error, log the response details
      if ((error as any).response) {
        console.error('Response status:', (error as any).response.status);
        console.error('Response data:', (error as any).response.data);
      }

      return {
        id: '',
        status: 'failed',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  async generateVideo(options: FalVideoGenerationOptions): Promise<FalVideoGenerationResult> {
    try {
      const model = options.model || 'fal-ai/ltx-video';
      const input: any = { prompt: options.prompt };

      if (model === 'fal-ai/veo3/fast/image-to-video') {
        if (!options.imageUrl) throw new Error('Image URL is required for Veo3 image-to-video model');
        input.image_url = options.imageUrl;
        input.duration = options.duration || 5;
        input.aspect_ratio = options.aspectRatio || "16:9";
        input.motion_strength = options.motionStrength || 127;
      } else if (model === 'fal-ai/wan-25-preview/image-to-video') {
        if (!options.imageUrl) throw new Error('Image URL is required for wan25 image-to-video model');
        input.image_url = options.imageUrl;
        input.duration = String(options.duration || 5);
        input.resolution = options.resolution || "1080p";
        if (options.negativePrompt) input.negative_prompt = options.negativePrompt;
        if (options.enablePromptExpansion !== undefined) input.enable_prompt_expansion = options.enablePromptExpansion;
      } else if (model === 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video') {
        if (!options.imageUrl) throw new Error('Image URL is required for kling v2.5 turbo model');
        input.image_url = options.imageUrl;
        input.duration = String(options.duration || 5);
        input.aspect_ratio = options.aspectRatio || "16:9";
        if (options.negativePrompt) input.negative_prompt = options.negativePrompt;
        if (options.cfgScale !== undefined) input.cfg_scale = options.cfgScale;
      } else {
        input.duration = options.duration || 5;
        input.fps = options.fps || 25;
        input.width = options.width || 768;
        input.height = options.height || 512;
        input.guidance_scale = options.guidanceScale || 3;
        input.num_inference_steps = options.numInferenceSteps || 30;
        if (options.imageUrl) input.image_url = options.imageUrl;
      }

      console.log(`Starting Fal AI video generation with model: ${model}`);
      console.log('Input parameters:', JSON.stringify(input, null, 2));

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => console.log('Fal AI queue update:', update)
      });

      console.log('📥 Raw FAL Video Response:', JSON.stringify(result, null, 2));

      // Handle different response structures
      let data: any;
      let videoUrl: string | undefined;

      if ((result as any).data) {
        data = (result as any).data;
        // Try different possible video URL locations
        videoUrl = data.video?.url || data.video_url || data.url;
      } else if ((result as any).video) {
        videoUrl = (result as any).video.url || (result as any).video;
      } else if ((result as any).url) {
        videoUrl = (result as any).url;
      }

      if (!videoUrl) {
        console.error('No video URL found in response. Available keys:', Object.keys(result as any));
        if (data) {
          console.error('Data keys:', Object.keys(data));
        }
        throw new Error('No video URL found in FAL response');
      }

      return {
        id: (result as any).requestId || Date.now().toString(),
        status: 'completed',
        videoUrl: videoUrl
      };
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
      const result = await fal.queue.status(id, { requestId: id, logs: true });

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
