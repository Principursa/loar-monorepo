import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from 'wagmi';
import { universeGovernorAbi } from '@loar/abis/generated';
import { sepolia } from 'viem/chains';
import { encodeAbiParameters, keccak256, toHex } from 'viem';

/**
 * Hook for interacting with a UniverseGovernor contract
 * Handles proposal creation, voting, and execution
 *
 * Usage:
 * const { propose, castVote, execute, ... } = useUniverseGovernor(governorAddress);
 */
export function useUniverseGovernor(governorAddress: `0x${string}` | undefined) {
  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  /**
   * Create a new governance proposal
   * @param targets - Array of target contract addresses
   * @param values - Array of ETH values to send
   * @param calldatas - Array of encoded function calls
   * @param description - Proposal description (used for proposal ID)
   */
  const propose = async (params: {
    targets: `0x${string}`[];
    values: bigint[];
    calldatas: `0x${string}`[];
    description: string;
  }) => {
    if (!governorAddress) {
      throw new Error('Governor address is required');
    }

    writeContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'propose',
      args: [params.targets, params.values, params.calldatas, params.description],
      chainId: sepolia.id,
    });
  };

  /**
   * Cast a vote on a proposal
   * @param proposalId - The proposal ID
   * @param support - 0 = Against, 1 = For, 2 = Abstain
   */
  const castVote = async (params: { proposalId: bigint; support: 0 | 1 | 2 }) => {
    if (!governorAddress) {
      throw new Error('Governor address is required');
    }

    writeContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'castVote',
      args: [params.proposalId, params.support],
      chainId: sepolia.id,
    });
  };

  /**
   * Cast a vote with a reason
   * @param proposalId - The proposal ID
   * @param support - 0 = Against, 1 = For, 2 = Abstain
   * @param reason - Reason for the vote
   */
  const castVoteWithReason = async (params: {
    proposalId: bigint;
    support: 0 | 1 | 2;
    reason: string;
  }) => {
    if (!governorAddress) {
      throw new Error('Governor address is required');
    }

    writeContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'castVoteWithReason',
      args: [params.proposalId, params.support, params.reason],
      chainId: sepolia.id,
    });
  };

  /**
   * Execute a proposal that has passed
   * @param targets - Array of target contract addresses
   * @param values - Array of ETH values to send
   * @param calldatas - Array of encoded function calls
   * @param descriptionHash - Keccak256 hash of the description
   */
  const execute = async (params: {
    targets: `0x${string}`[];
    values: bigint[];
    calldatas: `0x${string}`[];
    descriptionHash: `0x${string}`;
  }) => {
    if (!governorAddress) {
      throw new Error('Governor address is required');
    }

    writeContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'execute',
      args: [params.targets, params.values, params.calldatas, params.descriptionHash],
      chainId: sepolia.id,
    });
  };

  /**
   * Get the state of a proposal
   * Returns: 0=Pending, 1=Active, 2=Canceled, 3=Defeated, 4=Succeeded, 5=Queued, 6=Expired, 7=Executed
   */
  const useProposalState = (proposalId: bigint | undefined) => {
    return useReadContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'state',
      args: proposalId !== undefined ? [proposalId] : undefined,
      query: {
        enabled: !!governorAddress && proposalId !== undefined,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the voting power of an account at a specific block
   */
  const useGetVotes = (account: `0x${string}` | undefined, blockNumber: bigint | undefined) => {
    return useReadContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'getVotes',
      args: account && blockNumber !== undefined ? [account, blockNumber] : undefined,
      query: {
        enabled: !!governorAddress && !!account && blockNumber !== undefined,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Check if an account has voted on a proposal
   */
  const useHasVoted = (proposalId: bigint | undefined, account: `0x${string}` | undefined) => {
    return useReadContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'hasVoted',
      args: proposalId !== undefined && account ? [proposalId, account] : undefined,
      query: {
        enabled: !!governorAddress && proposalId !== undefined && !!account,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get proposal votes (for, against, abstain)
   */
  const useProposalVotes = (proposalId: bigint | undefined) => {
    return useReadContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'proposalVotes',
      args: proposalId !== undefined ? [proposalId] : undefined,
      query: {
        enabled: !!governorAddress && proposalId !== undefined,
      },
      chainId: sepolia.id,
    });
  };

  /**
   * Get the voting token address
   */
  const useToken = () => {
    return useReadContract({
      address: governorAddress,
      abi: universeGovernorAbi,
      functionName: 'token',
      query: {
        enabled: !!governorAddress,
      },
      chainId: sepolia.id,
    });
  };

  return {
    propose,
    castVote,
    castVoteWithReason,
    execute,
    useProposalState,
    useGetVotes,
    useHasVoted,
    useProposalVotes,
    useToken,
    hash,
    isPending,
    isConfirming,
    isSuccess,
    error,
  };
}

/**
 * Helper function to create a proposal for canonizing a node
 * This encodes a call to Universe.setCanon(nodeId)
 */
export function encodeCanonizeNodeProposal(universeAddress: `0x${string}`, nodeId: bigint) {
  // Import universeAbi for encoding
  const { universeAbi } = require('@loar/abis/generated');

  const calldata = encodeAbiParameters(
    universeAbi.find((f: any) => f.name === 'setCanon')?.inputs || [],
    [nodeId]
  );

  return {
    targets: [universeAddress],
    values: [0n],
    calldatas: [calldata],
    description: `Canonize Node #${nodeId}`,
  };
}
