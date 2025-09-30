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
  Wand2
} from "lucide-react";
import { useState } from 'react';

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
  uploadedUrl: string | null;
  isUploading: boolean;
  uploadToTmpfiles: () => void;
  generatedVideoUrl: string | null;
  isGeneratingVideo: boolean;
  videoPrompt: string;
  setVideoPrompt: (prompt: string) => void;
  videoRatio: "16:9" | "9:16" | "1:1";
  setVideoRatio: (ratio: "16:9" | "9:16" | "1:1") => void;
  selectedVideoModel: 'fal-veo3' | 'fal-kling' | 'fal-wan25';
  setSelectedVideoModel: (model: 'fal-veo3' | 'fal-kling' | 'fal-wan25') => void;
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
  imageFormat,
  setImageFormat,
  handleGenerateEventImage,
  showVideoStep,
  uploadedUrl,
  isUploading,
  uploadToTmpfiles,
  generatedVideoUrl,
  isGeneratingVideo,
  videoPrompt,
  setVideoPrompt,
  videoRatio,
  setVideoRatio,
  selectedVideoModel,
  setSelectedVideoModel,
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

          {/* Character Selection Section */}
          <div className="border rounded-lg p-4 bg-muted/20">
            <div className="flex items-center justify-between mb-3">
              <Label className="text-sm font-medium">Characters in Scene</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => setShowCharacterSelector(!showCharacterSelector)}
                  disabled={isLoadingCharacters}
                >
                  <UserPlus className="h-3 w-3 mr-1" />
                  Select
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
                  className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                >
                  <Wand2 className="h-3 w-3 mr-1" />
                  Generate
                </Button>
              </div>
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

          {/* Step 1: Generate Image */}
          {!generatedImageUrl && (
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
                </div>
              </div>

              {/* Negative Prompt for all FAL models */}
              {(selectedVideoModel === 'fal-wan25' || selectedVideoModel === 'fal-kling' || selectedVideoModel === 'fal-veo3') && (
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
                    Generating with {selectedVideoModel === 'fal-veo3' ? 'Veo3 Fast' : selectedVideoModel === 'fal-kling' ? 'Kling 2.5' : 'Wan 2.5'}...
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4 mr-2" />
                    Generate Video with {selectedVideoModel === 'fal-veo3' ? 'Veo3 Fast' : selectedVideoModel === 'fal-kling' ? 'Kling 2.5' : 'Wan 2.5'}
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

          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowVideoDialog(false)}
              className="flex-1"
            >
              Go Back
            </Button>
            <Button
              onClick={handleCreateEvent}
              disabled={!videoTitle.trim()}
              className="flex-1 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Scene
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}