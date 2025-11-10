import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useAccount } from "wagmi";
import { usePonderQuery } from "@ponder/react";
import { desc, eq } from "@ponder/client";
import { universe, token, node, nodeContent } from "../../../../indexer/ponder.schema";
import { Play, Plus, ArrowLeft, RefreshCw, Video, Sparkles } from "lucide-react";
import { useUniverse } from "@/hooks/useUniverse";
import { FlowCreationPanel } from "@/components/FlowCreationPanel";
import { trpcClient } from "@/utils/trpc";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { TimelineEventNode } from '@/components/flow/TimelineNodes';
import type { TimelineNodeData } from '@/components/flow/TimelineNodes';
import { UniverseSidebar } from '@/components/UniverseSidebar';
import { GovernanceSidebar } from '@/components/GovernanceSidebar';
import { toast } from 'sonner';

// Register custom node types
const nodeTypes = {
  timelineEvent: TimelineEventNode,
};

export const Route = createFileRoute("/universe/$id")({
  component: UniverseDetailPage,
});

function UniverseDetailPage() {
  const { id: universeAddress } = Route.useParams();
  const { isConnected, address } = useAccount();

  // FlowCreationPanel state
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [characterStyle, setCharacterStyle] = useState<'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'>('realistic');
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<any>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageFormat, setImageFormat] = useState<'landscape_16_9' | 'portrait_16_9' | 'landscape_4_3' | 'portrait_4_3'>('landscape_16_9');
  const [showVideoStep, setShowVideoStep] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoRatio, setVideoRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [selectedVideoModel, setSelectedVideoModel] = useState<'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora'>('fal-veo3');
  const [selectedVideoDuration, setSelectedVideoDuration] = useState(8);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isSavingToContract, setIsSavingToContract] = useState(false);
  const [contractSaved, setContractSaved] = useState(false);
  const [isSavingToFilecoin, setIsSavingToFilecoin] = useState(false);
  const [filecoinSaved, setFilecoinSaved] = useState(false);
  const [pieceCid, setPieceCid] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<any>(null);
  const [selectedImageCharacters, setSelectedImageCharacters] = useState<string[]>([]);
  const [selectedNodeForBranch, setSelectedNodeForBranch] = useState<bigint>(BigInt(0));
  const [isPolling, setIsPolling] = useState(false);

  // ReactFlow state
  const [flowNodes, setFlowNodes, onNodesChange] = useNodesState([]);
  const [flowEdges, setFlowEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<Node<TimelineNodeData> | null>(null);
  const [eventCounter, setEventCounter] = useState(1);
  const [additionType, setAdditionType] = useState<'after' | 'branch'>('after');
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);

  // Governance state
  const [showGovernanceSidebar, setShowGovernanceSidebar] = useState(false);

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Query universe data from Ponder
  const { data: universeData, isLoading: isLoadingUniverse } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(universe as any)
        .where(eq((universe as any).id, universeAddress.toLowerCase()))
        .limit(1),
  });

  // Query token data
  const { data: tokenData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(token as any)
        .where(eq((token as any).universeAddress, universeAddress.toLowerCase()))
        .limit(1),
  });

  // Query nodes for this universe
  const { data: nodesData, isLoading: isLoadingNodes, refetch: refetchNodes } = usePonderQuery({
    queryFn: (db) => {
      console.log('🔍 Querying nodes for universe:', universeAddress.toLowerCase());
      return db
        .select()
        .from(node as any)
        .where(eq((node as any).universeAddress, universeAddress.toLowerCase()))
        .orderBy(desc((node as any).createdAt));
    },
  });

  // Log when nodesData changes
  useEffect(() => {
    console.log('📦 nodesData updated:', nodesData?.length, 'nodes');
  }, [nodesData]);

  // Query node content
  const { data: nodeContentData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(nodeContent as any),
  });

  // Combine nodes with their content
  const nodes = useMemo(() => {
    if (!nodesData || !nodeContentData) {
      console.log('⚠️ No node data:', { nodesData: !!nodesData, nodeContentData: !!nodeContentData });
      return [];
    }

    type NodeRow = typeof node.$inferSelect;
    type NodeContentRow = typeof nodeContent.$inferSelect;

    const contentMap = new Map<string, NodeContentRow>();
    (nodeContentData as NodeContentRow[]).forEach((c) => {
      contentMap.set(c.id, c);
    });

    const combinedNodes = (nodesData as NodeRow[]).map((n) => {
      const content = contentMap.get(`${n.universeAddress.toLowerCase()}:${n.nodeId}`);
      return {
        ...n,
        content,
      };
    });

    console.log('✅ Combined nodes:', combinedNodes.length, combinedNodes);
    return combinedNodes;
  }, [nodesData, nodeContentData]);

  const universeInfo = universeData && universeData.length > 0 ? universeData[0] : null;
  const tokenInfo = tokenData && tokenData.length > 0 ? tokenData[0] : null;

  // Universe hooks - read metadata directly from contract
  const {
    createNode,
    useName,
    useDescription,
    useImageURL,
    isPending: isCreatingNodeTx,
    isSuccess: nodeCreated
  } = useUniverse(universeAddress as `0x${string}`);

  // Read universe metadata from contract
  const { data: universeName} = useName();
  const { data: universeDescription } = useDescription();
  const { data: universeImageURL } = useImageURL();

  // Handle adding events - defined early so it can be used in useEffect
  const handleAddEvent = useCallback((type: 'after' | 'branch' = 'after', nodeId?: string) => {
    console.log('🔵 handleAddEvent called:', { type, nodeId });
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
    setSelectedVideoModel('fal-veo3');
    setSelectedVideoDuration(8);
    setNegativePrompt("");
    setVideoPrompt("");
    setVideoRatio("16:9");
    setImageFormat('landscape_16_9');
    setSelectedCharacters([]);
    setStatusMessage(null);
    setShowVideoDialog(true);
  }, []);

  // Convert Ponder nodes to ReactFlow format
  useEffect(() => {
    console.log('🔄 useEffect triggered - nodes:', nodes?.length, 'universeAddress:', universeAddress);

    if (!nodes || nodes.length === 0) {
      console.log('⚠️ No nodes to convert, clearing flow');
      // Clear flow nodes when no data
      setFlowNodes([]);
      setFlowEdges([]);
      return;
    }

    console.log('✨ Converting', nodes.length, 'Ponder nodes to ReactFlow format');

    const blockchainNodes: Node<TimelineNodeData>[] = [];
    const blockchainEdges: Edge[] = [];
    const horizontalSpacing = 480;
    const verticalSpacing = 350;
    const startY = 200;

    // Colors for different types
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Track children of each node for branch detection
    const nodesByParent = new Map<string, string[]>();
    nodes.forEach((n) => {
      const parentId = n.previousNodeId !== null ? n.previousNodeId.toString() : '0';
      if (!nodesByParent.has(parentId)) {
        nodesByParent.set(parentId, []);
      }
      nodesByParent.get(parentId)!.push(n.nodeId.toString());
    });

    // Calculate positions for each node
    const nodePositions = new Map<string, { x: number; y: number }>();

    nodes.forEach((n, index) => {
      const nodeId = n.nodeId.toString();
      const parentId = n.previousNodeId !== null ? n.previousNodeId.toString() : '0';

      console.log(`  Node ${nodeId}: previousNodeId=${n.previousNodeId} (parent: ${parentId})`);

      let x: number, y: number;

      if (parentId === '0') {
        // Root node
        x = 100;
        y = startY;
      } else {
        const siblings = nodesByParent.get(parentId) || [];
        const siblingIndex = siblings.indexOf(nodeId);
        const parentIndex = nodes.findIndex(node => node.nodeId.toString() === parentId);

        if (siblingIndex === 0) {
          // Main timeline continuation
          x = 100 + ((parentIndex + 1) * horizontalSpacing);
          y = startY;
        } else {
          // Branch
          x = 100 + ((parentIndex + 1) * horizontalSpacing);
          y = startY + (siblingIndex * verticalSpacing);
        }
      }

      nodePositions.set(nodeId, { x, y });

      const color = colors[index % colors.length];
      const isRoot = n.previousNodeId === null || n.previousNodeId === BigInt(0);

      blockchainNodes.push({
        id: `blockchain-node-${nodeId}`,
        type: 'timelineEvent',
        position: { x, y },
        data: {
          label: n.content?.plot || `Event ${nodeId}`,
          description: n.content?.plot || `Timeline event ${nodeId}`,
          videoUrl: n.content?.videoLink || undefined,
          timelineColor: color,
          nodeType: 'scene',
          eventId: nodeId,
          blockchainNodeId: Number(nodeId),
          displayName: `Event ${nodeId}`,
          timelineId: `timeline-${universeAddress}`,
          universeId: universeAddress,
          isRoot: isRoot,
          onAddScene: handleAddEvent,
        }
      });

      // Create edge from parent to this node
      if (parentId !== '0') {
        blockchainEdges.push({
          id: `edge-${parentId}-${nodeId}`,
          source: `blockchain-node-${parentId}`,
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

    console.log('🎨 Setting', blockchainNodes.length, 'ReactFlow nodes and', blockchainEdges.length, 'edges');
    setFlowNodes(blockchainNodes as any);
    setFlowEdges(blockchainEdges);
    setEventCounter(nodes.length + 1);
    console.log('✅ ReactFlow state updated!');
  }, [nodes, universeAddress, handleAddEvent]);

  // Handle node click for navigation
  const onNodeClick = useCallback((_: React.MouseEvent, node: any) => {
    setSelectedNode(node);
    if (node.data.nodeType === 'scene') {
      const eventId = node.data.blockchainNodeId || node.data.eventId;
      if (eventId && universeAddress) {
        const eventUrl = `/event/${universeAddress}/${eventId}`;
        console.log('🔗 Navigating to:', eventUrl);
        window.location.href = eventUrl;
      }
    }
  }, [universeAddress]);

  // Handle connections between nodes
  const onConnect = useCallback(
    (connection: Connection) => {
      setFlowEdges((eds) => addEdge({
        ...connection,
        animated: true,
        style: { stroke: '#10b981' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
        },
      }, eds));
    },
    [setFlowEdges]
  );

  // Handle opening governance sidebar
  const handleOpenGovernance = useCallback(() => {
    setShowGovernanceSidebar(true);
  }, []);

  // Manual refresh function
  const handleRefreshTimeline = useCallback(async () => {
    console.log('Manually refreshing timeline...');
    await refetchNodes();
  }, [refetchNodes]);

  // Fetch available characters
  const { data: charactersData, isLoading: isLoadingCharacters, refetch: refetchCharacters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => trpcClient.wiki.characters.query(),
  });

  // Character generation mutations
  const generateCharacterMutation = useMutation({
    mutationFn: async (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'; saveToDatabase?: boolean }) => {
      const result = await trpcClient.fal.generateCharacter.mutate({
        ...input,
        saveToDatabase: input.saveToDatabase ?? false
      });
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character generated:', data);
      setIsGeneratingCharacter(false);

      setGeneratedCharacter({
        name: characterName,
        description: characterDescription,
        style: characterStyle,
        imageUrl: data.imageUrl
      });
    },
    onError: (error) => {
      console.error('Character generation failed:', error);
      setStatusMessage({
        type: 'error',
        title: 'Generation Failed',
        description: 'Failed to generate character. Please try again.'
      });
      setIsGeneratingCharacter(false);
    }
  });

  const analyzeCharacterMutation = useMutation({
    mutationFn: async (input: { imageUrl: string; characterName: string; userDescription: string }) => {
      const result = await trpcClient.fal.analyzeCharacter.mutate(input);
      return result;
    },
  });

  const saveCharacterMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      description: string;
      imageUrl: string;
      style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk';
      detailedVisualDescription?: string;
    }) => {
      const result = await trpcClient.fal.saveCharacter.mutate(input);
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character saved to database:', data);

      if (data.characterId) {
        setSelectedCharacters(prev => [...prev, data.characterId!]);
      }

      setGeneratedCharacter(null);
      setShowCharacterGenerator(false);

      await refetchCharacters();
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
      setStatusMessage({
        type: 'error',
        title: 'Save Failed',
        description: 'Failed to save character to database. Please try again.'
      });
    }
  });

  // Image generation mutation
  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      // Check if we have selected characters to edit into the scene
      if (selectedCharacters.length > 0 && charactersData?.characters) {
        const selectedChars = charactersData.characters.filter((c: any) => selectedCharacters.includes(c.id));

        if (selectedChars.length > 0) {
          const characterNames = selectedChars.map((c: any) => c.character_name).join(' and ');
          const editPrompt = `${characterNames} ${prompt}, cinematic scene, high quality, detailed environment`;

          const processedImageUrls = selectedChars
            .filter((char: any) => char.image_url && char.image_url.trim())
            .map((char: any) => char.image_url);

          if (processedImageUrls.length === 0) {
            throw new Error('No valid character images found for editing');
          }

          console.log('🎭 Generating character frame with nano-banana');

          const result = await trpcClient.fal.imageToImage.mutate({
            prompt: `Create a cinematic frame: ${editPrompt}. Professional photography, detailed environment, high quality composition`,
            imageUrls: processedImageUrls,
            imageSize: imageFormat,
            numImages: 1,
          });

          if (result.status !== 'completed' || !result.imageUrl) {
            throw new Error(result.error || 'Nano Banana frame generation failed');
          }

          return { success: true, imageUrl: result.imageUrl };
        }
      }

      // For scenes without characters, generate directly
      console.log('🎨 Generating scene without characters');

      const result = await trpcClient.fal.generateImage.mutate({
        prompt: `${prompt}, cinematic scene, high quality, detailed environment, professional photography, dramatic lighting`,
        model: 'fal-ai/nano-banana',
        imageSize: imageFormat,
        numImages: 1
      });

      if (result.status !== 'completed' || !result.imageUrl) {
        throw new Error(result.error || 'Failed to generate scene image');
      }

      return { success: true, imageUrl: result.imageUrl };
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
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

      setStatusMessage({
        type: 'error',
        title: 'Image Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate image. Please try again.'
      });
    }
  });

  // Handle image generation
  const handleGenerateEventImage = useCallback(async () => {
    if (!videoDescription.trim()) return;

    setStatusMessage(null);
    setIsGeneratingImage(true);
    try {
      await generateImageMutation.mutateAsync(videoDescription);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [videoDescription, generateImageMutation]);

  // Handle character frame generation
  const handleGenerateCharacterFrame = useCallback(async () => {
    if (!videoDescription.trim() || selectedImageCharacters.length === 0) return;

    setStatusMessage(null);
    setIsGeneratingImage(true);

    try {
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
  }, [videoDescription, selectedImageCharacters, charactersData, imageFormat]);

  // Video generation mutation
  const generateVideoMutation = useMutation({
    mutationFn: async ({ imageUrl, prompt }: { imageUrl: string; prompt?: string }) => {
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
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-sora') {
        const result = await trpcClient.fal.soraImageToVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 4 || selectedVideoDuration === 8 || selectedVideoDuration === 12) ? selectedVideoDuration : 4,
          aspectRatio: videoRatio === "1:1" ? "auto" : videoRatio,
          resolution: "auto",
        });
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

      let errorMessage = "Failed to generate video. Please try again.";
      let errorTitle = "Video Generation Failed";
      let errorDescription = "";

      if (error instanceof Error) {
        errorMessage = error.message;

        if (errorMessage.toLowerCase().includes('content checker') ||
            errorMessage.toLowerCase().includes('flagged')) {
          errorTitle = "Content Check Failed";

          if (selectedVideoModel === 'fal-sora') {
            errorDescription = `OpenAI Sora has detected content that violates its usage policies. Try switching to Veo3, Kling 2.5, or Wan 2.5.`;
          } else {
            errorDescription = "The AI service detected content that violates its usage policies. Try using different characters or switching to another video model.";
          }
        } else {
          errorDescription = errorMessage;
        }
      }

      setStatusMessage({
        type: 'error',
        title: errorTitle,
        description: errorDescription,
      });
    }
  });

  // Handle video generation
  const handleGenerateVideo = useCallback(async () => {
    setStatusMessage(null);
    setIsGeneratingVideo(true);

    try {
      const hasImage = uploadedUrl || generatedImageUrl;
      const isTextToVideo = !hasImage;

      if (isTextToVideo) {
        // Text-to-video mode
        const modelMap: Record<string, string> = {
          'fal-veo3': 'fal-ai/veo3.1/fast',
          'fal-sora': 'fal-ai/sora-2/text-to-video',
          'fal-kling': 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
          'fal-wan25': 'fal-ai/wan-25-preview/text-to-video'
        };

        const textToVideoModel = modelMap[selectedVideoModel] || 'fal-ai/veo3.1/fast';

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
            description: 'Your video has been created. You can now save it to the timeline.',
          });
        }
      } else {
        // Image-to-video mode
        const imageUrlToUse = uploadedUrl || generatedImageUrl;

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
  }, [generatedImageUrl, uploadedUrl, videoDescription, generateVideoMutation, selectedVideoModel, selectedVideoDuration, videoRatio, negativePrompt]);

  // Upload to tmpfiles
  const uploadToTmpfiles = useCallback(async () => {
    if (!generatedImageUrl) return;

    setIsUploading(true);
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'generated-image.png');

      const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        if (result?.status === 'success') {
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
      setStatusMessage({
        type: 'error',
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  }, [generatedImageUrl]);

  // Save to contract
  const handleSaveToContract = useCallback(async () => {
    if (!generatedVideoUrl || !videoDescription) {
      setStatusMessage({
        type: 'error',
        title: 'Missing Information',
        description: 'Please provide a video URL and description.'
      });
      return;
    }

    setIsSavingToContract(true);

    try {
      // Calculate the previous node ID based on addition type
      let previousNodeId: bigint;

      if (additionType === 'branch' && sourceNodeId) {
        // For branches, use the source node ID
        previousNodeId = BigInt(sourceNodeId);
        console.log('Creating branch from node:', sourceNodeId);
      } else {
        // For linear continuation, find the highest node ID
        if (nodes && nodes.length > 0) {
          const maxNodeId = Math.max(...nodes.map(n => Number(n.nodeId)));
          previousNodeId = BigInt(maxNodeId);
          console.log('Creating linear continuation after node:', maxNodeId);
        } else {
          // First node
          previousNodeId = BigInt(0);
          console.log('Creating first node (root)');
        }
      }

      // Use the fal video URL directly
      console.log('Saving to contract with fal URL:', {
        link: generatedVideoUrl,
        plot: videoDescription,
        previous: previousNodeId.toString(),
      });

      await createNode({
        link: generatedVideoUrl,
        plot: videoDescription,
        previousNodeId: previousNodeId,
      });

      setContractSaved(true);
      setStatusMessage({
        type: 'success',
        title: 'Event Created',
        description: 'Your timeline event has been saved! The indexer is processing it. This may take 10-30 seconds.'
      });

      // Close dialog after a short delay
      setTimeout(() => {
        setShowVideoDialog(false);
        setVideoTitle("");
        setVideoDescription("");
        setGeneratedImageUrl(null);
        setGeneratedVideoUrl(null);
        setContractSaved(false);
        setFilecoinSaved(false);
        setPieceCid(null);
      }, 3000);

      // Start polling
      setIsPolling(true);

      // Aggressively poll for new nodes - check every 5 seconds for 30 seconds
      const pollInterval = setInterval(async () => {
        console.log('📊 Polling for new nodes...');
        const result = await refetchNodes();
        console.log('📊 Refetch result:', result?.data?.length, 'nodes');
        // Also invalidate all queries to force a full refresh
        await queryClient.invalidateQueries();
      }, 5000);

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsPolling(false);
        console.log('Stopped polling for new nodes');
      }, 30000);
    } catch (error) {
      console.error("Failed to create node:", error);
      setStatusMessage({
        type: 'error',
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create timeline event.'
      });
    } finally {
      setIsSavingToContract(false);
      setIsSavingToFilecoin(false);
    }
  }, [generatedVideoUrl, videoDescription, additionType, sourceNodeId, nodes, createNode, refetchNodes, queryClient]);

  const handleCreateEvent = () => {
    handleSaveToContract();
  };

  // Loading state
  if (isLoadingUniverse) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-xl">Loading universe...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!universeInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Universe Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This universe hasn't been indexed yet or doesn't exist.
            </p>
            <Button asChild>
              <Link to="/universes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Universes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state - no nodes yet
  if (!isLoadingNodes && nodes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Button variant="ghost" size="sm" asChild className="mb-4">
                  <Link to="/universes">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Universes
                  </Link>
                </Button>
                <h1 className="text-4xl font-bold mb-2">
                  {universeName || tokenInfo?.name || `Universe ${universeAddress.slice(0, 6)}...${universeAddress.slice(-4)}`}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {universeDescription || tokenInfo?.metadata || "A collaborative narrative universe"}
                </p>
              </div>
              {tokenInfo && (
                <div className="text-right">
                  <Badge className="text-lg px-4 py-2">${tokenInfo.symbol}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-2xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 inline-block">
                <Video className="h-24 w-24 mx-auto text-white/60" />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4">
              {universeName ? `Welcome to ${universeName}` : "No Timeline Events Yet"}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {universeDescription || "This universe is brand new! Be the first to create a timeline event and start the story."}
            </p>

            {isConnected ? (
              <Button
                size="lg"
                className="text-lg px-10 h-14 font-bold shadow-lg shadow-primary/20"
                onClick={() => setShowVideoDialog(true)}
              >
                <Sparkles className="h-6 w-6 mr-2" />
                Create First Event
              </Button>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">Connect your wallet to create events</p>
                <Button size="lg" variant="outline">
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* FlowCreationPanel */}
        <FlowCreationPanel
          showVideoDialog={showVideoDialog}
          setShowVideoDialog={setShowVideoDialog}
          videoTitle={videoTitle}
          setVideoTitle={setVideoTitle}
          videoDescription={videoDescription}
          setVideoDescription={setVideoDescription}
          additionType="after"
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
          analyzeCharacterMutation={analyzeCharacterMutation}
          saveCharacterMutation={saveCharacterMutation}
          generatedImageUrl={generatedImageUrl}
          isGeneratingImage={isGeneratingImage}
          imageFormat={imageFormat}
          setImageFormat={setImageFormat}
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
          isSavingToFilecoin={isSavingToFilecoin}
          filecoinSaved={filecoinSaved}
          pieceCid={pieceCid}
          handleSaveToContract={handleSaveToContract}
          handleCreateEvent={handleCreateEvent}
          previousEventVideoUrl={null}
          previousEventDescription={null}
          previousEventTitle={null}
          statusMessage={statusMessage}
          setStatusMessage={setStatusMessage}
          selectedImageCharacters={selectedImageCharacters}
          setSelectedImageCharacters={setSelectedImageCharacters}
          handleGenerateCharacterFrame={handleGenerateCharacterFrame}
          refetchCharacters={refetchCharacters}
        />
      </div>
    );
  }

  // Prepare universe data for sidebar
  const finalUniverse = {
    id: universeAddress,
    name: universeName || tokenInfo?.name || `Universe ${universeAddress.slice(0, 8)}`,
    description: universeDescription || tokenInfo?.metadata || "A collaborative narrative universe",
    address: universeAddress,
    tokenAddress: tokenInfo?.address || null,
    governanceAddress: null, // TODO: Add governance address from universe data
  };

  // Prepare graph data for sidebar
  const graphData = {
    nodeIds: nodes.map(n => n.nodeId),
  };

  const isLoadingAny = isLoadingUniverse || isLoadingNodes;

  // Main content with ReactFlow graph
  return (
    <div className="flex h-full bg-background overflow-hidden">
      {/* Left Sidebar Component */}
      <UniverseSidebar
        finalUniverse={finalUniverse}
        graphData={graphData}
        leavesData={null}
        nodes={flowNodes}
        isLoadingAny={isLoadingAny}
        selectedNode={selectedNode}
        handleAddEvent={handleAddEvent}
        handleRefreshTimeline={handleRefreshTimeline}
        onOpenGovernance={handleOpenGovernance}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden transition-all duration-300 ease-in-out">
        <ReactFlowProvider>
          <div className="flex-1 relative overflow-hidden" ref={reactFlowWrapper}>
            <ReactFlow
              nodes={flowNodes}
              edges={flowEdges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              className="bg-gradient-to-br from-background via-background/95 to-muted/20"
              minZoom={0.1}
              maxZoom={2}
            >
              <Background />
              <Controls />

              <Panel position="top-center" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
                <h2 className="text-lg font-semibold">
                  {universeName || tokenInfo?.name || `Universe ${universeAddress.slice(0, 8)}`}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {universeDescription || tokenInfo?.metadata || "A collaborative narrative universe"}
                </p>
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

      {/* FlowCreationPanel */}
      <FlowCreationPanel
        showVideoDialog={showVideoDialog}
        setShowVideoDialog={setShowVideoDialog}
        videoTitle={videoTitle}
        setVideoTitle={setVideoTitle}
        videoDescription={videoDescription}
        setVideoDescription={setVideoDescription}
        additionType="after"
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
        analyzeCharacterMutation={analyzeCharacterMutation}
        saveCharacterMutation={saveCharacterMutation}
        generatedImageUrl={generatedImageUrl}
        isGeneratingImage={isGeneratingImage}
        imageFormat={imageFormat}
        setImageFormat={setImageFormat}
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
        isSavingToFilecoin={isSavingToFilecoin}
        filecoinSaved={filecoinSaved}
        pieceCid={pieceCid}
        handleSaveToContract={handleSaveToContract}
        handleCreateEvent={handleCreateEvent}
        previousEventVideoUrl={nodes.length > 0 ? nodes[0].content?.videoLink : null}
        previousEventDescription={nodes.length > 0 ? nodes[0].content?.plot : null}
        previousEventTitle={null}
        statusMessage={statusMessage}
        setStatusMessage={setStatusMessage}
        selectedImageCharacters={selectedImageCharacters}
        setSelectedImageCharacters={setSelectedImageCharacters}
        handleGenerateCharacterFrame={handleGenerateCharacterFrame}
        refetchCharacters={refetchCharacters}
      />

      {/* Governance Sidebar */}
      <GovernanceSidebar
        isOpen={showGovernanceSidebar}
        onClose={() => setShowGovernanceSidebar(false)}
        finalUniverse={finalUniverse}
        nodes={flowNodes}
        onRefresh={handleRefreshTimeline}
      />
    </div>
  );
}
