import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { universes } from "@/data/universes";
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

interface UniverseParams {
  id: string;
}

function UniverseViewPage() {
  const { id } = useParams({ from: "/universe/$id" });
  const universe = universes.find(u => u.id === id);

  if (!universe) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Universe Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested universe could not be found.
            </p>
            <Button asChild>
              <Link to="/universes">Back to Universes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Generate React Flow nodes and edges with git-like layout
  const { nodes: flowNodes, edges: flowEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const verticalSpacing = 120;
    const horizontalSpacing = 300;
    const startX = 100;
    
    // Colors for different timelines
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
    
    // Track the x position for each timeline branch
    const branchPositions: Record<string, number> = {};
    let currentY = 0;
    
    // Add the common starting node
    const commonStart = universe.timelines[0]?.nodes[0];
    if (!commonStart) return { nodes: [], edges: [] };
    
    // Create root node
    nodes.push({
      id: 'root',
      type: 'timelineEvent',
      position: { x: startX, y: currentY },
      data: {
        label: commonStart.title,
        description: commonStart.description,
        videoUrl: commonStart.videoUrl,
        characters: commonStart.characters,
        isRoot: true
      }
    });
    
    currentY += verticalSpacing;
    
    // Create a map to track where each timeline branches
    const timelineBranchPoints: Record<string, { nodeId: string; y: number }> = {};
    
    // First, lay out all nodes vertically as if they were a single timeline
    const allEvents: Array<{ node: any; timeline: any; timelineIndex: number }> = [];
    
    universe.timelines.forEach((timeline, timelineIndex) => {
      timeline.nodes.slice(1).forEach((node) => {
        allEvents.push({ node, timeline, timelineIndex });
      });
    });
    
    // Sort events to create a logical flow
    allEvents.sort((a, b) => {
      // Group by timeline first, then by position in timeline
      if (a.timelineIndex !== b.timelineIndex) {
        return a.timelineIndex - b.timelineIndex;
      }
      return 0;
    });
    
    // Create the git-like branch structure
    universe.timelines.forEach((timeline, timelineIndex) => {
      const color = colors[timelineIndex % colors.length];
      const branchX = startX + (timelineIndex * horizontalSpacing);
      branchPositions[timeline.id] = branchX;
      
      let previousNodeId = 'root';
      let branchY = currentY + verticalSpacing;
      
      // Add a timeline label node
      const labelNodeId = `label-${timeline.id}`;
      nodes.push({
        id: labelNodeId,
        type: 'default',
        position: {
          x: branchX - 50,
          y: branchY - 40
        },
        data: {
          label: timeline.name
        },
        style: {
          background: color,
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          fontSize: '12px',
          padding: '4px 8px',
          width: 'auto'
        },
        selectable: false,
        draggable: false
      });
      
      timeline.nodes.slice(1).forEach((node, nodeIndex) => {
        const nodeId = `${timeline.id}-${node.id}`;
        
        // Calculate Y position with consistent spacing
        const nodeY = branchY + (nodeIndex * verticalSpacing);
        
        nodes.push({
          id: nodeId,
          type: 'timelineEvent',
          position: {
            x: branchX,
            y: nodeY
          },
          data: {
            label: node.title,
            description: node.description,
            videoUrl: node.videoUrl,
            characters: node.characters,
            timelineColor: color,
            timelineName: timeline.name
          }
        });
        
        // Create edge from previous node
        if (nodeIndex === 0) {
          // First node of branch connects to root
          edges.push({
            id: `root-${nodeId}`,
            source: 'root',
            target: nodeId,
            type: 'smoothstep',
            style: { stroke: color, strokeWidth: 3 },
            animated: false,
            markerEnd: undefined,
            sourceHandle: null,
            targetHandle: null
          });
        } else {
          // Subsequent nodes connect to previous in same branch
          edges.push({
            id: `${previousNodeId}-${nodeId}`,
            source: previousNodeId,
            target: nodeId,
            type: 'straight',
            style: { stroke: color, strokeWidth: 3 },
            animated: false,
            markerEnd: undefined
          });
        }
        
        previousNodeId = nodeId;
      });
    });
    
    return { nodes, edges };
  }, [universe]);

  const nodeTypes = useMemo(() => ({
    timelineEvent: TimelineEventNode,
  }), []);

  return (
    <div className="container mx-auto p-6">
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
            </div>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                {universe.timelines.map((timeline, index) => {
                  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];
                  const color = colors[index % colors.length];
                  return (
                    <div key={timeline.id} className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full" 
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm font-medium">{timeline.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {timeline.nodes.length} events
                      </Badge>
                    </div>
                  );
                })}
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
                <h4 className="text-sm font-medium mb-2">Total Timelines</h4>
                <p className="text-2xl font-bold">{universe.timelines.length}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2">Total Events</h4>
                <p className="text-2xl font-bold">
                  {universe.timelines.reduce((total, timeline) => total + timeline.nodes.length, 0)}
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-2">Unique Characters</h4>
                <p className="text-2xl font-bold">
                  {new Set(
                    universe.timelines.flatMap(timeline => 
                      timeline.nodes.flatMap(node => node.characters)
                    )
                  ).size}
                </p>
              </div>

              <div className="pt-4">
                <Button className="w-full" asChild>
                  <Link to="/universes">Explore Other Universes</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {universe.timelines.map((timeline) => (
                <Button 
                  key={timeline.id} 
                  variant="outline" 
                  size="sm" 
                  className="w-full justify-start" 
                  asChild
                >
                  <Link to="/timeline" search={{ universe: universe.id, timeline: timeline.id }}>
                    <ArrowRight className="w-3 h-3 mr-2" />
                    {timeline.name}
                  </Link>
                </Button>
              ))}
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