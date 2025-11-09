import { index, onchainTable, relations } from "ponder";

// ============= UniverseManager Events =============

export const universe = onchainTable(
  "universe",
  (t) => ({
    id: t.text().primaryKey(), // universe address
    universeId: t.integer(), // universe ID from UniverseManager (if trackable)
    creator: t.hex().notNull(),
    createdAt: t.integer().notNull(),
    name: t.text().notNull(), // universe name from contract
    description: t.text().notNull(), // universe description from contract
    imageURL: t.text().notNull(), // universe image URL from contract
    tokenAddress: t.hex(), // set when token is created
    governorAddress: t.hex(), // set when token is created
    nodeCount: t.integer().notNull().default(0), // track number of nodes
  }),
  (table) => ({
    creatorIdx: index("universe_creator_idx").on(table.creator),
  })
);

export const token = onchainTable(
  "token",
  (t) => ({
    id: t.text().primaryKey(), // token address
    universeAddress: t.hex().notNull(),
    deployer: t.hex().notNull(),
    tokenAdmin: t.hex().notNull(),
    name: t.text().notNull(),
    symbol: t.text().notNull(),
    imageURL: t.text().notNull(),
    metadata: t.text().notNull(),
    context: t.text().notNull(),
    startingTick: t.text().notNull(), // int24 as string
    poolHook: t.hex().notNull(),
    poolId: t.hex().notNull(),
    pairedToken: t.hex().notNull(),
    locker: t.hex().notNull(),
    createdAt: t.integer().notNull(),
  }),
  (table) => ({
    deployerIdx: index("token_deployer_idx").on(table.deployer),
    universeIdx: index("token_universe_idx").on(table.universeAddress),
  })
);

export const hookEvent = onchainTable(
  "hook_event",
  (t) => ({
    id: t.text().primaryKey(),
    timestamp: t.integer().notNull(),
    hook_address: t.hex().notNull(),
    enabled: t.boolean().notNull(),
  })
);

// ============= Universe (dynamic) Events =============

export const node = onchainTable(
  "node",
  (t) => ({
    id: t.text().primaryKey(), // universe_address:node_id
    universeAddress: t.hex().notNull(),
    nodeId: t.integer().notNull(),
    previousNodeId: t.integer().notNull(),
    creator: t.hex().notNull(),
    createdAt: t.integer().notNull(),
  }),
  (table) => ({
    universeIdx: index("node_universe_idx").on(table.universeAddress),
    creatorIdx: index("node_creator_idx").on(table.creator),
  })
);

