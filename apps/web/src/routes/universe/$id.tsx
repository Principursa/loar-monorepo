import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
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
import { useQuery, useMutation } from '@tanstack/react-query';
import { useChainId, useWriteContract } from 'wagmi';
import type { TimelineNodeData } from '@/components/flow/TimelineNodes';
import { UniverseSidebar } from '@/components/UniverseSidebar';
import { FlowCreationPanel } from '@/components/FlowCreationPanel';
import { GovernanceSidebar } from '@/components/GovernanceSidebar';
import { calculateTreeLayout, normalizeNodeId, getEventLabel } from '@/utils/treeLayout';
import { useVideoGeneration, type StatusMessage } from '@/hooks/useVideoGeneration';
import { useCharacterGeneration } from '@/hooks/useCharacterGeneration';
import { useContractSave } from '@/hooks/useContractSave';
import { useUniverseBlockchain } from '@/hooks/useUniverseBlockchain';

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
  const [statusMessage, setStatusMessage] = useState<StatusMessage | null>(null);

  // Image generation state
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
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

  // Debug: Log when generatedVideoUrl changes
  useEffect(() => {
    console.log('generatedVideoUrl changed to:', generatedVideoUrl);
    console.log('Stack trace:', new Error().stack);
  }, [generatedVideoUrl]);

  // Contract hooks - we'll use the write contract directly for universe-specific contracts
  const { writeContractAsync } = useWriteContract();

  // For blockchain universes (addresses starting with 0x), fetch from indexer
  const isBlockchainUniverse = id?.startsWith('0x');

  // Unified query that checks both localStorage and indexer
  const { data: universe, isLoading: isLoadingUniverse } = useQuery({
    queryKey: ['universe-metadata', id],
    queryFn: async () => {
      // First check localStorage
      const stored = localStorage.getItem('createdUniverses');
      const universes = stored ? JSON.parse(stored) : [];
      const found = universes.find((u: any) => u.id === id);

      if (found) {
        console.log('Found universe in localStorage:', found);
        return found;
      }

      // If not in localStorage and it's a blockchain universe, fetch from indexer
      if (isBlockchainUniverse) {
        try {
          const response = await fetch(`https://loartech.xyz/indexer/universe/${id}`);
          if (!response.ok) return null;
          const data = await response.json();
          if (data.universe) {
            console.log('Found universe in indexer:', data.universe);
            return {
              id: data.universe.id,
              name: data.universe.name,
              description: data.universe.description,
              imageUrl: data.universe.imageURL,
              address: data.universe.id,
              tokenAddress: data.universe.tokenAddress,
              governanceAddress: data.universe.governorAddress,
              isDefault: false,
            };
          }
        } catch (error) {
          console.error('Error fetching from indexer:', error);
        }
      }

      return null;
    },
  });

  // Fallback for blockchain universes if not found
  const finalUniverse = universe || (isBlockchainUniverse ? {
    id: id,
    name: `Universe ${id.slice(0, 8)}...`,
    description: 'Blockchain-based cinematic universe',
    address: id,
    isDefault: false,
    tokenAddress: null,
    governanceAddress: null
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

  // Blockchain data fetching - using extracted hook
  const {
    graphData,
    latestNodeId,
    leavesData,
    isLoadingLeaves,
    isLoadingFullGraph,
    isLoadingCanonChain,
    isLoadingAny,
    refetchLeaves,
    refetchFullGraph,
    refetchCanonChain,
    refetchLatestNodeId,
  } = useUniverseBlockchain({
    universeId: id,
    contractAddress: timelineContractAddress,
    isBlockchainUniverse,
  });

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

  // Analyze character image with Gemini
  const analyzeCharacterMutation = useMutation({
    mutationFn: async (input: { imageUrl: string; characterName: string; userDescription: string }) => {
      const result = await trpcClient.fal.analyzeCharacter.mutate(input);
      return result;
    },
  });

  // Generate character mutation (with optional DB save)
  const generateCharacterMutation = useMutation({
    mutationFn: async (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'; saveToDatabase?: boolean; detailedVisualDescription?: string }) => {
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

  // Save character to database mutation (uses existing image URL, no regeneration)
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

  // Character generation - using extracted hook
  const {
    isGeneratingImage,
    generateImageMutation,
    handleGenerateEventImage,
    handleGenerateCharacterFrame,
  } = useCharacterGeneration({
    selectedCharacters,
    selectedImageCharacters,
    charactersData,
    imageFormat,
    videoDescription,
    setGeneratedImageUrl,
    setShowVideoStep,
    setStatusMessage,
  });

  // Video generation - using extracted hook
  const { isGeneratingVideo, handleGenerateVideo: handleGenerateVideoFromHook, generateVideoMutation } = useVideoGeneration({
    videoDescription,
    selectedVideoModel,
    selectedVideoDuration,
    videoRatio,
    negativePrompt,
    videoPrompt,
    setGeneratedVideoUrl,
    setStatusMessage,
  });

  // Wrapper to call the hook's handler with the correct parameters
  const handleGenerateVideo = useCallback(async () => {
    await handleGenerateVideoFromHook(generatedImageUrl, uploadedUrl);
  }, [handleGenerateVideoFromHook, generatedImageUrl, uploadedUrl]);

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

  // Contract save - using extracted hook
  const { handleSaveToContract, handleRefreshTimeline } = useContractSave({
    generatedVideoUrl,
    videoTitle,
    videoDescription,
    additionType,
    sourceNodeId,
    selectedCharacters,
    selectedImageCharacters,
    graphData,
    latestNodeId,
    universeId: id,
    isBlockchainUniverse,
    chainId,
    setGeneratedVideoUrl,
    setStorageKey,
    setStorageSaved,
    setContractSaved,
    setIsSavingToContract,
    setIsSavingToStorage,
    writeContractAsync,
    refetchLeaves,
    refetchFullGraph,
    refetchCanonChain,
    refetchLatestNodeId,
  });

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

    // Calculate position based on addition type and depth in tree
    let newEventPosition;
    let newAddPosition;

    const horizontalSpacing = 420;
    const verticalSpacing = 320; // Match blockchain node spacing

    if (additionType === 'branch' && sourceNode) {
      // Create branch: same X depth as if it were a linear continuation, but offset vertically
      // Count how many children the source node already has to position this branch correctly
      const sourceChildren = nodes.filter((n: any) => {
        const parentMatch = edges.find(e => e.source === sourceNode.id && e.target === n.id);
        return parentMatch && n.data.nodeType === 'scene';
      });

      const branchIndex = sourceChildren.length; // 0-based index for this new branch
      const branchY = sourceNode.position.y + (branchIndex * verticalSpacing);

      // Use same X as linear continuation would use
      newEventPosition = { x: sourceNode.position.x + horizontalSpacing, y: branchY };
      newAddPosition = { x: sourceNode.position.x + (horizontalSpacing * 2), y: branchY };

      console.log('Branch positioning:', {
        sourceNodeX: sourceNode.position.x,
        sourceChildren: sourceChildren.length,
        branchIndex,
        newX: newEventPosition.x,
        newY: branchY
      });
    } else {
      // Linear addition to the right of the reference node (or source node)
      if (referenceNode) {
        // Place after the specific reference/source node at same depth
        newEventPosition = { x: referenceNode.position.x + horizontalSpacing, y: referenceNode.position.y };
        newAddPosition = { x: referenceNode.position.x + (horizontalSpacing * 2), y: referenceNode.position.y };
      } else {
        // No reference node, start fresh
        newEventPosition = { x: 100, y: 100 };
        newAddPosition = { x: 100 + horizontalSpacing, y: 100 };
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

    // Colors for different types
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

    // Calculate tree layout using utility
    const layout = calculateTreeLayout(graphData.nodeIds, graphData.previousNodes, {
      horizontalSpacing: 420,
      verticalSpacing: 320,
      startX: 100,
      startY: 100,
    });

    // Create nodes from blockchain data using calculated layout
    graphData.nodeIds.forEach((nodeIdStr, index) => {
      const nodeId = normalizeNodeId(nodeIdStr);
      const url = graphData.urls[index] || '';

      // Handle description which might be an object {timestamp, description} or a string
      const rawDesc = graphData.descriptions[index];
      const description = rawDesc && typeof rawDesc === 'object' && 'description' in rawDesc
        ? String((rawDesc as any).description)
        : String(rawDesc || '');

      const previousNode = graphData.previousNodes[index] || '';
      const isCanon = graphData.flags[index] || false;
      const parentId = (previousNode && String(previousNode) !== '0')
        ? normalizeNodeId(previousNode)
        : 0;

      // Check if this node is in the canon chain
      const isInCanonChain = graphData.canonChain && graphData.canonChain.some((canonId: any) => {
        const canonNodeId = normalizeNodeId(canonId);
        return canonNodeId === nodeId;
      });

      // Get position from layout calculation
      const position = layout.nodePositions.get(nodeId) || { x: 100, y: 100 };

      // Generate proper event label
      const eventLabel = getEventLabel(nodeId, parentId, layout.nodesByParent);

      const color = isCanon ? colors[0] : colors[(index + 1) % colors.length];

      // Debug: Log the node creation data
      console.log(`Creating node ${nodeId} (${eventLabel}):`, {
        blockchainNodeId: nodeId,
        eventLabel,
        url,
        description,
        previousNode,
        parentId,
        position
      });

      blockchainNodes.push({
        id: `blockchain-node-${nodeId}`,
        type: 'timelineEvent',
        position,
        data: {
          label: description && description.length > 0 && description !== `Timeline event ${nodeId}`
            ? description.substring(0, 50) + (description.length > 50 ? '...' : '')
            : `Event ${nodeId}`, // Always show actual blockchain node ID
          description: description || `Timeline event ${nodeId}`,
          videoUrl: url,
          timelineColor: color,
          nodeType: 'scene',
          eventId: nodeId.toString(), // Use actual blockchain node ID for navigation
          blockchainNodeId: nodeId, // Store actual blockchain node ID for navigation
          displayName: nodeId.toString(), // Display actual blockchain node ID (not branch labels)
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
      const nodeId = normalizeNodeId(nodeIdStr);
      const previousNodeStr = graphData.previousNodes[index];

      if (previousNodeStr && String(previousNodeStr) !== '0') {
        const previousNodeId = normalizeNodeId(previousNodeStr);
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
        position: { x: lastNode.position.x + 420, y: lastNode.position.y },
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
      // Extract description string from object if needed
      const rawDesc = node.data.description;
      const description = rawDesc && typeof rawDesc === 'object' && 'description' in rawDesc
        ? String((rawDesc as any).description)
        : String(rawDesc || '');
      setSelectedEventDescription(description);

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

  // Not found state - only for non-blockchain universes
  if (!isBlockchainUniverse && !finalUniverse) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Universe Not Found</h1>
          <p className="text-muted-foreground mb-6">The universe with ID "{id}" could not be found.</p>
          <Button asChild>
            <Link to="/market">← Back to Market</Link>
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

              <Panel position="top-right">
                <Button
                  variant="outline"
                  size="sm"
                  asChild
                  className="hover:bg-primary/10 hover:text-primary transition-all duration-300"
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-2" />
                    Home
                  </Link>
                </Button>
              </Panel>

              {isLoadingAny && (
                <Panel position="bottom-right" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border mb-4">
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

        // Handle description which might be an object {timestamp, description} or a string
        const rawDesc = sourceNode?.data.description;
        const previousEventDescription = rawDesc && typeof rawDesc === 'object' && 'description' in rawDesc
          ? String((rawDesc as any).description)
          : (rawDesc ? String(rawDesc) : null);

        const previousEventTitle = sourceNode?.data.label || null;

        // Get previous event wiki data if available
        const previousEventWiki = sourceNode?.data.wiki ? {
          title: sourceNode.data.wiki.title || previousEventTitle || '',
          summary: sourceNode.data.wiki.summary || '',
          plot: sourceNode.data.wiki.plot,
        } : null;

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
            analyzeCharacterMutation={analyzeCharacterMutation}
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
            previousEventWiki={previousEventWiki}
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