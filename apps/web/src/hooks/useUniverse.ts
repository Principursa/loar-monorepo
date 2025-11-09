import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { universeAbi } from '@loar/abis/generated';
import { sepolia } from 'viem/chains';

/**
 * Hook for interacting with a specific Universe contract
 * Each universe has its own timeline/node graph
 *
 * Usage:
 * const { createNode, ... } = useUniverse(universeAddress);
 */
export function useUniverse(universeAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  /**
   * Create a new node in the universe timeline
   * @param link - Video/media URL for this node
   * @param plot - Description/plot for this node
   * @param previousNodeId - The ID of the parent node (0 for root)
   * @returns Transaction hash
   */
  const createNode = async (params: {
    link: string;
    plot: string;
    previousNodeId: bigint;
  }) => {
    if (!universeAddress) {
      throw new Error('Universe address is required');
    }

    writeContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'createNode',
      args: [params.link, params.plot, params.previousNodeId],
      chainId: sepolia.id,
    });
  };

  /**
   * Get the admin/owner of the universe
   */
  const useGetAdmin = () => {
    return useReadContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'getAdmin',
      query: {
        enabled: !!universeAddress,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the associated governance token address
   */
  const useAssociatedToken = () => {
    return useReadContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'associatedToken',
      query: {
        enabled: !!universeAddress,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the universe name
   */
  const useName = () => {
    return useReadContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'universeName',
      query: {
        enabled: !!universeAddress,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the universe description
   */
  const useDescription = () => {
    return useReadContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'universeDescription',
      query: {
        enabled: !!universeAddress,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the universe image URL
   */
  const useImageURL = () => {
    return useReadContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'universeImageUrl',
      query: {
        enabled: !!universeAddress,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the latest node ID (total node count)
   */
  const useLatestNodeId = () => {
    return useReadContract({
      address: universeAddress,
      abi: universeAbi,
      functionName: 'latestNodeId',
      query: {
        enabled: !!universeAddress,
      },
      chainId: sepolia.id,
    });
  };

  return {
    createNode,
    useGetAdmin,
    useAssociatedToken,
    useName,
    useDescription,
    useImageURL,
    useLatestNodeId,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}
