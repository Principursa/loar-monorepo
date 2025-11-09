import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { universeManagerAbi } from '@loar/abis/generated';
import { UniverseManager } from '@loar/abis/addresses';
import { sepolia } from 'viem/chains';

/**
 * Hook for interacting with the UniverseManager contract (launchpad)
 *
 * Flow:
 * 1. createUniverse() - deploys a new Universe contract
 * 2. deployUniverseToken() - deploys token, governor, and sets up liquidity pool
 */
export function useUniverseManager() {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const contractAddress = UniverseManager[sepolia.id as keyof typeof UniverseManager];

  /**
   * Step 1: Create a new Universe contract
   * @param config - Universe configuration
   * @returns Transaction hash
   */
  const createUniverse = async (config: {
    name: string;
    imageURL: string;
    description: string;
    nodeCreationOptions: number; // 0 = OPEN, 1 = TOKEN_GATED, 2 = ADMIN_ONLY
    nodeVisibilityOptions: number; // 0 = PUBLIC, 1 = TOKEN_GATED
    initialOwner: `0x${string}`;
  }) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: universeManagerAbi,
      functionName: 'createUniverse',
      args: [
        config.name,
        config.imageURL,
        config.description,
        config.nodeCreationOptions,
        config.nodeVisibilityOptions,
        config.initialOwner,
      ],
      chainId: sepolia.id,
    });
  };

  /**
   * Step 2: Deploy token, governor, and liquidity pool for a universe
   * NOTE: This is a complex transaction that requires several config structs
   * @param config - Token deployment configuration
   * @param universeId - The ID returned from createUniverse()
   * @param value - ETH value to send (for liquidity)
   * @returns Transaction hash
   */
  const deployUniverseToken = async (
    config: {
      tokenConfig: {
        tokenAdmin: `0x${string}`;
        name: string;
        symbol: string;
        imageURL: string;
        metadata: string;
        context: string;
      };
      poolConfig: {
        hook: `0x${string}`;
        pairedToken: `0x${string}`;
        tickIfToken0IsLoar: number; // int24
        tickSpacing: number; // int24
        poolData: `0x${string}`;
      };
      lockerConfig: {
        locker: `0x${string}`;
        rewardAdmins: `0x${string}`[];
        rewardRecipients: `0x${string}`[];
        rewardBps: number[];
        tickLower: number[];
        tickUpper: number[];
        positionBps: number[];
        lockerData: `0x${string}`;
      };
    },
    universeId: bigint,
    value: bigint
  ) => {
    writeContract({
      address: contractAddress as `0x${string}`,
      abi: universeManagerAbi,
      functionName: 'deployUniverseToken',
      args: [
        {
          tokenConfig: config.tokenConfig,
          poolConfig: config.poolConfig,
          lockerConfig: config.lockerConfig,
        },
        universeId,
      ],
      value,
      chainId: sepolia.id,
    });
  };

  /**
   * Read function to get universe data by ID
   * Returns: [universeAddress, tokenAddress, governorAddress, hookAddress, lockerAddress]
   */
  const useGetUniverseData = (universeId: bigint | undefined) => {
    return useReadContract({
      address: contractAddress as `0x${string}`,
      abi: universeManagerAbi,
      functionName: 'getUniverseData',
      args: universeId !== undefined ? [universeId] : undefined,
      query: {
        enabled: universeId !== undefined,
      },
      chainId: sepolia.id,
    });
  };

  return {
    createUniverse,
    deployUniverseToken,
    useGetUniverseData,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Hook to get default deployment config for simplified token deployment
 * Uses the deployed hook, locker, and paired token addresses from packages/abis/addresses
 */
export function useDefaultDeploymentConfig() {
  // These should match your deployed contracts on Sepolia
  // Update these based on packages/abis/src/addresses.ts
  return {
    defaultHook: '0xc3afc04510600b9b69d5cbbe404b6713f3f7a8cc' as `0x${string}`, // LoarHookStaticFee
    defaultLocker: '0x7a8c6162bd525a1011852f3540d3dcfdd776335a' as `0x${string}`, // LoarLpLockerMultiple
    defaultPairedToken: '0x0000000000000000000000000000000000000000' as `0x${string}`, // ETH or WETH
    defaultTickSpacing: 60,
    defaultTickIfToken0IsLoar: -887220, // Example starting tick
  };
}
