import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
// import { useAccount, useDeployContract, useWaitForTransactionReceipt, useBalance, useChainId, useSignMessage } from "wagmi";
// import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { trpcClient } from "@/utils/trpc";
import { governanceErc20Abi, timelineAbi, universeGovernorAbi } from "@/generated";
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
  // const { address, isConnected } = useAccount();
  // const chainId = useChainId();
  const address = null;
  const isConnected = false;
  const chainId = 11155111; // Sepolia testnet
  // const { data: balance } = useBalance({ address });
  // const { signMessage } = useSignMessage();
  const balance = null;
  const signMessage = () => {};
  const [tokenName, setTokenName] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [description, setDescription] = useState("");
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentStep, setDeploymentStep] = useState<string>("");
  const [universeSaved, setUniverseSaved] = useState(false);

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

  // const { deployContract: deployToken, data: tokenTxHash } = useDeployContract();
  // const { deployContract: deployGovernor, data: governorTxHash } = useDeployContract();
  // const { deployContract: deployTimeline, data: timelineTxHash } = useDeployContract();
  const deployToken = () => {};
  const deployGovernor = () => {};
  const deployTimeline = () => {};
  const tokenTxHash = null;
  const governorTxHash = null;
  const timelineTxHash = null;

  // const { isSuccess: tokenDeployed, data: tokenReceipt } = useWaitForTransactionReceipt({
  //   hash: tokenTxHash,
  // });

  // const { isSuccess: governorDeployed, data: governorReceipt } = useWaitForTransactionReceipt({
  //   hash: governorTxHash,
  // });

  // const { isSuccess: timelineDeployed, data: timelineReceipt } = useWaitForTransactionReceipt({
  //   hash: timelineTxHash,
  // });
  const tokenDeployed = false;
  const tokenReceipt = null;
  const governorDeployed = false;
  const governorReceipt = null;
  const timelineDeployed = false;
  const timelineReceipt = null;

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
        gas: 8000000n, // Increased gas limit for large contract
        chainId: 11155111, // Force Sepolia
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
        gas: 3500000n, // Increased gas limit
        chainId: 11155111, // Force Sepolia
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
      
      // Save to localStorage for universes page (backup/cache)
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

      // Save to localStorage (backup)
      const existing = localStorage.getItem('createdUniverses');
      const universes = existing ? JSON.parse(existing) : [];
      const existingIndex = universes.findIndex((u: any) => u.id === timelineAddress);
      if (existingIndex === -1) {
        universes.push(universeData);
        localStorage.setItem('createdUniverses', JSON.stringify(universes));
      }

      console.log("Universe saved to localStorage:", universeData);

      // Save to database (primary storage)
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

      setDeploymentStep("Cinematic Universe created successfully! Check the Universes page.");
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

    // Check if we're on Sepolia testnet
    if (chainId !== 11155111) {
      alert(`⚠️ Wrong Network!\n\nYou're on Chain ID: ${chainId}\nPlease switch to Sepolia Testnet (Chain ID: 11155111)\n\nHow to switch:\n1. Open your wallet\n2. Click on network selector\n3. Choose "Sepolia Testnet"\n\nIf Sepolia isn't visible, refresh the page after connecting.`);
      return;
    }

    if (!tokenName || !tokenSymbol || !imageUrl || !description) {
      alert("Please fill in all fields");
      return;
    }

    setIsDeploying(true);
    setDeploymentStep("Deploying GovernanceERC20 token...");

    try {
      console.log("Deploying token with:", { tokenName, tokenSymbol, address, chainId });
      console.log("Balance:", balance?.value, balance?.symbol);
      console.log("Bytecode length:", governanceERC20Bytecode.length);

      // Step 1: Deploy GovernanceERC20 token
      deployToken({
        abi: governanceErc20Abi,
        bytecode: governanceERC20Bytecode as `0x${string}`,
        args: [tokenName, tokenSymbol],
        gas: 3000000n, // Increased gas limit
        chainId: 11155111, // Force Sepolia
      });
    } catch (error) {
      console.error("Token deployment failed:", error);
      setDeploymentStep(`Token deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setIsDeploying(false);
    }
  };


  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Create Cinematic Universe</CardTitle>
          {/* Network indicator */}
          {isConnected && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">Network:</span>
              {chainId === 11155111 ? (
                <span className="text-green-600 font-medium">✅ Sepolia Testnet</span>
              ) : (
                <span className="text-red-600 font-medium">❌ Wrong Network (Chain ID: {chainId})</span>
              )}
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">Connect your wallet to create a cinematic universe</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tokenName">Token Name</Label>
                  <Input
                    id="tokenName"
                    placeholder="e.g., Marvel Universe Token"
                    value={tokenName}
                    onChange={(e) => setTokenName(e.target.value)}
                    disabled={isDeploying}
                  />
                </div>
                <div>
                  <Label htmlFor="tokenSymbol">Token Symbol</Label>
                  <Input
                    id="tokenSymbol"
                    placeholder="e.g., MARVEL"
                    value={tokenSymbol}
                    onChange={(e) => setTokenSymbol(e.target.value)}
                    disabled={isDeploying}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  placeholder="https://example.com/universe-image.jpg"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  disabled={isDeploying}
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  placeholder="Describe your cinematic universe..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={isDeploying}
                />
              </div>

              <Button
                onClick={handleDeploy}
                disabled={isDeploying || !tokenName || !tokenSymbol || !imageUrl || !description}
                className="w-full"
              >
                {isDeploying ? "Deploying..." : "Deploy Cinematic Universe"}
              </Button>

              {deploymentStep && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <p className="text-sm">{deploymentStep}</p>
                </div>
              )}

              {(tokenAddress || governorAddress || timelineAddress) && (
                <div className="mt-4 space-y-2">
                  <h3 className="font-semibold">Deployed Contracts:</h3>
                  {tokenAddress && (
                    <p className="text-sm">Token: {tokenAddress}</p>
                  )}
                  {governorAddress && (
                    <p className="text-sm">Governor: {governorAddress}</p>
                  )}
                  {timelineAddress && (
                    <p className="text-sm">Timeline: {timelineAddress}</p>
                  )}
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
