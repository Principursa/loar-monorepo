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
export function useGetTimeline(id: number) {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getTimeline",
    args: [id]
  })

}
export function useGetLeaves() {
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getLeaves",
    args: [],

  })
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
  const chainId = useChainId()

  return useReadContract({
    abi: timelineAbi,
    address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
    functionName: "getCanonChain"
  })

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
export function useSetMedia(id: number, link: string) {
  const chainId = useChainId()
  const contract = useWriteContract()

  const writeAsync = (id: number, link: string) =>
    contract.writeContractAsync({
      abi: timelineAbi,
      address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
      functionName: 'setMedia',
      args: [id, link]
    })

}
export function useSetCanon(id: number) {
  const chainId = useChainId()
  const contract = useWriteContract()

  const writeAsync = (id: number, link: string) =>
    contract.writeContractAsync({
      timelineAbi,
      address: TIMELINE_ADDRESSES[chainId as SupportedChainId],
      functionName: "setCanon",
      abi: [id]
    })
}
