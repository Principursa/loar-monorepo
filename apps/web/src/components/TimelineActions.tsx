import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Loader, Plus, Database } from 'lucide-react';
import { useCreateNode, useGetNode } from '@/hooks/useTimeline';

export function TimelineActions() {
  const [nodeLink, setNodeLink] = useState('');
  const [nodePlot, setNodePlot] = useState('');
  const [previousNode, setPreviousNode] = useState(0);
  const [queryNodeId, setQueryNodeId] = useState(1);
  const [isCreating, setIsCreating] = useState(false);

  const { writeAsync: createNode } = useCreateNode(nodeLink, nodePlot, previousNode);
  const { data: nodeData, isLoading: isLoadingNode, refetch: refetchNode } = useGetNode(queryNodeId);

  const handleCreateNode = async () => {
    if (!nodeLink || !nodePlot) return;
    
    try {
      setIsCreating(true);
      await createNode(nodeLink, nodePlot, previousNode);
      // Reset form
      setNodeLink('');
      setNodePlot('');
      setPreviousNode(0);
    } catch (error) {
      console.error('Error creating node:', error);
    } finally {
      setIsCreating(false);
    }
  };

  const handleQueryNode = () => {
    refetchNode();
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="w-5 h-5" />
          Blockchain Timeline Actions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Node Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Create Node
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="nodeLink">Video Link (Walrus URL)</Label>
                <Input
                  id="nodeLink"
                  placeholder="https://aggregator.walrus-testnet.walrus.space/v1/blobs/..."
                  value={nodeLink}
                  onChange={(e) => setNodeLink(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="nodePlot">Plot Description</Label>
                <Input
                  id="nodePlot"
                  placeholder="Describe this timeline event..."
                  value={nodePlot}
                  onChange={(e) => setNodePlot(e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor="previousNode">Previous Node ID</Label>
                <Input
                  id="previousNode"
                  type="number"
                  placeholder="0"
                  value={previousNode}
                  onChange={(e) => setPreviousNode(Number(e.target.value))}
                />
              </div>
              
              <Button 
                onClick={handleCreateNode}
                disabled={!nodeLink || !nodePlot || isCreating}
                className="w-full"
              >
                {isCreating ? (
                  <>
                    <Loader className="w-4 h-4 mr-2 animate-spin" />
                    Creating Node...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Node
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Query Node Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Database className="w-4 h-4" />
              Query Node
            </h3>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="queryNodeId">Node ID to Query</Label>
                <div className="flex gap-2">
                  <Input
                    id="queryNodeId"
                    type="number"
                    placeholder="1"
                    value={queryNodeId}
                    onChange={(e) => setQueryNodeId(Number(e.target.value))}
                  />
                  <Button 
                    onClick={handleQueryNode}
                    disabled={isLoadingNode}
                    variant="outline"
                  >
                    {isLoadingNode ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      'Query'
                    )}
                  </Button>
                </div>
              </div>
              
              {/* Node Data Display */}
              {nodeData && (
                <div className="space-y-2">
                  <Label>Node Data:</Label>
                  <Card className="p-3 bg-muted">
                    <div className="space-y-2 text-sm">
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
                  </Card>
                </div>
              )}
              
              {!nodeData && !isLoadingNode && (
                <div className="text-sm text-muted-foreground">
                  Enter a node ID and click Query to fetch data from the blockchain
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">Smart Contract</Badge>
            <span>Connected to Timeline contract for blockchain timeline management</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}