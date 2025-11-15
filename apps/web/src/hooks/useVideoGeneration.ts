/**
 * Video Generation Hook
 *
 * Handles video generation using multiple AI models (Veo3, Kling, Wan25, Sora).
 * Supports both text-to-video and image-to-video generation.
 */

import { useState, useCallback } from 'react';
import { useMutation } from '@tanstack/react-query';
import { trpcClient } from '@/utils/trpc';

export type VideoModel = 'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora';
export type VideoRatio = '16:9' | '9:16' | '1:1';

export interface StatusMessage {
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface UseVideoGenerationProps {
  videoDescription: string;
  selectedVideoModel: VideoModel;
  selectedVideoDuration: number;
  videoRatio: VideoRatio;
  negativePrompt: string;
  videoPrompt: string;
  setGeneratedVideoUrl: (url: string | null) => void;
  setStatusMessage: (message: StatusMessage | null) => void;
}

export interface UseVideoGenerationReturn {
  isGeneratingVideo: boolean;
  handleGenerateVideo: (generatedImageUrl: string | null, uploadedUrl: string | null) => Promise<void>;
  generateVideoMutation: any;
}

export function useVideoGeneration({
  videoDescription,
  selectedVideoModel,
  selectedVideoDuration,
  videoRatio,
  negativePrompt,
  videoPrompt,
  setGeneratedVideoUrl,
  setStatusMessage,
}: UseVideoGenerationProps): UseVideoGenerationReturn {
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);

