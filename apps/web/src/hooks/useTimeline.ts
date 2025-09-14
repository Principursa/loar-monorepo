import { useReadContract, useWriteContract } from 'wagmi'
import { timelineAbi } from '@/generated'
import { useChainId } from 'wagmi'
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test'
import { TimelineEventNode } from '@/components/flow/TimelineNodes'
import { type Address } from 'viem'

//----------READ FUNCTIONS---------
export function useGetNode(id: number) {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getNode",
    args: [BigInt(id)]
  })
}
export function useGetTimeline(id: number) {
  const chainId = useChainId()
  
  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address,
    functionName: 'getTimeline',
    args: [BigInt(id)]
  })
}

export function useGetLeaves() {
  const chainId = useChainId()
  
  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address,
    functionName: 'getLeaves'
  })
}

export function useGetMedia(id: number) {
  const chainId = useChainId()
  
  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address,
    functionName: 'getMedia',
    args: [BigInt(id)]
  })
}

export function useGetCanonChain() {
  const chainId = useChainId()
  
  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address,
    functionName: 'getCanonChain'
  })
}

export function useGetFullGraph(timelineAddress?: string) {
  const chainId = useChainId()
  
  // Use provided address or fall back to default
  const address = timelineAddress || TIMELINE_ADDRESSES[chainId as SupportedChainId]
  
  return useReadContract({
    abi: timelineAbi,
    address: address as Address,
    functionName: 'getFullGraph',
    query: {
      enabled: !!address
    }
  })
}

//-------WRITE FUNCTIONS--------

export function useSetCanon() {
  const chainId = useChainId()
  const contract = useWriteContract()
  
  const writeAsync = (id: number) =>
    contract.writeContractAsync({
      abi: timelineAbi,
      address: TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address,
      functionName: 'setCanon',
      args: [BigInt(id)]
    })
  
  return { writeAsync }
}

export function useCreateNode(link: string, plot: string, previous: number) {
  // Force Sepolia chain ID (11155111)
  const contract = useWriteContract()

  const writeAsync = (link: string, plot: string, previous: number) =>
    contract.writeContractAsync({
      abi: timelineAbi,
      address: TIMELINE_ADDRESSES[11155111], // Explicitly use Sepolia
      functionName: 'createNode',
      args: [link, plot, BigInt(previous)],
      chainId: 11155111 // Force Sepolia chain ID
    })

  return { writeAsync }
}

export function useSetMedia() {
  const chainId = useChainId()
  const contract = useWriteContract()
  
  const writeAsync = (id: number, link: string) =>
    contract.writeContractAsync({
      abi: timelineAbi,
      address: TIMELINE_ADDRESSES[chainId as SupportedChainId] as Address,
      functionName: 'setMedia',
      args: [BigInt(id), link]
    })
  
  return { writeAsync }
}