export const nodeCanonization = onchainTable(
  "node_canonization",
  (t) => ({
    id: t.text().primaryKey(),
    universeAddress: t.hex().notNull(),
    nodeId: t.integer().notNull(),
    canonizer: t.hex().notNull(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    universeIdx: index("canon_universe_idx").on(table.universeAddress),
  })
);

export const nodeContent = onchainTable(
  "node_content",
  (t) => ({
    id: t.text().primaryKey(), // universe:nodeId
    videoLink: t.text().notNull(),
    plot: t.text().notNull(),
  })
);

// ============= Token Transfer Tracking =============

export const tokenTransfer = onchainTable(
  "token_transfer",
  (t) => ({
    id: t.text().primaryKey(),
    tokenAddress: t.hex().notNull(),
    from: t.hex().notNull(),
    to: t.hex().notNull(),
    value: t.text().notNull(), // bigint as string
    timestamp: t.integer().notNull(),
    blockNumber: t.integer().notNull(),
  }),
  (table) => ({
    tokenIdx: index("transfer_token_idx").on(table.tokenAddress),
    fromIdx: index("transfer_from_idx").on(table.from),
    toIdx: index("transfer_to_idx").on(table.to),
  })
);

export const tokenHolder = onchainTable(
  "token_holder",
  (t) => ({
    id: t.text().primaryKey(), // tokenAddress:holderAddress
    tokenAddress: t.hex().notNull(),
    holderAddress: t.hex().notNull(),
    balance: t.text().notNull(), // bigint as string
  }),
  (table) => ({
    tokenIdx: index("holder_token_idx").on(table.tokenAddress),
    holderIdx: index("holder_address_idx").on(table.holderAddress),
  })
);

// ============= Uniswap v4 Pool Tracking =============

export const pool = onchainTable(
  "pool",
  (t) => ({
    poolId: t.hex().primaryKey(),
    currency0: t.hex().notNull(),
    currency1: t.hex().notNull(),
    fee: t.integer().notNull(),
    tickSpacing: t.integer().notNull(),
    hooks: t.hex().notNull(),
    sqrtPriceX96: t.text(), // bigint as string
    tick: t.integer(),
    creationBlock: t.integer().notNull(),
  }),
  (table) => ({
    currency0Idx: index("pool_currency0_idx").on(table.currency0),
    currency1Idx: index("pool_currency1_idx").on(table.currency1),
    hooksIdx: index("pool_hooks_idx").on(table.hooks),
  })
);

export const swap = onchainTable(
  "swap",
  (t) => ({
    id: t.text().primaryKey(),
    poolId: t.hex().notNull(),
    sender: t.hex().notNull(),
    amount0: t.text().notNull(), // bigint as string
    amount1: t.text().notNull(), // bigint as string
    sqrtPriceX96: t.text().notNull(), // bigint as string
    liquidity: t.text().notNull(), // bigint as string
    tick: t.integer().notNull(),
    timestamp: t.integer().notNull(),
    blockNumber: t.integer().notNull(),
  }),
  (table) => ({
    poolIdIdx: index("swap_pool_idx").on(table.poolId),
    senderIdx: index("swap_sender_idx").on(table.sender),
    blockIdx: index("swap_block_idx").on(table.blockNumber),
  })
);

// ============= UniverseGovernor Events =============

export const proposal = onchainTable(
  "proposal",
  (t) => ({
    id: t.text().primaryKey(), // proposalId
    governorAddress: t.hex().notNull(),
    universeAddress: t.hex(), // resolved from governor
    proposer: t.hex().notNull(),
    targets: t.text().notNull(), // JSON array
    values: t.text().notNull(), // JSON array
    calldatas: t.text().notNull(), // JSON array
    description: t.text().notNull(),
    startBlock: t.integer().notNull(),
    endBlock: t.integer().notNull(),
    createdAt: t.integer().notNull(),
    executed: t.boolean().notNull().default(false),
    cancelled: t.boolean().notNull().default(false),
  }),
  (table) => ({
    governorIdx: index("proposal_governor_idx").on(table.governorAddress),
    proposerIdx: index("proposal_proposer_idx").on(table.proposer),
    universeIdx: index("proposal_universe_idx").on(table.universeAddress),
  })
);

export const proposalExecution = onchainTable(
  "proposal_execution",
  (t) => ({
    id: t.text().primaryKey(),
    proposalId: t.text().notNull(),
    governorAddress: t.hex().notNull(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    proposalIdx: index("execution_proposal_idx").on(table.proposalId),
  })
);

export const proposalCancellation = onchainTable(
  "proposal_cancellation",
  (t) => ({
    id: t.text().primaryKey(),
    proposalId: t.text().notNull(),
    governorAddress: t.hex().notNull(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    proposalIdx: index("cancellation_proposal_idx").on(table.proposalId),
  })
);

export const vote = onchainTable(
  "vote",
  (t) => ({
    id: t.text().primaryKey(), // proposalId:voter
    proposalId: t.text().notNull(),
    governorAddress: t.hex().notNull(),
    voter: t.hex().notNull(),
    support: t.integer().notNull(), // 0 = against, 1 = for, 2 = abstain
    weight: t.text().notNull(), // vote weight as string (bigint)
    reason: t.text(),
    timestamp: t.integer().notNull(),
  }),
  (table) => ({
    proposalIdx: index("vote_proposal_idx").on(table.proposalId),
    voterIdx: index("vote_voter_idx").on(table.voter),
  })
);

// ============= Relations =============

export const universeRelations = relations(universe, ({ one, many }) => ({
  token: one(token, {
    fields: [universe.tokenAddress],
    references: [token.id],
  }),
  nodes: many(node),
  proposals: many(proposal),
}));

export const tokenRelations = relations(token, ({ one }) => ({
  universe: one(universe, {
    fields: [token.universeAddress],
    references: [universe.id],
  }),
}));

export const nodeRelations = relations(node, ({ one }) => ({
  universe: one(universe, {
    fields: [node.universeAddress],
    references: [universe.id],
  }),
}));

export const proposalRelations = relations(proposal, ({ one, many }) => ({
  universe: one(universe, {
    fields: [proposal.universeAddress],
    references: [universe.id],
  }),
  votes: many(vote),
  execution: one(proposalExecution),
  cancellation: one(proposalCancellation),
}));

export const voteRelations = relations(vote, ({ one }) => ({
  proposal: one(proposal, {
    fields: [vote.proposalId],
    references: [proposal.id],
  }),
}));