  // Video generation mutation with multiple models
  const generateVideoMutation = useMutation({
    mutationFn: async ({ imageUrl, prompt }: { imageUrl: string; prompt?: string }) => {
      console.log('Generating video with:', {
        imageUrl,
        prompt: prompt || videoDescription,
        model: selectedVideoModel
      });

      const finalPrompt = videoPrompt.trim() || prompt || videoDescription;

      if (selectedVideoModel === 'fal-veo3') {
        const result = await trpcClient.fal.generateVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          model: "fal-ai/veo3.1/fast/image-to-video",
          duration: selectedVideoDuration,
          aspectRatio: videoRatio,
          motionStrength: 127,
          negativePrompt: negativePrompt || undefined
        });
        console.log('Veo3.1 video result:', result);
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-kling') {
        const result = await trpcClient.fal.klingVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 5 || selectedVideoDuration === 10) ? selectedVideoDuration : 5,
          aspectRatio: videoRatio,
          negativePrompt: negativePrompt || undefined,
          cfgScale: 0.5
        });
        console.log('Kling video result:', result);
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-wan25') {
        const result = await trpcClient.fal.wan25ImageToVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 5 || selectedVideoDuration === 10) ? selectedVideoDuration : 5,
          resolution: "1080p",
          negativePrompt: negativePrompt || undefined,
          enablePromptExpansion: true
        });
        console.log('Wan25 video result:', result);
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-sora') {
        const result = await trpcClient.fal.soraImageToVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 4 || selectedVideoDuration === 8 || selectedVideoDuration === 12) ? selectedVideoDuration : 4,
          aspectRatio: videoRatio === "1:1" ? "auto" : videoRatio,
          resolution: "auto",
        });
        console.log('Sora video result:', result);
        return { videoUrl: result.videoUrl };
      }

      throw new Error('Invalid video model selected');
    },
    onSuccess: (data) => {
      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);

        const modelNames: Record<string, string> = {
          'fal-veo3': 'Veo3',
          'fal-kling': 'Kling 2.5',
          'fal-wan25': 'Wan 2.5',
          'fal-sora': 'Sora 2'
        };
        const modelName = modelNames[selectedVideoModel] || 'Video';

        setStatusMessage({
          type: 'success',
          title: 'Video Generated Successfully!',
          description: `Your ${modelName} video animation has been created. You can now save it to the timeline.`,
        });
      }
    },
    onError: (error) => {
      console.error("Error generating video:", error);

      // Extract error message
      let errorMessage = "Failed to generate video. Please try again.";
      let errorTitle = "Video Generation Failed";
      let errorDescription = "";
      let action = undefined;

      if (error instanceof Error) {
        errorMessage = error.message;

        // Check for specific error cases to provide better user guidance
        if (errorMessage.toLowerCase().includes('content checker') ||
            errorMessage.toLowerCase().includes('flagged')) {
          errorTitle = "Content Check Failed";

          // Check if it's Sora and provide specific guidance
          if (selectedVideoModel === 'fal-sora') {
            errorDescription = `OpenAI Sora has detected content that violates its usage policies. This often happens with:

• Certain aspect ratios (Sora ONLY supports 16:9 or 9:16, NOT 1:1)
• Character images that contain copyrighted or unlicensed content
• Generated images that include recognizable IP

Try switching to Veo3, Kling 2.5, or Wan 2.5 which have more flexible content policies, or ensure all characters are original creations.`;
            action = {
              label: 'Switch to Veo3',
              onClick: () => {
                // This would need to be passed from parent
                setStatusMessage(null);
              }
            };
          } else {
            errorDescription = "The AI service detected content that violates its usage policies. Try using different characters or switching to another video model.";
          }
        } else if (errorMessage.toLowerCase().includes('unlicensed') ||
            errorMessage.toLowerCase().includes('license')) {
          errorTitle = "Unlicensed Content Detected";
          errorDescription = "This request includes unlicensed characters or content. Please ensure all characters in your scene are properly licensed or use different characters.";
        } else if (errorMessage.toLowerCase().includes('image') &&
                   errorMessage.toLowerCase().includes('url')) {
          errorTitle = "Image Access Error";
          errorDescription = "The character image could not be accessed. Please try regenerating the character or use a different image.";
        } else if (errorMessage.toLowerCase().includes('quota') ||
                   errorMessage.toLowerCase().includes('limit')) {
          errorTitle = "API Quota Exceeded";
          errorDescription = "You've reached the API usage limit. Please try again later or contact support.";
        } else if (errorMessage.toLowerCase().includes('validation error') ||
                   errorMessage.toLowerCase().includes('invalid input')) {
          errorTitle = "Invalid Input";

          // Provide Sora-specific guidance for validation errors
          if (selectedVideoModel === 'fal-sora') {
            errorDescription = `Sora 2 has STRICT requirements:

• Aspect Ratio: ONLY 16:9 or 9:16 (1:1 is NOT supported!)
• Duration: ONLY 4, 8, or 12 seconds
• Resolution: ONLY 720p
• Image Format: Must be a valid, accessible URL

Current settings: ${videoRatio} aspect ratio, ${selectedVideoDuration || 4}s duration

${videoRatio === "1:1" ? "❌ ISSUE: You selected 1:1 which Sora doesn't support! Change to 16:9 or 9:16.\n\n" : ""}Try adjusting your settings or use a different video model like Veo3 or Kling 2.5.`;
            action = {
              label: 'Switch to Veo3',
              onClick: () => {
                setStatusMessage(null);
              }
            };
          } else {
            errorDescription = errorMessage;
          }
        } else {
          errorDescription = errorMessage;
        }
      }

      // Show inline status message in sidebar
      setStatusMessage({
        type: 'error',
        title: errorTitle,
        description: errorDescription,
        action
      });
    }
  });

  // Handle video generation
  const handleGenerateVideo = useCallback(async (
    generatedImageUrl: string | null,
    uploadedUrl: string | null
  ) => {
    setStatusMessage(null); // Clear any previous messages

    setIsGeneratingVideo(true);
    try {
      const hasImage = uploadedUrl || generatedImageUrl;

      // Determine if we're in text-to-video or image-to-video mode
      const isTextToVideo = !hasImage;

      if (isTextToVideo) {
        // Text-to-video mode: Use selected model for text-to-video
        const modelMap: Record<string, string> = {
          'fal-veo3': 'fal-ai/veo3.1/fast',
          'fal-sora': 'fal-ai/sora-2/text-to-video',
          'fal-kling': 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
          'fal-wan25': 'fal-ai/wan-25-preview/text-to-video'
        };

        const modelNames: Record<string, string> = {
          'fal-veo3': 'Veo 3.1',
          'fal-kling': 'Kling 2.5',
          'fal-wan25': 'Wan 2.5',
          'fal-sora': 'Sora 2'
        };

        const textToVideoModel = modelMap[selectedVideoModel] || 'fal-ai/veo3.1/fast';
        const modelName = modelNames[selectedVideoModel] || 'AI';

        console.log('🎬 Text-to-video mode:', {
          selectedModel: selectedVideoModel,
          actualModel: textToVideoModel,
          prompt: videoDescription,
          duration: selectedVideoDuration,
          aspectRatio: videoRatio
        });

        setStatusMessage({
          type: 'info',
          title: 'Generating Video',
          description: `Creating your video with ${modelName}...`,
        });

        const result = await trpcClient.fal.generateVideo.mutate({
          prompt: videoDescription,
          model: textToVideoModel as any,
          duration: selectedVideoDuration,
          aspectRatio: videoRatio,
          negativePrompt: negativePrompt || undefined
        });

        if (result.videoUrl) {
          setGeneratedVideoUrl(result.videoUrl);
          setStatusMessage({
            type: 'success',
            title: 'Video Generated Successfully!',
            description: `Your ${modelName} video has been created. You can now save it to the timeline.`,
          });
        }
      } else {
        // Image-to-video mode: Use image-to-video models
        const imageUrlToUse = uploadedUrl || generatedImageUrl;

        console.log('=== IMAGE-TO-VIDEO GENERATION DEBUG ===');
        console.log('Image URL:', imageUrlToUse);
        console.log('Video Description:', videoDescription);
        console.log('Model:', selectedVideoModel);
        console.log('===============================');

        setStatusMessage({
          type: 'info',
          title: 'Animating Video',
          description: 'Creating your video animation...',
        });

        await generateVideoMutation.mutateAsync({
          imageUrl: imageUrlToUse!,
          prompt: `Animate this scene: ${videoDescription}`
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage({
        type: 'error',
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate video',
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [
    videoDescription,
    generateVideoMutation,
    selectedVideoModel,
    selectedVideoDuration,
    videoRatio,
    negativePrompt,
    videoPrompt,
    setGeneratedVideoUrl,
    setStatusMessage
  ]);

  return {
    isGeneratingVideo,
    handleGenerateVideo,
    generateVideoMutation,
  };
}
