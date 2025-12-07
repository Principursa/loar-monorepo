import { db } from "ponder:api";
import schema from "ponder:schema";
import { Hono } from "hono";
import { client, graphql } from "ponder";
import { getAddress } from "viem";
import {
  universe,
  node,
  proposal,
  token,
  vote,
} from "ponder:schema";

const app = new Hono();

app.use("/sql/*", client({ db, schema }));

// Custom REST endpoints
app.get("/creator/:address/universes", async (c) => {
  const address = getAddress(c.req.param("address"));

  const universes = await db
    .select()
    .from(universe)
    .where((u) => u.creator === address)
    .orderBy((u) => u.createdAt, "desc");

  return c.json({ universes });
});

app.get("/creator/:address/nodes", async (c) => {
  const address = getAddress(c.req.param("address"));

  const nodes = await db
    .select()
    .from(node)
    .where((n) => n.creator === address)
    .orderBy((n) => n.createdAt, "desc");

  return c.json({ nodes });
});

app.get("/creator/:address/proposals", async (c) => {
  const address = getAddress(c.req.param("address"));

  const proposals = await db
    .select()
    .from(proposal)
    .where((p) => p.proposer === address)
    .orderBy((p) => p.createdAt, "desc");

  return c.json({ proposals });
});

app.get("/creator/:address/votes", async (c) => {
  const address = getAddress(c.req.param("address"));

  const votes = await db
    .select()
    .from(vote)
    .where((v) => v.voter === address)
    .orderBy((v) => v.timestamp, "desc");

  return c.json({ votes });
});

app.get("/creator/:address/summary", async (c) => {
  const address = getAddress(c.req.param("address"));

  const [universes, nodes, proposals, votes] = await Promise.all([
    db.select().from(universe).where((u) => u.creator === address),
    db.select().from(node).where((n) => n.creator === address),
    db.select().from(proposal).where((p) => p.proposer === address),
    db.select().from(vote).where((v) => v.voter === address),
  ]);

  return c.json({
    address,
    summary: {
      universesCreated: universes.length,
      nodesCreated: nodes.length,
      proposalsCreated: proposals.length,
      votesCast: votes.length,
    },
    universes,
    nodes,
    proposals,
    votes,
  });
});

app.get("/universe/:address", async (c) => {
  const address = c.req.param("address").toLowerCase();

  const [allUniverses, allNodes, allTokens] = await Promise.all([
    db.select().from(universe),
    db.select().from(node),
    db.select().from(token),
  ]);

  const universeData = allUniverses.filter(u => u.id.toLowerCase() === address);
  const nodes = allNodes.filter(n => n.universeAddress.toLowerCase() === address).sort((a, b) => a.createdAt - b.createdAt);
  const tokenData = allTokens.filter(t => t.universeAddress.toLowerCase() === address);

  if (universeData.length === 0) {
    return c.json({ error: "Universe not found" }, 404);
  }

  return c.json({
    universe: universeData[0],
    token: tokenData[0] || null,
    nodes,
  });
});

app.get("/universe/:address/proposals", async (c) => {
  const address = getAddress(c.req.param("address"));

  const proposals = await db
    .select()
    .from(proposal)
    .where((p) => p.universeAddress === address)
    .orderBy((p) => p.createdAt, "desc");

  return c.json({ proposals });
});

app.use("/", graphql({ db, schema }));
app.use("/graphql", graphql({ db, schema }));

export default app;
