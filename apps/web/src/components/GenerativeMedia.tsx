import { useState } from 'react'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { useMutation } from '@tanstack/react-query'
import { trpcClient } from '../utils/trpc'
import { VideoGenerationSelector } from './VideoGenerationSelector'

interface GeneratedContent {
  imageUrl?: string
  videoUrl?: string
  isGenerating: boolean
  error?: string
  generationId?: string
  falVideoUrl?: string
}

export function GenerativeMedia() {
  const [imagePrompt, setImagePrompt] = useState('A simple cartoon drawing of a cute orange cat sitting on grass. Clean, minimal illustration with soft pastel colors.')
  const [videoPrompt, setVideoPrompt] = useState('A cute cat gently swaying in a soft breeze')
  const [content, setContent] = useState<GeneratedContent>({ isGenerating: false })
  const [activeTab, setActiveTab] = useState('generate')

  const generateMutation = useMutation({
    mutationFn: (params: any) => trpcClient.gemini.generateImageAndVideo.mutate(params),
    onSuccess: (data: any) => {
      setContent({
        isGenerating: false,
        imageUrl: data.imageUrl,
        videoUrl: data.videoUrl,
        generationId: data.generationId
      })
      // Switch to video generation tab after image is generated
      if (data.imageUrl) {
        setActiveTab('video-models')
      }
    },
    onError: (error: any) => {
      setContent({
        isGenerating: false,
        error: error.message
      })
    }
  })

  const handleFalVideoGenerated = (videoUrl: string) => {
    setContent(prev => ({
      ...prev,
      falVideoUrl: videoUrl
    }))
  }

  const handleGenerate = async () => {
    setContent({ isGenerating: true })
    
    generateMutation.mutate({
      imagePrompt,
      videoPrompt
    })
  }

  const downloadVideo = async () => {
    if (!content.videoUrl || !content.generationId) return
    
    try {
      const response = await fetch(content.videoUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      
      const a = document.createElement('a')
      a.href = url
      a.download = `${content.generationId}.mp4`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Failed to download video:', error)
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="generate">🎨 Generate First Frame</TabsTrigger>
          <TabsTrigger value="video-models" disabled={!content.imageUrl}>
            🎬 Create Video
          </TabsTrigger>
          <TabsTrigger value="results" disabled={!content.imageUrl && !content.falVideoUrl}>
            📺 Results
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Image Generation</CardTitle>
              <p className="text-sm text-muted-foreground">
                Generate an image with Gemini, then create a video with fal.ai models
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="imagePrompt">Image Prompt</Label>
                <Input
                  id="imagePrompt"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  placeholder="Describe the image you want to generate..."
                  disabled={content.isGenerating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videoPrompt">Video Animation Prompt (for LumaAI)</Label>
                <Input
                  id="videoPrompt"
                  value={videoPrompt}
                  onChange={(e) => setVideoPrompt(e.target.value)}
                  placeholder="Describe how the image should be animated..."
                  disabled={content.isGenerating}
                />
              </div>

              <Button 
                onClick={handleGenerate}
                disabled={content.isGenerating || !imagePrompt.trim() || !videoPrompt.trim()}
                className="w-full"
              >
                {content.isGenerating ? 'Generating...' : 'Generate Image & Video'}
              </Button>

              {content.error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                  <p className="text-destructive text-sm">{content.error}</p>
                </div>
              )}

              {content.isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Generating image and video... This may take a few minutes.
                  </p>
                  <div className="mt-4 text-xs text-muted-foreground space-y-1">
                    <div>1. Generating image with Gemini...</div>
                    <div>2. Uploading image to public storage...</div>
                    <div>3. Creating video with LumaAI...</div>
                  </div>
                </div>
              )}

              {content.imageUrl && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Generated Image</h3>
                    <img 
                      src={content.imageUrl} 
                      alt="Generated image"
                      className="w-full rounded-lg border max-h-96 object-contain"
                    />
                  </div>
                  <div className="text-center">
                    <Button 
                      onClick={() => setActiveTab('video-models')}
                      className="mt-4"
                    >
                      Create Video with fal.ai Models →
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="video-models" className="mt-6">
          {content.imageUrl && (
            <VideoGenerationSelector 
              imageUrl={content.imageUrl}
              onVideoGenerated={handleFalVideoGenerated}
            />
          )}
        </TabsContent>

        <TabsContent value="results" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Media</CardTitle>
              <p className="text-sm text-muted-foreground">Your generated image and videos</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {content.imageUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-2">Generated Image</h3>
                  <img 
                    src={content.imageUrl} 
                    alt="Generated image"
                    className="w-full rounded-lg border max-h-96 object-contain"
                  />
                </div>
              )}

              {content.videoUrl && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-medium">LumaAI Video</h3>
                    <Button 
                      onClick={downloadVideo}
                      variant="outline" 
                      size="sm"
                    >
                      Download
                    </Button>
                  </div>
                  <video 
                    src={content.videoUrl}
                    controls
                    className="w-full rounded-lg border"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}

              {content.falVideoUrl && (
                <div>
                  <h3 className="text-lg font-medium mb-2">fal.ai Generated Video</h3>
                  <video 
                    src={content.falVideoUrl}
                    controls
                    className="w-full rounded-lg border"
                    preload="metadata"
                  >
                    Your browser does not support the video tag.
                  </video>
                  <Button 
                    onClick={() => {
                      const a = document.createElement('a')
                      a.href = content.falVideoUrl!
                      a.download = `fal-video-${Date.now()}.mp4`
                      a.click()
                    }}
                    variant="outline" 
                    className="mt-2 w-full"
                  >
                    Download fal.ai Video
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}