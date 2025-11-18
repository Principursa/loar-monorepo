/**
 * Contract Save Hook
 *
 * Handles saving timeline events to blockchain smart contracts with MinIO storage.
 * Includes wiki generation and data refresh after save.
 */

import { useCallback } from 'react';
import { type Address } from 'viem';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { trpcClient } from '@/utils/trpc';
import { universeAbi } from '@loar/abis/generated';
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test';
import { type GraphData } from '@/hooks/useUniverseBlockchain';

export interface UseContractSaveProps {
  generatedVideoUrl: string | null;
  videoTitle: string;
  videoDescription: string;
  additionType: 'after' | 'branch';
  sourceNodeId: string | null;
  selectedCharacters: string[];
  selectedImageCharacters: string[];
  graphData: GraphData;
  latestNodeId: number;
  universeId: string;
  isBlockchainUniverse: boolean;
  chainId: number;
  setGeneratedVideoUrl: (url: string | null) => void;
  setStorageKey: (key: string) => void;
  setStorageSaved: (saved: boolean) => void;
  setContractSaved: (saved: boolean) => void;
  setIsSavingToContract: (saving: boolean) => void;
  setIsSavingToStorage: (saving: boolean) => void;
  writeContractAsync: any;
  refetchLeaves: () => Promise<any>;
  refetchFullGraph: () => Promise<any>;
  refetchCanonChain: () => Promise<any>;
  refetchLatestNodeId: () => Promise<any>;
}

export interface UseContractSaveReturn {
  handleSaveToContract: () => Promise<void>;
  handleRefreshTimeline: () => Promise<void>;
}

