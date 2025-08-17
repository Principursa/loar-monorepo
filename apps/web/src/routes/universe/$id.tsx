import { createFileRoute, Link, useParams, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch, Edit } from "lucide-react";
import ReactFlow, {
  Controls,
  Background,
  BackgroundVariant,
  ConnectionMode,
  MarkerType,
  type Node,
  type Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useMemo } from 'react';
import { TimelineEventNode } from '@/components/flow/TimelineNodes';
import { TimelineActions } from '@/components/TimelineActions';
import { trpcClient } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { useReadContract, useChainId } from 'wagmi';
import { timelineAbi } from '@/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type Address } from 'viem';

interface UniverseParams {
  id: string;
}

function UniverseViewPage() {
  const { id } = useParams({ from: "/universe/$id" });
  const navigate = useNavigate();
  const chainId = useChainId();

  // Universe-specific timeline hooks
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
  
  // Fetch cinematic universe data if it's not the default blockchain universe
  const { data: cinematicUniverse, isLoading: isLoadingUniverse } = useQuery({
    queryKey: ['cinematicUniverse', id],
    queryFn: () => trpcClient.cinematicUniverses.get.query({ id }),
    enabled: id !== 'blockchain-universe',
  });
  
  // Define universe data - either from database or default
  const universe = useMemo(() => {
    if (id === 'blockchain-universe') {
      return {
        id: 'blockchain-universe',
        name: 'Cyberpunk City',
        description: 'A decentralized narrative universe powered by blockchain technology',
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
        address: null, // Uses default timeline contract
        isDefault: true
      };
    } else if (cinematicUniverse?.data) {
      return {
        id: cinematicUniverse.data.id,
        name: `Universe ${cinematicUniverse.data.id.slice(0, 8)}...`,
        description: cinematicUniverse.data.description,
        imageUrl: cinematicUniverse.data.image_url,
        address: cinematicUniverse.data.address,
        creator: cinematicUniverse.data.creator,
        tokenAddress: cinematicUniverse.data.tokenAddress,
        governanceAddress: cinematicUniverse.data.governanceAddress,
        isDefault: false
      };
    }
    return null;
  }, [id, cinematicUniverse]);

  // Get timeline data using universe-specific contract address
  const { data: leavesData, isLoading: isLoadingLeaves } = useUniverseLeaves(universe?.address || undefined);
  const { data: fullGraphData, isLoading: isLoadingFullGraph } = useUniverseFullGraph(universe?.address || undefined);
  
  // Parse full graph data structure
  const graphData = useMemo(() => {
    if (!fullGraphData || !Array.isArray(fullGraphData) || fullGraphData.length < 6) {
      return { nodeIds: [], urls: [], descriptions: [], previousNodes: [], children: [], flags: [] };
    }
    
    return {
      nodeIds: fullGraphData[0] || [],
      urls: fullGraphData[1] || [],
      descriptions: fullGraphData[2] || [],
      previousNodes: fullGraphData[3] || [],
      children: fullGraphData[4] || [],
      flags: fullGraphData[5] || []
    };
  }, [fullGraphData]);
  
  // Extract node IDs for iteration
  const nodeIds = graphData.nodeIds.map(id => typeof id === 'bigint' ? Number(id) : parseInt(String(id)));

  const isLoadingAny = isLoadingLeaves || isLoadingFullGraph || isLoadingUniverse;

  // Build timelines by using getNode for each node in the chain
  const timelines = useMemo(() => {
    if (!leavesData || !Array.isArray(leavesData) || !fullGraphData) return [];
    
    // For now, return a simplified structure - we'll fetch nodes on demand in the visualization
    return leavesData.map((leafId, index) => ({
      id: `timeline-${typeof leafId === 'bigint' ? Number(leafId) : leafId}`,
      leafNodeId: typeof leafId === 'bigint' ? Number(leafId) : leafId,
      events: [] // We'll populate this dynamically
    }));
  }, [leavesData, fullGraphData]);

  // Generate React Flow nodes and edges from structured graph data
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    if (!graphData.nodeIds.length) {
      return { nodes: [], edges: [] };
    }
    
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const verticalSpacing = 120;
    const horizontalSpacing = 300;
    const startX = 100;
    
    // Colors for different timelines
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Create nodes using the structured data
    graphData.nodeIds.forEach((nodeIdStr, index) => {
      const nodeId = typeof nodeIdStr === 'bigint' ? Number(nodeIdStr) : parseInt(String(nodeIdStr));
      const url = graphData.urls[index] || '';
      const description = graphData.descriptions[index] || '';
      const previousNode = graphData.previousNodes[index] || '';
      const children = graphData.children[index] || [];
      const isCanon = graphData.flags[index] || false;
      
      // Determine timeline position - leaves get their own columns
      const isLeaf = children.length === 0;
      const leafIndex = leavesData?.findIndex(leaf => 
        (typeof leaf === 'bigint' ? Number(leaf) : leaf) === nodeId
      ) || 0;
      
      // Position based on whether it's a leaf or part of main chain
      const x = isLeaf ? 
        startX + (leafIndex + 1) * horizontalSpacing : 
        startX + (index % 2) * horizontalSpacing;
      const y = index * verticalSpacing;
      
      const color = isCanon ? colors[0] : colors[(leafIndex + 1) % colors.length];
      
      nodes.push({
        id: `blockchain-node-${nodeId}`,
        type: 'timelineEvent',
        position: { x, y },
        data: {
          label: `${nodeId}`,
          description: description || `Timeline event ${nodeId}`,
          videoUrl: url || 'https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI',
          characters: [],
          timelineColor: color,
          timelineName: isCanon ? 'Canon Timeline' : `Timeline ${leafIndex + 1}`,
          eventId: `node-${nodeId}`,
          timelineId: `timeline-${nodeId}`,
          universeId: universe?.id || 'unknown',
          isRoot: String(previousNode) === '0' || !previousNode
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
        
        edges.push({
          id: `edge-${previousNodeId}-${nodeId}`,
          source: `blockchain-node-${previousNodeId}`,
          target: `blockchain-node-${nodeId}`,
          type: 'straight',
          style: { stroke: color, strokeWidth: 3 },
          animated: false,
          markerEnd: undefined
        });
      }
    });
    
    return { nodes, edges };
  }, [graphData, leavesData, universe?.id]);

  const nodeTypes = useMemo(() => ({
    timelineEvent: TimelineEventNode,
  }), []);

  // Handle loading timeline to flow editor
  const handleLoadToFlowEditor = () => {
    // Encode the timeline data as URL parameters
    const timelineParams = {
      nodeIds: nodeIds.join(','),
      universeId: universe?.id || 'unknown',
      totalNodes: nodeIds.length.toString()
    };
    
    navigate({ 
      to: '/flow', 
      search: timelineParams 
    });
  };

  // Show loading state
  if (isLoadingUniverse || (id !== 'blockchain-universe' && !universe)) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading universe data...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show not found state
  if (id !== 'blockchain-universe' && !universe) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">
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
    <div className="container mx-auto p-6">
      {/* Show Timeline Actions only for default universe */}
      {universe?.isDefault && <TimelineActions />}
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/universes">← Back to Universes</Link>
          </Button>
        </div>
        <div className="relative mb-6">
          <img 
            src={universe?.imageUrl} 
            alt={universe?.name}
            className="w-full h-48 object-cover rounded-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop';
            }}
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{universe?.name}</h1>
              <p className="text-lg opacity-90">{universe?.description}</p>
              {!universe?.isDefault && (
                <div className="mt-2 space-y-1 text-sm opacity-75">
                  <p>Creator: {universe?.creator?.slice(0, 6)}...{universe?.creator?.slice(-4)}</p>
                  <p>Timeline: {universe?.address?.slice(0, 6)}...{universe?.address?.slice(-4)}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Timeline Graph Visualization */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              <h2 className="text-2xl font-semibold">Timeline Branches</h2>
            </div>
            <Button 
              onClick={handleLoadToFlowEditor}
              disabled={isLoadingAny}
              className="flex items-center gap-2"
              variant="outline"
            >
              <Edit className="w-4 h-4" />
              Load to Flow Editor
            </Button>
          </div>
          
          <Card className="overflow-hidden bg-background">
            <div style={{ width: '100%', height: '700px' }}>
              {isLoadingAny ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading timeline data...</p>
                  </div>
                </div>
              ) : flowNodes.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="text-6xl opacity-20">🌌</div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Empty Universe</h3>
                      <p className="text-muted-foreground mb-4">
                        {universe?.isDefault 
                          ? "No timeline events have been created yet."
                          : "This universe doesn't have any timeline data yet."
                        }
                      </p>
                      <div className="space-y-2">
                        <Button 
                          onClick={handleLoadToFlowEditor}
                          className="mr-2"
                        >
                          <Edit className="w-4 h-4 mr-2" />
                          Create Timeline in Flow Editor
                        </Button>
                        <Button variant="outline" asChild>
                          <Link to="/universes">
                            Return to Universes
                          </Link>
                        </Button>
                        {!universe?.isDefault && (
                          <div className="text-xs text-muted-foreground mt-3">
                            <p>This universe uses timeline contract:</p>
                            <code className="bg-muted px-2 py-1 rounded text-xs">{universe?.address}</code>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <ReactFlow
                  nodes={flowNodes}
                  edges={flowEdges}
                  nodeTypes={nodeTypes}
                  connectionMode={ConnectionMode.Loose}
                  fitView
                  fitViewOptions={{ padding: 0.1, includeHiddenNodes: false }}
                  minZoom={0.2}
                  maxZoom={2}
                  defaultViewport={{ x: 0, y: 0, zoom: 0.6 }}
                  proOptions={{ hideAttribution: true }}
                >
                  <Controls />
                  <Background 
                    variant={BackgroundVariant.Lines} 
                    gap={20} 
                    size={1}
                    color="#e5e5e5"
                    className="opacity-50"
                  />
                </ReactFlow>
              )}
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline Data Source</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded-full" />
                  <span className="text-sm font-medium">Blockchain Timelines</span>
                  <Badge variant="secondary" className="text-xs">
                    Live from Smart Contract
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {timelines.length} timeline{timelines.length !== 1 ? 's' : ''} traced from {leavesData && Array.isArray(leavesData) ? leavesData.length : 0} leaves
                </div>
                <div className="text-xs text-muted-foreground">
                  Timelines built by tracing back from leaves via previous node relationships
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Universe Info Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Universe Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-2">Total Nodes</h4>
                <p className="text-2xl font-bold">
                  {nodeIds.length}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Universe Type</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className={universe?.isDefault ? "bg-blue-50" : "bg-purple-50"}>
                    {universe?.isDefault ? 'Default Universe' : 'Created Universe'}
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    Live Data
                  </Badge>
                </div>
              </div>

              {!universe?.isDefault && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Contract Addresses</h4>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>
                      <span className="font-medium">Timeline:</span>
                      <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                        {universe?.address?.slice(0, 20)}...
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Token:</span>
                      <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                        {universe?.tokenAddress?.slice(0, 20)}...
                      </div>
                    </div>
                    <div>
                      <span className="font-medium">Governance:</span>
                      <div className="font-mono bg-muted px-2 py-1 rounded mt-1">
                        {universe?.governanceAddress?.slice(0, 20)}...
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-2">Status</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLoadingAny ? 'bg-yellow-500' : nodeIds.length > 0 ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <span className="text-sm">
                    {isLoadingAny ? 'Loading...' : nodeIds.length > 0 ? 'Active Timeline' : 'Empty Universe'}
                  </span>
                </div>
              </div>

              <div className="pt-4">
                <Button className="w-full" asChild>
                  <Link to="/universes">Back to Universe Hub</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start" 
                asChild
              >
                <Link to="/universes">
                  <ArrowRight className="w-3 h-3 mr-2" />
                  Manage Timeline
                </Link>
              </Button>
              
              {nodeIds.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  asChild
                >
                  <Link to="/event/$universeId/$timelineId/$eventId" params={{ 
                    universeId: universe?.id || 'unknown', 
                    timelineId: 'blockchain-timeline', 
                    eventId: `node-${nodeIds[0]}`
                  }}>
                    <ArrowRight className="w-3 h-3 mr-2" />
                    View First Node
                  </Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/universe/$id")({
  component: UniverseViewPage,
});