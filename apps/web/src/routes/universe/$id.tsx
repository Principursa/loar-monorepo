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
import { useGetNode, useGetLeaves, useGetFullGraph } from '@/hooks/useTimeline';

interface UniverseParams {
  id: string;
}

function UniverseViewPage() {
  const { id } = useParams({ from: "/universe/$id" });
  const navigate = useNavigate();
  
  // Define our single blockchain universe
  const universe = {
    id: 'blockchain-universe',
    name: 'Cyberpunk City',
    description: 'A decentralized narrative universe powered by blockchain technology',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop'
  };

  // Get timeline leaves (endpoints) and full graph
  const { data: leavesData, isLoading: isLoadingLeaves } = useGetLeaves();
  const { data: fullGraphData, isLoading: isLoadingFullGraph } = useGetFullGraph();
  
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

  const isLoadingAny = isLoadingLeaves || isLoadingFullGraph;

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
          universeId: universe.id,
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
  }, [graphData, leavesData, universe.id]);

  const nodeTypes = useMemo(() => ({
    timelineEvent: TimelineEventNode,
  }), []);

  // Handle loading timeline to flow editor
  const handleLoadToFlowEditor = () => {
    // Encode the timeline data as URL parameters
    const timelineParams = {
      nodeIds: nodeIds.join(','),
      universeId: universe.id,
      totalNodes: nodeIds.length.toString()
    };
    
    navigate({ 
      to: '/flow', 
      search: timelineParams 
    });
  };

  return (
    <div className="container mx-auto p-6">
      {/* Blockchain Timeline Actions */}
      <TimelineActions />
      
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link to="/universes">← Back to Universes</Link>
          </Button>
        </div>
        <div className="relative mb-6">
          <img 
            src={universe.imageUrl} 
            alt={universe.name}
            className="w-full h-48 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-end">
            <div className="p-6 text-white">
              <h1 className="text-4xl font-bold mb-2">{universe.name}</h1>
              <p className="text-lg opacity-90">{universe.description}</p>
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
              disabled={nodeIds.length === 0 || isLoadingAny}
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
                    <p className="text-muted-foreground">Loading blockchain timeline data...</p>
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
                <h4 className="text-sm font-medium mb-2">Data Source</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    Smart Contract
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    Live Data
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Contract Status</h4>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isLoadingAny ? 'bg-yellow-500' : 'bg-green-500'}`} />
                  <span className="text-sm">
                    {isLoadingAny ? 'Loading...' : 'Connected'}
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
                    universeId: universe.id, 
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