export function useContractSave({
  generatedVideoUrl,
  videoTitle,
  videoDescription,
  additionType,
  sourceNodeId,
  selectedCharacters,
  selectedImageCharacters,
  graphData,
  latestNodeId,
  universeId,
  isBlockchainUniverse,
  chainId,
  setGeneratedVideoUrl,
  setStorageKey,
  setStorageSaved,
  setContractSaved,
  setIsSavingToContract,
  setIsSavingToStorage,
  writeContractAsync,
  refetchLeaves,
  refetchFullGraph,
  refetchCanonChain,
  refetchLatestNodeId,
}: UseContractSaveProps): UseContractSaveReturn {
  const queryClient = useQueryClient();

  // Save to contract function (now includes MinIO upload)
  const handleSaveToContract = useCallback(async () => {
    if (!generatedVideoUrl || !videoTitle || !videoDescription) {
      alert('Video, title, and description are required to save to contract');
      return;
    }

    setIsSavingToContract(true);
    setIsSavingToStorage(true);

    try {
      // Step 1: Upload to MinIO S3 storage first
      console.log('Step 1: Uploading video to MinIO S3. URL being used:', generatedVideoUrl);
      console.log('Current state - videoTitle:', videoTitle, 'videoDescription:', videoDescription);

      let minioKey: string | null = null;
      let minioUrl: string | null = null;
      try {
        // Generate a clean UUID for the filename
        const uuid = crypto.randomUUID();
        const minioResult = await trpcClient.minio.uploadFromUrl.mutate({
          url: generatedVideoUrl,
          filename: `${uuid}.mp4`
        });

        console.log('MinIO upload successful. Key:', minioResult.key);
        console.log('MinIO public URL:', minioResult.url);

        minioKey = minioResult.key;
        minioUrl = minioResult.url;
        setStorageKey(minioResult.key);
        setStorageSaved(true);

        // Use the MinIO public URL directly
        setGeneratedVideoUrl(minioUrl);
        console.log('Updated video display to use MinIO URL:', minioUrl);
      } catch (minioError) {
        console.error('MinIO upload failed, proceeding with original URL:', minioError);
        // Continue with original URL if MinIO fails
      }

      setIsSavingToStorage(false);

      // Step 2: Determine the previous node based on addition type
      let previousNodeId: number;

      if (additionType === 'branch' && sourceNodeId) {
        // For branches, extract numeric part from sourceNodeId (e.g., "4c" -> 4)
        const numericPart = sourceNodeId.match(/^\d+/);
        previousNodeId = numericPart ? parseInt(numericPart[0]) : 0;
        console.log('Creating branch from event:', sourceNodeId, '-> numeric:', previousNodeId);
      } else {
        // For linear continuation, find the last node ID (extract numeric parts)
        const numericIds = graphData.nodeIds.map(id => {
          const idStr = String(id);
          const numericPart = idStr.match(/^\d+/);
          return numericPart ? parseInt(numericPart[0]) : 0;
        });
        previousNodeId = Math.max(...(numericIds || [0]), 0);
        console.log('Creating linear continuation after event:', previousNodeId);
      }

      // Step 3: Determine the video URL to store - prefer MinIO URL if available
      const videoUrlForContract = minioUrl || generatedVideoUrl;

      console.log('Step 2: Saving to contract:', {
        link: videoUrlForContract,
        originalLink: generatedVideoUrl,
        minioKey: minioKey,
        minioUrl: minioUrl,
        plot: videoDescription,
        previous: previousNodeId,
        title: videoTitle,
        additionType,
        sourceNodeId
      });

      // Determine which contract address to use
      const contractAddressToUse = isBlockchainUniverse
        ? universeId as Address  // Use universe ID as contract address
        : TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address;  // Fallback to default

      console.log('Saving to contract address:', contractAddressToUse);

      // Create new node in the universe's specific smart contract
      const txHash = await writeContractAsync({
        abi: universeAbi,
        address: contractAddressToUse,
        functionName: 'createNode',
        args: [videoUrlForContract, videoDescription, BigInt(previousNodeId)]
      });

      console.log('Transaction submitted:', txHash);
      setContractSaved(true);

      // Show success message
      toast.success('Event Saved to Blockchain & MinIO!', {
        description: `Your timeline event has been permanently stored.\nTransaction: ${txHash.substring(0, 10)}...${txHash.substring(txHash.length - 8)}`,
        duration: 8000
      });

      // Step 4: Generate wiki entry in background (non-blocking)
      console.log('Step 3: Generating wiki entry in background...');

      // Gather previous events for context (last 2-3 events)
      const previousEvents = graphData.nodeIds
        .slice(-3) // Get last 3 events
        .map((nodeId, idx) => ({
          title: graphData.descriptions[graphData.nodeIds.length - 3 + idx] || `Event ${nodeId}`,
          description: graphData.descriptions[graphData.nodeIds.length - 3 + idx] || ''
        }))
        .filter(evt => evt.description.length > 0);

      // Determine which character IDs to use based on generation mode
      // For image-to-video mode, use selectedImageCharacters
      // For text-to-video mode, use selectedCharacters
      const characterIdsForWiki = selectedImageCharacters.length > 0
        ? selectedImageCharacters
        : (selectedCharacters.length > 0 ? selectedCharacters : undefined);

      console.log('🎭 Characters for wiki generation:', {
        selectedImageCharacters,
        selectedCharacters,
        characterIdsForWiki
      });

      // Generate wiki in background (non-blocking)
      // Use latestNodeId + 1 as the new event ID (this is how the Timeline contract assigns IDs)
      const newEventId = latestNodeId + 1;
      console.log(`📝 Generating wiki for new event ID: ${newEventId} (latestNodeId: ${latestNodeId})`);

      trpcClient.wiki.generateFromVideo.mutate({
        universeId: universeId,
        eventId: String(newEventId), // Use latestNodeId + 1, not previousNodeId + 1
        videoUrl: videoUrlForContract,
        title: videoTitle,
        description: videoDescription,
        characterIds: characterIdsForWiki,
        previousEvents: previousEvents.length > 0 ? previousEvents : undefined
      }).then((wikiResult) => {
        console.log('✅ Wiki generated successfully!', wikiResult);
        toast.success('Wiki Generated!', {
          description: 'AI-powered wiki entry created for your event.',
          duration: 4000
        });
      }).catch((wikiError) => {
        console.error('❌ Wiki generation failed:', wikiError);
        // Don't show error to user - wiki can be generated later
        console.warn('Event saved but wiki generation failed. Wiki can be regenerated later.');
      });

      // Refresh the blockchain data to show the new node
      setTimeout(async () => {
        if (isBlockchainUniverse) {
          // Specifically refetch blockchain data
          await refetchLeaves();
          await refetchFullGraph();
          await refetchCanonChain();
          await refetchLatestNodeId();
          console.log('Refetched blockchain data after contract save');
        }
        // Invalidate all queries as fallback
        await queryClient.invalidateQueries();
        console.log('Refreshed blockchain data - new node should appear');
      }, 5000); // Wait 5 seconds for blockchain to update

    } catch (error) {
      console.error('Error saving to contract:', error);
      toast.error('Contract Save Failed', {
        description: 'Failed to save event to blockchain: ' + (error instanceof Error ? error.message : 'Unknown error'),
        duration: 5000
      });
    } finally {
      setIsSavingToContract(false);
      setIsSavingToStorage(false);
    }
  }, [
    generatedVideoUrl,
    videoTitle,
    videoDescription,
    additionType,
    sourceNodeId,
    selectedCharacters,
    selectedImageCharacters,
    graphData.nodeIds,
    graphData.descriptions,
    latestNodeId,
    universeId,
    isBlockchainUniverse,
    chainId,
    setGeneratedVideoUrl,
    setStorageKey,
    setStorageSaved,
    setContractSaved,
    setIsSavingToContract,
    setIsSavingToStorage,
    writeContractAsync,
    refetchLeaves,
    refetchFullGraph,
    refetchCanonChain,
    refetchLatestNodeId,
    queryClient
  ]);

  // Manual refresh function
  const handleRefreshTimeline = useCallback(async () => {
    console.log('Manually refreshing timeline...');
    if (isBlockchainUniverse) {
      // Specifically refetch blockchain data
      await refetchLeaves();
      await refetchFullGraph();
      await refetchCanonChain();
      await refetchLatestNodeId();
      console.log('Refetched blockchain data for universe:', universeId);
    }
    // Also invalidate all queries as fallback
    await queryClient.invalidateQueries();
  }, [queryClient, isBlockchainUniverse, refetchLeaves, refetchFullGraph, refetchCanonChain, refetchLatestNodeId, universeId]);

  return {
    handleSaveToContract,
    handleRefreshTimeline,
  };
}
