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

  const handleClick = () => {
    if (data.eventId && data.timelineId && data.universeId) {
      navigate({
        to: '/event/$universeId/$timelineId/$eventId',
        params: {
          universeId: data.universeId,
          timelineId: data.timelineId,
          eventId: data.eventId
        }
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
          className={`min-w-64 h-24 rounded-lg border-2 bg-card hover:bg-card/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${data.isRoot ? 'ring-2 ring-primary/50' : ''}`}
          style={{ borderColor: data.timelineColor || '#10b981' }}
          onClick={handleClick}
        >
          <div className="p-4 h-full flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className={`w-3 h-3 rounded-full flex-shrink-0 ${data.isRoot ? 'bg-primary' : 'bg-current'}`}
                style={{ 
                  backgroundColor: data.timelineColor || '#10b981'
                }}
              />
              <span className="text-sm font-semibold truncate">{data.label}</span>
              {data.isRoot && <Badge variant="secondary" className="text-xs">Start</Badge>}
            </div>
            {data.description && (
              <p className="text-xs text-muted-foreground line-clamp-2">{data.description}</p>
            )}
          </div>
        </div>
        
        {/* Branch button - appears on hover */}
        <Button
          variant="outline"
          size="sm"
          className="absolute -bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-200 w-8 h-8 p-0 border-2 border-dashed border-primary/60 hover:border-primary hover:bg-primary/10 rounded-full"
          onClick={(e) => {
            e.stopPropagation();
            data.onAddScene?.('branch', data.eventId);
          }}
          title="Create new event"
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