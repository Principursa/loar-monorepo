import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Film,
  Plus,
  Sparkles,
  Image,
  Loader2,
  UserPlus,
  Wand2,
  Video,
} from "lucide-react";
import { useState, useRef, useEffect } from 'react';

interface EventCreationSidebarProps {
  showVideoDialog: boolean;
  setShowVideoDialog: (show: boolean) => void;
  videoTitle: string;
  setVideoTitle: (title: string) => void;
  videoDescription: string;
  setVideoDescription: (description: string) => void;
  additionType: 'after' | 'branch';
  selectedCharacters: string[];
  setSelectedCharacters: (chars: string[]) => void;
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
}

export function EventCreationSidebar({
  showVideoDialog,
  setShowVideoDialog,
  videoTitle,
  setVideoTitle,
  videoDescription,
  setVideoDescription,
  additionType,
  selectedCharacters,
  setSelectedCharacters,
  showCharacterSelector,
  setShowCharacterSelector,
  showCharacterGenerator,
  setShowCharacterGenerator,
  charactersData,
  isLoadingCharacters,
  characterName,
  setCharacterName,
  characterDescription,
  setCharacterDescription,
  characterStyle,
  setCharacterStyle,
  isGeneratingCharacter,
  generatedCharacter,
  setGeneratedCharacter,
  generateCharacterMutation,
  saveCharacterMutation,
  generatedImageUrl,
  isGeneratingImage,
  previousEventVideoUrl,
  imageFormat,
  setImageFormat,
  handleGenerateEventImage,
  showVideoStep,
  setShowVideoStep,
  uploadedUrl,
  setUploadedUrl,
  isUploading,
  uploadToTmpfiles,
  generatedVideoUrl,
  setGeneratedImageUrl,
  isGeneratingVideo,
  videoPrompt,
  setVideoPrompt,
  videoRatio,
  setVideoRatio,
  selectedVideoModel,
  setSelectedVideoModel,
  selectedVideoDuration,
  setSelectedVideoDuration,
  negativePrompt,
  setNegativePrompt,
  handleGenerateVideo,
  isSavingToContract,
  contractSaved,
  isSavingToFilecoin,
  filecoinSaved,
  pieceCid,
  handleSaveToContract,
  handleCreateEvent,
}: EventCreationSidebarProps) {
  const [extractedFrameUrl, setExtractedFrameUrl] = useState<string | null>(null);
  const [isExtractingFrame, setIsExtractingFrame] = useState(false);
  const [usePreviousFrame, setUsePreviousFrame] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentStep, setCurrentStep] = useState<'choose-frame' | 'generate-frame' | 'generate-video'>('choose-frame');

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
          // Seek to last frame (duration - 0.1 seconds)
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
        setUsePreviousFrame(true);
      }
    } catch (error) {
      console.error('Error extracting frame:', error);
    } finally {
      setIsExtractingFrame(false);
    }
  };

  // Reset extracted frame and step when dialog closes
  useEffect(() => {
    if (!showVideoDialog) {
      setExtractedFrameUrl(null);
      setUsePreviousFrame(false);
      setCurrentStep('choose-frame');
    }
  }, [showVideoDialog]);

  // Debug: Log previous event video URL
  useEffect(() => {
    console.log('EventCreationSidebar - previousEventVideoUrl:', previousEventVideoUrl);
  }, [previousEventVideoUrl]);

  // Set default duration based on selected model
  useEffect(() => {
    switch (selectedVideoModel) {
      case 'fal-sora':
        if (!selectedVideoDuration || ![4, 8, 12].includes(selectedVideoDuration)) {
          setSelectedVideoDuration(8);
        }
        break;
      case 'fal-kling':
        if (selectedVideoDuration !== 5) {
          setSelectedVideoDuration(5);
        }
        break;
      case 'fal-wan25':
        if (!selectedVideoDuration || ![5, 10].includes(selectedVideoDuration)) {
          setSelectedVideoDuration(5);
        }
        break;
      case 'fal-veo3':
        if (selectedVideoDuration !== 8) {
          setSelectedVideoDuration(8);
        }
        break;
    }
  }, [selectedVideoModel, selectedVideoDuration, setSelectedVideoDuration]);

  if (!showVideoDialog) return null;

  return (
    <div className="w-[500px] border-l bg-gradient-to-br from-card via-card/95 to-card/90 backdrop-blur-sm flex flex-col h-full overflow-hidden shadow-xl">
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
                Create Scene with AI
              </h3>
              <p className="text-sm text-muted-foreground">
                {additionType === 'branch' ? 'Create a new story branch' : 'Continue the timeline'}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVideoDialog(false)}
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              ×
            </Button>
          </div>

          {/* Scene Title */}
          <div>
            <Label htmlFor="video-title">Scene Title</Label>
            <Input
              id="video-title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
              placeholder="Enter scene title"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="video-description">Scene Description</Label>
            <textarea
              id="video-description"
              value={videoDescription}
              onChange={(e) => setVideoDescription(e.target.value)}
              placeholder="Describe what happens in this scene in detail... This will be used to generate the first frame image."
              rows={4}
              className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            />
          </div>

          {/* STEP 1: Choose Frame Source */}
          {currentStep === 'choose-frame' && !generatedImageUrl && !extractedFrameUrl && (
            <div className="border rounded-lg p-4 bg-gradient-to-br from-primary/5 to-primary/10">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground text-base flex items-center justify-center font-bold">1</span>
                <Label className="text-base font-bold">Choose Starting Frame</Label>
              </div>

              <div className="space-y-3">
                {previousEventVideoUrl && (
                  <Button
                    onClick={async () => {
                      await extractLastFrame();
                      setCurrentStep('generate-video');
                    }}
                    disabled={isExtractingFrame}
                    variant="outline"
                    size="lg"
                    className="w-full bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/40 dark:hover:bg-blue-950/60 border-blue-300 dark:border-blue-800 text-blue-700 dark:text-blue-300 h-auto py-4"
                  >
                    <div className="flex flex-col items-center gap-2 w-full">
                      {isExtractingFrame ? (
                        <>
                          <Loader2 className="h-5 w-5 animate-spin" />
                          <span className="font-semibold">Extracting Frame...</span>
                        </>
                      ) : (
                        <>
                          <Video className="h-5 w-5" />
                          <span className="font-semibold">Use Frame from Previous Event</span>
                          <span className="text-xs opacity-70">Extract last frame and continue</span>
                        </>
                      )}
                    </div>
                  </Button>
                )}

                <Button
                  onClick={() => setCurrentStep('generate-frame')}
                  variant="outline"
                  size="lg"
                  className="w-full bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 dark:hover:bg-purple-950/60 border-purple-300 dark:border-purple-800 text-purple-700 dark:text-purple-300 h-auto py-4"
                >
                  <div className="flex flex-col items-center gap-2 w-full">
                    <Sparkles className="h-5 w-5" />
                    <span className="font-semibold">Generate New Frame with AI</span>
                    <span className="text-xs opacity-70">Create custom scene with characters</span>
                  </div>
                </Button>
              </div>
            </div>
          )}

          {/* Show Extracted Frame Preview */}
          {extractedFrameUrl && !generatedImageUrl && (
            <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">✓</span>
                <Label className="text-sm font-medium">Extracted Last Frame</Label>
              </div>
              <img
                src={extractedFrameUrl}
                alt="Extracted last frame"
                className="w-full h-auto object-contain rounded-lg border max-h-48 mb-3"
              />

              {/* Video Generation Section */}
              {!showVideoStep && (
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="video-prompt-extracted" className="text-xs font-medium">
                      Video Prompt (Optional)
                    </Label>
                    <textarea
                      id="video-prompt-extracted"
                      value={videoPrompt}
                      onChange={(e) => setVideoPrompt(e.target.value)}
                      placeholder="Describe the motion/action in the video... Leave empty to use scene description"
                      rows={3}
                      className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-xs ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => {
                        // Set the extracted frame as the generated image so normal flow works
                        setGeneratedImageUrl(extractedFrameUrl);
                        setShowVideoStep(true);
                      }}
                      disabled={isUploading || isGeneratingVideo}
                      className="w-full bg-green-600 hover:bg-green-700 text-white"
                    >
                      <Film className="h-3 w-3 mr-2" />
                      Use This Frame
                    </Button>

                    <Button
                      onClick={() => {
                        setExtractedFrameUrl(null);
                        setUsePreviousFrame(false);
                      }}
                      variant="outline"
                      size="sm"
                      className="w-full"
                    >
                      Clear Frame
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Generate Frame (only shown when in generate-frame step) */}
          {currentStep === 'generate-frame' && !generatedImageUrl && (
            <>
              {/* Character Selection Section */}
              <div className="border rounded-lg p-4 bg-gradient-to-br from-purple/5 to-purple/10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-full bg-purple-600 text-white text-base flex items-center justify-center font-bold">2</span>
                  <Label className="text-base font-bold">Add Characters (Optional)</Label>
                </div>

                <div className="flex gap-2 mb-3">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                    disabled={isLoadingCharacters}
                    className="flex-1"
                  >
                    <UserPlus className="h-3 w-3 mr-1" />
                    Select Existing
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setShowCharacterGenerator(true);
                      setCharacterName('');
                      setCharacterDescription('');
                      setCharacterStyle('cute');
                    }}
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  >
                    <Wand2 className="h-3 w-3 mr-1" />
                    Generate New
                  </Button>
                </div>

            {/* Selected Characters Display */}
            {selectedCharacters.length > 0 && charactersData?.characters && (
              <div className="space-y-2 mb-2">
                {selectedCharacters.map(charId => {
                  const char = charactersData.characters.find((c: any) => c.id === charId);
                  if (!char) return null;
                  return (
                    <div key={charId} className="bg-background p-2 rounded-md border">
                      <div className="flex items-center gap-2 mb-1">
                        <img src={char.image_url} alt={char.character_name} className="w-8 h-8 rounded-full object-cover" />
                        <div className="flex-1">
                          <span className="text-sm font-medium">{char.character_name}</span>
                          <div className="text-xs text-muted-foreground">{char.collection}</div>
                        </div>
                        <button
                          onClick={() => setSelectedCharacters(prev => prev.filter(id => id !== charId))}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Character Selector Dropdown */}
            {showCharacterSelector && charactersData?.characters && (
              <div className="mt-2 max-h-48 overflow-y-auto border rounded-md bg-background">
                {charactersData.characters.map((character: any) => (
                  <div
                    key={character.id}
                    onClick={() => {
                      if (!selectedCharacters.includes(character.id)) {
                        setSelectedCharacters(prev => [...prev, character.id]);
                      }
                      setShowCharacterSelector(false);
                    }}
                    className="p-2 hover:bg-muted cursor-pointer flex items-center gap-2"
                  >
                    <img src={character.image_url} alt={character.character_name} className="w-8 h-8 rounded object-cover" />
                    <div className="flex-1">
                      <div className="text-sm font-medium">{character.character_name}</div>
                      <div className="text-xs text-muted-foreground">{character.collection}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {selectedCharacters.length === 0 && (
              <p className="text-xs text-muted-foreground">
                Add characters to include them in the generated scene
              </p>
            )}
          </div>

          {showCharacterGenerator && (
            <div className="border rounded-lg p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
              <div className="flex items-center justify-between mb-3">
                <Label className="text-sm font-medium">Generate New Character</Label>
                <button
                  onClick={() => {
                    setShowCharacterGenerator(false);
                    setGeneratedCharacter(null);
                  }}
                  className="text-muted-foreground hover:text-destructive"
                >
                  ×
                </button>
              </div>

              {!generatedCharacter ? (
                <>
                  <div className="space-y-3 mb-3">
                    <div>
                      <Label htmlFor="character-name" className="text-xs">Character Name</Label>
                      <Input
                        id="character-name"
                        value={characterName}
                        onChange={(e) => setCharacterName(e.target.value)}
                        placeholder="Enter character name"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="character-description" className="text-xs">Character Description</Label>
                      <textarea
                        id="character-description"
                        value={characterDescription}
                        onChange={(e) => setCharacterDescription(e.target.value)}
                        placeholder="Describe the character's appearance, personality, and traits..."
                        rows={3}
                        className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                    </div>

                    <div>
                      <Label className="text-xs">Art Style</Label>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        {(['cute', 'realistic', 'anime', 'fantasy', 'cyberpunk'] as const).map((style) => (
                          <button
                            key={style}
                            type="button"
                            onClick={() => setCharacterStyle(style)}
                            className={`px-3 py-2 text-sm rounded-md border transition-colors capitalize ${characterStyle === style
                                ? "border-primary bg-primary text-primary-foreground"
                                : "border-input bg-background hover:bg-muted"
                              }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={async () => {
                      if (characterName.trim() && characterDescription.trim()) {
                        try {
                          await generateCharacterMutation.mutateAsync({
                            name: characterName,
                            description: characterDescription,
                            style: characterStyle
                          });
                        } catch (error) {
                          console.error('Character generation error:', error);
                        }
                      }
                    }}
                    disabled={!characterName.trim() || !characterDescription.trim() || isGeneratingCharacter || generateCharacterMutation.isPending}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                  >
                    {(isGeneratingCharacter || generateCharacterMutation.isPending) ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating Character...
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4 mr-2" />
                        Generate Character
                      </>
                    )}
                  </Button>
                </>
              ) : (
                <div className="space-y-3">
                  <div className="border rounded-lg p-3 bg-background">
                    <img
                      src={generatedCharacter.imageUrl}
                      alt={generatedCharacter.name}
                      className="w-full h-auto object-contain rounded-lg mb-2 max-h-96"
                    />
                    <div className="text-sm font-medium">{generatedCharacter.name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{generatedCharacter.style}</div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => {
                        saveCharacterMutation.mutate();
                      }}
                      disabled={saveCharacterMutation.isPending}
                      className="flex-1"
                    >
                      {saveCharacterMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4 mr-2" />
                          Save & Use
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={() => setGeneratedCharacter(null)}
                      variant="outline"
                      className="flex-1"
                    >
                      Regenerate
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
            </>
          )}

          {/* Step 1: Generate Image */}
          {currentStep === 'generate-frame' && !generatedImageUrl && !extractedFrameUrl && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">1</span>
                <Label className="text-sm font-medium">
                  {selectedCharacters.length > 0 ? 'Edit Characters into Scene' : 'Generate First Frame'}
                </Label>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {selectedCharacters.length > 0
                  ? `Generate cinematic frame with ${selectedCharacters.length} character(s) using Qwen image-edit-plus`
                  : 'Generate cinematic frame using Qwen image-edit-plus enhancement'
                }
              </p>

              {/* Image Format Selection - Removed square options */}
              <div className="mb-3">
                <Label className="text-xs font-medium text-muted-foreground">Image Format</Label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setImageFormat('landscape_16_9')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${imageFormat === 'landscape_16_9'
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageFormat('portrait_16_9')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${imageFormat === 'portrait_16_9'
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    9:16 Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageFormat('landscape_4_3')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${imageFormat === 'landscape_4_3'
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    4:3 Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageFormat('portrait_4_3')}
                    className={`px-3 py-2 text-sm rounded-md border transition-colors ${imageFormat === 'portrait_4_3'
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    3:4 Portrait
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Button
                  onClick={handleGenerateEventImage}
                  disabled={!videoDescription.trim() || isGeneratingImage}
                  className="w-full"
                  variant="secondary"
                >
                  {isGeneratingImage ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {selectedCharacters.length > 0 ? 'Editing Characters...' : 'Generating Image...'}
                    </>
                  ) : (
                    <>
                      {selectedCharacters.length > 0 ? (
                        <>
                          <Wand2 className="h-4 w-4 mr-2" />
                          Edit Characters into Scene
                        </>
                      ) : (
                        <>
                          <Image className="h-4 w-4 mr-2" />
                          Generate First Frame
                        </>
                      )}
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Show Generated Image */}
          {generatedImageUrl && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">✓</span>
                <Label className="text-sm font-medium">First Frame Generated</Label>
              </div>
              <img
                src={generatedImageUrl}
                alt="Generated first frame"
                className="w-full h-auto object-contain rounded-lg border max-h-64"
              />

              {/* Upload to tmpfiles.org */}
              <div className="mt-3 space-y-2">
                <Button
                  onClick={uploadToTmpfiles}
                  disabled={isUploading}
                  variant="outline"
                  size="sm"
                  className="w-full"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      Uploading to tmpfiles.org...
                    </>
                  ) : (
                    <>
                      <Image className="h-3 w-3 mr-2" />
                      Upload to tmpfiles.org
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Generate Video */}
          {showVideoStep && !generatedVideoUrl && (
            <div className="border rounded-lg p-4 bg-muted/20">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center">2</span>
                <Label className="text-sm font-medium">Generate Video with AI</Label>
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                Create a video animation from the generated image
              </p>

              {/* Video Prompt */}
              <div className="mb-3">
                <Label htmlFor="video-prompt" className="text-xs font-medium text-muted-foreground">
                  Video Animation Prompt (optional)
                </Label>
                <textarea
                  id="video-prompt"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe how the scene should be animated (e.g., camera slowly moves closer, character looks around, wind blowing gently)..."
                  rows={2}
                  className="mt-1 flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Leave empty to use the scene description as animation prompt
                </p>
              </div>

              {/* Video Ratio */}
              <div className="mb-3">
                <Label className="text-xs font-medium text-muted-foreground">Video Aspect Ratio</Label>
                <div className="flex gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setVideoRatio("16:9")}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${videoRatio === "16:9"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    16:9 Landscape
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoRatio("9:16")}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${videoRatio === "9:16"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    9:16 Portrait
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoRatio("1:1")}
                    className={`flex-1 px-3 py-2 text-sm rounded-md border transition-colors ${videoRatio === "1:1"
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-input bg-background hover:bg-muted"
                      }`}
                  >
                    1:1 Square
                  </button>
                </div>
              </div>

              {/* Model Selection */}
              <div className="mb-3">
                <Label className="text-xs font-medium text-muted-foreground">Video Generation Model</Label>
                <div className="grid grid-cols-1 gap-2 mt-1">
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fal-veo3"
                      name="videoModel"
                      value="fal-veo3"
                      checked={selectedVideoModel === 'fal-veo3'}
                      onChange={(e) => setSelectedVideoModel(e.target.value as any)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="fal-veo3" className="text-sm">
                      <span className="font-medium">Veo3 Fast</span>
                      <span className="text-muted-foreground ml-1">(Fast, good quality)</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fal-kling"
                      name="videoModel"
                      value="fal-kling"
                      checked={selectedVideoModel === 'fal-kling'}
                      onChange={(e) => setSelectedVideoModel(e.target.value as any)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="fal-kling" className="text-sm">
                      <span className="font-medium">Kling 2.5</span>
                      <span className="text-muted-foreground ml-1">(High quality, slower)</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fal-wan25"
                      name="videoModel"
                      value="fal-wan25"
                      checked={selectedVideoModel === 'fal-wan25'}
                      onChange={(e) => setSelectedVideoModel(e.target.value as any)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="fal-wan25" className="text-sm">
                      <span className="font-medium">Wan 2.5</span>
                      <span className="text-muted-foreground ml-1">(Premium, best quality)</span>
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="radio"
                      id="fal-sora"
                      name="videoModel"
                      value="fal-sora"
                      checked={selectedVideoModel === 'fal-sora'}
                      onChange={(e) => setSelectedVideoModel(e.target.value as any)}
                      className="w-4 h-4 text-primary"
                    />
                    <label htmlFor="fal-sora" className="text-sm">
                      <span className="font-medium">OpenAI Sora 2</span>
                      <span className="text-muted-foreground ml-1">(State-of-the-art, image-to-video)</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Video Duration Selection */}
              <div className="mb-3">
                <Label className="text-xs font-medium text-muted-foreground">Video Duration</Label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  {selectedVideoModel === 'fal-sora' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedVideoDuration(4)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 4
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                          }`}
                      >
                        4 seconds
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVideoDuration(8)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 8
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                          }`}
                      >
                        8 seconds
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVideoDuration(12)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 12
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                          }`}
                      >
                        12 seconds
                      </button>
                    </>
                  )}

                  {selectedVideoModel === 'fal-kling' && (
                    <button
                      type="button"
                      onClick={() => setSelectedVideoDuration(5)}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 5
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-muted"
                        }`}
                    >
                      5 seconds
                    </button>
                  )}

                  {selectedVideoModel === 'fal-wan25' && (
                    <>
                      <button
                        type="button"
                        onClick={() => setSelectedVideoDuration(5)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 5
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                          }`}
                      >
                        5 seconds
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedVideoDuration(10)}
                        className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 10
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-input bg-background hover:bg-muted"
                          }`}
                      >
                        10 seconds
                      </button>
                    </>
                  )}

                  {selectedVideoModel === 'fal-veo3' && (
                    <button
                      type="button"
                      onClick={() => setSelectedVideoDuration(8)}
                      className={`px-3 py-2 text-sm rounded-md border transition-colors ${selectedVideoDuration === 8
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-input bg-background hover:bg-muted"
                        }`}
                    >
                      8 seconds
                    </button>
                  )}
                </div>
              </div>

              {/* Negative Prompt for all FAL models */}
              {(selectedVideoModel === 'fal-wan25' || selectedVideoModel === 'fal-kling' || selectedVideoModel === 'fal-veo3' || selectedVideoModel === 'fal-sora') && (
                <div className="mb-3">
                  <Label htmlFor="negative-prompt" className="text-xs font-medium text-muted-foreground">
                    Negative Prompt (optional)
                  </Label>
                  <Input
                    id="negative-prompt"
                    value={negativePrompt}
                    onChange={(e) => setNegativePrompt(e.target.value)}
                    placeholder="What to avoid in the video (e.g., low quality, blurry)"
                    className="mt-1 text-sm"
                  />
                </div>
              )}

              <Button
                onClick={handleGenerateVideo}
                disabled={isGeneratingVideo}
                className="w-full"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating with {selectedVideoModel === 'fal-veo3' ? 'Veo3 Fast' : selectedVideoModel === 'fal-kling' ? 'Kling 2.5' : selectedVideoModel === 'fal-sora' ? 'Sora 2' : 'Wan 2.5'}...
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4 mr-2" />
                    Generate Video with {selectedVideoModel === 'fal-veo3' ? 'Veo3 Fast' : selectedVideoModel === 'fal-kling' ? 'Kling 2.5' : selectedVideoModel === 'fal-sora' ? 'Sora 2' : 'Wan 2.5'}
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Show Generated Video */}
          {generatedVideoUrl && (
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6 h-6 rounded-full bg-green-500 text-white text-sm flex items-center justify-center">✓</span>
                <Label className="text-sm font-medium">Video Generated</Label>
              </div>
              {generatedVideoUrl === "placeholder-video-url" ? (
                <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Video preview placeholder</p>
                </div>
              ) : (
                <video
                  key={generatedVideoUrl} // Force re-render when URL changes
                  src={generatedVideoUrl}
                  controls
                  className="w-full rounded-lg border"
                  onError={(e) => {
                    console.error("Video playback error:", e);
                    console.error("Failed URL:", generatedVideoUrl);
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              )}

              {/* Save to Contract */}
              <div className="mt-3 space-y-2">
                <Button
                  onClick={handleSaveToContract}
                  disabled={isSavingToContract || contractSaved}
                  variant={contractSaved ? "secondary" : "default"}
                  size="sm"
                  className="w-full"
                >
                  {isSavingToContract ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                      {isSavingToFilecoin ? "Uploading to Filecoin..." : "Saving to Blockchain..."}
                    </>
                  ) : contractSaved ? (
                    <>
                      <span className="text-green-600">✓</span>
                      <span className="ml-2">Saved to Timeline & Filecoin</span>
                    </>
                  ) : (
                    <>
                      <Film className="h-3 w-3 mr-2" />
                      Save to Timeline & Filecoin
                    </>
                  )}
                </Button>

                {contractSaved && (
                  <div className="p-2 bg-green-50 border border-green-200 rounded text-xs">
                    <div className="text-green-700 font-medium">
                      ✅ Successfully saved to universe timeline{filecoinSaved ? " and Filecoin" : ""}!
                    </div>
                    {filecoinSaved && pieceCid && (
                      <div className="text-blue-600 mt-1">
                        Filecoin PieceCID: <code className="bg-blue-100 px-1 rounded text-xs">{pieceCid}</code>
                      </div>
                    )}
                    <div className="text-green-600 mt-1">
                      Your scene is now part of the universe timeline{filecoinSaved ? " with permanent decentralized storage" : ""} and will be visible to all users.
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}