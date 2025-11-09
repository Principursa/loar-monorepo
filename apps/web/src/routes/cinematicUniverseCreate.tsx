import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAccount, useBalance, useChainId, useSwitchChain, useWaitForTransactionReceipt } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { Rocket, CheckCircle2, Loader2, ExternalLink, AlertCircle, Sparkles, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useUniverseManager, useDefaultDeploymentConfig } from "@/hooks/useUniverseManager";
import { parseEther } from "viem";

export const Route = createFileRoute("/cinematicUniverseCreate")({
  component: CinematicUniverseCreate,
});

// Deployment steps
enum DeploymentStep {
  IDLE = "idle",
  CREATING_UNIVERSE = "creating_universe",
  UNIVERSE_CREATED = "universe_created",
  DEPLOYING_TOKEN = "deploying_token",
  TOKEN_DEPLOYED = "token_deployed",
  COMPLETED = "completed",
}

function CinematicUniverseCreate() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { switchChain } = useSwitchChain();

  // Form state
  const [universeName, setUniverseName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [metadata, setMetadata] = useState(""); // Additional token metadata
  const [context, setContext] = useState(""); // Universe context/lore

  // Deployment state
  const [deploymentStep, setDeploymentStep] = useState<DeploymentStep>(DeploymentStep.IDLE);
  const [universeId, setUniverseId] = useState<bigint | null>(null);
  const [universeAddress, setUniverseAddress] = useState<`0x${string}` | null>(null);
  const [tokenAddress, setTokenAddress] = useState<`0x${string}` | null>(null);
  const [governorAddress, setGovernorAddress] = useState<`0x${string}` | null>(null);

  // Cover image generation state
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  // Hooks
  const { createUniverse, deployUniverseToken, hash, isPending, isConfirming, error } = useUniverseManager();
  const defaultConfig = useDefaultDeploymentConfig();
  const { isSuccess: txSuccess, data: txReceipt } = useWaitForTransactionReceipt({ hash });

  const handleSwitchNetwork = async () => {
    try {
      await switchChain({ chainId: 11155111 });
    } catch (error) {
      console.error("Failed to switch network:", error);
    }
  };

  // Cover image generation mutation
  const generateCoverMutation = useMutation({
    mutationFn: async () => {
      const prompt = `Epic cinematic universe cover art for "${universeName}". ${description}. Professional movie poster style, high quality, dramatic lighting`;

      const result = await trpcClient.fal.generateImage.mutate({
        prompt,
        model: "fal-ai/nano-banana",
        imageSize: "landscape_16_9",
      });

      return result;
    },
    onSuccess: (data) => {
      if (data?.imageUrl) {
        setCoverPreview(data.imageUrl);
        setImageUrl(data.imageUrl);
      }
    },
    onError: (error) => {
      console.error("Cover generation failed:", error);
      alert("Failed to generate cover. Please try again.");
    },
  });

  const handleGenerateCover = async () => {
    if (!universeName) {
      alert("Please enter a universe name first");
      return;
    }
    setIsGeneratingCover(true);
    try {
      await generateCoverMutation.mutateAsync();
    } finally {
      setIsGeneratingCover(false);
    }
  };

  // Watch for transaction success and update deployment step
  if (txSuccess && deploymentStep === DeploymentStep.CREATING_UNIVERSE) {
    // Parse UniverseCreated event from receipt
    // The createUniverse function returns (universeId, universeAddress)
    // We need to extract these from the transaction logs
    console.log("Universe creation tx successful:", txReceipt);

    // TODO: Parse the UniverseCreated event to get universeId and universeAddress
    // For now, we'll need to manually track these or use a read contract call
    setDeploymentStep(DeploymentStep.UNIVERSE_CREATED);
  }

  if (txSuccess && deploymentStep === DeploymentStep.DEPLOYING_TOKEN) {
    console.log("Token deployment tx successful:", txReceipt);
    setDeploymentStep(DeploymentStep.TOKEN_DEPLOYED);
    // Parse TokenCreated event to get token, governor, pool addresses
    // The indexer will pick these up automatically
    setDeploymentStep(DeploymentStep.COMPLETED);
  }

  const handleCreateUniverse = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (chainId !== 11155111) {
      alert("Wrong Network! Please switch to Sepolia Testnet (Chain ID: 11155111)");
      return;
    }

    if (!universeName || !imageUrl || !description) {
      alert("Please fill in universe name, image URL, and description");
      return;
    }

    setDeploymentStep(DeploymentStep.CREATING_UNIVERSE);

    try {
      await createUniverse({
        name: universeName,
        imageURL: imageUrl,
        description: description,
        nodeCreationOptions: 0, // OPEN - anyone can create nodes
        nodeVisibilityOptions: 0, // PUBLIC - all nodes visible
        initialOwner: address,
      });
    } catch (error) {
      console.error("Universe creation failed:", error);
      alert(`Universe creation failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setDeploymentStep(DeploymentStep.IDLE);
    }
  };

  const handleDeployToken = async () => {
    if (!universeId || !address) {
      alert("Universe must be created first");
      return;
    }

    if (!tokenSymbol) {
      alert("Please enter a token symbol");
      return;
    }

    setDeploymentStep(DeploymentStep.DEPLOYING_TOKEN);

    try {
      // NOTE: This requires complex configuration.
      // For now, using placeholder values - you should customize these based on your needs
      await deployUniverseToken(
        {
          tokenConfig: {
            tokenAdmin: address,
            name: universeName,
            symbol: tokenSymbol,
            imageURL: imageUrl,
            metadata: metadata || `Token for ${universeName}`,
            context: context || description,
          },
          poolConfig: {
            hook: defaultConfig.defaultHook,
            pairedToken: defaultConfig.defaultPairedToken,
            tickIfToken0IsLoar: defaultConfig.defaultTickIfToken0IsLoar,
            tickSpacing: defaultConfig.defaultTickSpacing,
            poolData: "0x" as `0x${string}`, // Empty bytes for now
          },
          lockerConfig: {
            locker: defaultConfig.defaultLocker,
            rewardAdmins: [address], // Universe creator is reward admin
            rewardRecipients: [address], // Creator gets initial rewards
            rewardBps: [1000], // 10% (1000 basis points)
            tickLower: [-887220], // Full range example
            tickUpper: [887220],
            positionBps: [10000], // 100% (full position)
            lockerData: "0x" as `0x${string}`, // Empty bytes for now
          },
        },
        universeId,
        parseEther("0.01") // Sending 0.01 ETH for initial liquidity - adjust as needed
      );
    } catch (error) {
      console.error("Token deployment failed:", error);
      alert(`Token deployment failed: ${error instanceof Error ? error.message : "Unknown error"}`);
      setDeploymentStep(DeploymentStep.UNIVERSE_CREATED);
    }
  };

  // Not connected state
  if (!isConnected) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 p-8">
            <Sparkles className="h-16 w-16 mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold">Connect Your Wallet</h2>
            <p className="text-muted-foreground">Please connect your wallet to create a universe.</p>
            <WalletConnectButton size="lg" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Wrong network state
  if (chainId !== 11155111) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-4 bg-yellow-900/90 backdrop-blur-md border border-yellow-700 rounded-lg shadow-2xl">
          <p className="text-yellow-100 font-medium">
            ⚠️ Wrong Network! Please switch to Sepolia Testnet.
          </p>
        </div>
        <Card className="w-full max-w-md">
          <CardContent className="text-center space-y-4 p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-yellow-600" />
            <h2 className="text-2xl font-bold">Wrong Network</h2>
            <p className="text-muted-foreground">Please switch to Sepolia Testnet</p>
            <Button size="lg" onClick={handleSwitchNetwork}>
              <Rocket className="h-5 w-5 mr-2" />
              Switch to Sepolia
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Success state
  if (deploymentStep === DeploymentStep.COMPLETED) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center space-y-6 p-10">
            <CheckCircle2 className="h-20 w-20 mx-auto text-green-500" />
            <h2 className="text-3xl font-bold">Universe Launched! 🚀</h2>
            <p className="text-muted-foreground text-lg">
              Your universe is now deployed on Sepolia with governance token and liquidity pool
            </p>

            <div className="space-y-3">
              {universeAddress && (
                <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Universe Contract</p>
                    <code className="text-sm font-mono">
                      {universeAddress.slice(0, 16)}...{universeAddress.slice(-14)}
                    </code>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${universeAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center gap-1"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
              {tokenAddress && (
                <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">
                      Governance Token
                    </p>
                    <code className="text-sm font-mono">
                      {tokenAddress.slice(0, 16)}...{tokenAddress.slice(-14)}
                    </code>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${tokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center gap-1"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <Button size="lg" onClick={() => (window.location.href = "/universes")}>
              <ArrowLeft className="h-5 w-5 mr-2" />
              View All Universes
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Main form
  return (
    <div className="h-full bg-background overflow-hidden">
      <div className="h-full max-w-6xl mx-auto p-8 flex flex-col">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Launch Your Universe</h1>
          <p className="text-muted-foreground text-lg">
            Deploy a new cinematic universe with governance token and liquidity pool
          </p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Form Panel */}
          <Card className="flex flex-col overflow-hidden">
            <CardContent className="p-6 flex-1 overflow-y-auto space-y-4">
              {/* Step 1: Universe Creation */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold">Step 1: Create Universe</h3>
                  {deploymentStep !== DeploymentStep.IDLE && deploymentStep !== DeploymentStep.CREATING_UNIVERSE && (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  )}
                </div>

                <div>
                  <Label htmlFor="universeName" className="text-sm font-semibold mb-2 block">
                    Universe Name
                  </Label>
                  <Input
                    id="universeName"
                    placeholder="e.g., Marvel Cinematic Universe"
                    value={universeName}
                    onChange={(e) => setUniverseName(e.target.value)}
                    disabled={deploymentStep !== DeploymentStep.IDLE}
                    className="h-11"
                  />
                </div>

                <div>
                  <Label htmlFor="imageUrl" className="text-sm font-semibold mb-2 block">
                    Cover Image
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="imageUrl"
                      placeholder="Enter image URL or generate one"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      disabled={deploymentStep !== DeploymentStep.IDLE}
                      className="h-11 flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleGenerateCover}
                      disabled={
                        isGeneratingCover || deploymentStep !== DeploymentStep.IDLE || !universeName
                      }
                      variant="outline"
                      className="h-11"
                    >
                      {isGeneratingCover ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generate
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your universe and its narrative..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    disabled={deploymentStep !== DeploymentStep.IDLE}
                    className="min-h-[100px] resize-none"
                    maxLength={500}
                  />
                </div>

                {deploymentStep === DeploymentStep.IDLE && (
                  <Button
                    onClick={handleCreateUniverse}
                    disabled={!universeName || !imageUrl || !description || isPending || isConfirming}
                    className="w-full h-12 text-base font-bold"
                    size="lg"
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Creating Universe...
                      </>
                    ) : (
                      <>
                        <Rocket className="h-5 w-5 mr-2" />
                        Create Universe
                      </>
                    )}
                  </Button>
                )}
              </div>

              {/* Step 2: Token Deployment */}
              {deploymentStep !== DeploymentStep.IDLE && (
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">Step 2: Deploy Token & Pool</h3>
                    {deploymentStep === DeploymentStep.COMPLETED && (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    )}
                  </div>

                  <div>
                    <Label htmlFor="tokenSymbol" className="text-sm font-semibold mb-2 block">
                      Token Symbol
                    </Label>
                    <Input
                      id="tokenSymbol"
                      placeholder="e.g., MCU"
                      value={tokenSymbol}
                      onChange={(e) => setTokenSymbol(e.target.value.toUpperCase())}
                      disabled={
                        deploymentStep !== DeploymentStep.UNIVERSE_CREATED &&
                        deploymentStep !== DeploymentStep.DEPLOYING_TOKEN
                      }
                      maxLength={10}
                      className="h-11"
                    />
                  </div>

                  {deploymentStep === DeploymentStep.UNIVERSE_CREATED && (
                    <Button
                      onClick={handleDeployToken}
                      disabled={!tokenSymbol || isPending || isConfirming}
                      className="w-full h-12 text-base font-bold"
                      size="lg"
                    >
                      {isPending || isConfirming ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Deploying Token...
                        </>
                      ) : (
                        <>
                          <Rocket className="h-5 w-5 mr-2" />
                          Deploy Token & Pool
                        </>
                      )}
                    </Button>
                  )}

                  {deploymentStep === DeploymentStep.DEPLOYING_TOKEN && (
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 text-primary animate-spin" />
                        <div>
                          <p className="text-sm font-semibold">Deploying token and setting up liquidity pool...</p>
                          <p className="text-xs text-muted-foreground mt-1">This may take a few moments...</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
                  <p className="text-sm text-red-500">
                    Error: {error.message}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Preview Panel */}
          <Card className="flex flex-col overflow-hidden">
            <CardContent className="p-0 flex-1 flex flex-col overflow-hidden">
              {/* Preview Image */}
              <div className="relative aspect-video bg-muted overflow-hidden flex-shrink-0">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <ImageIcon className="h-16 w-16 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-2xl mb-2">
                    {universeName || "Your Universe Name"}
                  </h3>
                  {tokenSymbol && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">${tokenSymbol}</Badge>
                  )}
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase">About</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {description ||
                      "Your universe description will appear here. Share the vision and story of your cinematic world..."}
                  </p>
                </div>

                {deploymentStep !== DeploymentStep.IDLE && (
                  <div className="pt-4 border-t space-y-3">
                    <p className="text-xs font-bold text-muted-foreground uppercase">Deployment Progress</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        {deploymentStep !== DeploymentStep.IDLE &&
                        deploymentStep !== DeploymentStep.CREATING_UNIVERSE ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        )}
                        <span
                          className={
                            deploymentStep !== DeploymentStep.IDLE &&
                            deploymentStep !== DeploymentStep.CREATING_UNIVERSE
                              ? "text-green-500 font-medium"
                              : ""
                          }
                        >
                          Universe Contract
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {deploymentStep === DeploymentStep.COMPLETED ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        ) : deploymentStep === DeploymentStep.DEPLOYING_TOKEN ||
                          deploymentStep === DeploymentStep.TOKEN_DEPLOYED ? (
                          <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        ) : (
                          <Loader2 className="h-4 w-4 opacity-40" />
                        )}
                        <span
                          className={
                            deploymentStep === DeploymentStep.COMPLETED
                              ? "text-green-500 font-medium"
                              : deploymentStep === DeploymentStep.DEPLOYING_TOKEN ||
                                deploymentStep === DeploymentStep.TOKEN_DEPLOYED
                              ? ""
                              : "opacity-40"
                          }
                        >
                          Token & Liquidity Pool
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
