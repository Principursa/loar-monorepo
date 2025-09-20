import { Handle, Position } from 'reactflow';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';
import { Plus } from 'lucide-react';

export interface TimelineNodeData {
  label: string;
  description: string;
  videoUrl?: string;
  characters?: string[];
  timelineColor?: string;
  timelineName?: string;
  isRoot?: boolean;
  eventId?: string;
  timelineId?: string;
  universeId?: string;
  nodeType?: 'scene' | 'branch' | 'add';
  onAddScene?: (position: 'after' | 'branch', sourceNodeId?: string) => void;
}

export function TimelineEventNode({ data }: { data: TimelineNodeData }) {
  const navigate = useNavigate();
  
  // Debug: Log the node data
  console.log('TimelineEventNode data:', data);

  const handleClick = () => {
    if (data.eventId && data.universeId) {
      console.log('Navigating to event:', {
        universeId: data.universeId,
        eventId: data.eventId
      });
      // eventId is already numeric (e.g., "1", "2", "3")
      const eventUrl = `/event/${data.universeId}/${data.eventId}`;
      window.location.href = eventUrl;
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

  // Regular Timeline Event Node
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      
      <div className="relative group">
        <div 
          className={`w-96 h-64 rounded-lg border-2 bg-card hover:bg-card/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${data.isRoot ? 'ring-2 ring-primary/50' : ''}`}
          style={{ borderColor: data.timelineColor || '#10b981' }}
          onClick={handleClick}
        >
          <div className="p-4 h-full flex flex-col">
            {/* Video Preview - Even Larger */}
            <div className="flex-shrink-0 mb-4">
              <div className="w-full h-36 rounded-md overflow-hidden bg-black relative">
                {data.videoUrl ? (
                  <>
                    <video 
                      className="w-full h-full object-cover"
                      controls={true}
                      preload="metadata"
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
                      <source src={data.videoUrl} type="video/mp4" />
                      <source src={data.videoUrl} />
                    </video>
                    
                    {/* Event ID overlay */}
                    <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded">
                      Event {data.eventId || '?'}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-800 flex flex-col items-center justify-center">
                    <div className="text-white text-4xl mb-2">🎬</div>
                    <div className="text-white text-sm">No Video</div>
                  </div>
                )}
              </div>
            </div>

            {/* Event Information */}
            <div className="flex-1 flex flex-col justify-start min-w-0 space-y-2">
              {/* Event ID and Status */}
              <div className="flex items-center gap-2">
                <div 
                  className={`w-3 h-3 rounded-full flex-shrink-0 ${data.isRoot ? 'bg-primary' : 'bg-current'}`}
                  style={{ 
                    backgroundColor: data.timelineColor || '#10b981'
                  }}
                />
                <span className="text-lg font-bold text-primary">
                  Event {data.eventId || '?'}
                </span>
                {data.isRoot && <Badge variant="secondary" className="text-sm">Start</Badge>}
              </div>
              
              {/* Description */}
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-foreground">Description:</h4>
                <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
                  {data.description || 'No description available'}
                </p>
              </div>
            </div>
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