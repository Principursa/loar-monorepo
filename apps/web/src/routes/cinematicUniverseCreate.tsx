import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useAccount, useDeployContract, useWaitForTransactionReceipt, useBalance, useChainId, useSignMessage, useSwitchChain } from "wagmi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { governanceErc20Abi, timelineAbi, universeGovernorAbi } from "@/generated";
import { Rocket, CheckCircle2, Loader2, ExternalLink, AlertCircle, Sparkles, Image as ImageIcon, ArrowLeft } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import governanceERC20Artifact from "../abis/GovernanceERC20.json"
import universeGovernorArtifact from "../abis/UniverseGovernor.json"
import timelineArtifact from "../abis/Timeline.json"
const governanceERC20Bytecode = governanceERC20Artifact.bytecode.object
const universeGovernanceBytecode = universeGovernorArtifact.bytecode.object
const timelineBytecode = timelineArtifact.bytecode.object

// Log contract sizes
console.log("Contract bytecode sizes:");
console.log("GovernanceERC20:", Math.floor(governanceERC20Bytecode.length / 2), "bytes");
console.log("UniverseGovernor:", Math.floor(universeGovernanceBytecode.length / 2), "bytes");
console.log("Timeline:", Math.floor(timelineBytecode.length / 2), "bytes");
console.log("Size limit: 24576 bytes");

export const Route = createFileRoute("/cinematicUniverseCreate")({
  component: CinematicUniverseCreate,
});

