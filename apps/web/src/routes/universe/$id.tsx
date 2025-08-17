import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, GitBranch } from "lucide-react";
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
import { useGetNode, useGetLeaves } from '@/hooks/useTimeline';

interface UniverseParams {
  id: string;
}

function UniverseViewPage() {
  const { id } = useParams({ from: "/universe/$id" });
  
  // Define our single blockchain universe
  const universe = {
    id: 'blockchain-universe',
    name: 'Cyberpunk City',
    description: 'A decentralized narrative universe powered by blockchain technology',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop'
  };

  // Get timeline leaves (endpoints)
  const { data: leavesData, isLoading: isLoadingLeaves } = useGetLeaves();
  
  // Fetch individual nodes (IDs 0-4) for building timelines
  const { data: node0, isLoading: isLoading0 } = useGetNode(0);
  const { data: node1, isLoading: isLoading1 } = useGetNode(1);
  const { data: node2, isLoading: isLoading2 } = useGetNode(2);
  const { data: node3, isLoading: isLoading3 } = useGetNode(3);
  const { data: node4, isLoading: isLoading4 } = useGetNode(4);
  
  const nodeDataMap = new Map([
    [0, node0],
    [1, node1], 
    [2, node2],
    [3, node3],
    [4, node4]
  ]);
  
  const isLoadingAny = isLoadingLeaves || isLoading0 || isLoading1 || isLoading2 || isLoading3 || isLoading4;

  // Build timelines from leaves and trace back via previous relationships
  const timelines = useMemo(() => {
    if (!leavesData || !Array.isArray(leavesData)) return [];
    
    const timelinesList: Array<{id: string, events: Array<{id: number, data: any}>}> = [];
    
    leavesData.forEach((leafId, timelineIndex) => {
      const leafNodeId = typeof leafId === 'bigint' ? Number(leafId) : leafId;
      const timeline = { id: `timeline-${leafNodeId}`, events: [] as Array<{id: number, data: any}> };
      
      // Trace back from leaf to root
      let currentNodeId = leafNodeId;
      const visited = new Set();
      
      while (currentNodeId !== null && currentNodeId !== undefined && !visited.has(currentNodeId)) {
        visited.add(currentNodeId);
        const nodeData = nodeDataMap.get(currentNodeId);
        
        if (nodeData && Array.isArray(nodeData)) {
          timeline.events.unshift({ id: currentNodeId, data: nodeData });
          
          // Get previous node ID (index 3 in the response)
          const previous = nodeData[3];
          const prevNodeId = typeof previous === 'bigint' ? Number(previous) : previous;
          
          // Stop if previous is 0 (root) or invalid
          if (!prevNodeId || prevNodeId === 0) {
            // Add node 0 as root if it exists
            if (currentNodeId !== 0) {
              const rootData = nodeDataMap.get(0);
              if (rootData) {
                timeline.events.unshift({ id: 0, data: rootData });
              }
            }
            break;
          }
          
          currentNodeId = prevNodeId;
        } else {
          break;
        }
      }
      
      timelinesList.push(timeline);
    });
    
    return timelinesList;
  }, [leavesData, nodeDataMap]);

  // Generate React Flow nodes and edges from timelines
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const verticalSpacing = 120;
    const horizontalSpacing = 300;
    const startX = 100;
    
    // Colors for different timelines
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Track node positions to avoid duplicates
    const nodePositions = new Map();
    
    timelines.forEach((timeline, timelineIndex) => {
      const color = colors[timelineIndex % colors.length];
      
      timeline.events.forEach((event, eventIndex) => {
        const nodeId = event.id;
        const nodeData = event.data;
        
        // Extract data from node response [id, url, desc, prev_node_id, array, bool]
        const nodeIdFromData = nodeData[0];
        const url = nodeData[1] || '';
        const description = nodeData[2] || '';
        
        // Position nodes
        const x = startX + (timelineIndex * horizontalSpacing);
        const y = eventIndex * verticalSpacing;
        
        // Check if node already exists
        const existingNodeId = `blockchain-node-${nodeId}`;
        if (!nodePositions.has(nodeId)) {
          nodePositions.set(nodeId, { x, y });
          
          nodes.push({
            id: existingNodeId,
            type: 'timelineEvent',
            position: { x, y },
            data: {
              label: `${nodeIdFromData || nodeId}`,
              description: description || `Timeline event ${nodeId}`,
              videoUrl: url || 'https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI',
              characters: [],
              timelineColor: color,
              timelineName: `Timeline ${timelineIndex + 1}`,
              eventId: `node-${nodeId}`,
              timelineId: timeline.id,
              universeId: universe.id,
              isRoot: nodeId === 0
            }
          });
        }
        
        // Create edges between consecutive events in timeline
        if (eventIndex > 0) {
          const prevEvent = timeline.events[eventIndex - 1];
          const prevNodeId = prevEvent.id;
          
          edges.push({
            id: `edge-${prevNodeId}-${nodeId}`,
            source: `blockchain-node-${prevNodeId}`,
            target: `blockchain-node-${nodeId}`,
            type: 'straight',
            style: { stroke: color, strokeWidth: 3 },
            animated: false,
            markerEnd: undefined
          });
        }
      });
    });
    
    return { nodes, edges };
  }, [timelines, universe.id]);

  const nodeTypes = useMemo(() => ({
    timelineEvent: TimelineEventNode,
  }), []);

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
          <div className="flex items-center gap-2 mb-4">
            <GitBranch className="w-5 h-5" />
            <h2 className="text-2xl font-semibold">Timeline Branches</h2>
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
                <h4 className="text-sm font-medium mb-2">Active Timelines</h4>
                <p className="text-2xl font-bold">
                  {timelines.length}
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
              
              {timelines.length > 0 && timelines[0].events.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  asChild
                >
                  <Link to="/event/$universeId/$timelineId/$eventId" params={{ 
                    universeId: universe.id, 
                    timelineId: timelines[0].id, 
                    eventId: `node-${timelines[0].events[0].id}`
                  }}>
                    <ArrowRight className="w-3 h-3 mr-2" />
                    View First Event
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