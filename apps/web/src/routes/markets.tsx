import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useMemo } from "react";
import { useAccount, usePublicClient, useWalletClient } from "wagmi";
import { usePonderQuery } from "@ponder/react";
import { universe, token } from "../../../indexer/ponder.schema";
import { ArrowLeft, ArrowRightLeft, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { parseUnits, formatUnits } from 'viem';
import { Actions, V4Planner } from '@uniswap/v4-sdk';
import { CommandType, RoutePlanner } from '@uniswap/universal-router-sdk';
import { useEffect } from 'react';

export const Route = createFileRoute("/markets")({
  component: MarketsPage,
});

// Contract addresses on Sepolia
const UNIVERSAL_ROUTER_ADDRESS = "0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b";
const QUOTER_ADDRESS = "0x61b3f2011a92d183c7dbadbda940a7555ccf9227";
const PERMIT2_ADDRESS = "0x000000000022D473030F116dDEE9F6B43aC78BA3";

const UNIVERSAL_ROUTER_ABI = [
  {
    inputs: [
      { internalType: "bytes", name: "commands", type: "bytes" },
      { internalType: "bytes[]", name: "inputs", type: "bytes[]" },
      { internalType: "uint256", name: "deadline", type: "uint256" },
    ],
    name: "execute",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];

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

const PERMIT2_ABI = [
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint160", name: "amount", type: "uint160" },
      { internalType: "uint48", name: "expiration", type: "uint48" },
    ],
    name: "approve",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const ERC20_ABI = [
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
];

function MarketsPage() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [swapAmount, setSwapAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [estimatedOutput, setEstimatedOutput] = useState<string>("");

  // Query universes with tokens
  const { data: universesData } = usePonderQuery({
    queryFn: (db) => db.select().from(universe as any),
  });

  const { data: tokensData } = usePonderQuery({
    queryFn: (db) => db.select().from(token as any),
  });

  // Combine and filter for tradable tokens
  const tradableTokens = useMemo(() => {
    if (!universesData || !tokensData) return [];

    type UniverseRow = typeof universe.$inferSelect;
    type TokenRow = typeof token.$inferSelect;

    const universeMap = new Map<string, UniverseRow>();
    (universesData as UniverseRow[]).forEach((u) => {
      universeMap.set(u.id.toLowerCase(), u);
    });

    return (tokensData as TokenRow[])
      .filter((t) => t.poolId) // Only tokens with pools
      .map((t) => ({
        ...t,
        universe: universeMap.get(t.universeAddress.toLowerCase()),
      }));
  }, [universesData, tokensData]);

  // Get quote when amount or token changes
  useEffect(() => {
    const getQuote = async () => {
      if (!swapAmount || !selectedToken || !publicClient) {
        setEstimatedOutput("");
        return;
      }

      try {
        const WETH_ADDRESS = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";
        const amountIn = parseUnits(swapAmount, 18);

        const isWETHCurrency0 = WETH_ADDRESS.toLowerCase() < selectedToken.id.toLowerCase();
        const currency0 = isWETHCurrency0 ? WETH_ADDRESS : selectedToken.id;
        const currency1 = isWETHCurrency0 ? selectedToken.id : WETH_ADDRESS;

        const poolKey = {
          currency0,
          currency1,
          fee: selectedToken.startingTick ? 8388608 : 3000,
          tickSpacing: 200,
          hooks: selectedToken.poolHook,
        };

        const quoteParams = {
          poolKey,
          zeroForOne: isWETHCurrency0,
          exactAmount: amountIn,
          hookData: "0x00",
        };

        // Use callStatic to simulate the call
        const result = await publicClient.readContract({
          address: QUOTER_ADDRESS as `0x${string}`,
          abi: QUOTER_ABI,
          functionName: 'quoteExactInputSingle',
          args: [quoteParams],
        }) as any;

        // result is [deltaAmounts, sqrtPriceX96After, initializedTicksLoaded]
        const deltaAmounts = result[0];
        // deltaAmounts[1] is the output amount (negative because it's being removed)
        const outputAmount = deltaAmounts[1] < 0 ? -deltaAmounts[1] : deltaAmounts[1];
        setEstimatedOutput(formatUnits(outputAmount, 18));
      } catch (error) {
        console.error('Quote failed:', error);
        setEstimatedOutput("~");
      }
    };

    const debounce = setTimeout(getQuote, 500);
    return () => clearTimeout(debounce);
  }, [swapAmount, selectedToken, publicClient]);

  const executeSwap = async () => {
    if (!selectedToken || !swapAmount || !walletClient || !address || !publicClient) {
      toast.error("Please connect wallet and enter swap amount");
      return;
    }

    setIsSwapping(true);

    try {
      const WETH_ADDRESS = "0x7b79995e5f793a07bc00c21412e50ecae098e7f9";
      const amountIn = parseUnits(swapAmount, 18);

      const isWETHCurrency0 = WETH_ADDRESS.toLowerCase() < selectedToken.id.toLowerCase();
      const currency0 = isWETHCurrency0 ? WETH_ADDRESS : selectedToken.id;
      const currency1 = isWETHCurrency0 ? selectedToken.id : WETH_ADDRESS;

      const poolKey = {
        currency0,
        currency1,
        fee: selectedToken.startingTick ? 8388608 : 3000,
        tickSpacing: 200,
        hooks: selectedToken.poolHook,
      };

      const swapConfig = {
        poolKey,
        zeroForOne: isWETHCurrency0,
        amountIn: amountIn.toString(),
        amountOutMinimum: "0", // Accept any amount for testing
        hookData: '0x00'
      };

      console.log('Swap config:', swapConfig);

      // Setup V4 Planner and Route Planner
      const v4Planner = new V4Planner();
      const routePlanner = new RoutePlanner();

      // Set deadline (1 hour from now)
      const deadline = Math.floor(Date.now() / 1000) + 3600;

      // Add actions to V4 planner
      v4Planner.addAction(Actions.SWAP_EXACT_IN_SINGLE, [swapConfig]);
      v4Planner.addAction(Actions.SETTLE_ALL, [swapConfig.poolKey.currency0, swapConfig.amountIn]);
      v4Planner.addAction(Actions.TAKE_ALL, [swapConfig.poolKey.currency1, swapConfig.amountOutMinimum]);

      const encodedActions = v4Planner.finalize();

      // Add V4_SWAP command to route planner with actions and params
      routePlanner.addCommand(CommandType.V4_SWAP, [v4Planner.actions, v4Planner.params]);

      console.log('Route planner commands:', routePlanner.commands);
      console.log('Encoded actions:', encodedActions);

      // Execute swap via Universal Router
      const txOptions = {
        value: amountIn, // Send ETH/WETH with the transaction
      };

      const { request } = await publicClient.simulateContract({
        address: UNIVERSAL_ROUTER_ADDRESS as `0x${string}`,
        abi: UNIVERSAL_ROUTER_ABI,
        functionName: 'execute',
        args: [routePlanner.commands, [encodedActions], BigInt(deadline)],
        value: amountIn,
        account: address,
      });

      const hash = await walletClient.writeContract(request);

      toast.success('Swap submitted!', {
        description: `Transaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
      });

      // Wait for transaction
      await publicClient.waitForTransactionReceipt({ hash });

      toast.success('Swap completed!');
      setSwapAmount("");
      setEstimatedOutput("");
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast.error('Swap failed', {
        description: error.shortMessage || error.message || 'Unknown error occurred',
      });
    } finally {
      setIsSwapping(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Button variant="ghost" size="sm" asChild className="mb-4">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </Button>
              <h1 className="text-4xl font-bold mb-2">Token Markets</h1>
              <p className="text-muted-foreground text-lg">
                Trade universe governance tokens on Uniswap V4
              </p>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Token List */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Available Tokens</h2>
            <div className="space-y-4">
              {tradableTokens.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <p className="text-muted-foreground">No tradable tokens found</p>
                  </CardContent>
                </Card>
              ) : (
                tradableTokens.map((tokenItem) => (
                  <Card
                    key={tokenItem.id}
                    className={`cursor-pointer transition-all hover:border-primary ${
                      selectedToken?.id === tokenItem.id ? 'border-primary border-2' : ''
                    }`}
                    onClick={() => setSelectedToken(tokenItem)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {tokenItem.imageURL && (
                            <img
                              src={tokenItem.imageURL}
                              alt={tokenItem.name}
                              className="w-12 h-12 rounded-full"
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg">${tokenItem.symbol}</h3>
                              <Badge variant="outline">{tokenItem.name}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Universe: {tokenItem.universe?.name || 'Unknown'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className="mb-2">Tradable</Badge>
                          <p className="text-xs text-muted-foreground font-mono">
                            {tokenItem.id.slice(0, 6)}...{tokenItem.id.slice(-4)}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Swap Panel */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowRightLeft className="h-5 w-5" />
                  Swap
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedToken ? (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    Select a token to start swapping
                  </p>
                ) : (
                  <>
                    <div>
                      <Label>From</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={swapAmount}
                          onChange={(e) => setSwapAmount(e.target.value)}
                          disabled={isSwapping}
                        />
                        <Badge>WETH</Badge>
                      </div>
                    </div>

                    <div className="flex justify-center">
                      <ArrowRightLeft className="h-6 w-6 text-muted-foreground" />
                    </div>

                    <div>
                      <Label>To (estimated)</Label>
                      <div className="flex items-center gap-2 mt-2">
                        <Input
                          type="text"
                          placeholder="0.0"
                          disabled
                          value={estimatedOutput || "~"}
                        />
                        <Badge>${selectedToken.symbol}</Badge>
                      </div>
                    </div>

                    <div className="pt-4 space-y-2">
                      <p className="text-xs text-muted-foreground">
                        <strong>Token:</strong> {selectedToken.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Pool ID:</strong> {selectedToken.poolId.slice(0, 10)}...
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <strong>Hook:</strong> {selectedToken.poolHook.slice(0, 10)}...
                      </p>
                    </div>

                    {!isConnected ? (
                      <Button className="w-full" disabled>
                        Connect Wallet
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={executeSwap}
                        disabled={!swapAmount || isSwapping}
                      >
                        {isSwapping ? 'Swapping...' : 'Swap'}
                      </Button>
                    )}

                    <p className="text-xs text-muted-foreground text-center">
                      Swapping WETH → ${selectedToken.symbol}
                    </p>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
