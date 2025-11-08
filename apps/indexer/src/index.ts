import { ponder } from "ponder:registry";
import {
  universe,
  token,
  hookEvent,
  node,
  nodeCanonization,
  nodeContent,
  tokenTransfer,
  tokenHolder,
  pool,
  swap,
  proposal,
  proposalExecution,
  proposalCancellation,
  vote,
} from "ponder:schema";
import { getAddress } from "viem";

// ============= UniverseManager Events =============

ponder.on("UniverseManager:UniverseCreated", async ({ event, context }) => {
  const universeAddress = getAddress(event.args.universe);

  await context.db.insert(universe).values({
    id: universeAddress,
    universeId: null, // We don't have direct access to the ID in the event
    creator: getAddress(event.args.creator),
    createdAt: Number(event.block.timestamp),
    tokenAddress: null,
    governorAddress: null,
    nodeCount: 0,
  });
});

ponder.on("UniverseManager:TokenCreated", async ({ event, context }) => {
  const tokenAddress = getAddress(event.args.tokenAddress);
  const deployer = getAddress(event.args.msgSender);
  const governorAddress = getAddress(event.args.governor);

  // Create token record
  // Note: universeAddress will be linked via API queries using creator/governor
  await context.db.insert(token).values({
    id: tokenAddress,
    universeAddress: "0x0000000000000000000000000000000000000000", // Will query via creator
    deployer: deployer,
    tokenAdmin: getAddress(event.args.tokenAdmin),
    name: event.args.tokenName,
    symbol: event.args.tokenSymbol,
    imageURL: event.args.tokenImage,
    metadata: event.args.tokenMetadata,
    context: event.args.tokenContext,
    startingTick: event.args.startingTick.toString(),
    poolHook: getAddress(event.args.poolHook),
    poolId: event.args.poolId,
    pairedToken: getAddress(event.args.pairedToken),
    locker: getAddress(event.args.locker),
    createdAt: Number(event.block.timestamp),
  });
});

ponder.on("UniverseManager:SetHook", async ({ event, context }) => {
  await context.db.insert(hookEvent).values({
    id: event.id,
    timestamp: Number(event.block.timestamp),
    hook_address: getAddress(event.args.hook),
    enabled: event.args.enabled,
  });
});

// ============= Universe (Dynamic Contract) Events =============

ponder.on("Universe:NodeCreated", async ({ event, context }) => {
  const universeAddress = getAddress(event.log.address);
  const nodeId = Number(event.args.id);

  // Insert node
  await context.db.insert(node).values({
    id: `${universeAddress}:${nodeId}`,
    universeAddress: universeAddress,
    nodeId: nodeId,
    previousNodeId: Number(event.args.previous),
    creator: getAddress(event.args.creator),
    createdAt: Number(event.block.timestamp),
  });

  // Read node content from Universe contract
  try {
    const nodeData = await context.client.readContract({
      abi: context.contracts.Universe.abi,
      address: universeAddress,
      functionName: "getNode",
      args: [BigInt(nodeId)],
      cache: "immutable",
    });

    // nodeData returns: (id, link, plot, previous, next[], canon, creator)
    const [, videoLink, plot] = nodeData as [bigint, string, string, bigint, bigint[], boolean, string];

    await context.db.insert(nodeContent).values({
      id: `${universeAddress}:${nodeId}`,
      videoLink,
      plot,
    });
  } catch (error) {
    console.error(`Failed to read node content for ${universeAddress}:${nodeId}:`, error);
  }

  // Increment node count for the universe
  const universeRecord = await context.db.find(universe, { id: universeAddress });

  if (universeRecord) {
    await context.db
      .update(universe, { id: universeAddress })
      .set({ nodeCount: universeRecord.nodeCount + 1 });
  }
});

ponder.on("Universe:NodeCanonized", async ({ event, context }) => {
  const universeAddress = getAddress(event.log.address);
  const nodeId = Number(event.args.id);

  await context.db.insert(nodeCanonization).values({
    id: `${universeAddress}:${nodeId}:${event.id}`,
    universeAddress: universeAddress,
    nodeId: nodeId,
    canonizer: getAddress(event.args.canonizer),
    timestamp: Number(event.block.timestamp),
  });
});

// ============= UniverseGovernor Events =============

ponder.on("UniverseGovernor:ProposalCreated", async ({ event, context }) => {
  const governorAddress = getAddress(event.log.address);
  const proposalId = event.args.proposalId.toString();

  // Find universe associated with this governor
  // This requires a lookup or mapping
  let universeAddress = null;
  const universes = await context.db
    .select()
    .from(universe)
    .where((u) => u.governorAddress === governorAddress)
    .limit(1);

  if (universes.length > 0) {
    universeAddress = universes[0].id;
  }

  await context.db.insert(proposal).values({
    id: proposalId,
    governorAddress: governorAddress,
    universeAddress: universeAddress,
    proposer: getAddress(event.args.proposer),
    targets: JSON.stringify(event.args.targets),
    values: JSON.stringify(event.args.values.map((v) => v.toString())),
    calldatas: JSON.stringify(event.args.calldatas),
    description: event.args.description,
    startBlock: Number(event.args.voteStart),
    endBlock: Number(event.args.voteEnd),
    createdAt: Number(event.block.timestamp),
    executed: false,
    cancelled: false,
  });
});

