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
  Volume2,
  ChevronDown,
  Image as ImageIcon,
  Type,
} from "lucide-react";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VideoTimeline } from "@/components/segments";
import type { VideoModel } from "@/types/segments";

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
  selectedImageCharacters?: string[];
  setSelectedImageCharacters?: (chars: string[]) => void;
  handleGenerateCharacterFrame?: () => Promise<void>;
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
  selectedImageCharacters: externalSelectedImageCharacters,
  setSelectedImageCharacters: externalSetSelectedImageCharacters,
  handleGenerateCharacterFrame,
}: FlowCreationPanelProps) {
  const [extractedFrameUrl, setExtractedFrameUrl] = useState<string | null>(null);
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  const [showSettingsDialog, setShowSettingsDialog] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const [showModeDropdown, setShowModeDropdown] = useState(false);

  // Image source selection: 'last-frame' or 'create-frame'
  const [imageSource, setImageSource] = useState<'last-frame' | 'create-frame'>('create-frame');

  // Local state for image-to-video character selection (1-2 characters max)
  // Use external state if provided, otherwise use local state
  const [internalSelectedImageCharacters, setInternalSelectedImageCharacters] = useState<string[]>([]);
  const selectedImageCharacters = externalSelectedImageCharacters ?? internalSelectedImageCharacters;
  const setSelectedImageCharacters = externalSetSelectedImageCharacters ?? setInternalSelectedImageCharacters;

  // Local state for event description (separate from videoDescription which is for prompts)
  const [eventDescription, setEventDescription] = useState('');

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

  // Toggle character selection for image-to-video (max 2 characters)
  const toggleCharacterSelection = (charId: string) => {
    const currentChars = selectedImageCharacters;
    if (currentChars.includes(charId)) {
      // Remove if already selected
      setSelectedImageCharacters(currentChars.filter((id: string) => id !== charId));
    } else if (currentChars.length < 2) {
      // Add if less than 2 selected
      setSelectedImageCharacters([...currentChars, charId]);
    } else {
      // Replace the first one if 2 are already selected
      setSelectedImageCharacters([currentChars[1], charId]);
    }
  };


  // Reset when dialog closes
  useEffect(() => {
    if (!showVideoDialog) {
      setExtractedFrameUrl(null);
      setShowSettingsDialog(false);
      setGenerationMode('text-to-video');
      setSelectedImageCharacters([]);
      setImageSource('create-frame');
      setGeneratedImageUrl(null);
    }
  }, [showVideoDialog, setGeneratedImageUrl]);

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
                onClick={() => {
                  if (videoTitle.trim() && eventDescription.trim()) {
                    if (!generatedVideoUrl) {
                      alert('Please generate a video before creating an event');
                      return;
                    }

                    // Set the videoDescription prop to the event description before saving
                    setVideoDescription(eventDescription);

                    // Close dialog and wait for state to propagate
                    setShowSaveDialog(false);

                    // Call save after a short delay to ensure state is updated in parent
                    setTimeout(() => {
                      handleSaveToContract();
                    }, 100);
                  }
                }}
                disabled={!videoTitle.trim() || !eventDescription.trim() || isSavingToContract}
                className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              >
                {isSavingToContract ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Create Event
                  </>
                )}
              </Button>
            </div>
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
                {selectedVideoModel === 'fal-sora' && [4, 8, 12].map((duration) => (
                  <button
                    key={duration}
                    onClick={() => setSelectedVideoDuration(duration)}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                      selectedVideoDuration === duration
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
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${
                      selectedVideoDuration === duration
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


          {/* Compact Main Panel */}
          <Card className="bg-black/90 backdrop-blur-sm shadow-2xl border-0">
            <div className="p-3 space-y-2">
              {/* Top Bar with Tabs and Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Main Tabs */}
                  <div className="flex items-center gap-1 bg-white/5 rounded p-0.5">
                    <button
                      onClick={() => {
                        setGenerationMode('text-to-video');
                        setImageSource('create-frame');
                        setSelectedImageCharacters([]);
                        setGeneratedImageUrl(null);
                        setExtractedFrameUrl(null);
                      }}
                      className={`px-3 py-1.5 text-xs rounded transition-colors ${
                        generationMode === 'text-to-video'
                          ? 'bg-white text-black font-medium'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Type className="h-3 w-3 inline mr-1" />
                      Text
                    </button>
                    {previousEventVideoUrl && (
                      <button
                        onClick={() => {
                          setGenerationMode('image-to-video');
                          setImageSource('last-frame');
                          setSelectedImageCharacters([]);
                          setGeneratedImageUrl(null);
                          extractLastFrame();
                        }}
                        className={`px-3 py-1.5 text-xs rounded transition-colors ${
                          generationMode === 'image-to-video' && imageSource === 'last-frame'
                            ? 'bg-white text-black font-medium'
                            : 'text-white/60 hover:text-white'
                        }`}
                      >
                        <Video className="h-3 w-3 inline mr-1" />
                        Previous Event
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setGenerationMode('image-to-video');
                        setImageSource('create-frame');
                        setExtractedFrameUrl(null);
                        setGeneratedImageUrl(null);
                        setSelectedImageCharacters([]);
                      }}
                      className={`px-3 py-1.5 text-xs rounded transition-colors ${
                        generationMode === 'image-to-video' && imageSource === 'create-frame'
                          ? 'bg-white text-black font-medium'
                          : 'text-white/60 hover:text-white'
                      }`}
                    >
                      <Sparkles className="h-3 w-3 inline mr-1" />
                      Characters
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

              {/* Content Based on Tab Selection */}
              {generationMode === 'image-to-video' && (
                <div className="space-y-3">
                  {/* Show video preview if generated, otherwise show extracted frame for Previous Event tab */}
                  {imageSource === 'last-frame' && (
                    generatedVideoUrl ? (
                      <div className="space-y-1">
                        <div className="flex items-center justify-between">
                          <Label className="text-[10px] text-white/70 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-green-400" />
                            Video Ready
                          </Label>
                        </div>
                        <div className="relative rounded-lg overflow-hidden bg-black aspect-video border border-green-500/30">
                          <video
                            src={generatedVideoUrl}
                            controls
                            autoPlay
                            loop
                            muted
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    ) : extractedFrameUrl ? (
                      <div className="relative rounded-lg overflow-hidden bg-black aspect-video border border-blue-500/30">
                        <img
                          src={extractedFrameUrl}
                          alt="Extracted frame"
                          className="w-full h-full object-contain"
                        />
                        {isExtractingFrame && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Loader2 className="h-6 w-6 text-white animate-spin" />
                          </div>
                        )}
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="text-xs text-white/90 bg-black/60 rounded px-2 py-1 text-center">
                            Last frame from previous event
                          </div>
                        </div>
                      </div>
                    ) : null
                  )}

                  {/* Character Selection Tab */}
                  {imageSource === 'create-frame' && (
                    <div className="space-y-2">
                      {/* Show video preview if generated, otherwise show frame preview */}
                      {generatedVideoUrl ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] text-white/70 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-400" />
                              Video Ready
                            </Label>
                          </div>
                          <div className="relative rounded overflow-hidden bg-black aspect-video border border-green-500/30">
                            <video
                              src={generatedVideoUrl}
                              controls
                              autoPlay
                              loop
                              muted
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ) : generatedImageUrl ? (
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <Label className="text-[10px] text-white/70 flex items-center gap-1">
                              <CheckCircle2 className="h-3 w-3 text-green-400" />
                              Frame Ready
                            </Label>
                            <button
                              onClick={() => {
                                setGeneratedImageUrl(null);
                                setSelectedImageCharacters([]);
                              }}
                              className="text-[10px] text-white/60 hover:text-white transition-colors"
                            >
                              Regenerate
                            </button>
                          </div>
                          <div className="relative rounded overflow-hidden bg-black aspect-video border border-green-500/30">
                            <img
                              src={generatedImageUrl}
                              alt="Generated frame"
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                      ) : null}

                      {/* Character Grid - Always visible, more compact */}
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <Label className="text-xs text-white font-medium">
                            Characters ({selectedImageCharacters.length}/2)
                          </Label>
                          {selectedImageCharacters.length > 0 && (
                            <button
                              onClick={() => setSelectedImageCharacters([])}
                              className="text-[10px] text-white/70 hover:text-white transition-colors"
                            >
                              Clear
                            </button>
                          )}
                        </div>

                        {charactersData?.characters && charactersData.characters.length > 0 ? (
                          <div className="grid grid-cols-6 gap-1 p-1 bg-white/5 rounded">
                            {charactersData.characters.map((char: any) => {
                              const isSelected = selectedImageCharacters.includes(char.id);
                              const selectionIndex = selectedImageCharacters.indexOf(char.id);

                              return (
                                <button
                                  key={char.id}
                                  onClick={() => toggleCharacterSelection(char.id)}
                                  className={`relative h-20 rounded overflow-hidden border transition-all ${
                                    isSelected
                                      ? 'border-purple-500 ring-1 ring-purple-500/50'
                                      : 'border-white/20 hover:border-white/50'
                                  }`}
                                >
                                  <img
                                    src={char.image_url}
                                    alt={char.character_name}
                                    className="w-full h-full object-cover"
                                  />
                                  {isSelected && (
                                    <div className="absolute top-0.5 right-0.5 bg-purple-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                      {selectionIndex + 1}
                                    </div>
                                  )}
                                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-0.5">
                                    <span className="text-[8px] text-white font-medium line-clamp-1">
                                      {char.character_name}
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-3 text-xs text-white/50 bg-white/5 rounded">
                            No characters available
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Prompt Input */}
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder={
                  generationMode === 'text-to-video'
                    ? "Describe your scene..."
                    : imageSource === 'create-frame' && !generatedImageUrl
                    ? "Describe the scene with your characters..."
                    : "Describe how the image should animate..."
                }
                rows={2}
                className="w-full rounded border-0 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/20 resize-none"
              />

              {/* Action Buttons */}
              {!generatedVideoUrl ? (
                <>
                  {/* Show "Generate Frame" button in create-frame mode when no frame exists */}
                  {generationMode === 'image-to-video' && imageSource === 'create-frame' && !generatedImageUrl && (
                    <Button
                      onClick={handleGenerateCharacterFrame}
                      disabled={
                        isGeneratingImage ||
                        !videoDescription.trim() ||
                        selectedImageCharacters.length === 0
                      }
                      size="sm"
                      className="h-10 w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-sm font-medium"
                    >
                      {isGeneratingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Frame...
                        </>
                      ) : (
                        <>
                          <ImageIcon className="h-4 w-4 mr-2" />
                          Generate Frame with Characters
                        </>
                      )}
                    </Button>
                  )}

                  {/* Show "Generate Video" button in other cases */}
                  {(generationMode === 'text-to-video' ||
                    (generationMode === 'image-to-video' && imageSource === 'last-frame') ||
                    (generationMode === 'image-to-video' && imageSource === 'create-frame' && generatedImageUrl)) && (
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={
                        !videoDescription.trim() ||
                        isGeneratingVideo ||
                        (generationMode === 'image-to-video' && imageSource === 'create-frame' && !generatedImageUrl) ||
                        (generationMode === 'image-to-video' && imageSource === 'last-frame' && !extractedFrameUrl)
                      }
                      size="sm"
                      className="h-10 w-full bg-white text-black hover:bg-white/90 text-sm font-medium"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating Video...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate Video
                        </>
                      )}
                    </Button>
                  )}
                </>
              ) : (
                /* Show "Create Event" button when video is generated */
                <Button
                  onClick={() => setShowSaveDialog(true)}
                  disabled={isSavingToContract || contractSaved}
                  size="lg"
                  className="h-12 w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white text-base font-semibold"
                >
                  {isSavingToContract ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Creating Event...
                    </>
                  ) : contractSaved ? (
                    <>
                      <CheckCircle2 className="h-5 w-5 mr-2" />
                      Event Created
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-5 w-5 mr-2" />
                      Create Event
                    </>
                  )}
                </Button>
              )}

              {/* Success Footer */}
              {contractSaved && filecoinSaved && pieceCid && (
                <div className="text-xs text-center text-muted-foreground pt-2 border-t">
                  ✓ Saved to blockchain & Filecoin • CID: {pieceCid.substring(0, 16)}...
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
