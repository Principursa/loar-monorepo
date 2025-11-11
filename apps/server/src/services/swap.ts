import { ethers } from 'ethers';
import { Actions, V4Planner } from '@uniswap/v4-sdk';
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk';

// Network configurations
const NETWORK_CONFIG = {
  // Sepolia (11155111)
  11155111: {
    universalRouter: "0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b",
    quoter: "0x61b3f2011a92d183c7dbadbda940a7555ccf9227",
    weth: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
    rpcUrl: process.env.SEPOLIA_RPC_URL || 'https://rpc.sepolia.org',
  },
  // Base Sepolia (84532)
  84532: {
    universalRouter: "0x492e6456d9528771018deb9e87ef7750ef184104",
    quoter: "0xC5290058841028F1614F3A6F0F5816cAd0df5E27",
    weth: "0x4200000000000000000000000000000000000006",
    rpcUrl: process.env.BASE_SEPOLIA_RPC_URL || 'https://sepolia.base.org',
  },
} as const;

// Default to Base Sepolia (better Uniswap V4 support)
const CHAIN_ID = parseInt(process.env.CHAIN_ID || '84532');
const CONFIG = NETWORK_CONFIG[CHAIN_ID as keyof typeof NETWORK_CONFIG];

const UNIVERSAL_ROUTER_ADDRESS = CONFIG.universalRouter;
const QUOTER_ADDRESS = CONFIG.quoter;
const WETH_ADDRESS = CONFIG.weth;

