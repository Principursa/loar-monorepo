import { useReadContract, useWriteContract } from 'wagmi'
import { timelineAbi } from '@/generated'
import { useChainId } from 'wagmi'
import { TIMELINE_ADDRESSES, SupportedChainId } from '@/configs/addresses-test'
import { TimelineEventNode } from '@/components/flow/TimelineNodes'


//----------READ FUNCTIONS---------
export function useGetNode(id: number) {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getNode",
    args: [id]
  })

}
export function useGetTimeline() {

}
export function useGetLeaves() {

}

export function useGetMedia(id: number) {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getMedia",
    args: [id]
  })

}
export function useGetCanonChain() {

}
export function useGetFullGraph() {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getFullGraph",
    args: []
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
      args: [link, plot, previous]
    })

  return { writeAsync }

}
export function useSetMedia() {

}
