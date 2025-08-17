import { useCallback, useMemo, useEffect, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import type { NodeDragHandler, SelectionDragHandler } from 'reactflow';
import { type Node, type Edge, type Connection, ConnectionMode, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { CharacterNode, PlotPointNode, MediaNode, VotingNode } from './CustomNodes';
import { EditableCharacterNode, EditablePlotPointNode, EditableMediaNode, EditableVotingNode } from './EditableNodes';

// Initial nodes and edges for the flow with custom node types
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'character',
    data: { 
      label: 'Hero Character', 
      emoji: '🦸', 
      description: 'Main protagonist with NFT ownership',
      nftId: 'NFT #1234'
    },
    position: { x: 250, y: 5 },
  },
  {
    id: '2',
    type: 'plotPoint',
    data: { 
      label: 'Origin Story', 
      emoji: '📜',
      description: 'The beginning of the hero journey',
      canonicity: 'Canon'
    },
    position: { x: 100, y: 100 },
  },
  {
    id: '3',
    type: 'media',
    data: { 
      label: 'Cinematic Scene', 
      emoji: '🎬',
      description: 'Key visual moment in the narrative',
      storageType: 'Walrus Protocol'
    },
    position: { x: 400, y: 100 },
  },
  {
    id: '4',
    type: 'voting',
    data: { 
      label: 'Plot Resolution Vote', 
      emoji: '🗳️',
      description: 'Community decides the canonical ending',
      status: 'Active'
    },
    position: { x: 250, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true },
  { id: 'e1-3', source: '1', target: '3' },
  { id: 'e2-4', source: '2', target: '4' },
  { id: 'e3-4', source: '3', target: '4', animated: true },
];

interface FlowEditorProps {
  timelineData?: Array<{
    id: number;
    url: string;
    description: string;
    previousNode: string;
    isCanon: boolean;
  }>;
  editorRef?: React.MutableRefObject<any>;
}

export default function FlowEditor({ timelineData, editorRef }: FlowEditorProps) {
  // Generate initial nodes from timeline data if provided
  const generatedNodes = useMemo(() => {
    if (!timelineData || timelineData.length === 0) return initialNodes;
    
    return timelineData.map((node, index) => ({
      id: `timeline-${node.id}`,
      type: 'plotPoint',
      data: {
        label: `Timeline Node ${node.id}`,
        emoji: node.isCanon ? '⭐' : '📝',
        description: node.description || `Timeline event ${node.id}`,
        canonicity: node.isCanon ? 'Canon' : 'Branch',
        timelineId: node.id,
        videoUrl: node.url
      },
      position: { 
        x: 100 + (index % 3) * 300, 
        y: 100 + Math.floor(index / 3) * 150 
      },
    }));
  }, [timelineData]);
  
  // Generate edges based on previous node relationships
  const generatedEdges = useMemo(() => {
    if (!timelineData || timelineData.length === 0) return initialEdges;
    
    const edges: Edge[] = [];
    timelineData.forEach(node => {
      if (node.previousNode && String(node.previousNode) !== '0') {
        const previousNodeId = parseInt(String(node.previousNode));
        const previousExists = timelineData.find(n => n.id === previousNodeId);
        
        if (previousExists) {
          edges.push({
            id: `edge-timeline-${previousNodeId}-${node.id}`,
            source: `timeline-${previousNodeId}`,
            target: `timeline-${node.id}`,
            animated: node.isCanon,
            style: node.isCanon ? { stroke: '#3b82f6', strokeWidth: 3 } : undefined
          });
        }
      }
    });
    
    return edges;
  }, [timelineData]);

  const [nodes, setNodes, onNodesChange] = useNodesState(generatedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(generatedEdges);

  // Update nodes and edges when timeline data changes
  useEffect(() => {
    setNodes(generatedNodes);
    setEdges(generatedEdges);
  }, [generatedNodes, generatedEdges, setNodes, setEdges]);
  
  // Track if we're currently interacting with a node element (like textarea or button)
  const [isInteractingWithNodeElement, setIsInteractingWithNodeElement] = useState(false);

  // Expose nodes and edges data through the ref
  if (editorRef) {
    editorRef.current = {
      nodes,
      edges,
      getNodeData: () => {
        // Extract relevant data from nodes for blockchain submission
        return nodes.map(node => ({
          id: node.id,
          type: node.type,
          data: node.data,
          connections: edges
            .filter(edge => edge.source === node.id || edge.target === node.id)
            .map(edge => ({
              source: edge.source,
              target: edge.target,
              id: edge.id
            }))
        }));
      },
      updateNodeData: (nodeId: string, newData: any) => {
        setNodes(nds => 
          nds.map(node => {
            if (node.id === nodeId) {
              return { ...node, data: { ...node.data, ...newData } };
            }
            return node;
          })
        );
      }
    };
  }

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Register custom node types
  const nodeTypes = useMemo(() => ({
    character: CharacterNode,
    plotPoint: PlotPointNode,
    media: MediaNode,
    voting: VotingNode,
  }), []);

  // Add a new node to the flow
  const addNode = useCallback((type: string) => {
    const newNode = {
      id: `node-${Date.now()}`,
      type,
      position: {
        x: Math.random() * 500,
        y: Math.random() * 300,
      },
      data: {
        label: type === 'character' ? 'New Character' :
               type === 'plotPoint' ? 'New Plot Point' :
               type === 'media' ? 'New Media' : 'New Vote',
        emoji: type === 'character' ? '👤' :
                type === 'plotPoint' ? '📝' :
                type === 'media' ? '🎬' : '🗳️',
        description: 'Add description here...',
        ...(type === 'character' && { nftId: 'Unassigned' }),
        ...(type === 'plotPoint' && { canonicity: 'Pending' }),
        ...(type === 'media' && { storageType: 'Walrus Protocol' }),
        ...(type === 'voting' && { status: 'Pending' }),
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);

  // Custom handlers for node dragging
  const onNodeDragStart: NodeDragHandler = useCallback(() => {
    // Only set dragging state if we're not interacting with a node element
    if (!isInteractingWithNodeElement) {
      document.body.style.cursor = 'grabbing';
    }
  }, [isInteractingWithNodeElement]);

  const onNodeDrag: NodeDragHandler = useCallback(() => {
    // This is intentionally empty to allow the default behavior
  }, []);

  const onNodeDragStop: NodeDragHandler = useCallback(() => {
    document.body.style.cursor = 'default';
  }, []);

  // Custom handler for selection dragging
  const onSelectionDragStart: SelectionDragHandler = useCallback(() => {
    if (!isInteractingWithNodeElement) {
      document.body.style.cursor = 'grabbing';
    }
  }, [isInteractingWithNodeElement]);

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        onNodeDragStart={onNodeDragStart}
        onNodeDrag={onNodeDrag}
        onNodeDragStop={onNodeDragStop}
        onSelectionDragStart={onSelectionDragStart}
        selectNodesOnDrag={!isInteractingWithNodeElement}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Panel position="top-left">
          <div className="bg-card p-3 rounded-md shadow-md">
            <h3 className="text-lg font-bold mb-2">Narrative Flow Editor</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Create and connect narrative elements to establish canon
              {timelineData && timelineData.length > 0 && (
                <span className="block text-green-600 font-medium mt-1">
                  ✓ {timelineData.length} timeline nodes loaded
                </span>
              )}
            </p>
            <div className="flex flex-col gap-2">
              <button 
                onClick={() => addNode('character')} 
                className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              >
                <span className="mr-1">👤</span> Add Character
              </button>
              <button 
                onClick={() => addNode('plotPoint')} 
                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              >
                <span className="mr-1">📝</span> Add Plot Point
              </button>
              <button 
                onClick={() => addNode('media')} 
                className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              >
                <span className="mr-1">🎬</span> Add Media
              </button>
              <button 
                onClick={() => addNode('voting')} 
                className="bg-amber-500 hover:bg-amber-600 text-white px-3 py-1 rounded-md text-sm flex items-center"
              >
                <span className="mr-1">🗳️</span> Add Voting
              </button>
            </div>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
