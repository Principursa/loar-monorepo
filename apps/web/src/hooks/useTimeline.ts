import { useReadContract, useWriteContract } from 'wagmi'
import { timelineAbi } from '@/generated'
import { useChainId } from 'wagmi'
import { TIMELINE_ADDRESSES, type SupportedChainId } from '@/configs/addresses-test'


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
export function useGetTimeline() {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getTimeline",
  })
}

export function useGetLeaves() {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getLeaves",
  })
}

export function useGetMedia(nodeId: number) {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getMedia",
    args: [BigInt(nodeId)]
  })
}

export function useGetCanonChain() {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getCanonChain",
  })
}

export function useGetFullGraph() {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getFullGraph",
  })
}


//-------WRITE FUNCTIONS--------

export function useCreateNode(link: string, plot: string, previous: number) {
  const chainId = useChainId()
  const contract = useWriteContract()

  const writeAsync = (link: string, plot: string, previous: number) =>
    contract.writeContractAsync({
      abi: timelineAbi,
      address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
      functionName: 'createNode',
      args: [link, plot, BigInt(previous)] // link vid url, description, 0 
    })

  return { writeAsync }

}
export function useSetMedia() {

}
