import { useState, useCallback, useRef, useEffect } from 'react';
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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Film, Plus, Settings, Clock } from 'lucide-react';

// Register custom node types
const nodeTypes = {
  timelineEvent: TimelineEventNode,
};

interface TimelineFlowEditorProps {
  universeId: string;
  timelineId: string;
  initialNodes?: Node<TimelineNodeData>[];
  initialEdges?: Edge[];
  rootNodeId?: number;
  isCreateDialogOpen?: boolean;
  setIsCreateDialogOpen?: (open: boolean) => void;
  readOnly?: boolean;
}

export function TimelineFlowEditor({
  universeId,
  timelineId,
  initialNodes = [],
  initialEdges = [],
  readOnly = false,
}: TimelineFlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node<TimelineNodeData> | null>(null);
  const [eventCounter, setEventCounter] = useState(1);

  // Timeline parameters
  const [timelineTitle, setTimelineTitle] = useState("My Timeline");
  const [timelineDescription, setTimelineDescription] = useState("A narrative timeline");
  const [selectedEventTitle, setSelectedEventTitle] = useState("");
  const [selectedEventDescription, setSelectedEventDescription] = useState("");

  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Update nodes and edges when initialNodes/initialEdges change
  useEffect(() => {
    if (initialNodes && initialNodes.length > 0) {
      setNodes(initialNodes);
    }
  }, [initialNodes, setNodes]);

  useEffect(() => {
    if (initialEdges && initialEdges.length > 0) {
      setEdges(initialEdges);
    }
  }, [initialEdges, setEdges]);

  // Handle adding new events to timeline
  const handleAddEvent = useCallback(() => {
    const newEventId = `event-${Date.now()}`;
    const newAddId = `add-${Date.now()}`;
    
    // Find the rightmost position to place new event
    const rightmostX = nodes.length > 0 ? Math.max(...nodes.map(n => n.position.x)) : 100;
    const newEventPosition = { x: rightmostX + 300, y: 200 };
    const newAddPosition = { x: rightmostX + 600, y: 200 };

    // Create new event node
    const newEventNode: Node<TimelineNodeData> = {
      id: newEventId,
      type: 'timelineEvent',
      position: newEventPosition,
      data: {
        label: `Event ${eventCounter}`,
        description: `New timeline event`,
        timelineColor: '#10b981',
        nodeType: 'scene',
        eventId: newEventId,
        timelineId,
        universeId,
        onAddScene: () => {},
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

    // Create edge connecting to previous event if exists
    const lastEventNode = nodes.filter(n => n.data.nodeType === 'scene').pop();
    const newEdges: Edge[] = [];

    if (lastEventNode) {
      newEdges.push({
        id: `edge-${lastEventNode.id}-${newEventId}`,
        source: lastEventNode.id,
        target: newEventId,
        animated: true,
        style: { stroke: '#10b981', strokeWidth: 3 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: '#10b981',
        },
      });
    }

    // Edge from new event to add button
    newEdges.push({
      id: `edge-${newEventId}-${newAddId}`,
      source: newEventId,
      target: newAddId,
      animated: true,
      style: { stroke: '#cbd5e1', strokeDasharray: '8,8' },
    });

    // Remove old add nodes and their edges
    const filteredNodes = nodes.filter((n: any) => n.data.nodeType !== 'add');
    const filteredEdges = edges.filter((e: any) => !nodes.some((n: any) => n.data.nodeType === 'add' && (e.source === n.id || e.target === n.id)));

    setNodes([...filteredNodes, newEventNode, newAddNode]);
    setEdges([...filteredEdges, ...newEdges]);
    setEventCounter(prev => prev + 1);
  }, [nodes, edges, eventCounter, timelineId, universeId]);

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
    if (readOnly) {
      // In read-only mode, navigate to the timeline viewer
      if (node.data.eventId && node.data.universeId) {
        window.location.href = `/timeline?universe=${node.data.universeId}&event=${node.data.eventId}`;
      }
    } else {
      // In edit mode, select the node for editing
      setSelectedNode(node);
      if (node.data.nodeType === 'scene') {
        setSelectedEventTitle(node.data.label);
        // Extract description string from object if needed
        const rawDesc = node.data.description;
        const description = rawDesc && typeof rawDesc === 'object' && 'description' in rawDesc
          ? String((rawDesc as any).description)
          : String(rawDesc || '');
        setSelectedEventDescription(description);
      }
    }
  }, [readOnly]);

  // Initialize with start event
  useEffect(() => {
    if (nodes.length === 0) {
      const startNode: Node<TimelineNodeData> = {
        id: 'start',
        type: 'timelineEvent',
        position: { x: 100, y: 200 },
        data: {
          label: 'Story Beginning',
          description: 'The start of your narrative journey',
          isRoot: true,
          timelineColor: '#10b981',
          nodeType: 'scene',
          eventId: 'start',
          timelineId,
          universeId,
        },
      };

      const addNode: Node<TimelineNodeData> = {
        id: 'add-start',
        type: 'timelineEvent',
        position: { x: 400, y: 200 },
        data: {
          label: '',
          description: '',
          nodeType: 'add',
          onAddScene: handleAddEvent,
        },
      };

      const initialEdge: Edge = {
        id: 'edge-start-add',
        source: 'start',
        target: 'add-start',
        animated: true,
        style: { stroke: '#cbd5e1', strokeDasharray: '8,8' },
      };

      setNodes([startNode as any, addNode as any]);
      setEdges([initialEdge]);
    }
  }, [nodes.length, timelineId, universeId, handleAddEvent, setNodes, setEdges]);

  // Update selected node data
  const updateSelectedNode = useCallback(() => {
    if (selectedNode && selectedNode.data.nodeType === 'scene') {
      setNodes((nds) => 
        nds.map((node) => 
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

  return (
    <div className="flex h-full bg-background">
      {/* Left Sidebar - Hide in read-only mode */}
      {!readOnly && (
        <div className="w-80 border-r bg-card p-4 overflow-y-auto">
          <div className="space-y-6">
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
                <Button onClick={handleAddEvent} className="w-full">
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
                  <span className="text-sm text-muted-foreground">Timeline ID:</span>
                  <span className="text-sm font-mono">{timelineId}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Timeline Flow */}
      <div className="flex-1">
        <ReactFlowProvider>
          <div ref={reactFlowWrapper} className="h-full w-full">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={readOnly ? undefined : onNodesChange}
              onEdgesChange={readOnly ? undefined : onEdgesChange}
              onConnect={readOnly ? undefined : onConnect}
              onNodeClick={onNodeClick}
              nodeTypes={nodeTypes}
              fitView
              fitViewOptions={{
                padding: 0.2,
                includeHiddenNodes: false,
              }}
              defaultViewport={{ x: 0, y: 0, zoom: 1 }}
              minZoom={0.5}
              maxZoom={2}
              snapToGrid={true}
              snapGrid={[20, 20]}
              connectionLineStyle={{ stroke: '#10b981', strokeWidth: 2 }}
              nodesDraggable={!readOnly}
              nodesConnectable={!readOnly}
              elementsSelectable={true}
            >
              <Background gap={20} size={1} color="#f1f5f9" />
              <Controls />
              
              <Panel position="top-center" className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border">
                <h2 className="text-lg font-semibold">{timelineTitle}</h2>
                <p className="text-sm text-muted-foreground">{timelineDescription}</p>
              </Panel>
            </ReactFlow>
          </div>
        </ReactFlowProvider>
      </div>
    </div>
  );
}