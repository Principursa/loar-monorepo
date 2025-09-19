import { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import { Loader2, Video, Sparkles, Wand2 } from 'lucide-react';
import { trpcClient } from '@/utils/trpc';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useWriteContract } from 'wagmi';
import { timelineAbi } from '@/generated';
import { type Address } from 'viem';

// Character Node - For representing characters in the narrative
export const CharacterNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  const [selectedCharacterId, setSelectedCharacterId] = useState(data.selectedCharacterId || '');
  const [showCharacterSelector, setShowCharacterSelector] = useState(false);
  const [showGenerateDialog, setShowGenerateDialog] = useState(false);
  const [generatingCharacter, setGeneratingCharacter] = useState(false);
  const [characterName, setCharacterName] = useState('');
  const [characterStyle, setCharacterStyle] = useState<'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk'>('cute');
  const [currentPage, setCurrentPage] = useState(0);
  const charactersPerPage = 5;

  // Fetch available characters from database
  const { data: charactersData, isLoading: isLoadingCharacters, refetch: refetchCharacters } = useQuery({
    queryKey: ['characters'],
    queryFn: () => trpcClient.wiki.characters.query(),
  });

  // Nano Banana character generation mutation
  const generateCharacterMutation = useMutation({
    mutationFn: (input: { name: string; description: string; style: 'cute' | 'realistic' | 'anime' | 'fantasy' | 'cyberpunk' }) =>
      trpcClient.fal.generateCharacter.mutate(input),
    onSuccess: async (result) => {
      // Refetch characters to include the new one
      await refetchCharacters();
      
      // Auto-select the new character if it has an ID
      if (result.characterId) {
        handleCharacterSelect(result.characterId);
      }
      
      setShowGenerateDialog(false);
      setGeneratingCharacter(false);
    },
    onError: (error) => {
      console.error('Failed to generate character:', error);
      alert('Failed to generate character. Please try again.');
      setGeneratingCharacter(false);
    }
  });

  // Handle AI character generation
  const handleGenerateCharacter = useCallback(async () => {
    if (!characterName.trim() || !description.trim()) {
      alert('Please provide both a name and description for your character');
      return;
    }

    setGeneratingCharacter(true);
    await generateCharacterMutation.mutateAsync({
      name: characterName,
      description: description,
      style: characterStyle
    });
  }, [characterName, description, characterStyle, generateCharacterMutation]);

  // Handle character selection
  const handleCharacterSelect = (characterId: string) => {
    const selectedCharacter = charactersData?.characters.find(char => char.id === characterId);
    if (selectedCharacter) {
      setSelectedCharacterId(characterId);
      setShowCharacterSelector(false);
      
      // Update node data with selected character info
      data.selectedCharacterId = characterId;
      data.characterName = selectedCharacter.character_name;
      data.nftId = `${selectedCharacter.collection} #${selectedCharacter.token_id}`;
      data.characterImage = selectedCharacter.image_url;
      data.characterTraits = selectedCharacter.traits;
      
      // Update description if empty
      if (!description) {
        setDescription(selectedCharacter.description);
        data.description = selectedCharacter.description;
      }
    }
  };
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with elements
  const onInteractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  // Get the selected character data
  const selectedCharacter = selectedCharacterId 
    ? charactersData?.characters.find(char => char.id === selectedCharacterId)
    : null;

  // Pagination logic
  const totalCharacters = charactersData?.characters?.length || 0;
  const totalPages = Math.ceil(totalCharacters / charactersPerPage);
  const startIndex = currentPage * charactersPerPage;
  const endIndex = startIndex + charactersPerPage;
  const currentCharacters = charactersData?.characters?.slice(startIndex, endIndex) || [];

  const goToNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPrevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Close selector when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      if (showCharacterSelector) {
        setShowCharacterSelector(false);
      }
    };

    if (showCharacterSelector) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showCharacterSelector]);
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-blue-500 dark:bg-slate-800">
      <div className="flex items-center">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-blue-100 dark:bg-blue-900">
          {selectedCharacter ? (
            <img 
              src={selectedCharacter.image_url} 
              alt={selectedCharacter.character_name}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <span>{data.emoji || '👤'}</span>
          )}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">
            {selectedCharacter ? selectedCharacter.character_name : data.label}
          </div>
          {selectedCharacter && (
            <div className="text-xs text-muted-foreground">
              {selectedCharacter.collection} #{selectedCharacter.token_id}
            </div>
          )}
          {selectedCharacter && selectedCharacter.rarity_rank > 0 && (
            <div className="text-xs text-blue-600">
              Rank #{selectedCharacter.rarity_rank}
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onInteractionClick}
          onMouseDown={onInteractionClick}
          placeholder="Enter character description..."
          rows={2}
        />
      </div>

      {/* Character Selector and Generation */}
      <div className="mt-2 space-y-1">
        <button
          onClick={(e) => {
            onInteractionClick(e);
            setShowCharacterSelector(!showCharacterSelector);
          }}
          disabled={isLoadingCharacters}
          className="w-full py-1 px-2 text-xs rounded bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center"
        >
          {isLoadingCharacters ? 'Loading...' : selectedCharacter ? 'Change Character' : 'Select NFT Character'}
        </button>
        
        {/* Generate with AI Button */}
        <button
          onClick={(e) => {
            onInteractionClick(e);
            setShowGenerateDialog(true);
            setCharacterName('');
            setCharacterStyle('cute');
          }}
          className="w-full py-1 px-2 text-xs rounded bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white flex items-center justify-center gap-1"
        >
          <Sparkles className="w-3 h-3" />
          Generate with Nano Banana AI
        </button>

        {/* Character Dropdown with Pagination */}
        {showCharacterSelector && charactersData?.characters && (
          <div className="mt-1 bg-white dark:bg-slate-700 border rounded shadow-lg z-50 relative">
            {/* Header with pagination info */}
            <div className="flex items-center justify-between p-2 border-b bg-gray-50 dark:bg-slate-600">
              <div className="text-xs text-muted-foreground">
                {totalCharacters} characters
              </div>
              <div className="text-xs text-muted-foreground">
                Page {currentPage + 1} of {totalPages}
              </div>
            </div>

            {/* Character List */}
            <div className="max-h-64">
              {currentCharacters.map((character: any) => (
                <div
                  key={character.id}
                  onClick={() => handleCharacterSelect(character.id)}
                  className="p-2 hover:bg-blue-50 dark:hover:bg-slate-600 cursor-pointer border-b last:border-b-0 flex items-center gap-2 min-h-[3rem]"
                >
                  <img 
                    src={character.image_url} 
                    alt={character.character_name}
                    className="w-8 h-8 rounded object-cover flex-shrink-0"
                  />
                  <div className="text-xs flex-1 min-w-0">
                    <div className="font-medium truncate">{character.character_name}</div>
                    <div className="text-muted-foreground truncate">{character.collection} #{character.token_id}</div>
                    {character.rarity_rank > 0 && (
                      <div className="text-blue-600">Rank #{character.rarity_rank}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between p-2 border-t bg-gray-50 dark:bg-slate-600">
                <button
                  onClick={(e) => {
                    onInteractionClick(e);
                    goToPrevPage();
                  }}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white"
                >
                  ← Prev
                </button>
                <div className="text-xs text-muted-foreground">
                  {startIndex + 1}-{Math.min(endIndex, totalCharacters)} of {totalCharacters}
                </div>
                <button
                  onClick={(e) => {
                    onInteractionClick(e);
                    goToNextPage();
                  }}
                  disabled={currentPage >= totalPages - 1}
                  className="flex items-center gap-1 px-2 py-1 text-xs rounded bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* AI Character Generation Dialog */}
      {showGenerateDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => !generatingCharacter && setShowGenerateDialog(false)}>
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Wand2 className="w-4 h-4 text-purple-600" />
              Generate Character with Nano Banana AI
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium mb-1">Character Name</label>
                <input
                  type="text"
                  value={characterName}
                  onChange={(e) => setCharacterName(e.target.value)}
                  placeholder="Enter character name..."
                  className="w-full p-2 border rounded text-sm dark:bg-slate-700"
                  disabled={generatingCharacter}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Character Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe your character's appearance and personality..."
                  className="w-full p-2 border rounded text-sm dark:bg-slate-700"
                  rows={3}
                  disabled={generatingCharacter}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Art Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {['cute', 'realistic', 'anime', 'fantasy', 'cyberpunk'].map((style) => (
                    <button
                      key={style}
                      onClick={() => setCharacterStyle(style as any)}
                      disabled={generatingCharacter}
                      className={`px-2 py-1 text-xs rounded capitalize ${
                        characterStyle === style
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 dark:bg-slate-600 hover:bg-gray-300 dark:hover:bg-slate-500'
                      } ${generatingCharacter ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            {generatingCharacter && (
              <div className="mt-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded text-center">
                <Loader2 className="w-6 h-6 animate-spin text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Generating your character with Nano Banana AI...
                </p>
                <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  This may take a few moments
                </p>
              </div>
            )}
            
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleGenerateCharacter}
                disabled={generatingCharacter || !characterName.trim() || !description.trim()}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-2 rounded text-sm hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1"
              >
                {generatingCharacter ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Generate Character
                  </>
                )}
              </button>
              <button
                onClick={() => setShowGenerateDialog(false)}
                disabled={generatingCharacter}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

// Plot Point Node - For representing key narrative events
export const PlotPointNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<'lumaai' | 'kling'>('lumaai');
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [currentProvider, setCurrentProvider] = useState<'lumaai' | 'kling'>('lumaai');
  
  // Check if this node has existing blockchain video data
  const existingBlockchainVideo = data.videoUrl; // From timeline blockchain data
  const hasExistingVideo = !!existingBlockchainVideo;
  
  // Use existing blockchain video or generated video
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(
    data.plotVideoUrl || (hasExistingVideo ? existingBlockchainVideo : null)
  );
  const [walrusUrl, setWalrusUrl] = useState<string | null>(data.plotWalrusUrl || null);
  const [blockchainNodeCreated, setBlockchainNodeCreated] = useState<boolean>(
    data.blockchainNodeCreated || hasExistingVideo // If it has blockchain video, it's already on blockchain
  );
  
  // Video generation mutation with provider selection
  const generateVideoMutation = useMutation({
    mutationFn: (input: { 
      provider: 'lumaai' | 'kling';
      prompt: string; 
      model?: 'ray-flash-2' | 'ray-2' | 'ray-1-6'; 
      resolution?: '540p' | '720p' | '1080p' | '4k'; 
      duration?: '5s' | '10s'; 
      imageUrl?: string;
      imageUrls?: string[];
    }) =>
      trpcClient.video.generateWithProvider.mutate(input),
  });
  
  // Walrus upload mutation
  const uploadToWalrusMutation = useMutation({
    mutationFn: (input: { url: string }) =>
      trpcClient.walrus.uploadFromUrl.mutate(input),
  });
  
  // Blockchain contract integration
  const { writeContractAsync } = useWriteContract();
  
  // Blockchain node creation mutation
  const createNodeMutation = useMutation({
    mutationFn: async () => {
      const universeAddress = data.universeAddress;
      // Use the previousNode from connections, fallback to 0 if not connected
      const previousNodeId = data.previousNode || 0;
      
      console.log('Creating node with:', {
        universeAddress,
        walrusUrl,
        description,
        previousNodeId,
        isConnected: previousNodeId > 0,
        nodeData: data
      });
      
      if (!universeAddress) {
        throw new Error('No universe address found in node data');
      }
      
      if (!walrusUrl) {
        throw new Error('No Walrus URL available');
      }
      
      console.log('Creating blockchain node with previousNode:', previousNodeId);
      
      await writeContractAsync({
        abi: timelineAbi,
        address: universeAddress as Address,
        functionName: 'createNode',
        args: [walrusUrl, description || 'Plot point created in flow editor', BigInt(previousNodeId)],
      });
    },
  });
  
  // Video status query - LumaAI status checking
  const { data: lumaVideoStatus } = useQuery({
    queryKey: ['plotVideoStatus', generatedVideoId],
    queryFn: () => trpcClient.video.status.query({ id: generatedVideoId! }),
    enabled: !!generatedVideoId && !generatedVideoUrl && currentProvider === 'lumaai',
    refetchInterval: 3000, // Poll every 3 seconds
  });

  // Kling status query - use multiImageStatus endpoint
  const { data: klingVideoStatus } = useQuery({
    queryKey: ['klingVideoStatus', generatedVideoId],
    queryFn: () => trpcClient.video.multiImageStatus.query({ task_id: generatedVideoId! }),
    enabled: !!generatedVideoId && !generatedVideoUrl && currentProvider === 'kling',
    refetchInterval: 5000, // Poll every 5 seconds like the test
  });

  // Combine status checking
  const videoStatus = currentProvider === 'lumaai' ? lumaVideoStatus : klingVideoStatus;
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with elements
  const onInteractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handle video generation completion
  const checkVideoCompletion = useCallback(() => {
    if (!videoStatus) return;

    // Handle LumaAI response format
    if (currentProvider === 'lumaai' && 'status' in videoStatus) {
      if (videoStatus.status === 'completed' && videoStatus.videoUrl) {
        setGeneratedVideoUrl(videoStatus.videoUrl);
        data.plotVideoUrl = videoStatus.videoUrl;
        setGeneratedVideoId(null); // Stop polling
      } else if (videoStatus.status === 'failed') {
        alert(`Video generation failed: ${videoStatus.failureReason || 'Unknown error'}`);
        setGeneratedVideoId(null); // Stop polling
      }
    }
    
    // Handle Kling response format
    if (currentProvider === 'kling' && 'data' in videoStatus) {
      if (videoStatus.data.task_status === 'succeed' && videoStatus.data.task_result?.videos?.length) {
        const videoUrl = videoStatus.data.task_result.videos[0].url;
        setGeneratedVideoUrl(videoUrl);
        data.plotVideoUrl = videoUrl;
        setGeneratedVideoId(null); // Stop polling
      } else if (videoStatus.data.task_status === 'failed') {
        alert(`Video generation failed: ${videoStatus.data.task_status_msg || 'Unknown error'}`);
        setGeneratedVideoId(null); // Stop polling
      }
    }
  }, [videoStatus, data, currentProvider]);
  
  // Check for video completion when status changes
  useEffect(() => {
    checkVideoCompletion();
  }, [checkVideoCompletion]);
  
  // Open prompt dialog
  const openPromptDialog = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPromptDialog(true);
    
    // Set appropriate prompt based on connection type
    if (data.isImageToVideo) {
      // Use multiple character names if available, otherwise fall back to single character
      const characterNames = data.characterNames && data.characterNames.length > 0 
        ? data.characterNames.join(' and ') 
        : data.characterName;
      
      if (characterNames) {
        setVideoPrompt(`${characterNames} ${description || 'in a cinematic scene'}`);
      } else {
        setVideoPrompt(`Character ${description || 'in a cinematic scene'}`);
      }
    } else {
      setVideoPrompt(description || 'A cinematic scene representing this plot point');
    }
  }, [description, data.isImageToVideo, data.characterName]);
  
  // Generate video with prompt (text-to-video or image-to-video)
  const handleGenerateVideo = useCallback(async () => {
    if (!videoPrompt.trim()) return;
    
    try {
      // Check if this is image-to-video generation (connected to character)
      const isImageToVideo = Boolean(data.isImageToVideo && data.characterImageUrl);
      
      console.log('Generating video - Debug data:', {
        'data.isImageToVideo': data.isImageToVideo,
        'data.characterImageUrl': data.characterImageUrl,
        'data.characterImageUrls': data.characterImageUrls,
        'data.characterNames': data.characterNames,
        'data.characterIds': data.characterIds,
        'local isImageToVideo': isImageToVideo,
        characterName: data.characterName,
        prompt: videoPrompt,
        selectedProvider: selectedProvider,
        'typeof data.isImageToVideo': typeof data.isImageToVideo,
        'characterImageUrls length': data.characterImageUrls?.length || 0,
        'characterNames length': data.characterNames?.length || 0
      });
      
      const generationInput = {
        provider: selectedProvider,
        prompt: videoPrompt,
        model: 'ray-flash-2' as const, // Use ray-flash-2 for fast/low quality generation
        // Only include resolution/duration for text-to-video
        ...(isImageToVideo ? {} : {
          resolution: '540p' as const, // Lower resolution for faster generation
          duration: '5s' as const
        }),
        // Add image URL for image-to-video generation (LumaAI)
        ...(isImageToVideo && selectedProvider === 'lumaai' && { imageUrl: data.characterImageUrl }),
        // Add image URLs for multi-image generation (Kling)
        ...(isImageToVideo && selectedProvider === 'kling' && { 
          imageUrls: data.characterImageUrls && data.characterImageUrls.length > 0 
            ? data.characterImageUrls 
            : [data.characterImageUrl].filter(Boolean) 
        })
      };
      
      const result = await generateVideoMutation.mutateAsync(generationInput) as { id: string; status: string };
      
      setGeneratedVideoId(result.id);
      setCurrentProvider(selectedProvider); // Track which provider was used
      setShowPromptDialog(false);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video. Please try again.');
    }
  }, [videoPrompt, generateVideoMutation, data.isImageToVideo, data.characterImageUrl, data.characterName]);
  
  // Handle manual blockchain node creation
  const handleAddNode = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      await createNodeMutation.mutateAsync();
      setBlockchainNodeCreated(true);
      data.blockchainNodeCreated = true;
      alert('Timeline node added to blockchain!');
    } catch (error) {
      console.error('Error creating timeline node:', error);
      alert('Failed to add node to blockchain. Please try again.');
    }
  }, [createNodeMutation, data]);
  
  // Upload to Walrus
  const handleUploadToWalrus = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!generatedVideoUrl) return;
    
    try {
      const walrusResult = await uploadToWalrusMutation.mutateAsync({
        url: generatedVideoUrl
      }) as { blobId: string; url: string };
      
      setWalrusUrl(walrusResult.url);
      data.plotWalrusUrl = walrusResult.url;
      data.plotWalrusBlobId = walrusResult.blobId;
      
    } catch (error) {
      console.error('Error uploading to Walrus:', error);
      alert('Failed to upload to Walrus. Please try again.');
    }
  }, [generatedVideoUrl, uploadToWalrusMutation, data]);
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-green-500 dark:bg-slate-800">
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-green-100 dark:bg-green-900">
          {data.emoji || '📝'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.canonicity && (
            <div className="text-xs">
              Canonicity: 
              <span className={data.canonicity === 'Canon' ? 'text-green-500' : 'text-amber-500'}>
                {data.canonicity}
              </span>
            </div>
          )}
          {data.previousNode && data.previousNode > 0 && (
            <div className="text-xs text-blue-600">
              🔗 Connected to Node {data.previousNode}
            </div>
          )}
          {data.isImageToVideo && (
            <div className="text-xs text-purple-600">
              🎭 Characters: {
                data.characterNames && data.characterNames.length > 0 
                  ? data.characterNames.join(', ')
                  : data.characterName || 'Connected'
              } ({
                data.characterImageUrls && data.characterImageUrls.length > 0 
                  ? data.characterImageUrls.length 
                  : 1
              })
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onInteractionClick}
          onMouseDown={onInteractionClick}
          placeholder="Enter plot point description..."
          rows={2}
        />
      </div>
      
      {/* Display video: either from blockchain, generated, or loading animation */}
      {(generatedVideoUrl || generatedVideoId) && (
        <div className="mt-2 text-xs text-muted-foreground">
          <strong>{hasExistingVideo ? 'Blockchain Video:' : 'Plot Video:'}</strong>
          {generatedVideoUrl ? (
            <div>
              <video 
                controls 
                className="w-full mt-1 rounded"
                src={generatedVideoUrl}
                style={{ maxHeight: '120px' }}
              >
                Your browser does not support the video tag.
              </video>
              {hasExistingVideo && (
                <div className="text-xs text-blue-600 mt-1 flex items-center">
                  <span className="mr-1">⛓️</span>
                  <span>Stored on blockchain timeline</span>
                </div>
              )}
            </div>
          ) : (
            <div className="w-full mt-1 rounded bg-gradient-to-r from-green-100 to-green-200 dark:from-green-800 dark:to-green-700 flex items-center justify-center" style={{ height: '120px' }}>
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-2" />
                <div className="text-xs text-green-700 dark:text-green-300 font-medium">
                  Generating video...
                </div>
                <div className="text-xs text-green-600 dark:text-green-400 mt-1">
                  This may take a few minutes
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-2 space-y-1">
        {/* Only show Generate Video button if there's no existing blockchain video */}
        {!hasExistingVideo && (
          <button
            onClick={openPromptDialog}
            onMouseDown={onInteractionClick}
            disabled={generateVideoMutation.isPending}
            className={`w-full py-1 px-2 text-xs rounded ${generateVideoMutation.isPending ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white flex items-center justify-center`}
          >
            {generateVideoMutation.isPending ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Generating...
              </>
            ) : (
              <><Video className="w-3 h-3 mr-1" />{data.isImageToVideo ? 'Generate Character Video' : 'Generate Video'}</>
            )}
          </button>
        )}
        
        {/* Show info badge for existing blockchain videos */}
        {hasExistingVideo && (
          <div className="w-full py-1 px-2 text-xs rounded bg-blue-100 text-blue-800 text-center border border-blue-200">
            ⛓️ Video from Blockchain
          </div>
        )}
        
        {/* Upload to Walrus - only for newly generated videos, not existing blockchain videos */}
        {generatedVideoUrl && !walrusUrl && !hasExistingVideo && (
          <button
            onClick={handleUploadToWalrus}
            onMouseDown={onInteractionClick}
            disabled={uploadToWalrusMutation.isPending}
            className={`w-full py-1 px-2 text-xs rounded ${uploadToWalrusMutation.isPending ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} text-white flex items-center justify-center`}
          >
            {uploadToWalrusMutation.isPending ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Uploading...
              </>
            ) : (
              <>🐙 Upload to Walrus</>
            )}
          </button>
        )}
        
        {/* Add Node - only for newly created content, not existing blockchain nodes */}
        {walrusUrl && !blockchainNodeCreated && !hasExistingVideo && (
          <button
            onClick={handleAddNode}
            onMouseDown={onInteractionClick}
            disabled={createNodeMutation.isPending}
            className={`w-full py-1 px-2 text-xs rounded ${createNodeMutation.isPending ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'} text-white flex items-center justify-center`}
          >
            {createNodeMutation.isPending ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Adding...
              </>
            ) : (
              <>⛓️ Add Node</>
            )}
          </button>
        )}
        
        {/* Show different message for existing blockchain nodes */}
        {hasExistingVideo && (
          <div className="w-full py-1 px-2 text-xs rounded bg-green-100 text-green-800 text-center border border-green-200">
            ✅ Already on Blockchain
          </div>
        )}
      </div>
      
      {/* Display Walrus URL if available */}
      {walrusUrl && (
        <div className="mt-2 text-xs text-muted-foreground">
          <strong>🐙 Walrus:</strong>
          <div className="bg-teal-50 dark:bg-teal-900 p-1 rounded mt-1 break-all">
            <a href={walrusUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
              {walrusUrl.length > 50 ? `${walrusUrl.substring(0, 47)}...` : walrusUrl}
            </a>
          </div>
        </div>
      )}
      
      {/* Video Prompt Dialog */}
      {showPromptDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPromptDialog(false)}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">Generate Plot Point Video</h3>
            
            {/* Provider Selection */}
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">AI Provider:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedProvider('lumaai')}
                  className={`px-3 py-1 text-xs rounded ${selectedProvider === 'lumaai' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  LumaAI (Single Image)
                </button>
                <button
                  onClick={() => setSelectedProvider('kling')}
                  className={`px-3 py-1 text-xs rounded ${selectedProvider === 'kling' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  Kling (Multi-Image)
                </button>
              </div>
            </div>
            
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe the video for this plot point..."
              className="w-full p-2 border rounded mb-3 text-sm"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleGenerateVideo}
                disabled={!videoPrompt.trim() || generateVideoMutation.isPending}
                className="flex-1 bg-green-600 text-white px-3 py-2 rounded text-sm hover:bg-green-700 disabled:bg-gray-400"
              >
                {generateVideoMutation.isPending ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={() => setShowPromptDialog(false)}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

// Media Node - For representing media content (videos, images, etc.)
export const MediaNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  const [videoPrompt, setVideoPrompt] = useState('');
  const [showPromptDialog, setShowPromptDialog] = useState(false);
  const [generatedVideoId, setGeneratedVideoId] = useState<string | null>(null);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(data.mediaUrl || null);
  const [walrusUrl, setWalrusUrl] = useState<string | null>(data.mediaWalrusUrl || null);
  
  // Video generation mutation
  const generateVideoMutation = useMutation({
    mutationFn: (input: { prompt: string; model?: 'ray-flash-2' | 'ray-2' | 'ray-1-6'; resolution?: '540p' | '720p' | '1080p' | '4k'; duration?: '5s' | '10s' }) =>
      trpcClient.video.generate.mutate(input),
  });
  
  // Walrus upload mutation
  const uploadToWalrusMutation = useMutation({
    mutationFn: (input: { url: string }) =>
      trpcClient.walrus.uploadFromUrl.mutate(input),
  });
  
  // Video status query - only enabled when we have a video ID
  const { data: videoStatus } = useQuery({
    queryKey: ['videoStatus', generatedVideoId],
    queryFn: () => trpcClient.video.status.query({ id: generatedVideoId! }),
    enabled: !!generatedVideoId && !generatedVideoUrl,
    refetchInterval: 3000, // Poll every 3 seconds
  });
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with elements
  const onInteractionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  // Handle video generation completion
  const checkVideoCompletion = useCallback(() => {
    if (videoStatus?.status === 'completed' && videoStatus.videoUrl) {
      setGeneratedVideoUrl(videoStatus.videoUrl);
      data.mediaUrl = videoStatus.videoUrl;
      setGeneratedVideoId(null); // Stop polling
    } else if (videoStatus?.status === 'failed') {
      alert(`Video generation failed: ${videoStatus.failureReason || 'Unknown error'}`);
      setGeneratedVideoId(null); // Stop polling
    }
  }, [videoStatus, data]);
  
  // Check for video completion when status changes
  useEffect(() => {
    checkVideoCompletion();
  }, [checkVideoCompletion]);
  
  // Open prompt dialog
  const openPromptDialog = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setShowPromptDialog(true);
    setVideoPrompt(description || 'A cinematic scene in a cyberpunk city');
  }, [description]);
  
  // Generate video with prompt
  const handleGenerateVideo = useCallback(async () => {
    if (!videoPrompt.trim()) return;
    
    try {
      const result = await generateVideoMutation.mutateAsync({
        prompt: videoPrompt,
        model: 'ray-flash-2',
        resolution: '720p',
        duration: '5s'
      }) as { id: string; status: string };
      
      setGeneratedVideoId(result.id);
      setShowPromptDialog(false);
    } catch (error) {
      console.error('Error generating video:', error);
      alert('Failed to generate video. Please try again.');
    }
  }, [videoPrompt, generateVideoMutation]);
  
  // Upload to Walrus
  const handleUploadToWalrus = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!generatedVideoUrl) return;
    
    try {
      const walrusResult = await uploadToWalrusMutation.mutateAsync({
        url: generatedVideoUrl
      }) as { blobId: string; url: string };
      
      setWalrusUrl(walrusResult.url);
      data.mediaWalrusUrl = walrusResult.url;
      data.mediaWalrusBlobId = walrusResult.blobId;
    } catch (error) {
      console.error('Error uploading to Walrus:', error);
      alert('Failed to upload to Walrus. Please try again.');
    }
  }, [generatedVideoUrl, uploadToWalrusMutation, data]);
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-purple-500 dark:bg-slate-800">
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-purple-100 dark:bg-purple-900">
          {data.emoji || '🎬'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.storageType && (
            <div className="text-xs text-muted-foreground">
              Storage: {data.storageType}
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onInteractionClick}
          onMouseDown={onInteractionClick}
          placeholder="Enter media description..."
          rows={2}
        />
      </div>
      
      {/* Display generated video or loading animation */}
      {(generatedVideoUrl || generatedVideoId) && (
        <div className="mt-2 text-xs text-muted-foreground">
          <strong>Media Video:</strong>
          {generatedVideoUrl ? (
            <video 
              controls 
              className="w-full mt-1 rounded"
              src={generatedVideoUrl}
              style={{ maxHeight: '120px' }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <div className="w-full mt-1 rounded bg-gradient-to-r from-purple-100 to-purple-200 dark:from-purple-800 dark:to-purple-700 flex items-center justify-center" style={{ height: '120px' }}>
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-2" />
                <div className="text-xs text-purple-700 dark:text-purple-300 font-medium">
                  Generating video...
                </div>
                <div className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                  This may take a few minutes
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Action Buttons */}
      <div className="mt-2 space-y-1">
        <button
          onClick={openPromptDialog}
          onMouseDown={onInteractionClick}
          disabled={generateVideoMutation.isPending}
          className={`w-full py-1 px-2 text-sm rounded ${generateVideoMutation.isPending ? 'bg-gray-400' : 'bg-purple-600 hover:bg-purple-700'} text-white flex items-center justify-center`}
        >
          {generateVideoMutation.isPending ? (
            <>
              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
              Generating...
            </>
          ) : (
            'Generate Video'
          )}
        </button>
        
        {generatedVideoUrl && !walrusUrl && (
          <button
            onClick={handleUploadToWalrus}
            onMouseDown={onInteractionClick}
            disabled={uploadToWalrusMutation.isPending}
            className={`w-full py-1 px-2 text-sm rounded ${uploadToWalrusMutation.isPending ? 'bg-gray-400' : 'bg-teal-600 hover:bg-teal-700'} text-white flex items-center justify-center`}
          >
            {uploadToWalrusMutation.isPending ? (
              <>
                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                Uploading...
              </>
            ) : (
              <>🐙 Upload to Walrus</>
            )}
          </button>
        )}
      </div>
      
      {/* Display Walrus URL if available */}
      {walrusUrl && (
        <div className="mt-2 text-xs text-muted-foreground">
          <strong>🐙 Walrus:</strong>
          <div className="bg-teal-50 dark:bg-teal-900 p-1 rounded mt-1 break-all">
            <a href={walrusUrl} target="_blank" rel="noopener noreferrer" className="text-teal-600 hover:underline">
              {walrusUrl.length > 50 ? `${walrusUrl.substring(0, 47)}...` : walrusUrl}
            </a>
          </div>
        </div>
      )}
      
      {/* Video Prompt Dialog */}
      {showPromptDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onClick={() => setShowPromptDialog(false)}>
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-md w-full mx-4" onClick={(e) => e.stopPropagation()}>
            <h3 className="font-semibold mb-3">Generate Video</h3>
            <textarea
              value={videoPrompt}
              onChange={(e) => setVideoPrompt(e.target.value)}
              placeholder="Describe the video you want to generate..."
              className="w-full p-2 border rounded mb-3 text-sm"
              rows={3}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleGenerateVideo}
                disabled={!videoPrompt.trim() || generateVideoMutation.isPending}
                className="flex-1 bg-purple-600 text-white px-3 py-2 rounded text-sm hover:bg-purple-700 disabled:bg-gray-400"
              >
                {generateVideoMutation.isPending ? 'Generating...' : 'Generate'}
              </button>
              <button
                onClick={() => setShowPromptDialog(false)}
                className="px-3 py-2 border rounded text-sm hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});

// Voting Node - For representing governance decisions
export const VotingNode = memo(({ data, isConnectable }: NodeProps) => {
  const [description, setDescription] = useState(data.description || '');
  
  // Update the node data when description changes
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    setDescription(newDescription);
    data.description = newDescription; // Update the node data directly
  };
  
  // Prevent node drag when interacting with the textarea
  const onTextareaClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div className="px-4 py-2 shadow-md rounded-md bg-white border-2 border-amber-500 dark:bg-slate-800">
      <div className="flex">
        <div className="rounded-full w-10 h-10 flex justify-center items-center bg-amber-100 dark:bg-amber-900">
          {data.emoji || '🗳️'}
        </div>
        <div className="ml-2">
          <div className="text-lg font-bold">{data.label}</div>
          {data.status && (
            <div className="text-xs">
              Status: 
              <span className={
                data.status === 'Active' ? 'text-green-500' : 
                data.status === 'Pending' ? 'text-amber-500' : 'text-red-500'
              }>
                {data.status}
              </span>
            </div>
          )}
        </div>
      </div>
      <div className="mt-2">
        <textarea
          className="w-full p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-amber-500 dark:bg-slate-700"
          value={description}
          onChange={handleDescriptionChange}
          onClick={onTextareaClick}
          onMouseDown={onTextareaClick}
          placeholder="Enter voting description..."
          rows={2}
        />
      </div>
      <Handle
        type="target"
        position={Position.Top}
        isConnectable={isConnectable}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        isConnectable={isConnectable}
      />
    </div>
  );
});
