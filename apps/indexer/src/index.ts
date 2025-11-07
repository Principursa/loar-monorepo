import { ponder } from "ponder:registry";
import {
  universe,
  token,
  hookEvent,
  node,
  nodeCanonization,
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

  // Find which universe was created by this deployer (most recent one without a token)
  const universes = await context.db
    .select()
    .from(universe)
    .where((u) => u.creator === deployer && u.tokenAddress === null)
    .orderBy((u) => u.createdAt, "desc")
    .limit(1);

  let universeAddress = null;

  if (universes.length > 0) {
    universeAddress = universes[0].id;

    // Update the universe with token and governor addresses
    await context.db
      .update(universe, { id: universeAddress })
      .set({
        tokenAddress: tokenAddress,
        governorAddress: governorAddress,
      });
  }

  // Create token record
  await context.db.insert(token).values({
    id: tokenAddress,
    universeAddress: universeAddress || "0x0000000000000000000000000000000000000000",
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
    id: event.log.id,
    timestamp: Number(event.block.timestamp),
    hook_address: getAddress(event.args.hook),
    enabled: event.args.enabled,
  });
});

// ============= Universe (Dynamic Contract) Events =============

ponder.on("Universe:NodeCreated", async ({ event, context }) => {
  const universeAddress = getAddress(event.log.address);
  const nodeId = Number(event.args.id);

  await context.db.insert(node).values({
    id: `${universeAddress}:${nodeId}`,
    universeAddress: universeAddress,
    nodeId: nodeId,
    previousNodeId: Number(event.args.previous),
    creator: getAddress(event.args.creator),
    createdAt: Number(event.block.timestamp),
  });

  // Increment node count for the universe
  const universeRecord = await context.db
    .select()
    .from(universe)
    .where((u) => u.id === universeAddress)
    .limit(1);

  if (universeRecord.length > 0) {
    await context.db
      .update(universe, { id: universeAddress })
      .set({ nodeCount: universeRecord[0].nodeCount + 1 });
  }
});

ponder.on("Universe:NodeCanonized", async ({ event, context }) => {
  const universeAddress = getAddress(event.log.address);
  const nodeId = Number(event.args.id);

  await context.db.insert(nodeCanonization).values({
    id: `${universeAddress}:${nodeId}:${event.log.id}`,
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
    id: event.log.id,
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
    id: event.log.id,
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
