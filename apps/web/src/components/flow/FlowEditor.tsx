import { useCallback, useMemo, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
} from 'reactflow';
import { type Node, type Edge, type Connection, ConnectionMode, BackgroundVariant } from 'reactflow';
import 'reactflow/dist/style.css';
import { CharacterNode, PlotPointNode, MediaNode, VotingNode } from './CustomNodes';

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
  universeAddress?: string;
  universeId?: string;
}

export default function FlowEditor({ timelineData, universeAddress, universeId }: FlowEditorProps) {
  // Debug what props FlowEditor is receiving
  useEffect(() => {
    console.log('FlowEditor received props:', {
      timelineData,
      universeAddress,
      universeId,
      hasTimelineData: !!timelineData,
      timelineDataLength: timelineData?.length || 0
    });
  }, [timelineData, universeAddress, universeId]);
  // Generate initial nodes from timeline data if provided
  const generatedNodes = useMemo(() => {
    if (!timelineData || timelineData.length === 0) {
      // Add universe context to initial nodes too
      return initialNodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          universeAddress: universeAddress,
          universeId: universeId,
        }
      }));
    }
    
    return timelineData.map((node, index) => ({
      id: `timeline-${node.id}`,
      type: 'plotPoint',
      data: {
        label: `Timeline Node ${node.id}`,
        emoji: node.isCanon ? '⭐' : '📝',
        description: node.description || `Timeline event ${node.id}`,
        canonicity: node.isCanon ? 'Canon' : 'Branch',
        timelineId: node.id,
        videoUrl: node.url,
        // Add universe context to existing timeline nodes
        universeAddress: universeAddress,
        universeId: universeId,
      },
      position: { 
        x: 100 + (index % 3) * 300, 
        y: 100 + Math.floor(index / 3) * 150 
      },
    }));
  }, [timelineData, universeAddress, universeId]);
  
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

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      // Add the edge
      setEdges((eds) => addEdge(params, eds));
      
      // Update target node with previousNode information
      if (params.source && params.target) {
        setNodes((nds) => nds.map((node) => {
          if (node.id === params.target) {
            // Extract node ID from source node
            let previousNodeId = 0;
            
            // Handle timeline nodes (format: "timeline-X")
            if (params.source && params.source.startsWith('timeline-')) {
              previousNodeId = parseInt(params.source.replace('timeline-', ''));
            }
            // Handle other node types - for now, we'll use 0 as default
            // You could extend this to handle other node ID formats
            
            // Update the node's data with previousNode info
            return {
              ...node,
              data: {
                ...node.data,
                previousNode: previousNodeId,
                // Add visual indicator that this node is connected
                isConnectedToBlockchain: previousNodeId > 0
              }
            };
          }
          return node;
        }));
      }
    },
    [setEdges, setNodes]
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
        // Add universe context for blockchain integration
        universeAddress: universeAddress,
        universeId: universeId,
      },
    };

    setNodes((nds) => nds.concat(newNode));
  }, [setNodes, universeAddress, universeId]);

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
