import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Loader2 } from 'lucide-react';
import type { Node, Edge } from 'reactflow';
import { MarkerType } from 'reactflow';
import { TimelineFlowEditor } from './TimelineFlowEditor';
import type { TimelineNodeData } from './TimelineNodes';
import { useGetFullGraph } from '@/hooks/useTimeline';

export function TimelineFlowWithData({ 
  universeId, 
  timelineId, 
  rootNodeId = 1,
  isCreateDialogOpen = false,
  setIsCreateDialogOpen = () => {}
}: {
  universeId: string;
  timelineId: string;
  rootNodeId?: number;
  isCreateDialogOpen?: boolean;
  setIsCreateDialogOpen?: (open: boolean) => void;
}) {
  const [initialNodes, setInitialNodes] = useState<Node<TimelineNodeData>[]>([]);
  const [initialEdges, setInitialEdges] = useState<Edge[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isConnected } = useAccount();
  
  // Use the hook to get the full graph data from the blockchain
  const { data: graphData, isLoading: isLoadingGraph, isError } = useGetFullGraph();
  
  // Process the graph data from the blockchain into ReactFlow nodes and edges
  useEffect(() => {
    if (!isConnected || isLoadingGraph || !graphData) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      // Extract data from the blockchain response
      const [ids, links, plots, previousIds, nextIds, canonFlags] = graphData;
      
      // Create nodes for ReactFlow
      const nodes: Node<TimelineNodeData>[] = [];
      const edges: Edge[] = [];
      
      // Process each node from the blockchain data
      for (let i = 0; i < ids.length; i++) {
        const id = Number(ids[i]);
        const videoUrl = String(links[i]);
        const plot = String(plots[i]);
        const previousId = Number(previousIds[i]);
        const isCanon = Boolean(canonFlags[i]);
        
        // Skip empty nodes (id === 0)
        if (id === 0) continue;
        
        // Create a node for the graph
        const newNode: Node<TimelineNodeData> = {
          id: `node-${id}`,
          type: 'timelineEvent',
          position: {
            // Position nodes in a tree-like structure
            // This is a simple layout algorithm that will be improved
            x: (id % 3) * 300,
            y: Math.floor(id / 3) * 200,
          },
          data: {
            label: `Event ${id}${isCanon ? ' (Canon)' : ''}`,
            description: plot,
            videoUrl: videoUrl,
            eventId: id.toString(),
            timelineId: timelineId,
            universeId: universeId,
            isCanon: isCanon,
          },
        };
        
        nodes.push(newNode);
        
        // Create an edge if this node has a previous node
        if (previousId > 0) {
          const newEdge: Edge = {
            id: `edge-node-${previousId}-node-${id}`,
            source: `node-${previousId}`,
            target: `node-${id}`,
            animated: true,
            style: { stroke: isCanon ? '#10b981' : '#94a3b8' },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: isCanon ? '#10b981' : '#94a3b8',
            },
          };
          edges.push(newEdge);
        }
      }
      
      setInitialNodes(nodes);
      setInitialEdges(edges);
    } catch (error) {
      console.error('Error processing timeline data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [graphData, isConnected, isLoadingGraph, timelineId, universeId]);
  
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Narrative Timeline Editor</h2>
      <p className="text-muted-foreground">
        Create and connect narrative elements to build your story's timeline. 
        Each node represents a plot point that can be connected to form a coherent narrative.
      </p>
      
      {!isConnected ? (
        <div className="h-[600px] w-full border rounded-lg flex flex-col items-center justify-center gap-4">
          <p className="text-lg">Connect your wallet to view and edit the timeline</p>
          <p className="text-sm text-muted-foreground">You need to connect a wallet to interact with the blockchain</p>
        </div>
      ) : isLoading || isLoadingGraph ? (
        <div className="h-[600px] w-full border rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading timeline data from blockchain...</p>
          </div>
        </div>
      ) : isError ? (
        <div className="h-[600px] w-full border rounded-lg flex items-center justify-center">
          <div className="flex flex-col items-center gap-2 text-destructive">
            <p>Error loading timeline data</p>
            <p className="text-sm">Please check your connection and try again</p>
          </div>
        </div>
      ) : (
        <TimelineFlowEditor
          universeId={universeId}
          timelineId={timelineId}
          initialNodes={initialNodes}
          initialEdges={initialEdges}
          rootNodeId={rootNodeId}
          isCreateDialogOpen={isCreateDialogOpen}
          setIsCreateDialogOpen={setIsCreateDialogOpen}
        />
      )}
    </div>
  );
}
