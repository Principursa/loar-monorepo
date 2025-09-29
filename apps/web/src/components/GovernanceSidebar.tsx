import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Plus, 
  Vote, 
  Users, 
  Clock,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
  Crown,
  X
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, usePublicClient } from "wagmi";
import { universeGovernorAbi, governanceErc20Abi, timelineAbi } from "@/generated";
import { type Address } from "viem";
import { encodeFunctionData, keccak256, encodeAbiParameters } from "viem";
import type { Node } from 'reactflow';
import type { TimelineNodeData } from '@/components/flow/TimelineNodes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// Using input instead of textarea for now

interface GovernanceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  finalUniverse: any;
  nodes: Node<TimelineNodeData>[];
  onRefresh?: () => void;
}

interface Proposal {
  id: string;
  description: string;
  proposalId: bigint;
  targets: string[];
  values: bigint[];
  calldatas: string[];
  state: number;
  forVotes: bigint;
  againstVotes: bigint;
  abstainVotes: bigint;
  startBlock: bigint;
  endBlock: bigint;
  nodeId?: string;
}

export function GovernanceSidebar({
  isOpen,
  onClose,
  finalUniverse,
  nodes,
  onRefresh,
}: GovernanceSidebarProps) {
  const { address, isConnected } = useAccount();
  const [selectedNodeId, setSelectedNodeId] = useState<string>("");
  const [proposalDescription, setProposalDescription] = useState("");
  const [isCreatingProposal, setIsCreatingProposal] = useState(false);
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoadingProposals, setIsLoadingProposals] = useState(false);

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  // Get governance addresses from universe data
  const governanceAddress = finalUniverse?.governanceAddress as Address;
  const tokenAddress = finalUniverse?.tokenAddress as Address;
  const timelineAddress = finalUniverse?.address as Address;

  console.log('Governance addresses:', {
    governanceAddress,
    tokenAddress, 
    timelineAddress,
    universe: finalUniverse
  });

  // Check if governance is properly configured
  const isGovernanceConfigured = governanceAddress && tokenAddress && timelineAddress;

  // Check token balance
  const { data: tokenBalance } = useReadContract({
    abi: governanceErc20Abi,
    address: tokenAddress,
    functionName: 'balanceOf',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress
    }
  });

  // Check actual voting power (delegated tokens)
  const { data: votingPower } = useReadContract({
    abi: governanceErc20Abi,
    address: tokenAddress,
    functionName: 'getVotes',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress
    }
  });

  // Check current delegate
  const { data: currentDelegate } = useReadContract({
    abi: governanceErc20Abi,
    address: tokenAddress,
    functionName: 'delegates',
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && !!tokenAddress
    }
  });

  // Get voting delay and period from governor
  const { data: votingDelay } = useReadContract({
    abi: universeGovernorAbi,
    address: governanceAddress,
    functionName: 'votingDelay',
    query: {
      enabled: !!governanceAddress
    }
  });

  const { data: votingPeriod } = useReadContract({
    abi: universeGovernorAbi,
    address: governanceAddress,
    functionName: 'votingPeriod',
    query: {
      enabled: !!governanceAddress
    }
  });

  const { data: proposalThreshold } = useReadContract({
    abi: universeGovernorAbi,
    address: governanceAddress,
    functionName: 'proposalThreshold',
    query: {
      enabled: !!governanceAddress
    }
  });

  // Get only scene nodes for proposal creation
  const sceneNodes = nodes.filter(node => node.data.nodeType === 'scene');

  // Check if user needs to delegate tokens to themselves
  const needsDelegation = address && currentDelegate !== address && tokenBalance && tokenBalance > 0n;

  // Handle token delegation to self
  const handleSelfDelegate = useCallback(async () => {
    if (!address || !tokenAddress) {
      alert('Please connect your wallet');
      return;
    }

    try {
      const txHash = await writeContractAsync({
        abi: governanceErc20Abi,
        address: tokenAddress,
        functionName: 'delegate',
        args: [address] // Delegate to self
      });

      console.log('Delegation transaction:', txHash);
      alert(`Successfully delegated tokens! Transaction: ${txHash}`);
    } catch (error) {
      console.error('Error delegating tokens:', error);
      alert('Failed to delegate tokens: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [address, tokenAddress, writeContractAsync]);

  // Fetch proposals from ProposalCreated events
  const fetchProposalsFromEvents = useCallback(async () => {
    if (!publicClient || !governanceAddress) return;

    setIsLoadingProposals(true);
    try {
      console.log('Fetching ProposalCreated events for governor:', governanceAddress);

      // Get current block number
      const currentBlock = await publicClient.getBlockNumber();
      const fromBlock = currentBlock - 10000n; // Look back ~10k blocks (adjust as needed)

      // Fetch ProposalCreated events
      const events = await publicClient.getContractEvents({
        address: governanceAddress,
        abi: universeGovernorAbi,
        eventName: 'ProposalCreated',
        fromBlock: fromBlock,
        toBlock: 'latest'
      });

      console.log('Found ProposalCreated events:', events);

      // Convert events to proposal objects
      const proposals: Proposal[] = await Promise.all(
        events.map(async (event) => {
          const args = event.args as {
            proposalId: bigint;
            proposer: Address;
            targets: Address[];
            values: bigint[];
            signatures: string[];
            calldatas: string[];
            startBlock: bigint;
            endBlock: bigint;
            description: string;
          };

          // Try to get current proposal state and vote counts
          let state = 1; // Default to Active
          let forVotes = 0n;
          let againstVotes = 0n;
          let abstainVotes = 0n;

          try {
            // Get proposal state
            const proposalState = await publicClient.readContract({
              address: governanceAddress,
              abi: universeGovernorAbi,
              functionName: 'state',
              args: [args.proposalId]
            }) as number;
            state = proposalState;

            // Get vote counts
            const votes = await publicClient.readContract({
              address: governanceAddress,
              abi: universeGovernorAbi,
              functionName: 'proposalVotes',
              args: [args.proposalId]
            }) as [bigint, bigint, bigint];

            againstVotes = votes[0];
            forVotes = votes[1];
            abstainVotes = votes[2];
          } catch (error) {
            console.log('Could not fetch proposal state/votes:', error);
          }

          // Parse description to extract node info
          const nodeMatch = args.description.match(/Set Event (.+?) as Canon/);
          const nodeId = nodeMatch ? nodeMatch[1] : 'Unknown';

          return {
            id: args.proposalId.toString(),
            description: args.description.split('\n\n')[0], // Just the first line
            proposalId: args.proposalId,
            targets: args.targets,
            values: args.values,
            calldatas: args.calldatas,
            state,
            forVotes,
            againstVotes,
            abstainVotes,
            startBlock: args.startBlock,
            endBlock: args.endBlock,
            nodeId
          };
        })
      );

      console.log('Processed proposals:', proposals);
      setProposals(proposals.reverse()); // Show newest first
    } catch (error) {
      console.error('Error fetching proposals from events:', error);
    } finally {
      setIsLoadingProposals(false);
    }
  }, [publicClient, governanceAddress]);

  // Fetch proposals when governance is configured
  useEffect(() => {
    if (isGovernanceConfigured) {
      fetchProposalsFromEvents();
    }
  }, [isGovernanceConfigured, fetchProposalsFromEvents]);

  // Handle proposal creation
  const handleCreateProposal = useCallback(async () => {
    if (!isConnected || !address || !selectedNodeId || !proposalDescription) {
      alert('Please connect wallet, select a node, and provide a description');
      return;
    }

    if (!votingPower || votingPower === 0n) {
      alert('You need governance tokens to create proposals');
      return;
    }

    if (proposalThreshold && votingPower < proposalThreshold) {
      alert(`You need at least ${proposalThreshold.toString()} tokens to create a proposal`);
      return;
    }

    setIsCreatingProposal(true);
    try {
      // Find the selected node to get its numeric ID
      const selectedNode = sceneNodes.find(node => 
        node.data.eventId === selectedNodeId || node.id === selectedNodeId
      );
      
      if (!selectedNode) {
        throw new Error('Selected node not found');
      }

      // Extract numeric node ID (blockchain node IDs are numeric)
      const nodeIdMatch = selectedNode.id.match(/blockchain-node-(\d+)/);
      const numericNodeId = nodeIdMatch ? parseInt(nodeIdMatch[1]) : parseInt(selectedNode.data.eventId || '0');

      console.log('Creating proposal for node:', {
        selectedNodeId,
        selectedNode: selectedNode.id,
        eventId: selectedNode.data.eventId,
        numericNodeId
      });

      // Encode the setCanon function call properly
      const setCanonCalldata = encodeFunctionData({
        abi: timelineAbi,
        functionName: 'setCanon',
        args: [BigInt(numericNodeId)]
      });

      const description = `Set Event ${selectedNode.data.displayName || numericNodeId} as Canon\n\n${proposalDescription}`;

      console.log('Creating proposal:', {
        targets: [timelineAddress],
        values: [0n],
        calldatas: [setCanonCalldata],
        description,
        numericNodeId
      });

      // Create proposal
      const txHash = await writeContractAsync({
        abi: universeGovernorAbi,
        address: governanceAddress,
        functionName: 'propose',
        args: [
          [timelineAddress], // targets
          [0n], // values (no ETH sent)
          [setCanonCalldata], // calldatas
          description
        ]
      });

      console.log('Proposal created:', txHash);
      alert(`Proposal created successfully! Transaction: ${txHash}\n\nThe proposal will appear once the transaction is confirmed.`);
      
      // Reset form
      setSelectedNodeId("");
      setProposalDescription("");
      
      // Refresh proposals after a delay to allow for blockchain confirmation
      setTimeout(() => {
        fetchProposalsFromEvents();
      }, 5000);
      
    } catch (error) {
      console.error('Error creating proposal:', error);
      alert('Failed to create proposal: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsCreatingProposal(false);
    }
  }, [isConnected, address, selectedNodeId, proposalDescription, votingPower, proposalThreshold, sceneNodes, writeContractAsync, governanceAddress, timelineAddress]);

  // Handle voting on proposal
  const handleVote = useCallback(async (proposalId: bigint, support: number) => {
    if (!isConnected || !address) {
      alert('Please connect your wallet');
      return;
    }

    if (!votingPower || votingPower === 0n) {
      alert('You need governance tokens to vote');
      return;
    }

    try {
      const txHash = await writeContractAsync({
        abi: universeGovernorAbi,
        address: governanceAddress,
        functionName: 'castVote',
        args: [proposalId, support] // 0 = Against, 1 = For, 2 = Abstain
      });

      console.log('Vote cast:', { txHash, proposalId: proposalId.toString(), support, votingPower: votingPower.toString() });
      
      alert(`Vote cast successfully! Transaction: ${txHash}\nYour ${votingPower.toString()} votes have been recorded.\n\nVote counts will update once the transaction is confirmed.`);
      
      // Refresh proposals after a delay to get updated vote counts
      setTimeout(() => {
        fetchProposalsFromEvents();
      }, 5000);
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to cast vote: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  }, [isConnected, address, votingPower, writeContractAsync, governanceAddress, fetchProposalsFromEvents]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/30"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="relative w-96 bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-700 ml-auto flex flex-col z-[61]">
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-violet-100 dark:bg-violet-900/30">
                  <Vote className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
                    Governance
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Manage canon decisions
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Connection & Balance Status */}
            <Card className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-950/20 dark:to-violet-900/20 border-violet-200 dark:border-violet-800">
              <CardContent className="p-4">
                <div className="space-y-3">
                  {!isGovernanceConfigured ? (
                    <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-red-700 dark:text-red-300">
                        Governance not configured for this universe. Token and Governor addresses are missing.
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                            Token Balance
                          </span>
                          <Badge variant={tokenBalance && tokenBalance > 0n ? "default" : "destructive"} className="text-xs">
                            {isConnected ? (
                              tokenBalance ? `${tokenBalance.toString()} tokens` : '0 tokens'
                            ) : 'Not Connected'}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-violet-700 dark:text-violet-300">
                            Voting Power
                          </span>
                          <Badge variant={votingPower && votingPower > 0n ? "default" : "destructive"} className="text-xs">
                            {isConnected ? (
                              votingPower ? `${votingPower.toString()} votes` : '0 votes'
                            ) : 'Not Connected'}
                          </Badge>
                        </div>
                      </div>
                      
                      {needsDelegation && (
                        <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                          <AlertTriangle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-blue-700 dark:text-blue-300 space-y-2">
                            <div>
                              You have tokens but no voting power. You need to delegate your tokens to yourself to activate voting power.
                            </div>
                            <Button
                              size="sm"
                              onClick={handleSelfDelegate}
                              className="h-6 text-xs bg-blue-600 hover:bg-blue-700"
                            >
                              Delegate to Self
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      {votingPower && votingPower === 0n && !needsDelegation && (
                        <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                          <div className="text-xs text-amber-700 dark:text-amber-300">
                            You need governance tokens to create proposals and vote. Tokens are usually distributed to early contributors or can be purchased.
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Create Proposal Section */}
            <Card className="border-emerald-200 dark:border-emerald-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-emerald-800 dark:text-emerald-200">
                  <Plus className="h-4 w-4" />
                  Create Canon Proposal
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="node-select">Select Event to Make Canon</Label>
                  <Select value={selectedNodeId} onValueChange={setSelectedNodeId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose an event..." />
                    </SelectTrigger>
                    <SelectContent className="z-[70]">
                      {sceneNodes.map((node) => (
                        <SelectItem key={node.id} value={node.data.eventId || node.id}>
                          Event {node.data.displayName || node.data.eventId} - {node.data.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="proposal-description">Proposal Description</Label>
                  <Input
                    id="proposal-description"
                    placeholder="Explain why this event should be canon..."
                    value={proposalDescription}
                    onChange={(e) => setProposalDescription(e.target.value)}
                  />
                </div>

                <Button
                  onClick={handleCreateProposal}
                  disabled={!isGovernanceConfigured || isCreatingProposal || !selectedNodeId || !proposalDescription || !votingPower || votingPower === 0n}
                  className="w-full bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
                >
                  {isCreatingProposal ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating Proposal...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Proposal
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Active Proposals Section */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-blue-800 dark:text-blue-200">
                  <Users className="h-4 w-4" />
                  Active Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoadingProposals ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                  </div>
                ) : proposals.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                    <Vote className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No active proposals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <Card key={proposal.id} className="border-slate-200 dark:border-slate-700">
                        <CardContent className="p-4">
                          <div className="space-y-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="font-medium text-sm text-slate-900 dark:text-slate-100 line-clamp-2">
                                  {proposal.description}
                                </h4>
                                {proposal.nodeId && (
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    <Crown className="h-3 w-3 mr-1" />
                                    Event {proposal.nodeId}
                                  </Badge>
                                )}
                              </div>
                            </div>

                            {/* Voting Section with Better Layout */}
                            <div className="space-y-3">
                              {/* Voting Buttons in Column */}
                              <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                  <Button
                                    size="sm"
                                    onClick={() => handleVote(proposal.proposalId, 1)}
                                    disabled={!votingPower || votingPower === 0n}
                                    className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-xs h-7 px-2"
                                  >
                                    <CheckCircle className="h-3 w-3" />
                                    For
                                  </Button>
                                  <span className="text-xs font-medium text-emerald-700 dark:text-emerald-300">
                                    {proposal.forVotes.toString()} votes
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleVote(proposal.proposalId, 0)}
                                    disabled={!votingPower || votingPower === 0n}
                                    className="flex items-center gap-1 text-xs h-7 px-2"
                                  >
                                    <XCircle className="h-3 w-3" />
                                    Against
                                  </Button>
                                  <span className="text-xs font-medium text-red-700 dark:text-red-300">
                                    {proposal.againstVotes.toString()} votes
                                  </span>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleVote(proposal.proposalId, 2)}
                                    disabled={!votingPower || votingPower === 0n}
                                    className="flex items-center gap-1 text-xs h-7 px-2"
                                  >
                                    <Clock className="h-3 w-3" />
                                    Abstain
                                  </Button>
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {proposal.abstainVotes.toString()} votes
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Governance Info */}
            {(votingDelay || votingPeriod || proposalThreshold) && (
              <Card className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200 dark:border-slate-700">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm text-slate-700 dark:text-slate-300">
                    Governance Parameters
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {votingDelay && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Voting Delay:</span>
                      <span className="text-slate-800 dark:text-slate-200">{votingDelay.toString()} blocks</span>
                    </div>
                  )}
                  {votingPeriod && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Voting Period:</span>
                      <span className="text-slate-800 dark:text-slate-200">{votingPeriod.toString()} blocks</span>
                    </div>
                  )}
                  {proposalThreshold && (
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-600 dark:text-slate-400">Proposal Threshold:</span>
                      <span className="text-slate-800 dark:text-slate-200">{proposalThreshold.toString()} tokens</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        {/* Footer with Close Button */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
            size="sm"
          >
            <X className="h-4 w-4 mr-2" />
            Close Governance
          </Button>
        </div>
      </div>
    </div>
  );
}