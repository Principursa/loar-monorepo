import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Film,
  Sparkles,
  Loader2,
  UserPlus,
  Wand2,
  Video,
  AlertCircle,
  CheckCircle2,
  Info,
  XCircle,
  X,
  Settings2,
  ArrowRight,
  ChevronDown,
  Image as ImageIcon,
  Type,
  Plus,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VideoTimelineSimple } from "@/components/VideoTimelineSimple";
import type { VideoModel } from "@/types/segments";
import { trpcClient } from '@/utils/trpc';

interface FlowCreationPanelProps {
  showVideoDialog: boolean;
  setShowVideoDialog: (show: boolean) => void;
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoDescription: string;
  setVideoDescription: (description: string) => void;
  additionType: 'after' | 'branch';
  selectedCharacters: string[];
  setSelectedCharacters: React.Dispatch<React.SetStateAction<string[]>>;
  showCharacterSelector: boolean;
  setShowCharacterSelector: (show: boolean) => void;
  showCharacterGenerator: boolean;
  setShowCharacterGenerator: (show: boolean) => void;
  charactersData: any;
  isLoadingCharacters: boolean;
  characterName: string;
  setCharacterName: (name: string) => void;
  characterDescription: string;
  setCharacterDescription: (description: string) => void;
  characterStyle: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk';
  setCharacterStyle: (style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk') => void;
  isGeneratingCharacter: boolean;
  generatedCharacter: any;
  setGeneratedCharacter: (char: any) => void;
  generateCharacterMutation: any;
  saveCharacterMutation: any;
  generatedImageUrl: string | null;
  isGeneratingImage: boolean;
  imageFormat: string;
  setImageFormat: (format: string) => void;
  handleGenerateEventImage: () => void;
  showVideoStep: boolean;
  setShowVideoStep: (show: boolean) => void;
  uploadedUrl: string | null;
  setUploadedUrl: (url: string | null) => void;
  isUploading: boolean;
  uploadToTmpfiles: () => void;
  generatedVideoUrl: string | null;
  setGeneratedVideoUrl: (url: string | null) => void;
  setGeneratedImageUrl: (url: string | null) => void;
  isGeneratingVideo: boolean;
  videoPrompt: string;
  setVideoPrompt: (prompt: string) => void;
  videoAnimationPrompt?: string;
  setVideoAnimationPrompt?: (prompt: string) => void;
  videoRatio: "16:9" | "9:16" | "1:1";
  setVideoRatio: (ratio: "16:9" | "9:16" | "1:1") => void;
  selectedVideoModel: 'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora';
  setSelectedVideoModel: (model: 'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora') => void;
  selectedVideoDuration: number;
  setSelectedVideoDuration: (duration: number) => void;
  negativePrompt: string;
  setNegativePrompt: (prompt: string) => void;
  handleGenerateVideo: () => void;
  isSavingToContract: boolean;
  contractSaved: boolean;
  isSavingToFilecoin: boolean;
  filecoinSaved: boolean;
  pieceCid: string | null;
  handleSaveToContract: () => void;
  handleCreateEvent: () => void;
  previousEventVideoUrl?: string | null;
  statusMessage?: {
    type: 'error' | 'success' | 'info' | 'warning';
    title: string;
    description: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  } | null;
  setStatusMessage?: (message: any) => void;
}

interface VideoSegment {
  id: string;
  videoUrl: string;
  videoBlob?: Blob; // Store the actual video data to avoid re-downloading
  imageUrl?: string;
  prompt: string;
  duration: number;
  model: string;
  order: number;
  // Trim settings
  trimStart: number; // Start time in seconds (0 = no trim)
  trimEnd: number; // End time in seconds (duration = no trim)
}

export function FlowCreationPanel({
  showVideoDialog,
  setShowVideoDialog,
  videoTitle,
  setVideoTitle,
  videoDescription,
  setVideoDescription,
  additionType,
  selectedCharacters,
  setSelectedCharacters,
  charactersData,
  generatedImageUrl,
  isGeneratingImage,
  previousEventVideoUrl,
  handleGenerateEventImage,
  generatedVideoUrl,
  setGeneratedVideoUrl,
  setGeneratedImageUrl,
  isGeneratingVideo,
  videoRatio,
  setVideoRatio,
  selectedVideoModel,
  setSelectedVideoModel,
  selectedVideoDuration,
  setSelectedVideoDuration,
  handleGenerateVideo,
  isSavingToContract,
  contractSaved,
  isSavingToFilecoin,
  filecoinSaved,
  pieceCid,
  handleSaveToContract,
  statusMessage,
  setStatusMessage,
}: FlowCreationPanelProps) {
  const [extractedFrameUrl, setExtractedFrameUrl] = useState<string | null>(null);
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showCharacterDialog, setShowCharacterDialog] = useState(false);
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Local state for event description (separate from videoDescription which is for prompts)
  const [eventDescription, setEventDescription] = useState('');

