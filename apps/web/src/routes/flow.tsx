import { createFileRoute, useSearch } from '@tanstack/react-router';
import { useMemo, useEffect } from 'react';
import FlowEditor from '@/components/flow/FlowEditor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { trpcClient } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { useReadContract, useChainId } from 'wagmi';
import { timelineAbi } from '@/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type Address } from 'viem';

export const Route = createFileRoute('/flow')({
  component: FlowPage,
});

function FlowPage() {
  // Get search parameters from URL
  const searchParams = useSearch({ from: '/flow' }) as any;
  const chainId = useChainId();
  
  // Extract timeline data from URL parameters
  const timelineData = useMemo(() => {
    if (!searchParams?.nodeIds) return null;
    
    return {
      nodeIds: searchParams.nodeIds.split(',').map((id: string) => parseInt(id.trim())),
      universeId: searchParams.universeId || 'unknown',
      totalNodes: parseInt(searchParams.totalNodes || '0')
    };
  }, [searchParams]);

  // Extract universe ID from search params even if no timeline data
  const universeIdFromParams = searchParams?.universeId;

  // Fetch universe data if we have a universe ID (from timeline data OR direct search params)
  const { data: universeData } = useQuery({
    queryKey: ['universeData', universeIdFromParams],
    queryFn: () => trpcClient.cinematicUniverses.get.query({ id: universeIdFromParams! }),
    enabled: !!universeIdFromParams && universeIdFromParams !== 'blockchain-universe' && universeIdFromParams !== 'unknown',
  });

  // Determine which contract address to use for getting timeline data
  const contractAddress = universeData?.data?.address 
    ? (universeData.data.address as Address)
    : (TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address);

  // Get full graph data from the appropriate timeline contract
  const { data: fullGraphData } = useReadContract({
    abi: timelineAbi,
    address: contractAddress,
    functionName: 'getFullGraph',
    query: {
      enabled: !!contractAddress
    }
  });
  
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

  // Debug universe data
  useEffect(() => {
    console.log('Flow page debug - detailed:', {
      searchParams,
      timelineData,
      universeIdFromParams,
      universeData: universeData?.data,
      universeAddress: universeData?.data?.address,
      universeId: timelineData?.universeId,
      isQueryEnabled: !!universeIdFromParams && universeIdFromParams !== 'blockchain-universe' && universeIdFromParams !== 'unknown',
      isLoadingUniverse: universeData === undefined
    });
  }, [searchParams, timelineData, universeData, universeIdFromParams]);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Narrative Flow Editor</h1>
      <p className="mb-6 text-muted-foreground">
        Create and manage your narrative structures using the interactive flow editor below.
        {timelineData && ` Timeline data loaded from ${timelineData.universeId} with ${timelineData.totalNodes} nodes.`}
      </p>
      
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
        <FlowEditor 
          timelineData={timelineNodes as any}
          universeAddress={universeData?.data?.address}
          universeId={universeIdFromParams}
        />
      </div>
    </div>
  );
}
