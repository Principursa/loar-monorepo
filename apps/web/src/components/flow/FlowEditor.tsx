import { useCallback, useMemo } from 'react';
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

export default function FlowEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

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
