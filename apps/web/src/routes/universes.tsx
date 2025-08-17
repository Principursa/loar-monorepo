import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { universes, type Universe, type Timeline } from "@/data/universes";
import { useCreateNode, useGetNode, useGetTimeline, useGetLeaves, useGetMedia, useGetCanonChain, useGetFullGraph } from "@/hooks/useTimeline";

function UniversesPage() {
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [selectedTimeline, setSelectedTimeline] = useState<Timeline | null>(null);
  
  // Timeline contract interaction states
  const [nodeLink, setNodeLink] = useState('');
  const [nodePlot, setNodePlot] = useState('');
  const [previousNode, setPreviousNode] = useState(0);
  const [queryNodeId, setQueryNodeId] = useState(1);
  const [mediaNodeId, setMediaNodeId] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const { writeAsync: createNode } = useCreateNode(nodeLink, nodePlot, previousNode);
  const { data: nodeData, isLoading: isLoadingNode, refetch: refetchNode } = useGetNode(queryNodeId);
  const { data: timelineData, isLoading: isLoadingTimeline, refetch: refetchTimeline } = useGetTimeline();
  const { data: leavesData, isLoading: isLoadingLeaves, refetch: refetchLeaves } = useGetLeaves();
  const { data: mediaData, isLoading: isLoadingMedia, refetch: refetchMedia } = useGetMedia(mediaNodeId);
  const { data: canonChainData, isLoading: isLoadingCanonChain, refetch: refetchCanonChain } = useGetCanonChain();
  const { data: fullGraphData, isLoading: isLoadingFullGraph, refetch: refetchFullGraph } = useGetFullGraph();

  const handleCreateNode = async () => {
    if (!nodeLink || !nodePlot) return;
    
    try {
      setIsCreating(true);
      await createNode(nodeLink, nodePlot, previousNode);
      // Reset form
      setNodeLink('');
      setNodePlot('');
      setPreviousNode(0);
      alert('Node created successfully!');
    } catch (error) {
      console.error('Error creating node:', error);
      alert('Error creating node: ' + error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleQueryNode = () => {
    refetchNode();
  };

  return (
    <div className="container mx-auto p-6">
      {/* Blockchain Timeline Actions */}
      <div className="mb-6 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h2 className="text-xl font-bold text-blue-800 mb-4">Blockchain Timeline Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Node Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-blue-700">Create Node</h3>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Video Link</label>
              <input
                type="text"
                placeholder="https://aggregator.walrus-testnet.walrus.space/v1/blobs/..."
                value={nodeLink}
                onChange={(e) => setNodeLink(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Plot Description</label>
              <input
                type="text"
                placeholder="Describe this timeline event..."
                value={nodePlot}
                onChange={(e) => setNodePlot(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-blue-700 mb-1">Previous Node ID</label>
              <input
                type="number"
                placeholder="0"
                value={previousNode}
                onChange={(e) => setPreviousNode(Number(e.target.value))}
                className="w-full px-3 py-2 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <button
              onClick={handleCreateNode}
              disabled={!nodeLink || !nodePlot || isCreating}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCreating ? 'Creating...' : 'Create Node'}
            </button>
          </div>

          {/* Query Node Section */}
          <div className="space-y-3">
            <h3 className="font-semibold text-green-700">Query Node</h3>
            
            <div>
              <label className="block text-sm font-medium text-green-700 mb-1">Node ID</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder="1"
                  value={queryNodeId}
                  onChange={(e) => setQueryNodeId(Number(e.target.value))}
                  className="flex-1 px-3 py-2 border border-green-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button
                  onClick={handleQueryNode}
                  disabled={isLoadingNode}
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
                >
                  {isLoadingNode ? 'Loading...' : 'Query'}
                </button>
              </div>
            </div>
            
            {/* Node Data Display */}
            {nodeData && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                <h4 className="font-medium text-green-700 mb-2">Node Data:</h4>
                <div className="text-sm space-y-1">
                  {Array.isArray(nodeData) && nodeData.length >= 3 ? (
                    <>
                      <div><strong>Link:</strong> {nodeData[0] || 'N/A'}</div>
                      <div><strong>Plot:</strong> {nodeData[1] || 'N/A'}</div>
                      <div><strong>Previous:</strong> {nodeData[2]?.toString() || 'N/A'}</div>
                    </>
                  ) : (
                    <div>No data or invalid format</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Additional Getter Functions */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
          <button
            onClick={() => refetchTimeline()}
            disabled={isLoadingTimeline}
            className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400 text-sm"
          >
            {isLoadingTimeline ? 'Loading...' : 'Get Timeline'}
          </button>
          
          <button
            onClick={() => refetchLeaves()}
            disabled={isLoadingLeaves}
            className="px-3 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 disabled:bg-gray-400 text-sm"
          >
            {isLoadingLeaves ? 'Loading...' : 'Get Leaves'}
          </button>
          
          <button
            onClick={() => refetchCanonChain()}
            disabled={isLoadingCanonChain}
            className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400 text-sm"
          >
            {isLoadingCanonChain ? 'Loading...' : 'Get Canon Chain'}
          </button>
          
          <button
            onClick={() => refetchFullGraph()}
            disabled={isLoadingFullGraph}
            className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:bg-gray-400 text-sm"
          >
            {isLoadingFullGraph ? 'Loading...' : 'Get Full Graph'}
          </button>
          
          <div className="flex gap-1">
            <input
              type="number"
              placeholder="Node ID"
              value={mediaNodeId}
              onChange={(e) => setMediaNodeId(Number(e.target.value))}
              className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
            />
            <button
              onClick={() => refetchMedia()}
              disabled={isLoadingMedia}
              className="px-2 py-1 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:bg-gray-400 text-sm"
            >
              Get Media
            </button>
          </div>
        </div>

        {/* Data Display Section */}
        <div className="mt-6 space-y-4">
          {timelineData && (
            <div className="p-3 bg-purple-50 border border-purple-200 rounded">
              <h4 className="font-medium text-purple-700">Timeline Data:</h4>
              <pre className="text-xs mt-1 overflow-x-auto">{JSON.stringify(timelineData, (key, value) => 
                typeof value === 'bigint' ? value.toString() : value, 2)}</pre>
            </div>
          )}
          
          {leavesData && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="font-medium text-yellow-700">Leaves Data:</h4>
              <pre className="text-xs mt-1 overflow-x-auto">{JSON.stringify(leavesData, (key, value) => 
                typeof value === 'bigint' ? value.toString() : value, 2)}</pre>
            </div>
          )}
          
          {canonChainData && (
            <div className="p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-medium text-red-700">Canon Chain Data:</h4>
              <pre className="text-xs mt-1 overflow-x-auto">{JSON.stringify(canonChainData, (key, value) => 
                typeof value === 'bigint' ? value.toString() : value, 2)}</pre>
            </div>
          )}
          
          {fullGraphData && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
              <h4 className="font-medium text-indigo-700">Full Graph Data:</h4>
              <pre className="text-xs mt-1 overflow-x-auto">{JSON.stringify(fullGraphData, (key, value) => 
                typeof value === 'bigint' ? value.toString() : value, 2)}</pre>
            </div>
          )}
          
          {mediaData && (
            <div className="p-3 bg-orange-50 border border-orange-200 rounded">
              <h4 className="font-medium text-orange-700">Media Data:</h4>
              <pre className="text-xs mt-1 overflow-x-auto">{JSON.stringify(mediaData, (key, value) => 
                typeof value === 'bigint' ? value.toString() : value, 2)}</pre>
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">Universes</h1>
        <p className="text-lg text-muted-foreground">
          Explore different narrative universes and their branching timelines
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Available Universes</h2>
          <div className="space-y-4">
            {universes.map((universe) => (
              <Card 
                key={universe.id}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  selectedUniverse?.id === universe.id ? "ring-2 ring-primary" : ""
                }`}
                onClick={() => {
                  setSelectedUniverse(universe);
                  setSelectedTimeline(null);
                }}
              >
                <div className="relative">
                  <img 
                    src={universe.imageUrl} 
                    alt={universe.name}
                    className="w-full h-32 object-cover rounded-t-lg"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
                  <div className="absolute bottom-2 left-2 text-white">
                    <h3 className="font-bold text-lg">{universe.name}</h3>
                  </div>
                </div>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {universe.description}
                  </p>
                  <div className="mt-2 flex items-center justify-between">
                    <Badge variant="outline">
                      {universe.timelines.length} Timeline{universe.timelines.length !== 1 ? 's' : ''}
                    </Badge>
                    <Button size="sm" variant="ghost" asChild onClick={(e) => e.stopPropagation()}>
                      <Link to="/universe/$id" params={{ id: universe.id }}>
                        View Graph →
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Timelines</h2>
          {selectedUniverse ? (
            <div className="space-y-4">
              {selectedUniverse.timelines.map((timeline) => (
                <Card 
                  key={timeline.id}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    selectedTimeline?.id === timeline.id ? "ring-2 ring-primary" : ""
                  }`}
                  onClick={() => setSelectedTimeline(timeline)}
                >
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{timeline.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {timeline.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">
                        {timeline.nodes.length} Event{timeline.nodes.length !== 1 ? 's' : ''}
                      </Badge>
                      <Button size="sm" variant="outline" asChild>
                        <Link to="/timeline" search={{ universe: selectedUniverse.id, timeline: timeline.id }}>
                          View Timeline
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a universe to view its timelines
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Timeline Events</h2>
          {selectedTimeline ? (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    {selectedTimeline.name}
                    <Badge variant="outline">{selectedUniverse?.name}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {selectedTimeline.description}
                  </p>
                  
                  <div className="space-y-3">
                    {selectedTimeline.nodes.map((node, index) => (
                      <Card key={node.id} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold">{node.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              Event {index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">
                            {node.description}
                          </p>

                          <div className="mb-3">
                            <video 
                              className="w-full h-32 object-cover rounded-lg border" 
                              controls
                              preload="metadata"
                            >
                              <source src={node.videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </div>
                          
                          {node.characters.length > 0 && (
                            <div className="mb-3">
                              <p className="text-xs font-medium mb-1">Characters:</p>
                              <div className="flex flex-wrap gap-1">
                                {node.characters.map((characterId) => (
                                  <Badge key={characterId} variant="secondary" className="text-xs">
                                    {characterId.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between">
                            <Button size="sm" variant="outline" asChild>
                              <a href={node.videoUrl} target="_blank" rel="noopener noreferrer">
                                Watch Full Video
                              </a>
                            </Button>
                            {node.connections.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                {node.connections.length} Connection{node.connections.length !== 1 ? 's' : ''}
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  <div className="pt-4 space-y-2">
                    <Button className="w-full" asChild>
                      <Link to="/timeline" search={{ universe: selectedUniverse?.id, timeline: selectedTimeline.id }}>
                        Open Interactive Timeline
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link to="/universe/$id" params={{ id: selectedUniverse?.id || '' }}>
                        View Universe Graph
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="text-muted-foreground">
                  Select a timeline to view its events
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/universes")({
  component: UniversesPage,
});