ponder.on("UniverseGovernor:ProposalExecuted", async ({ event, context }) => {
  const governorAddress = getAddress(event.log.address);
  const proposalId = event.args.proposalId.toString();

  // Update proposal status
  await context.db
    .update(proposal, { id: proposalId })
    .set({ executed: true });

  // Record execution event
  await context.db.insert(proposalExecution).values({
    id: event.id,
    proposalId: proposalId,
    governorAddress: governorAddress,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("UniverseGovernor:ProposalCanceled", async ({ event, context }) => {
  const governorAddress = getAddress(event.log.address);
  const proposalId = event.args.proposalId.toString();

  // Update proposal status
  await context.db
    .update(proposal, { id: proposalId })
    .set({ cancelled: true });

  // Record cancellation event
  await context.db.insert(proposalCancellation).values({
    id: event.id,
    proposalId: proposalId,
    governorAddress: governorAddress,
    timestamp: Number(event.block.timestamp),
  });
});

ponder.on("UniverseGovernor:VoteCast", async ({ event, context }) => {
  const governorAddress = getAddress(event.log.address);
  const proposalId = event.args.proposalId.toString();
  const voter = getAddress(event.args.voter);

  await context.db.insert(vote).values({
    id: `${proposalId}:${voter}`,
    proposalId: proposalId,
    governorAddress: governorAddress,
    voter: voter,
    support: event.args.support,
    weight: event.args.weight.toString(),
    reason: event.args.reason || null,
    timestamp: Number(event.block.timestamp),
  });
});

// ============= Token Transfer Tracking =============

ponder.on("GovernanceToken:Transfer", async ({ event, context }) => {
  const tokenAddress = getAddress(event.log.address);
  const from = getAddress(event.args.from);
  const to = getAddress(event.args.to);
  const value = event.args.value;

  // Record transfer
  await context.db.insert(tokenTransfer).values({
    id: event.id,
    tokenAddress,
    from,
    to,
    value: value.toString(),
    timestamp: Number(event.block.timestamp),
    blockNumber: Number(event.block.number),
  });

  // Update holder balances (skip mint/burn from/to zero address for balance tracking)
  if (from !== "0x0000000000000000000000000000000000000000") {
    const fromHolder = await context.db.find(tokenHolder, { id: `${tokenAddress}:${from}` });
    if (fromHolder) {
      const newBalance = BigInt(fromHolder.balance) - value;
      if (newBalance > 0n) {
        await context.db
          .update(tokenHolder, { id: `${tokenAddress}:${from}` })
          .set({ balance: newBalance.toString() });
      } else {
        // Balance is zero, could delete the record but we'll keep it
        await context.db
          .update(tokenHolder, { id: `${tokenAddress}:${from}` })
          .set({ balance: "0" });
      }
    }
  }

  if (to !== "0x0000000000000000000000000000000000000000") {
    await context.db
      .insert(tokenHolder)
      .values({
        id: `${tokenAddress}:${to}`,
        tokenAddress,
        holderAddress: to,
        balance: value.toString(),
      })
      .onConflictDoUpdate((row) => ({
        balance: (BigInt(row.balance) + value).toString(),
      }));
  }
});

// ============= Uniswap v4 Pool Tracking =============

ponder.on("PoolManager:Initialize", async ({ event, context }) => {
  await context.db.insert(pool).values({
    poolId: event.args.id,
    currency0: getAddress(event.args.currency0),
    currency1: getAddress(event.args.currency1),
    fee: event.args.fee,
    tickSpacing: event.args.tickSpacing,
    hooks: getAddress(event.args.hooks),
    sqrtPriceX96: event.args.sqrtPriceX96.toString(),
    tick: event.args.tick,
    creationBlock: Number(event.block.number),
  });
});

ponder.on("PoolManager:Swap", async ({ event, context }) => {
  await context.db.insert(swap).values({
    id: event.id,
    poolId: event.args.id,
    sender: getAddress(event.args.sender),
    amount0: event.args.amount0.toString(),
    amount1: event.args.amount1.toString(),
    sqrtPriceX96: event.args.sqrtPriceX96.toString(),
    liquidity: event.args.liquidity.toString(),
    tick: event.args.tick,
    timestamp: Number(event.block.timestamp),
    blockNumber: Number(event.block.number),
  });
});
