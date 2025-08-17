import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Play, Users, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { useReadContract, useChainId } from 'wagmi';
import { timelineAbi } from '@/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type Address } from 'viem';

interface EventParams {
  universeId: string;
  timelineId: string;
  eventId: string;
}

function EventDetailPage() {
  const { universeId, timelineId, eventId } = useParams({ from: "/event/$universeId/$timelineId/$eventId" });
  const chainId = useChainId();
  
  // Extract node ID from eventId (format: "node-X")
  const nodeId = eventId.startsWith('node-') ? parseInt(eventId.replace('node-', '')) : null;
  
  // Fetch universe data to get the timeline contract address
  const { data: universeData, isLoading: isLoadingUniverse } = useQuery({
    queryKey: ['universeData', universeId],
    queryFn: () => trpcClient.cinematicUniverses.get.query({ id: universeId }),
    enabled: universeId !== 'blockchain-universe',
  });
  
  // Determine universe info and contract address
  const universe = universeId === 'blockchain-universe' 
    ? {
        id: 'blockchain-universe',
        name: 'Cyberpunk City',
        description: 'A decentralized narrative universe powered by blockchain technology',
        address: null // Uses default contract
      }
    : universeData?.data 
      ? {
          id: universeData.data.id,
          name: `Universe ${universeData.data.id.slice(0, 8)}...`,
          description: universeData.data.description,
          address: universeData.data.address
        }
      : null;
  
  // Determine which contract address to use
  const contractAddress = universe?.address 
    ? (universe.address as Address)
    : (TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address);
  
  // Fetch node data from the appropriate timeline contract
  const { data: nodeData, isLoading: isLoadingNode, error } = useReadContract({
    abi: timelineAbi,
    address: contractAddress,
    functionName: "getNode",
    args: [BigInt(nodeId || 0)],
    query: {
      enabled: !!nodeId && !!contractAddress && !!universe
    }
  });
  
  const isLoading = isLoadingUniverse || isLoadingNode;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading event data...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle universe not found
  if (universeId !== 'blockchain-universe' && !isLoadingUniverse && !universe) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Universe Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The universe with ID "{universeId}" could not be found.
            </p>
            <Button asChild>
              <Link to="/universes">Back to Universes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle event not found
  if (!isLoading && (!nodeData || !Array.isArray(nodeData) || nodeData.length < 4)) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The requested event could not be found on the timeline contract.
            </p>
            <div className="space-y-2">
              <Button asChild>
                <Link to="/universe/$id" params={{ id: universeId }}>Back to Timeline</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/universes">Back to Universes</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Extract data from blockchain response [id, url, desc, prev_node_id, array, bool]
  const eventNodeId = nodeData[0];
  const videoUrl = nodeData[1];
  const description = nodeData[2];
  const previousNodeId = nodeData[3];

  return (
    <div className="container mx-auto p-6">
      {/* Breadcrumb Navigation */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/universes" className="hover:text-foreground">
            Universes
          </Link>
          <span>/</span>
          <Link to="/universe/$id" params={{ id: universeId }} className="hover:text-foreground">
            {universe?.name || 'Unknown Universe'}
          </Link>
          <span>/</span>
          <span>Timeline {timelineId.replace('timeline-', '')}</span>
          <span>/</span>
          <span className="text-foreground font-medium">Event {eventNodeId}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Event Header */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-3xl mb-2">Event {eventNodeId}</CardTitle>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Timeline {timelineId.replace('timeline-', '')}</Badge>
                    <Badge variant="secondary">{universe?.name || 'Unknown Universe'}</Badge>
                    <Badge variant="outline" className="bg-blue-50">Blockchain Event</Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/universe/$id" params={{ id: universeId }}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Graph
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                {description || `Timeline event ${eventNodeId} from blockchain`}
              </p>
            </CardContent>
          </Card>

          {/* Video Section */}
          <Card>
            <CardHeader>
              <CardTitle>Event Video</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {videoUrl ? (
                  <>
                    <video 
                      className="w-full aspect-video object-cover rounded-lg border" 
                      controls
                      preload="metadata"
                    >
                      <source src={videoUrl} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                    
                    <div className="flex items-center justify-between">
                      <Button asChild>
                        <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                          <Play className="w-4 h-4 mr-2" />
                          Open in Walrus
                        </a>
                      </Button>
                      
                      <p className="text-sm text-muted-foreground">
                        Stored on Walrus Protocol
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No video available for this event</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Blockchain Data Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Blockchain Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Node ID</h4>
                    <p className="text-lg font-mono">{eventNodeId}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground">Previous Node</h4>
                    <p className="text-lg font-mono">{previousNodeId?.toString() || 'None'}</p>
                  </div>
                </div>
                
                {videoUrl && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Video URL</h4>
                    <p className="text-xs font-mono bg-muted p-2 rounded break-all">
                      {videoUrl}
                    </p>
                  </div>
                )}
                
                {description && (
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Description</h4>
                    <p className="text-sm">{description}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Event Info */}
          <Card>
            <CardHeader>
              <CardTitle>Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="text-sm font-medium mb-1">Node ID</h4>
                <p className="text-2xl font-bold">{eventNodeId}</p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-1">Data Source</h4>
                <Badge variant="outline" className="bg-blue-50">
                  Smart Contract
                </Badge>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Previous Event</h4>
                <p className="text-sm text-muted-foreground">
                  {previousNodeId && previousNodeId !== 0 
                    ? `Node ${previousNodeId}` 
                    : 'Root/Start of timeline'
                  }
                </p>
              </div>

              <div>
                <h4 className="text-sm font-medium mb-1">Timeline</h4>
                <p className="text-sm text-muted-foreground">
                  {timelineId.replace('timeline-', 'Timeline ')}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Previous Event Link */}
          {previousNodeId && previousNodeId !== 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Previous Event</CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  asChild
                >
                  <Link 
                    to="/event/$universeId/$timelineId/$eventId" 
                    params={{ 
                      universeId: universeId,
                      timelineId: timelineId,
                      eventId: `node-${previousNodeId}`
                    }}
                  >
                    <ArrowLeft className="w-3 h-3 mr-2" />
                    Node {previousNodeId}
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          <Card>
            <CardHeader>
              <CardTitle>Navigation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/universe/$id" params={{ id: universeId }}>
                  View Universe Graph
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <Link to="/universes">
                  Back to Universe Hub
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/event/$universeId/$timelineId/$eventId")({
  component: EventDetailPage,
});