  // Local state for video animation prompt (for image-to-video mode)
  const [localVideoPrompt, setLocalVideoPrompt] = useState('');

  // Multi-segment state
  const [segments, setSegments] = useState<VideoSegment[]>([]);


  // Frame-based video control (Remotion approach)
  const [currentFrame, setCurrentFrame] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1.0); // Volume from 0.0 to 1.0
  const videoRef = useRef<HTMLVideoElement>(null);

  const fps = 30; // Standard FPS for video playback

  // Extract last frame from previous event video
  const extractLastFrame = async () => {
    if (!previousEventVideoUrl) return;

    setIsExtractingFrame(true);

    try {
      const video = document.createElement('video');
      video.crossOrigin = 'anonymous';
      video.src = previousEventVideoUrl;

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => {
          video.currentTime = Math.max(0, video.duration - 0.1);
        };
        video.onseeked = resolve;
        video.onerror = reject;
      });

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frameUrl = canvas.toDataURL('image/png');
        setExtractedFrameUrl(frameUrl);
        setGeneratedImageUrl(frameUrl);
      }
    } catch (error) {
      console.error('Error extracting frame:', error);
    } finally {
      setIsExtractingFrame(false);
    }
  };


  // Add segment to queue
  const handleAddSegmentToQueue = async () => {
    if (!generatedVideoUrl || !videoDescription) return;

    // Fetch the video blob immediately to cache it
    let videoBlob: Blob | undefined;
    try {
      console.log('📥 Caching video blob for instant preview...');
      const response = await fetch(generatedVideoUrl);
      videoBlob = await response.blob();
      console.log('✅ Video blob cached:', (videoBlob.size / 1024 / 1024).toFixed(2), 'MB');
    } catch (error) {
      console.warn('⚠️ Could not cache video blob:', error);
    }

    const newSegment: VideoSegment = {
      id: `seg-${Date.now()}`,
      videoUrl: generatedVideoUrl,
      videoBlob, // Store the blob for instant access
      imageUrl: generatedImageUrl || undefined,
      prompt: videoDescription,
      duration: selectedVideoDuration,
      model: selectedVideoModel,
      order: segments.length,
      trimStart: 0, // No trim by default
      trimEnd: selectedVideoDuration, // Full duration by default
    };

    setSegments(prev => [...prev, newSegment]);

    // Clear for next segment
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);
    setVideoDescription("");

    // Reset frame position when segments change
    setCurrentFrame(0);

    // Show success message
    setStatusMessage?.({
      type: 'success',
      title: 'Segment Added!',
      description: `Segment ${segments.length + 1} has been added to your scene. Generate another or save to timeline.`,
    });
  };

  // Remove segment from queue
  const handleRemoveSegment = (segmentId: string) => {
    setSegments(prev => prev.filter(seg => seg.id !== segmentId).map((seg, idx) => ({
      ...seg,
      order: idx
    })));
    setCurrentFrame(0); // Reset to beginning
  };

  // Note: Total duration is now calculated inside VideoTimelineSimple component
  // Kept for reference if needed for advanced features later

  // Frame-based video control - find which segment should be visible at current frame
  // IMPORTANT: This now respects trim boundaries!
  const getActiveSegmentAtFrame = useCallback((frame: number) => {
    let cumulativeFrames = 0;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      const trimmedDuration = segment.trimEnd - segment.trimStart;
      const segmentFrames = trimmedDuration * fps;
      const nextCumulative = cumulativeFrames + segmentFrames;

      if (frame >= cumulativeFrames && frame < nextCumulative) {
        const segmentFrame = frame - cumulativeFrames;
        // Map to actual video time accounting for trim start
        const actualVideoTime = segment.trimStart + (segmentFrame / fps);

        return {
          segment: segment,
          segmentIndex: i,
          segmentFrame,
          segmentTime: actualVideoTime, // This is the ACTUAL video time including trim offset
          trimmedSegmentTime: segmentFrame / fps, // Time within the trimmed range
        };
      }

      cumulativeFrames = nextCumulative;
    }

    // If past the end, return last segment
    if (segments.length > 0) {
      const lastSegment = segments[segments.length - 1];
      const trimmedDuration = lastSegment.trimEnd - lastSegment.trimStart;
      return {
        segment: lastSegment,
        segmentIndex: segments.length - 1,
        segmentFrame: trimmedDuration * fps - 1,
        segmentTime: lastSegment.trimEnd - (1 / fps), // At the end of trim range
        trimmedSegmentTime: trimmedDuration - (1 / fps),
      };
    }

    return null;
  }, [segments, fps]);

  // Update video element based on current frame (for scrubbing)
  useEffect(() => {
    if (segments.length === 0 || !videoRef.current) return;

    const activeInfo = getActiveSegmentAtFrame(currentFrame);
    if (!activeInfo) return;

    const video = videoRef.current;
    const segment = activeInfo.segment;

    // If the segment changed, update the video source
    if (video.src !== segment.videoUrl) {
      console.log(`📹 Switching to segment ${activeInfo.segmentIndex + 1} at frame ${currentFrame}`);
      console.log(`   Trim range: ${segment.trimStart}s - ${segment.trimEnd}s`);
      console.log(`   Seeking to: ${activeInfo.segmentTime}s`);

      video.src = segment.videoUrl;
      video.load();

      // Wait for video to be ready before seeking
      video.addEventListener('loadedmetadata', () => {
        video.currentTime = activeInfo.segmentTime;
      }, { once: true });

      // Start playing if in play mode
      if (isPlaying) {
        video.play().catch(err => console.warn('Auto-play prevented:', err));
      }
    } else if (!isPlaying) {
      // Only manually seek when paused (scrubbing)
      // Make sure we respect trim boundaries
      const targetTime = Math.max(segment.trimStart, Math.min(segment.trimEnd, activeInfo.segmentTime));

      if (Math.abs(video.currentTime - targetTime) > 0.1) {
        video.currentTime = targetTime;
      }
    }
  }, [currentFrame, segments, getActiveSegmentAtFrame, isPlaying]);

  // Handle play/pause
  useEffect(() => {
    if (!videoRef.current || segments.length === 0) return;

    const video = videoRef.current;

    if (isPlaying && video.paused) {
      video.play().catch(err => console.warn('Auto-play prevented:', err));
    } else if (!isPlaying && !video.paused) {
      video.pause();
    }
  }, [isPlaying, segments.length]);

  // Sync volume with video element
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume;
    }
  }, [volume]);

  // Sync frame counter with video playback AND enforce trim boundaries
  useEffect(() => {
    if (!videoRef.current || segments.length === 0) return;

    const video = videoRef.current;

    const handleTimeUpdate = () => {
      const activeInfo = getActiveSegmentAtFrame(currentFrame);
      if (!activeInfo) return;

      const segment = activeInfo.segment;

      // ENFORCE TRIM END BOUNDARY - Stop playback if we exceed trimEnd
      if (video.currentTime >= segment.trimEnd) {
        console.log(`⏹️ Reached trim end at ${segment.trimEnd}s, moving to next segment or stopping`);

        if (activeInfo.segmentIndex < segments.length - 1) {
          // Move to next segment (start of its trim range)
          let cumulativeTrimmedFrames = 0;
          for (let i = 0; i <= activeInfo.segmentIndex; i++) {
            const trimmedDuration = segments[i].trimEnd - segments[i].trimStart;
            cumulativeTrimmedFrames += trimmedDuration * fps;
          }
          setCurrentFrame(Math.floor(cumulativeTrimmedFrames));
        } else {
          // End of all segments - stop
          setCurrentFrame(0);
          setIsPlaying(false);
        }
        return;
      }

      // Calculate frame position accounting for trimmed durations
      let cumulativeTrimmedTime = 0;
      for (let i = 0; i < activeInfo.segmentIndex; i++) {
        const trimmedDuration = segments[i].trimEnd - segments[i].trimStart;
        cumulativeTrimmedTime += trimmedDuration;
      }

      // Add current time within the active segment (offset from trimStart)
      const timeIntoTrimmedSegment = video.currentTime - segment.trimStart;
      const totalElapsedTime = cumulativeTrimmedTime + timeIntoTrimmedSegment;
      const newFrame = Math.floor(totalElapsedTime * fps);

      // Update frame counter based on video's actual playback
      if (newFrame !== currentFrame && newFrame >= 0) {
        setCurrentFrame(newFrame);
      }
    };

    const handleEnded = () => {
      // When a segment ends naturally (reached video end)
      const activeInfo = getActiveSegmentAtFrame(currentFrame);
      if (!activeInfo) return;

      if (activeInfo.segmentIndex < segments.length - 1) {
        // Move to next segment
        let cumulativeTrimmedFrames = 0;
        for (let i = 0; i <= activeInfo.segmentIndex; i++) {
          const trimmedDuration = segments[i].trimEnd - segments[i].trimStart;
          cumulativeTrimmedFrames += trimmedDuration * fps;
        }
        setCurrentFrame(Math.floor(cumulativeTrimmedFrames));
      } else {
        // End of all segments - loop or stop
        setCurrentFrame(0);
        setIsPlaying(false);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, [segments, currentFrame, fps, getActiveSegmentAtFrame]);

  // Reset when dialog closes
  useEffect(() => {
    if (!showVideoDialog) {
      setExtractedFrameUrl(null);
      setShowSettingsDialog(false);
      setGenerationMode('text-to-video');
      setSegments([]);
      setLocalVideoPrompt('');
      setCurrentFrame(0); // Reset frame position
      setIsPlaying(false); // Stop playback
    }
  }, [showVideoDialog]);

  if (!showVideoDialog) return null;

  const modelNames: Record<string, string> = {
    'fal-veo3': 'Veo 3.1 - Fast',
    'fal-kling': 'Kling 2.5',
    'fal-wan25': 'Wan 2.5',
    'fal-sora': 'Sora 2'
  };

  const modeNames = {
    'text-to-video': 'Text to Video',
    'image-to-video': 'Image to Video'
  };

  return (
    <>
      {/* Save to Timeline Dialog */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Save to Timeline</DialogTitle>
            <DialogDescription>Provide a title and description for this event</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Title Input */}
            <div className="space-y-2">
              <Label>Event Title</Label>
              <Input
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="Enter event title..."
                className="w-full"
              />
            </div>

            {/* Description Input */}
            <div className="space-y-2">
              <Label>Event Description</Label>
              <textarea
                value={eventDescription}
                onChange={(e) => setEventDescription(e.target.value)}
                placeholder="Describe what happens in this event..."
                rows={4}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />
            </div>

            {/* Save Button */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setShowSaveDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={async () => {
                  if (!videoTitle.trim() || !eventDescription.trim()) {
                    return;
                  }

                  // Check if we have a video to save
                  const hasVideo = generatedVideoUrl || segments.length > 0;
                  if (!hasVideo) {
                    alert('Please generate at least one video before saving');
                    return;
                  }

                  setShowSaveDialog(false);
                  setVideoDescription(eventDescription);

                  try {
                    // If we have multiple segments, concatenate them first
                    if (segments.length > 1) {
                      console.log(`🎬 Concatenating ${segments.length} segments...`);
                      setStatusMessage?.({
                        type: 'info',
                        title: 'Processing Video',
                        description: `Combining ${segments.length} segments...`,
                      });

                      // Prepare segments with trim information
                      const segmentsToUpload = segments.map(s => ({
                        url: s.videoUrl,
                        trimStart: s.trimStart,
                        trimEnd: s.trimEnd,
                        originalDuration: s.duration, // Include original duration for trim detection
                      }));

                      // @ts-ignore - concatenateAndUpload endpoint exists in router
                      const result = await trpcClient.video.concatenateAndUpload.mutate({
                        segments: segmentsToUpload
                      });

                      console.log('✅ Concatenation and upload complete! PieceCID:', result.pieceCid);

                      // Store the pieceCid in a special marker URL format
                      // The parent's handleSaveToContract will recognize this and skip upload
                      setGeneratedVideoUrl(`filecoin://${result.pieceCid}`);

                      setStatusMessage?.({
                        type: 'success',
                        title: 'Video Ready',
                        description: 'Concatenated video uploaded to Filecoin!',
                      });

                      setTimeout(() => handleSaveToContract(), 500);
                    } else {
                      // Single segment or single video
                      const videoUrl = generatedVideoUrl || segments[0]?.videoUrl;
                      if (videoUrl) {
                        setGeneratedVideoUrl(videoUrl);
                        setTimeout(() => handleSaveToContract(), 300);
                      }
                    }
                  } catch (error) {
                    console.error('❌ Error concatenating videos:', error);
                    setStatusMessage?.({
                      type: 'error',
                      title: 'Concatenation Failed',
                      description: error instanceof Error ? error.message : 'Failed to combine videos',
                    });
                  }
                }}
                disabled={!videoTitle.trim() || !eventDescription.trim() || isSavingToContract}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isSavingToContract ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Save to Timeline
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Character Selection Dialog */}
      <Dialog open={showCharacterDialog} onOpenChange={setShowCharacterDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Select Characters</DialogTitle>
            <DialogDescription>Choose up to 2 characters for your scene</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {charactersData?.characters && charactersData.characters.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {charactersData.characters.map((char: any) => {
                  const isSelected = selectedCharacters.includes(char.id);
                  const isDisabled = !isSelected && selectedCharacters.length >= 2;
                  return (
                    <button
                      key={char.id}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedCharacters(prev => prev.filter(id => id !== char.id));
                        } else if (!isDisabled) {
                          setSelectedCharacters(prev => [...prev, char.id]);
                        }
                      }}
                      disabled={isDisabled}
                      className={`relative aspect-square rounded overflow-hidden border-2 transition-all ${
                        isSelected
                          ? 'border-primary shadow-lg scale-95'
                          : isDisabled
                          ? 'border-muted opacity-40 cursor-not-allowed'
                          : 'border-muted-foreground/20 hover:border-muted-foreground/40'
                      }`}
                    >
                      <img
                        src={char.image_url}
                        alt={char.character_name}
                        className="w-full h-full object-cover"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                            <svg className="w-5 h-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        </div>
                      )}
                      {isDisabled && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                          <svg className="w-6 h-6 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-1.5">
                        <span className="text-xs text-white font-medium line-clamp-1">
                          {char.character_name}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-muted-foreground text-center p-4">
                No characters available. Create a character first.
              </div>
            )}

            {selectedCharacters.length > 0 && (
              <div className="mt-4 text-sm text-muted-foreground text-center">
                {selectedCharacters.length}/2 character{selectedCharacters.length !== 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Modal */}
      <Dialog open={showSettingsDialog} onOpenChange={setShowSettingsDialog}>
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
                    className={`px-3 py-2 text-sm rounded-md border transition-colors text-left ${selectedVideoModel === model
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
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${videoRatio === ratio
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
                {selectedVideoModel === 'fal-sora' && [4, 8, 12].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedVideoDuration(duration)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === duration
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    {duration}s
                  </button>
                ))}
                {selectedVideoModel === 'fal-veo3' && (
                  <button className="flex-1 px-3 py-2 text-sm rounded-md border border-primary bg-primary text-primary-foreground">
                    8s
                  </button>
                )}
                {(selectedVideoModel === 'fal-kling' || selectedVideoModel === 'fal-wan25') && [5, 10].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedVideoDuration(duration)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === duration
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    {duration}s
                  </button>
                ))}
              </div>
            </div>

            {/* Characters Section */}
            {selectedCharacters.length > 0 && charactersData?.characters && (
              <div className="space-y-2">
                <Label>Selected Characters</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedCharacters.map(charId => {
                    const char = charactersData.characters.find((c: any) => c.id === charId);
                    if (!char) return null;
                    return (
                      <div key={charId} className="flex items-center gap-2 px-2 py-1 rounded-md border bg-background text-sm">
                        <img src={char.image_url} alt={char.character_name} className="w-6 h-6 rounded-full object-cover" />
                        <span>{char.character_name}</span>
                        <button
                          onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                          className="text-muted-foreground hover:text-destructive ml-1"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Main Bottom Panel */}
      <div className="fixed inset-x-0 bottom-0 z-50 pointer-events-none">
        <div className="max-w-2xl mx-auto px-4 pb-4 pointer-events-auto">
          {/* Status Message - Above the main panel */}
          {statusMessage && (
            <div className="mb-2 animate-in slide-in-from-bottom-2 duration-300">
              <div className="rounded border-0 p-2 bg-black/80 backdrop-blur-sm shadow-lg">
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {statusMessage.type === 'error' && <XCircle className="h-3.5 w-3.5 text-red-400" />}
                    {statusMessage.type === 'success' && <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />}
                    {statusMessage.type === 'warning' && <AlertCircle className="h-3.5 w-3.5 text-yellow-400" />}
                    {statusMessage.type === 'info' && <Info className="h-3.5 w-3.5 text-blue-400" />}
                  </div>
                  <div className="flex-1 space-y-0.5">
                    <h4 className="text-xs font-medium text-white">
                      {statusMessage.title}
                    </h4>
                    <p className="text-[10px] text-white/60 whitespace-pre-line">
                      {statusMessage.description}
                    </p>
                    {statusMessage.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={statusMessage.action.onClick}
                        className="mt-1.5 h-6 text-[10px] border-white/20 text-white hover:bg-white/10"
                      >
                        {statusMessage.action.label}
                      </Button>
                    )}
                  </div>
                  {setStatusMessage && (
                    <button
                      onClick={() => setStatusMessage(null)}
                      className="text-white/50 hover:text-white"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Event Preview & Timeline */}
          {(generatedVideoUrl || segments.length > 0) && (
            <div className="mb-2 space-y-3">
              {/* Video Preview */}
              <div className="relative rounded-xl overflow-hidden bg-black aspect-video shadow-2xl">
                {segments.length > 0 ? (
                  <video
                    ref={videoRef}
                    className="w-full h-full object-contain"
                    playsInline
                    preload="auto"
                    muted={false}
                  />
                ) : generatedVideoUrl ? (
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full h-full object-contain"
                    playsInline
                    preload="auto"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-white/50 text-sm">
                    Generate a video to preview
                  </div>
                )}
              </div>

              {/* Google Flow Style Timeline */}
              {segments.length > 0 && (
                <VideoTimelineSimple
                  segments={segments.map(seg => ({
                    id: seg.id,
                    videoUrl: seg.videoUrl,
                    duration: seg.duration,
                    trimStart: seg.trimStart,
                    trimEnd: seg.trimEnd,
                    imageUrl: seg.imageUrl,
                  }))}
                  onRemoveSegment={handleRemoveSegment}
                  onUpdateSegment={(id, trimStart, trimEnd) => {
                    // Update the segment trim values
                    setSegments(prev => prev.map(seg =>
                      seg.id === id ? { ...seg, trimStart, trimEnd } : seg
                    ));

                    // Reset current frame to ensure proper playback after trim
                    setCurrentFrame(prev => {
                      // Recalculate to ensure we're within new bounds
                      const activeInfo = getActiveSegmentAtFrame(prev);
                      if (activeInfo && activeInfo.segment.id === id) {
                        // If we're currently on the trimmed segment, adjust frame
                        const newTrimmedDuration = trimEnd - trimStart;
                        const maxFrame = newTrimmedDuration * fps;
                        return Math.min(prev, Math.floor(maxFrame - 1));
                      }
                      return prev;
                    });
                  }}
                  currentTime={currentFrame / fps}
                  onSeek={(time) => {
                    const frame = Math.floor(time * fps);
                    setCurrentFrame(frame);
                    setIsPlaying(false);
                  }}
                  isPlaying={isPlaying}
                  onPlayPause={() => setIsPlaying(!isPlaying)}
                  volume={volume}
                  onVolumeChange={setVolume}
                />
              )}

              {/* Save Button */}
              {segments.length > 0 && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => setShowSaveDialog(true)}
                    disabled={isSavingToContract || contractSaved}
                    size="lg"
                    className="bg-white text-black hover:bg-gray-100 shadow-lg"
                  >
                    {isSavingToContract ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Saving...
                      </>
                    ) : contractSaved ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Saved
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Save to Timeline
                      </>
                    )}
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Compact Main Panel */}
          <Card className="bg-black/90 backdrop-blur-sm shadow-2xl border-0">
            <div className="p-3 space-y-2">
              {/* Top Bar with Mode Selector */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Mode Toggle */}
                  <div className="flex items-center gap-1 bg-white/5 rounded p-0.5">
                    <button
                      onClick={() => {
                        setGenerationMode('text-to-video');
                        setGeneratedImageUrl(null);
                        setLocalVideoPrompt('');
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        generationMode === 'text-to-video'
                          ? 'bg-white text-black font-medium'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Type className="h-3 w-3 inline mr-1" />
                      Text
                    </button>
                    <button
                      onClick={() => {
                        setGenerationMode('image-to-video');
                        setLocalVideoPrompt('');
                      }}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        generationMode === 'image-to-video'
                          ? 'bg-white text-black font-medium'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <ImageIcon className="h-3 w-3 inline mr-1" />
                      Image
                    </button>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettingsDialog(true)}
                    className="h-7 px-2 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <Settings2 className="h-3.5 w-3.5 mr-1.5" />
                    <span className="text-xs">{modelNames[selectedVideoModel]}</span>
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideoDialog(false)}
                  className="h-7 w-7 p-0 text-white/70 hover:text-white hover:bg-white/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Image-to-Video Mode: New 2-Step Flow */}
              {generationMode === 'image-to-video' && (
                <div className="space-y-2">
                  {/* Step 1: Character + Scene Description (if no frame yet) */}
                  {!generatedImageUrl && (
                    <div className="space-y-2">
                      {/* Character Selector Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowCharacterDialog(true)}
                        className="w-full h-8 border-white/20 text-white hover:bg-white/10 text-xs"
                      >
                        <UserPlus className="h-3.5 w-3.5 mr-1.5" />
                        {selectedCharacters.length > 0
                          ? `${selectedCharacters.length} Character${selectedCharacters.length !== 1 ? 's' : ''} Selected`
                          : 'Select Characters (Optional)'}
                      </Button>

                      {/* Scene Description Input */}
                      <div className="space-y-1.5">
                        <Label className="text-xs text-white/70">Describe the Scene</Label>
                        <textarea
                          value={videoDescription}
                          onChange={(e) => setVideoDescription(e.target.value)}
                          placeholder="e.g., Banana running through a golden field at sunset..."
                          rows={2}
                          className="w-full rounded border-0 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 resize-none"
                        />
                      </div>

                      {/* Generate Frame Button */}
                      <Button
                        onClick={handleGenerateEventImage}
                        disabled={!videoDescription.trim() || isGeneratingImage}
                        size="sm"
                        className="w-full h-8 bg-white/10 text-white hover:bg-white/20 text-xs"
                      >
                        {isGeneratingImage ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Generating Frame...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            Generate Frame
                          </>
                        )}
                      </Button>
                    </div>
                  )}

                  {/* Step 2: Generated Frame Preview + Animation Prompt (only show if no video yet) */}
                  {generatedImageUrl && !generatedVideoUrl && (
                    <div className="space-y-2">
                      {/* Compact Frame Preview */}
                      <div className="relative rounded overflow-hidden bg-black h-32">
                        <img
                          src={generatedImageUrl}
                          alt="Generated frame"
                          className="w-full h-full object-cover"
                        />
                        <button
                          onClick={() => {
                            setGeneratedImageUrl(null);
                          }}
                          className="absolute top-1 right-1 p-1 rounded-full bg-black/60 hover:bg-black/80 text-white transition-colors"
                        >
                          <X className="h-3 w-3" />
                        </button>
                        <div className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-black/80 text-white text-[10px] rounded backdrop-blur-sm">
                          Frame
                        </div>
                      </div>

                      {/* Step 3: Video Animation Prompt */}
                      <div className="space-y-1.5">
                        <Label className="text-xs text-white/70">Describe Animation</Label>
                        <textarea
                          value={localVideoPrompt}
                          onChange={(e) => setLocalVideoPrompt(e.target.value)}
                          placeholder="e.g., Camera slowly zooms in, character waves at the camera..."
                          rows={2}
                          className="w-full rounded border-0 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 resize-none"
                        />
                      </div>

                      {/* Generate Video Button */}
                      <Button
                        onClick={handleGenerateVideo}
                        disabled={!localVideoPrompt.trim() || isGeneratingVideo}
                        size="sm"
                        className="w-full h-8 bg-white text-black hover:bg-white/90 text-xs"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                            Generating Video...
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                            Generate Video
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {/* Text-to-Video Prompt Input */}
              {generationMode === 'text-to-video' && (
                <textarea
                  value={videoDescription}
                  onChange={(e) => setVideoDescription(e.target.value)}
                  placeholder="Describe your scene..."
                  rows={2}
                  className="w-full rounded border-0 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 resize-none"
                />
              )}

              {/* Compact Action Buttons - Only for text-to-video or when video is generated */}
              {(generationMode === 'text-to-video' || generatedVideoUrl) && (
                <div className="flex items-center justify-between gap-2">
                  {/* Generate/Add buttons */}
                  {!generatedVideoUrl ? (
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={
                        !videoDescription.trim() ||
                        isGeneratingVideo
                      }
                      size="sm"
                      className="h-8 bg-white text-black hover:bg-white/90 text-xs"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                          Generate
                        </>
                      )}
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleAddSegmentToQueue}
                        size="sm"
                        variant="outline"
                        className="h-8 border-white/20 text-white hover:bg-white/10 text-xs"
                      >
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Add to Timeline
                      </Button>
                      {segments.length === 0 && (
                        <Button
                          onClick={() => setShowSaveDialog(true)}
                          disabled={isSavingToContract || contractSaved}
                          size="sm"
                          className="h-8 bg-white text-black hover:bg-white/90 text-xs"
                        >
                          {isSavingToContract ? (
                            <>
                              <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                              Saving...
                            </>
                          ) : contractSaved ? (
                            <>
                              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                              Saved
                            </>
                          ) : (
                            <>
                              <Sparkles className="h-3.5 w-3.5 mr-1.5" />
                              Save
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Success Footer */}
              {contractSaved && filecoinSaved && pieceCid && (
                <div className="text-xs text-center text-muted-foreground pt-2 border-t">
                  ✓ Saved to blockchain & Filecoin • CID: {pieceCid.substring(0, 16)}...
                </div>
              )}

              {/* Hint Text */}
              {!generatedVideoUrl && segments.length === 0 && (
                <div className="text-xs text-center text-muted-foreground pt-2 border-t">
                  Create multiple video segments, then save the complete scene to timeline
                </div>
              )}
            </div>
          </Card>

          {/* Disclaimer */}
          <p className="text-center text-xs text-muted-foreground mt-2">
            Verify results, as AI can make errors
          </p>
        </div>
      </div>

    </>
  );
}
