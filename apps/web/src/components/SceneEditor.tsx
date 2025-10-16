import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Film,
  Sparkles,
  Loader2,
  Play,
  Pause,
  Plus,
  Download,
  LayoutGrid,
  X,
  Settings2,
  Volume2,
  ChevronDown,
  Image as ImageIcon,
  Type,
  ArrowRight,
  Wand2,
  Trash2,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface VideoSegment {
  id: string;
  videoUrl: string;
  imageUrl?: string;
  prompt: string;
  duration: number;
  model: string;
  order: number;
}

interface SceneEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (segments: VideoSegment[]) => void;
  initialSegments?: VideoSegment[];
  charactersData?: any;
  onGenerateImage?: (prompt: string) => Promise<string>;
  onGenerateVideo?: (prompt: string, imageUrl?: string) => Promise<string>;
}

export function SceneEditor({
  isOpen,
  onClose,
  onSave,
  initialSegments = [],
  charactersData,
  onGenerateImage,
  onGenerateVideo,
}: SceneEditorProps) {
  const [segments, setSegments] = useState<VideoSegment[]>(initialSegments);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState<number | null>(null);

  // Creation state
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedVideoModel, setSelectedVideoModel] = useState<'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora'>('fal-veo3');
  const [videoRatio, setVideoRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [selectedVideoDuration, setSelectedVideoDuration] = useState(8);

  const videoRef = useRef<HTMLVideoElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0);

  // Calculate which segment is currently playing
  const getCurrentSegment = () => {
    let accumulatedTime = 0;
    for (let i = 0; i < segments.length; i++) {
      if (currentTime >= accumulatedTime && currentTime < accumulatedTime + segments[i].duration) {
        return { segment: segments[i], index: i, segmentStartTime: accumulatedTime };
      }
      accumulatedTime += segments[i].duration;
    }
    return null;
  };

  const currentSegmentInfo = getCurrentSegment();

  // Play/Pause handler
  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  // Update current segment video when currentTime changes
  useEffect(() => {
    if (videoRef.current && currentSegmentInfo) {
      const segmentLocalTime = currentTime - currentSegmentInfo.segmentStartTime;
      if (Math.abs(videoRef.current.currentTime - segmentLocalTime) > 0.5) {
        videoRef.current.src = currentSegmentInfo.segment.videoUrl;
        videoRef.current.currentTime = segmentLocalTime;
        if (isPlaying) {
          videoRef.current.play();
        }
      }
    }
  }, [currentTime, currentSegmentInfo, isPlaying]);

  // Handle timeline click
  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;
    const rect = timelineRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    const newTime = clickPercent * totalDuration;
    setCurrentTime(Math.max(0, Math.min(newTime, totalDuration)));
  };

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Add new segment
  const handleAddSegment = async () => {
    // This would integrate with the actual generation logic
    // For now, just a placeholder
    const newSegment: VideoSegment = {
      id: `seg-${Date.now()}`,
      videoUrl: "placeholder",
      imageUrl: selectedImageUrl || undefined,
      prompt: videoDescription,
      duration: selectedVideoDuration,
      model: selectedVideoModel,
      order: segments.length,
    };
    setSegments([...segments, newSegment]);
    setVideoDescription("");
    setSelectedImageUrl(null);
  };

  // Remove segment
  const handleRemoveSegment = (index: number) => {
    setSegments(segments.filter((_, i) => i !== index).map((seg, idx) => ({
      ...seg,
      order: idx
    })));
  };

  // Download merged video
  const handleDownload = () => {
    // Implementation for downloading the merged scene
    console.log("Download scene");
  };

  // Organize segments
  const handleOrganize = () => {
    console.log("Organize segments");
  };

  const modelNames: Record<string, string> = {
    'fal-veo3': 'Veo 3.1 - Fast',
    'fal-kling': 'Kling 2.5',
    'fal-wan25': 'Wan 2.5',
    'fal-sora': 'Sora 2'
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3 border-b border-border bg-background/95">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-semibold">Scene Editor</h1>
          <span className="text-sm text-muted-foreground">{segments.length} clips • {formatTime(totalDuration)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleOrganize}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Organize
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDownload}
          >
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button
            onClick={() => onSave(segments)}
            size="sm"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Save to Timeline
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-hidden">
        {/* Video Preview */}
        {currentSegmentInfo ? (
          <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden shadow-2xl">
            <video
              ref={videoRef}
              src={currentSegmentInfo.segment.videoUrl}
              className="w-full h-full object-contain"
              onTimeUpdate={(e) => {
                const segmentLocalTime = e.currentTarget.currentTime;
                const newGlobalTime = currentSegmentInfo.segmentStartTime + segmentLocalTime;
                setCurrentTime(newGlobalTime);
              }}
              onEnded={() => {
                // Auto-advance to next segment
                if (currentSegmentInfo.index < segments.length - 1) {
                  const nextSegmentStart = currentSegmentInfo.segmentStartTime + currentSegmentInfo.segment.duration;
                  setCurrentTime(nextSegmentStart);
                } else {
                  setIsPlaying(false);
                  setCurrentTime(0);
                }
              }}
            />

            {/* Play/Pause Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Button
                size="lg"
                variant="ghost"
                onClick={togglePlayPause}
                className="pointer-events-auto h-16 w-16 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8 text-white" />
                ) : (
                  <Play className="h-8 w-8 text-white ml-1" />
                )}
              </Button>
            </div>

            {/* Segment Info Overlay */}
            <div className="absolute bottom-4 left-4 px-3 py-2 bg-black/80 rounded-lg backdrop-blur-sm">
              <p className="text-white text-sm font-medium">
                Clip {(currentSegmentInfo.index + 1)} of {segments.length}
              </p>
              <p className="text-white/70 text-xs line-clamp-1">
                {currentSegmentInfo.segment.prompt}
              </p>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-4xl aspect-video bg-muted/20 rounded-lg flex items-center justify-center border-2 border-dashed border-muted-foreground/25">
            <div className="text-center space-y-2">
              <Film className="h-16 w-16 text-muted-foreground mx-auto" />
              <p className="text-lg font-medium text-muted-foreground">No clips yet</p>
              <p className="text-sm text-muted-foreground/70">Create your first clip below</p>
            </div>
          </div>
        )}

        {/* Timeline Scrubber */}
        {segments.length > 0 && (
          <div className="w-full max-w-4xl mt-6 space-y-3">
            {/* Playback Controls */}
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
              >
                {isPlaying ? (
                  <Pause className="h-4 w-4 mr-2" />
                ) : (
                  <Play className="h-4 w-4 mr-2" />
                )}
                {isPlaying ? 'Pause' : 'Play'}
              </Button>
              <span className="text-sm font-mono text-muted-foreground">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            {/* Timeline with Segments */}
            <div
              ref={timelineRef}
              className="relative h-24 bg-muted/30 rounded-lg overflow-hidden cursor-pointer border"
              onClick={handleTimelineClick}
            >
              <div className="flex h-full">
                {segments.map((segment, index) => {
                  const widthPercent = (segment.duration / totalDuration) * 100;
                  const segmentStartTime = segments.slice(0, index).reduce((acc, s) => acc + s.duration, 0);
                  const isActive = currentSegmentInfo?.index === index;

                  return (
                    <div
                      key={segment.id}
                      className={`relative flex-shrink-0 border-r border-border/50 group ${
                        isActive ? 'ring-2 ring-primary ring-inset' : ''
                      }`}
                      style={{ width: `${widthPercent}%` }}
                    >
                      {/* Segment Thumbnail/Preview */}
                      {segment.imageUrl ? (
                        <img
                          src={segment.imageUrl}
                          alt={`Segment ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={segment.videoUrl}
                          className="w-full h-full object-cover"
                          muted
                        />
                      )}

                      {/* Segment Number */}
                      <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded font-mono">
                        {index + 1}
                      </div>

                      {/* Duration */}
                      <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded font-mono">
                        {segment.duration}s
                      </div>

                      {/* Delete Button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveSegment(index);
                        }}
                        className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>

                      {/* Extend Button (on right edge) */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Extend segment", index);
                        }}
                        className="absolute top-1/2 -right-3 transform -translate-y-1/2 p-1 bg-primary hover:bg-primary/80 text-primary-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity z-10"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Playhead */}
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-primary pointer-events-none z-20"
                style={{
                  left: `${(currentTime / totalDuration) * 100}%`,
                }}
              >
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1 w-3 h-3 bg-primary rounded-full" />
              </div>
            </div>

            {/* Add Clip Button */}
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Scroll to creation panel
                  setVideoDescription("");
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add clip after last
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Creation Panel (Google Veo Flow style) */}
      <div className="border-t border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <Card className="border shadow-lg">
            <div className="p-4 space-y-3">
              {/* Mode Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2"
                  >
                    {generationMode === 'text-to-video' ? (
                      <Type className="h-4 w-4" />
                    ) : (
                      <ImageIcon className="h-4 w-4" />
                    )}
                    <span>{generationMode === 'text-to-video' ? 'Text to Video' : 'Image to Video'}</span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                  <Button variant="ghost" size="sm" className="h-8 gap-2">
                    <Volume2 className="h-4 w-4" />
                    {modelNames[selectedVideoModel]}
                  </Button>
                  <span className="text-xs px-2 py-1 rounded-md bg-muted">×1</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettings(true)}
                    className="h-8 gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    Settings
                  </Button>
                </div>
              </div>

              {/* Prompt Input */}
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder="Generate a video with text…"
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 resize-none"
              />

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2">
                <Button variant="ghost" size="sm" className="h-9" disabled>
                  <Wand2 className="h-4 w-4 mr-2" />
                  Expand
                </Button>
                <Button
                  onClick={handleAddSegment}
                  disabled={!videoDescription.trim() || isGenerating}
                  size="sm"
                  className="h-9"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Create
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          <p className="text-center text-xs text-muted-foreground mt-2">
            Verify results, as AI can make errors
          </p>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Video Settings</DialogTitle>
            <DialogDescription>Configure your video generation settings</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Model Selection */}
            <div className="space-y-2">
              <Label>Model</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['fal-veo3', 'fal-kling', 'fal-wan25', 'fal-sora'] as const).map((model) => (
                  <button
                    key={model}
                    onClick={() => setSelectedVideoModel(model)}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${
                      selectedVideoModel === model
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {modelNames[model]}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio */}
            <div className="space-y-2">
              <Label>Aspect Ratio</Label>
              <div className="flex gap-2">
                {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setVideoRatio(ratio)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                      videoRatio === ratio
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                    }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div className="space-y-2">
              <Label>Duration</Label>
              <div className="flex gap-2">
                {selectedVideoModel === 'fal-veo3' && (
                  <button className="flex-1 px-3 py-2 text-sm rounded-md border border-primary bg-primary text-primary-foreground">
                    8s
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
