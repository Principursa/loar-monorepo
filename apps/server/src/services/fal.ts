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
  model?: 'fal-ai/hunyuan-video' | 'fal-ai/ltx-video' | 'fal-ai/cogvideox-5b' | 'fal-ai/runway-gen3' | 'fal-ai/veo3/fast/image-to-video' | 'fal-ai/kling-video/v2.5-turbo/pro/image-to-video' | 'fal-ai/wan-25-preview/image-to-video' | 'fal-ai/sora-2/image-to-video';
  imageUrl?: string;
  duration?: number;
  fps?: number;
  width?: number;
  height?: number;
  guidanceScale?: number;
  numInferenceSteps?: number;
  aspectRatio?: string; // can be "16:9", "9:16", "1:1", or "auto"
  motionStrength?: number;
  negativePrompt?: string;
  cfgScale?: number;
  resolution?: '720p' | '1080p' | 'auto';
  enablePromptExpansion?: boolean;
  generateAudio?: boolean; // New: for veo3 audio generation
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
    console.log('🖼️ === FAL IMAGE TO IMAGE (Nano Banana Edit) ===');
    console.log('Options:', JSON.stringify(options, null, 2));

    try {
      const model = 'fal-ai/nano-banana/edit';
      
      // Map image size to aspect ratio for nano banana
      const mapImageSizeToAspectRatio = (imageSize?: string | { width: number; height: number }): string | undefined => {
        if (!imageSize || typeof imageSize === 'object') return undefined;
        
        const mapping: Record<string, string> = {
          'landscape_16_9': '16:9',
          'portrait_16_9': '9:16',
          'landscape_4_3': '4:3',
          'portrait_4_3': '3:4',
          'landscape_2_3': '2:3',
          'portrait_2_3': '3:2',
          'square': '1:1',
          'square_hd': '1:1',
        };
        
        return mapping[imageSize];
      };

      // Validate and process image URLs
      console.log('Processing image URLs:', options.imageUrls);
      const validImageUrls: string[] = [];
      
      for (const url of options.imageUrls) {
        if (!url || typeof url !== 'string' || url.trim() === '') {
          console.warn('Skipping empty URL');
          continue;
        }

        const trimmedUrl = url.trim();
        
        // Check if it's a data URI (base64)
        if (trimmedUrl.startsWith('data:')) {
          console.log('✅ Data URI detected');
          validImageUrls.push(trimmedUrl);
          continue;
        }
        
        // Check if it's a valid URL
        try {
          new URL(trimmedUrl);
          console.log('✅ Valid URL:', trimmedUrl.substring(0, 80) + '...');
          validImageUrls.push(trimmedUrl);
        } catch (urlError) {
          console.warn('⚠️ Invalid URL format, skipping');
        }
      }

      if (validImageUrls.length === 0) {
        throw new Error('No valid image URLs provided');
      }

      // Map aspect ratio if provided
      const aspectRatio = mapImageSizeToAspectRatio(options.imageSize);

      const input: any = {
        prompt: options.prompt,
        image_urls: validImageUrls,
        num_images: options.numImages || 1,
        output_format: 'jpeg',
      };

      // Only add aspect_ratio if it's provided (as per API docs)
      if (aspectRatio) {
        input.aspect_ratio = aspectRatio;
      }

      console.log('📤 Sending to Nano Banana Edit with input:', JSON.stringify(input, null, 2));

      const result = await fal.subscribe(model, {
        input,
        logs: true,
        onQueueUpdate: (update) => {
          if (update.status === "IN_PROGRESS") {
            update.logs.map((log) => log.message).forEach(console.log);
          }
        }
      });

      console.log('📥 Raw Nano Banana Edit Response:', JSON.stringify(result, null, 2));

      // Parse response using same strategy as generateImage (which works!)
      let data: any;
      if ((result as any).data) {
        data = (result as any).data;
      } else if ((result as any).images) {
        data = result;
      } else {
        throw new Error(`No data in FAL response. Available keys: ${Object.keys(result as any).join(', ')}`);
      }

      // Extract images using same strategy as generateImage
      let images: Array<{ url: string; width?: number; height?: number; content_type?: string }> = [];
      if (data.images && Array.isArray(data.images)) {
        images = data.images;
      } else if (data.image) {
        images = [{ url: data.image }];
      } else if (typeof data === 'string') {
        images = [{ url: data }];
      } else if (data.url) {
        images = [{ url: data.url }];
      }

      if (images.length === 0 || !images[0]?.url) {
        throw new Error(`No image URLs found. Response keys: ${Object.keys(data).join(', ')}`);
      }

      console.log('✅ Successfully extracted image:', images[0].url.substring(0, 80) + '...');
      if (data.description) {
        console.log('📝 AI Description:', data.description);
      }

      return {
        id: (result as any).requestId || Date.now().toString(),
        status: 'completed',
        imageUrl: images[0].url,
        images,
        seed: data.seed
      };
    } catch (error) {
      console.error('❌ Nano Banana Edit Failed:', error);
      return {
        id: Date.now().toString(),
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
        
        console.log('🔧 Building Veo3 input...');
        
        input.image_url = options.imageUrl;
        
        // Veo3 only supports 8s duration
        input.duration = "8s";
        console.log('Using duration: 8s (Veo3 requirement)');
        
        // If aspect_ratio is provided and NOT "auto", use it
        // Otherwise let Veo3 auto-detect from image
        if (options.aspectRatio && options.aspectRatio !== "auto") {
          input.aspect_ratio = options.aspectRatio;
          console.log(`Using aspect ratio: ${options.aspectRatio}`);
        } else {
          // For veo3, omit aspect_ratio to let it auto-detect
          // or explicitly set to "auto"
          input.aspect_ratio = "auto";
          console.log('Using auto aspect ratio');
        }
        
        // Resolution for veo3 - defaults to 720p
        // Only include if specified
        if (options.resolution) {
          input.resolution = options.resolution;
          console.log(`Using resolution: ${options.resolution}`);
        }
        
        // Generate audio (optional) - only include if explicitly set
        if (options.generateAudio === true) {
          input.generate_audio = true;
          console.log('Audio generation enabled');
        }
        
        console.log('✅ Veo3 input prepared:', JSON.stringify(input, null, 2));
        
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
      } else if (model === 'fal-ai/sora-2/image-to-video') {
        if (!options.imageUrl) throw new Error('Image URL is required for Sora 2 image-to-video model');
        input.image_url = options.imageUrl;

        // Sora-specific parameters
        input.duration = options.duration || 4; // Default to 4 seconds as shown in docs
        if (options.aspectRatio && options.aspectRatio !== "auto") {
          input.aspect_ratio = options.aspectRatio;
        } else {
          input.aspect_ratio = "auto";
        }
        if (options.resolution && options.resolution !== "auto") {
          input.resolution = options.resolution;
        } else {
          input.resolution = "auto";
        }
        // Sora can generate audio naturally from prompts if needed
      } else {
        input.duration = options.duration || 5;
        input.fps = options.fps || 25;
        input.width = options.width || 768;
        input.height = options.height || 512;
        input.guidance_scale = options.guidanceScale || 3;
        input.num_inference_steps = options.numInferenceSteps || 30;
        if (options.imageUrl) input.image_url = options.imageUrl;
      }

      console.log(`🎬 Calling FAL API: ${model}`);
      console.log('📤 Final input:', JSON.stringify(input, null, 2));

      let result;
      try {
        result = await fal.subscribe(model, {
          input,
          logs: true,
          onQueueUpdate: (update) => {
            console.log('📊 Status:', update.status);
            if (update.status === "IN_PROGRESS" && update.logs) {
              update.logs.map((log: any) => log.message).forEach(console.log);
            }
          }
        });
      } catch (subscribeError: any) {
        console.error('❌ Subscribe error:', subscribeError.constructor.name);
        console.error('Status:', subscribeError.status, subscribeError.statusText);
        
        // Helper to check for binary data
        const hasBinaryData = (str: string): boolean => {
          if (str.length > 500) return true;
          const binaryIndicators = ['iVBOR', 'base64', '/9j/', 'data:image'];
          return binaryIndicators.some(ind => str.includes(ind));
        };
        
        // Extract clean message from detail
        let cleanMessage = '';
        if (subscribeError.body?.detail) {
          if (Array.isArray(subscribeError.body.detail)) {
            // Extract messages from validation error array, filtering out binary data
            const messages = subscribeError.body.detail
              .map((err: any) => {
                if (err.msg && typeof err.msg === 'string' && !hasBinaryData(err.msg)) {
                  return err.msg;
                }
                if (err.loc && Array.isArray(err.loc)) {
                  return `Validation error in ${err.loc.join('.')}`;
                }
                return null;
              })
              .filter(Boolean);
            
            if (messages.length > 0) {
              cleanMessage = messages.join('; ');
            }
          } else if (typeof subscribeError.body.detail === 'string' && !hasBinaryData(subscribeError.body.detail)) {
            cleanMessage = subscribeError.body.detail;
          }
        }
        
        // Build enhanced error
        const enhancedError = new Error();
        if (cleanMessage) {
          enhancedError.message = cleanMessage;
          console.error('Clean error message:', cleanMessage);
        } else if (subscribeError.statusText) {
          enhancedError.message = `${subscribeError.statusText}: Request failed`;
          console.error('Using statusText:', enhancedError.message);
        } else {
          enhancedError.message = subscribeError.message || 'Video generation request failed';
          console.error('Using original message');
        }
        
        // Preserve other error properties
        Object.assign(enhancedError, {
          status: subscribeError.status,
          statusText: subscribeError.statusText,
          body: subscribeError.body
        });
        
        throw enhancedError;
      }

      console.log('📥 Video generation completed!');

      // Parse response - FAL returns result.data
      const resultAny = result as any;
      const data = resultAny.data || resultAny;

      console.log('Response structure:', {
        hasData: !!resultAny.data,
        dataKeys: Object.keys(data).join(', ')
      });

      // Try different possible video URL locations
      let videoUrl: string | undefined;
      
      if (data.video?.url) {
        videoUrl = data.video.url;
      } else if (data.video_url) {
        videoUrl = data.video_url;
      } else if (data.url) {
        videoUrl = data.url;
      } else if (typeof data.video === 'string') {
        videoUrl = data.video;
      }

      if (!videoUrl) {
        console.error('❌ No video URL in response');
        console.error('Available data:', JSON.stringify(data, null, 2));
        throw new Error(`No video URL found. Response keys: ${Object.keys(data).join(', ')}`);
      }

      console.log('✅ Video generated:', videoUrl.substring(0, 100) + '...');

      return {
        id: resultAny.requestId || Date.now().toString(),
        status: 'completed',
        videoUrl: videoUrl
      };
    } catch (error: any) {
      console.error('❌ Video generation failed');
      console.error('Error type:', error.constructor.name);
      
      // Helper function to check if a string contains base64 or binary data
      const containsBinaryData = (str: string): boolean => {
        if (str.length > 500) return true;
        // Check for common base64/binary indicators
        const binaryIndicators = ['iVBOR', 'base64', '/9j/', 'data:image', 'AAAABmJLR0Q'];
        return binaryIndicators.some(indicator => str.includes(indicator));
      };
      
      // Helper function to extract clean error message from validation error object
      const extractCleanMessage = (err: any): string => {
        // Try to get the message field
        if (err.msg && typeof err.msg === 'string' && !containsBinaryData(err.msg)) {
          return err.msg;
        }
        if (err.message && typeof err.message === 'string' && !containsBinaryData(err.message)) {
          return err.message;
        }
        // If the error has a loc (location) field, it's a validation error
        if (err.loc && Array.isArray(err.loc)) {
          return `Validation error in ${err.loc.join('.')}`;
        }
        return 'Invalid input data';
      };
      
      // Extract meaningful error message
      let errorMessage = 'Video generation failed';
      
      // Check for validation errors in error.body.detail
      if (error.body?.detail) {
        console.error('API returned detail field');
        
        // FAL API returns validation errors in various formats
        if (Array.isArray(error.body.detail)) {
          // Array of validation errors - extract clean messages only
          const cleanMessages = error.body.detail
            .map((err: any) => extractCleanMessage(err))
            .filter((msg: string) => msg && msg !== 'Invalid input data');
          
          if (cleanMessages.length > 0) {
            errorMessage = cleanMessages.join('; ');
          } else {
            errorMessage = 'Invalid input data provided to video generation API';
          }
        } else if (typeof error.body.detail === 'string') {
          // String detail - check if it contains binary data
          if (!containsBinaryData(error.body.detail)) {
            errorMessage = error.body.detail;
          } else {
            errorMessage = 'Invalid input data provided to video generation API';
          }
        } else if (typeof error.body.detail === 'object') {
          // Object detail - try to extract useful info
          const msg = extractCleanMessage(error.body.detail);
          if (msg !== 'Invalid input data') {
            errorMessage = msg;
          } else {
            errorMessage = 'Invalid input data provided to video generation API';
          }
        }
      } else if (error.message && typeof error.message === 'string') {
        if (!containsBinaryData(error.message)) {
          errorMessage = error.message;
        }
      }
      
      // Final check - if error message still contains binary data or is too long, use generic message
      if (containsBinaryData(errorMessage)) {
        console.error('⚠️ Filtered out binary/base64 data from error message');
        errorMessage = 'Video generation failed due to invalid input data. This may be caused by unlicensed characters, invalid image format, or API limitations. Please verify your inputs and try again.';
      }
      
      // Check for common error patterns and make them user-friendly
      if (errorMessage.toLowerCase().includes('unprocessable entity')) {
        errorMessage = 'The video generation request could not be processed. This may be due to unlicensed characters, invalid image format, or API limitations. Please check your inputs and try again.';
      } else if (errorMessage.toLowerCase().includes('unlicensed') || errorMessage.toLowerCase().includes('license')) {
        errorMessage = 'Video generation failed: The request includes unlicensed characters or content. Please ensure all characters are properly licensed.';
      } else if (errorMessage.toLowerCase().includes('image') && errorMessage.toLowerCase().includes('url')) {
        errorMessage = 'Invalid image URL provided. Please check that the image is accessible and in a supported format.';
      }
      
      // Truncate very long error messages as a final safeguard
      if (errorMessage.length > 300) {
        errorMessage = errorMessage.substring(0, 297) + '...';
      }
      
      // Log clean error for debugging
      console.error('📤 Returning error to client:', errorMessage);
      
      return {
        id: '',
        status: 'failed',
        error: errorMessage
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