function CinematicUniverseCreate() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: balance } = useBalance({ address });
  const { signMessage } = useSignMessage();
  const { switchChain } = useSwitchChain();
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState<string>("");
  const [universeSaved, setUniverseSaved] = useState(false);
  const [isGeneratingCover, setIsGeneratingCover] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

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
      const prompt = `Epic cinematic universe cover art for "${tokenName}". ${description}. Professional movie poster style, high quality, dramatic lighting`;

      const result = await trpcClient.fal.generateImage.mutate({
        prompt,
        model: "fal-ai/nano-banana",
        imageSize: "landscape_16_9"
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
    }
  });

  const handleGenerateCover = async () => {
    if (!tokenName) {
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

  const handleUseCover = () => {
    if (coverPreview) {
      setImageUrl(coverPreview);
    }
  };

  // Database mutation for universe storage
  const createCinematicUniverse = useMutation({
    mutationFn: async (variables: {
      address: string;
      creator: string;
      tokenAddress: string;
      governanceAddress: string;
      imageUrl: string;
      description: string;
    }) => {
      console.log("Saving universe to database:", variables);

      // Create message for wallet signature
      const message = `Create Cinematic Universe\nCreator: ${variables.creator}\nTimeline: ${variables.address}\nTimestamp: ${Date.now()}`;

      // Sign the message with wallet
      const signature = await new Promise<string>((resolve, reject) => {
        signMessage(
          { message },
          {
            onSuccess: (sig) => resolve(sig),
            onError: (error) => reject(error)
          }
        );
      });

      console.log("Signed message for database:", { message, signature });

      // Call tRPC with signature
      return trpcClient.cinematicUniverses.createcu.mutate({
        ...variables,
        signature,
        message
      });
    },
    onSuccess: (data) => {
      console.log("Universe saved to database successfully:", data);
    },
    onError: (error) => {
      console.error("Database save failed (continuing with localStorage only):", error);
    },
  });

  const { deployContract: deployToken, data: tokenTxHash } = useDeployContract();
  const { deployContract: deployGovernor, data: governorTxHash } = useDeployContract();
  const { deployContract: deployTimeline, data: timelineTxHash } = useDeployContract();

  const { isSuccess: tokenDeployed, data: tokenReceipt } = useWaitForTransactionReceipt({
    hash: tokenTxHash,
  });

  const { isSuccess: governorDeployed, data: governorReceipt } = useWaitForTransactionReceipt({
    hash: governorTxHash,
  });

  const { isSuccess: timelineDeployed, data: timelineReceipt } = useWaitForTransactionReceipt({
    hash: timelineTxHash,
  });

  // TanStack Query for contract addresses
  const { data: tokenAddress } = useQuery({
    queryKey: ['token-address', tokenTxHash],
    queryFn: () => tokenReceipt?.contractAddress,
    enabled: tokenDeployed && !!tokenReceipt?.contractAddress
  });

  const { data: governorAddress } = useQuery({
    queryKey: ['governor-address', governorTxHash],
    queryFn: () => governorReceipt?.contractAddress,
    enabled: governorDeployed && !!governorReceipt?.contractAddress
  });

  const { data: timelineAddress } = useQuery({
    queryKey: ['timeline-address', timelineTxHash],
    queryFn: () => timelineReceipt?.contractAddress,
    enabled: timelineDeployed && !!timelineReceipt?.contractAddress
  });

  // Auto-deploy governor when token is ready
  useQuery({
    queryKey: ['deploy-governor', tokenAddress],
    queryFn: async () => {
      setDeploymentStep("Token deployed! Deploying UniverseGovernor...");
      deployGovernor({
        abi: universeGovernorAbi,
        args: [tokenAddress!],
        bytecode: universeGovernanceBytecode as `0x${string}`,
        gas: 8000000n,
        chainId: 11155111,
      });
      return 'triggered';
    },
    enabled: !!tokenAddress && !governorTxHash,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  // Auto-deploy timeline when governor is ready
  useQuery({
    queryKey: ['deploy-timeline', governorAddress],
    queryFn: async () => {
      setDeploymentStep("Governor deployed! Deploying Timeline...");
      deployTimeline({
        abi: timelineAbi,
        args: [governorAddress!],
        bytecode: timelineBytecode as `0x${string}`,
        gas: 3500000n,
        chainId: 11155111,
      });
      return 'triggered';
    },
    enabled: !!governorAddress && !timelineTxHash,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });


  // Auto-create universe record when all addresses are ready
  useQuery({
    queryKey: ['create-universe-record', timelineAddress, tokenAddress, governorAddress],
    queryFn: async () => {
      setDeploymentStep("Timeline deployed! Saving cinematic universe...");

      const universeData = {
        id: timelineAddress!,
        name: tokenName,
        description: description,
        address: timelineAddress!,
        tokenAddress: tokenAddress!,
        governanceAddress: governorAddress!,
        creator: address!,
        createdAt: new Date().toISOString(),
        imageUrl: imageUrl
      };

      const existing = localStorage.getItem('createdUniverses');
      const universes = existing ? JSON.parse(existing) : [];
      const existingIndex = universes.findIndex((u: any) => u.id === timelineAddress);
      if (existingIndex === -1) {
        universes.push(universeData);
        localStorage.setItem('createdUniverses', JSON.stringify(universes));
      }

      console.log("Universe saved to localStorage:", universeData);

      try {
        await createCinematicUniverse.mutateAsync({
          address: timelineAddress!,
          creator: address!,
          tokenAddress: tokenAddress!,
          governanceAddress: governorAddress!,
          imageUrl,
          description,
        });
        console.log("Universe saved to database successfully");
      } catch (error) {
        console.log("Database save failed, but localStorage backup is available:", error);
      }

      setDeploymentStep("Cinematic Universe created successfully!");
      setIsDeploying(false);
      setUniverseSaved(true);
      return 'triggered';
    },
    enabled: !!timelineAddress && !!tokenAddress && !!governorAddress && !universeSaved,
    refetchOnMount: false,
    refetchOnWindowFocus: false
  });

  const handleDeploy = async () => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first");
      return;
    }

    if (chainId !== 11155111) {
      alert(`Wrong Network! Please switch to Sepolia Testnet (Chain ID: 11155111)`);
      return;
    }

    if (!tokenName || !tokenSymbol || !imageUrl || !description) {
      alert("Please fill in all fields");
      return;
    }

    setIsDeploying(true);
    setDeploymentStep("Deploying GovernanceERC20 token...");

    try {
      deployToken({
        abi: governanceErc20Abi,
        bytecode: governanceERC20Bytecode as `0x${string}`,
        args: [tokenName, tokenSymbol],
        gas: 3000000n,
        chainId: 11155111,
      });
    } catch (error) {
      console.error("Token deployment failed:", error);
      setDeploymentStep(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsDeploying(false);
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
  if (universeSaved) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <Card className="w-full max-w-2xl">
          <CardContent className="text-center space-y-6 p-10">
            <CheckCircle2 className="h-20 w-20 mx-auto text-green-500" />
            <h2 className="text-3xl font-bold">Universe Created!</h2>
            <p className="text-muted-foreground text-lg">Your universe is now deployed on Sepolia</p>

            <div className="space-y-3">
              {timelineAddress && (
                <div className="p-4 bg-muted rounded-lg flex items-center justify-between">
                  <div className="text-left">
                    <p className="text-xs text-muted-foreground mb-1 uppercase font-semibold">Timeline Contract</p>
                    <code className="text-sm font-mono">{timelineAddress.slice(0, 16)}...{timelineAddress.slice(-14)}</code>
                  </div>
                  <a
                    href={`https://sepolia.etherscan.io/address/${timelineAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm flex items-center gap-1"
                  >
                    View <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>

            <Button size="lg" onClick={() => window.location.href = '/universes'}>
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
          <h1 className="text-4xl font-bold mb-2">Create New Universe</h1>
          <p className="text-muted-foreground text-lg">Deploy a new cinematic universe on Sepolia testnet</p>
        </div>

        {/* Main Content */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
          {/* Form Panel */}
          <Card className="flex flex-col overflow-hidden">
            <CardContent className="p-6 flex-1 overflow-y-auto space-y-4">
              <div>
                <Label htmlFor="tokenName" className="text-sm font-semibold mb-2 block">
                  Universe Name
                </Label>
                <Input
                  id="tokenName"
                  placeholder="e.g., Marvel Cinematic Universe"
                  value={tokenName}
                  onChange={(e) => setTokenName(e.target.value)}
                  disabled={isDeploying}
                  className="h-11"
                />
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
                  disabled={isDeploying}
                  maxLength={10}
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
                    disabled={isDeploying}
                    className="h-11 flex-1"
                  />
                  <Button
                    type="button"
                    onClick={handleGenerateCover}
                    disabled={isGeneratingCover || isDeploying || !tokenName}
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
                {coverPreview && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Cover generated! Preview shown on the right.
                  </p>
                )}
              </div>

              <div className="flex-1 flex flex-col">
                <Label htmlFor="description" className="text-sm font-semibold mb-2 block">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your universe and its narrative..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isDeploying}
                  className="flex-1 min-h-[100px] resize-none"
                  maxLength={500}
                />
                <p className="text-xs text-muted-foreground text-right mt-1">{description.length}/500</p>
              </div>

              <Button
                onClick={handleDeploy}
                disabled={isDeploying || !tokenName || !tokenSymbol || !imageUrl || !description}
                className="w-full h-12 text-base font-bold"
                size="lg"
              >
                {isDeploying ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Deploying Contracts...
                  </>
                ) : (
                  <>
                    <Rocket className="h-5 w-5 mr-2" />
                    Deploy Universe
                  </>
                )}
              </Button>

              {deploymentStep && (
                <div className="p-4 bg-muted rounded-lg space-y-3">
                  <div className="flex items-start gap-3">
                    <Loader2 className="h-5 w-5 text-primary animate-spin flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">{deploymentStep}</p>
                      <p className="text-xs text-muted-foreground mt-1">This may take a few moments...</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      {tokenAddress ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className="h-4 w-4 animate-spin text-primary flex-shrink-0" />
                      )}
                      <span className={tokenAddress ? "text-green-500 font-medium" : ""}>
                        Token Contract
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {governorAddress ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className={`h-4 w-4 flex-shrink-0 ${tokenAddress ? 'animate-spin text-primary' : 'opacity-40'}`} />
                      )}
                      <span className={governorAddress ? "text-green-500 font-medium" : tokenAddress ? "" : "opacity-40"}>
                        Governor Contract
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      {timelineAddress ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <Loader2 className={`h-4 w-4 flex-shrink-0 ${governorAddress ? 'animate-spin text-primary' : 'opacity-40'}`} />
                      )}
                      <span className={timelineAddress ? "text-green-500 font-medium" : governorAddress ? "" : "opacity-40"}>
                        Timeline Contract
                      </span>
                    </div>
                  </div>
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
                    onError={(e) => { e.currentTarget.style.display = 'none'; }}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
                    <ImageIcon className="h-16 w-16 text-white/40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="text-2xl font-bold text-white drop-shadow-2xl mb-2">
                    {tokenName || "Your Universe Name"}
                  </h3>
                  {tokenSymbol && (
                    <Badge className="bg-white/20 backdrop-blur-sm text-white border-0">
                      ${tokenSymbol}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Preview Content */}
              <div className="p-6 space-y-4 flex-1 overflow-y-auto">
                <div>
                  <p className="text-xs font-bold text-muted-foreground mb-2 uppercase">About</p>
                  <p className="text-sm text-foreground leading-relaxed">
                    {description || "Your universe description will appear here. Share the vision and story of your cinematic world..."}
                  </p>
                </div>

                {(tokenAddress || governorAddress || timelineAddress) && (
                  <div className="pt-4 border-t space-y-2">
                    <p className="text-xs font-bold text-muted-foreground uppercase mb-3">Smart Contracts</p>
                    {tokenAddress && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Token</p>
                        <code className="font-mono text-xs">{tokenAddress.slice(0, 16)}...{tokenAddress.slice(-14)}</code>
                      </div>
                    )}
                    {governorAddress && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Governor</p>
                        <code className="font-mono text-xs">{governorAddress.slice(0, 16)}...{governorAddress.slice(-14)}</code>
                      </div>
                    )}
                    {timelineAddress && (
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-1 uppercase font-semibold">Timeline</p>
                        <code className="font-mono text-xs">{timelineAddress.slice(0, 16)}...{timelineAddress.slice(-14)}</code>
                      </div>
                    )}
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
