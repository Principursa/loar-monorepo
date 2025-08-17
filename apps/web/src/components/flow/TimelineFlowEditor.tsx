import { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  Panel,
  MarkerType,
  addEdge
} from 'reactflow';
import type {
  Node,
  Edge,
  Connection
} from 'reactflow';
import 'reactflow/dist/style.css';
import { TimelineEventNode } from './TimelineNodes';
import type { TimelineNodeData } from './TimelineNodes';
import { CreateTimelineNode } from './CreateTimelineNode';
import { Button } from '@/components/ui/button';
import { Video, Plus, FileVideo } from 'lucide-react';

// Define simple Dialog components to avoid import errors
const Dialog = ({ children, open, onOpenChange }: { children: React.ReactNode, open?: boolean, onOpenChange?: (open: boolean) => void }) => {
  return <div className="dialog-wrapper">{children}</div>;
};

const DialogTrigger = ({ children, asChild }: { children: React.ReactNode, asChild?: boolean }) => {
  return <div className="dialog-trigger">{children}</div>;
};

const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return <div className="dialog-content p-4 border rounded-lg bg-white shadow-lg">{children}</div>;
};

// Register custom node types
const nodeTypes = {
  timelineEvent: TimelineEventNode,
};

interface TimelineFlowEditorProps {
  universeId: string;
  timelineId: string;
  initialNodes?: Node<TimelineNodeData>[];
  initialEdges?: Edge[];
  rootNodeId?: number; // The ID of the root node in the blockchain
  isCreateDialogOpen?: boolean;
  setIsCreateDialogOpen?: (open: boolean) => void;
}

export function TimelineFlowEditor({
  universeId,
  timelineId,
  initialNodes = [],
  initialEdges = [],
  rootNodeId = 0,
  isCreateDialogOpen: externalIsCreateDialogOpen,
  setIsCreateDialogOpen: externalSetIsCreateDialogOpen
}: TimelineFlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<TimelineNodeData> | null>(null);
  
  // Use external dialog state if provided, otherwise use internal state
  const [internalIsCreateDialogOpen, internalSetIsCreateDialogOpen] = useState(false);
  const isCreateDialogOpen = externalIsCreateDialogOpen !== undefined ? externalIsCreateDialogOpen : internalIsCreateDialogOpen;
  const setIsCreateDialogOpen = externalSetIsCreateDialogOpen || internalSetIsCreateDialogOpen;
  
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

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
  const onNodeClick = useCallback((_: React.MouseEvent, node: Node<TimelineNodeData>) => {
    setSelectedNode(node);
  }, []);

  // Add a new node to the flow after it's created on the blockchain
  const handleNodeCreated = (nodeId: number, previousNodeId: number, videoUrl: string, plot: string) => {
    // Create a new node in the flow
    const newNode: Node<TimelineNodeData> = {
      id: `node-${nodeId}`,
      type: 'timelineEvent',
      position: {
        x: selectedNode ? selectedNode.position.x + 250 : 250,
        y: selectedNode ? selectedNode.position.y : 100,
      },
      data: {
        label: `Event ${nodeId}`,
        description: plot,
        videoUrl: videoUrl,
        eventId: nodeId.toString(),
        timelineId: timelineId,
        universeId: universeId,
      },
    };

    // Add the new node to the flow
    setNodes((nds) => [...nds, newNode]);

    // If there's a selected node, create an edge from it to the new node
    if (selectedNode) {
      const newEdge: Edge = {
        id: `edge-${selectedNode.id}-${newNode.id}`,
        source: selectedNode.id,
        target: newNode.id,
        animated: true,
        style: { stroke: '#10b981' },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
        },
      };
      setEdges((eds) => [...eds, newEdge]);
    }

    // Close the dialog
    setIsCreateDialogOpen(false);
    
    // Log the successful creation
    console.log(`Created new timeline node ${nodeId} with previous node ${previousNodeId}`);
    console.log(`Video URL: ${videoUrl}`);
    console.log(`Plot: ${plot}`);
  };

  return (
    <ReactFlowProvider>
      <div ref={reactFlowWrapper} className="h-[600px] w-full border rounded-lg">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
        >
          <Background />
          <Controls />
          <Panel position="top-right" className="flex flex-col gap-2">
            <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border shadow-sm">
              <h3 className="text-sm font-medium mb-2">Narrative Timeline</h3>
              <p className="text-xs text-muted-foreground mb-3">Create and connect narrative elements to build your story.</p>
              
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 w-full" 
                    size="lg"
                    variant="default"
                  >
                    <FileVideo className="h-5 w-5" />
                    Post New Narrative Content
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <CreateTimelineNode 
                    previousNodeId={selectedNode ? parseInt(selectedNode.data.eventId || '0') : rootNodeId}
                    onSuccess={(nodeId) => {
                      // For now, we'll create mock data for the newly created node
                      // In a real implementation, we would fetch the node data from the blockchain
                      const videoUrlStr = `https://example.com/video${nodeId}`;
                      const plotStr = `Plot description for node ${nodeId}`;
                      
                      // Create the node in the UI with the blockchain data
                      handleNodeCreated(
                        nodeId,
                        selectedNode ? parseInt(selectedNode.data.eventId || '0') : rootNodeId,
                        videoUrlStr,
                        plotStr
                      );
                    }}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </Panel>
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  );
}

// This component has been moved to TimelineFlowWithData.tsx
