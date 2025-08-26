import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Film, Plus, Settings, Clock, Users } from "lucide-react";
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
import { useQuery } from '@tanstack/react-query';
import { useReadContract, useChainId } from 'wagmi';
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
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Blockchain data fetching hooks
  const useUniverseLeaves = (contractAddress?: string) => {
    return useReadContract({
      abi: timelineAbi,
      address: contractAddress 
        ? (contractAddress as Address)
        : (TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address),
      functionName: 'getLeaves',
      query: {
        enabled: (!!contractAddress && contractAddress !== 'unknown') || id === 'blockchain-universe'
      }
    });
  };

  const useUniverseFullGraph = (contractAddress?: string) => {
    return useReadContract({
      abi: timelineAbi,
      address: contractAddress 
        ? (contractAddress as Address)
        : (TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address),
      functionName: 'getFullGraph',
      query: {
        enabled: (!!contractAddress && contractAddress !== 'unknown') || id === 'blockchain-universe'
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

  // Use dummy data for testing
  const universe = dummyUniverses[id as keyof typeof dummyUniverses] || null;
  const isLoadingUniverse = false;
  const isLoadingLeaves = false;
  const isLoadingFullGraph = false;
  
  // Get dummy timeline data for this universe (memoized to prevent infinite loops)
  const graphData = useMemo(() => {
    return dummyTimelineData[id as keyof typeof dummyTimelineData] || {
      nodeIds: [], urls: [], descriptions: [], previousNodes: [], children: [], flags: []
    };
  }, [id]);

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
    if (universe?.name) {
      setTimelineTitle(universe.name);
      setTimelineDescription(universe.description || "Blockchain-powered narrative timeline");
    }
  }, [universe]);

  // Handle showing video generation dialog
  const handleAddEvent = useCallback((type: 'after' | 'branch' = 'after', nodeId?: string) => {
    console.log('handleAddEvent called:', { type, nodeId });
    setAdditionType(type);
    setSourceNodeId(nodeId || null);
    setVideoTitle("");
    setVideoDescription("");
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
      
      const x = 100 + (index * horizontalSpacing);
      const y = startY + (isCanon ? 0 : (index % 2) * verticalSpacing);
      const color = isCanon ? colors[0] : colors[(index + 1) % colors.length];
      
      blockchainNodes.push({
        id: `blockchain-node-${nodeId}`,
        type: 'timelineEvent',
        position: { x, y },
        data: {
          label: `Node ${nodeId}`,
          description: description || `Timeline event ${nodeId}`,
          videoUrl: url,
          timelineColor: color,
          nodeType: 'scene',
          eventId: `node-${nodeId}`,
          timelineId: `timeline-${nodeId}`,
          universeId: universe?.id || 'unknown',
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
    }
  }, []);

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

  // Loading state
  if (isLoadingUniverse || (id !== 'blockchain-universe' && !universe)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading universe timeline...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (id !== 'blockchain-universe' && !universe) {
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
                <div className="text-sm font-medium">{universe?.name}</div>
              </div>
              <div>
                <Label htmlFor="universe-description">Description</Label>
                <div className="text-sm text-muted-foreground">{universe?.description}</div>
              </div>
              {!universe?.isDefault && (
                <div className="text-xs text-muted-foreground">
                  <div>Creator: {universe?.creator?.slice(0, 6)}...{universe?.creator?.slice(-4)}</div>
                  <div>Contract: {universe?.address?.slice(0, 6)}...{universe?.address?.slice(-4)}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Settings className="h-4 w-4" />
                Timeline Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="timeline-title">Timeline Title</Label>
                <Input
                  id="timeline-title"
                  value={timelineTitle}
                  onChange={(e: any) => setTimelineTitle(e.target.value)}
                  placeholder="Enter timeline title"
                />
              </div>
              <div>
                <Label htmlFor="timeline-description">Description</Label>
                <textarea
                  id="timeline-description"
                  value={timelineDescription}
                  onChange={(e: any) => setTimelineDescription(e.target.value)}
                  placeholder="Describe your timeline"
                  rows={3}
                  className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
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
            <CardContent>
              <Button onClick={() => handleAddEvent('after')} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add New Event
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

      {/* Video Generation Modal */}
      {showVideoDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Film className="h-5 w-5" />
                Generate Video Scene
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
                  placeholder="Describe what happens in this scene..."
                  rows={4}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
              </div>
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
    </div>
  );
}

export const Route = createFileRoute("/universe/$id")({
  component: UniverseTimelineEditor,
});