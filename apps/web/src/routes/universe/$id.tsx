import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect, useCallback } from "react";
import { useAccount } from "wagmi";
import { usePonderQuery } from "@ponder/react";
import { desc, eq } from "@ponder/client";
import { universe, token, node, nodeContent } from "../../../../indexer/ponder.schema";
import { Play, Plus, ArrowLeft, RefreshCw, Video, Sparkles } from "lucide-react";
import { useUniverse } from "@/hooks/useUniverse";
import { FlowCreationPanel } from "@/components/FlowCreationPanel";
import { trpcClient } from "@/utils/trpc";
import { useMutation, useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/universe/$id")({
  component: UniverseDetailPage,
});

function UniverseDetailPage() {
  const { id: universeAddress } = Route.useParams();
  const { isConnected, address } = useAccount();

  // FlowCreationPanel state
  const [showVideoDialog, setShowVideoDialog] = useState(false);
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showCharacterGenerator, setShowCharacterGenerator] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [characterDescription, setCharacterDescription] = useState("");
  const [characterStyle, setCharacterStyle] = useState<'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'>('realistic');
  const [isGeneratingCharacter, setIsGeneratingCharacter] = useState(false);
  const [generatedCharacter, setGeneratedCharacter] = useState<any>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [imageFormat, setImageFormat] = useState<'landscape_16_9' | 'portrait_16_9' | 'landscape_4_3' | 'portrait_4_3'>('landscape_16_9');
  const [showVideoStep, setShowVideoStep] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoRatio, setVideoRatio] = useState<"16:9" | "9:16" | "1:1">("16:9");
  const [selectedVideoModel, setSelectedVideoModel] = useState<'fal-veo3' | 'fal-kling' | 'fal-wan25' | 'fal-sora'>('fal-veo3');
  const [selectedVideoDuration, setSelectedVideoDuration] = useState(8);
  const [negativePrompt, setNegativePrompt] = useState("");
  const [isSavingToContract, setIsSavingToContract] = useState(false);
  const [contractSaved, setContractSaved] = useState(false);
  const [isSavingToFilecoin, setIsSavingToFilecoin] = useState(false);
  const [filecoinSaved, setFilecoinSaved] = useState(false);
  const [pieceCid, setPieceCid] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<any>(null);
  const [selectedImageCharacters, setSelectedImageCharacters] = useState<string[]>([]);
  const [selectedNodeForBranch, setSelectedNodeForBranch] = useState<bigint>(BigInt(0));
  const [isPolling, setIsPolling] = useState(false);

  // Query universe data from Ponder
  const { data: universeData, isLoading: isLoadingUniverse } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(universe as any)
        .where(eq((universe as any).id, universeAddress.toLowerCase()))
        .limit(1),
  });

  // Query token data
  const { data: tokenData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(token as any)
        .where(eq((token as any).universeAddress, universeAddress.toLowerCase()))
        .limit(1),
  });

  // Query nodes for this universe
  const { data: nodesData, isLoading: isLoadingNodes, refetch: refetchNodes } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(node as any)
        .where(eq((node as any).universeAddress, universeAddress.toLowerCase()))
        .orderBy(desc((node as any).createdAt)),
  });

  // Query node content
  const { data: nodeContentData } = usePonderQuery({
    queryFn: (db) =>
      db
        .select()
        .from(nodeContent as any),
  });

  // Combine nodes with their content
  const nodes = useMemo(() => {
    if (!nodesData || !nodeContentData) return [];

    type NodeRow = typeof node.$inferSelect;
    type NodeContentRow = typeof nodeContent.$inferSelect;

    const contentMap = new Map<string, NodeContentRow>();
    (nodeContentData as NodeContentRow[]).forEach((c) => {
      contentMap.set(c.id, c);
    });

    return (nodesData as NodeRow[]).map((n) => {
      const content = contentMap.get(`${n.universeAddress.toLowerCase()}:${n.nodeId}`);
      return {
        ...n,
        content,
      };
    });
  }, [nodesData, nodeContentData]);

  const universeInfo = universeData && universeData.length > 0 ? universeData[0] : null;
  const tokenInfo = tokenData && tokenData.length > 0 ? tokenData[0] : null;

  // Universe hooks - read metadata directly from contract
  const {
    createNode,
    useName,
    useDescription,
    useImageURL,
    isPending: isCreatingNodeTx,
    isSuccess: nodeCreated
  } = useUniverse(universeAddress as `0x${string}`);

  // Read universe metadata from contract
  const { data: universeName } = useName();
  const { data: universeDescription } = useDescription();
  const { data: universeImageURL } = useImageURL();

  // Fetch available characters
  const { data: charactersData, isLoading: isLoadingCharacters, refetch: refetchCharacters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => trpcClient.wiki.characters.query(),
  });

  // Character generation mutations
  const generateCharacterMutation = useMutation({
    mutationFn: async (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'; saveToDatabase?: boolean }) => {
      const result = await trpcClient.fal.generateCharacter.mutate({
        ...input,
        saveToDatabase: input.saveToDatabase ?? false
      });
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character generated:', data);
      setIsGeneratingCharacter(false);

      setGeneratedCharacter({
        name: characterName,
        description: characterDescription,
        style: characterStyle,
        imageUrl: data.imageUrl
      });
    },
    onError: (error) => {
      console.error('Character generation failed:', error);
      setStatusMessage({
        type: 'error',
        title: 'Generation Failed',
        description: 'Failed to generate character. Please try again.'
      });
      setIsGeneratingCharacter(false);
    }
  });

  const analyzeCharacterMutation = useMutation({
    mutationFn: async (input: { imageUrl: string; characterName: string; userDescription: string }) => {
      const result = await trpcClient.fal.analyzeCharacter.mutate(input);
      return result;
    },
  });

  const saveCharacterMutation = useMutation({
    mutationFn: async (input: {
      name: string;
      description: string;
      imageUrl: string;
      style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk';
      detailedVisualDescription?: string;
    }) => {
      const result = await trpcClient.fal.saveCharacter.mutate(input);
      return result;
    },
    onSuccess: async (data) => {
      console.log('Character saved to database:', data);

      if (data.characterId) {
        setSelectedCharacters(prev => [...prev, data.characterId!]);
      }

      setGeneratedCharacter(null);
      setShowCharacterGenerator(false);

      await refetchCharacters();
    },
    onError: (error) => {
      console.error('Failed to save character:', error);
      setStatusMessage({
        type: 'error',
        title: 'Save Failed',
        description: 'Failed to save character to database. Please try again.'
      });
    }
  });

  // Image generation mutation
  const generateImageMutation = useMutation({
    mutationFn: async (prompt: string) => {
      // Check if we have selected characters to edit into the scene
      if (selectedCharacters.length > 0 && charactersData?.characters) {
        const selectedChars = charactersData.characters.filter((c: any) => selectedCharacters.includes(c.id));

        if (selectedChars.length > 0) {
          const characterNames = selectedChars.map((c: any) => c.character_name).join(' and ');
          const editPrompt = `${characterNames} ${prompt}, cinematic scene, high quality, detailed environment`;

          const processedImageUrls = selectedChars
            .filter((char: any) => char.image_url && char.image_url.trim())
            .map((char: any) => char.image_url);

          if (processedImageUrls.length === 0) {
            throw new Error('No valid character images found for editing');
          }

          console.log('🎭 Generating character frame with nano-banana');

          const result = await trpcClient.fal.imageToImage.mutate({
            prompt: `Create a cinematic frame: ${editPrompt}. Professional photography, detailed environment, high quality composition`,
            imageUrls: processedImageUrls,
            imageSize: imageFormat,
            numImages: 1,
          });

          if (result.status !== 'completed' || !result.imageUrl) {
            throw new Error(result.error || 'Nano Banana frame generation failed');
          }

          return { success: true, imageUrl: result.imageUrl };
        }
      }

      // For scenes without characters, generate directly
      console.log('🎨 Generating scene without characters');

      const result = await trpcClient.fal.generateImage.mutate({
        prompt: `${prompt}, cinematic scene, high quality, detailed environment, professional photography, dramatic lighting`,
        model: 'fal-ai/nano-banana',
        imageSize: imageFormat,
        numImages: 1
      });

      if (result.status !== 'completed' || !result.imageUrl) {
        throw new Error(result.error || 'Failed to generate scene image');
      }

      return { success: true, imageUrl: result.imageUrl };
    },
    onSuccess: (data) => {
      if (data.imageUrl) {
        setGeneratedImageUrl(data.imageUrl);
        setShowVideoStep(true);

        setStatusMessage({
          type: 'success',
          title: 'Image Generated Successfully!',
          description: 'Your scene image has been generated. Now you can create a video animation from it.',
        });
      }
    },
    onError: (error) => {
      console.error("Error generating image:", error);

      setStatusMessage({
        type: 'error',
        title: 'Image Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate image. Please try again.'
      });
    }
  });

  // Handle image generation
  const handleGenerateEventImage = useCallback(async () => {
    if (!videoDescription.trim()) return;

    setStatusMessage(null);
    setIsGeneratingImage(true);
    try {
      await generateImageMutation.mutateAsync(videoDescription);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsGeneratingImage(false);
    }
  }, [videoDescription, generateImageMutation]);

  // Handle character frame generation
  const handleGenerateCharacterFrame = useCallback(async () => {
    if (!videoDescription.trim() || selectedImageCharacters.length === 0) return;

    setStatusMessage(null);
    setIsGeneratingImage(true);

    try {
      const selectedChars = charactersData?.characters?.filter((c: any) =>
        selectedImageCharacters.includes(c.id)
      ) || [];

      if (selectedChars.length === 0) {
        setStatusMessage({
          type: 'error',
          title: 'No Characters Found',
          description: 'Please select valid characters.',
        });
        return;
      }

      const characterNames = selectedChars.map((c: any) => c.character_name).join(' and ');
      const characterImageUrls = selectedChars
        .filter((char: any) => char.image_url && char.image_url.trim())
        .map((char: any) => char.image_url);

      if (characterImageUrls.length === 0) {
        setStatusMessage({
          type: 'error',
          title: 'No Character Images',
          description: 'Selected characters have no valid images.',
        });
        return;
      }

      setStatusMessage({
        type: 'info',
        title: 'Generating Character Frame',
        description: 'Creating frame with nano-banana...',
      });

      const editPrompt = `${characterNames} ${videoDescription}, cinematic scene, high quality, detailed environment`;

      const result = await trpcClient.fal.imageToImage.mutate({
        prompt: `Create a cinematic frame: ${editPrompt}. Professional photography, detailed environment, high quality composition`,
        imageUrls: characterImageUrls,
        imageSize: imageFormat,
        numImages: 1,
      });

      if (result.status !== 'completed' || !result.imageUrl) {
        throw new Error(result.error || 'Character frame generation failed');
      }

      setGeneratedImageUrl(result.imageUrl);

      setStatusMessage({
        type: 'success',
        title: 'Frame Generated!',
        description: 'Your character frame is ready. Now you can generate a video from it.',
      });
    } catch (error) {
      console.error('Character frame generation failed:', error);
      setStatusMessage({
        type: 'error',
        title: 'Frame Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate character frame. Please try again.',
      });
    } finally {
      setIsGeneratingImage(false);
    }
  }, [videoDescription, selectedImageCharacters, charactersData, imageFormat]);

  // Video generation mutation
  const generateVideoMutation = useMutation({
    mutationFn: async ({ imageUrl, prompt }: { imageUrl: string; prompt?: string }) => {
      const finalPrompt = videoPrompt.trim() || prompt || videoDescription;

      if (selectedVideoModel === 'fal-veo3') {
        const result = await trpcClient.fal.generateVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          model: "fal-ai/veo3.1/fast/image-to-video",
          duration: selectedVideoDuration,
          aspectRatio: videoRatio,
          motionStrength: 127,
          negativePrompt: negativePrompt || undefined
        });
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-kling') {
        const result = await trpcClient.fal.klingVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 5 || selectedVideoDuration === 10) ? selectedVideoDuration : 5,
          aspectRatio: videoRatio,
          negativePrompt: negativePrompt || undefined,
          cfgScale: 0.5
        });
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-wan25') {
        const result = await trpcClient.fal.wan25ImageToVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 5 || selectedVideoDuration === 10) ? selectedVideoDuration : 5,
          resolution: "1080p",
          negativePrompt: negativePrompt || undefined,
          enablePromptExpansion: true
        });
        return { videoUrl: result.videoUrl };
      } else if (selectedVideoModel === 'fal-sora') {
        const result = await trpcClient.fal.soraImageToVideo.mutate({
          prompt: finalPrompt,
          imageUrl,
          duration: (selectedVideoDuration === 4 || selectedVideoDuration === 8 || selectedVideoDuration === 12) ? selectedVideoDuration : 4,
          aspectRatio: videoRatio === "1:1" ? "auto" : videoRatio,
          resolution: "auto",
        });
        return { videoUrl: result.videoUrl };
      }

      throw new Error('Invalid video model selected');
    },
    onSuccess: (data) => {
      if (data.videoUrl) {
        setGeneratedVideoUrl(data.videoUrl);

        const modelNames: Record<string, string> = {
          'fal-veo3': 'Veo3',
          'fal-kling': 'Kling 2.5',
          'fal-wan25': 'Wan 2.5',
          'fal-sora': 'Sora 2'
        };
        const modelName = modelNames[selectedVideoModel] || 'Video';

        setStatusMessage({
          type: 'success',
          title: 'Video Generated Successfully!',
          description: `Your ${modelName} video animation has been created. You can now save it to the timeline.`,
        });
      }
    },
    onError: (error) => {
      console.error("Error generating video:", error);

      let errorMessage = "Failed to generate video. Please try again.";
      let errorTitle = "Video Generation Failed";
      let errorDescription = "";

      if (error instanceof Error) {
        errorMessage = error.message;

        if (errorMessage.toLowerCase().includes('content checker') ||
            errorMessage.toLowerCase().includes('flagged')) {
          errorTitle = "Content Check Failed";

          if (selectedVideoModel === 'fal-sora') {
            errorDescription = `OpenAI Sora has detected content that violates its usage policies. Try switching to Veo3, Kling 2.5, or Wan 2.5.`;
          } else {
            errorDescription = "The AI service detected content that violates its usage policies. Try using different characters or switching to another video model.";
          }
        } else {
          errorDescription = errorMessage;
        }
      }

      setStatusMessage({
        type: 'error',
        title: errorTitle,
        description: errorDescription,
      });
    }
  });

  // Handle video generation
  const handleGenerateVideo = useCallback(async () => {
    setStatusMessage(null);
    setIsGeneratingVideo(true);

    try {
      const hasImage = uploadedUrl || generatedImageUrl;
      const isTextToVideo = !hasImage;

      if (isTextToVideo) {
        // Text-to-video mode
        const modelMap: Record<string, string> = {
          'fal-veo3': 'fal-ai/veo3.1/fast',
          'fal-sora': 'fal-ai/sora-2/text-to-video',
          'fal-kling': 'fal-ai/kling-video/v2.5-turbo/pro/text-to-video',
          'fal-wan25': 'fal-ai/wan-25-preview/text-to-video'
        };

        const textToVideoModel = modelMap[selectedVideoModel] || 'fal-ai/veo3.1/fast';

        const result = await trpcClient.fal.generateVideo.mutate({
          prompt: videoDescription,
          model: textToVideoModel,
          duration: selectedVideoDuration,
          aspectRatio: videoRatio,
          negativePrompt: negativePrompt || undefined
        });

        if (result.videoUrl) {
          setGeneratedVideoUrl(result.videoUrl);
          setStatusMessage({
            type: 'success',
            title: 'Video Generated Successfully!',
            description: 'Your video has been created. You can now save it to the timeline.',
          });
        }
      } else {
        // Image-to-video mode
        const imageUrlToUse = uploadedUrl || generatedImageUrl;

        await generateVideoMutation.mutateAsync({
          imageUrl: imageUrlToUse!,
          prompt: `Animate this scene: ${videoDescription}`
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage({
        type: 'error',
        title: 'Generation Failed',
        description: error instanceof Error ? error.message : 'Failed to generate video',
      });
    } finally {
      setIsGeneratingVideo(false);
    }
  }, [generatedImageUrl, uploadedUrl, videoDescription, generateVideoMutation, selectedVideoModel, selectedVideoDuration, videoRatio, negativePrompt]);

  // Upload to tmpfiles
  const uploadToTmpfiles = useCallback(async () => {
    if (!generatedImageUrl) return;

    setIsUploading(true);
    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();

      const formData = new FormData();
      formData.append('file', blob, 'generated-image.png');

      const uploadResponse = await fetch('https://tmpfiles.org/api/v1/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const result = await uploadResponse.json();
        if (result?.status === 'success') {
          const fileUrl = result.data.url;
          const directUrl = fileUrl.replace('tmpfiles.org/', 'tmpfiles.org/dl/');
          setUploadedUrl(directUrl);
          console.log('✅ Image uploaded to tmpfiles.org:', directUrl);
        } else {
          throw new Error('Upload failed');
        }
      } else {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }
    } catch (error) {
      console.error('Error uploading to tmpfiles.org:', error);
      setStatusMessage({
        type: 'error',
        title: 'Upload Failed',
        description: 'Failed to upload image. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  }, [generatedImageUrl]);

  // Save to contract
  const handleSaveToContract = useCallback(async () => {
    if (!generatedVideoUrl || !videoDescription) {
      setStatusMessage({
        type: 'error',
        title: 'Missing Information',
        description: 'Please provide a video URL and description.'
      });
      return;
    }

    setIsSavingToContract(true);
    setIsSavingToFilecoin(true);

    try {
      // Step 1: Upload to MinIO
      console.log('Uploading video to MinIO...');
      let minioUrl: string | null = null;
      let minioKey: string | null = null;

      try {
        const uuid = crypto.randomUUID();
        const minioResult = await trpcClient.minio.uploadFromUrl.mutate({
          url: generatedVideoUrl,
          filename: `${uuid}.mp4`
        });

        console.log('MinIO upload successful:', minioResult);
        minioKey = minioResult.key;
        minioUrl = minioResult.url;
        setPieceCid(minioResult.key);
        setFilecoinSaved(true);
      } catch (minioError) {
        console.error('MinIO upload failed:', minioError);
      }

      setIsSavingToFilecoin(false);

      // Step 2: Save to blockchain
      const videoUrlForContract = minioUrl || generatedVideoUrl;

      console.log('Saving to contract:', {
        link: videoUrlForContract,
        plot: videoDescription,
        previous: selectedNodeForBranch,
      });

      await createNode({
        link: videoUrlForContract,
        plot: videoDescription,
        previousNodeId: selectedNodeForBranch,
      });

      setContractSaved(true);
      setStatusMessage({
        type: 'success',
        title: 'Event Created',
        description: 'Your timeline event has been saved! The indexer is processing it. This may take 10-30 seconds.'
      });

      // Close dialog after a short delay
      setTimeout(() => {
        setShowVideoDialog(false);
        setVideoTitle("");
        setVideoDescription("");
        setGeneratedImageUrl(null);
        setGeneratedVideoUrl(null);
        setContractSaved(false);
        setFilecoinSaved(false);
        setPieceCid(null);
      }, 3000);

      // Start polling
      setIsPolling(true);

      // Aggressively poll for new nodes - check every 5 seconds for 30 seconds
      const pollInterval = setInterval(async () => {
        console.log('Polling for new nodes...');
        await refetchNodes();
      }, 5000);

      // Stop polling after 30 seconds
      setTimeout(() => {
        clearInterval(pollInterval);
        setIsPolling(false);
        console.log('Stopped polling for new nodes');
      }, 30000);
    } catch (error) {
      console.error("Failed to create node:", error);
      setStatusMessage({
        type: 'error',
        title: 'Creation Failed',
        description: error instanceof Error ? error.message : 'Failed to create timeline event.'
      });
    } finally {
      setIsSavingToContract(false);
      setIsSavingToFilecoin(false);
    }
  }, [generatedVideoUrl, videoDescription, selectedNodeForBranch, createNode, refetchNodes]);

  const handleCreateEvent = () => {
    handleSaveToContract();
  };

  // Loading state
  if (isLoadingUniverse) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary mx-auto mb-4"></div>
          <p className="text-foreground text-xl">Loading universe...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!universeInfo) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">Universe Not Found</h2>
            <p className="text-muted-foreground mb-6">
              This universe hasn't been indexed yet or doesn't exist.
            </p>
            <Button asChild>
              <Link to="/universes">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Universes
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Empty state - no nodes yet
  if (!isLoadingNodes && nodes.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="border-b border-border bg-muted/30">
          <div className="container mx-auto px-6 py-6">
            <div className="flex items-center justify-between">
              <div>
                <Button variant="ghost" size="sm" asChild className="mb-4">
                  <Link to="/universes">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Universes
                  </Link>
                </Button>
                <h1 className="text-4xl font-bold mb-2">
                  {universeName || tokenInfo?.name || `Universe ${universeAddress.slice(0, 6)}...${universeAddress.slice(-4)}`}
                </h1>
                <p className="text-muted-foreground text-lg">
                  {universeDescription || tokenInfo?.metadata || "A collaborative narrative universe"}
                </p>
              </div>
              {tokenInfo && (
                <div className="text-right">
                  <Badge className="text-lg px-4 py-2">${tokenInfo.symbol}</Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Empty State */}
        <div className="flex items-center justify-center min-h-[60vh] px-4">
          <div className="text-center max-w-2xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>
              <div className="relative bg-white/10 backdrop-blur-sm rounded-3xl p-12 inline-block">
                <Video className="h-24 w-24 mx-auto text-white/60" />
              </div>
            </div>

            <h2 className="text-4xl font-bold mb-4">
              {universeName ? `Welcome to ${universeName}` : "No Timeline Events Yet"}
            </h2>
            <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
              {universeDescription || "This universe is brand new! Be the first to create a timeline event and start the story."}
            </p>

            {isConnected ? (
              <Button
                size="lg"
                className="text-lg px-10 h-14 font-bold shadow-lg shadow-primary/20"
                onClick={() => setShowVideoDialog(true)}
              >
                <Sparkles className="h-6 w-6 mr-2" />
                Create First Event
              </Button>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">Connect your wallet to create events</p>
                <Button size="lg" variant="outline">
                  Connect Wallet
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* FlowCreationPanel */}
        <FlowCreationPanel
          showVideoDialog={showVideoDialog}
          setShowVideoDialog={setShowVideoDialog}
          videoTitle={videoTitle}
          setVideoTitle={setVideoTitle}
          videoDescription={videoDescription}
          setVideoDescription={setVideoDescription}
          additionType="after"
          selectedCharacters={selectedCharacters}
          setSelectedCharacters={setSelectedCharacters}
          showCharacterSelector={showCharacterSelector}
          setShowCharacterSelector={setShowCharacterSelector}
          showCharacterGenerator={showCharacterGenerator}
          setShowCharacterGenerator={setShowCharacterGenerator}
          charactersData={charactersData}
          isLoadingCharacters={isLoadingCharacters}
          characterName={characterName}
          setCharacterName={setCharacterName}
          characterDescription={characterDescription}
          setCharacterDescription={setCharacterDescription}
          characterStyle={characterStyle}
          setCharacterStyle={setCharacterStyle}
          isGeneratingCharacter={isGeneratingCharacter}
          generatedCharacter={generatedCharacter}
          setGeneratedCharacter={setGeneratedCharacter}
          generateCharacterMutation={generateCharacterMutation}
          analyzeCharacterMutation={analyzeCharacterMutation}
          saveCharacterMutation={saveCharacterMutation}
          generatedImageUrl={generatedImageUrl}
          isGeneratingImage={isGeneratingImage}
          imageFormat={imageFormat}
          setImageFormat={setImageFormat}
          handleGenerateEventImage={handleGenerateEventImage}
          showVideoStep={showVideoStep}
          setShowVideoStep={setShowVideoStep}
          uploadedUrl={uploadedUrl}
          setUploadedUrl={setUploadedUrl}
          isUploading={isUploading}
          uploadToTmpfiles={uploadToTmpfiles}
          generatedVideoUrl={generatedVideoUrl}
          setGeneratedVideoUrl={setGeneratedVideoUrl}
          setGeneratedImageUrl={setGeneratedImageUrl}
          isGeneratingVideo={isGeneratingVideo}
          videoPrompt={videoPrompt}
          setVideoPrompt={setVideoPrompt}
          videoRatio={videoRatio}
          setVideoRatio={setVideoRatio}
          selectedVideoModel={selectedVideoModel}
          setSelectedVideoModel={setSelectedVideoModel}
          selectedVideoDuration={selectedVideoDuration}
          setSelectedVideoDuration={setSelectedVideoDuration}
          negativePrompt={negativePrompt}
          setNegativePrompt={setNegativePrompt}
          handleGenerateVideo={handleGenerateVideo}
          isSavingToContract={isSavingToContract}
          contractSaved={contractSaved}
          isSavingToFilecoin={isSavingToFilecoin}
          filecoinSaved={filecoinSaved}
          pieceCid={pieceCid}
          handleSaveToContract={handleSaveToContract}
          handleCreateEvent={handleCreateEvent}
          previousEventVideoUrl={null}
          previousEventDescription={null}
          previousEventTitle={null}
          statusMessage={statusMessage}
          setStatusMessage={setStatusMessage}
          selectedImageCharacters={selectedImageCharacters}
          setSelectedImageCharacters={setSelectedImageCharacters}
          handleGenerateCharacterFrame={handleGenerateCharacterFrame}
          refetchCharacters={refetchCharacters}
        />
      </div>
    );
  }

  // Main content with nodes
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link to="/universes">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Universes
                </Link>
              </Button>
              <h1 className="text-4xl font-bold mb-2">
                {universeName || tokenInfo?.name || `Universe ${universeAddress.slice(0, 8)}`}
              </h1>
              <p className="text-muted-foreground text-lg">
                {universeDescription || tokenInfo?.metadata || "A collaborative narrative universe"}
              </p>
            </div>
            <div className="flex items-center gap-4">
              {tokenInfo && (
                <Badge className="text-lg px-4 py-2">${tokenInfo.symbol}</Badge>
              )}
              {isConnected && (
                <Button onClick={() => setShowVideoDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6">
            <div>
              <p className="text-sm text-muted-foreground">Timeline Events</p>
              <p className="text-2xl font-bold">{nodes.length}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Universe Address</p>
              <p className="text-sm font-mono">
                {universeAddress.slice(0, 6)}...{universeAddress.slice(-4)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline Grid */}
      <div className="container mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold">Timeline Events</h2>
          <Button
            variant={isPolling ? "default" : "outline"}
            size="sm"
            onClick={() => refetchNodes()}
            disabled={isPolling}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isPolling ? 'animate-spin' : ''}`} />
            {isPolling ? 'Auto-refreshing...' : 'Refresh'}
          </Button>
        </div>

        {isLoadingNodes ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading events...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {nodes.map((nodeItem: any) => (
              <Card key={nodeItem.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <CardContent className="p-0">
                  {/* Video/Image Preview */}
                  {nodeItem.content?.videoLink && (
                    <div className="aspect-video bg-black">
                      <video
                        className="w-full h-full object-cover"
                        controls
                        preload="metadata"
                      >
                        <source src={nodeItem.content.videoLink} type="video/mp4" />
                      </video>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline">Node #{nodeItem.nodeId.toString()}</Badge>
                    </div>
                    <h3 className="font-bold mb-2 line-clamp-2">
                      {nodeItem.content?.plot || `Event #${nodeItem.nodeId}`}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {new Date(nodeItem.createdAt * 1000).toLocaleDateString()}
                    </p>
                    <Button variant="ghost" size="sm" className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* FlowCreationPanel */}
      <FlowCreationPanel
        showVideoDialog={showVideoDialog}
        setShowVideoDialog={setShowVideoDialog}
        videoTitle={videoTitle}
        setVideoTitle={setVideoTitle}
        videoDescription={videoDescription}
        setVideoDescription={setVideoDescription}
        additionType="after"
        selectedCharacters={selectedCharacters}
        setSelectedCharacters={setSelectedCharacters}
        showCharacterSelector={showCharacterSelector}
        setShowCharacterSelector={setShowCharacterSelector}
        showCharacterGenerator={showCharacterGenerator}
        setShowCharacterGenerator={setShowCharacterGenerator}
        charactersData={charactersData}
        isLoadingCharacters={isLoadingCharacters}
        characterName={characterName}
        setCharacterName={setCharacterName}
        characterDescription={characterDescription}
        setCharacterDescription={setCharacterDescription}
        characterStyle={characterStyle}
        setCharacterStyle={setCharacterStyle}
        isGeneratingCharacter={isGeneratingCharacter}
        generatedCharacter={generatedCharacter}
        setGeneratedCharacter={setGeneratedCharacter}
        generateCharacterMutation={generateCharacterMutation}
        analyzeCharacterMutation={analyzeCharacterMutation}
        saveCharacterMutation={saveCharacterMutation}
        generatedImageUrl={generatedImageUrl}
        isGeneratingImage={isGeneratingImage}
        imageFormat={imageFormat}
        setImageFormat={setImageFormat}
        handleGenerateEventImage={handleGenerateEventImage}
        showVideoStep={showVideoStep}
        setShowVideoStep={setShowVideoStep}
        uploadedUrl={uploadedUrl}
        setUploadedUrl={setUploadedUrl}
        isUploading={isUploading}
        uploadToTmpfiles={uploadToTmpfiles}
        generatedVideoUrl={generatedVideoUrl}
        setGeneratedVideoUrl={setGeneratedVideoUrl}
        setGeneratedImageUrl={setGeneratedImageUrl}
        isGeneratingVideo={isGeneratingVideo}
        videoPrompt={videoPrompt}
        setVideoPrompt={setVideoPrompt}
        videoRatio={videoRatio}
        setVideoRatio={setVideoRatio}
        selectedVideoModel={selectedVideoModel}
        setSelectedVideoModel={setSelectedVideoModel}
        selectedVideoDuration={selectedVideoDuration}
        setSelectedVideoDuration={setSelectedVideoDuration}
        negativePrompt={negativePrompt}
        setNegativePrompt={setNegativePrompt}
        handleGenerateVideo={handleGenerateVideo}
        isSavingToContract={isSavingToContract}
        contractSaved={contractSaved}
        isSavingToFilecoin={isSavingToFilecoin}
        filecoinSaved={filecoinSaved}
        pieceCid={pieceCid}
        handleSaveToContract={handleSaveToContract}
        handleCreateEvent={handleCreateEvent}
        previousEventVideoUrl={nodes.length > 0 ? nodes[0].content?.videoLink : null}
        previousEventDescription={nodes.length > 0 ? nodes[0].content?.plot : null}
        previousEventTitle={null}
        statusMessage={statusMessage}
        setStatusMessage={setStatusMessage}
        selectedImageCharacters={selectedImageCharacters}
        setSelectedImageCharacters={setSelectedImageCharacters}
        handleGenerateCharacterFrame={handleGenerateCharacterFrame}
        refetchCharacters={refetchCharacters}
      />
    </div>
  );
}
