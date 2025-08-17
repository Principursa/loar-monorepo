import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useMemo, useState, useRef } from 'react';
import FlowEditor from '@/components/flow/FlowEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useGetFullGraph, useCreateNode } from '@/hooks/useTimeline';

// Define types for node data
interface NodeConnection {
  source: string;
  target: string;
  id: string;
}

interface NodeData {
  label: string;
  emoji: string;
  description: string;
  mediaUrl?: string;
  nftId?: string;
  canonicity?: string;
  storageType?: string;
  status?: string;
}

interface FlowNode {
  id: string;
  type: string;
  data: NodeData;
  connections: NodeConnection[];
}

export const Route = createFileRoute('/flow')({
  component: FlowPage,
});

function FlowPage() {
  // Get search parameters from URL
  const searchParams = useSearch({ from: '/flow' }) as any;
  
  // Extract timeline data from URL parameters
  const timelineData = useMemo(() => {
    if (!searchParams?.nodeIds) return null;
    
    return {
      nodeIds: searchParams.nodeIds.split(',').map((id: string) => parseInt(id.trim())),
      universeId: searchParams.universeId || 'unknown',
      totalNodes: parseInt(searchParams.totalNodes || '0')
    };
  }, [searchParams]);

  // Get full graph data if timeline data is loaded
  const { data: fullGraphData } = useGetFullGraph();
  
  // Parse timeline nodes for display
  const timelineNodes = useMemo(() => {
    if (!timelineData || !fullGraphData || !Array.isArray(fullGraphData) || fullGraphData.length < 6) {
      return [];
    }
    
    const graphData = {
      nodeIds: fullGraphData[0] || [],
      urls: fullGraphData[1] || [],
      descriptions: fullGraphData[2] || [],
      previousNodes: fullGraphData[3] || [],
      children: fullGraphData[4] || [],
      flags: fullGraphData[5] || []
    };
    
    return timelineData.nodeIds.map((nodeId: number) => {
      const index = graphData.nodeIds.findIndex(id => 
        (typeof id === 'bigint' ? Number(id) : parseInt(String(id))) === nodeId
      );
      
      if (index === -1) return null;
      
      return {
        id: nodeId,
        url: graphData.urls[index] || '',
        description: graphData.descriptions[index] || `Node ${nodeId}`,
        previousNode: graphData.previousNodes[index] || '',
        isCanon: graphData.flags[index] || false
      };
    }).filter(Boolean);
  }, [timelineData, fullGraphData]);
  
  // Blockchain posting functionality
  const [isPosting, setIsPosting] = useState(false);
  const [postStatus, setPostStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const editorRef = useRef<any>(null);
  const { writeAsync } = useCreateNode('', '', 0); // Initialize with empty values
  
  const handlePostToBlockchain = async () => {
    if (!editorRef.current) {
      alert('Flow editor not initialized');
      return;
    }
    
    try {
      setIsPosting(true);
      setPostStatus('loading');
      
      // Get node data from the editor
      const nodeData = editorRef.current.getNodeData();
      
      if (nodeData.length === 0) {
        alert('No nodes found in the editor. Please create at least one node.');
        setIsPosting(false);
        setPostStatus('idle');
        return;
      }
      
      // Find the most relevant node to post (could be selected node, latest node, etc.)
      // For this example, we'll use the first node of type 'plotPoint' or the first node if no plot points
      const plotNode = nodeData.find((node: FlowNode) => node.type === 'plotPoint') || nodeData[0];
      
      // Extract data for blockchain submission
      const link = plotNode.data.mediaUrl || ''; // URL to media content if available
      const plot = plotNode.data.description || plotNode.data.label || 'Narrative content'; // Plot description
      const previous = 0; // Previous node ID in the blockchain (0 for root node)
      
      console.log('Submitting to blockchain:', { link, plot, previous });
      
      // Call the blockchain contract
      const tx = await writeAsync(link, plot, previous);
      console.log('Transaction submitted:', tx);
      
      setPostStatus('success');
      alert(`Successfully posted narrative content to the blockchain!\nTransaction: ${tx}`);
    } catch (error) {
      console.error('Error posting to blockchain:', error);
      setPostStatus('error');
      alert(`Error posting to blockchain: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Narrative Flow Editor</h1>
          <p className="text-muted-foreground mt-2">
            Create and manage your narrative structures using the interactive flow editor below.
            {timelineData && ` Timeline data loaded from ${timelineData.universeId} with ${timelineData.totalNodes} nodes.`}
          </p>
        </div>
        
        {/* Prominent button outside the flow editor */}
        <button 
          onClick={handlePostToBlockchain}
          disabled={isPosting}
          className={`bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-6 py-3 rounded-md text-base font-medium flex items-center gap-2 shadow-lg ${isPosting ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
          </svg>
          {isPosting ? 'Posting to Blockchain...' : 'Post Narrative to Blockchain'}
        </button>
      </div>
      
      {/* Timeline Data Display */}
      {timelineData && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                Loaded Timeline Data
                <Badge variant="secondary">{timelineNodes.length} nodes</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {timelineNodes.map((node: any) => (
                    <div key={node.id} className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={node.isCanon ? "default" : "outline"}>
                          Node {node.id}
                        </Badge>
                        {node.isCanon && <Badge variant="secondary">Canon</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {node.description}
                      </p>
                      {node.url && (
                        <p className="text-xs text-blue-600 mt-1 truncate">
                          {node.url.substring(0, 50)}...
                        </p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="text-sm text-muted-foreground border-t pt-3">
                  This timeline data was loaded from the blockchain and can be converted into flow editor blocks.
                  You can now create narrative elements based on these timeline nodes.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      <div className="border rounded-lg overflow-hidden">
        <FlowEditor timelineData={timelineNodes as any} editorRef={editorRef} />
      </div>
      
      {postStatus === 'success' && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          Narrative content successfully posted to the blockchain!
        </div>
      )}
      
      {postStatus === 'error' && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error posting narrative content to the blockchain. Please try again.
        </div>
      )}
    </div>
  );
}
