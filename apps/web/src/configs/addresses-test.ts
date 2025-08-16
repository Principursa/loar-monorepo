export const TIMELINE_ADDRESSES = {
  11155111: "0x4d356429855af5ad6ea4bfe9537c62cac7020ced"
} as const 

export const UNIVERSEGOVERNANCE_ADDRESSES = {
  11155111 : "0xa7005d4c28328facf8a064d34d5f236a464e55c1"
} as const

export const ERC20GOVERNANCE_ADDRESSES = {
  11155111: "0x2b84355ced33f0877a339bf0bbafac1bc4c3e8d5"
}

export type SupportedChainId = keyof typeof TIMELINE_ADDRESSES
