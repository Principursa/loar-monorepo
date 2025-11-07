import {
  createUseReadContract,
  createUseWriteContract,
  createUseSimulateContract,
  createUseWatchContractEvent,
} from 'wagmi/codegen'

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// GovernanceERC20
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const governanceErc20Abi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_name', internalType: 'string', type: 'string' },
      { name: '_symbol', internalType: 'string', type: 'string' },
      { name: '_maxSupply', internalType: 'uint256', type: 'uint256' },
      { name: '_admin', internalType: 'address', type: 'address' },
      { name: '_imageUrl', internalType: 'string', type: 'string' },
      { name: '_metadata', internalType: 'string', type: 'string' },
      { name: '_context', internalType: 'string', type: 'string' },
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
    inputs: [],
    name: 'admin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    name: 'context',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
    name: 'imageUrl',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'metadata',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
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
    type: 'function',
    inputs: [],
    name: 'universe',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
// LoarFeeLocker
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const loarFeeLockerAbi = [
  {
    type: 'constructor',
    inputs: [{ name: 'owner_', internalType: 'address', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'depositor', internalType: 'address', type: 'address' }],
    name: 'addDepositor',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'depositor', internalType: 'address', type: 'address' }],
    name: 'allowedDepositors',
    outputs: [{ name: 'isAllowed', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeOwner', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'availableFees',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeOwner', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'feeOwner', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'feesToClaim',
    outputs: [{ name: 'balance', internalType: 'uint256', type: 'uint256' }],
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
    inputs: [
      { name: 'feeOwner', internalType: 'address', type: 'address' },
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'amount', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'storeFees',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
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
        name: 'depositor',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
    ],
    name: 'AddDepositor',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amountClaimed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimTokens',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'feeOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'amountClaimed',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimTokensPermissioned',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'sender',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'feeOwner',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'balance',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'StoreTokens',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'NoFeesToClaim' },
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
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'Unauthorized' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LoarHookStaticFee
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const loarHookStaticFeeAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_poolManager', internalType: 'address', type: 'address' },
      { name: '_factory', internalType: 'address', type: 'address' },
      { name: '_weth', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'FEE_DENOMINATOR',
    outputs: [{ name: '', internalType: 'int128', type: 'int128' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_LP_FEE',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'PROTOCOL_FEE_NUMERATOR',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'feesAccrued', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterAddLiquidity',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BalanceDelta', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterDonate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
      { name: 'tick', internalType: 'int24', type: 'int24' },
    ],
    name: 'afterInitialize',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'feesAccrued', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterRemoveLiquidity',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BalanceDelta', type: 'int256' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct SwapParams',
        type: 'tuple',
        components: [
          { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
          { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
      { name: 'delta', internalType: 'BalanceDelta', type: 'int256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'afterSwap',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'int128', type: 'int128' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeAddLiquidity',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'amount0', internalType: 'uint256', type: 'uint256' },
      { name: 'amount1', internalType: 'uint256', type: 'uint256' },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeDonate',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'sqrtPriceX96', internalType: 'uint160', type: 'uint160' },
    ],
    name: 'beforeInitialize',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct ModifyLiquidityParams',
        type: 'tuple',
        components: [
          { name: 'tickLower', internalType: 'int24', type: 'int24' },
          { name: 'tickUpper', internalType: 'int24', type: 'int24' },
          { name: 'liquidityDelta', internalType: 'int256', type: 'int256' },
          { name: 'salt', internalType: 'bytes32', type: 'bytes32' },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeRemoveLiquidity',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'sender', internalType: 'address', type: 'address' },
      {
        name: 'key',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      {
        name: 'params',
        internalType: 'struct SwapParams',
        type: 'tuple',
        components: [
          { name: 'zeroForOne', internalType: 'bool', type: 'bool' },
          { name: 'amountSpecified', internalType: 'int256', type: 'int256' },
          {
            name: 'sqrtPriceLimitX96',
            internalType: 'uint160',
            type: 'uint160',
          },
        ],
      },
      { name: 'hookData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'beforeSwap',
    outputs: [
      { name: '', internalType: 'bytes4', type: 'bytes4' },
      { name: '', internalType: 'BeforeSwapDelta', type: 'int256' },
      { name: '', internalType: 'uint24', type: 'uint24' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'getHookPermissions',
    outputs: [
      {
        name: '',
        internalType: 'struct Hooks.Permissions',
        type: 'tuple',
        components: [
          { name: 'beforeInitialize', internalType: 'bool', type: 'bool' },
          { name: 'afterInitialize', internalType: 'bool', type: 'bool' },
          { name: 'beforeAddLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'afterAddLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'beforeRemoveLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'afterRemoveLiquidity', internalType: 'bool', type: 'bool' },
          { name: 'beforeSwap', internalType: 'bool', type: 'bool' },
          { name: 'afterSwap', internalType: 'bool', type: 'bool' },
          { name: 'beforeDonate', internalType: 'bool', type: 'bool' },
          { name: 'afterDonate', internalType: 'bool', type: 'bool' },
          { name: 'beforeSwapReturnDelta', internalType: 'bool', type: 'bool' },
          { name: 'afterSwapReturnDelta', internalType: 'bool', type: 'bool' },
          {
            name: 'afterAddLiquidityReturnDelta',
            internalType: 'bool',
            type: 'bool',
          },
          {
            name: 'afterRemoveLiquidityReturnDelta',
            internalType: 'bool',
            type: 'bool',
          },
        ],
      },
    ],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [
      { name: 'loar', internalType: 'address', type: 'address' },
      { name: 'pairedToken', internalType: 'address', type: 'address' },
      { name: 'tickIfToken0IsLoar', internalType: 'int24', type: 'int24' },
      { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
      { name: '_locker', internalType: 'address', type: 'address' },
      { name: 'poolData', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'initializePool',
    outputs: [
      {
        name: '',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'PoolId', type: 'bytes32' }],
    name: 'loarFee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
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
    inputs: [{ name: '', internalType: 'PoolId', type: 'bytes32' }],
    name: 'pairedFee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: '', internalType: 'PoolId', type: 'bytes32' }],
    name: 'poolCreationTimestamp',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'poolManager',
    outputs: [
      { name: '', internalType: 'contract IPoolManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'protocolFee',
    outputs: [{ name: '', internalType: 'uint24', type: 'uint24' }],
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
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'weth',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimProtocolFees',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pairedToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'loar', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'poolId',
        internalType: 'PoolId',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'tickIfToken0IsLoar',
        internalType: 'int24',
        type: 'int24',
        indexed: false,
      },
      {
        name: 'tickSpacing',
        internalType: 'int24',
        type: 'int24',
        indexed: false,
      },
      {
        name: 'locker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'PoolCreatedFactory',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'pairedToken',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'loar', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'poolId',
        internalType: 'PoolId',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'tickIfToken0IsLoar',
        internalType: 'int24',
        type: 'int24',
        indexed: false,
      },
      {
        name: 'tickSpacing',
        internalType: 'int24',
        type: 'int24',
        indexed: false,
      },
    ],
    name: 'PoolCreatedOpen',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'poolId',
        internalType: 'PoolId',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'loarFee',
        internalType: 'uint24',
        type: 'uint24',
        indexed: false,
      },
      {
        name: 'pairedFee',
        internalType: 'uint24',
        type: 'uint24',
        indexed: false,
      },
    ],
    name: 'PoolInitialized',
  },
  { type: 'error', inputs: [], name: 'ETHPoolNotAllowed' },
  { type: 'error', inputs: [], name: 'HookNotImplemented' },
  { type: 'error', inputs: [], name: 'LoarFeeTooHigh' },
  { type: 'error', inputs: [], name: 'NotPoolManager' },
  { type: 'error', inputs: [], name: 'OnlyFactory' },
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
  { type: 'error', inputs: [], name: 'PairedFeeTooHigh' },
  { type: 'error', inputs: [], name: 'PastCreationTimestamp' },
  { type: 'error', inputs: [], name: 'UnsupportedInitializePath' },
  { type: 'error', inputs: [], name: 'WethCannotBeLoar' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// LoarLpLockerMultiple
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const loarLpLockerMultipleAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: 'owner_', internalType: 'address', type: 'address' },
      { name: 'factory_', internalType: 'address', type: 'address' },
      { name: 'feeLocker_', internalType: 'address', type: 'address' },
      { name: 'positionManager_', internalType: 'address', type: 'address' },
      { name: 'permit2_', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BASIS_POINTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_LP_POSITIONS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'MAX_REWARD_PARTICIPANTS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'collectRewards',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'collectRewardsWithoutUnlock',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'factory',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'feeLocker',
    outputs: [
      { name: '', internalType: 'contract ILoarFeeLocker', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: '', internalType: 'address', type: 'address' },
      { name: 'from', internalType: 'address', type: 'address' },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'bytes', type: 'bytes' },
    ],
    name: 'onERC721Received',
    outputs: [{ name: '', internalType: 'bytes4', type: 'bytes4' }],
    stateMutability: 'nonpayable',
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
    name: 'permit2',
    outputs: [{ name: '', internalType: 'contract IPermit2', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'lockerConfig',
        internalType: 'struct IUniverseManager.LockerConfig',
        type: 'tuple',
        components: [
          { name: 'locker', internalType: 'address', type: 'address' },
          {
            name: 'rewardAdmins',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'rewardRecipients',
            internalType: 'address[]',
            type: 'address[]',
          },
          { name: 'rewardBps', internalType: 'uint16[]', type: 'uint16[]' },
          { name: 'tickLower', internalType: 'int24[]', type: 'int24[]' },
          { name: 'tickUpper', internalType: 'int24[]', type: 'int24[]' },
          { name: 'positionBps', internalType: 'uint16[]', type: 'uint16[]' },
          { name: 'lockerData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'poolConfig',
        internalType: 'struct IUniverseManager.PoolConfig',
        type: 'tuple',
        components: [
          { name: 'hook', internalType: 'address', type: 'address' },
          { name: 'pairedToken', internalType: 'address', type: 'address' },
          { name: 'tickIfToken0IsLoar', internalType: 'int24', type: 'int24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'poolData', internalType: 'bytes', type: 'bytes' },
        ],
      },
      {
        name: 'poolKey',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
      },
      { name: 'poolSupply', internalType: 'uint256', type: 'uint256' },
      { name: 'token', internalType: 'address', type: 'address' },
    ],
    name: 'placeLiquidity',
    outputs: [{ name: 'positionId', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'positionManager',
    outputs: [
      { name: '', internalType: 'contract IPositionManager', type: 'address' },
    ],
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
    inputs: [{ name: 'interfaceId', internalType: 'bytes4', type: 'bytes4' }],
    name: 'supportsInterface',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'pure',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'tokenRewards',
    outputs: [
      {
        name: '',
        internalType: 'struct ILoarLpLocker.TokenRewardInfo',
        type: 'tuple',
        components: [
          { name: 'token', internalType: 'address', type: 'address' },
          {
            name: 'poolKey',
            internalType: 'struct PoolKey',
            type: 'tuple',
            components: [
              { name: 'currency0', internalType: 'Currency', type: 'address' },
              { name: 'currency1', internalType: 'Currency', type: 'address' },
              { name: 'fee', internalType: 'uint24', type: 'uint24' },
              { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
              {
                name: 'hooks',
                internalType: 'contract IHooks',
                type: 'address',
              },
            ],
          },
          { name: 'positionId', internalType: 'uint256', type: 'uint256' },
          { name: 'numPositions', internalType: 'uint256', type: 'uint256' },
          { name: 'rewardBps', internalType: 'uint16[]', type: 'uint16[]' },
          {
            name: 'rewardAdmins',
            internalType: 'address[]',
            type: 'address[]',
          },
          {
            name: 'rewardRecipients',
            internalType: 'address[]',
            type: 'address[]',
          },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newOwner', internalType: 'address', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'newAdmin', internalType: 'address', type: 'address' },
    ],
    name: 'updateRewardAdmin',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'rewardIndex', internalType: 'uint256', type: 'uint256' },
      { name: 'newRecipient', internalType: 'address', type: 'address' },
    ],
    name: 'updateRewardRecipient',
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
    inputs: [
      { name: 'token', internalType: 'address', type: 'address' },
      { name: 'recipient', internalType: 'address', type: 'address' },
    ],
    name: 'withdrawERC20',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'recipient', internalType: 'address', type: 'address' }],
    name: 'withdrawETH',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount0',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'amount1',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rewards0',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
      {
        name: 'rewards1',
        internalType: 'uint256[]',
        type: 'uint256[]',
        indexed: false,
      },
    ],
    name: 'ClaimedRewards',
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
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'from', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'positionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'Received',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rewardIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newAdmin',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RewardAdminUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'rewardIndex',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'oldRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'RewardRecipientUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'poolKey',
        internalType: 'struct PoolKey',
        type: 'tuple',
        components: [
          { name: 'currency0', internalType: 'Currency', type: 'address' },
          { name: 'currency1', internalType: 'Currency', type: 'address' },
          { name: 'fee', internalType: 'uint24', type: 'uint24' },
          { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
          { name: 'hooks', internalType: 'contract IHooks', type: 'address' },
        ],
        indexed: false,
      },
      {
        name: 'poolSupply',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'positionId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'numPositions',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
      {
        name: 'rewardBps',
        internalType: 'uint16[]',
        type: 'uint16[]',
        indexed: false,
      },
      {
        name: 'rewardAdmins',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'rewardRecipients',
        internalType: 'address[]',
        type: 'address[]',
        indexed: false,
      },
      {
        name: 'tickLower',
        internalType: 'int24[]',
        type: 'int24[]',
        indexed: false,
      },
      {
        name: 'tickUpper',
        internalType: 'int24[]',
        type: 'int24[]',
        indexed: false,
      },
      {
        name: 'positionBps',
        internalType: 'uint16[]',
        type: 'uint16[]',
        indexed: false,
      },
    ],
    name: 'TokenRewardAdded',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'InvalidPositionBps' },
  { type: 'error', inputs: [], name: 'InvalidRewardBps' },
  { type: 'error', inputs: [], name: 'MismatchedPositionInfos' },
  { type: 'error', inputs: [], name: 'MismatchedRewardArrays' },
  { type: 'error', inputs: [], name: 'NoPositions' },
  { type: 'error', inputs: [], name: 'NoRewardRecipients' },
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
  { type: 'error', inputs: [], name: 'ReentrancyGuardReentrantCall' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'TickRangeLowerThanStartingTick' },
  { type: 'error', inputs: [], name: 'TicksBackwards' },
  { type: 'error', inputs: [], name: 'TicksNotMultipleOfTickSpacing' },
  { type: 'error', inputs: [], name: 'TicksOutOfTickBounds' },
  { type: 'error', inputs: [], name: 'TokenAlreadyHasRewards' },
  { type: 'error', inputs: [], name: 'TooManyPositions' },
  { type: 'error', inputs: [], name: 'TooManyRewardParticipants' },
  { type: 'error', inputs: [], name: 'Unauthorized' },
  { type: 'error', inputs: [], name: 'ZeroRewardAddress' },
  { type: 'error', inputs: [], name: 'ZeroRewardAmount' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Universe
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const universeAbi = [
  {
    type: 'constructor',
    inputs: [
      {
        name: 'config',
        internalType: 'struct IUniverseManager.UniverseConfig',
        type: 'tuple',
        components: [
          {
            name: 'nodeCreationOption',
            internalType: 'enum NodeCreationOptions',
            type: 'uint8',
          },
          {
            name: 'nodeVisibilityOption',
            internalType: 'enum NodeVisibilityOptions',
            type: 'uint8',
          },
          { name: 'universeAdmin', internalType: 'address', type: 'address' },
          { name: 'name', internalType: 'string', type: 'string' },
          { name: 'imageURL', internalType: 'string', type: 'string' },
          { name: 'description', internalType: 'string', type: 'string' },
          { name: 'universeManager', internalType: 'address', type: 'address' },
        ],
      },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'associatedToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
    name: 'getAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
    name: 'getFullGraph',
    outputs: [
      { name: 'ids', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'links', internalType: 'string[]', type: 'string[]' },
      { name: 'plots', internalType: 'string[]', type: 'string[]' },
      { name: 'previousIds', internalType: 'uint256[]', type: 'uint256[]' },
      { name: 'nextIds', internalType: 'uint256[][]', type: 'uint256[][]' },
      { name: 'canonFlags', internalType: 'bool[]', type: 'bool[]' },
    ],
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
      { name: '', internalType: 'address', type: 'address' },
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
    name: 'getToken',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
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
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'nodeIDToHex',
    outputs: [{ name: '', internalType: 'bytes32', type: 'bytes32' }],
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
      { name: 'creator', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'newAdmin', internalType: 'address', type: 'address' }],
    name: 'setAdmin',
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
    inputs: [
      {
        name: '_option',
        internalType: 'enum NodeCreationOptions',
        type: 'uint8',
      },
    ],
    name: 'setNodeCreationOption',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: '_option',
        internalType: 'enum NodeVisibilityOptions',
        type: 'uint8',
      },
    ],
    name: 'setNodeVisibilityOption',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'setToken',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'universeAdmin',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'universeDescription',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'universeImageUrl',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'universeManager',
    outputs: [
      { name: '', internalType: 'contract IUniverseManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'universeName',
    outputs: [{ name: '', internalType: 'string', type: 'string' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'updater',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'link', internalType: 'string', type: 'string', indexed: false },
    ],
    name: 'MediaUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      { name: 'id', internalType: 'uint256', type: 'uint256', indexed: false },
      {
        name: 'canonizer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
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
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
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
        name: 'option',
        internalType: 'enum NodeCreationOptions',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'NodeCreationOptionUpdated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'option',
        internalType: 'enum NodeVisibilityOptions',
        type: 'uint8',
        indexed: false,
      },
    ],
    name: 'NodeVisibilityOptionUpdated',
  },
  {
    type: 'error',
    inputs: [{ name: 'caller', internalType: 'address', type: 'address' }],
    name: 'CallerNotAdmin',
  },
  { type: 'error', inputs: [], name: 'CallerNotManager' },
  { type: 'error', inputs: [], name: 'CanonNotSet' },
  { type: 'error', inputs: [], name: 'NodeDoesNotExist' },
  { type: 'error', inputs: [], name: 'TokenDoesNotExist' },
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
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
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
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'GovernorOnlyProposer',
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
  { type: 'error', inputs: [], name: 'QueueEmpty' },
  { type: 'error', inputs: [], name: 'QueueFull' },
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
// UniverseManager
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const universeManagerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_teamFeeRecipient', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'BPS',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN_SUPPLY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'claimTeamFee',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'name', internalType: 'string', type: 'string' },
      { name: 'imageURL', internalType: 'string', type: 'string' },
      { name: 'description', internalType: 'string', type: 'string' },
      {
        name: 'nodeCreationOptions',
        internalType: 'enum NodeCreationOptions',
        type: 'uint8',
      },
      {
        name: 'nodeVisibilityOptions',
        internalType: 'enum NodeVisibilityOptions',
        type: 'uint8',
      },
      { name: 'initialOwner', internalType: 'address', type: 'address' },
    ],
    name: 'createUniverse',
    outputs: [
      { name: '_id', internalType: 'uint256', type: 'uint256' },
      { name: '', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'deploymentConfig',
        internalType: 'struct IUniverseManager.DeploymentConfig',
        type: 'tuple',
        components: [
          {
            name: 'tokenConfig',
            internalType: 'struct IUniverseManager.TokenConfig',
            type: 'tuple',
            components: [
              { name: 'tokenAdmin', internalType: 'address', type: 'address' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'symbol', internalType: 'string', type: 'string' },
              { name: 'imageURL', internalType: 'string', type: 'string' },
              { name: 'metadata', internalType: 'string', type: 'string' },
              { name: 'context', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'poolConfig',
            internalType: 'struct IUniverseManager.PoolConfig',
            type: 'tuple',
            components: [
              { name: 'hook', internalType: 'address', type: 'address' },
              { name: 'pairedToken', internalType: 'address', type: 'address' },
              {
                name: 'tickIfToken0IsLoar',
                internalType: 'int24',
                type: 'int24',
              },
              { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
              { name: 'poolData', internalType: 'bytes', type: 'bytes' },
            ],
          },
          {
            name: 'lockerConfig',
            internalType: 'struct IUniverseManager.LockerConfig',
            type: 'tuple',
            components: [
              { name: 'locker', internalType: 'address', type: 'address' },
              {
                name: 'rewardAdmins',
                internalType: 'address[]',
                type: 'address[]',
              },
              {
                name: 'rewardRecipients',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'rewardBps', internalType: 'uint16[]', type: 'uint16[]' },
              { name: 'tickLower', internalType: 'int24[]', type: 'int24[]' },
              { name: 'tickUpper', internalType: 'int24[]', type: 'int24[]' },
              {
                name: 'positionBps',
                internalType: 'uint16[]',
                type: 'uint16[]',
              },
              { name: 'lockerData', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
      { name: 'id', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployUniverseToken',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'deprecated',
    outputs: [{ name: '', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'hook', internalType: 'address', type: 'address' }],
    name: 'enabledHooks',
    outputs: [{ name: 'enabled', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      { name: 'locker', internalType: 'address', type: 'address' },
      { name: 'hook', internalType: 'address', type: 'address' },
    ],
    name: 'enabledLockers',
    outputs: [{ name: 'enabled', internalType: 'bool', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [{ name: 'id', internalType: 'uint256', type: 'uint256' }],
    name: 'getUniverseData',
    outputs: [
      { name: 'universe', internalType: 'contract IUniverse', type: 'address' },
      { name: 'token', internalType: 'contract IERC20', type: 'address' },
      {
        name: 'universeGovernor',
        internalType: 'contract IGovernor',
        type: 'address',
      },
      { name: 'hook', internalType: 'contract IHooks', type: 'address' },
      {
        name: 'locker',
        internalType: 'contract ILoarLpLocker',
        type: 'address',
      },
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
    inputs: [{ name: 'deprecated_', internalType: 'bool', type: 'bool' }],
    name: 'setDeprecated',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'hook', internalType: 'address', type: 'address' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setHook',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: 'locker', internalType: 'address', type: 'address' },
      { name: 'hook', internalType: 'address', type: 'address' },
      { name: 'enabled', internalType: 'bool', type: 'bool' },
    ],
    name: 'setLocker',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_teamFeeRecipient', internalType: 'address', type: 'address' },
    ],
    name: 'setTeamFeeRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [
      { name: '_tokenDeployer', internalType: 'address', type: 'address' },
    ],
    name: 'setTokenDeployer',
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'teamFee',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'teamFeeRecipient',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [],
    name: 'tokenDeployer',
    outputs: [{ name: '', internalType: 'address', type: 'address' }],
    stateMutability: 'view',
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
        name: 'token',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'recipient',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'amount',
        internalType: 'uint256',
        type: 'uint256',
        indexed: false,
      },
    ],
    name: 'ClaimTeamFees',
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
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'deprecated',
        internalType: 'bool',
        type: 'bool',
        indexed: false,
      },
    ],
    name: 'SetDeprecated',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'hook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetHook',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'locker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'hook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      { name: 'enabled', internalType: 'bool', type: 'bool', indexed: false },
    ],
    name: 'SetLocker',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldTeamFeeRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newTeamFeeRecipient',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SetTeamFeeRecipient',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'oldTokenDeployer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'newTokenDeployer',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'SetTokenDeployer',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'msgSender',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenAdmin',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      {
        name: 'tokenImage',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tokenName',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tokenSymbol',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tokenMetadata',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'tokenContext',
        internalType: 'string',
        type: 'string',
        indexed: false,
      },
      {
        name: 'startingTick',
        internalType: 'int24',
        type: 'int24',
        indexed: false,
      },
      {
        name: 'poolHook',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'poolId',
        internalType: 'PoolId',
        type: 'bytes32',
        indexed: false,
      },
      {
        name: 'pairedToken',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'locker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'governor',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenCreated',
  },
  { type: 'event', anonymous: false, inputs: [], name: 'TokenDeployed' },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'universe',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
      {
        name: 'creator',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'UniverseCreated',
  },
  {
    type: 'error',
    inputs: [{ name: 'target', internalType: 'address', type: 'address' }],
    name: 'AddressEmptyCode',
  },
  {
    type: 'error',
    inputs: [{ name: 'account', internalType: 'address', type: 'address' }],
    name: 'AddressInsufficientBalance',
  },
  { type: 'error', inputs: [], name: 'CallerIsNotOwner' },
  { type: 'error', inputs: [], name: 'DeployerIsNotOwner' },
  { type: 'error', inputs: [], name: 'Deprecated' },
  { type: 'error', inputs: [], name: 'FailedInnerCall' },
  { type: 'error', inputs: [], name: 'HookNotEnabled' },
  { type: 'error', inputs: [], name: 'InvalidHook' },
  { type: 'error', inputs: [], name: 'InvalidLocker' },
  { type: 'error', inputs: [], name: 'LockerNotEnabled' },
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
  { type: 'error', inputs: [], name: 'Reentrancy' },
  {
    type: 'error',
    inputs: [{ name: 'token', internalType: 'address', type: 'address' }],
    name: 'SafeERC20FailedOperation',
  },
  { type: 'error', inputs: [], name: 'TeamFeeRecipientNotSet' },
  { type: 'error', inputs: [], name: 'TokenAlreadyDeployed' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// UniverseTokenDeployer
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export const universeTokenDeployerAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_universeManager', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'TOKEN_SUPPLY',
    outputs: [{ name: '', internalType: 'uint256', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    inputs: [
      {
        name: 'deploymentConfig',
        internalType: 'struct IUniverseManager.DeploymentConfig',
        type: 'tuple',
        components: [
          {
            name: 'tokenConfig',
            internalType: 'struct IUniverseManager.TokenConfig',
            type: 'tuple',
            components: [
              { name: 'tokenAdmin', internalType: 'address', type: 'address' },
              { name: 'name', internalType: 'string', type: 'string' },
              { name: 'symbol', internalType: 'string', type: 'string' },
              { name: 'imageURL', internalType: 'string', type: 'string' },
              { name: 'metadata', internalType: 'string', type: 'string' },
              { name: 'context', internalType: 'string', type: 'string' },
            ],
          },
          {
            name: 'poolConfig',
            internalType: 'struct IUniverseManager.PoolConfig',
            type: 'tuple',
            components: [
              { name: 'hook', internalType: 'address', type: 'address' },
              { name: 'pairedToken', internalType: 'address', type: 'address' },
              {
                name: 'tickIfToken0IsLoar',
                internalType: 'int24',
                type: 'int24',
              },
              { name: 'tickSpacing', internalType: 'int24', type: 'int24' },
              { name: 'poolData', internalType: 'bytes', type: 'bytes' },
            ],
          },
          {
            name: 'lockerConfig',
            internalType: 'struct IUniverseManager.LockerConfig',
            type: 'tuple',
            components: [
              { name: 'locker', internalType: 'address', type: 'address' },
              {
                name: 'rewardAdmins',
                internalType: 'address[]',
                type: 'address[]',
              },
              {
                name: 'rewardRecipients',
                internalType: 'address[]',
                type: 'address[]',
              },
              { name: 'rewardBps', internalType: 'uint16[]', type: 'uint16[]' },
              { name: 'tickLower', internalType: 'int24[]', type: 'int24[]' },
              { name: 'tickUpper', internalType: 'int24[]', type: 'int24[]' },
              {
                name: 'positionBps',
                internalType: 'uint16[]',
                type: 'uint16[]',
              },
              { name: 'lockerData', internalType: 'bytes', type: 'bytes' },
            ],
          },
        ],
      },
      { name: 'universeId', internalType: 'uint256', type: 'uint256' },
    ],
    name: 'deployTokenAndGovernance',
    outputs: [
      { name: 'tokenAddress', internalType: 'address', type: 'address' },
      { name: 'governor', internalType: 'address', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    inputs: [],
    name: 'universeManager',
    outputs: [
      { name: '', internalType: 'contract IUniverseManager', type: 'address' },
    ],
    stateMutability: 'view',
  },
  {
    type: 'event',
    anonymous: false,
    inputs: [
      {
        name: 'universeId',
        internalType: 'uint256',
        type: 'uint256',
        indexed: true,
      },
      {
        name: 'tokenAddress',
        internalType: 'address',
        type: 'address',
        indexed: true,
      },
      { name: 'hook', internalType: 'address', type: 'address', indexed: true },
      {
        name: 'locker',
        internalType: 'address',
        type: 'address',
        indexed: false,
      },
    ],
    name: 'TokenDeployed',
  },
  { type: 'error', inputs: [], name: 'DeployerIsNotOwner' },
  { type: 'error', inputs: [], name: 'HookNotEnabled' },
  { type: 'error', inputs: [], name: 'LockerNotEnabled' },
  { type: 'error', inputs: [], name: 'Reentrancy' },
] as const

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// React
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useGovernanceErc20_ClockMode_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"DOMAIN_SEPARATOR"`
 */
export const useGovernanceErc20_DomainSeparator_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'DOMAIN_SEPARATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"admin"`
 */
export const useGovernanceErc20_Admin_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'admin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"allowance"`
 */
export const useGovernanceErc20_Allowance_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'allowance',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"balanceOf"`
 */
export const useGovernanceErc20_BalanceOf_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'balanceOf',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"checkpoints"`
 */
export const useGovernanceErc20_Checkpoints_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'checkpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"clock"`
 */
export const useGovernanceErc20_Clock_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"context"`
 */
export const useGovernanceErc20_Context_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'context',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"decimals"`
 */
export const useGovernanceErc20_Decimals_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'decimals',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegates"`
 */
export const useGovernanceErc20_Delegates_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'delegates',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"eip712Domain"`
 */
export const useGovernanceErc20_Eip712Domain_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"getPastTotalSupply"`
 */
export const useGovernanceErc20_GetPastTotalSupply_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'getPastTotalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"getPastVotes"`
 */
export const useGovernanceErc20_GetPastVotes_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'getPastVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"getVotes"`
 */
export const useGovernanceErc20_GetVotes_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"imageUrl"`
 */
export const useGovernanceErc20_ImageUrl_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'imageUrl',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"metadata"`
 */
export const useGovernanceErc20_Metadata_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'metadata',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"name"`
 */
export const useGovernanceErc20_Name_read = /*#__PURE__*/ createUseReadContract(
  { abi: governanceErc20Abi, functionName: 'name' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"nonces"`
 */
export const useGovernanceErc20_Nonces_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"numCheckpoints"`
 */
export const useGovernanceErc20_NumCheckpoints_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'numCheckpoints',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"symbol"`
 */
export const useGovernanceErc20_Symbol_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'symbol',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"totalSupply"`
 */
export const useGovernanceErc20_TotalSupply_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'totalSupply',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"universe"`
 */
export const useGovernanceErc20_Universe_read =
  /*#__PURE__*/ createUseReadContract({
    abi: governanceErc20Abi,
    functionName: 'universe',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useGovernanceErc20_Approve_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegate"`
 */
export const useGovernanceErc20_Delegate_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegateBySig"`
 */
export const useGovernanceErc20_DelegateBySig_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"permit"`
 */
export const useGovernanceErc20_Permit_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useGovernanceErc20_Transfer_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useGovernanceErc20_TransferFrom_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: governanceErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"approve"`
 */
export const useGovernanceErc20_Approve_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'approve',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegate"`
 */
export const useGovernanceErc20_Delegate_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'delegate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"delegateBySig"`
 */
export const useGovernanceErc20_DelegateBySig_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'delegateBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"permit"`
 */
export const useGovernanceErc20_Permit_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'permit',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transfer"`
 */
export const useGovernanceErc20_Transfer_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'transfer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link governanceErc20Abi}__ and `functionName` set to `"transferFrom"`
 */
export const useGovernanceErc20_TransferFrom_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: governanceErc20Abi,
    functionName: 'transferFrom',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__
 */
export const useGovernanceErc20_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: governanceErc20Abi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"Approval"`
 */
export const useGovernanceErc20_Approval_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'Approval',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"DelegateChanged"`
 */
export const useGovernanceErc20_DelegateChanged_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'DelegateChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"DelegateVotesChanged"`
 */
export const useGovernanceErc20_DelegateVotesChanged_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'DelegateVotesChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useGovernanceErc20_Eip712DomainChanged_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link governanceErc20Abi}__ and `eventName` set to `"Transfer"`
 */
export const useGovernanceErc20_Transfer_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: governanceErc20Abi,
    eventName: 'Transfer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarFeeLockerAbi}__
 */
export const useLoarFeeLocker_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: loarFeeLockerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"allowedDepositors"`
 */
export const useLoarFeeLocker_AllowedDepositors_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarFeeLockerAbi,
    functionName: 'allowedDepositors',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"availableFees"`
 */
export const useLoarFeeLocker_AvailableFees_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarFeeLockerAbi,
    functionName: 'availableFees',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"feesToClaim"`
 */
export const useLoarFeeLocker_FeesToClaim_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarFeeLockerAbi,
    functionName: 'feesToClaim',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"owner"`
 */
export const useLoarFeeLocker_Owner_read = /*#__PURE__*/ createUseReadContract({
  abi: loarFeeLockerAbi,
  functionName: 'owner',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useLoarFeeLocker_SupportsInterface_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarFeeLockerAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarFeeLockerAbi}__
 */
export const useLoarFeeLocker_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: loarFeeLockerAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"addDepositor"`
 */
export const useLoarFeeLocker_AddDepositor_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarFeeLockerAbi,
    functionName: 'addDepositor',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"claim"`
 */
export const useLoarFeeLocker_Claim_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarFeeLockerAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useLoarFeeLocker_RenounceOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarFeeLockerAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"storeFees"`
 */
export const useLoarFeeLocker_StoreFees_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarFeeLockerAbi,
    functionName: 'storeFees',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useLoarFeeLocker_TransferOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarFeeLockerAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarFeeLockerAbi}__
 */
export const useLoarFeeLocker_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: loarFeeLockerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"addDepositor"`
 */
export const useLoarFeeLocker_AddDepositor_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarFeeLockerAbi,
    functionName: 'addDepositor',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"claim"`
 */
export const useLoarFeeLocker_Claim_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarFeeLockerAbi,
    functionName: 'claim',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useLoarFeeLocker_RenounceOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarFeeLockerAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"storeFees"`
 */
export const useLoarFeeLocker_StoreFees_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarFeeLockerAbi,
    functionName: 'storeFees',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useLoarFeeLocker_TransferOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarFeeLockerAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarFeeLockerAbi}__
 */
export const useLoarFeeLocker_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: loarFeeLockerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `eventName` set to `"AddDepositor"`
 */
export const useLoarFeeLocker_AddDepositor_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarFeeLockerAbi,
    eventName: 'AddDepositor',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `eventName` set to `"ClaimTokens"`
 */
export const useLoarFeeLocker_ClaimTokens_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarFeeLockerAbi,
    eventName: 'ClaimTokens',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `eventName` set to `"ClaimTokensPermissioned"`
 */
export const useLoarFeeLocker_ClaimTokensPermissioned_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarFeeLockerAbi,
    eventName: 'ClaimTokensPermissioned',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useLoarFeeLocker_OwnershipTransferred_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarFeeLockerAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarFeeLockerAbi}__ and `eventName` set to `"StoreTokens"`
 */
export const useLoarFeeLocker_StoreTokens_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarFeeLockerAbi,
    eventName: 'StoreTokens',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__
 */
export const useLoarHookStaticFee_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: loarHookStaticFeeAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"FEE_DENOMINATOR"`
 */
export const useLoarHookStaticFee_FeeDenominator_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'FEE_DENOMINATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"MAX_LP_FEE"`
 */
export const useLoarHookStaticFee_MaxLpFee_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'MAX_LP_FEE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"PROTOCOL_FEE_NUMERATOR"`
 */
export const useLoarHookStaticFee_ProtocolFeeNumerator_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'PROTOCOL_FEE_NUMERATOR',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"factory"`
 */
export const useLoarHookStaticFee_Factory_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'factory',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"getHookPermissions"`
 */
export const useLoarHookStaticFee_GetHookPermissions_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'getHookPermissions',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"loarFee"`
 */
export const useLoarHookStaticFee_LoarFee_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'loarFee',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"owner"`
 */
export const useLoarHookStaticFee_Owner_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"pairedFee"`
 */
export const useLoarHookStaticFee_PairedFee_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'pairedFee',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"poolCreationTimestamp"`
 */
export const useLoarHookStaticFee_PoolCreationTimestamp_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'poolCreationTimestamp',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"poolManager"`
 */
export const useLoarHookStaticFee_PoolManager_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'poolManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"protocolFee"`
 */
export const useLoarHookStaticFee_ProtocolFee_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'protocolFee',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useLoarHookStaticFee_SupportsInterface_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"weth"`
 */
export const useLoarHookStaticFee_Weth_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'weth',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__
 */
export const useLoarHookStaticFee_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: loarHookStaticFeeAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterAddLiquidity"`
 */
export const useLoarHookStaticFee_AfterAddLiquidity_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterAddLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterDonate"`
 */
export const useLoarHookStaticFee_AfterDonate_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterDonate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterInitialize"`
 */
export const useLoarHookStaticFee_AfterInitialize_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterInitialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterRemoveLiquidity"`
 */
export const useLoarHookStaticFee_AfterRemoveLiquidity_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterRemoveLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterSwap"`
 */
export const useLoarHookStaticFee_AfterSwap_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterSwap',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeAddLiquidity"`
 */
export const useLoarHookStaticFee_BeforeAddLiquidity_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeAddLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeDonate"`
 */
export const useLoarHookStaticFee_BeforeDonate_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeDonate',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeInitialize"`
 */
export const useLoarHookStaticFee_BeforeInitialize_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeInitialize',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeRemoveLiquidity"`
 */
export const useLoarHookStaticFee_BeforeRemoveLiquidity_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeRemoveLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeSwap"`
 */
export const useLoarHookStaticFee_BeforeSwap_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeSwap',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"initializePool"`
 */
export const useLoarHookStaticFee_InitializePool_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'initializePool',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useLoarHookStaticFee_RenounceOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useLoarHookStaticFee_TransferOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__
 */
export const useLoarHookStaticFee_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: loarHookStaticFeeAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterAddLiquidity"`
 */
export const useLoarHookStaticFee_AfterAddLiquidity_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterAddLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterDonate"`
 */
export const useLoarHookStaticFee_AfterDonate_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterDonate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterInitialize"`
 */
export const useLoarHookStaticFee_AfterInitialize_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterInitialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterRemoveLiquidity"`
 */
export const useLoarHookStaticFee_AfterRemoveLiquidity_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterRemoveLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"afterSwap"`
 */
export const useLoarHookStaticFee_AfterSwap_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'afterSwap',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeAddLiquidity"`
 */
export const useLoarHookStaticFee_BeforeAddLiquidity_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeAddLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeDonate"`
 */
export const useLoarHookStaticFee_BeforeDonate_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeDonate',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeInitialize"`
 */
export const useLoarHookStaticFee_BeforeInitialize_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeInitialize',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeRemoveLiquidity"`
 */
export const useLoarHookStaticFee_BeforeRemoveLiquidity_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeRemoveLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"beforeSwap"`
 */
export const useLoarHookStaticFee_BeforeSwap_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'beforeSwap',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"initializePool"`
 */
export const useLoarHookStaticFee_InitializePool_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'initializePool',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useLoarHookStaticFee_RenounceOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useLoarHookStaticFee_TransferOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarHookStaticFeeAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarHookStaticFeeAbi}__
 */
export const useLoarHookStaticFee_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: loarHookStaticFeeAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `eventName` set to `"ClaimProtocolFees"`
 */
export const useLoarHookStaticFee_ClaimProtocolFees_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarHookStaticFeeAbi,
    eventName: 'ClaimProtocolFees',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useLoarHookStaticFee_OwnershipTransferred_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarHookStaticFeeAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `eventName` set to `"PoolCreatedFactory"`
 */
export const useLoarHookStaticFee_PoolCreatedFactory_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarHookStaticFeeAbi,
    eventName: 'PoolCreatedFactory',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `eventName` set to `"PoolCreatedOpen"`
 */
export const useLoarHookStaticFee_PoolCreatedOpen_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarHookStaticFeeAbi,
    eventName: 'PoolCreatedOpen',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarHookStaticFeeAbi}__ and `eventName` set to `"PoolInitialized"`
 */
export const useLoarHookStaticFee_PoolInitialized_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarHookStaticFeeAbi,
    eventName: 'PoolInitialized',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__
 */
export const useLoarLpLockerMultiple_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: loarLpLockerMultipleAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"BASIS_POINTS"`
 */
export const useLoarLpLockerMultiple_BasisPoints_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'BASIS_POINTS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"MAX_LP_POSITIONS"`
 */
export const useLoarLpLockerMultiple_MaxLpPositions_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'MAX_LP_POSITIONS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"MAX_REWARD_PARTICIPANTS"`
 */
export const useLoarLpLockerMultiple_MaxRewardParticipants_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'MAX_REWARD_PARTICIPANTS',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"factory"`
 */
export const useLoarLpLockerMultiple_Factory_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'factory',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"feeLocker"`
 */
export const useLoarLpLockerMultiple_FeeLocker_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'feeLocker',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"owner"`
 */
export const useLoarLpLockerMultiple_Owner_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"permit2"`
 */
export const useLoarLpLockerMultiple_Permit2_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'permit2',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"positionManager"`
 */
export const useLoarLpLockerMultiple_PositionManager_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'positionManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useLoarLpLockerMultiple_SupportsInterface_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"tokenRewards"`
 */
export const useLoarLpLockerMultiple_TokenRewards_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'tokenRewards',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"version"`
 */
export const useLoarLpLockerMultiple_Version_read =
  /*#__PURE__*/ createUseReadContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__
 */
export const useLoarLpLockerMultiple_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: loarLpLockerMultipleAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"collectRewards"`
 */
export const useLoarLpLockerMultiple_CollectRewards_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'collectRewards',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"collectRewardsWithoutUnlock"`
 */
export const useLoarLpLockerMultiple_CollectRewardsWithoutUnlock_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'collectRewardsWithoutUnlock',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useLoarLpLockerMultiple_OnErc721Received_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"placeLiquidity"`
 */
export const useLoarLpLockerMultiple_PlaceLiquidity_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'placeLiquidity',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useLoarLpLockerMultiple_RenounceOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useLoarLpLockerMultiple_TransferOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"updateRewardAdmin"`
 */
export const useLoarLpLockerMultiple_UpdateRewardAdmin_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'updateRewardAdmin',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"updateRewardRecipient"`
 */
export const useLoarLpLockerMultiple_UpdateRewardRecipient_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'updateRewardRecipient',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"withdrawERC20"`
 */
export const useLoarLpLockerMultiple_WithdrawErc20_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'withdrawERC20',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"withdrawETH"`
 */
export const useLoarLpLockerMultiple_WithdrawEth_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'withdrawETH',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__
 */
export const useLoarLpLockerMultiple_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: loarLpLockerMultipleAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"collectRewards"`
 */
export const useLoarLpLockerMultiple_CollectRewards_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'collectRewards',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"collectRewardsWithoutUnlock"`
 */
export const useLoarLpLockerMultiple_CollectRewardsWithoutUnlock_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'collectRewardsWithoutUnlock',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useLoarLpLockerMultiple_OnErc721Received_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"placeLiquidity"`
 */
export const useLoarLpLockerMultiple_PlaceLiquidity_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'placeLiquidity',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useLoarLpLockerMultiple_RenounceOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useLoarLpLockerMultiple_TransferOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"updateRewardAdmin"`
 */
export const useLoarLpLockerMultiple_UpdateRewardAdmin_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'updateRewardAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"updateRewardRecipient"`
 */
export const useLoarLpLockerMultiple_UpdateRewardRecipient_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'updateRewardRecipient',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"withdrawERC20"`
 */
export const useLoarLpLockerMultiple_WithdrawErc20_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'withdrawERC20',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `functionName` set to `"withdrawETH"`
 */
export const useLoarLpLockerMultiple_WithdrawEth_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: loarLpLockerMultipleAbi,
    functionName: 'withdrawETH',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__
 */
export const useLoarLpLockerMultiple_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: loarLpLockerMultipleAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `eventName` set to `"ClaimedRewards"`
 */
export const useLoarLpLockerMultiple_ClaimedRewards_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarLpLockerMultipleAbi,
    eventName: 'ClaimedRewards',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useLoarLpLockerMultiple_OwnershipTransferred_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarLpLockerMultipleAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `eventName` set to `"Received"`
 */
export const useLoarLpLockerMultiple_Received_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarLpLockerMultipleAbi,
    eventName: 'Received',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `eventName` set to `"RewardAdminUpdated"`
 */
export const useLoarLpLockerMultiple_RewardAdminUpdated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarLpLockerMultipleAbi,
    eventName: 'RewardAdminUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `eventName` set to `"RewardRecipientUpdated"`
 */
export const useLoarLpLockerMultiple_RewardRecipientUpdated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarLpLockerMultipleAbi,
    eventName: 'RewardRecipientUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link loarLpLockerMultipleAbi}__ and `eventName` set to `"TokenRewardAdded"`
 */
export const useLoarLpLockerMultiple_TokenRewardAdded_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: loarLpLockerMultipleAbi,
    eventName: 'TokenRewardAdded',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__
 */
export const useUniverse_undefined_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"associatedToken"`
 */
export const useUniverse_AssociatedToken_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'associatedToken',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getAdmin"`
 */
export const useUniverse_GetAdmin_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
  functionName: 'getAdmin',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getCanonChain"`
 */
export const useUniverse_GetCanonChain_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'getCanonChain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getFullGraph"`
 */
export const useUniverse_GetFullGraph_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'getFullGraph',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getLeaves"`
 */
export const useUniverse_GetLeaves_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
  functionName: 'getLeaves',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getMedia"`
 */
export const useUniverse_GetMedia_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
  functionName: 'getMedia',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getNode"`
 */
export const useUniverse_GetNode_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
  functionName: 'getNode',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getTimeline"`
 */
export const useUniverse_GetTimeline_read = /*#__PURE__*/ createUseReadContract(
  { abi: universeAbi, functionName: 'getTimeline' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"getToken"`
 */
export const useUniverse_GetToken_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
  functionName: 'getToken',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"latestNodeId"`
 */
export const useUniverse_LatestNodeId_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'latestNodeId',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"nodeIDToHex"`
 */
export const useUniverse_NodeIdToHex_read = /*#__PURE__*/ createUseReadContract(
  { abi: universeAbi, functionName: 'nodeIDToHex' },
)

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"nodes"`
 */
export const useUniverse_Nodes_read = /*#__PURE__*/ createUseReadContract({
  abi: universeAbi,
  functionName: 'nodes',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"universeAdmin"`
 */
export const useUniverse_UniverseAdmin_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'universeAdmin',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"universeDescription"`
 */
export const useUniverse_UniverseDescription_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'universeDescription',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"universeImageUrl"`
 */
export const useUniverse_UniverseImageUrl_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'universeImageUrl',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"universeManager"`
 */
export const useUniverse_UniverseManager_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'universeManager',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"universeName"`
 */
export const useUniverse_UniverseName_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeAbi,
    functionName: 'universeName',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__
 */
export const useUniverse_undefined_write = /*#__PURE__*/ createUseWriteContract(
  { abi: universeAbi },
)

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"createNode"`
 */
export const useUniverse_CreateNode_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeAbi,
    functionName: 'createNode',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setAdmin"`
 */
export const useUniverse_SetAdmin_write = /*#__PURE__*/ createUseWriteContract({
  abi: universeAbi,
  functionName: 'setAdmin',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setCanon"`
 */
export const useUniverse_SetCanon_write = /*#__PURE__*/ createUseWriteContract({
  abi: universeAbi,
  functionName: 'setCanon',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setMedia"`
 */
export const useUniverse_SetMedia_write = /*#__PURE__*/ createUseWriteContract({
  abi: universeAbi,
  functionName: 'setMedia',
})

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setNodeCreationOption"`
 */
export const useUniverse_SetNodeCreationOption_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeAbi,
    functionName: 'setNodeCreationOption',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setNodeVisibilityOption"`
 */
export const useUniverse_SetNodeVisibilityOption_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeAbi,
    functionName: 'setNodeVisibilityOption',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setToken"`
 */
export const useUniverse_SetToken_write = /*#__PURE__*/ createUseWriteContract({
  abi: universeAbi,
  functionName: 'setToken',
})

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__
 */
export const useUniverse_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: universeAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"createNode"`
 */
export const useUniverse_CreateNode_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'createNode',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setAdmin"`
 */
export const useUniverse_SetAdmin_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'setAdmin',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setCanon"`
 */
export const useUniverse_SetCanon_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'setCanon',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setMedia"`
 */
export const useUniverse_SetMedia_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'setMedia',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setNodeCreationOption"`
 */
export const useUniverse_SetNodeCreationOption_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'setNodeCreationOption',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setNodeVisibilityOption"`
 */
export const useUniverse_SetNodeVisibilityOption_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'setNodeVisibilityOption',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeAbi}__ and `functionName` set to `"setToken"`
 */
export const useUniverse_SetToken_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeAbi,
    functionName: 'setToken',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeAbi}__
 */
export const useUniverse_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: universeAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeAbi}__ and `eventName` set to `"MediaUpdated"`
 */
export const useUniverse_MediaUpdated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeAbi,
    eventName: 'MediaUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeAbi}__ and `eventName` set to `"NodeCanonized"`
 */
export const useUniverse_NodeCanonized_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeAbi,
    eventName: 'NodeCanonized',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeAbi}__ and `eventName` set to `"NodeCreated"`
 */
export const useUniverse_NodeCreated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeAbi,
    eventName: 'NodeCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeAbi}__ and `eventName` set to `"NodeCreationOptionUpdated"`
 */
export const useUniverse_NodeCreationOptionUpdated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeAbi,
    eventName: 'NodeCreationOptionUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeAbi}__ and `eventName` set to `"NodeVisibilityOptionUpdated"`
 */
export const useUniverse_NodeVisibilityOptionUpdated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeAbi,
    eventName: 'NodeVisibilityOptionUpdated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"BALLOT_TYPEHASH"`
 */
export const useUniverseGovernor_BallotTypehash_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"CLOCK_MODE"`
 */
export const useUniverseGovernor_ClockMode_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'CLOCK_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"COUNTING_MODE"`
 */
export const useUniverseGovernor_CountingMode_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'COUNTING_MODE',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"EXTENDED_BALLOT_TYPEHASH"`
 */
export const useUniverseGovernor_ExtendedBallotTypehash_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'EXTENDED_BALLOT_TYPEHASH',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"clock"`
 */
export const useUniverseGovernor_Clock_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'clock',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"eip712Domain"`
 */
export const useUniverseGovernor_Eip712Domain_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'eip712Domain',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"getVotes"`
 */
export const useUniverseGovernor_GetVotes_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'getVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"getVotesWithParams"`
 */
export const useUniverseGovernor_GetVotesWithParams_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'getVotesWithParams',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"hasVoted"`
 */
export const useUniverseGovernor_HasVoted_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'hasVoted',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"hashProposal"`
 */
export const useUniverseGovernor_HashProposal_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'hashProposal',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"name"`
 */
export const useUniverseGovernor_Name_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'name',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"nonces"`
 */
export const useUniverseGovernor_Nonces_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'nonces',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalDeadline"`
 */
export const useUniverseGovernor_ProposalDeadline_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalDeadline',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalEta"`
 */
export const useUniverseGovernor_ProposalEta_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalEta',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalNeedsQueuing"`
 */
export const useUniverseGovernor_ProposalNeedsQueuing_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalNeedsQueuing',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalProposer"`
 */
export const useUniverseGovernor_ProposalProposer_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalProposer',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalSnapshot"`
 */
export const useUniverseGovernor_ProposalSnapshot_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalSnapshot',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalThreshold"`
 */
export const useUniverseGovernor_ProposalThreshold_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalThreshold',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"proposalVotes"`
 */
export const useUniverseGovernor_ProposalVotes_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'proposalVotes',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"quorum"`
 */
export const useUniverseGovernor_Quorum_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'quorum',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"quorumDenominator"`
 */
export const useUniverseGovernor_QuorumDenominator_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'quorumDenominator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"quorumNumerator"`
 */
export const useUniverseGovernor_QuorumNumerator_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'quorumNumerator',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"state"`
 */
export const useUniverseGovernor_State_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'state',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"supportsInterface"`
 */
export const useUniverseGovernor_SupportsInterface_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'supportsInterface',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"token"`
 */
export const useUniverseGovernor_Token_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'token',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"version"`
 */
export const useUniverseGovernor_Version_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'version',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"votingDelay"`
 */
export const useUniverseGovernor_VotingDelay_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'votingDelay',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"votingPeriod"`
 */
export const useUniverseGovernor_VotingPeriod_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeGovernorAbi,
    functionName: 'votingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"cancel"`
 */
export const useUniverseGovernor_Cancel_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const useUniverseGovernor_CastVote_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useUniverseGovernor_CastVoteBySig_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useUniverseGovernor_CastVoteWithReason_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useUniverseGovernor_CastVoteWithReasonAndParams_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useUniverseGovernor_CastVoteWithReasonAndParamsBySig_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const useUniverseGovernor_Execute_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useUniverseGovernor_OnErc1155BatchReceived_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useUniverseGovernor_OnErc1155Received_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useUniverseGovernor_OnErc721Received_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const useUniverseGovernor_Propose_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"queue"`
 */
export const useUniverseGovernor_Queue_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"relay"`
 */
export const useUniverseGovernor_Relay_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setProposalThreshold"`
 */
export const useUniverseGovernor_SetProposalThreshold_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'setProposalThreshold',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingDelay"`
 */
export const useUniverseGovernor_SetVotingDelay_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingDelay',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingPeriod"`
 */
export const useUniverseGovernor_SetVotingPeriod_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingPeriod',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"updateQuorumNumerator"`
 */
export const useUniverseGovernor_UpdateQuorumNumerator_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeGovernorAbi,
    functionName: 'updateQuorumNumerator',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"cancel"`
 */
export const useUniverseGovernor_Cancel_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'cancel',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVote"`
 */
export const useUniverseGovernor_CastVote_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVote',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteBySig"`
 */
export const useUniverseGovernor_CastVoteBySig_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReason"`
 */
export const useUniverseGovernor_CastVoteWithReason_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReason',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParams"`
 */
export const useUniverseGovernor_CastVoteWithReasonAndParams_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParams',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"castVoteWithReasonAndParamsBySig"`
 */
export const useUniverseGovernor_CastVoteWithReasonAndParamsBySig_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'castVoteWithReasonAndParamsBySig',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"execute"`
 */
export const useUniverseGovernor_Execute_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'execute',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155BatchReceived"`
 */
export const useUniverseGovernor_OnErc1155BatchReceived_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155BatchReceived',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC1155Received"`
 */
export const useUniverseGovernor_OnErc1155Received_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'onERC1155Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"onERC721Received"`
 */
export const useUniverseGovernor_OnErc721Received_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'onERC721Received',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"propose"`
 */
export const useUniverseGovernor_Propose_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'propose',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"queue"`
 */
export const useUniverseGovernor_Queue_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'queue',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"relay"`
 */
export const useUniverseGovernor_Relay_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'relay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setProposalThreshold"`
 */
export const useUniverseGovernor_SetProposalThreshold_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'setProposalThreshold',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingDelay"`
 */
export const useUniverseGovernor_SetVotingDelay_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingDelay',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"setVotingPeriod"`
 */
export const useUniverseGovernor_SetVotingPeriod_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'setVotingPeriod',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeGovernorAbi}__ and `functionName` set to `"updateQuorumNumerator"`
 */
export const useUniverseGovernor_UpdateQuorumNumerator_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeGovernorAbi,
    functionName: 'updateQuorumNumerator',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__
 */
export const useUniverseGovernor_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: universeGovernorAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"EIP712DomainChanged"`
 */
export const useUniverseGovernor_Eip712DomainChanged_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'EIP712DomainChanged',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalCanceled"`
 */
export const useUniverseGovernor_ProposalCanceled_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalCanceled',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalCreated"`
 */
export const useUniverseGovernor_ProposalCreated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalExecuted"`
 */
export const useUniverseGovernor_ProposalExecuted_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalExecuted',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalQueued"`
 */
export const useUniverseGovernor_ProposalQueued_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalQueued',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"ProposalThresholdSet"`
 */
export const useUniverseGovernor_ProposalThresholdSet_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'ProposalThresholdSet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"QuorumNumeratorUpdated"`
 */
export const useUniverseGovernor_QuorumNumeratorUpdated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'QuorumNumeratorUpdated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VoteCast"`
 */
export const useUniverseGovernor_VoteCast_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VoteCast',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VoteCastWithParams"`
 */
export const useUniverseGovernor_VoteCastWithParams_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VoteCastWithParams',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VotingDelaySet"`
 */
export const useUniverseGovernor_VotingDelaySet_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VotingDelaySet',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeGovernorAbi}__ and `eventName` set to `"VotingPeriodSet"`
 */
export const useUniverseGovernor_VotingPeriodSet_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeGovernorAbi,
    eventName: 'VotingPeriodSet',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__
 */
export const useUniverseManager_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: universeManagerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"BPS"`
 */
export const useUniverseManager_Bps_read = /*#__PURE__*/ createUseReadContract({
  abi: universeManagerAbi,
  functionName: 'BPS',
})

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"TOKEN_SUPPLY"`
 */
export const useUniverseManager_TokenSupply_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'TOKEN_SUPPLY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"deprecated"`
 */
export const useUniverseManager_Deprecated_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'deprecated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"enabledHooks"`
 */
export const useUniverseManager_EnabledHooks_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'enabledHooks',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"enabledLockers"`
 */
export const useUniverseManager_EnabledLockers_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'enabledLockers',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"getUniverseData"`
 */
export const useUniverseManager_GetUniverseData_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'getUniverseData',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"owner"`
 */
export const useUniverseManager_Owner_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'owner',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"teamFee"`
 */
export const useUniverseManager_TeamFee_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'teamFee',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"teamFeeRecipient"`
 */
export const useUniverseManager_TeamFeeRecipient_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'teamFeeRecipient',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"tokenDeployer"`
 */
export const useUniverseManager_TokenDeployer_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeManagerAbi,
    functionName: 'tokenDeployer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__
 */
export const useUniverseManager_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: universeManagerAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"claimTeamFee"`
 */
export const useUniverseManager_ClaimTeamFee_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'claimTeamFee',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"createUniverse"`
 */
export const useUniverseManager_CreateUniverse_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'createUniverse',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"deployUniverseToken"`
 */
export const useUniverseManager_DeployUniverseToken_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'deployUniverseToken',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useUniverseManager_RenounceOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setDeprecated"`
 */
export const useUniverseManager_SetDeprecated_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'setDeprecated',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setHook"`
 */
export const useUniverseManager_SetHook_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'setHook',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setLocker"`
 */
export const useUniverseManager_SetLocker_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'setLocker',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setTeamFeeRecipient"`
 */
export const useUniverseManager_SetTeamFeeRecipient_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'setTeamFeeRecipient',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setTokenDeployer"`
 */
export const useUniverseManager_SetTokenDeployer_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'setTokenDeployer',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useUniverseManager_TransferOwnership_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeManagerAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__
 */
export const useUniverseManager_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: universeManagerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"claimTeamFee"`
 */
export const useUniverseManager_ClaimTeamFee_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'claimTeamFee',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"createUniverse"`
 */
export const useUniverseManager_CreateUniverse_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'createUniverse',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"deployUniverseToken"`
 */
export const useUniverseManager_DeployUniverseToken_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'deployUniverseToken',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"renounceOwnership"`
 */
export const useUniverseManager_RenounceOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'renounceOwnership',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setDeprecated"`
 */
export const useUniverseManager_SetDeprecated_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'setDeprecated',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setHook"`
 */
export const useUniverseManager_SetHook_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'setHook',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setLocker"`
 */
export const useUniverseManager_SetLocker_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'setLocker',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setTeamFeeRecipient"`
 */
export const useUniverseManager_SetTeamFeeRecipient_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'setTeamFeeRecipient',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"setTokenDeployer"`
 */
export const useUniverseManager_SetTokenDeployer_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'setTokenDeployer',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeManagerAbi}__ and `functionName` set to `"transferOwnership"`
 */
export const useUniverseManager_TransferOwnership_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeManagerAbi,
    functionName: 'transferOwnership',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__
 */
export const useUniverseManager_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: universeManagerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"ClaimTeamFees"`
 */
export const useUniverseManager_ClaimTeamFees_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'ClaimTeamFees',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"OwnershipTransferred"`
 */
export const useUniverseManager_OwnershipTransferred_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'OwnershipTransferred',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"SetDeprecated"`
 */
export const useUniverseManager_SetDeprecated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'SetDeprecated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"SetHook"`
 */
export const useUniverseManager_SetHook_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'SetHook',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"SetLocker"`
 */
export const useUniverseManager_SetLocker_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'SetLocker',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"SetTeamFeeRecipient"`
 */
export const useUniverseManager_SetTeamFeeRecipient_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'SetTeamFeeRecipient',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"SetTokenDeployer"`
 */
export const useUniverseManager_SetTokenDeployer_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'SetTokenDeployer',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"TokenCreated"`
 */
export const useUniverseManager_TokenCreated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'TokenCreated',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"TokenDeployed"`
 */
export const useUniverseManager_TokenDeployed_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'TokenDeployed',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeManagerAbi}__ and `eventName` set to `"UniverseCreated"`
 */
export const useUniverseManager_UniverseCreated_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeManagerAbi,
    eventName: 'UniverseCreated',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__
 */
export const useUniverseTokenDeployer_undefined_read =
  /*#__PURE__*/ createUseReadContract({ abi: universeTokenDeployerAbi })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__ and `functionName` set to `"TOKEN_SUPPLY"`
 */
export const useUniverseTokenDeployer_TokenSupply_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeTokenDeployerAbi,
    functionName: 'TOKEN_SUPPLY',
  })

/**
 * Wraps __{@link useReadContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__ and `functionName` set to `"universeManager"`
 */
export const useUniverseTokenDeployer_UniverseManager_read =
  /*#__PURE__*/ createUseReadContract({
    abi: universeTokenDeployerAbi,
    functionName: 'universeManager',
  })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__
 */
export const useUniverseTokenDeployer_undefined_write =
  /*#__PURE__*/ createUseWriteContract({ abi: universeTokenDeployerAbi })

/**
 * Wraps __{@link useWriteContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__ and `functionName` set to `"deployTokenAndGovernance"`
 */
export const useUniverseTokenDeployer_DeployTokenAndGovernance_write =
  /*#__PURE__*/ createUseWriteContract({
    abi: universeTokenDeployerAbi,
    functionName: 'deployTokenAndGovernance',
  })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__
 */
export const useUniverseTokenDeployer_undefined_simulate =
  /*#__PURE__*/ createUseSimulateContract({ abi: universeTokenDeployerAbi })

/**
 * Wraps __{@link useSimulateContract}__ with `abi` set to __{@link universeTokenDeployerAbi}__ and `functionName` set to `"deployTokenAndGovernance"`
 */
export const useUniverseTokenDeployer_DeployTokenAndGovernance_simulate =
  /*#__PURE__*/ createUseSimulateContract({
    abi: universeTokenDeployerAbi,
    functionName: 'deployTokenAndGovernance',
  })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeTokenDeployerAbi}__
 */
export const useUniverseTokenDeployer_undefined_watch =
  /*#__PURE__*/ createUseWatchContractEvent({ abi: universeTokenDeployerAbi })

/**
 * Wraps __{@link useWatchContractEvent}__ with `abi` set to __{@link universeTokenDeployerAbi}__ and `eventName` set to `"TokenDeployed"`
 */
export const useUniverseTokenDeployer_TokenDeployed_watch =
  /*#__PURE__*/ createUseWatchContractEvent({
    abi: universeTokenDeployerAbi,
    eventName: 'TokenDeployed',
  })
