/**
 * Universe Blockchain Hooks
 *
 * Custom hooks for fetching and processing blockchain data for a universe timeline.
 * Handles contract reads for leaves, full graph, canon chain, and latest node ID.
 */

import { useMemo } from 'react';
import { useReadContract } from 'wagmi';
import { timelineAbi } from '@/generated';
import { type Address } from 'viem';

export interface GraphData {
  nodeIds: readonly (string | number | bigint)[];
  urls: readonly string[];
  descriptions: readonly string[];
  previousNodes: readonly (string | number | bigint)[];
  children: readonly (string | number | bigint)[][];
  flags: readonly boolean[];
  canonChain: readonly (string | number | bigint)[];
}

export interface UseUniverseBlockchainProps {
  universeId: string;
  contractAddress?: string;
  isBlockchainUniverse: boolean;
}

export interface UseUniverseBlockchainReturn {
  // Data
  graphData: GraphData;
  latestNodeId: number;
  leavesData: any; // Raw leaves data from contract

  // Loading states
  isLoadingLeaves: boolean;
  isLoadingFullGraph: boolean;
  isLoadingCanonChain: boolean;
  isLoadingAny: boolean;

  // Refetch functions
  refetchLeaves: () => Promise<any>;
  refetchFullGraph: () => Promise<any>;
  refetchCanonChain: () => Promise<any>;
  refetchLatestNodeId: () => Promise<any>;
}

/**
 * Hook for fetching universe leaves from blockchain
 */
function useUniverseLeaves(contractAddress?: string) {
  if (!contractAddress) {
    console.log('useUniverseLeaves - No contract address provided');
    return { data: null, isLoading: false, refetch: async () => {} };
  }

  return useReadContract({
    abi: timelineAbi,
    address: contractAddress as Address,
    functionName: 'getLeaves',
    query: {
      enabled: !!contractAddress
    }
  });
}

/**
 * Hook for fetching universe full graph from blockchain
 */
function useUniverseFullGraph(contractAddress?: string) {
  if (!contractAddress) {
    console.log('useUniverseFullGraph - No contract address provided');
    return { data: null, isLoading: false, refetch: async () => {} };
  }

  return useReadContract({
    abi: timelineAbi,
    address: contractAddress as Address,
    functionName: 'getFullGraph',
    query: {
      enabled: !!contractAddress
    }
  });
}

/**
 * Hook for fetching canon chain from blockchain
 */
function useUniverseCanonChain(contractAddress?: string) {
  if (!contractAddress) {
    console.log('useUniverseCanonChain - No contract address provided');
    return { data: null, isLoading: false, refetch: async () => {} };
  }

  return useReadContract({
    abi: timelineAbi,
    address: contractAddress as Address,
    functionName: 'getCanonChain',
    query: {
      enabled: !!contractAddress
    }
  });
}

/**
 * Main hook for managing all blockchain data for a universe
 */
export function useUniverseBlockchain({
  universeId,
  contractAddress,
  isBlockchainUniverse,
}: UseUniverseBlockchainProps): UseUniverseBlockchainReturn {
  // Fetch blockchain data
  const { data: leavesData, isLoading: isLoadingLeaves, refetch: refetchLeaves } = useUniverseLeaves(contractAddress);
  const { data: fullGraphData, isLoading: isLoadingFullGraph, refetch: refetchFullGraph } = useUniverseFullGraph(contractAddress);
  const { data: canonChainData, isLoading: isLoadingCanonChain, refetch: refetchCanonChain } = useUniverseCanonChain(contractAddress);

  // Fetch latest node ID
  const { data: latestNodeIdData, refetch: refetchLatestNodeId } = useReadContract({
    abi: timelineAbi,
    address: contractAddress as Address,
    functionName: 'latestNodeId',
    query: {
      enabled: !!contractAddress && isBlockchainUniverse
    }
  });

  const latestNodeId = latestNodeIdData ? Number(latestNodeIdData) : 0;

  // Process graph data
  const graphData = useMemo(() => {
    console.log('=== GRAPH DATA DEBUG ===');
    console.log('Is Blockchain Universe:', isBlockchainUniverse);
    console.log('Contract Address:', contractAddress);
    console.log('Full Graph Data:', fullGraphData);
    console.log('Canon Chain Data:', canonChainData);
    console.log('=========================');

    if (contractAddress && fullGraphData) {
      // Convert blockchain data to the expected format
      const [nodeIds, urls, descriptions, previousIds, nextIds, flags] = fullGraphData;

      console.log('=== BLOCKCHAIN DATA PARSED ===');
      console.log('Node IDs:', nodeIds);
      console.log('URLs:', urls);
      console.log('Descriptions:', descriptions);
      console.log('Previous IDs:', previousIds);
      console.log('Canon Chain:', canonChainData);
      console.log('==============================');

      return {
        nodeIds: (nodeIds || []) as readonly (string | number | bigint)[],
        urls: urls || [],
        descriptions: descriptions || [],
        previousNodes: (previousIds || []) as readonly (string | number | bigint)[],
        children: (nextIds || []) as readonly (string | number | bigint)[][],
        flags: flags || [],
        canonChain: (canonChainData || []) as readonly (string | number | bigint)[]
      };
    }

    // Return empty data structure if no data found
    return {
      nodeIds: [],
      urls: [],
      descriptions: [],
      previousNodes: [],
      children: [],
      flags: [],
      canonChain: []
    };
  }, [universeId, isBlockchainUniverse, fullGraphData, canonChainData, contractAddress]);

  const isLoadingAny = isLoadingLeaves || isLoadingFullGraph || isLoadingCanonChain;

  return {
    graphData,
    latestNodeId,
    leavesData,
    isLoadingLeaves,
    isLoadingFullGraph,
    isLoadingCanonChain,
    isLoadingAny,
    refetchLeaves,
    refetchFullGraph,
    refetchCanonChain,
    refetchLatestNodeId,
  };
}
