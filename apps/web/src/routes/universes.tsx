import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCreateNode, useGetNode, useGetTimeline, useGetLeaves, useGetMedia, useGetCanonChain } from "@/hooks/useTimeline";

function UniversesPage() {
  // Define our single blockchain universe
  const blockchainUniverse = {
    id: 'blockchain-universe',
    name: 'Cyberpunk City',
    description: 'A decentralized narrative universe powered by blockchain technology',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop'
  };
  
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
  
  // Fetch individual nodes (IDs 0-4) for timeline building
  const { data: node0 } = useGetNode(0);
  const { data: node1 } = useGetNode(1);
  const { data: node2 } = useGetNode(2);
  const { data: node3 } = useGetNode(3);
  const { data: node4 } = useGetNode(4);
  
  const nodeDataArray = [node0, node1, node2, node3, node4];
  const availableNodeCount = nodeDataArray.filter(Boolean).length;
  
  // Calculate timeline count from leaves
  const timelineCount = leavesData && Array.isArray(leavesData) ? leavesData.length : 0;

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
                  {Array.isArray(nodeData) && nodeData.length >= 4 ? (
                    <>
                      <div><strong>ID:</strong> {nodeData[0]?.toString() || 'N/A'}</div>
                      <div><strong>URL:</strong> {nodeData[1] || 'N/A'}</div>
                      <div><strong>Description:</strong> {nodeData[2] || 'N/A'}</div>
                      <div><strong>Previous:</strong> {nodeData[3]?.toString() || 'N/A'}</div>
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
            onClick={() => window.location.reload()}
            className="px-3 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 text-sm"
          >
            Refresh Nodes
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
          
          {availableNodeCount > 0 && (
            <div className="p-3 bg-indigo-50 border border-indigo-200 rounded">
              <h4 className="font-medium text-indigo-700">Node Count:</h4>
              <p className="text-sm mt-1">{availableNodeCount} nodes available (IDs: 0-4)</p>
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
        <h1 className="text-4xl font-bold mb-4">Blockchain Universe</h1>
        <p className="text-lg text-muted-foreground">
          Explore the decentralized narrative universe with blockchain-powered timelines
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Single Blockchain Universe Card */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Universe</h2>
          <Card className="transition-all hover:shadow-lg">
            <div className="relative">
              <img 
                src={blockchainUniverse.imageUrl} 
                alt={blockchainUniverse.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              <div className="absolute inset-0 bg-black/20 rounded-t-lg" />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="font-bold text-2xl">{blockchainUniverse.name}</h3>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-4">
                {blockchainUniverse.description}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50">
                    Smart Contract Powered
                  </Badge>
                  <Badge variant="outline" className="bg-green-50">
                    Live Data
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium">Active Timelines:</p>
                    <p className="text-2xl font-bold">
                      {timelineCount}
                    </p>
                  </div>
                  <Button asChild>
                    <Link to="/universe/$id" params={{ id: blockchainUniverse.id }}>
                      View Timeline Graph →
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Blockchain Data Display */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Live Blockchain Data</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Timeline Leaves:</span>
                  <Badge variant="secondary">
                    {timelineCount}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Available Events:</span>
                  <Badge variant="outline">
                    {availableNodeCount}
                  </Badge>
                </div>
                
                {leavesData && Array.isArray(leavesData) && leavesData.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-sm font-medium">Timeline Endpoints:</span>
                    <div className="flex flex-wrap gap-1">
                      {leavesData.map((leafId, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          Leaf {typeof leafId === 'bigint' ? Number(leafId) : leafId}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-3 border-t">
                  <p className="text-xs text-muted-foreground">
                    Timelines traced from leaves using getLeaves() and getNode()
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/universes")({
  component: UniversesPage,
});