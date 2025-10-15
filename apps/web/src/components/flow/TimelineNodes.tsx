import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';
import { useState, useEffect, useCallback } from 'react';
import { trpcClient } from '@/utils/trpc';

export interface TimelineNodeData {
  label: string;
  description: string;
  videoUrl?: string;
  characters?: string[];
  timelineColor?: string;
  timelineName?: string;
  isRoot?: boolean;
  eventId?: string;
  displayName?: string; // User-friendly display name for UI
  timelineId?: string;
  universeId?: string;
  nodeType?: 'scene' | 'branch' | 'add';
  isInCanonChain?: boolean; // Whether this node is part of the canonical chain
  onAddScene?: (position: 'after' | 'branch', sourceNodeId?: string) => void;
}

export function TimelineEventNode({ data }: { data: TimelineNodeData }) {
  const navigate = useNavigate();
  const [displayVideoUrl, setDisplayVideoUrl] = useState<string | null>(null);
  const [isLoadingFilecoin, setIsLoadingFilecoin] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Debug: Log the node data
  console.log('TimelineEventNode data:', data);

  // Custom function to create blob URL from Filecoin PieceCID
  const createFilecoinBlobUrl = useCallback(async (pieceCid: string, filename: string = 'video.mp4') => {
    try {
      console.log('TimelineNode: Creating blob URL for PieceCID:', pieceCid);
      
      // Add timeout for large files
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Download timeout after 30 seconds')), 30000)
      );
      
      // Download from Filecoin via tRPC with timeout
      const downloadPromise = trpcClient.synapse.download.query({ pieceCid });
      const result = await Promise.race([downloadPromise, timeoutPromise]);
      
      console.log('TimelineNode: Download completed, converting to blob...');
      
      // Convert base64 back to Uint8Array
      const binaryData = Uint8Array.from(atob(result.data), c => c.charCodeAt(0));
      
      console.log(`TimelineNode: Converted to binary data, size: ${binaryData.length} bytes`);
      
      // Create blob with proper MIME type
      const mimeType = filename.endsWith('.mp4') ? 'video/mp4' : 'application/octet-stream';
      const blob = new Blob([binaryData], { type: mimeType });
      
      // Create URL for the blob
      const blobUrl = URL.createObjectURL(blob);
      console.log('TimelineNode: Created blob URL:', blobUrl);
      
      return blobUrl;
    } catch (error) {
      console.error('TimelineNode: Failed to create blob URL from Filecoin:', error);
      throw error;
    }
  }, []);

  // Handle PieceCIDs by creating blob URLs
  useEffect(() => {
    if (data.videoUrl && data.videoUrl.startsWith('bafk')) {
      // This looks like a raw PieceCID from Filecoin
      console.log('TimelineNode: Converting PieceCID to blob URL for:', data.videoUrl);
      
      setIsLoadingFilecoin(true);
      
      // Add a delay to prevent overwhelming the server with concurrent requests
      const delay = Math.random() * 1000; // Random delay up to 1 second
      setTimeout(() => {
        createFilecoinBlobUrl(data.videoUrl)
          .then((blobUrl) => {
            setDisplayVideoUrl(blobUrl);
            console.log('TimelineNode: Successfully created blob URL:', blobUrl);
          })
          .catch((error) => {
            console.error('TimelineNode: Failed to create blob URL, falling back to HTTP gateway:', error);
            // Fallback: Use our HTTP gateway instead of blob URL
            const baseUrl = import.meta.env.PROD ? 'https://loartech.xyz' : 'http://localhost:3000';
            const fallbackUrl = `${baseUrl}/api/filecoin/${data.videoUrl}`;
            setDisplayVideoUrl(fallbackUrl);
            console.log('TimelineNode: Using HTTP gateway fallback for large file:', fallbackUrl);
          })
          .finally(() => {
            setIsLoadingFilecoin(false);
          });
      }, delay);
    } else {
      // Use the original URL for HTTP URLs
      setDisplayVideoUrl(data.videoUrl || null);
      setIsLoadingFilecoin(false);
    }
  }, [data.videoUrl, createFilecoinBlobUrl]);

  const handleClick = () => {
    if (data.eventId && data.universeId) {
      console.log('Navigating to timeline:', {
        universeId: data.universeId,
        eventId: data.eventId
      });
      // Navigate to timeline viewer with specific event
      const timelineUrl = `/timeline?universe=${data.universeId}&event=${data.eventId}`;
      window.location.href = timelineUrl;
    } else {
      console.log('Missing navigation data:', {
        eventId: data.eventId,
        universeId: data.universeId,
        data
      });
    }
  };

  // Add Event Node - just a + button
  if (data.nodeType === 'add') {
    return (
      <>
        <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
        <div className="flex items-center justify-center">
          <Button
            variant="outline"
            size="sm"
            className="w-12 h-12 p-0 border-2 border-dashed border-primary/60 hover:border-primary hover:bg-primary/10 rounded-full transition-all duration-200"
            onClick={() => data.onAddScene?.('after', data.eventId)}
            title="Add new event"
          >
            <Plus className="h-6 w-6 text-primary" />
          </Button>
        </div>
        <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
      </>
    );
  }

  // Regular Timeline Event Node - Merged design with best of both branches
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      <div className="relative group">
        <div 
          className={`w-80 h-72 rounded-lg border-2 bg-card hover:bg-card/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md overflow-hidden ${data.isRoot ? 'ring-2 ring-primary/50' : ''}`}
          style={{ borderColor: data.timelineColor || '#10b981' }}
          onClick={handleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Video Preview - Fixed size with proper containment and hover effects */}
          <div className="w-full h-52 bg-black relative overflow-hidden">
            {isLoadingFilecoin && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mx-auto mb-1"></div>
                  <p className="text-white text-xs">Loading...</p>
                </div>
              </div>
            )}
            {displayVideoUrl ? (
              <>
                <video 
                  className="w-full h-full object-cover"
                  controls={false}
                  preload="metadata"
                  muted
                  loop
                  ref={(video) => {
                    if (video) {
                      if (isHovered) {
                        video.play().catch(e => console.log('Video play failed:', e));
                      } else {
                        video.pause();
                        video.currentTime = 0;
                      }
                    }
                  }}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent node click when using video controls
                  }}
                  onError={(e) => {
                    // Show fallback on error
                    const video = e.target as HTMLVideoElement;
                    const container = video.parentElement;
                    if (container) {
                      container.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex flex-col items-center justify-center">
                          <div class="text-white text-3xl mb-2">🎬</div>
                          <div class="text-white text-sm">Video unavailable</div>
                        </div>
                      `;
                    }
                  }}
                >
                  <source src={displayVideoUrl} type="video/mp4" />
                  <source src={displayVideoUrl} />
                </video>
                
                {/* Event ID overlay - with displayName support */}
                <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                  {data.displayName || `Event ${data.eventId || '?'}`}
                </div>
                
                {/* Canon badge - displayed if node is in canonical chain */}
                {data.isInCanonChain && (
                  <div className="absolute top-2 right-2">
                    <Badge variant="default" className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold text-xs px-2 py-1">
                      Canon
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex flex-col items-center justify-center">
                <div className="text-white text-4xl mb-2">🎬</div>
                <div className="text-white text-sm">No Video</div>
              </div>
            )}
          </div>

          {/* Event ID and Status - Fixed footer with displayName support */}
          <div className="p-4 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className={`w-3 h-3 rounded-full flex-shrink-0 ${data.isRoot ? 'bg-primary' : 'bg-current'}`}
                style={{ 
                  backgroundColor: data.timelineColor || '#10b981'
                }}
              />
              <span className="text-lg font-bold text-primary truncate">
                {data.displayName || `Event ${data.eventId || '?'}`}
              </span>
            </div>
            {data.isRoot && <Badge variant="secondary" className="text-sm">Start</Badge>}
          </div>
        </div>
        
        {/* Branch button - appears on hover */}
        <Button
          variant="outline"
          size="sm"
          className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8 p-0 border-2 border-dashed border-primary/60 hover:border-primary hover:bg-primary/10 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            console.log('🔴 Branch button clicked for event:', data.eventId);
            data.onAddScene?.('branch', data.eventId);
          }}
          title="Create branch event"
        >
          <Plus className="h-4 w-4 text-primary" />
        </Button>
      </div>
      
      <Handle type="source" position={Position.Right} style={{ opacity: 0 }} />
    </>
  );
}

export function TimelineBranchNode({ data }: { data: { label: string; color: string } }) {
  return (
    <>
      <Handle type="target" position={Position.Top} />
      <div 
        className="px-3 py-1 rounded-full text-xs font-medium text-white"
        style={{ backgroundColor: data.color }}
      >
        {data.label}
      </div>
      <Handle type="source" position={Position.Bottom} />
    </>
  );
}