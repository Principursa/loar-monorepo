import { useState, useRef, useEffect } from 'react';
import { Scissors, Trash2 } from 'lucide-react';

interface TimelineSegment {
  id: string;
  videoUrl: string;
  duration: number;
  trimStart: number;
  trimEnd: number;
  imageUrl?: string;
}

interface VideoTimelineProps {
  segments: TimelineSegment[];
  onUpdateSegment: (id: string, trimStart: number, trimEnd: number) => void;
  onRemoveSegment: (id: string) => void;
  onSeek?: (time: number) => void;
  currentTime?: number;
}

export function VideoTimeline({
  segments,
  onUpdateSegment,
  onRemoveSegment,
  onSeek,
  currentTime = 0,
}: VideoTimelineProps) {
  const [dragging, setDragging] = useState<{
    segmentId: string;
    handle: 'start' | 'end';
  } | null>(null);

  const timelineRef = useRef<HTMLDivElement>(null);

  // Calculate total duration
  const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0);
  // Dynamic width: 60px per second, min 400px, max 1200px
  const timelineWidth = Math.min(1200, Math.max(400, totalDuration * 60));
  const pixelsPerSecond = totalDuration > 0 ? timelineWidth / totalDuration : 60;

  // Handle mouse move for dragging
  useEffect(() => {
    if (!dragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!timelineRef.current) return;

      const rect = timelineRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;

      // Find the segment being dragged
      const segment = segments.find(s => s.id === dragging.segmentId);
      if (!segment) return;

      // Calculate segment position
      let segmentStartX = 0;
      for (const seg of segments) {
        if (seg.id === segment.id) break;
        segmentStartX += seg.duration * pixelsPerSecond;
      }

      // Calculate new trim time
      const relativeX = x - segmentStartX;
      const newTime = Math.max(0, Math.min(segment.duration, relativeX / pixelsPerSecond));

      if (dragging.handle === 'start') {
        const newTrimStart = Math.max(0, Math.min(newTime, segment.trimEnd - 0.5));
        onUpdateSegment(segment.id, newTrimStart, segment.trimEnd);
      } else {
        const newTrimEnd = Math.max(segment.trimStart + 0.5, Math.min(newTime, segment.duration));
        onUpdateSegment(segment.id, segment.trimStart, newTrimEnd);
      }
    };

    const handleMouseUp = () => {
      setDragging(null);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [dragging, segments, pixelsPerSecond, onUpdateSegment]);

  // Handle timeline click for seeking
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current || !onSeek) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const clickTime = x / pixelsPerSecond;

    onSeek(Math.max(0, Math.min(totalDuration, clickTime)));
  };

  let cumulativeTime = 0;

  return (
    <div className="space-y-2">
      {/* Timeline Container */}
      <div className="bg-gradient-to-b from-gray-900/90 to-black/90 rounded-lg border border-blue-500/20 p-3 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-white">Timeline</div>
            <div className="px-2 py-0.5 bg-blue-500/20 rounded-md border border-blue-500/30">
              <span className="text-xs text-blue-300 font-medium">
                {segments.length} scene{segments.length !== 1 ? 's' : ''} • {totalDuration.toFixed(1)}s
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2 px-2 py-1 bg-yellow-500/10 rounded-md border border-yellow-500/30">
            <Scissors className="h-3 w-3 text-yellow-400" />
            <span className="text-xs text-yellow-300 font-medium">Drag edges to trim</span>
          </div>
        </div>

        {/* Timeline - with horizontal scroll if needed */}
        <div className="overflow-x-auto pb-1">
          <div
            ref={timelineRef}
            className="relative bg-gradient-to-b from-gray-800/80 to-gray-900/80 rounded-lg p-3 cursor-pointer border border-blue-500/10 hover:border-blue-500/30 transition-all shadow-inner"
            style={{ width: `${timelineWidth}px` }}
            onClick={handleTimelineClick}
          >
            <div className="relative h-16 flex">
            {segments.map((segment, index) => {
              const startX = cumulativeTime * pixelsPerSecond;
              const width = segment.duration * pixelsPerSecond;
              const trimStartX = segment.trimStart * pixelsPerSecond;
              const trimEndX = segment.trimEnd * pixelsPerSecond;
              const trimmedWidth = (segment.trimEnd - segment.trimStart) * pixelsPerSecond;

              cumulativeTime += segment.duration;

              const isTrimmed = segment.trimStart > 0 || segment.trimEnd < segment.duration;

              return (
                <div
                  key={segment.id}
                  className="absolute h-full"
                  style={{
                    left: `${startX}px`,
                    width: `${width}px`,
                  }}
                >
                  {/* Full segment background */}
                  <div className="relative h-full rounded-lg overflow-hidden border-2 border-gray-700/50 bg-gradient-to-br from-gray-700 via-gray-800 to-gray-900 shadow-2xl">
                    {/* Thumbnail/preview */}
                    {segment.imageUrl && (
                      <img
                        src={segment.imageUrl}
                        alt={`Segment ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover opacity-25 mix-blend-luminosity"
                      />
                    )}

                    {/* Trimmed out regions (darker with strong pattern) */}
                    {segment.trimStart > 0 && (
                      <div
                        className="absolute top-0 left-0 h-full bg-red-900/30 backdrop-blur-[2px] border-r-2 border-red-500/50"
                        style={{
                          width: `${trimStartX}px`,
                          backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4) 8px, rgba(255,0,0,0.1) 8px, rgba(255,0,0,0.1) 16px)'
                        }}
                      />
                    )}
                    {segment.trimEnd < segment.duration && (
                      <div
                        className="absolute top-0 right-0 h-full bg-red-900/30 backdrop-blur-[2px] border-l-2 border-red-500/50"
                        style={{
                          width: `${(segment.duration - segment.trimEnd) * pixelsPerSecond}px`,
                          backgroundImage: 'repeating-linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.4) 8px, rgba(255,0,0,0.1) 8px, rgba(255,0,0,0.1) 16px)'
                        }}
                      />
                    )}

                    {/* Active (non-trimmed) region */}
                    <div
                      className="absolute top-0 h-full bg-gradient-to-br from-blue-500/40 via-blue-600/30 to-cyan-500/20 border-l-2 border-r-2 border-blue-400/80 shadow-lg"
                      style={{
                        left: `${trimStartX}px`,
                        width: `${trimmedWidth}px`,
                      }}
                    >
                      {/* Segment info bar */}
                      <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-b from-black/50 to-transparent flex items-center justify-between px-1.5">
                        <div className="text-[9px] text-white font-semibold">
                          Scene {index + 1}
                        </div>
                        <div className="text-[8px] text-white/70 font-mono">
                          {(segment.trimEnd - segment.trimStart).toFixed(1)}s
                        </div>
                      </div>

                      {/* Trim indicator badge */}
                      {isTrimmed && (
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 bg-blue-500/90 text-white text-[8px] rounded flex items-center gap-0.5 shadow-md">
                          <Scissors className="h-2 w-2" />
                        </div>
                      )}
                    </div>

                    {/* Left trim handle - ENHANCED & VISIBLE */}
                    <div
                      className="absolute top-0 h-full w-4 cursor-ew-resize group z-20"
                      style={{ left: `${trimStartX - 2}px` }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDragging({ segmentId: segment.id, handle: 'start' });
                      }}
                    >
                      {/* Visible edge line */}
                      <div className="absolute left-1 top-0 h-full w-1 bg-blue-400 group-hover:bg-blue-300 group-hover:w-1.5 transition-all shadow-lg" />

                      {/* Always visible handle */}
                      <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-3 h-8 bg-blue-500 rounded-md shadow-xl border-2 border-blue-300 group-hover:bg-blue-400 group-hover:scale-110 transition-all flex items-center justify-center">
                        <div className="flex flex-col gap-0.5">
                          <div className="w-0.5 h-1 bg-white rounded-full" />
                          <div className="w-0.5 h-1 bg-white rounded-full" />
                          <div className="w-0.5 h-1 bg-white rounded-full" />
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute -top-6 left-0 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap">
                        ← Drag to trim start
                      </div>
                    </div>

                    {/* Right trim handle - ENHANCED & VISIBLE */}
                    <div
                      className="absolute top-0 h-full w-4 cursor-ew-resize group z-20"
                      style={{ left: `${trimEndX - 14}px` }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setDragging({ segmentId: segment.id, handle: 'end' });
                      }}
                    >
                      {/* Visible edge line */}
                      <div className="absolute right-1 top-0 h-full w-1 bg-blue-400 group-hover:bg-blue-300 group-hover:w-1.5 transition-all shadow-lg" />

                      {/* Always visible handle */}
                      <div className="absolute top-1/2 -translate-y-1/2 -right-1 w-3 h-8 bg-blue-500 rounded-md shadow-xl border-2 border-blue-300 group-hover:bg-blue-400 group-hover:scale-110 transition-all flex items-center justify-center">
                        <div className="flex flex-col gap-0.5">
                          <div className="w-0.5 h-1 bg-white rounded-full" />
                          <div className="w-0.5 h-1 bg-white rounded-full" />
                          <div className="w-0.5 h-1 bg-white rounded-full" />
                        </div>
                      </div>

                      {/* Hover indicator */}
                      <div className="absolute -top-6 right-0 px-2 py-0.5 bg-blue-500 text-white text-[9px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity shadow-lg whitespace-nowrap">
                        Drag to trim end →
                      </div>
                    </div>

                    {/* Remove button - Compact */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onRemoveSegment(segment.id);
                      }}
                      className="absolute bottom-1 left-1 p-1 bg-red-500/90 hover:bg-red-600 text-white rounded opacity-0 hover:opacity-100 transition-all shadow hover:scale-105"
                      title="Remove segment"
                    >
                      <Trash2 className="h-2.5 w-2.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Playhead - SUPER VISIBLE */}
          {onSeek && (
            <div
              className="absolute top-0 bottom-0 pointer-events-none z-30"
              style={{ left: `${currentTime * pixelsPerSecond + 12}px` }}
            >
              {/* Playhead line */}
              <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

              {/* Top handle */}
              <div className="absolute -top-2 -left-2 w-4 h-4 bg-red-500 rounded-full shadow-xl border-2 border-red-300 animate-pulse" />

              {/* Bottom handle */}
              <div className="absolute -bottom-2 -left-2 w-4 h-4 bg-red-500 rounded-full shadow-xl border-2 border-red-300 animate-pulse" />

              {/* Time indicator */}
              <div className="absolute -top-8 -left-8 px-2 py-1 bg-red-500 text-white text-xs font-mono rounded shadow-xl">
                {(currentTime).toFixed(1)}s
              </div>
            </div>
          )}
          </div>

          {/* Time ruler - Compact */}
          <div className="relative h-6 mt-1" style={{ width: `${timelineWidth}px` }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-white/10" />
            </div>
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 flex flex-col items-center"
                style={{ left: `${i * pixelsPerSecond + 8}px` }}
              >
                <div className="w-px h-1.5 bg-white/20" />
                <div className="text-[9px] text-white/50 font-mono mt-0.5">
                  {i}s
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
