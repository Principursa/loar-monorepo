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
import { EventCreationSidebar } from '@/components/EventCreationSidebar';

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
  const [selectedVideoModel, setSelectedVideoModel] = useState<'fal-veo3' | 'fal-kling' | 'fal-wan25'>('fal-veo3');
  const [negativePrompt, setNegativePrompt] = useState("");
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoRatio, setVideoRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [imageFormat, setImageFormat] = useState<'landscape_16_9' | 'portrait_16_9' | 'landscape_4_3' | 'portrait_4_3'>('landscape_16_9');
  
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
  
  // File upload state  
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Contract integration state
  const [isSavingToContract, setIsSavingToContract] = useState(false);
  const [contractSaved, setContractSaved] = useState(false);
  
  // Filecoin integration state
  const [isSavingToFilecoin, setIsSavingToFilecoin] = useState(false);
  const [filecoinSaved, setFilecoinSaved] = useState(false);
  const [pieceCid, setPieceCid] = useState<string | null>(null);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Debug: Log when generatedVideoUrl changes
  useEffect(() => {
    console.log('generatedVideoUrl changed to:', generatedVideoUrl);
    console.log('Stack trace:', new Error().stack);
  }, [generatedVideoUrl]);

  // Custom hook to create blob URL from Filecoin PieceCID
  const createFilecoinBlobUrl = useCallback(async (pieceCid: string, filename: string = 'video.mp4') => {
    try {
      console.log('Creating blob URL for PieceCID:', pieceCid);
      
      // Download from Filecoin via tRPC
      const result = await trpcClient.synapse.download.query({ pieceCid });
      
      // Convert base64 back to Uint8Array
      const binaryData = Uint8Array.from(atob(result.data), c => c.charCodeAt(0));
      
      // Create blob with proper MIME type
      const mimeType = filename.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';
      const blob = new Blob([binaryData], { type: mimeType });
      
      // Create URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      console.log('Created blob URL:', blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.error('Failed to create blob URL from Filecoin:', error);
      throw error;
    }
  }, []);

  // Contract hooks - we'll use the write contract directly for universe-specific contracts
  const { writeContractAsync } = useWriteContract();

  // Blockchain data fetching hooks
  const useUniverseLeaves = (contractAddress?: string) => {
    if (!contractAddress) {
      console.log('useUniverseLeaves - No contract address provided');
      return { data: null, isLoading: false, refetch: async () => {} };
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
      return { data: null, isLoading: false, refetch: async () => {} };
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

  // Try to get universe data from localStorage
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
    isDefault: false
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
  
  // Get timeline data: use blockchain data if available, otherwise dummy data
  const graphData = useMemo(() => {
    console.log('=== GRAPH DATA DEBUG ===');
    console.log('Is Blockchain Universe:', isBlockchainUniverse);
    console.log('Timeline Contract Address:', timelineContractAddress);
    console.log('Full Graph Data:', fullGraphData);
    console.log('=========================');
    
    if (timelineContractAddress && fullGraphData) {
      // Convert blockchain data to the expected format
      const [nodeIds, urls, descriptions, previousIds, nextIds, flags] = fullGraphData;
      
      console.log('=== BLOCKCHAIN DATA PARSED ===');
      console.log('Node IDs:', nodeIds);
      console.log('URLs:', urls);
      console.log('Descriptions:', descriptions);
      console.log('Previous IDs:', previousIds);
      console.log('==============================');
      
      return {
        nodeIds: nodeIds || [],
        urls: urls || [],
        descriptions: descriptions || [],
        previousNodes: previousIds || [],
        children: nextIds || [],
        flags: flags || []
      };
    }
    
    // Return empty data structure if no data found
    return {
      nodeIds: [], urls: [], descriptions: [], previousNodes: [], children: [], flags: []
    };
  }, [id, isBlockchainUniverse, fullGraphData]);

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

  // Generate character mutation (without saving to DB)
  const generateCharacterMutation = useMutation({
    mutationFn: async (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk' }) => {
      const result = await trpcClient.fal.generateCharacter.mutate({
        ...input,
        saveToDatabase: false // Don't save automatically
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

  // Image generation mutation using Qwen image-edit-plus for better quality and control
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
          
          // Use character image URLs directly - don't over-process them
          const processedImageUrls = selectedChars
            .filter((char: any) => char.image_url && char.image_url.trim()) // Filter out empty URLs
            .map((char: any) => char.image_url); // Use URLs directly without weserv processing
          
          console.log('🎭 === CHARACTER SCENE EDITING WITH QWEN ===');
          console.log('Selected characters:', selectedChars.map((c: any) => c.character_name));
          console.log('Number of characters:', selectedChars.length);
          console.log('Original URLs:', selectedChars.map((c: any) => c.image_url));
          console.log('Processed URLs:', processedImageUrls);
          console.log('Scene prompt:', editPrompt);
          console.log('Image format:', imageFormat);
          console.log('🚀 Calling FAL imageToImage...');
          
          // Validate we have at least one valid image URL
          if (processedImageUrls.length === 0) {
            throw new Error('No valid character images found for editing');
          }
          
          try {
            // ALWAYS use Qwen image-edit-plus for character frame generation
            console.log('🎯 Using fal-ai/qwen-image-edit-plus for character frame generation');
            
            const result = await trpcClient.fal.imageToImage.mutate({
              prompt: `Create a cinematic frame: ${editPrompt}. Professional photography, detailed environment, high quality composition`,
              imageUrls: processedImageUrls, // Character images as reference for Qwen
              imageSize: imageFormat, // Use selected format (landscape_16_9, portrait_16_9, etc.)
              numImages: 1,
              negativePrompt: "blurry, low quality, distorted, bad anatomy, deformed, ugly, amateur"
            });
            
            console.log('✅ Qwen image-edit-plus result:', result);
            
            if (result.status !== 'completed' || !result.imageUrl) {
              throw new Error(result.error || 'Qwen frame generation failed');
            }
            
            console.log('🎉 QWEN CHARACTER FRAME GENERATION SUCCESSFUL!');
            return { success: true, imageUrl: result.imageUrl };
          } catch (imageToImageError) {
            console.error('❌ QWEN IMAGE-EDIT-PLUS FAILED:', imageToImageError);
            console.error('Error details:', JSON.stringify(imageToImageError, null, 2));
            
            // More specific error message for Qwen failures
            const errorMessage = imageToImageError instanceof Error 
              ? imageToImageError.message 
              : 'Qwen image-edit-plus failed';
            
            throw new Error(`Frame generation failed: ${errorMessage}. Please check character images and try again.`);
          }
        }
      }
      
      // For scenes without characters, we need a base image to transform
      // We'll create a simple base composition and then enhance it with Qwen
      console.log('🎨 Generating scene without characters using Qwen image-edit-plus');
      
      try {
        // First, generate a basic composition with Nano Banana
        const baseResult = await trpcClient.fal.generateImage.mutate({
          prompt: `simple basic composition for: ${prompt}, rough sketch, basic layout`,
          model: 'fal-ai/nano-banana',
          imageSize: imageFormat,
          numImages: 1
        });
        
        if (baseResult.status !== 'completed' || !baseResult.imageUrl) {
          throw new Error('Failed to generate base composition');
        }
        
        console.log('✅ Base composition generated, now enhancing with Qwen...');
        
        // Then enhance it with Qwen image-edit-plus for higher quality
        const enhancedResult = await trpcClient.fal.imageToImage.mutate({
          prompt: `${prompt}, cinematic scene, high quality, detailed environment, professional photography, dramatic lighting`,
          imageUrls: [baseResult.imageUrl],
          imageSize: imageFormat,
          numImages: 1,
          negativePrompt: "blurry, low quality, distorted, sketch, rough, unfinished"
        });
        
        if (enhancedResult.status !== 'completed' || !enhancedResult.imageUrl) {
          throw new Error(enhancedResult.error || 'Failed to enhance scene with Qwen');
        }
        
        console.log('🎉 QWEN ENHANCED SCENE SUCCESSFUL!');
        return { success: true, imageUrl: enhancedResult.imageUrl };
      } catch (error) {
        console.error('❌ QWEN ENHANCEMENT FAILED, falling back to basic generation:', error);
        
        // Fallback to basic Nano Banana generation
        const fallbackResult = await trpcClient.fal.generateImage.mutate({
          prompt: `${prompt}, cinematic scene, high quality, detailed environment`,
          model: 'fal-ai/nano-banana',
          imageSize: imageFormat,
          numImages: 1
        });
        
        if (fallbackResult.status !== 'completed' || !fallbackResult.imageUrl) {
          throw new Error(fallbackResult.error || 'Failed to generate scene image');
        }
        
        return { success: true, imageUrl: fallbackResult.imageUrl };
      }
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        console.log('=== GENERATED IMAGE URL ===');
        console.log('Image URL:', data.imageUrl);
        console.log('Image URL Length:', data.imageUrl.length);
        console.log('Starts with data:', data.imageUrl.startsWith('data:'));
        console.log('===========================');
        
        setGeneratedImageUrl(data.imageUrl);
        setShowVideoStep(true); // Show video generation step after image is ready
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
      
      // More specific error message
      let errorMessage = "Failed to generate image. ";
      if (selectedCharacters.length > 0) {
        errorMessage += "Character image editing failed. ";
      }
      errorMessage += "Please try again.";
      
      if (error.message?.includes('FAL_KEY')) {
        errorMessage = "FAL API key is missing. Please configure FAL_KEY in environment variables.";
      } else if (error.message?.includes('nano-banana')) {
        errorMessage = "Nano Banana model access issue. Falling back to regular generation.";
      }
      
      alert(errorMessage);
    }
  });

  // Handle image generation for the event
  const handleGenerateEventImage = useCallback(async () => {
    if (!videoDescription.trim()) return;
    
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
          model: "fal-ai/veo3/fast/image-to-video",
          duration: 5,
          aspectRatio: videoRatio,
          motionStrength: 127,
          negativePrompt: negativePrompt || undefined
        });
        console.log('Veo3 video result:', result);
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-kling') {
        const result = await trpcClient.fal.klingVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: 5,
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
          duration: 5,
          resolution: "1080p",
          negativePrompt: negativePrompt || undefined,
          enablePromptExpansion: true
        });
        console.log('Wan25 video result:', result);
        return { videoUrl: result.videoUrl }; // Use actual video URL
      }
      
      throw new Error('Invalid video model selected');
    },
    onSuccess: (data) => {
      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);
      }
    },
    onError: (error) => {
      console.error("Error generating video:", error);
      alert("Failed to generate video. Please try again.");
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
    if (!generatedImageUrl) return;
    
    // Use uploaded URL if available, otherwise use the generated image URL
    const imageUrlToUse = uploadedUrl || generatedImageUrl;
    
    console.log('=== VIDEO GENERATION DEBUG ===');
    console.log('Generated Image URL:', generatedImageUrl);
    console.log('Uploaded URL:', uploadedUrl);
    console.log('Using URL for video:', imageUrlToUse);
    console.log('Image URL type:', imageUrlToUse.startsWith('data:') ? 'Data URL' : 'HTTP URL');
    console.log('Video Description:', videoDescription);
    console.log('===============================');
    
    setIsGeneratingVideo(true);
    try {
      await generateVideoMutation.mutateAsync({
        imageUrl: imageUrlToUse,
        prompt: `Animate this scene: ${videoDescription}`
      });
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [generatedImageUrl, uploadedUrl, videoDescription, generateVideoMutation]);

  // Save to contract function (now includes Filecoin upload)
  const handleSaveToContract = useCallback(async () => {
    if (!generatedVideoUrl || !videoTitle || !videoDescription) {
      alert('Video, title, and description are required to save to contract');
      return;
    }

    setIsSavingToContract(true);
    setIsSavingToFilecoin(true);
    
    try {
      // Step 1: Upload to Filecoin first
      console.log('Step 1: Uploading video to Filecoin via Synapse. URL being used:', generatedVideoUrl);
      console.log('Current state - videoTitle:', videoTitle, 'videoDescription:', videoDescription);
      
      let filecoinPieceCid: string | null = null;
      try {
        const filecoinResult = await trpcClient.synapse.uploadFromUrl.mutate({
          url: generatedVideoUrl
        });
        
        console.log('Filecoin upload successful. PieceCID:', filecoinResult);
        console.log('PieceCID type:', typeof filecoinResult);
        console.log('PieceCID stringified:', JSON.stringify(filecoinResult));
        
        // Convert to string if it's an object
        let pieceCidString: string;
        if (typeof filecoinResult === 'string') {
          pieceCidString = filecoinResult;
        } else if (filecoinResult && typeof filecoinResult === 'object') {
          // Try different ways to extract the string value from the PieceCID object
          pieceCidString = filecoinResult.toString?.() || 
                          filecoinResult.value || 
                          filecoinResult.cid || 
                          filecoinResult._baseValue || 
                          JSON.stringify(filecoinResult);
          console.log('Extracted PieceCID string:', pieceCidString);
        } else {
          pieceCidString = String(filecoinResult);
        }
        
        filecoinPieceCid = pieceCidString;
        setPieceCid(pieceCidString);
        setFilecoinSaved(true);
        
        // Create blob URL from Filecoin for display
        try {
          const blobUrl = await createFilecoinBlobUrl(pieceCidString, 'video.mp4');
          setGeneratedVideoUrl(blobUrl);
          console.log('Updated video display to use Filecoin blob URL:', blobUrl);
        } catch (blobError) {
          console.error('Failed to create blob URL, keeping original URL:', blobError);
          console.log('Keeping original URL for display:', generatedVideoUrl);
        }
      } catch (filecoinError) {
        console.error('Filecoin upload failed, proceeding with original URL:', filecoinError);
        // Continue with original URL if Filecoin fails
      }
      
      setIsSavingToFilecoin(false);

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
      
      // Step 3: Determine the video URL to store - prefer Filecoin PieceCID if available
      const videoUrlForContract = filecoinPieceCid 
        ? filecoinPieceCid // Store raw PieceCID 
        : generatedVideoUrl;

      console.log('Step 2: Saving to contract:', {
        link: videoUrlForContract,
        originalLink: generatedVideoUrl,
        pieceCid: filecoinPieceCid,
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
      const successMessage = filecoinPieceCid 
        ? `Successfully saved to Filecoin and blockchain!\nPieceCID: ${filecoinPieceCid}\nTransaction: ${txHash}`
        : `Successfully saved to blockchain! Transaction: ${txHash}`;
      alert(successMessage);
      
      // Refresh the blockchain data to show the new node
      setTimeout(async () => {
        if (isBlockchainUniverse) {
          // Specifically refetch blockchain data
          await refetchLeaves();
          await refetchFullGraph();
          console.log('Refetched blockchain data after contract save');
        }
        // Invalidate all queries as fallback
        await queryClient.invalidateQueries();
        console.log('Refreshed blockchain data - new node should appear');
      }, 5000); // Wait 5 seconds for blockchain to update
      
    } catch (error) {
      console.error('Error saving to contract:', error);
      alert('Failed to save to contract: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSavingToContract(false);
      setIsSavingToFilecoin(false);
    }
  }, [generatedVideoUrl, videoTitle, videoDescription, graphData.nodeIds, writeContractAsync, isBlockchainUniverse, id, chainId]);

  // Manual refresh function
  const handleRefreshTimeline = useCallback(async () => {
    console.log('Manually refreshing timeline...');
    if (isBlockchainUniverse) {
      // Specifically refetch blockchain data
      await refetchLeaves();
      await refetchFullGraph();
      console.log('Refetched blockchain data for universe:', id);
    }
    // Also invalidate all queries as fallback
    await queryClient.invalidateQueries();
  }, [queryClient, isBlockchainUniverse, refetchLeaves, refetchFullGraph, id]);

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
    setNegativePrompt(""); // Reset negative prompt
    setVideoPrompt(""); // Reset video prompt
    setVideoRatio("16:9"); // Reset video ratio
    setImageFormat('landscape_16_9'); // Reset image format
    setShowVideoDialog(true);
  }, []);

  // Handle creating actual event after dialog submission
  const handleCreateEvent = useCallback(() => {
    if (!videoTitle.trim()) return;

    // Find source node if specified
    const sourceNode = sourceNodeId 
      ? nodes.find(n => n.data.eventId === sourceNodeId)
      : null;
    const lastEventNode = nodes.filter((n: any) => n.data.nodeType === 'scene').pop();
    const referenceNode = sourceNode || lastEventNode;
    
    // Generate appropriate event ID based on addition type
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
      // Linear addition to the right
      const rightmostX = nodes.length > 0 ? Math.max(...nodes.map((n: any) => n.position.x)) : 100;
      newEventPosition = { x: rightmostX + 480, y: 200 };
      newAddPosition = { x: rightmostX + 960, y: 200 };
    }

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
  }, [nodes, edges, eventCounter, id, videoTitle, videoDescription, additionType, sourceNodeId, handleAddEvent]);

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
        url, description, previousNode, parentId, position: { x, y }
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
          timelineId: `timeline-1`,
          universeId: finalUniverse?.id || id,
          isRoot: String(previousNode) === '0' || !previousNode,
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
      
      // Navigate to event detail page using new route structure
      const universeId = node.data.universeId || id;
      const eventId = node.data.eventId;
      
      if (eventId && universeId) {
        // Use window.location for navigation with new route structure: /event/{universeId}/{eventId}
        const eventUrl = `/event/${universeId}/${eventId}`;
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

  const isLoadingAny = isLoadingLeaves || isLoadingFullGraph || isLoadingUniverse;

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
        graphData={graphData}
        leavesData={leavesData}
        nodes={nodes}
        isLoadingAny={isLoadingAny}
        selectedNode={selectedNode}
        handleAddEvent={handleAddEvent}
        handleRefreshTimeline={handleRefreshTimeline}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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

      {/* Right Sidebar - Event Creation */}
      {showVideoDialog && (
        <EventCreationSidebar
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
          setImageFormat={setImageFormat}
          handleGenerateEventImage={handleGenerateEventImage}
          showVideoStep={showVideoStep}
          uploadedUrl={uploadedUrl}
          isUploading={isUploading}
          uploadToTmpfiles={uploadToTmpfiles}
          generatedVideoUrl={generatedVideoUrl}
          isGeneratingVideo={isGeneratingVideo}
          videoPrompt={videoPrompt}
          setVideoPrompt={setVideoPrompt}
          videoRatio={videoRatio}
          setVideoRatio={setVideoRatio}
          selectedVideoModel={selectedVideoModel}
          setSelectedVideoModel={setSelectedVideoModel}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          handleGenerateVideo={handleGenerateVideo}
          isSavingToContract={isSavingToContract}
          contractSaved={contractSaved}
          isSavingToFilecoin={isSavingToFilecoin}
          filecoinSaved={filecoinSaved}
          pieceCid={pieceCid}
          handleSaveToContract={handleSaveToContract}
          handleCreateEvent={handleCreateEvent}
        />
      )}
    </div>
  );
}

export const Route = createFileRoute("/universe/$id")({
  component: UniverseTimelineEditor,
});
