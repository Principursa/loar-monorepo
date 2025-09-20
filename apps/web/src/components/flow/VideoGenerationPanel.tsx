import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Wand2, Video, Sparkles } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { trpcClient } from '@/utils/trpc'
import { VideoGenerationSelector } from '../VideoGenerationSelector'

interface VideoGenerationPanelProps {
  eventId?: string
  timelineId?: string
  universeId?: string
  sceneDescription?: string
  onVideoGenerated?: (videoUrl: string) => void
  onClose?: () => void
}

interface GenerationStep {
  step: 'image' | 'video'
  imageUrl?: string
  videoUrl?: string
  isGenerating: boolean
  error?: string
}

export function VideoGenerationPanel({
  eventId,
  timelineId,
  universeId,
  sceneDescription = '',
  onVideoGenerated,
  onClose
}: VideoGenerationPanelProps) {
  const [step, setStep] = useState<GenerationStep>({ 
    step: 'image', 
    isGenerating: false 
  })
  const [imagePrompt, setImagePrompt] = useState(
    sceneDescription 
      ? `A cinematic scene: ${sceneDescription}. Professional movie-quality, detailed, atmospheric lighting.`
      : 'A cinematic scene with dramatic lighting and atmospheric mood.'
  )
  const [activeTab, setActiveTab] = useState('quick-generate')

  // Image generation with nano-banana
  const imageGenMutation = useMutation({
    mutationFn: (params: any) => trpcClient.fal.generateImage.mutate(params),
    onSuccess: (data: any) => {
      if (data.status === 'completed' && data.imageUrl) {
        setStep({
          step: 'video',
          imageUrl: data.imageUrl,
          isGenerating: false
        })
        setActiveTab('video-generation')
      } else {
        setStep(prev => ({
          ...prev,
          isGenerating: false,
          error: data.error || 'Image generation failed'
        }))
      }
    },
    onError: (error: any) => {
      setStep(prev => ({
        ...prev,
        isGenerating: false,
        error: error.message
      }))
    }
  })

  const handleGenerateImage = () => {
    if (!imagePrompt.trim()) return
    
    setStep({ step: 'image', isGenerating: true })
    
    imageGenMutation.mutate({
      prompt: imagePrompt,
      model: 'fal-ai/nano-banana',
      imageSize: 'landscape_16_9',
      numImages: 1
    })
  }

  const handleVideoGenerated = (videoUrl: string) => {
    setStep(prev => ({
      ...prev,
      videoUrl,
      isGenerating: false
    }))
    onVideoGenerated?.(videoUrl)
  }

  const resetToImageGeneration = () => {
    setStep({ step: 'image', isGenerating: false })
    setActiveTab('quick-generate')
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Video className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Generate Video for Scene</CardTitle>
              {eventId && (
                <Badge variant="outline">Event {eventId}</Badge>
              )}
            </div>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                ✕
              </Button>
            )}
          </div>
          {sceneDescription && (
            <p className="text-sm text-muted-foreground">
              Scene: {sceneDescription}
            </p>
          )}
        </CardHeader>

        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="quick-generate" className="flex items-center gap-2">
                <Wand2 className="h-4 w-4" />
                Generate First Frame
              </TabsTrigger>
              <TabsTrigger 
                value="video-generation" 
                disabled={!step.imageUrl}
                className="flex items-center gap-2"
              >
                <Sparkles className="h-4 w-4" />
                Create Video
              </TabsTrigger>
            </TabsList>

            <TabsContent value="quick-generate" className="mt-6 space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="imagePrompt">Scene Description</Label>
                  <Input
                    id="imagePrompt"
                    value={imagePrompt}
                    onChange={(e) => setImagePrompt(e.target.value)}
                    placeholder="Describe the visual scene you want to create..."
                    disabled={step.isGenerating}
                    className="min-h-[60px]"
                  />
                  <p className="text-xs text-muted-foreground">
                    Tip: Be specific about lighting, mood, camera angle, and visual style
                  </p>
                </div>

                <Button 
                  onClick={handleGenerateImage}
                  disabled={step.isGenerating || !imagePrompt.trim()}
                  className="w-full"
                  size="lg"
                >
                  {step.isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating First Frame...
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4 mr-2" />
                      Generate First Frame
                    </>
                  )}
                </Button>

                {step.error && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-destructive text-sm">{step.error}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={resetToImageGeneration}
                      className="mt-2"
                    >
                      Try Again
                    </Button>
                  </div>
                )}

                {step.imageUrl && (
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Generated First Frame</Label>
                      <img 
                        src={step.imageUrl} 
                        alt="Generated scene" 
                        className="w-full rounded-lg border mt-2 max-h-80 object-cover"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => setActiveTab('video-generation')}
                        className="flex-1"
                      >
                        Create Video →
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={resetToImageGeneration}
                      >
                        Regenerate Frame
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="video-generation" className="mt-6">
              {step.imageUrl && (
                <VideoGenerationSelector 
                  imageUrl={step.imageUrl}
                  onVideoGenerated={handleVideoGenerated}
                />
              )}
            </TabsContent>
          </Tabs>

          {/* Final Result */}
          {step.videoUrl && (
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Video className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">
                  Video Generated Successfully!
                </span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Your video has been generated and can now be used in the timeline.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}