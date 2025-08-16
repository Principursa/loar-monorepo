import {
  createUseReadContract,
  createUseWatchContractEvent,
  createUseWriteContract,
  createUseSimulateContract,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Address
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const addressAbi = [
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Checkpoints
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const checkpointsAbi = [
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ECDSA
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ecdsaAbi = [
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// EIP712
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const eip712Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC165
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc165Abi = [
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Permit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20PermitAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC2612ExpiredSignature',
  },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC2612InvalidSigner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ERC20Votes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const erc20VotesAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20ExceededSafeSupply',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const errorsAbi = [
  { type: 'error', inputs: [], name: 'FailedCall' },
  { type: 'error', inputs: [], name: 'FailedDeployment' },
  {
    type: 'error',
    inputs: [
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: '', internalType: 'address', type: 'address' }],
    name: 'MissingPrecompile',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GovernanceERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governanceErc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'pos', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'checkpoints',
    outputs: [
      {
        name: '',
        internalType: 'struct Checkpoints.Checkpoint208',
        type: 'tuple',
        components: [
          { name: '_key', internalType: 'uint48', type: 'uint48' },
          { name: '_value', internalType: 'uint208', type: 'uint208' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'numCheckpoints',
    outputs: [{ name: '', internalType: 'uint32', type: 'uint32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'increasedSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'cap', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20ExceededSafeSupply',
  },
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
  {
    type: 'error',
    inputs: [{ name: 'deadline', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC2612ExpiredSignature',
  },
  {
    type: 'error',
    inputs: [
      { name: 'signer', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC2612InvalidSigner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Governor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governorAbi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GovernorCountingSimple
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governorCountingSimpleAbi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalVotes',
    outputs: [
      { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
      { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
      { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GovernorSettings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governorSettingsAbi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newProposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setProposalThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newVotingDelay', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'setVotingDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newVotingPeriod', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldProposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newProposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalThresholdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVotingDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotingDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVotingPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotingPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingPeriodSet',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GovernorVotes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governorVotesAbi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IERC5805', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GovernorVotesQuorumFraction
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governorVotesQuorumFractionAbi = [
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumDenominator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumNumerator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumNumerator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IERC5805', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newQuorumNumerator', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateQuorumNumerator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldQuorumNumerator',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newQuorumNumerator',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'QuorumNumeratorUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [
      { name: 'quorumNumerator', internalType: 'uint256', type: 'uint256' },
      { name: 'quorumDenominator', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidQuorumFraction',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidApprover',
  },
  {
    type: 'error',
    inputs: [
      { name: 'idsLength', internalType: 'uint256', type: 'uint256' },
      { name: 'valuesLength', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC1155InvalidArrayLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC1155InvalidSender',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC1155MissingApprovalForAll',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1155Receiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1155ReceiverAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC1271
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc1271Abi = [
  {
    type: 'function',
    inputs: [
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'isValidSignature',
    outputs: [{ name: 'magicValue', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'allowance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientAllowance',
  },
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'balance', internalType: 'uint256', type: 'uint256' },
      { name: 'needed', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC20InsufficientBalance',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'spender', internalType: 'address', type: 'address' }],
    name: 'ERC20InvalidSpender',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Metadata
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20MetadataAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', internalType: 'uint8', type: 'uint8' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'to', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'owner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'spender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Approval',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      { name: 'to', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'value',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Transfer',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC20Permit
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc20PermitAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'DOMAIN_SEPARATOR',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'owner', internalType: 'address', type: 'address' },
      { name: 'spender', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'deadline', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'permit',
    outputs: [],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC5267
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc5267Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC5805
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc5805Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC6372
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc6372Abi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Errors
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ErrorsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'owner', internalType: 'address', type: 'address' },
    ],
    name: 'ERC721IncorrectOwner',
  },
  {
    type: 'error',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'ERC721InsufficientApproval',
  },
  {
    type: 'error',
    inputs: [{ name: 'approver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidApprover',
  },
  {
    type: 'error',
    inputs: [{ name: 'operator', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOperator',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'receiver', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidReceiver',
  },
  {
    type: 'error',
    inputs: [{ name: 'sender', internalType: 'address', type: 'address' }],
    name: 'ERC721InvalidSender',
  },
  {
    type: 'error',
    inputs: [{ name: 'tokenId', internalType: 'uint256', type: 'uint256' }],
    name: 'ERC721NonexistentToken',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC721Receiver
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc721ReceiverAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'operator', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'tokenId', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IERC7913SignatureVerifier
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ierc7913SignatureVerifierAbi = [
  {
    type: 'function',
    inputs: [
      { name: 'key', internalType: 'bytes', type: 'bytes' },
      { name: 'hash', internalType: 'bytes32', type: 'bytes32' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'verify',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'view',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iGovernorAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IMulticall3
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iMulticall3Abi = [
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'returnData', internalType: 'bytes[]', type: 'bytes[]' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call3Value[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'allowFailure', internalType: 'bool', type: 'bool' },
          { name: 'value', internalType: 'uint256', type: 'uint256' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'aggregate3Value',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'blockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBasefee',
    outputs: [{ name: 'basefee', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'blockNumber', internalType: 'uint256', type: 'uint256' }],
    name: 'getBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getBlockNumber',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getChainId',
    outputs: [{ name: 'chainid', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockCoinbase',
    outputs: [{ name: 'coinbase', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockDifficulty',
    outputs: [{ name: 'difficulty', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockGasLimit',
    outputs: [{ name: 'gaslimit', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCurrentBlockTimestamp',
    outputs: [{ name: 'timestamp', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'addr', internalType: 'address', type: 'address' }],
    name: 'getEthBalance',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLastBlockHash',
    outputs: [{ name: 'blockHash', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryAggregate',
    outputs: [
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'requireSuccess', internalType: 'bool', type: 'bool' },
      {
        name: 'calls',
        internalType: 'struct IMulticall3.Call[]',
        type: 'tuple[]',
        components: [
          { name: 'target', internalType: 'address', type: 'address' },
          { name: 'callData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    name: 'tryBlockAndAggregate',
    outputs: [
      { name: 'blockNumber', internalType: 'uint256', type: 'uint256' },
      { name: 'blockHash', internalType: 'bytes32', type: 'bytes32' },
      {
        name: 'returnData',
        internalType: 'struct IMulticall3.Result[]',
        type: 'tuple[]',
        components: [
          { name: 'success', internalType: 'bool', type: 'bool' },
          { name: 'returnData', internalType: 'bytes', type: 'bytes' },
        ],
      },
    ],
    stateMutability: 'payable',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// IVotes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const iVotesAbi = [
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Nonces
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const noncesAbi = [
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Ownable
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const ownableAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// SafeCast
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const safeCastAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'int256', type: 'int256' },
    ],
    name: 'SafeCastOverflowedIntDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'int256', type: 'int256' }],
    name: 'SafeCastOverflowedIntToUint',
  },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'value', internalType: 'uint256', type: 'uint256' }],
    name: 'SafeCastOverflowedUintToInt',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// ShortStrings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const shortStringsAbi = [
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Strings
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const stringsAbi = [
  {
    type: 'error',
    inputs: [
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'length', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'StringsInsufficientHexLength',
  },
  { type: 'error', inputs: [], name: 'StringsInvalidAddressFormat' },
  { type: 'error', inputs: [], name: 'StringsInvalidChar' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Timeline
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const timelineAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'initialOwner', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_link', internalType: 'string', type: 'string' },
      { name: '_plot', internalType: 'string', type: 'string' },
      { name: '_previous', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'createNode',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getCanonChain',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getLeaves',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getMedia',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getNode',
    outputs: [
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'string', type: 'string' },
      { name: '', internalType: 'string', type: 'string' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'fromId', internalType: 'uint256', type: 'uint256' }],
    name: 'getTimeline',
    outputs: [{ name: '', internalType: 'uint256[]', type: 'uint256[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'latestNodeId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'nodes',
    outputs: [
      { name: 'link', internalType: 'string', type: 'string' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: 'plot', internalType: 'string', type: 'string' },
      { name: 'previous', internalType: 'uint256', type: 'uint256' },
      { name: 'canon', internalType: 'bool', type: 'bool' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'setCanon',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: '_link', internalType: 'string', type: 'string' },
    ],
    name: 'setMedia',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
    ],
    name: 'NodeCanonized',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'previous',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'NodeCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'previousOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'newOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'OwnershipTransferred',
  },
  {
    type: 'error',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'OwnableInvalidOwner',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UniverseGovernor
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const universeGovernorAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_token', internalType: 'contract IVotes', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  { type: 'receive', stateMutability: 'payable' },
  {
    type: 'function',
    inputs: [],
    name: 'BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'COUNTING_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'EXTENDED_BALLOT_TYPEHASH',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'cancel',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
    ],
    name: 'castVote',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
    ],
    name: 'castVoteWithReason',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'support', internalType: 'uint8', type: 'uint8' },
      { name: 'voter', internalType: 'address', type: 'address' },
      { name: 'reason', internalType: 'string', type: 'string' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
      { name: 'signature', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'castVoteWithReasonAndParamsBySig',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'execute',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'getProposalId',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'params', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'getVotesWithParams',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'hasVoted',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'hashProposal',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [],
    name: 'name',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'uint256[]', type: 'uint256[]' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155BatchReceived',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC1155Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'address', type: 'address' },
      { name: '', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalDeadline',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalEta',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalNeedsQueuing',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalProposer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalSnapshot',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'proposalThreshold',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'proposalVotes',
    outputs: [
      { name: 'againstVotes', internalType: 'uint256', type: 'uint256' },
      { name: 'forVotes', internalType: 'uint256', type: 'uint256' },
      { name: 'abstainVotes', internalType: 'uint256', type: 'uint256' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'description', internalType: 'string', type: 'string' },
    ],
    name: 'propose',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'targets', internalType: 'address[]', type: 'address[]' },
      { name: 'values', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'calldatas', internalType: 'bytes[]', type: 'bytes[]' },
      { name: 'descriptionHash', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'queue',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorum',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumDenominator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'quorumNumerator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'quorumNumerator',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'target', internalType: 'address', type: 'address' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
      { name: 'data', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'relay',
    outputs: [],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'newProposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
      },
    ],
    name: 'setProposalThreshold',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newVotingDelay', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'setVotingDelay',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newVotingPeriod', internalType: 'uint32', type: 'uint32' },
    ],
    name: 'setVotingPeriod',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'state',
    outputs: [
      { name: '', internalType: 'enum IGovernor.ProposalState', type: 'uint8' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'token',
    outputs: [{ name: '', internalType: 'contract IERC5805', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'newQuorumNumerator', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'updateQuorumNumerator',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'version',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingDelay',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'votingPeriod',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalCanceled',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'proposer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'targets',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'values',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'signatures',
        internalType: 'string[]',
        type: 'string[]',
        indexed: false,
      },
      {
        name: 'calldatas',
        internalType: 'bytes[]',
        type: 'bytes[]',
        indexed: false,
      },
      {
        name: 'voteStart',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'voteEnd',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'description',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'ProposalCreated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalExecuted',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'etaSeconds',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalQueued',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldProposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newProposalThreshold',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ProposalThresholdSet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldQuorumNumerator',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newQuorumNumerator',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'QuorumNumeratorUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
    ],
    name: 'VoteCast',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'voter',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'proposalId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      { name: 'support', internalType: 'uint8', type: 'uint8', indexed: false },
      {
        name: 'weight',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'reason',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      { name: 'params', internalType: 'bytes', type: 'bytes', indexed: false },
    ],
    name: 'VoteCastWithParams',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVotingDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotingDelay',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingDelaySet',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldVotingPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotingPeriod',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'VotingPeriodSet',
  },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'FailedCall' },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorAlreadyCastVote',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorAlreadyQueuedProposal',
  },
  { type: 'error', inputs: [], name: 'GovernorDisabledDeposit' },
  {
    type: 'error',
    inputs: [
      { name: 'proposer', internalType: 'address', type: 'address' },
      { name: 'votes', internalType: 'uint256', type: 'uint256' },
      { name: 'threshold', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInsufficientProposerVotes',
  },
  {
    type: 'error',
    inputs: [
      { name: 'targets', internalType: 'uint256', type: 'uint256' },
      { name: 'calldatas', internalType: 'uint256', type: 'uint256' },
      { name: 'values', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidProposalLength',
  },
  {
    type: 'error',
    inputs: [
      { name: 'quorumNumerator', internalType: 'uint256', type: 'uint256' },
      { name: 'quorumDenominator', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidQuorumFraction',
  },
  {
    type: 'error',
    inputs: [{ name: 'voter', internalType: 'address', type: 'address' }],
    name: 'GovernorInvalidSignature',
  },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteParams' },
  { type: 'error', inputs: [], name: 'GovernorInvalidVoteType' },
  {
    type: 'error',
    inputs: [
      { name: 'votingPeriod', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'GovernorInvalidVotingPeriod',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNonexistentProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'proposalId', internalType: 'uint256', type: 'uint256' }],
    name: 'GovernorNotQueuedProposal',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyExecutor',
  },
  { type: 'error', inputs: [], name: 'GovernorQueueNotImplemented' },
  {
    type: 'error',
    inputs: [{ name: 'proposer', internalType: 'address', type: 'address' }],
    name: 'GovernorRestrictedProposer',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      { name: 'account', internalType: 'address', type: 'address' },
    ],
    name: 'GovernorUnableToCancel',
  },
  {
    type: 'error',
    inputs: [
      { name: 'proposalId', internalType: 'uint256', type: 'uint256' },
      {
        name: 'current',
        internalType: 'enum IGovernor.ProposalState',
        type: 'uint8',
      },
      { name: 'expectedStates', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'GovernorUnexpectedProposalState',
  },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Votes
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const votesAbi = [
  {
    type: 'function',
    inputs: [],
    name: 'CLOCK_MODE',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'clock',
    outputs: [{ name: '', internalType: 'uint48', type: 'uint48' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'delegatee', internalType: 'address', type: 'address' }],
    name: 'delegate',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'delegatee', internalType: 'address', type: 'address' },
      { name: 'nonce', internalType: 'uint256', type: 'uint256' },
      { name: 'expiry', internalType: 'uint256', type: 'uint256' },
      { name: 'v', internalType: 'uint8', type: 'uint8' },
      { name: 'r', internalType: 'bytes32', type: 'bytes32' },
      { name: 's', internalType: 'bytes32', type: 'bytes32' },
    ],
    name: 'delegateBySig',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'delegates',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'eip712Domain',
    outputs: [
      { name: 'fields', internalType: 'bytes1', type: 'bytes1' },
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'version', internalType: 'string', type: 'string' },
      { name: 'chainId', internalType: 'uint256', type: 'uint256' },
      { name: 'verifyingContract', internalType: 'address', type: 'address' },
      { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
      { name: 'extensions', internalType: 'uint256[]', type: 'uint256[]' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'timepoint', internalType: 'uint256', type: 'uint256' }],
    name: 'getPastTotalSupply',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'getPastVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'getVotes',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'owner', internalType: 'address', type: 'address' }],
    name: 'nonces',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegator',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'fromDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'toDelegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'DelegateChanged',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'delegate',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'previousVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'newVotes',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'DelegateVotesChanged',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'EIP712DomainChanged' },
  { type: 'error', inputs: [], name: 'CheckpointUnorderedInsertion' },
  { type: 'error', inputs: [], name: 'ECDSAInvalidSignature' },
  {
    type: 'error',
    inputs: [{ name: 'length', internalType: 'uint256', type: 'uint256' }],
    name: 'ECDSAInvalidSignatureLength',
  },
  {
    type: 'error',
    inputs: [{ name: 's', internalType: 'bytes32', type: 'bytes32' }],
    name: 'ECDSAInvalidSignatureS',
  },
  {
    type: 'error',
    inputs: [
      { name: 'timepoint', internalType: 'uint256', type: 'uint256' },
      { name: 'clock', internalType: 'uint48', type: 'uint48' },
    ],
    name: 'ERC5805FutureLookup',
  },
  { type: 'error', inputs: [], name: 'ERC6372InconsistentClock' },
  {
    type: 'error',
    inputs: [
      { name: 'account', internalType: 'address', type: 'address' },
      { name: 'currentNonce', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'InvalidAccountNonce',
  },
  { type: 'error', inputs: [], name: 'InvalidShortString' },
  {
    type: 'error',
    inputs: [
      { name: 'bits', internalType: 'uint8', type: 'uint8' },
      { name: 'value', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'SafeCastOverflowedUintDowncast',
  },
  {
    type: 'error',
    inputs: [{ name: 'str', internalType: 'string', type: 'string' }],
    name: 'StringTooLong',
  },
  {
    type: 'error',
    inputs: [{ name: 'expiry', internalType: 'uint256', type: 'uint256' }],
    name: 'VotesExpiredSignature',
  },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eip712Abi}__
 */
export const useEip712__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: eip712Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link eip712Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useEip712__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: eip712Abi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link eip712Abi}__
 */
export const useEip712__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: eip712Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link eip712Abi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useEip712__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: eip712Abi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165Abi}__
 */
export const useErc165__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: erc165Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc165Abi}__ and `functionName` set to `"supportsInterface"`
 */
export const useErc165__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc165Abi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useErc20__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useErc20__Allowance__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'allowance',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useErc20__BalanceOf__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'balanceOf',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useErc20__Decimals__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'decimals',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"name"`
 */
export const useErc20__Name__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useErc20__Symbol__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useErc20__TotalSupply__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20Abi,
  functionName: 'totalSupply',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useErc20__undefined__write = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useErc20__Approve__write = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'approve',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useErc20__Transfer__write = /*#__PURE__*/ createUseWriteContract({
  abi: erc20Abi,
  functionName: 'transfer',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useErc20__TransferFrom__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__
 */
export const useErc20__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc20Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"approve"`
 */
export const useErc20__Approve__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useErc20__Transfer__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useErc20__TransferFrom__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__
 */
export const useErc20__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc20Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useErc20__Approval__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useErc20__Transfer__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__
 */
export const useErc20Permit__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: erc20PermitAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useErc20Permit__DomainSeparator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20PermitAbi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"allowance"`
 */
export const useErc20Permit__Allowance__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20PermitAbi,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useErc20Permit__BalanceOf__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20PermitAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"decimals"`
 */
export const useErc20Permit__Decimals__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20PermitAbi,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useErc20Permit__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20PermitAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"name"`
 */
export const useErc20Permit__Name__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20PermitAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"nonces"`
 */
export const useErc20Permit__Nonces__read = /*#__PURE__*/ createUseReadContract(
  { abi: erc20PermitAbi, functionName: 'nonces' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"symbol"`
 */
export const useErc20Permit__Symbol__read = /*#__PURE__*/ createUseReadContract(
  { abi: erc20PermitAbi, functionName: 'symbol' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useErc20Permit__TotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20PermitAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PermitAbi}__
 */
export const useErc20Permit__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: erc20PermitAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"approve"`
 */
export const useErc20Permit__Approve__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20PermitAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"permit"`
 */
export const useErc20Permit__Permit__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20PermitAbi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"transfer"`
 */
export const useErc20Permit__Transfer__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20PermitAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useErc20Permit__TransferFrom__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20PermitAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PermitAbi}__
 */
export const useErc20Permit__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc20PermitAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"approve"`
 */
export const useErc20Permit__Approve__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20PermitAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"permit"`
 */
export const useErc20Permit__Permit__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20PermitAbi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"transfer"`
 */
export const useErc20Permit__Transfer__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20PermitAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20PermitAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useErc20Permit__TransferFrom__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20PermitAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20PermitAbi}__
 */
export const useErc20Permit__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc20PermitAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20PermitAbi}__ and `eventName` set to `"Approval"`
 */
export const useErc20Permit__Approval__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20PermitAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20PermitAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useErc20Permit__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20PermitAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20PermitAbi}__ and `eventName` set to `"Transfer"`
 */
export const useErc20Permit__Transfer__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20PermitAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__
 */
export const useErc20Votes__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: erc20VotesAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useErc20Votes__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"allowance"`
 */
export const useErc20Votes__Allowance__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useErc20Votes__BalanceOf__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"checkpoints"`
 */
export const useErc20Votes__Checkpoints__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'checkpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"clock"`
 */
export const useErc20Votes__Clock__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20VotesAbi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"decimals"`
 */
export const useErc20Votes__Decimals__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"delegates"`
 */
export const useErc20Votes__Delegates__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'delegates',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useErc20Votes__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useErc20Votes__GetPastTotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"getPastVotes"`
 */
export const useErc20Votes__GetPastVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'getPastVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"getVotes"`
 */
export const useErc20Votes__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"name"`
 */
export const useErc20Votes__Name__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20VotesAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"nonces"`
 */
export const useErc20Votes__Nonces__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20VotesAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"numCheckpoints"`
 */
export const useErc20Votes__NumCheckpoints__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'numCheckpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"symbol"`
 */
export const useErc20Votes__Symbol__read = /*#__PURE__*/ createUseReadContract({
  abi: erc20VotesAbi,
  functionName: 'symbol',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useErc20Votes__TotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: erc20VotesAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20VotesAbi}__
 */
export const useErc20Votes__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: erc20VotesAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"approve"`
 */
export const useErc20Votes__Approve__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20VotesAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"delegate"`
 */
export const useErc20Votes__Delegate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20VotesAbi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useErc20Votes__DelegateBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20VotesAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"transfer"`
 */
export const useErc20Votes__Transfer__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20VotesAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useErc20Votes__TransferFrom__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: erc20VotesAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20VotesAbi}__
 */
export const useErc20Votes__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: erc20VotesAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"approve"`
 */
export const useErc20Votes__Approve__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20VotesAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"delegate"`
 */
export const useErc20Votes__Delegate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20VotesAbi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useErc20Votes__DelegateBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20VotesAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"transfer"`
 */
export const useErc20Votes__Transfer__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20VotesAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link erc20VotesAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useErc20Votes__TransferFrom__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: erc20VotesAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20VotesAbi}__
 */
export const useErc20Votes__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: erc20VotesAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20VotesAbi}__ and `eventName` set to `"Approval"`
 */
export const useErc20Votes__Approval__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20VotesAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20VotesAbi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useErc20Votes__DelegateChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20VotesAbi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20VotesAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useErc20Votes__DelegateVotesChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20VotesAbi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20VotesAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useErc20Votes__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20VotesAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link erc20VotesAbi}__ and `eventName` set to `"Transfer"`
 */
export const useErc20Votes__Transfer__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: erc20VotesAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernanceErc20__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useGovernanceErc20__DomainSeparator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useGovernanceErc20__Allowance__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useGovernanceErc20__BalanceOf__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"checkpoints"`
 */
export const useGovernanceErc20__Checkpoints__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'checkpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"clock"`
 */
export const useGovernanceErc20__Clock__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useGovernanceErc20__Decimals__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegates"`
 */
export const useGovernanceErc20__Delegates__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'delegates',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernanceErc20__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useGovernanceErc20__GetPastTotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"getPastVotes"`
 */
export const useGovernanceErc20__GetPastVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'getPastVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernanceErc20__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"name"`
 */
export const useGovernanceErc20__Name__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"nonces"`
 */
export const useGovernanceErc20__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"numCheckpoints"`
 */
export const useGovernanceErc20__NumCheckpoints__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'numCheckpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useGovernanceErc20__Symbol__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'symbol',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useGovernanceErc20__TotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useGovernanceErc20__Approve__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegate"`
 */
export const useGovernanceErc20__Delegate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegateBySig"`
 */
export const useGovernanceErc20__DelegateBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"permit"`
 */
export const useGovernanceErc20__Permit__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useGovernanceErc20__Transfer__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useGovernanceErc20__TransferFrom__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useGovernanceErc20__Approve__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegate"`
 */
export const useGovernanceErc20__Delegate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegateBySig"`
 */
export const useGovernanceErc20__DelegateBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"permit"`
 */
export const useGovernanceErc20__Permit__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useGovernanceErc20__Transfer__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useGovernanceErc20__TransferFrom__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useGovernanceErc20__Approval__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useGovernanceErc20__DelegateChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useGovernanceErc20__DelegateVotesChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernanceErc20__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useGovernanceErc20__Transfer__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__
 */
export const useGovernor__undefined__read = /*#__PURE__*/ createUseReadContract(
  { abi: governorAbi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useGovernor__BallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernor__ClockMode__read = /*#__PURE__*/ createUseReadContract(
  { abi: governorAbi, functionName: 'CLOCK_MODE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useGovernor__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useGovernor__ExtendedBallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"clock"`
 */
export const useGovernor__Clock__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernor__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useGovernor__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernor__GetVotes__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'getVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useGovernor__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useGovernor__HasVoted__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'hasVoted',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useGovernor__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"name"`
 */
export const useGovernor__Name__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"nonces"`
 */
export const useGovernor__Nonces__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useGovernor__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useGovernor__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useGovernor__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useGovernor__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useGovernor__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useGovernor__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"quorum"`
 */
export const useGovernor__Quorum__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'quorum',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"state"`
 */
export const useGovernor__State__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'state',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useGovernor__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"version"`
 */
export const useGovernor__Version__read = /*#__PURE__*/ createUseReadContract({
  abi: governorAbi,
  functionName: 'version',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useGovernor__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useGovernor__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__
 */
export const useGovernor__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: governorAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernor__Cancel__write = /*#__PURE__*/ createUseWriteContract({
  abi: governorAbi,
  functionName: 'cancel',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernor__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernor__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernor__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernor__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernor__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernor__Execute__write = /*#__PURE__*/ createUseWriteContract(
  { abi: governorAbi, functionName: 'execute' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernor__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernor__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernor__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernor__Propose__write = /*#__PURE__*/ createUseWriteContract(
  { abi: governorAbi, functionName: 'propose' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernor__Queue__write = /*#__PURE__*/ createUseWriteContract({
  abi: governorAbi,
  functionName: 'queue',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernor__Relay__write = /*#__PURE__*/ createUseWriteContract({
  abi: governorAbi,
  functionName: 'relay',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__
 */
export const useGovernor__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: governorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernor__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernor__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernor__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernor__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernor__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernor__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernor__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernor__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernor__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernor__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernor__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernor__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernor__Relay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__
 */
export const useGovernor__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: governorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernor__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useGovernor__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useGovernor__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useGovernor__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useGovernor__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useGovernor__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useGovernor__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__
 */
export const useGovernorCountingSimple__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: governorCountingSimpleAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useGovernorCountingSimple__BallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernorCountingSimple__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useGovernorCountingSimple__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useGovernorCountingSimple__ExtendedBallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"clock"`
 */
export const useGovernorCountingSimple__Clock__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernorCountingSimple__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useGovernorCountingSimple__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernorCountingSimple__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useGovernorCountingSimple__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useGovernorCountingSimple__HasVoted__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'hasVoted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useGovernorCountingSimple__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"name"`
 */
export const useGovernorCountingSimple__Name__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"nonces"`
 */
export const useGovernorCountingSimple__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useGovernorCountingSimple__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useGovernorCountingSimple__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useGovernorCountingSimple__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useGovernorCountingSimple__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useGovernorCountingSimple__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useGovernorCountingSimple__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"proposalVotes"`
 */
export const useGovernorCountingSimple__ProposalVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'proposalVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"quorum"`
 */
export const useGovernorCountingSimple__Quorum__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'quorum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"state"`
 */
export const useGovernorCountingSimple__State__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'state',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useGovernorCountingSimple__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"version"`
 */
export const useGovernorCountingSimple__Version__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useGovernorCountingSimple__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useGovernorCountingSimple__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorCountingSimpleAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__
 */
export const useGovernorCountingSimple__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: governorCountingSimpleAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorCountingSimple__Cancel__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorCountingSimple__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorCountingSimple__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorCountingSimple__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorCountingSimple__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorCountingSimple__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorCountingSimple__Execute__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorCountingSimple__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorCountingSimple__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorCountingSimple__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorCountingSimple__Propose__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorCountingSimple__Queue__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorCountingSimple__Relay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorCountingSimpleAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__
 */
export const useGovernorCountingSimple__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: governorCountingSimpleAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorCountingSimple__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorCountingSimple__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorCountingSimple__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorCountingSimple__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorCountingSimple__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorCountingSimple__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorCountingSimple__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorCountingSimple__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorCountingSimple__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorCountingSimple__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorCountingSimple__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorCountingSimple__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorCountingSimple__Relay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorCountingSimpleAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__
 */
export const useGovernorCountingSimple__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: governorCountingSimpleAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernorCountingSimple__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useGovernorCountingSimple__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useGovernorCountingSimple__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useGovernorCountingSimple__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useGovernorCountingSimple__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useGovernorCountingSimple__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorCountingSimpleAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useGovernorCountingSimple__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorCountingSimpleAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__
 */
export const useGovernorSettings__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: governorSettingsAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useGovernorSettings__BallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernorSettings__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useGovernorSettings__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useGovernorSettings__ExtendedBallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"clock"`
 */
export const useGovernorSettings__Clock__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernorSettings__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useGovernorSettings__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernorSettings__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useGovernorSettings__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useGovernorSettings__HasVoted__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'hasVoted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useGovernorSettings__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"name"`
 */
export const useGovernorSettings__Name__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"nonces"`
 */
export const useGovernorSettings__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useGovernorSettings__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useGovernorSettings__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useGovernorSettings__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useGovernorSettings__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useGovernorSettings__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useGovernorSettings__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"quorum"`
 */
export const useGovernorSettings__Quorum__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'quorum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"state"`
 */
export const useGovernorSettings__State__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'state',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useGovernorSettings__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"version"`
 */
export const useGovernorSettings__Version__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useGovernorSettings__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useGovernorSettings__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorSettingsAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__
 */
export const useGovernorSettings__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: governorSettingsAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorSettings__Cancel__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorSettings__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorSettings__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorSettings__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorSettings__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorSettings__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorSettings__Execute__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorSettings__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorSettings__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorSettings__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorSettings__Propose__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorSettings__Queue__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorSettings__Relay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"setProposalThreshold"`
 */
export const useGovernorSettings__SetProposalThreshold__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'setProposalThreshold',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"setVotingDelay"`
 */
export const useGovernorSettings__SetVotingDelay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'setVotingDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"setVotingPeriod"`
 */
export const useGovernorSettings__SetVotingPeriod__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorSettingsAbi,
    functionName: 'setVotingPeriod',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__
 */
export const useGovernorSettings__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: governorSettingsAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorSettings__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorSettings__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorSettings__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorSettings__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorSettings__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorSettings__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorSettings__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorSettings__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorSettings__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorSettings__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorSettings__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorSettings__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorSettings__Relay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"setProposalThreshold"`
 */
export const useGovernorSettings__SetProposalThreshold__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'setProposalThreshold',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"setVotingDelay"`
 */
export const useGovernorSettings__SetVotingDelay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'setVotingDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorSettingsAbi}__ and `functionName` set to `"setVotingPeriod"`
 */
export const useGovernorSettings__SetVotingPeriod__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorSettingsAbi,
    functionName: 'setVotingPeriod',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__
 */
export const useGovernorSettings__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: governorSettingsAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernorSettings__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useGovernorSettings__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useGovernorSettings__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useGovernorSettings__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useGovernorSettings__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"ProposalThresholdSet"`
 */
export const useGovernorSettings__ProposalThresholdSet__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'ProposalThresholdSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useGovernorSettings__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useGovernorSettings__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"VotingDelaySet"`
 */
export const useGovernorSettings__VotingDelaySet__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'VotingDelaySet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorSettingsAbi}__ and `eventName` set to `"VotingPeriodSet"`
 */
export const useGovernorSettings__VotingPeriodSet__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorSettingsAbi,
    eventName: 'VotingPeriodSet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__
 */
export const useGovernorVotes__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: governorVotesAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useGovernorVotes__BallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernorVotes__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useGovernorVotes__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useGovernorVotes__ExtendedBallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"clock"`
 */
export const useGovernorVotes__Clock__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernorVotes__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useGovernorVotes__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernorVotes__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useGovernorVotes__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useGovernorVotes__HasVoted__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'hasVoted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useGovernorVotes__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"name"`
 */
export const useGovernorVotes__Name__read = /*#__PURE__*/ createUseReadContract(
  { abi: governorVotesAbi, functionName: 'name' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"nonces"`
 */
export const useGovernorVotes__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useGovernorVotes__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useGovernorVotes__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useGovernorVotes__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useGovernorVotes__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useGovernorVotes__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useGovernorVotes__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"quorum"`
 */
export const useGovernorVotes__Quorum__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'quorum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"state"`
 */
export const useGovernorVotes__State__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'state',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useGovernorVotes__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"token"`
 */
export const useGovernorVotes__Token__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'token',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"version"`
 */
export const useGovernorVotes__Version__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useGovernorVotes__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useGovernorVotes__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__
 */
export const useGovernorVotes__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: governorVotesAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorVotes__Cancel__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorVotes__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorVotes__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorVotes__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorVotes__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorVotes__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorVotes__Execute__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorVotes__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorVotes__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorVotes__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorVotes__Propose__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorVotes__Queue__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorVotes__Relay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__
 */
export const useGovernorVotes__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: governorVotesAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorVotes__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorVotes__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorVotes__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorVotes__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorVotes__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorVotes__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorVotes__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorVotes__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorVotes__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorVotes__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorVotes__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorVotes__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorVotes__Relay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__
 */
export const useGovernorVotes__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: governorVotesAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernorVotes__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useGovernorVotes__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useGovernorVotes__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useGovernorVotes__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useGovernorVotes__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useGovernorVotes__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useGovernorVotes__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__
 */
export const useGovernorVotesQuorumFraction__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: governorVotesQuorumFractionAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useGovernorVotesQuorumFraction__BallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernorVotesQuorumFraction__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useGovernorVotesQuorumFraction__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useGovernorVotesQuorumFraction__ExtendedBallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"clock"`
 */
export const useGovernorVotesQuorumFraction__Clock__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernorVotesQuorumFraction__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useGovernorVotesQuorumFraction__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernorVotesQuorumFraction__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useGovernorVotesQuorumFraction__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useGovernorVotesQuorumFraction__HasVoted__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'hasVoted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useGovernorVotesQuorumFraction__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"name"`
 */
export const useGovernorVotesQuorumFraction__Name__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"nonces"`
 */
export const useGovernorVotesQuorumFraction__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useGovernorVotesQuorumFraction__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useGovernorVotesQuorumFraction__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useGovernorVotesQuorumFraction__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useGovernorVotesQuorumFraction__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useGovernorVotesQuorumFraction__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useGovernorVotesQuorumFraction__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"quorum"`
 */
export const useGovernorVotesQuorumFraction__Quorum__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'quorum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"quorumDenominator"`
 */
export const useGovernorVotesQuorumFraction__QuorumDenominator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'quorumDenominator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"quorumNumerator"`
 */
export const useGovernorVotesQuorumFraction__QuorumNumerator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'quorumNumerator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"state"`
 */
export const useGovernorVotesQuorumFraction__State__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'state',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useGovernorVotesQuorumFraction__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"token"`
 */
export const useGovernorVotesQuorumFraction__Token__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'token',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"version"`
 */
export const useGovernorVotesQuorumFraction__Version__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useGovernorVotesQuorumFraction__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useGovernorVotesQuorumFraction__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__
 */
export const useGovernorVotesQuorumFraction__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: governorVotesQuorumFractionAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorVotesQuorumFraction__Cancel__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorVotesQuorumFraction__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorVotesQuorumFraction__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorVotesQuorumFraction__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorVotesQuorumFraction__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorVotesQuorumFraction__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorVotesQuorumFraction__Execute__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorVotesQuorumFraction__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorVotesQuorumFraction__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorVotesQuorumFraction__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorVotesQuorumFraction__Propose__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorVotesQuorumFraction__Queue__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorVotesQuorumFraction__Relay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"updateQuorumNumerator"`
 */
export const useGovernorVotesQuorumFraction__UpdateQuorumNumerator__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'updateQuorumNumerator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__
 */
export const useGovernorVotesQuorumFraction__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"cancel"`
 */
export const useGovernorVotesQuorumFraction__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVote"`
 */
export const useGovernorVotesQuorumFraction__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useGovernorVotesQuorumFraction__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useGovernorVotesQuorumFraction__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useGovernorVotesQuorumFraction__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useGovernorVotesQuorumFraction__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"execute"`
 */
export const useGovernorVotesQuorumFraction__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useGovernorVotesQuorumFraction__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useGovernorVotesQuorumFraction__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useGovernorVotesQuorumFraction__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"propose"`
 */
export const useGovernorVotesQuorumFraction__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"queue"`
 */
export const useGovernorVotesQuorumFraction__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"relay"`
 */
export const useGovernorVotesQuorumFraction__Relay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `functionName` set to `"updateQuorumNumerator"`
 */
export const useGovernorVotesQuorumFraction__UpdateQuorumNumerator__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governorVotesQuorumFractionAbi,
    functionName: 'updateQuorumNumerator',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__
 */
export const useGovernorVotesQuorumFraction__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernorVotesQuorumFraction__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useGovernorVotesQuorumFraction__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useGovernorVotesQuorumFraction__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useGovernorVotesQuorumFraction__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useGovernorVotesQuorumFraction__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"QuorumNumeratorUpdated"`
 */
export const useGovernorVotesQuorumFraction__QuorumNumeratorUpdated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'QuorumNumeratorUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useGovernorVotesQuorumFraction__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governorVotesQuorumFractionAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useGovernorVotesQuorumFraction__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governorVotesQuorumFractionAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const useIerc1155Receiver__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: ierc1155ReceiverAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useIerc1155Receiver__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const useIerc1155Receiver__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc1155ReceiverAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useIerc1155Receiver__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useIerc1155Receiver__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__
 */
export const useIerc1155Receiver__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc1155ReceiverAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useIerc1155Receiver__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc1155ReceiverAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useIerc1155Receiver__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc1155ReceiverAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1271Abi}__
 */
export const useIerc1271__undefined__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc1271Abi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc1271Abi}__ and `functionName` set to `"isValidSignature"`
 */
export const useIerc1271__IsValidSignature__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc1271Abi,
    functionName: 'isValidSignature',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useIerc20Metadata__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: ierc20MetadataAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"allowance"`
 */
export const useIerc20Metadata__Allowance__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"balanceOf"`
 */
export const useIerc20Metadata__BalanceOf__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"decimals"`
 */
export const useIerc20Metadata__Decimals__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"name"`
 */
export const useIerc20Metadata__Name__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"symbol"`
 */
export const useIerc20Metadata__Symbol__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'symbol',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"totalSupply"`
 */
export const useIerc20Metadata__TotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20MetadataAbi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useIerc20Metadata__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc20MetadataAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const useIerc20Metadata__Approve__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const useIerc20Metadata__Transfer__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useIerc20Metadata__TransferFrom__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20MetadataAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useIerc20Metadata__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc20MetadataAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"approve"`
 */
export const useIerc20Metadata__Approve__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transfer"`
 */
export const useIerc20Metadata__Transfer__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `functionName` set to `"transferFrom"`
 */
export const useIerc20Metadata__TransferFrom__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20MetadataAbi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__
 */
export const useIerc20Metadata__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ierc20MetadataAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Approval"`
 */
export const useIerc20Metadata__Approval__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc20MetadataAbi}__ and `eventName` set to `"Transfer"`
 */
export const useIerc20Metadata__Transfer__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc20MetadataAbi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20PermitAbi}__
 */
export const useIerc20Permit__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: ierc20PermitAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useIerc20Permit__DomainSeparator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20PermitAbi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"nonces"`
 */
export const useIerc20Permit__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc20PermitAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20PermitAbi}__
 */
export const useIerc20Permit__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc20PermitAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"permit"`
 */
export const useIerc20Permit__Permit__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc20PermitAbi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20PermitAbi}__
 */
export const useIerc20Permit__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc20PermitAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc20PermitAbi}__ and `functionName` set to `"permit"`
 */
export const useIerc20Permit__Permit__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc20PermitAbi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5267Abi}__
 */
export const useIerc5267__undefined__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc5267Abi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5267Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useIerc5267__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc5267Abi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc5267Abi}__
 */
export const useIerc5267__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ierc5267Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc5267Abi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useIerc5267__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc5267Abi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__
 */
export const useIerc5805__undefined__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc5805Abi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useIerc5805__ClockMode__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc5805Abi, functionName: 'CLOCK_MODE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"clock"`
 */
export const useIerc5805__Clock__read = /*#__PURE__*/ createUseReadContract({
  abi: ierc5805Abi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"delegates"`
 */
export const useIerc5805__Delegates__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc5805Abi, functionName: 'delegates' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useIerc5805__GetPastTotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc5805Abi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"getPastVotes"`
 */
export const useIerc5805__GetPastVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc5805Abi,
    functionName: 'getPastVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"getVotes"`
 */
export const useIerc5805__GetVotes__read = /*#__PURE__*/ createUseReadContract({
  abi: ierc5805Abi,
  functionName: 'getVotes',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc5805Abi}__
 */
export const useIerc5805__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc5805Abi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"delegate"`
 */
export const useIerc5805__Delegate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc5805Abi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"delegateBySig"`
 */
export const useIerc5805__DelegateBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc5805Abi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc5805Abi}__
 */
export const useIerc5805__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc5805Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"delegate"`
 */
export const useIerc5805__Delegate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc5805Abi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc5805Abi}__ and `functionName` set to `"delegateBySig"`
 */
export const useIerc5805__DelegateBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc5805Abi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc5805Abi}__
 */
export const useIerc5805__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ierc5805Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc5805Abi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useIerc5805__DelegateChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc5805Abi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ierc5805Abi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useIerc5805__DelegateVotesChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ierc5805Abi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc6372Abi}__
 */
export const useIerc6372__undefined__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc6372Abi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc6372Abi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useIerc6372__ClockMode__read = /*#__PURE__*/ createUseReadContract(
  { abi: ierc6372Abi, functionName: 'CLOCK_MODE' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc6372Abi}__ and `functionName` set to `"clock"`
 */
export const useIerc6372__Clock__read = /*#__PURE__*/ createUseReadContract({
  abi: ierc6372Abi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__
 */
export const useIerc721Receiver__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: ierc721ReceiverAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useIerc721Receiver__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ierc721ReceiverAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__
 */
export const useIerc721Receiver__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: ierc721ReceiverAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ierc721ReceiverAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useIerc721Receiver__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ierc721ReceiverAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc7913SignatureVerifierAbi}__
 */
export const useIerc7913SignatureVerifier__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: ierc7913SignatureVerifierAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ierc7913SignatureVerifierAbi}__ and `functionName` set to `"verify"`
 */
export const useIerc7913SignatureVerifier__Verify__read =
  /*#__PURE__*/ createUseReadContract({
    abi: ierc7913SignatureVerifierAbi,
    functionName: 'verify',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__
 */
export const useIGovernor__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: iGovernorAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useIGovernor__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useIGovernor__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"clock"`
 */
export const useIGovernor__Clock__read = /*#__PURE__*/ createUseReadContract({
  abi: iGovernorAbi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useIGovernor__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"getVotes"`
 */
export const useIGovernor__GetVotes__read = /*#__PURE__*/ createUseReadContract(
  { abi: iGovernorAbi, functionName: 'getVotes' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useIGovernor__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useIGovernor__HasVoted__read = /*#__PURE__*/ createUseReadContract(
  { abi: iGovernorAbi, functionName: 'hasVoted' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useIGovernor__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"name"`
 */
export const useIGovernor__Name__read = /*#__PURE__*/ createUseReadContract({
  abi: iGovernorAbi,
  functionName: 'name',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useIGovernor__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useIGovernor__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useIGovernor__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useIGovernor__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useIGovernor__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useIGovernor__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"quorum"`
 */
export const useIGovernor__Quorum__read = /*#__PURE__*/ createUseReadContract({
  abi: iGovernorAbi,
  functionName: 'quorum',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"state"`
 */
export const useIGovernor__State__read = /*#__PURE__*/ createUseReadContract({
  abi: iGovernorAbi,
  functionName: 'state',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useIGovernor__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"version"`
 */
export const useIGovernor__Version__read = /*#__PURE__*/ createUseReadContract({
  abi: iGovernorAbi,
  functionName: 'version',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useIGovernor__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useIGovernor__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iGovernorAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__
 */
export const useIGovernor__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: iGovernorAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"cancel"`
 */
export const useIGovernor__Cancel__write = /*#__PURE__*/ createUseWriteContract(
  { abi: iGovernorAbi, functionName: 'cancel' },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const useIGovernor__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useIGovernor__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useIGovernor__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useIGovernor__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useIGovernor__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const useIGovernor__Execute__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const useIGovernor__Propose__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iGovernorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"queue"`
 */
export const useIGovernor__Queue__write = /*#__PURE__*/ createUseWriteContract({
  abi: iGovernorAbi,
  functionName: 'queue',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__
 */
export const useIGovernor__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: iGovernorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"cancel"`
 */
export const useIGovernor__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const useIGovernor__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useIGovernor__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useIGovernor__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useIGovernor__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useIGovernor__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const useIGovernor__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const useIGovernor__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iGovernorAbi}__ and `functionName` set to `"queue"`
 */
export const useIGovernor__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iGovernorAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__
 */
export const useIGovernor__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iGovernorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useIGovernor__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iGovernorAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useIGovernor__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iGovernorAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useIGovernor__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iGovernorAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useIGovernor__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iGovernorAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useIGovernor__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iGovernorAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iGovernorAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useIGovernor__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iGovernorAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useIMulticall3__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: iMulticall3Abi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBasefee"`
 */
export const useIMulticall3__GetBasefee__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBasefee',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockHash"`
 */
export const useIMulticall3__GetBlockHash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBlockHash',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getBlockNumber"`
 */
export const useIMulticall3__GetBlockNumber__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getBlockNumber',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getChainId"`
 */
export const useIMulticall3__GetChainId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getChainId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockCoinbase"`
 */
export const useIMulticall3__GetCurrentBlockCoinbase__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockCoinbase',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockDifficulty"`
 */
export const useIMulticall3__GetCurrentBlockDifficulty__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockDifficulty',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockGasLimit"`
 */
export const useIMulticall3__GetCurrentBlockGasLimit__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockGasLimit',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getCurrentBlockTimestamp"`
 */
export const useIMulticall3__GetCurrentBlockTimestamp__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getCurrentBlockTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getEthBalance"`
 */
export const useIMulticall3__GetEthBalance__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getEthBalance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"getLastBlockHash"`
 */
export const useIMulticall3__GetLastBlockHash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iMulticall3Abi,
    functionName: 'getLastBlockHash',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useIMulticall3__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: iMulticall3Abi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useIMulticall3__Aggregate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useIMulticall3__Aggregate3__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useIMulticall3__Aggregate3Value__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useIMulticall3__BlockAndAggregate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useIMulticall3__TryAggregate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useIMulticall3__TryBlockAndAggregate__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__
 */
export const useIMulticall3__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: iMulticall3Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate"`
 */
export const useIMulticall3__Aggregate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3"`
 */
export const useIMulticall3__Aggregate3__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"aggregate3Value"`
 */
export const useIMulticall3__Aggregate3Value__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'aggregate3Value',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"blockAndAggregate"`
 */
export const useIMulticall3__BlockAndAggregate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'blockAndAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryAggregate"`
 */
export const useIMulticall3__TryAggregate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryAggregate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iMulticall3Abi}__ and `functionName` set to `"tryBlockAndAggregate"`
 */
export const useIMulticall3__TryBlockAndAggregate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iMulticall3Abi,
    functionName: 'tryBlockAndAggregate',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iVotesAbi}__
 */
export const useIVotes__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: iVotesAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"delegates"`
 */
export const useIVotes__Delegates__read = /*#__PURE__*/ createUseReadContract({
  abi: iVotesAbi,
  functionName: 'delegates',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useIVotes__GetPastTotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iVotesAbi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"getPastVotes"`
 */
export const useIVotes__GetPastVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: iVotesAbi,
    functionName: 'getPastVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"getVotes"`
 */
export const useIVotes__GetVotes__read = /*#__PURE__*/ createUseReadContract({
  abi: iVotesAbi,
  functionName: 'getVotes',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iVotesAbi}__
 */
export const useIVotes__undefined__write = /*#__PURE__*/ createUseWriteContract(
  { abi: iVotesAbi },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"delegate"`
 */
export const useIVotes__Delegate__write = /*#__PURE__*/ createUseWriteContract({
  abi: iVotesAbi,
  functionName: 'delegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useIVotes__DelegateBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: iVotesAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iVotesAbi}__
 */
export const useIVotes__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: iVotesAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"delegate"`
 */
export const useIVotes__Delegate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iVotesAbi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link iVotesAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useIVotes__DelegateBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: iVotesAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iVotesAbi}__
 */
export const useIVotes__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: iVotesAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iVotesAbi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useIVotes__DelegateChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iVotesAbi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link iVotesAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useIVotes__DelegateVotesChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: iVotesAbi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noncesAbi}__
 */
export const useNonces__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: noncesAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link noncesAbi}__ and `functionName` set to `"nonces"`
 */
export const useNonces__Nonces__read = /*#__PURE__*/ createUseReadContract({
  abi: noncesAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useOwnable__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: ownableAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"owner"`
 */
export const useOwnable__Owner__read = /*#__PURE__*/ createUseReadContract({
  abi: ownableAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useOwnable__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: ownableAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useOwnable__RenounceOwnership__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useOwnable__TransferOwnership__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: ownableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__
 */
export const useOwnable__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: ownableAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useOwnable__RenounceOwnership__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link ownableAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useOwnable__TransferOwnership__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: ownableAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableAbi}__
 */
export const useOwnable__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: ownableAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link ownableAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useOwnable__OwnershipTransferred__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: ownableAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__
 */
export const useTimeline__undefined__read = /*#__PURE__*/ createUseReadContract(
  { abi: timelineAbi },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"getCanonChain"`
 */
export const useTimeline__GetCanonChain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: timelineAbi,
    functionName: 'getCanonChain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"getLeaves"`
 */
export const useTimeline__GetLeaves__read = /*#__PURE__*/ createUseReadContract(
  { abi: timelineAbi, functionName: 'getLeaves' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"getMedia"`
 */
export const useTimeline__GetMedia__read = /*#__PURE__*/ createUseReadContract({
  abi: timelineAbi,
  functionName: 'getMedia',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"getNode"`
 */
export const useTimeline__GetNode__read = /*#__PURE__*/ createUseReadContract({
  abi: timelineAbi,
  functionName: 'getNode',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"getTimeline"`
 */
export const useTimeline__GetTimeline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: timelineAbi,
    functionName: 'getTimeline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"latestNodeId"`
 */
export const useTimeline__LatestNodeId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: timelineAbi,
    functionName: 'latestNodeId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"nodes"`
 */
export const useTimeline__Nodes__read = /*#__PURE__*/ createUseReadContract({
  abi: timelineAbi,
  functionName: 'nodes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"owner"`
 */
export const useTimeline__Owner__read = /*#__PURE__*/ createUseReadContract({
  abi: timelineAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link timelineAbi}__
 */
export const useTimeline__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: timelineAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"createNode"`
 */
export const useTimeline__CreateNode__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: timelineAbi,
    functionName: 'createNode',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useTimeline__RenounceOwnership__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: timelineAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"setCanon"`
 */
export const useTimeline__SetCanon__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: timelineAbi,
    functionName: 'setCanon',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"setMedia"`
 */
export const useTimeline__SetMedia__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: timelineAbi,
    functionName: 'setMedia',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useTimeline__TransferOwnership__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: timelineAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link timelineAbi}__
 */
export const useTimeline__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: timelineAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"createNode"`
 */
export const useTimeline__CreateNode__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: timelineAbi,
    functionName: 'createNode',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useTimeline__RenounceOwnership__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: timelineAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"setCanon"`
 */
export const useTimeline__SetCanon__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: timelineAbi,
    functionName: 'setCanon',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"setMedia"`
 */
export const useTimeline__SetMedia__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: timelineAbi,
    functionName: 'setMedia',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link timelineAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useTimeline__TransferOwnership__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: timelineAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link timelineAbi}__
 */
export const useTimeline__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: timelineAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link timelineAbi}__ and `eventName` set to `"NodeCanonized"`
 */
export const useTimeline__NodeCanonized__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: timelineAbi,
    eventName: 'NodeCanonized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link timelineAbi}__ and `eventName` set to `"NodeCreated"`
 */
export const useTimeline__NodeCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: timelineAbi,
    eventName: 'NodeCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link timelineAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useTimeline__OwnershipTransferred__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: timelineAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor__undefined__read =
  /*#__PURE__*/ createUseReadContract({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useUniverseGovernor__BallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useUniverseGovernor__ClockMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useUniverseGovernor__CountingMode__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useUniverseGovernor__ExtendedBallotTypehash__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"clock"`
 */
export const useUniverseGovernor__Clock__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useUniverseGovernor__Eip712Domain__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"getProposalId"`
 */
export const useUniverseGovernor__GetProposalId__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'getProposalId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"getVotes"`
 */
export const useUniverseGovernor__GetVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useUniverseGovernor__GetVotesWithParams__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useUniverseGovernor__HasVoted__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'hasVoted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useUniverseGovernor__HashProposal__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"name"`
 */
export const useUniverseGovernor__Name__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"nonces"`
 */
export const useUniverseGovernor__Nonces__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useUniverseGovernor__ProposalDeadline__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useUniverseGovernor__ProposalEta__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useUniverseGovernor__ProposalNeedsQueuing__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useUniverseGovernor__ProposalProposer__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useUniverseGovernor__ProposalSnapshot__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useUniverseGovernor__ProposalThreshold__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalVotes"`
 */
export const useUniverseGovernor__ProposalVotes__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"quorum"`
 */
export const useUniverseGovernor__Quorum__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'quorum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"quorumDenominator"`
 */
export const useUniverseGovernor__QuorumDenominator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'quorumDenominator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"quorumNumerator"`
 */
export const useUniverseGovernor__QuorumNumerator__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'quorumNumerator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"state"`
 */
export const useUniverseGovernor__State__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'state',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useUniverseGovernor__SupportsInterface__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"token"`
 */
export const useUniverseGovernor__Token__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'token',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"version"`
 */
export const useUniverseGovernor__Version__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useUniverseGovernor__VotingDelay__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useUniverseGovernor__VotingPeriod__read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor__undefined__write =
  /*#__PURE__*/ createUseWriteContract({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"cancel"`
 */
export const useUniverseGovernor__Cancel__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const useUniverseGovernor__CastVote__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useUniverseGovernor__CastVoteBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useUniverseGovernor__CastVoteWithReason__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useUniverseGovernor__CastVoteWithReasonAndParams__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useUniverseGovernor__CastVoteWithReasonAndParamsBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const useUniverseGovernor__Execute__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useUniverseGovernor__OnErc1155BatchReceived__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useUniverseGovernor__OnErc1155Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useUniverseGovernor__OnErc721Received__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const useUniverseGovernor__Propose__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"queue"`
 */
export const useUniverseGovernor__Queue__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"relay"`
 */
export const useUniverseGovernor__Relay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setProposalThreshold"`
 */
export const useUniverseGovernor__SetProposalThreshold__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'setProposalThreshold',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingDelay"`
 */
export const useUniverseGovernor__SetVotingDelay__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingPeriod"`
 */
export const useUniverseGovernor__SetVotingPeriod__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"updateQuorumNumerator"`
 */
export const useUniverseGovernor__UpdateQuorumNumerator__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'updateQuorumNumerator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"cancel"`
 */
export const useUniverseGovernor__Cancel__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const useUniverseGovernor__CastVote__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useUniverseGovernor__CastVoteBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useUniverseGovernor__CastVoteWithReason__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useUniverseGovernor__CastVoteWithReasonAndParams__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useUniverseGovernor__CastVoteWithReasonAndParamsBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const useUniverseGovernor__Execute__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useUniverseGovernor__OnErc1155BatchReceived__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useUniverseGovernor__OnErc1155Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useUniverseGovernor__OnErc721Received__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const useUniverseGovernor__Propose__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"queue"`
 */
export const useUniverseGovernor__Queue__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"relay"`
 */
export const useUniverseGovernor__Relay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setProposalThreshold"`
 */
export const useUniverseGovernor__SetProposalThreshold__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'setProposalThreshold',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingDelay"`
 */
export const useUniverseGovernor__SetVotingDelay__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingPeriod"`
 */
export const useUniverseGovernor__SetVotingPeriod__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingPeriod',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"updateQuorumNumerator"`
 */
export const useUniverseGovernor__UpdateQuorumNumerator__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'updateQuorumNumerator',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useUniverseGovernor__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useUniverseGovernor__ProposalCanceled__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useUniverseGovernor__ProposalCreated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useUniverseGovernor__ProposalExecuted__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useUniverseGovernor__ProposalQueued__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalThresholdSet"`
 */
export const useUniverseGovernor__ProposalThresholdSet__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalThresholdSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"QuorumNumeratorUpdated"`
 */
export const useUniverseGovernor__QuorumNumeratorUpdated__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'QuorumNumeratorUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useUniverseGovernor__VoteCast__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useUniverseGovernor__VoteCastWithParams__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VotingDelaySet"`
 */
export const useUniverseGovernor__VotingDelaySet__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VotingDelaySet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VotingPeriodSet"`
 */
export const useUniverseGovernor__VotingPeriodSet__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VotingPeriodSet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__
 */
export const useVotes__undefined__read = /*#__PURE__*/ createUseReadContract({
  abi: votesAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useVotes__ClockMode__read = /*#__PURE__*/ createUseReadContract({
  abi: votesAbi,
  functionName: 'CLOCK_MODE',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"clock"`
 */
export const useVotes__Clock__read = /*#__PURE__*/ createUseReadContract({
  abi: votesAbi,
  functionName: 'clock',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"delegates"`
 */
export const useVotes__Delegates__read = /*#__PURE__*/ createUseReadContract({
  abi: votesAbi,
  functionName: 'delegates',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useVotes__Eip712Domain__read = /*#__PURE__*/ createUseReadContract(
  { abi: votesAbi, functionName: 'eip712Domain' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useVotes__GetPastTotalSupply__read =
  /*#__PURE__*/ createUseReadContract({
    abi: votesAbi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"getPastVotes"`
 */
export const useVotes__GetPastVotes__read = /*#__PURE__*/ createUseReadContract(
  { abi: votesAbi, functionName: 'getPastVotes' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"getVotes"`
 */
export const useVotes__GetVotes__read = /*#__PURE__*/ createUseReadContract({
  abi: votesAbi,
  functionName: 'getVotes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"nonces"`
 */
export const useVotes__Nonces__read = /*#__PURE__*/ createUseReadContract({
  abi: votesAbi,
  functionName: 'nonces',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link votesAbi}__
 */
export const useVotes__undefined__write = /*#__PURE__*/ createUseWriteContract({
  abi: votesAbi,
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"delegate"`
 */
export const useVotes__Delegate__write = /*#__PURE__*/ createUseWriteContract({
  abi: votesAbi,
  functionName: 'delegate',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useVotes__DelegateBySig__write =
  /*#__PURE__*/ createUseWriteContract({
    abi: votesAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link votesAbi}__
 */
export const useVotes__undefined__simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: votesAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"delegate"`
 */
export const useVotes__Delegate__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: votesAbi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link votesAbi}__ and `functionName` set to `"delegateBySig"`
 */
export const useVotes__DelegateBySig__simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: votesAbi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link votesAbi}__
 */
export const useVotes__undefined__watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: votesAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link votesAbi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useVotes__DelegateChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: votesAbi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link votesAbi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useVotes__DelegateVotesChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: votesAbi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link votesAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useVotes__Eip712DomainChanged__watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: votesAbi,
    eventName: 'EIP712DomainChanged',
  })