const QUOTER_ABI = [
  {
    inputs: [
      {
        components: [
          {
            components: [
              { internalType: "address", name: "currency0", type: "address" },
              { internalType: "address", name: "currency1", type: "address" },
              { internalType: "uint24", name: "fee", type: "uint24" },
              { internalType: "int24", name: "tickSpacing", type: "int24" },
              { internalType: "address", name: "hooks", type: "address" },
            ],
            internalType: "struct PoolKey",
            name: "poolKey",
            type: "tuple",
          },
          { internalType: "bool", name: "zeroForOne", type: "bool" },
          { internalType: "uint128", name: "exactAmount", type: "uint128" },
          { internalType: "bytes", name: "hookData", type: "bytes" },
        ],
        internalType: "struct IQuoter.QuoteExactSingleParams",
        name: "params",
        type: "tuple",
      },
    ],
    name: "quoteExactInputSingle",
    outputs: [
      { internalType: "int128[]", name: "deltaAmounts", type: "int128[]" },
      { internalType: "uint160", name: "sqrtPriceX96After", type: "uint160" },
      { internalType: "uint32", name: "initializedTicksLoaded", type: "uint32" },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];

interface TokenInfo {
  id: string;
  poolHook: string;
  startingTick: boolean;
}

interface QuoteParams {
  tokenAddress: string;
  amountIn: string;
  tokenInfo: TokenInfo;
}

interface BuildSwapParams {
  tokenAddress: string;
  amountIn: string;
  amountOutMinimum: string;
  tokenInfo: TokenInfo;
  deadline: number;
}

class SwapService {
  private provider: ethers.JsonRpcProvider;

  constructor() {
    // Initialize provider for the configured network
    console.log(`Initializing swap service for chain ${CHAIN_ID}`);
    this.provider = new ethers.JsonRpcProvider(CONFIG.rpcUrl);
  }

  /**
   * Get a quote for swapping WETH to a governance token
   */
  async getQuote(params: QuoteParams) {
    const { tokenAddress, amountIn, tokenInfo } = params;

    try {
      const amountInWei = ethers.parseUnits(amountIn, 18);

      // Determine pool key based on token ordering
      const isWETHCurrency0 = WETH_ADDRESS.toLowerCase() < tokenAddress.toLowerCase();
      const currency0 = isWETHCurrency0 ? WETH_ADDRESS : tokenAddress;
      const currency1 = isWETHCurrency0 ? tokenAddress : WETH_ADDRESS;

      const poolKey = {
        currency0,
        currency1,
        fee: tokenInfo.startingTick ? 8388608 : 3000,
        tickSpacing: 200,
        hooks: tokenInfo.poolHook,
      };

      const quoteParams = {
        poolKey,
        zeroForOne: isWETHCurrency0,
        exactAmount: amountInWei,
        hookData: "0x00",
      };

      // Create contract instance
      const quoterContract = new ethers.Contract(
        QUOTER_ADDRESS,
        QUOTER_ABI,
        this.provider
      );

      // Get quote using staticCall (view function)
      const result = await quoterContract.quoteExactInputSingle.staticCall(quoteParams);

      // Parse result: [deltaAmounts, sqrtPriceX96After, initializedTicksLoaded]
      const deltaAmounts = result[0];

      // deltaAmounts[1] is the output amount (negative because it's being removed)
      const outputAmount = deltaAmounts[1] < 0n ? -deltaAmounts[1] : deltaAmounts[1];
      const outputFormatted = ethers.formatUnits(outputAmount, 18);

      return {
        amountIn,
        amountOut: outputFormatted,
        poolKey,
        isWETHCurrency0,
      };
    } catch (error: any) {
      console.error('Quote failed:', error);

      // Try to decode the error
      let errorMessage = 'Failed to get quote';
      if (error.data) {
        console.error('Error data:', error.data);
        // Common error signatures
        if (error.data.includes('486aa307')) {
          errorMessage = 'Pool does not exist or is not initialized. Make sure this token has a liquidity pool on Uniswap V4.';
        } else if (error.data.includes('6190b2b0')) {
          errorMessage = 'Pool locked or invalid state. The pool may not be ready for trading.';
        }
      }

      throw new Error(`${errorMessage}: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Build transaction calldata for swapping WETH to a governance token
   * Note: User must have WETH and approve Universal Router before calling
   */
  async buildSwapTransaction(params: BuildSwapParams) {
    const { tokenAddress, amountIn, amountOutMinimum, tokenInfo, deadline } = params;

    try {
      const amountInWei = ethers.parseUnits(amountIn, 18);
      const amountOutMinWei = ethers.parseUnits(amountOutMinimum, 18);

      // Determine pool key based on token ordering
      const isWETHCurrency0 = WETH_ADDRESS.toLowerCase() < tokenAddress.toLowerCase();
      const currency0 = isWETHCurrency0 ? WETH_ADDRESS : tokenAddress;
      const currency1 = isWETHCurrency0 ? tokenAddress : WETH_ADDRESS;

      const poolKey = {
        currency0,
        currency1,
        fee: tokenInfo.startingTick ? 8388608 : 3000,
        tickSpacing: 200,
        hooks: tokenInfo.poolHook,
      };

      const swapConfig = {
        poolKey,
        zeroForOne: isWETHCurrency0,
        amountIn: amountInWei.toString(),
        amountOutMinimum: amountOutMinWei.toString(),
        hookData: '0x00'
      };

      // Setup V4 Planner for direct WETH swap (user must have WETH)
      const v4Planner = new V4Planner();
      v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [swapConfig]);
      v4Planner.addAction(Actions.SETTLE_ALL, [poolKey.currency0, swapConfig.amountIn]);
      v4Planner.addAction(Actions.TAKE_ALL, [poolKey.currency1, swapConfig.amountOutMinimum]);

      const encodedActions = v4Planner.finalize();

      // Setup Route Planner
      const routePlanner = new RoutePlanner();
      routePlanner.addCommand(CommandType.V4_SWAP, [encodedActions]);

      // Encode the execute function call properly
      const universalRouterInterface = new ethers.Interface([
        'function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable'
      ]);

      const calldata = universalRouterInterface.encodeFunctionData('execute', [
        routePlanner.commands,
        routePlanner.inputs,
        deadline
      ]);

      // Try to simulate the transaction to catch errors early
      try {
        const universalRouter = new ethers.Contract(
          UNIVERSAL_ROUTER_ADDRESS,
          ['function execute(bytes calldata commands, bytes[] calldata inputs, uint256 deadline) external payable'],
          this.provider
        );

        // Simulate with a test address (won't actually send)
        await universalRouter.execute.staticCall(
          routePlanner.commands,
          routePlanner.inputs,
          deadline,
          { value: amountInWei }
        );

        console.log('✅ Transaction simulation successful');
      } catch (simError: any) {
        console.error('⚠️ Transaction simulation failed:', simError);
        // Log detailed error but don't throw - let user see the actual error when they submit
        if (simError.data) {
          console.error('Error data:', simError.data);
        }
        if (simError.reason) {
          console.error('Error reason:', simError.reason);
        }
      }

      return {
        to: UNIVERSAL_ROUTER_ADDRESS,
        data: calldata,
        value: "0", // No ETH needed - user swaps with WETH directly
        requiresWETH: true, // Signal that user needs WETH
        wethAddress: WETH_ADDRESS,
      };
    } catch (error) {
      console.error('Build swap transaction failed:', error);
      throw new Error(`Failed to build swap: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

export const swapService = new SwapService();
