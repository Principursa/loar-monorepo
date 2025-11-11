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
import { useEffect } from 'react';
import { trpcClient } from '@/utils/trpc';

export const Route = createFileRoute("/markets")({
  component: MarketsPage,
});

function MarketsPage() {
  const { address, isConnected, chain } = useAccount();
  const publicClient = usePublicClient();
  const { data: walletClient } = useWalletClient();

  const [selectedToken, setSelectedToken] = useState<any>(null);
  const [swapAmount, setSwapAmount] = useState("");
  const [isSwapping, setIsSwapping] = useState(false);
  const [estimatedOutput, setEstimatedOutput] = useState<string>("");
  const [wethBalance, setWethBalance] = useState<bigint>(0n);
  const [wethAllowance, setWethAllowance] = useState<bigint>(0n);
  const [isWrapping, setIsWrapping] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  // Network-specific addresses
  const NETWORK_CONFIG = {
    // Sepolia
    11155111: {
      weth: "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14",
      universalRouter: "0x3A9D48AB9751398BbFa63ad67599Bb04e4BdF98b",
    },
    // Base Sepolia
    84532: {
      weth: "0x4200000000000000000000000000000000000006",
      universalRouter: "0x492e6456d9528771018deb9e87ef7750ef184104",
    },
  } as const;

  const chainId = chain?.id || 84532; // Default to Base Sepolia
  const config = NETWORK_CONFIG[chainId as keyof typeof NETWORK_CONFIG] || NETWORK_CONFIG[84532];
  const WETH_ADDRESS = config.weth;
  const UNIVERSAL_ROUTER = config.universalRouter;

  const WETH_ABI = [
    {
      inputs: [{ name: 'account', type: 'address' }],
      name: 'balanceOf',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { name: 'owner', type: 'address' },
        { name: 'spender', type: 'address' },
      ],
      name: 'allowance',
      outputs: [{ name: '', type: 'uint256' }],
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        { name: 'spender', type: 'address' },
        { name: 'amount', type: 'uint256' },
      ],
      name: 'approve',
      outputs: [{ name: '', type: 'bool' }],
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      inputs: [],
      name: 'deposit',
      outputs: [],
      stateMutability: 'payable',
      type: 'function',
    },
  ] as const;

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

  // Check WETH balance and allowance when user connects or amount changes
  useEffect(() => {
    const checkWETH = async () => {
      if (!address || !publicClient || !swapAmount) {
        setWethBalance(0n);
        setWethAllowance(0n);
        return;
      }

      try {
        const amountWei = parseUnits(swapAmount, 18);

        // Check WETH balance
        const balance = await publicClient.readContract({
          address: WETH_ADDRESS as `0x${string}`,
          abi: WETH_ABI,
          functionName: 'balanceOf',
          args: [address],
        }) as bigint;

        // Check WETH allowance for Universal Router
        const allowance = await publicClient.readContract({
          address: WETH_ADDRESS as `0x${string}`,
          abi: WETH_ABI,
          functionName: 'allowance',
          args: [address, UNIVERSAL_ROUTER as `0x${string}`],
        }) as bigint;

        setWethBalance(balance);
        setWethAllowance(allowance);
      } catch (error) {
        console.error('Failed to check WETH:', error);
      }
    };

    checkWETH();
  }, [address, publicClient, swapAmount]);

  // Get quote when amount or token changes
  useEffect(() => {
    const getQuote = async () => {
      if (!swapAmount || !selectedToken) {
        setEstimatedOutput("");
        return;
      }

      try {
        const quote = await trpcClient.swap.getQuote.mutate({
          tokenAddress: selectedToken.id,
          amountIn: swapAmount,
          tokenInfo: {
            id: selectedToken.id,
            poolHook: selectedToken.poolHook,
            startingTick: !!selectedToken.startingTick,
          },
        });

        setEstimatedOutput(quote.amountOut);
      } catch (error) {
        console.error('Quote failed:', error);
        // Don't show error, just show that quotes aren't available
        setEstimatedOutput("Quote unavailable - swap to see actual output");
      }
    };

    const debounce = setTimeout(getQuote, 500);
    return () => clearTimeout(debounce);
  }, [swapAmount, selectedToken]);

  const wrapETH = async () => {
    if (!walletClient || !address || !swapAmount) return;

    setIsWrapping(true);
    try {
      const amountWei = parseUnits(swapAmount, 18);

      const hash = await walletClient.writeContract({
        address: WETH_ADDRESS as `0x${string}`,
        abi: WETH_ABI,
        functionName: 'deposit',
        value: amountWei,
        account: address,
      });

      toast.success('Wrapping ETH to WETH...', {
        description: `Transaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success('ETH wrapped to WETH!');

        // Refresh WETH balance
        const balance = await publicClient.readContract({
          address: WETH_ADDRESS as `0x${string}`,
          abi: WETH_ABI,
          functionName: 'balanceOf',
          args: [address],
        }) as bigint;
        setWethBalance(balance);
      }
    } catch (error: any) {
      console.error('Wrap failed:', error);
      toast.error('Failed to wrap ETH', {
        description: error.message || 'Unknown error',
      });
    } finally {
      setIsWrapping(false);
    }
  };

  const approveWETH = async () => {
    if (!walletClient || !address) return;

    setIsApproving(true);
    try {
      // Approve max amount for convenience
      const maxAmount = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

      const hash = await walletClient.writeContract({
        address: WETH_ADDRESS as `0x${string}`,
        abi: WETH_ABI,
        functionName: 'approve',
        args: [UNIVERSAL_ROUTER as `0x${string}`, maxAmount],
        account: address,
      });

      toast.success('Approving WETH...', {
        description: `Transaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
      });

      if (publicClient) {
        await publicClient.waitForTransactionReceipt({ hash });
        toast.success('WETH approved!');
        setWethAllowance(maxAmount);
      }
    } catch (error: any) {
      console.error('Approval failed:', error);
      toast.error('Failed to approve WETH', {
        description: error.message || 'Unknown error',
      });
    } finally {
      setIsApproving(false);
    }
  };

  const executeSwap = async () => {
    if (!selectedToken || !swapAmount || !walletClient || !address) {
      toast.error("Please connect wallet and enter swap amount");
      return;
    }

    setIsSwapping(true);

    try {
      // Build swap transaction on backend
      const txData = await trpcClient.swap.buildSwap.mutate({
        tokenAddress: selectedToken.id,
        amountIn: swapAmount,
        amountOutMinimum: "0", // Accept any amount for testing
        tokenInfo: {
          id: selectedToken.id,
          poolHook: selectedToken.poolHook,
          startingTick: !!selectedToken.startingTick,
        },
      });

      console.log('Transaction data from backend:', txData);

      // Execute transaction using wallet
      const hash = await walletClient.sendTransaction({
        to: txData.to as `0x${string}`,
        data: txData.data as `0x${string}`,
        value: BigInt(txData.value),
        account: address,
      });

      toast.success('Swap submitted!', {
        description: `Transaction: ${hash.slice(0, 10)}...${hash.slice(-8)}`,
      });

      // Wait for transaction
      if (publicClient) {
        const receipt = await publicClient.waitForTransactionReceipt({ hash });
        if (receipt.status === 'reverted') {
          throw new Error('Transaction reverted on-chain');
        }
        toast.success('Swap completed!');
      }

      setSwapAmount("");
      setEstimatedOutput("");
    } catch (error: any) {
      console.error('Swap failed:', error);
      toast.error('Swap failed', {
        description: error.message || 'Unknown error occurred',
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
                      <div className="flex justify-between items-center mb-2">
                        <Label>From</Label>
                        {address && wethBalance > 0n && (
                          <span className="text-xs text-muted-foreground">
                            Balance: {formatUnits(wethBalance, 18).slice(0, 8)} WETH
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          placeholder="0.0"
                          value={swapAmount}
                          onChange={(e) => setSwapAmount(e.target.value)}
                          disabled={isSwapping || isWrapping || isApproving}
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
                          value={estimatedOutput || "Quote unavailable"}
                          className={estimatedOutput?.includes("unavailable") ? "text-muted-foreground text-sm" : ""}
                        />
                        <Badge>${selectedToken.symbol}</Badge>
                      </div>
                      {estimatedOutput?.includes("unavailable") && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Quotes may not work with this pool's hook. Try swapping to see actual output.
                        </p>
                      )}
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
                    ) : !swapAmount ? (
                      <Button className="w-full" disabled>
                        Enter Amount
                      </Button>
                    ) : wethBalance < parseUnits(swapAmount, 18) ? (
                      <Button
                        className="w-full"
                        onClick={wrapETH}
                        disabled={isWrapping}
                      >
                        {isWrapping ? 'Wrapping...' : `Wrap ${swapAmount} ETH to WETH`}
                      </Button>
                    ) : wethAllowance < parseUnits(swapAmount, 18) ? (
                      <Button
                        className="w-full"
                        onClick={approveWETH}
                        disabled={isApproving}
                      >
                        {isApproving ? 'Approving...' : 'Approve WETH'}
                      </Button>
                    ) : (
                      <Button
                        className="w-full"
                        onClick={executeSwap}
                        disabled={isSwapping}
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
