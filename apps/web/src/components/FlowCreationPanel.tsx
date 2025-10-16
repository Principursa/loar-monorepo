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
  Plus,
} from "lucide-react";
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
}

interface VideoSegment {
  id: string;
  videoUrl: string;
  imageUrl?: string;
  prompt: string;
  duration: number;
  model: string;
  order: number;
}

export function FlowCreationPanel({
  showVideoDialog,
  setShowVideoDialog,
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
  const [generationMode, setGenerationMode] = useState<'text-to-video' | 'image-to-video'>('text-to-video');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Multi-segment state
  const [segments, setSegments] = useState<VideoSegment[]>([]);
  const [currentSegmentPrompt, setCurrentSegmentPrompt] = useState("");

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

  // Handle image file upload for image-to-video mode
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    try {
      // Convert to data URL for preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        setUploadedImageUrl(dataUrl);
        setGeneratedImageUrl(dataUrl);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Add segment to queue
  const handleAddSegmentToQueue = () => {
    if (!generatedVideoUrl || !videoDescription) return;

    const newSegment: VideoSegment = {
      id: `seg-${Date.now()}`,
      videoUrl: generatedVideoUrl,
      imageUrl: generatedImageUrl || undefined,
      prompt: videoDescription,
      duration: selectedVideoDuration,
      model: selectedVideoModel,
      order: segments.length,
    };

    setSegments(prev => [...prev, newSegment]);

    // Clear for next segment
    setGeneratedVideoUrl(null);
    setGeneratedImageUrl(null);
    setVideoDescription("");
    setUploadedImageUrl(null);

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
  };

  // Calculate total duration
  const totalDuration = segments.reduce((acc, seg) => acc + seg.duration, 0);

  // Reset when dialog closes
  useEffect(() => {
    if (!showVideoDialog) {
      setExtractedFrameUrl(null);
      setShowSettingsDialog(false);
      setGenerationMode('text-to-video');
      setUploadedImageUrl(null);
      setSegments([]);
      setCurrentSegmentPrompt("");
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
        <div className="max-w-4xl mx-auto px-6 pb-6 pointer-events-auto">
          {/* Status Message - Above the main panel */}
          {statusMessage && (
            <div className="mb-3 animate-in slide-in-from-bottom-2 duration-300">
              <div
                className={`rounded-lg border p-3 bg-background/95 backdrop-blur-sm shadow-lg ${
                  statusMessage.type === 'error' ? 'border-destructive/50' :
                  statusMessage.type === 'success' ? 'border-green-500/50' :
                  statusMessage.type === 'warning' ? 'border-yellow-500/50' :
                  'border-blue-500/50'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5">
                    {statusMessage.type === 'error' && <XCircle className="h-4 w-4 text-destructive" />}
                    {statusMessage.type === 'success' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                    {statusMessage.type === 'warning' && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                    {statusMessage.type === 'info' && <Info className="h-4 w-4 text-blue-500" />}
                  </div>
                  <div className="flex-1 space-y-1">
                    <h4 className={`text-sm font-semibold ${
                      statusMessage.type === 'error' ? 'text-destructive' :
                      statusMessage.type === 'success' ? 'text-green-500' :
                      statusMessage.type === 'warning' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`}>
                      {statusMessage.title}
                    </h4>
                    <p className="text-xs text-muted-foreground whitespace-pre-line">
                      {statusMessage.description}
                    </p>
                    {statusMessage.action && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={statusMessage.action.onClick}
                        className="mt-2 h-7 text-xs"
                      >
                        {statusMessage.action.label}
                      </Button>
                    )}
                  </div>
                  {setStatusMessage && (
                    <button
                      onClick={() => setStatusMessage(null)}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Segment Queue - Show if segments exist */}
          {segments.length > 0 && (
            <Card className="bg-background/95 backdrop-blur-sm shadow-lg border mb-3">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold">Scene Segments</h3>
                    <p className="text-xs text-muted-foreground">
                      {segments.length} segment{segments.length !== 1 ? 's' : ''} • Total: {Math.floor(totalDuration / 60)}:{(totalDuration % 60).toString().padStart(2, '0')}
                    </p>
                  </div>
                  <Button
                    onClick={handleSaveToContract}
                    disabled={isSavingToContract || contractSaved}
                    size="sm"
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
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

                {/* Segment Thumbnails */}
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {segments.map((segment, index) => (
                    <div
                      key={segment.id}
                      className="relative flex-shrink-0 w-32 group"
                    >
                      <div className="aspect-video rounded-lg border-2 border-primary/20 overflow-hidden bg-black">
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
                        {/* Segment number badge */}
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                          {index + 1}
                        </div>
                        {/* Duration badge */}
                        <div className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-xs rounded">
                          {segment.duration}s
                        </div>
                        {/* Remove button */}
                        <button
                          onClick={() => handleRemoveSegment(segment.id)}
                          className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {segment.prompt}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          )}

          {/* Compact Main Panel */}
          <Card className="bg-background/95 backdrop-blur-sm shadow-2xl border">
            <div className="p-4 space-y-3">
              {/* Top Bar: Mode Selector + Model + Settings + Close */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {/* Mode Selector Dropdown (Text to Video / Image to Video) */}
                  <div className="relative">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowModeDropdown(!showModeDropdown)}
                      className="h-8 gap-2 text-sm font-medium border-muted-foreground/20 hover:bg-muted"
                    >
                      {generationMode === 'text-to-video' ? (
                        <Type className="h-4 w-4" />
                      ) : (
                        <ImageIcon className="h-4 w-4" />
                      )}
                      <span>{modeNames[generationMode]}</span>
                      <ChevronDown className="h-3 w-3" />
                    </Button>

                    {/* Dropdown Menu */}
                    {showModeDropdown && (
                      <div className="absolute top-full left-0 mt-1 w-48 bg-background border rounded-md shadow-lg z-50 overflow-hidden">
                        <button
                          onClick={() => {
                            setGenerationMode('text-to-video');
                            setShowModeDropdown(false);
                            setUploadedImageUrl(null);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 ${
                            generationMode === 'text-to-video' ? 'bg-muted font-medium' : ''
                          }`}
                        >
                          <Type className="h-4 w-4" />
                          Text to Video
                        </button>
                        <button
                          onClick={() => {
                            setGenerationMode('image-to-video');
                            setShowModeDropdown(false);
                          }}
                          className={`w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center gap-2 ${
                            generationMode === 'image-to-video' ? 'bg-muted font-medium' : ''
                          }`}
                        >
                          <ImageIcon className="h-4 w-4" />
                          Image to Video
                        </button>
                      </div>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 gap-2 text-sm font-medium"
                    disabled
                  >
                    <Volume2 className="h-4 w-4" />
                    {modelNames[selectedVideoModel]}
                  </Button>
                  <span className="text-xs px-2 py-1 rounded-md bg-muted">×1</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowSettingsDialog(true)}
                    className="h-8 gap-2"
                  >
                    <Settings2 className="h-4 w-4" />
                    Settings
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {additionType === 'branch' ? '🌿 Branch' : '→ Continue'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowVideoDialog(false)}
                  className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Image Selection for Image-to-Video Mode */}
              {generationMode === 'image-to-video' && !uploadedImageUrl && (
                <div className="space-y-3">
                  {/* Character Selector */}
                  {charactersData?.characters && charactersData.characters.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-xs font-medium">Select a Character</Label>
                      <div className="grid grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border rounded-lg bg-muted/20">
                        {charactersData.characters.map((char: any) => (
                          <button
                            key={char.id}
                            onClick={() => {
                              setUploadedImageUrl(char.image_url);
                              setGeneratedImageUrl(char.image_url);
                            }}
                            className="group relative aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-primary transition-colors"
                          >
                            <img
                              src={char.image_url}
                              alt={char.character_name}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <p className="text-xs text-white font-medium text-center px-1">
                                {char.character_name}
                              </p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Divider */}
                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-muted"></div>
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-background px-2 text-muted-foreground">or</span>
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 hover:border-muted-foreground/50 transition-colors">
                    <label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center gap-2">
                      <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      <div className="text-center">
                        <p className="text-sm font-medium">Upload an image</p>
                        <p className="text-xs text-muted-foreground">Click to browse or drag and drop</p>
                      </div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              )}

              {/* Show selected image preview with character name if available */}
              {generationMode === 'image-to-video' && uploadedImageUrl && (
                <div className="space-y-2">
                  {/* Show character name if it's from character library */}
                  {charactersData?.characters && (() => {
                    const selectedChar = charactersData.characters.find((c: any) => c.image_url === uploadedImageUrl);
                    if (selectedChar) {
                      return (
                        <div className="flex items-center gap-2 text-sm">
                          <UserPlus className="h-4 w-4 text-primary" />
                          <span className="font-medium">{selectedChar.character_name}</span>
                          <span className="text-muted-foreground">• {selectedChar.character_style || 'Custom Style'}</span>
                        </div>
                      );
                    }
                  })()}

                  <div className="relative rounded-lg border p-2 bg-muted/30">
                    <img
                      src={uploadedImageUrl}
                      alt="Selected frame"
                      className="w-full rounded border max-h-48 object-contain bg-black"
                    />
                    <button
                      onClick={() => {
                        setUploadedImageUrl(null);
                        setGeneratedImageUrl(null);
                      }}
                      className="absolute top-3 right-3 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Prompt Input */}
              <textarea
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                placeholder={
                  generationMode === 'text-to-video'
                    ? "Generate a video with text..."
                    : "Describe how to animate this image..."
                }
                rows={2}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              />

              {/* Preview Area - Only show for text-to-video mode or when video is generated */}
              {generationMode === 'text-to-video' && (generatedImageUrl || generatedVideoUrl) && (
                <div className="rounded-lg border p-2 bg-muted/30">
                  {generatedVideoUrl ? (
                    <video
                      src={generatedVideoUrl}
                      controls
                      className="w-full rounded border max-h-48 object-contain bg-black"
                    />
                  ) : generatedImageUrl ? (
                    <img
                      src={generatedImageUrl}
                      alt="Generated frame"
                      className="w-full rounded border max-h-48 object-contain bg-black"
                    />
                  ) : null}
                </div>
              )}

              {/* Video preview for image-to-video mode */}
              {generationMode === 'image-to-video' && generatedVideoUrl && (
                <div className="rounded-lg border p-2 bg-muted/30">
                  <video
                    src={generatedVideoUrl}
                    controls
                    className="w-full rounded border max-h-48 object-contain bg-black"
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {/* Only show "Use Last Frame" for text-to-video mode */}
                  {generationMode === 'text-to-video' && previousEventVideoUrl && !generatedImageUrl && (
                    <Button
                      onClick={extractLastFrame}
                      disabled={isExtractingFrame}
                      variant="ghost"
                      size="sm"
                      className="h-9 text-sm"
                    >
                      {isExtractingFrame ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Extracting...
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4 mr-2" />
                          Use Last Frame
                        </>
                      )}
                    </Button>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  {/* Text-to-video workflow: Generate frame first */}
                  {generationMode === 'text-to-video' && !generatedImageUrl && !generatedVideoUrl && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9"
                        disabled
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Expand
                      </Button>
                      <Button
                        onClick={handleGenerateEventImage}
                        disabled={!videoDescription.trim() || isGeneratingImage}
                        size="sm"
                        className="h-9"
                      >
                        {isGeneratingImage ? (
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
                    </>
                  )}

                  {/* Image-to-video workflow: Generate video directly */}
                  {generationMode === 'image-to-video' && uploadedImageUrl && !generatedVideoUrl && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-9"
                        disabled
                      >
                        <Wand2 className="h-4 w-4 mr-2" />
                        Expand
                      </Button>
                      <Button
                        onClick={handleGenerateVideo}
                        disabled={!videoDescription.trim() || isGeneratingVideo}
                        size="sm"
                        className="h-9"
                      >
                        {isGeneratingVideo ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Generating...
                          </>
                        ) : (
                          <>
                            <ArrowRight className="h-4 w-4 mr-2" />
                            Create Video
                          </>
                        )}
                      </Button>
                    </>
                  )}

                  {/* Animate button for text-to-video after frame is generated */}
                  {generationMode === 'text-to-video' && generatedImageUrl && !generatedVideoUrl && (
                    <Button
                      onClick={handleGenerateVideo}
                      disabled={isGeneratingVideo}
                      size="sm"
                      className="h-9 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isGeneratingVideo ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Animating...
                        </>
                      ) : (
                        <>
                          <Film className="h-4 w-4 mr-2" />
                          Animate
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </>
                      )}
                    </Button>
                  )}

                  {/* Add to Scene - available for both modes after video is generated */}
                  {generatedVideoUrl && (
                    <>
                      <Button
                        onClick={handleAddSegmentToQueue}
                        size="sm"
                        variant="outline"
                        className="h-9"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Segment
                      </Button>

                      {/* Only show direct save if no segments in queue */}
                      {segments.length === 0 && (
                        <Button
                          onClick={handleSaveToContract}
                          disabled={isSavingToContract || contractSaved}
                          size="sm"
                          className="h-9 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                        >
                          {isSavingToContract ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              {isSavingToFilecoin ? "Uploading..." : "Saving..."}
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
                      )}
                    </>
                  )}
                </div>
              </div>

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
