import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  MarkerType,
  addEdge,
  type Node,
  type Edge,
  type Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { TimelineEventNode } from '@/components/flow/TimelineNodes';
import { trpcClient } from '@/utils/trpc';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReadContract, useChainId, useWriteContract } from 'wagmi';
import { timelineAbi } from '@/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type Address } from 'viem';
import type { TimelineNodeData } from '@/components/flow/TimelineNodes';
import { UniverseSidebar } from '@/components/UniverseSidebar';
import { FlowCreationPanel } from '@/components/FlowCreationPanel';
import { GovernanceSidebar } from '@/components/GovernanceSidebar';
import { toast } from 'sonner';

// Register custom node types
const nodeTypes = {
  timelineEvent: TimelineEventNode,
};

function UniverseTimelineEditor() {
  const { id } = useParams({ from: "/universe/$id" });
  const chainId = useChainId();

  // Timeline flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<TimelineNodeData> | null>(null);
  const [eventCounter, setEventCounter] = useState(1);

  // Timeline parameters
  const [timelineTitle, setTimelineTitle] = useState("Universe Timeline");
  const [timelineDescription, setTimelineDescription] = useState("Blockchain-powered narrative timeline");
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedEventDescription, setSelectedEventDescription] = useState("");

  // Video generation dialog state
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [additionType, setAdditionType] = useState<'after' | 'branch'>('after');
  const [selectedVideoModel, setSelectedVideoModel] = useState<'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora'>('fal-veo3');
  const [selectedVideoDuration, setSelectedVideoDuration] = useState<number>(8);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoRatio, setVideoRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [imageFormat, setImageFormat] = useState<'landscape_16_9' | 'portrait_16_9' | 'landscape_4_3' | 'portrait_4_3'>('landscape_16_9');

  // Status message for sidebar
  const [statusMessage, setStatusMessage] = useState<{
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  } | null>(null);

  // Image generation state
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [showVideoStep, setShowVideoStep] = useState(false);

  // Character selection state
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterDescription, setCharacterDescription] = useState('');
  const [characterStyle, setCharacterStyle] = useState<'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'>('cute');
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<{
    name: string;
    description: string;
    style: string;
    imageUrl: string;
    characterId?: string;
  } | null>(null);

  // Image-to-video character selection (1-2 max)
  const [selectedImageCharacters, setSelectedImageCharacters] = useState<string[]>([]);

  // File upload state  
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Contract integration state
  const [isSavingToContract, setIsSavingToContract] = useState(false);
  const [contractSaved, setContractSaved] = useState(false);

  // Governance state
  const [showGovernanceSidebar, setShowGovernanceSidebar] = useState(false);

  // MinIO/Storage integration state
  const [isSavingToStorage, setIsSavingToStorage] = useState(false);
  const [storageSaved, setStorageSaved] = useState(false);
  const [storageKey, setStorageKey] = useState<string | null>(null);

  // Music/soundtrack state
  const [soundtrackUrl, setSoundtrackUrl] = useState<string>("");
  const [soundtrackName, setSoundtrackName] = useState<string>("");

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Debug: Log when generatedVideoUrl changes
  useEffect(() => {
    console.log('generatedVideoUrl changed to:', generatedVideoUrl);
    console.log('Stack trace:', new Error().stack);
  }, [generatedVideoUrl]);

  // Contract hooks - we'll use the write contract directly for universe-specific contracts
  const { writeContractAsync } = useWriteContract();

  // Blockchain data fetching hooks
  const useUniverseLeaves = (contractAddress?: string) => {
    if (!contractAddress) {
      console.log('useUniverseLeaves - No contract address provided');
      return { data: null, isLoading: false, refetch: async () => { } };
    }

    console.log('useUniverseLeaves - Using address:', contractAddress, 'for universe:', id);

    return useReadContract({
      abi: timelineAbi,
      address: contractAddress as Address,
      functionName: 'getLeaves',
      query: {
        enabled: !!contractAddress
      }
    });
  };

  const useUniverseFullGraph = (contractAddress?: string) => {
    if (!contractAddress) {
      console.log('useUniverseFullGraph - No contract address provided');
      return { data: null, isLoading: false, refetch: async () => { } };
    }

    console.log('useUniverseFullGraph - Using address:', contractAddress, 'for universe:', id);

    return useReadContract({
      abi: timelineAbi,
      address: contractAddress as Address,
      functionName: 'getFullGraph',
      query: {
        enabled: !!contractAddress
      }
    });
  };

  // Try to get universe data from localStorage (skip for blockchain universes)
  const { data: universeFromStorage } = useQuery({
    queryKey: ['universe-metadata', id],
    queryFn: () => {
      const stored = localStorage.getItem('createdUniverses');
      const universes = stored ? JSON.parse(stored) : [];
      const found = universes.find((u: any) => u.id === id);
      console.log('Looking for universe with id:', id);
      console.log('Found in localStorage:', found);
      return found;
    }
  });

  // Use localStorage data if available
  const universe = universeFromStorage || null;
  const isLoadingUniverse = false;

  // For blockchain universes (addresses starting with 0x), use blockchain data
  const isBlockchainUniverse = id?.startsWith('0x');

  // For blockchain universes, create a default universe object if not found in localStorage
  const finalUniverse = universe || (isBlockchainUniverse ? {
    id: id,
    name: `Universe ${id.slice(0, 8)}...`,
    description: 'Blockchain-based cinematic universe',
    address: id,
    isDefault: false,
    // For governance, we need tokenAddress and governanceAddress
    // These should come from localStorage when the universe was created
    // If not available, the governance features won't work
    tokenAddress: universe?.tokenAddress || null,
    governanceAddress: universe?.governanceAddress || null
  } : null);

  // Each universe with a 0x address IS its own Timeline contract
  // So we use the universe ID as the contract address
  const timelineContractAddress = isBlockchainUniverse
    ? id  // Use the universe ID as the contract address
    : universe?.address || undefined;  // For non-blockchain universes, use the stored address

  console.log('Universe ID:', id);
  console.log('Is Blockchain Universe:', isBlockchainUniverse);
  console.log('Timeline Contract Address:', timelineContractAddress);
  console.log('Chain ID:', chainId);

  // Blockchain data fetching hooks - use the universe's own contract address
  const { data: leavesData, isLoading: isLoadingLeaves, refetch: refetchLeaves } = useUniverseLeaves(timelineContractAddress);
  const { data: fullGraphData, isLoading: isLoadingFullGraph, refetch: refetchFullGraph } = useUniverseFullGraph(timelineContractAddress);

  // Canon chain data fetching hook
  const useUniverseCanonChain = (contractAddress?: string) => {
    if (!contractAddress) {
      console.log('useUniverseCanonChain - No contract address provided');
      return { data: null, isLoading: false, refetch: async () => { } };
    }

    console.log('useUniverseCanonChain - Using address:', contractAddress, 'for universe:', id);

    return useReadContract({
      abi: timelineAbi,
      address: contractAddress as Address,
      functionName: 'getCanonChain',
      query: {
        enabled: !!contractAddress
      }
    });
  };

  const { data: canonChainData, isLoading: isLoadingCanonChain, refetch: refetchCanonChain } = useUniverseCanonChain(timelineContractAddress);

  // Get timeline data: use blockchain data if available, otherwise dummy data
  const graphData = useMemo(() => {
    console.log('=== GRAPH DATA DEBUG ===');
    console.log('Is Blockchain Universe:', isBlockchainUniverse);
    console.log('Timeline Contract Address:', timelineContractAddress);
    console.log('Full Graph Data:', fullGraphData);
    console.log('Canon Chain Data:', canonChainData);
    console.log('=========================');

    if (timelineContractAddress && fullGraphData) {
      // Convert blockchain data to the expected format
      const [nodeIds, urls, descriptions, previousIds, nextIds, flags] = fullGraphData;

      console.log('=== BLOCKCHAIN DATA PARSED ===');
      console.log('Node IDs:', nodeIds);
      console.log('URLs:', urls);
      console.log('Descriptions:', descriptions);
      console.log('Previous IDs:', previousIds);
      console.log('Canon Chain:', canonChainData);
      console.log('==============================');

      return {
        nodeIds: nodeIds || [],
        urls: urls || [],
        descriptions: descriptions || [],
        previousNodes: previousIds || [],
        children: nextIds || [],
        flags: flags || [],
        canonChain: canonChainData || []
      };
    }

    // Return empty data structure if no data found
    return {
      nodeIds: [], urls: [], descriptions: [], previousNodes: [], children: [], flags: [], canonChain: []
    };
  }, [id, isBlockchainUniverse, fullGraphData, canonChainData]);

  // Update timeline title when universe data loads
  useEffect(() => {
    const universeToUse = universe || (isBlockchainUniverse ? {
      name: `Universe ${id.slice(0, 8)}...`,
      description: 'Blockchain-based cinematic universe'
    } : null);

    if (universeToUse?.name) {
      setTimelineTitle(universeToUse.name);
      setTimelineDescription(universeToUse.description || "Blockchain-powered narrative timeline");
    }
  }, [universe, id, isBlockchainUniverse]);

  // Fetch available characters
  const { data: charactersData, isLoading: isLoadingCharacters, refetch: refetchCharacters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => trpcClient.wiki.characters.query(),
  });

  // Generate character mutation (with optional DB save)
  const generateCharacterMutation = useMutation({
    mutationFn: async (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'; saveToDatabase?: boolean }) => {
      const result = await trpcClient.fal.generateCharacter.mutate({
        ...input,
        saveToDatabase: input.saveToDatabase ?? false // Use input value or default to false
      });
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character generated:', data);
      setIsGeneratingCharacter(false);

      // Store generated character for preview
      setGeneratedCharacter({
        name: characterName,
        description: characterDescription,
        style: characterStyle,
        imageUrl: data.imageUrl
      });
    },
    onError: (error) => {
      console.error('Character generation failed:', error);
      alert("Failed to generate character. Please try again.");
      setIsGeneratingCharacter(false);
    }
  });

  // Save character to database mutation
  const saveCharacterMutation = useMutation({
    mutationFn: async () => {
      if (!generatedCharacter) throw new Error('No character to save');

      const result = await trpcClient.fal.generateCharacter.mutate({
        name: generatedCharacter.name,
        description: generatedCharacter.description,
        style: generatedCharacter.style as any,
        saveToDatabase: true
      });
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character saved to database:', data);

      // Add to selected characters
      if (data.characterId) {
        setSelectedCharacters(prev => [...prev, data.characterId!]);
      }

      // Clear generated character and close dialog
      setGeneratedCharacter(null);
      setShowCharacterGenerator(false);

      // Refetch characters to include the new one
      await refetchCharacters();
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
      alert("Failed to save character to database. Please try again.");
    }
  });

  // Image generation mutation using Nano Banana for editing
  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      // Check if we have selected characters to edit into the scene
      if (selectedCharacters.length > 0 && charactersData?.characters) {
        const selectedChars = charactersData.characters.filter((c: any) => selectedCharacters.includes(c.id));

        if (selectedChars.length > 0) {
          // Process all selected character images
          const characterNames = selectedChars.map((c: any) => c.character_name).join(' and ');

          // Create edit prompt that places characters in the scene
          const editPrompt = `${characterNames} ${prompt}, cinematic scene, high quality, detailed environment`;

          // Use character image URLs directly
          const processedImageUrls = selectedChars
            .filter((char: any) => char.image_url && char.image_url.trim())
            .map((char: any) => char.image_url);

          console.log('🎭 === CHARACTER SCENE EDITING WITH NANO BANANA ===');
          console.log('Selected characters:', selectedChars.map((c: any) => c.character_name));
          console.log('Number of characters:', selectedChars.length);
          console.log('Image URLs:', processedImageUrls);
          console.log('Scene prompt:', editPrompt);
          console.log('Image format:', imageFormat);
          console.log('🚀 Calling Nano Banana Edit...');

          // Validate we have at least one valid image URL
          if (processedImageUrls.length === 0) {
            throw new Error('No valid character images found for editing');
          }

          try {
            // Use Nano Banana Edit for character frame generation
            console.log('🎯 Using fal-ai/nano-banana/edit for character frame generation');

            const result = await trpcClient.fal.imageToImage.mutate({
              prompt: `Create a cinematic frame: ${editPrompt}. Professional photography, detailed environment, high quality composition`,
              imageUrls: processedImageUrls,
              imageSize: imageFormat,
              numImages: 1,
            });

            console.log('✅ Nano Banana Edit result:', result);

            if (result.status !== 'completed' || !result.imageUrl) {
              throw new Error(result.error || 'Nano Banana frame generation failed');
            }

            console.log('🎉 NANO BANANA CHARACTER FRAME GENERATION SUCCESSFUL!');
            return { success: true, imageUrl: result.imageUrl };
          } catch (imageToImageError) {
            console.error('❌ NANO BANANA EDIT FAILED:', imageToImageError);
            console.error('Error details:', JSON.stringify(imageToImageError, null, 2));

            const errorMessage = imageToImageError instanceof Error
              ? imageToImageError.message
              : 'Nano Banana edit failed';

            throw new Error(`Frame generation failed: ${errorMessage}. Please check character images and try again.`);
          }
        }
      }

      // For scenes without characters, generate directly with Nano Banana
      console.log('🎨 Generating scene without characters using Nano Banana');

      try {
        const result = await trpcClient.fal.generateImage.mutate({
          prompt: `${prompt}, cinematic scene, high quality, detailed environment, professional photography, dramatic lighting`,
          model: 'fal-ai/nano-banana',
          imageSize: imageFormat,
          numImages: 1
        });

        if (result.status !== 'completed' || !result.imageUrl) {
          throw new Error(result.error || 'Failed to generate scene image');
        }

        console.log('🎉 NANO BANANA SCENE GENERATION SUCCESSFUL!');
        return { success: true, imageUrl: result.imageUrl };
      } catch (error) {
        console.error('❌ NANO BANANA GENERATION FAILED:', error);
        throw error;
      }
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        console.log('=== GENERATED IMAGE URL ===');
        console.log('Image URL:', data.imageUrl);
        console.log('===========================');

        setGeneratedImageUrl(data.imageUrl);
        setShowVideoStep(true);
        
        setStatusMessage({
          type: 'success',
          title: 'Image Generated Successfully!',
          description: 'Your scene image has been generated. Now you can create a video animation from it.',
        });
      }
    },
    onError: (error) => {
      console.error("Error generating image:", error);
      console.error("Error details:", {
        message: error.message,
        stack: error.stack,
        selectedCharacters,
        charactersData: charactersData?.characters?.length
      });

      let errorTitle = "Image Generation Failed";
      let errorMessage = "Failed to generate image. ";
      if (selectedCharacters.length > 0) {
        errorMessage += "Character image editing failed. ";
      }
      errorMessage += "Please try again.";

      if (error.message?.includes('FAL_KEY')) {
        errorTitle = "API Configuration Error";
        errorMessage = "FAL API key is missing. Please configure FAL_KEY in environment variables.";
      } else if (error.message?.includes('nano-banana')) {
        errorTitle = "Nano Banana API Error";
        errorMessage = "The Nano Banana image generation service encountered an error. Please try again.";
      }

      setStatusMessage({
        type: 'error',
        title: errorTitle,
        description: errorMessage
      });
    }
  });

  // Handle image generation for the event
  const handleGenerateEventImage = useCallback(async () => {
    if (!videoDescription.trim()) return;

    setStatusMessage(null); // Clear any previous messages
    setIsGeneratingImage(true);
    try {
      // Use the video description as the image prompt
      await generateImageMutation.mutateAsync(videoDescription);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [videoDescription, generateImageMutation]);

  // Handle character frame generation for image-to-video
  const handleGenerateCharacterFrame = useCallback(async () => {
    if (!videoDescription.trim() || selectedImageCharacters.length === 0) return;

    setStatusMessage(null);
    setIsGeneratingImage(true);

    try {
      // Get selected character data
      const selectedChars = charactersData?.characters?.filter((c: any) =>
        selectedImageCharacters.includes(c.id)
      ) || [];

      if (selectedChars.length === 0) {
        setStatusMessage({
          type: 'error',
          title: 'No Characters Found',
          description: 'Please select valid characters.',
        });
        return;
      }

      const characterNames = selectedChars.map((c: any) => c.character_name).join(' and ');

      // Get character image URLs for nano-banana edit
      const characterImageUrls = selectedChars
        .filter((char: any) => char.image_url && char.image_url.trim())
        .map((char: any) => char.image_url);

      if (characterImageUrls.length === 0) {
        setStatusMessage({
          type: 'error',
          title: 'No Character Images',
          description: 'Selected characters have no valid images.',
        });
        return;
      }

      setStatusMessage({
        type: 'info',
        title: 'Generating Character Frame',
        description: 'Creating frame with nano-banana...',
      });

      console.log('🎨 Generating character frame:', {
        selectedImageCharacters,
        characterNames,
        characterImageUrls,
        prompt: videoDescription
      });

      // Call nano-banana edit directly with the character images
      const editPrompt = `${characterNames} ${videoDescription}, cinematic scene, high quality, detailed environment`;

      const result = await trpcClient.fal.imageToImage.mutate({
        prompt: `Create a cinematic frame: ${editPrompt}. Professional photography, detailed environment, high quality composition`,
        imageUrls: characterImageUrls,
        imageSize: imageFormat,
        numImages: 1,
      });

      if (result.status !== 'completed' || !result.imageUrl) {
        throw new Error(result.error || 'Character frame generation failed');
      }

      console.log('✅ Character frame generated:', result.imageUrl);
      setGeneratedImageUrl(result.imageUrl);

      setStatusMessage({
        type: 'success',
        title: 'Frame Generated!',
        description: 'Your character frame is ready. Now you can generate a video from it.',
      });
    } catch (error) {
      console.error('Character frame generation failed:', error);
      setStatusMessage({
        type: 'error',
        title: 'Frame Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate character frame. Please try again.',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  }, [videoDescription, selectedImageCharacters, charactersData, imageFormat, trpcClient, setStatusMessage]);

  // Handle video generation with multiple models
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
        return { videoUrl: result.videoUrl }; // Use actual video URL
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
        return { videoUrl: result.videoUrl }; // Use actual video URL
      } else if (selectedVideoModel === 'fal-sora') {
        const result = await trpcClient.fal.soraImageToVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 4 || selectedVideoDuration === 8 || selectedVideoDuration === 12) ? selectedVideoDuration : 4,
          aspectRatio: videoRatio === "1:1" ? "auto" : videoRatio,
          resolution: "auto",
        });
        console.log('Sora video result:', result);
        return { videoUrl: result.videoUrl }; // Use actual video URL
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
                setSelectedVideoModel('fal-veo3');
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
                setSelectedVideoModel('fal-veo3');
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

  // File upload to tmpfiles.org
  const uploadToTmpfiles = useCallback(async () => {
    if (!generatedImageUrl) return;

    setIsUploading(true);
    try {
      // Convert data URL to blob
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();

      // Create form data
      const formData = new FormData();
      formData.append('file', blob, 'generated-image.png');

      // Upload to tmpfiles.org
      const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        if (result?.status === 'success') {
          // Convert to direct access URL
          const fileUrl = result.data.url;
          const directUrl = fileUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          setUploadedUrl(directUrl);
          console.log('✅ Image uploaded to tmpfiles.org:', directUrl);
        } else {
          throw new Error('Upload failed');
        }
      } else {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error('Error uploading to tmpfiles.org:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [generatedImageUrl]);

  const handleGenerateVideo = useCallback(async () => {
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
          model: textToVideoModel,
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
  }, [generatedImageUrl, uploadedUrl, videoDescription, generateVideoMutation, selectedVideoModel, selectedVideoDuration, videoRatio, negativePrompt, setStatusMessage]);

  // Save to contract function (now includes Filecoin upload)
  const handleSaveToContract = useCallback(async () => {
    if (!generatedVideoUrl || !videoTitle || !videoDescription) {
      alert('Video, title, and description are required to save to contract');
      return;
    }

    setIsSavingToContract(true);
    setIsSavingToStorage(true);

    try {
      // Step 1: Upload to MinIO S3 storage first
      console.log('Step 1: Uploading video to MinIO S3. URL being used:', generatedVideoUrl);
      console.log('Current state - videoTitle:', videoTitle, 'videoDescription:', videoDescription);

      let minioKey: string | null = null;
      let minioUrl: string | null = null;
      try {
        // Generate a clean UUID for the filename
        const uuid = crypto.randomUUID();
        const minioResult = await trpcClient.minio.uploadFromUrl.mutate({
          url: generatedVideoUrl,
          filename: `${uuid}.mp4`
        });

        console.log('MinIO upload successful. Key:', minioResult.key);
        console.log('MinIO public URL:', minioResult.url);

        minioKey = minioResult.key;
        minioUrl = minioResult.url;
        setStorageKey(minioResult.key);
        setStorageSaved(true);

        // Use the MinIO public URL directly
        setGeneratedVideoUrl(minioUrl);
        console.log('Updated video display to use MinIO URL:', minioUrl);
      } catch (minioError) {
        console.error('MinIO upload failed, proceeding with original URL:', minioError);
        // Continue with original URL if MinIO fails
      }

      setIsSavingToStorage(false);

      // Step 2: Determine the previous node based on addition type
      let previousNodeId: number;

      if (additionType === 'branch' && sourceNodeId) {
        // For branches, extract numeric part from sourceNodeId (e.g., "4c" -> 4)
        const numericPart = sourceNodeId.match(/^\d+/);
        previousNodeId = numericPart ? parseInt(numericPart[0]) : 0;
        console.log('Creating branch from event:', sourceNodeId, '-> numeric:', previousNodeId);
      } else {
        // For linear continuation, find the last node ID (extract numeric parts)
        const numericIds = graphData.nodeIds.map(id => {
          const idStr = String(id);
          const numericPart = idStr.match(/^\d+/);
          return numericPart ? parseInt(numericPart[0]) : 0;
        });
        previousNodeId = Math.max(...(numericIds || [0]), 0);
        console.log('Creating linear continuation after event:', previousNodeId);
      }

      // Step 3: Determine the video URL to store - prefer MinIO URL if available
      const videoUrlForContract = minioUrl || generatedVideoUrl;

      console.log('Step 2: Saving to contract:', {
        link: videoUrlForContract,
        originalLink: generatedVideoUrl,
        minioKey: minioKey,
        minioUrl: minioUrl,
        plot: videoDescription,
        previous: previousNodeId,
        title: videoTitle,
        additionType,
        sourceNodeId
      });

      // Determine which contract address to use
      const contractAddressToUse = isBlockchainUniverse
        ? id as Address  // Use universe ID as contract address
        : TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address;  // Fallback to default

      console.log('Saving to contract address:', contractAddressToUse);

      // Create new node in the universe's specific smart contract
      const txHash = await writeContractAsync({
        abi: timelineAbi,
        address: contractAddressToUse,
        functionName: 'createNode',
        args: [videoUrlForContract, videoDescription, BigInt(previousNodeId)]
      });

      console.log('Transaction submitted:', txHash);
      setContractSaved(true);

      // Show success message
      toast.success('Event Saved to Blockchain & MinIO!', {
        description: `Your timeline event has been permanently stored.\nTransaction: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 8)}`,
        duration: 8000
      });

      // Step 4: Generate wiki entry in background (non-blocking)
      console.log('Step 3: Generating wiki entry in background...');

      // Gather previous events for context (last 2-3 events)
      const previousEvents = graphData.nodeIds
        .slice(-3) // Get last 3 events
        .map((nodeId, idx) => ({
          title: graphData.descriptions[graphData.nodeIds.length - 3 + idx] || `Event ${nodeId}`,
          description: graphData.descriptions[graphData.nodeIds.length - 3 + idx] || ''
        }))
        .filter(evt => evt.description.length > 0);

      // Generate wiki in background (non-blocking)
      trpcClient.wiki.generateFromVideo.mutate({
        universeId: id,
        eventId: String(previousNodeId + 1), // New event ID
        videoUrl: videoUrlForContract,
        title: videoTitle,
        description: videoDescription,
        characterIds: selectedCharacters.length > 0 ? selectedCharacters : undefined,
        previousEvents: previousEvents.length > 0 ? previousEvents : undefined
      }).then((wikiResult) => {
        console.log('✅ Wiki generated successfully!', wikiResult);
        toast.success('Wiki Generated!', {
          description: 'AI-powered wiki entry created for your event.',
          duration: 4000
        });
      }).catch((wikiError) => {
        console.error('❌ Wiki generation failed:', wikiError);
        // Don't show error to user - wiki can be generated later
        console.warn('Event saved but wiki generation failed. Wiki can be regenerated later.');
      });

      // Refresh the blockchain data to show the new node
      setTimeout(async () => {
        if (isBlockchainUniverse) {
          // Specifically refetch blockchain data
          await refetchLeaves();
          await refetchFullGraph();
          await refetchCanonChain();
          console.log('Refetched blockchain data after contract save');
        }
        // Invalidate all queries as fallback
        await queryClient.invalidateQueries();
        console.log('Refreshed blockchain data - new node should appear');
      }, 5000); // Wait 5 seconds for blockchain to update

    } catch (error) {
      console.error('Error saving to contract:', error);
      toast.error('Contract Save Failed', {
        description: 'Failed to save event to blockchain: ' + (error instanceof Error ? error.message : 'Unknown error'),
        duration: 5000
      });
    } finally {
      setIsSavingToContract(false);
      setIsSavingToStorage(false);
    }
  }, [generatedVideoUrl, videoTitle, videoDescription, graphData.nodeIds, writeContractAsync, isBlockchainUniverse, id, chainId]);

  // Manual refresh function
  const handleRefreshTimeline = useCallback(async () => {
    console.log('Manually refreshing timeline...');
    if (isBlockchainUniverse) {
      // Specifically refetch blockchain data
      await refetchLeaves();
      await refetchFullGraph();
      await refetchCanonChain();
      console.log('Refetched blockchain data for universe:', id);
    }
    // Also invalidate all queries as fallback
    await queryClient.invalidateQueries();
  }, [queryClient, isBlockchainUniverse, refetchLeaves, refetchFullGraph, refetchCanonChain, id]);

  // Handle opening governance sidebar
  const handleOpenGovernance = useCallback(() => {
    setShowGovernanceSidebar(true);
  }, []);

  // Handle showing video generation dialog
  const handleAddEvent = useCallback((type: 'after' | 'branch' = 'after', nodeId?: string) => {
    console.log('🔵 handleAddEvent called:', {
      type,
      nodeId
    });
    setAdditionType(type);
    setSourceNodeId(nodeId || null);
    setVideoTitle("");
    setVideoDescription("");
    setGeneratedImageUrl(null);
    setGeneratedVideoUrl(null);
    setShowVideoStep(false);
    setUploadedUrl(null);
    setContractSaved(false);
    setIsSavingToContract(false);
    setSelectedVideoModel('fal-veo3'); // Reset to default
    setSelectedVideoDuration(8); // Reset video duration to default
    setNegativePrompt(""); // Reset negative prompt
    setVideoPrompt(""); // Reset video prompt
    setVideoRatio("16:9"); // Reset video ratio
    setImageFormat('landscape_16_9'); // Reset image format
    setSoundtrackUrl(""); // Reset soundtrack URL
    setSoundtrackName(""); // Reset soundtrack name
    setSelectedCharacters([]); // Reset selected characters
    setStatusMessage(null); // Clear any status messages
    setShowVideoDialog(true);
  }, []);

  // Handle creating actual event after dialog submission - Keep universe branch logic
  const handleCreateEvent = useCallback(() => {
    if (!videoTitle.trim()) return;

    // Find source node if specified
    const sourceNode = sourceNodeId
      ? nodes.find(n => n.data.eventId === sourceNodeId || n.id === sourceNodeId)
      : null;
    const lastEventNode = nodes.filter((n: any) => n.data.nodeType === 'scene').pop();
    const referenceNode = sourceNode || lastEventNode;

    // Debug: Log what we found for the source node
    console.log('handleCreateEvent sourceNode lookup:', {
      sourceNodeId,
      foundSourceNode: sourceNode ? {
        id: sourceNode.id,
        eventId: sourceNode.data.eventId,
        position: sourceNode.position
      } : null,
      allSceneNodes: nodes.filter(n => n.data.nodeType === 'scene').map(n => ({
        id: n.id,
        eventId: n.data.eventId
      }))
    });

    // Generate appropriate event ID based on addition type - Keep universe branch logic
    let newEventId: string;
    let newAddId: string;

    if (additionType === 'branch' && sourceNodeId) {
      // For branches, add a letter suffix to the source node ID
      const sourceEventId = sourceNodeId;

      // Find all existing branches from this source node
      const existingBranches = nodes.filter((n: any) => {
        const eventId = n.data.eventId?.toString();
        return eventId && eventId.startsWith(sourceEventId) && /[a-z]/.test(eventId);
      });

      // Determine the next branch letter
      const branchLetter = String.fromCharCode(98 + existingBranches.length); // 'b', 'c', 'd', etc.
      newEventId = `${sourceEventId}${branchLetter}`;
      newAddId = `add-${newEventId}`;

      console.log('Creating branch:', {
        sourceEventId,
        existingBranches: existingBranches.map(n => n.data.eventId),
        newEventId
      });
    } else {
      // For linear continuation, determine if we're continuing a branch or main timeline
      const sceneNodes = nodes.filter((n: any) => n.data.nodeType === 'scene');

      if (sceneNodes.length === 0) {
        // First event
        newEventId = "1";
      } else {
        // Find the rightmost (last added) event to continue from
        const lastNode = sceneNodes.reduce((latest: any, node: any) => {
          if (!latest) return node;
          // Compare positions to find the rightmost node
          return node.position.x > latest.position.x ? node : latest;
        }, null);

        const lastEventId = lastNode?.data.eventId?.toString();
        console.log('Last event ID for continuation:', lastEventId);

        if (lastEventId && /[a-z]/.test(lastEventId)) {
          // We're continuing a branch (e.g., from "1b" to "1c")
          const baseNumber = lastEventId.replace(/[a-z]/g, '');
          const lastLetter = lastEventId.match(/[a-z]/)?.[0] || 'a';
          const nextLetter = String.fromCharCode(lastLetter.charCodeAt(0) + 1);
          newEventId = `${baseNumber}${nextLetter}`;
        } else {
          // We're continuing the main timeline (e.g., from "2" to "3")
          const maxEventId = sceneNodes.reduce((max: number, node: any) => {
            const eventId = node.data.eventId;
            if (eventId) {
              // Extract numeric part only (ignore branch suffixes like 'b', 'c')
              const numericId = parseInt(eventId.toString().replace(/[a-z]/g, ''));
              return !isNaN(numericId) ? Math.max(max, numericId) : max;
            }
            return max;
          }, 0);
          newEventId = String(maxEventId + 1);
        }
      }
      newAddId = `add-${newEventId}`;
    }

    console.log('handleCreateEvent debug:', {
      additionType,
      sourceNodeId,
      newEventId,
      sourceNode: sourceNode ? { id: sourceNode.id, position: sourceNode.position, eventId: sourceNode.data.eventId } : null,
      referenceNode: referenceNode ? { id: referenceNode.id, position: referenceNode.position } : null
    });

    // Calculate position based on addition type
    let newEventPosition;
    let newAddPosition;

    if (additionType === 'branch' && sourceNode) {
      // Create branch: forward and below the source node - increased spacing
      const branchY = sourceNode.position.y + 350; // Increased from 220 to 350
      newEventPosition = { x: sourceNode.position.x + 480, y: branchY };
      newAddPosition = { x: sourceNode.position.x + 960, y: branchY };
    } else {
      // Linear addition to the right of the reference node (or source node)
      if (referenceNode) {
        // Place after the specific reference/source node
        newEventPosition = { x: referenceNode.position.x + 480, y: referenceNode.position.y };
        newAddPosition = { x: referenceNode.position.x + 960, y: referenceNode.position.y };
      } else {
        // No reference node, start fresh
        newEventPosition = { x: 100, y: 200 };
        newAddPosition = { x: 580, y: 200 };
      }
    }

    // Generate user-friendly display name - Keep it simple for universe branch
    const displayName = newEventId;

    // Create new event node
    const newEventNode: Node<TimelineNodeData> = {
      id: newEventId,
      type: 'timelineEvent',
      position: newEventPosition,
      data: {
        label: videoTitle,
        description: videoDescription,
        timelineColor: additionType === 'branch' ? '#f59e0b' : '#10b981',
        nodeType: 'scene',
        eventId: newEventId,
        displayName: displayName, // User-friendly display name
        timelineId: `timeline-${id}`,
        universeId: id,
        onAddScene: handleAddEvent,
      },
    };

    // Create new add button node
    const newAddNode: Node<TimelineNodeData> = {
      id: newAddId,
      type: 'timelineEvent',
      position: newAddPosition,
      data: {
        label: '',
        description: '',
        nodeType: 'add',
        onAddScene: handleAddEvent,
      },
    };

    // Create edges
    const newEdges: Edge[] = [];
    const edgeColor = additionType === 'branch' ? '#f59e0b' : '#10b981';

    if (referenceNode) {
      newEdges.push({
        id: `edge-${referenceNode.id}-${newEventId}`,
        source: referenceNode.id,
        target: newEventId,
        animated: true,
        style: { stroke: edgeColor, strokeWidth: 3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: edgeColor,
        },
      });
    }

    newEdges.push({
      id: `edge-${newEventId}-${newAddId}`,
      source: newEventId,
      target: newAddId,
      animated: true,
      style: { stroke: '#cbd5e1', strokeDasharray: '8,8' },
    });

    // For linear addition, remove old add nodes. For branches, keep everything
    let filteredNodes = nodes;
    let filteredEdges = edges;

    if (additionType === 'after') {
      // Linear addition: remove all existing add nodes and their edges
      filteredNodes = nodes.filter((n: any) => n.data.nodeType !== 'add');
      filteredEdges = edges.filter((e: any) => !nodes.some((n: any) => n.data.nodeType === 'add' && (e.source === n.id || e.target === n.id)));
    }
    // For branches: keep all existing nodes and just add the new ones

    setNodes([...filteredNodes, newEventNode as any, newAddNode as any]);
    setEdges([...filteredEdges, ...newEdges]);
    setEventCounter(prev => prev + 1);

    // Save event data to localStorage for ALL events (not just branched)
    console.log('🔍 Checking if should save event:', {
      newEventId,
      additionType,
      isBranched: /[a-z]/.test(newEventId),
      hasVideo: !!generatedVideoUrl,
      hasImage: !!generatedImageUrl
    });

    // Save ALL events to localStorage for now (easier debugging)
    const eventData = {
      eventId: newEventId,
      title: videoTitle,
      description: videoDescription,
      videoUrl: generatedVideoUrl,
      imageUrl: generatedImageUrl,

      // Characters used in this event
      characterIds: selectedCharacters, // Array of character IDs
      characterNames: selectedCharacters.length > 0 && charactersData?.characters
        ? charactersData.characters
            .filter((c: any) => selectedCharacters.includes(c.id))
            .map((c: any) => c.character_name)
        : [],

      // Generation prompts and settings
      imagePrompt: videoDescription, // The prompt used for image generation
      videoPrompt: videoPrompt || videoDescription, // Video animation prompt
      negativePrompt: negativePrompt || '', // Negative prompt for filtering unwanted content

      // Model and settings used
      videoModel: selectedVideoModel, // Which AI model was used (veo3, kling, wan25, sora)
      videoDuration: selectedVideoDuration, // Video duration in seconds
      videoRatio: videoRatio, // Aspect ratio (16:9, 9:16, 1:1)
      imageFormat: imageFormat, // Image format used

      // Music/Soundtrack
      soundtrackUrl: soundtrackUrl || '', // Music track URL
      soundtrackName: soundtrackName || '', // Track name/title

      sourceNodeId: sourceNodeId,
      additionType: additionType,
      timestamp: Date.now(),
      position: newEventPosition
    };

    // Store in universe-specific localStorage
    const storageKey = `universe_events_${id}`;
    const existingEvents = localStorage.getItem(storageKey);
    const eventsData = existingEvents ? JSON.parse(existingEvents) : {};

    eventsData[newEventId] = eventData;
    localStorage.setItem(storageKey, JSON.stringify(eventsData));

    console.log('💾 Saved event to localStorage:', {
      key: storageKey,
      eventId: newEventId,
      eventData,
      allEvents: eventsData
    });

    // Close dialog and reset
    setShowVideoDialog(false);
    setVideoTitle("");
    setVideoDescription("");
    setSourceNodeId(null);
    setGeneratedImageUrl(null);
    setGeneratedVideoUrl(null);
    setShowVideoStep(false);
  }, [nodes, edges, eventCounter, id, videoTitle, videoDescription, additionType, sourceNodeId, handleAddEvent, generatedVideoUrl, generatedImageUrl]);

  // Convert blockchain data to timeline nodes
  useEffect(() => {
    if (!graphData.nodeIds.length) return;

    const blockchainNodes: Node<TimelineNodeData>[] = [];
    const blockchainEdges: Edge[] = [];
    const horizontalSpacing = 480; // Space between events horizontally
    const verticalSpacing = 350;   // Increased from 220 to 350 for much more space between branches
    const startY = 200;

    // Colors for different types
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    // First pass: categorize nodes by their parent to detect branches
    const nodesByParent = new Map<number, number[]>();
    const nodePositions = new Map<number, { x: number; y: number }>();

    graphData.nodeIds.forEach((nodeIdStr, index) => {
      const nodeId = typeof nodeIdStr === 'bigint' ? Number(nodeIdStr) : parseInt(String(nodeIdStr));
      const previousNode = graphData.previousNodes[index] || '';
      const parentId = (previousNode && String(previousNode) !== '0')
        ? (typeof previousNode === 'bigint' ? Number(previousNode) : parseInt(String(previousNode)))
        : 0;

      if (!nodesByParent.has(parentId)) {
        nodesByParent.set(parentId, []);
      }
      nodesByParent.get(parentId)!.push(nodeId);
    });

    // Generate proper event labels based on branching structure
    const getEventLabel = (nodeId: number, parentId: number): string => {
      if (parentId === 0) return nodeId.toString(); // Root nodes keep numeric ID

      const siblings = nodesByParent.get(parentId) || [];
      const siblingIndex = siblings.indexOf(nodeId);

      if (siblingIndex === 0) {
        // First child continues the main timeline
        return nodeId.toString();
      } else {
        // Additional children are branches with letter suffixes
        const branchLetter = String.fromCharCode(97 + siblingIndex); // 'b', 'c', 'd', etc.
        return `${parentId}${branchLetter}`;
      }
    };

    // Create nodes from blockchain data with proper branching layout
    graphData.nodeIds.forEach((nodeIdStr, index) => {
      const nodeId = typeof nodeIdStr === 'bigint' ? Number(nodeIdStr) : parseInt(String(nodeIdStr));
      const url = graphData.urls[index] || '';
      const description = graphData.descriptions[index] || '';
      const previousNode = graphData.previousNodes[index] || '';
      const isCanon = graphData.flags[index] || false;
      const parentId = (previousNode && String(previousNode) !== '0')
        ? (typeof previousNode === 'bigint' ? Number(previousNode) : parseInt(String(previousNode)))
        : 0;

      // Check if this node is in the canon chain
      const isInCanonChain = graphData.canonChain && graphData.canonChain.some((canonId: any) => {
        const canonNodeId = typeof canonId === 'bigint' ? Number(canonId) : parseInt(String(canonId));
        return canonNodeId === nodeId;
      });

      // Generate proper event label
      const eventLabel = getEventLabel(nodeId, parentId);

      // Calculate position based on branching structure
      let x: number, y: number;

      if (parentId === 0) {
        // Root node
        x = 100;
        y = startY;
      } else {
        const siblings = nodesByParent.get(parentId) || [];
        const siblingIndex = siblings.indexOf(nodeId);
        const parentIndex = graphData.nodeIds.findIndex(id =>
          (typeof id === 'bigint' ? Number(id) : parseInt(String(id))) === parentId
        );

        if (siblingIndex === 0) {
          // Main timeline continuation
          x = 100 + ((parentIndex + 1) * horizontalSpacing);
          y = startY;
        } else {
          // Branch - much more vertical space
          x = 100 + ((parentIndex + 1) * horizontalSpacing);
          y = startY + (siblingIndex * verticalSpacing);
        }
      }

      nodePositions.set(nodeId, { x, y });

      const color = isCanon ? colors[0] : colors[(index + 1) % colors.length];

      // Debug: Log the node creation data
      console.log(`Creating node ${nodeId} (${eventLabel}):`, {
        blockchainNodeId: nodeId,
        eventLabel,
        url,
        description,
        previousNode,
        parentId,
        position: { x, y }
      });

      blockchainNodes.push({
        id: `blockchain-node-${nodeId}`,
        type: 'timelineEvent',
        position: { x, y },
        data: {
          label: description && description.length > 0 && description !== `Timeline event ${nodeId}`
            ? description.substring(0, 50) + (description.length > 50 ? '...' : '')
            : `Event ${eventLabel}`,
          description: description || `Timeline event ${eventLabel}`,
          videoUrl: url,
          timelineColor: color,
          nodeType: 'scene',
          eventId: eventLabel, // Use the proper event label (e.g., "2b" for branches)
          blockchainNodeId: nodeId, // Store actual blockchain node ID for navigation
          displayName: eventLabel, // User-friendly display name
          timelineId: `timeline-1`,
          universeId: finalUniverse?.id || id,
          isRoot: String(previousNode) === '0' || !previousNode,
          isInCanonChain: isInCanonChain, // Pass canon chain information
          onAddScene: handleAddEvent,
        }
      });
    });

    // Create edges based on previous node relationships
    graphData.nodeIds.forEach((nodeIdStr, index) => {
      const nodeId = typeof nodeIdStr === 'bigint' ? Number(nodeIdStr) : parseInt(String(nodeIdStr));
      const previousNodeStr = graphData.previousNodes[index];

      if (previousNodeStr && String(previousNodeStr) !== '0') {
        const previousNodeId = typeof previousNodeStr === 'bigint' ? Number(previousNodeStr) : parseInt(String(previousNodeStr));
        const color = graphData.flags[index] ? colors[0] : colors[(index + 1) % colors.length];

        blockchainEdges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: `blockchain-node-${previousNodeId}`,
          target: `blockchain-node-${nodeId}`,
          animated: true,
          style: { stroke: color, strokeWidth: 3 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: color,
          },
        });
      }
    });

    // Add final + node to continue the timeline
    if (blockchainNodes.length > 0) {
      const lastNode = blockchainNodes[blockchainNodes.length - 1];
      const addNodeId = `add-final`;

      blockchainNodes.push({
        id: addNodeId,
        type: 'timelineEvent',
        position: { x: lastNode.position.x + horizontalSpacing, y: lastNode.position.y },
        data: {
          label: '',
          description: '',
          nodeType: 'add',
          onAddScene: handleAddEvent,
        }
      });

      blockchainEdges.push({
        id: `edge-${lastNode.id}-${addNodeId}`,
        source: lastNode.id,
        target: addNodeId,
        animated: true,
        style: { stroke: '#cbd5e1', strokeDasharray: '8,8' },
      });
    }

    setNodes(blockchainNodes as any);
    setEdges(blockchainEdges);
    setEventCounter(graphData.nodeIds.length + 1);
  }, [graphData, finalUniverse?.id, id, handleAddEvent]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({
        ...connection,
        animated: true,
        style: { stroke: '#10b981' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
        },
      }, eds));
    },
    [setEdges]
  );

  // Handle node selection
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node);
    if (node.data.nodeType === 'scene') {
      setSelectedEventTitle(node.data.label);
      setSelectedEventDescription(node.data.description);

      // Navigate to event page with specific event
      const universeId = node.data.universeId || id;
      // Use blockchainNodeId if available (for blockchain nodes), otherwise use eventId
      const eventId = node.data.blockchainNodeId || node.data.eventId;

      console.log('🎯 Node clicked:', {
        eventId: node.data.eventId,
        blockchainNodeId: node.data.blockchainNodeId,
        selectedEventId: eventId,
        label: node.data.label,
        universeId
      });

      if (eventId && universeId) {
        // Navigate to event page with universe and event parameters
        const eventUrl = `/event/${universeId}/${eventId}`;
        console.log('🔗 Navigating to:', eventUrl);
        window.location.href = eventUrl;
      }
    }
  }, [id]);

  // Update selected node data
  const updateSelectedNode = useCallback(() => {
    if (selectedNode && selectedNode.data.nodeType === 'scene') {
      setNodes((nds: any) =>
        nds.map((node: any) =>
          node.id === selectedNode.id
            ? {
              ...node,
              data: {
                ...node.data,
                label: selectedEventTitle,
                description: selectedEventDescription,
              },
            }
            : node
        )
      );
    }
  }, [selectedNode, selectedEventTitle, selectedEventDescription, setNodes]);

  const isLoadingAny = isLoadingLeaves || isLoadingFullGraph || isLoadingUniverse || isLoadingCanonChain;

  // Not found state - only for non-blockchain universes
  if (!isBlockchainUniverse && !finalUniverse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Universe Not Found</h1>
          <p className="text-muted-foreground mb-6">The universe with ID "{id}" could not be found.</p>
          <Button asChild>
            <Link to="/universes">← Back to Universes</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoadingUniverse || (isBlockchainUniverse && (isLoadingLeaves || isLoadingFullGraph))) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading universe timeline...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Left Sidebar Component */}
      <UniverseSidebar
        finalUniverse={finalUniverse}
        graphData={{ ...graphData, nodeIds: graphData.nodeIds as any[] }}
        leavesData={leavesData}
        nodes={nodes}
        isLoadingAny={isLoadingAny}
        selectedNode={selectedNode}
        handleAddEvent={handleAddEvent}
        handleRefreshTimeline={handleRefreshTimeline}
        onOpenGovernance={handleOpenGovernance}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <ReactFlowProvider>
          <div className="flex-1 relative overflow-hidden">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gradient-to-br from-background via-background/95 to-muted/20"
              minZoom={0.1}
              maxZoom={2}
            >
              <Background />
              <Controls />

              <Panel position="top-center" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
                <h2 className="text-lg font-semibold">{timelineTitle}</h2>
                <p className="text-sm text-muted-foreground">{timelineDescription}</p>
              </Panel>

              {isLoadingAny && (
                <Panel position="top-right" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="animate-spin w-4 h-4 border-2 border-primary border-t-transparent rounded-full"></div>
                    Loading blockchain data...
                  </div>
                </Panel>
              )}
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>

      {/* Bottom Panel - Event Creation (Google Veo Flow Style) */}
      {(() => {
        // Find previous event's video URL and description - always use the last event or the source node
        const sourceNode = sourceNodeId
          ? nodes.find(n => n.data.eventId === sourceNodeId || n.id === sourceNodeId)
          : nodes.filter((n: any) => n.data.nodeType === 'scene' && n.data.videoUrl).pop();
        const previousEventVideoUrl = sourceNode?.data.videoUrl || null;
        const previousEventDescription = sourceNode?.data.description || null;
        const previousEventTitle = sourceNode?.data.label || null;

        return (
          <FlowCreationPanel
            showVideoDialog={showVideoDialog}
            setShowVideoDialog={setShowVideoDialog}
            videoTitle={videoTitle}
            setVideoTitle={setVideoTitle}
            videoDescription={videoDescription}
            setVideoDescription={setVideoDescription}
            additionType={additionType}
            selectedCharacters={selectedCharacters}
            setSelectedCharacters={setSelectedCharacters}
            showCharacterSelector={showCharacterSelector}
            setShowCharacterSelector={setShowCharacterSelector}
            showCharacterGenerator={showCharacterGenerator}
            setShowCharacterGenerator={setShowCharacterGenerator}
            charactersData={charactersData}
            isLoadingCharacters={isLoadingCharacters}
            characterName={characterName}
            setCharacterName={setCharacterName}
            characterDescription={characterDescription}
            setCharacterDescription={setCharacterDescription}
            characterStyle={characterStyle}
            setCharacterStyle={setCharacterStyle}
            isGeneratingCharacter={isGeneratingCharacter}
            generatedCharacter={generatedCharacter}
            setGeneratedCharacter={setGeneratedCharacter}
            generateCharacterMutation={generateCharacterMutation}
            saveCharacterMutation={saveCharacterMutation}
            generatedImageUrl={generatedImageUrl}
            isGeneratingImage={isGeneratingImage}
            imageFormat={imageFormat}
            setImageFormat={(format: string) => setImageFormat(format as 'landscape_16_9' | 'portrait_16_9' | 'landscape_4_3' | 'portrait_4_3')}
            handleGenerateEventImage={handleGenerateEventImage}
            showVideoStep={showVideoStep}
            setShowVideoStep={setShowVideoStep}
            uploadedUrl={uploadedUrl}
            setUploadedUrl={setUploadedUrl}
            isUploading={isUploading}
            uploadToTmpfiles={uploadToTmpfiles}
            generatedVideoUrl={generatedVideoUrl}
            setGeneratedVideoUrl={setGeneratedVideoUrl}
            setGeneratedImageUrl={setGeneratedImageUrl}
            isGeneratingVideo={isGeneratingVideo}
            videoPrompt={videoPrompt}
            setVideoPrompt={setVideoPrompt}
            videoRatio={videoRatio}
            setVideoRatio={setVideoRatio}
            selectedVideoModel={selectedVideoModel}
            setSelectedVideoModel={setSelectedVideoModel}
            selectedVideoDuration={selectedVideoDuration}
            setSelectedVideoDuration={setSelectedVideoDuration}
            negativePrompt={negativePrompt}
            setNegativePrompt={setNegativePrompt}
            handleGenerateVideo={handleGenerateVideo}
            isSavingToContract={isSavingToContract}
            contractSaved={contractSaved}
            isSavingToFilecoin={isSavingToStorage}
            filecoinSaved={storageSaved}
            pieceCid={storageKey}
            handleSaveToContract={handleSaveToContract}
            handleCreateEvent={handleCreateEvent}
            previousEventVideoUrl={previousEventVideoUrl}
            previousEventDescription={previousEventDescription}
            previousEventTitle={previousEventTitle}
            statusMessage={statusMessage}
            setStatusMessage={setStatusMessage}
            selectedImageCharacters={selectedImageCharacters}
            setSelectedImageCharacters={setSelectedImageCharacters}
            handleGenerateCharacterFrame={handleGenerateCharacterFrame}
            refetchCharacters={refetchCharacters}
          />
        );
      })()}

      {/* Governance Sidebar */}
      <GovernanceSidebar
        isOpen={showGovernanceSidebar}
        onClose={() => setShowGovernanceSidebar(false)}
        finalUniverse={finalUniverse}
        nodes={nodes}
        onRefresh={handleRefreshTimeline}
      />
    </div>
  );
}

export const Route = createFileRoute("/universe/$id")({
  component: UniverseTimelineEditor,
});