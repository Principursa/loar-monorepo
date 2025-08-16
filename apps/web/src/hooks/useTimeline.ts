import {useReadContract, useWriteContract} from 'wagmi'
import { timelineAbi } from '@/generated'
import {useChainId} from 'wagmi'
import { TIMELINE_ADDRESSES, SupportedChainId} from '@/configs/addresses-test'


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

export function useGetMedia() {

}
export function useGetCanonChain() {

}


//-------WRITE FUNCTIONS--------

export function useCreateNode() {

}
export function useSetMedia() {

}
