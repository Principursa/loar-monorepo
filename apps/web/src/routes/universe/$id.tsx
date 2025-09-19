import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Film, Plus, Settings, Clock, Users, Sparkles, Image, Loader2, RefreshCw, UserPlus, Wand2 } from "lucide-react";
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
import { TimelineActions } from '@/components/TimelineActions';
import { trpcClient } from '@/utils/trpc';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useReadContract, useChainId, useWriteContract } from 'wagmi';
import { trpc } from '@/utils/trpc';
import { timelineAbi } from '@/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type Address } from 'viem';
import type { TimelineNodeData } from '@/components/flow/TimelineNodes';

interface UniverseParams {
  id: string;
}

// Register custom node types
const nodeTypes = {
  timelineEvent: TimelineEventNode,
};

function UniverseTimelineEditor() {
  const { id } = useParams({ from: "/universe/$id" });
  const navigate = useNavigate();
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
  
  // Image generation state (now part of event creation)
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
  
  // File upload state  
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  // Contract integration state
  const [isSavingToContract, setIsSavingToContract] = useState(false);
  const [contractSaved, setContractSaved] = useState(false);
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

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
  
  // Dummy universe data for testing
  const dummyUniverses = {
    'cyberpunk-2077': {
      id: 'cyberpunk-2077',
      name: 'Cyberpunk 2077',
      description: 'A dystopian future where technology and humanity collide in Night City',
      address: '0xabcd...ef01',
      creator: '0x1234...5678',
      tokenAddress: '0x1111...1111',
      governanceAddress: '0x2222...2222',
      isDefault: false
    },
    'space-odyssey': {
      id: 'space-odyssey',
      name: 'Space Odyssey',
      description: 'An epic journey through the cosmos exploring alien civilizations',
      address: '0xbcde...f012',
      creator: '0x2345...6789',
      tokenAddress: '0x3333...3333',
      governanceAddress: '0x4444...4444',
      isDefault: false
    },
    'medieval-kingdoms': {
      id: 'medieval-kingdoms',
      name: 'Medieval Kingdoms',
      description: 'Knights, dragons, and magic in a fantasy realm of endless adventures',
      address: '0xcdef...0123',
      creator: '0x3456...789a',
      tokenAddress: '0x5555...5555',
      governanceAddress: '0x6666...6666',
      isDefault: false
    },
    'detective-noir': {
      id: 'detective-noir',
      name: 'Detective Noir',
      description: 'Dark mysteries in 1940s Los Angeles with corruption and crime',
      address: '0xdef0...1234',
      creator: '0x4567...89ab',
      tokenAddress: '0x7777...7777',
      governanceAddress: '0x8888...8888',
      isDefault: false
    },
    'zombie-apocalypse': {
      id: 'zombie-apocalypse',
      name: 'Zombie Apocalypse',
      description: 'Survival horror in a world overrun by the undead',
      address: '0xef01...2345',
      creator: '0x5678...9abc',
      tokenAddress: '0x9999...9999',
      governanceAddress: '0xaaaa...aaaa',
      isDefault: false
    },
    'blockchain-universe': {
      id: 'blockchain-universe',
      name: 'Blockchain Universe',
      description: 'A decentralized narrative universe powered by smart contracts',
      address: null,
      isDefault: true
    }
  };

  // Dummy timeline data for testing
  const dummyTimelineData = {
    'cyberpunk-2077': {
      nodeIds: [1, 2, 3, 4],
      urls: [
        'https://example.com/video1',
        'https://example.com/video2', 
        'https://example.com/video3',
        'https://example.com/video4'
      ],
      descriptions: [
        'V wakes up in Night City',
        'Meeting with Jackie and T-Bug',
        'The heist at Arasaka Tower',
        'Johnny Silverhand appears'
      ],
      previousNodes: [0, 1, 2, 3],
      children: [[], [], [], []],
      flags: [true, true, false, true]
    },
    'space-odyssey': {
      nodeIds: [1, 2, 3],
      urls: [
        'https://example.com/space1',
        'https://example.com/space2',
        'https://example.com/space3'
      ],
      descriptions: [
        'Launch from Earth Station',
        'First contact with aliens',
        'Discovery of ancient artifact'
      ],
      previousNodes: [0, 1, 2],
      children: [[], [], []],
      flags: [true, true, true]
    },
    'medieval-kingdoms': {
      nodeIds: [1, 2, 3, 4, 5],
      urls: [
        'https://example.com/medieval1',
        'https://example.com/medieval2',
        'https://example.com/medieval3',
        'https://example.com/medieval4',
        'https://example.com/medieval5'
      ],
      descriptions: [
        'The young knight\'s quest begins',
        'Battle with the dragon',
        'Meeting the wise wizard',
        'Storm the evil castle',
        'Rescue the princess'
      ],
      previousNodes: [0, 1, 1, 3, 4],
      children: [[], [], [], [], []],
      flags: [true, true, false, true, true]
    },
    'detective-noir': {
      nodeIds: [1, 2, 3],
      urls: [
        'https://example.com/noir1',
        'https://example.com/noir2',
        'https://example.com/noir3'
      ],
      descriptions: [
        'The case begins with a mysterious dame',
        'Following clues through the city',
        'Confronting the corrupt mayor'
      ],
      previousNodes: [0, 1, 2],
      children: [[], [], []],
      flags: [true, false, true]
    },
    'zombie-apocalypse': {
      nodeIds: [1, 2, 3, 4],
      urls: [
        'https://example.com/zombie1',
        'https://example.com/zombie2',
        'https://example.com/zombie3',
        'https://example.com/zombie4'
      ],
      descriptions: [
        'The outbreak begins',
        'Finding other survivors',
        'Securing the abandoned mall',
        'The final escape'
      ],
      previousNodes: [0, 1, 2, 3],
      children: [[], [], [], []],
      flags: [true, true, true, true]
    }
  };

  // Try to get universe data from localStorage first, then fall back to dummy data
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

  // Use localStorage data if available, otherwise fall back to dummy data
  const universe = universeFromStorage || dummyUniverses[id as keyof typeof dummyUniverses] || null;
  const isLoadingUniverse = false;
  
  // For blockchain universes (addresses starting with 0x), use blockchain data
  const isBlockchainUniverse = id?.startsWith('0x');
  
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
    
    // Fall back to dummy data for testing
    return dummyTimelineData[id as keyof typeof dummyTimelineData] || {
      nodeIds: [], urls: [], descriptions: [], previousNodes: [], children: [], flags: []
    };
  }, [id, isBlockchainUniverse, fullGraphData]);

  // Commented out real API calls for testing
  // const { data: cinematicUniverse, isLoading: isLoadingUniverse } = useQuery({
  //   queryKey: ['cinematicUniverse', id],
  //   queryFn: () => trpcClient.cinematicUniverses.get.query({ id }),
  //   enabled: id !== 'blockchain-universe',
  // });
  
  // const { data: leavesData, isLoading: isLoadingLeaves } = useUniverseLeaves(universe?.address || undefined);
  // const { data: fullGraphData, isLoading: isLoadingFullGraph } = useUniverseFullGraph(universe?.address || undefined);

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

  // Generate character mutation
  const generateCharacterMutation = useMutation({
    mutationFn: async (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk' }) => {
      const result = await trpcClient.fal.generateCharacter.mutate(input);
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character generated:', data);
      setShowCharacterGenerator(false);
      setIsGeneratingCharacter(false);
      
      // Add to selected characters
      if (data.characterId) {
        setSelectedCharacters(prev => [...prev, data.characterId!]);
      }
      
      // Refetch characters to include the new one
      await refetchCharacters();
    },
    onError: (error) => {
      console.error('Character generation failed:', error);
      alert("Failed to generate character. Please try again.");
      setIsGeneratingCharacter(false);
    }
  });

  // Image generation mutation with character support
  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      // Check if we have selected characters to edit into the scene
      if (selectedCharacters.length > 0 && charactersData?.characters) {
        const selectedChars = charactersData.characters.filter((c: any) => selectedCharacters.includes(c.id));
        
        if (selectedChars.length > 0) {
          // Use the first character's image as base for editing
          const primaryCharacter = selectedChars[0];
          const characterNames = selectedChars.map((c: any) => c.character_name).join(' and ');
          
          // Create edit prompt that places character in the scene
          const editPrompt = `${characterNames} ${prompt}, cinematic scene, high quality, detailed environment`;
          
          console.log('Editing character into scene:', {
            characterName: primaryCharacter.character_name,
            characterImage: primaryCharacter.image_url,
            scenePrompt: editPrompt
          });
          
          try {
            // Process character image URL through weserv.nl for better compatibility
            const processedImageUrl = `https://images.weserv.nl/?url=${encodeURIComponent(primaryCharacter.image_url)}`;
            
            console.log('🎭 === CHARACTER SCENE EDITING ===');
            console.log('Character name:', primaryCharacter.character_name);
            console.log('Original image URL:', primaryCharacter.image_url);
            console.log('Processed image URL:', processedImageUrl);
            console.log('Scene prompt:', editPrompt);
            console.log('🚀 Calling FAL editImage...');
            
            // Use Nano Banana image editing to place character in scene
            const result = await trpcClient.fal.editImage.mutate({
              prompt: editPrompt,
              imageUrls: [processedImageUrl], // Now using array format as per FAL API
              strength: 0.7, // Moderate transformation to keep character recognizable
              negativePrompt: "blurry, low quality, distorted"
            });
            
            console.log('✅ FAL editImage result:', result);
            
            if (result.status !== 'completed' || !result.imageUrl) {
              throw new Error(result.error || 'Failed to edit character into scene');
            }
            
            console.log('🎉 CHARACTER EDITING SUCCESSFUL!');
            return { success: true, imageUrl: result.imageUrl };
          } catch (editError) {
            console.error('❌ CHARACTER EDITING FAILED:', editError);
            throw editError; // No fallback - throw the actual error
          }
        }
      }
      
      // Fallback to regular image generation for scenes without characters
      console.log('Generating scene without characters using Gemini');
      const result = await trpcClient.gemini.generateImage.mutate({
        prompt
      });
      return result;
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

  // Handle video generation with LumaAI using existing video service
  const generateVideoMutation = useMutation({
    mutationFn: async ({ imageUrl, prompt }: { imageUrl: string; prompt?: string }) => {
      console.log('Generating video with:', {
        imageUrl,
        prompt: prompt || videoDescription
      });
      
      const result = await trpcClient.video.generateAndWait.mutate({
        prompt: prompt || videoDescription,
        imageUrl, // Use the actual generated image
        model: 'ray-flash-2', // Fast model like in Python test
        duration: '5s'
      });
      return result;
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

  // Save to contract function
  const handleSaveToContract = useCallback(async () => {
    if (!generatedVideoUrl || !videoTitle || !videoDescription) {
      alert('Video, title, and description are required to save to contract');
      return;
    }

    setIsSavingToContract(true);
    try {
      // Find the last node ID to use as previous
      const lastNodeId = Math.max(...(graphData.nodeIds.map(id => Number(id)) || [0]), 0);
      
      console.log('Saving to contract:', {
        link: generatedVideoUrl,
        plot: videoDescription,
        previous: lastNodeId,
        title: videoTitle
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
        args: [generatedVideoUrl, videoDescription, BigInt(lastNodeId)]
      });

      console.log('Transaction submitted:', txHash);
      setContractSaved(true);
      
      // Show success message
      alert('Successfully saved to blockchain! Transaction: ' + txHash);
      
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
    console.log('handleAddEvent called:', { type, nodeId });
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
    setShowVideoDialog(true);
  }, []);

  // Handle creating actual event after dialog submission
  const handleCreateEvent = useCallback(() => {
    if (!videoTitle.trim()) return;

    const newEventId = `event-${Date.now()}`;
    const newAddId = `add-${Date.now()}`;
    
    // Find source node if specified
    const sourceNode = sourceNodeId 
      ? nodes.find(n => n.data.eventId === sourceNodeId)
      : null;
    const lastEventNode = nodes.filter((n: any) => n.data.nodeType === 'scene').pop();
    const referenceNode = sourceNode || lastEventNode;
    
    console.log('handleCreateEvent debug:', { 
      additionType, 
      sourceNodeId, 
      sourceNode: sourceNode ? { id: sourceNode.id, position: sourceNode.position, eventId: sourceNode.data.eventId } : null,
      referenceNode: referenceNode ? { id: referenceNode.id, position: referenceNode.position } : null
    });
    
    // Calculate position based on addition type
    let newEventPosition;
    let newAddPosition;
    
    if (additionType === 'branch' && sourceNode) {
      // Create branch: forward and below the source node
      const branchY = sourceNode.position.y + 150;
      newEventPosition = { x: sourceNode.position.x + 280, y: branchY };
      newAddPosition = { x: sourceNode.position.x + 630, y: branchY };
    } else {
      // Linear addition to the right
      const rightmostX = nodes.length > 0 ? Math.max(...nodes.map((n: any) => n.position.x)) : 100;
      newEventPosition = { x: rightmostX + 320, y: 200 };
      newAddPosition = { x: rightmostX + 670, y: 200 };
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
    const horizontalSpacing = 320;
    const verticalSpacing = 150;
    const startY = 200;

    // Colors for different types
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Create nodes from blockchain data in left-to-right layout
    graphData.nodeIds.forEach((nodeIdStr, index) => {
      const nodeId = typeof nodeIdStr === 'bigint' ? Number(nodeIdStr) : parseInt(String(nodeIdStr));
      const url = graphData.urls[index] || '';
      const description = graphData.descriptions[index] || '';
      const previousNode = graphData.previousNodes[index] || '';
      const isCanon = graphData.flags[index] || false;
      
      // Debug: Log the node creation data
      console.log(`Creating node ${nodeId}:`, { url, description, previousNode });
      
      const x = 100 + (index * horizontalSpacing);
      const y = startY + (isCanon ? 0 : (index % 2) * verticalSpacing);
      const color = isCanon ? colors[0] : colors[(index + 1) % colors.length];
      
      blockchainNodes.push({
        id: `blockchain-node-${nodeId}`,
        type: 'timelineEvent',
        position: { x, y },
        data: {
          label: description && description.length > 0 && description !== `Timeline event ${nodeId}` 
            ? description.substring(0, 50) + (description.length > 50 ? '...' : '')
            : `Event ${nodeId}`,
          description: description || `Timeline event ${nodeId}`,
          videoUrl: url,
          timelineColor: color,
          nodeType: 'scene',
          eventId: nodeId.toString(),
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
  }, [graphData, universe?.id, handleAddEvent]);

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

  // Loading state - only show loading if we're actually loading blockchain data
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

  // For blockchain universes, create a default universe object if not found in localStorage
  const finalUniverse = universe || (isBlockchainUniverse ? {
    id: id,
    name: `Universe ${id.slice(0, 8)}...`,
    description: 'Blockchain-based cinematic universe',
    address: id,
    isDefault: false
  } : null);

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

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar */}
      <div className="w-80 border-r bg-card p-4 overflow-y-auto">
        <div className="space-y-6">
          {/* Back Button */}
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-4">
              <Link to="/universes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Universes
              </Link>
            </Button>
          </div>

          {/* Universe Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Universe Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="universe-name">Name</Label>
                <div className="text-sm font-medium">{finalUniverse?.name}</div>
              </div>
              <div>
                <Label htmlFor="universe-description">Description</Label>
                <div className="text-sm text-muted-foreground">{finalUniverse?.description}</div>
              </div>
              {!finalUniverse?.isDefault && (
                <div className="text-xs text-muted-foreground">
                  <div>Creator: {finalUniverse?.creator?.slice(0, 6)}...{finalUniverse?.creator?.slice(-4)}</div>
                  <div>Contract: {finalUniverse?.address?.slice(0, 6)}...{finalUniverse?.address?.slice(-4)}</div>
                </div>
              )}
            </CardContent>
          </Card>


          {/* Add Event */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Plus className="h-4 w-4" />
                Add Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button onClick={() => handleAddEvent('after')} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Event
              </Button>
              <Button 
                onClick={handleRefreshTimeline} 
                variant="outline" 
                size="sm"
                className="w-full"
              >
                <RefreshCw className="h-3 w-3 mr-2" />
                Refresh Timeline
              </Button>
            </CardContent>
          </Card>


          {/* Selected Event */}
          {selectedNode && selectedNode.data.nodeType === 'scene' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Film className="h-4 w-4" />
                  Edit Event
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="event-title">Event Title</Label>
                  <Input
                    id="event-title"
                    value={selectedEventTitle}
                    onChange={(e: any) => setSelectedEventTitle(e.target.value)}
                    placeholder="Enter event title"
                  />
                </div>
                <div>
                  <Label htmlFor="event-description">Description</Label>
                  <textarea
                    id="event-description"
                    value={selectedEventDescription}
                    onChange={(e: any) => setSelectedEventDescription(e.target.value)}
                    placeholder="Describe this event"
                    rows={3}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                </div>
                <Button onClick={updateSelectedNode} className="w-full">
                  Update Event
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Timeline Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Clock className="h-4 w-4" />
                Timeline Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Events:</span>
                <span className="text-sm font-medium">{nodes.filter((n: any) => n.data.nodeType === 'scene').length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Blockchain Nodes:</span>
                <span className="text-sm font-medium">{graphData.nodeIds.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Universe ID:</span>
                <span className="text-sm font-mono text-xs">{id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLoadingAny ? 'bg-yellow-500' : nodes.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-xs">
                    {isLoadingAny ? 'Loading...' : nodes.length > 0 ? 'Active' : 'Empty'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Timeline Flow */}
      <div className="flex-1">
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} className="h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{
                padding: 0.2,
                includeHiddenNodes: false,
              }}
              defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
              minZoom={0.3}
              maxZoom={2}
              snapToGrid={true}
              snapGrid={[20, 20]}
              connectionLineStyle={{ stroke: '#10b981', strokeWidth: 2 }}
            >
              <Background gap={20} size={1} color="#f1f5f9" />
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

      {/* Event Creation Modal with Image and Video Generation */}
      {showVideoDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <Card className="w-full max-w-lg mx-4 my-8 max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Create Scene with AI Generation
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {additionType === 'branch' ? 'Create a new story branch' : 'Continue the timeline'}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="video-title">Scene Title</Label>
                <Input
                  id="video-title"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  placeholder="Enter scene title"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="video-description">Scene Description</Label>
                <textarea
                  id="video-description"
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Describe what happens in this scene in detail... This will be used to generate the first frame image."
                  rows={4}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>

              {/* Character Selection Section */}
              <div className="border rounded-lg p-4 bg-muted/20">
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">Characters in Scene</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                      disabled={isLoadingCharacters}
                    >
                      <UserPlus className="h-3 w-3 mr-1" />
                      Select
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowCharacterGenerator(true);
                        setCharacterName('');
                        setCharacterDescription('');
                        setCharacterStyle('cute');
                      }}
                      className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                    >
                      <Wand2 className="h-3 w-3 mr-1" />
                      Generate
                    </Button>
                  </div>
                </div>

                {/* Selected Characters Display */}
                {selectedCharacters.length > 0 && charactersData?.characters && (
                  <div className="space-y-2 mb-2">
                    {selectedCharacters.map(charId => {
                      const char = charactersData.characters.find((c: any) => c.id === charId);
                      if (!char) return null;
                      return (
                        <div key={charId} className="bg-background p-2 rounded-md border">
                          <div className="flex items-center gap-2 mb-1">
                            <img src={char.image_url} alt={char.character_name} className="w-8 h-8 rounded-full object-cover" />
                            <div className="flex-1">
                              <span className="text-sm font-medium">{char.character_name}</span>
                              <div className="text-xs text-muted-foreground">{char.collection}</div>
                            </div>
                            <button
                              onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                              className="text-muted-foreground hover:text-destructive"
                            >
                              ×
                            </button>
                          </div>
                          
                          {/* Show Character Image URLs */}
                          <div className="mt-1 p-1 bg-muted rounded text-xs space-y-1">
                            <div>
                              <div className="font-medium">Original URL:</div>
                              <div className="font-mono text-xs break-all bg-background p-1 rounded">
                                {char.image_url}
                              </div>
                            </div>
                            <div>
                              <div className="font-medium">Processed URL (for AI):</div>
                              <div className="font-mono text-xs break-all bg-background p-1 rounded">
                                {`https://images.weserv.nl/?url=${encodeURIComponent(char.image_url)}`}
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => navigator.clipboard.writeText(char.image_url)}
                                className="text-blue-600 hover:underline text-xs"
                              >
                                Copy Original
                              </button>
                              <button
                                onClick={() => navigator.clipboard.writeText(`https://images.weserv.nl/?url=${encodeURIComponent(char.image_url)}`)}
                                className="text-green-600 hover:underline text-xs"
                              >
                                Copy Processed
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Character Selector Dropdown */}
                {showCharacterSelector && charactersData?.characters && (
                  <div className="mt-2 max-h-48 overflow-y-auto border rounded-md bg-background">
                    {charactersData.characters.map((character: any) => (
                      <div
                        key={character.id}
                        onClick={() => {
                          if (!selectedCharacters.includes(character.id)) {
                            setSelectedCharacters(prev => [...prev, character.id]);
                          }
                          setShowCharacterSelector(false);
                        }}
                        className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                      >
                        <img src={character.image_url} alt={character.character_name} className="w-8 h-8 rounded object-cover" />
                        <div className="flex-1">
                          <div className="text-sm font-medium">{character.character_name}</div>
                          <div className="text-xs text-muted-foreground">{character.collection}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {selectedCharacters.length === 0 && (
                  <p className="text-xs text-muted-foreground">
                    Add characters to include them in the generated scene
                  </p>
                )}
              </div>

              {/* Step 1: Generate Image */}
              {!generatedImageUrl && (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                    <Label className="text-sm font-medium">
                      {selectedCharacters.length > 0 ? 'Edit Characters into Scene' : 'Generate First Frame'}
                    </Label>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    {selectedCharacters.length > 0 
                      ? `Edit ${selectedCharacters.length} character(s) into the scene using Nano Banana AI`
                      : 'Generate an image based on your scene description'
                    }
                  </p>
                  <div className="space-y-2">
                    <Button
                      onClick={handleGenerateEventImage}
                      disabled={!videoDescription.trim() || isGeneratingImage}
                      className="w-full"
                      variant="secondary"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          {selectedCharacters.length > 0 ? 'Editing Characters...' : 'Generating Image...'}
                        </>
                      ) : (
                        <>
                          {selectedCharacters.length > 0 ? (
                            <>
                              <Wand2 className="h-4 w-4 mr-2" />
                              Edit Characters into Scene
                            </>
                          ) : (
                            <>
                              <Image className="h-4 w-4 mr-2" />
                              Generate First Frame
                            </>
                          )}
                        </>
                      )}
                    </Button>
                    
                    <div className="flex gap-1">
                      {/* Debug Button */}
                      <Button
                        onClick={async () => {
                          try {
                            const result = await trpcClient.fal.testConnection.query();
                            console.log('FAL Connection Test:', result);
                            const message = 'message' in result ? result.message : result.error;
                            const keyLength = 'keyLength' in result ? result.keyLength : 0;
                            alert(`FAL Test: ${message}\nHas API Key: ${result.hasApiKey}\nKey Length: ${keyLength}`);
                          } catch (error) {
                            console.error('FAL test failed:', error);
                            alert(`FAL Test Failed: ${error}`);
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        🔧 Test FAL
                      </Button>

                      {/* Test Nano Banana Edit */}
                      <Button
                        onClick={async () => {
                          try {
                            console.log('🧪 Testing Nano Banana EDIT...');
                            const testImageUrl = 'https://images.weserv.nl/?url=https%3A%2F%2Fi2.seadn.io%2Fbase%2F0x7e72abdf47bd21bf0ed6ea8cb8dad60579f3fb50%2F34234bf162d45933d645055a11c1b6%2Fa834234bf162d45933d645055a11c1b6.png';
                            const result = await trpcClient.fal.editImage.mutate({
                              prompt: "sitting in a coffee shop, cozy atmosphere",
                              imageUrls: [testImageUrl],
                              strength: 0.7
                            });
                            console.log('✅ Nano Banana EDIT test result:', result);
                            if (result.status === 'completed' && result.imageUrl) {
                              alert(`✅ Nano Banana Edit works!\nGenerated: ${result.imageUrl.substring(0, 50)}...`);
                            } else {
                              alert(`❌ Nano Banana Edit failed: ${result.error || 'Unknown error'}`);
                            }
                          } catch (error) {
                            console.error('❌ Nano Banana Edit test failed:', error);
                            alert(`❌ Nano Banana Edit test failed: ${error}`);
                          }
                        }}
                        size="sm"
                        variant="outline"
                        className="flex-1 text-xs"
                      >
                        ✏️ Test Edit
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Show Generated Image */}
              {generatedImageUrl && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">✓</span>
                    <Label className="text-sm font-medium">First Frame Generated</Label>
                  </div>
                  <img 
                    src={generatedImageUrl} 
                    alt="Generated first frame" 
                    className="w-full max-h-48 object-cover rounded-lg border"
                  />
                  
                  {/* Upload to tmpfiles.org */}
                  <div className="mt-3 space-y-2">
                    <Button
                      onClick={uploadToTmpfiles}
                      disabled={isUploading}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Uploading to tmpfiles.org...
                        </>
                      ) : (
                        <>
                          <Image className="h-3 w-3 mr-2" />
                          Upload to tmpfiles.org
                        </>
                      )}
                    </Button>
                    
                    {/* Show uploaded URL */}
                    {uploadedUrl && (
                      <div className="p-2 bg-muted rounded text-xs">
                        <Label className="text-xs font-medium">Uploaded URL:</Label>
                        <div className="mt-1 p-1 bg-background rounded font-mono text-xs break-all">
                          {uploadedUrl}
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="mt-1 h-6 text-xs"
                          onClick={() => navigator.clipboard.writeText(uploadedUrl)}
                        >
                          Copy URL
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 2: Generate Video */}
              {showVideoStep && !generatedVideoUrl && (
                <div className="border rounded-lg p-4 bg-muted/20">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                    <Label className="text-sm font-medium">Generate Video with LumaAI</Label>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">
                    Create a video animation from the generated image
                  </p>
                  <Button
                    onClick={handleGenerateVideo}
                    disabled={isGeneratingVideo}
                    className="w-full"
                  >
                    {isGeneratingVideo ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Video...
                      </>
                    ) : (
                      <>
                        <Film className="h-4 w-4 mr-2" />
                        Generate Video
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Show Generated Video */}
              {generatedVideoUrl && (
                <div className="border rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">✓</span>
                    <Label className="text-sm font-medium">Video Generated</Label>
                  </div>
                  {generatedVideoUrl === "placeholder-video-url" ? (
                    <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                      <p className="text-sm text-muted-foreground">Video preview placeholder</p>
                    </div>
                  ) : (
                    <video 
                      src={generatedVideoUrl} 
                      controls 
                      className="w-full rounded-lg border"
                      onError={(e) => {
                        console.error("Video playback error:", e);
                        // Fallback to placeholder if video can't be played
                      }}
                    >
                      Your browser does not support the video tag.
                    </video>
                  )}
                  
                  {/* Save to Contract */}
                  <div className="mt-3 space-y-2">
                    <Button
                      onClick={handleSaveToContract}
                      disabled={isSavingToContract || contractSaved}
                      variant={contractSaved ? "secondary" : "default"}
                      size="sm"
                      className="w-full"
                    >
                      {isSavingToContract ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Saving to Blockchain...
                        </>
                      ) : contractSaved ? (
                        <>
                          <span className="text-green-600">✓</span>
                          <span className="ml-2">Saved to Blockchain</span>
                        </>
                      ) : (
                        <>
                          <Film className="h-3 w-3 mr-2" />
                          Save to Universe Timeline
                        </>
                      )}
                    </Button>
                    
                    {contractSaved && (
                      <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                        <div className="text-green-700 font-medium">
                          ✅ Successfully saved to blockchain!
                        </div>
                        <div className="text-green-600 mt-1">
                          Your scene is now part of the universe timeline and will be visible to all users.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setShowVideoDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateEvent}
                  disabled={!videoTitle.trim()}
                  className="flex-1"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Scene
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Character Generation Dialog */}
      {showCharacterGenerator && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-purple-600" />
                Generate Character with Nano Banana AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="char-name">Character Name</Label>
                <Input
                  id="char-name"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter character name..."
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="char-desc">Character Description</Label>
                <textarea
                  id="char-desc"
                  value={characterDescription}
                  onChange={(e) => setCharacterDescription(e.target.value)}
                  placeholder="Describe your character's appearance and personality..."
                  rows={3}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
              
              <div>
                <Label>Art Style</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {['cute', 'realistic', 'anime', 'fantasy', 'cyberpunk'].map((style) => (
                    <Button
                      key={style}
                      type="button"
                      size="sm"
                      variant={characterStyle === style ? 'default' : 'outline'}
                      onClick={() => setCharacterStyle(style as any)}
                      className="capitalize"
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCharacterGenerator(false)}
                  disabled={isGeneratingCharacter}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    if (!characterName.trim() || !characterDescription.trim()) {
                      alert('Please provide both name and description');
                      return;
                    }
                    setIsGeneratingCharacter(true);
                    try {
                      await generateCharacterMutation.mutateAsync({
                        name: characterName,
                        description: characterDescription,
                        style: characterStyle
                      });
                    } catch (error) {
                      console.error('Failed to generate character:', error);
                    }
                  }}
                  disabled={isGeneratingCharacter || !characterName.trim() || !characterDescription.trim()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                >
                  {isGeneratingCharacter ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  );
}

export const Route = createFileRoute("/universe/$id")({
  component: UniverseTimelineEditor,
});