import { Handle, Position } from 'reactflow';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Play } from 'lucide-react';

export interface TimelineNodeData {
  label: string;
  description: string;
  videoUrl?: string;
  characters?: string[];
  timelineColor?: string;
  timelineName?: string;
  isRoot?: boolean;
}

export function TimelineEventNode({ data }: { data: TimelineNodeData }) {
  return (
    <>
      <Handle type="target" position={Position.Left} style={{ opacity: 0 }} />
      <div className="flex items-center gap-2">
        <div 
          className={`w-4 h-4 rounded-full border-2 ${data.isRoot ? 'border-primary bg-primary' : 'border-current'}`}
          style={{ 
            borderColor: data.timelineColor || 'currentColor',
            backgroundColor: data.isRoot ? undefined : data.timelineColor 
          }}
        />
        <div 
          className={`w-48 h-10 rounded-md border bg-background flex items-center px-3 ${data.isRoot ? 'ring-2 ring-primary' : ''}`}
          style={{ borderColor: data.timelineColor || '#e5e5e5' }}
        >
          <span className="text-sm font-medium truncate">{data.label}</span>
          {data.isRoot && <Badge variant="outline" className="text-xs ml-2">Start</Badge>}
        </div>
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