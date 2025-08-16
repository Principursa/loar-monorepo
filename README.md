# LOAR: Decentralized Narrative Control System

**LOAR** is a revolutionary platform for decentralized narrative control in collaborative content cinematic universes. We're redefining how canonical content is determined through blockchain-powered consensus mechanisms and NFT ownership.

## 🚀 Core Features

- **NFT-Powered Canon Control** - OpenSea NFT integration determines narrative authority and voting power
- **Decentralized Character Wikis** - Community-built lore with ownership verification
- **Tokenomics Governance** - Token-weighted voting on canonical storylines and character development
- **Blockchain Authentication** - Secure wallet-based authentication system
- **Decentralized Video Storage** - Walrus protocol integration for distributed content hosting
- **Dynamic Content Markets** - Create, trade, and monetize narrative elements
- **Cross-Universe Collaboration** - Build interconnected stories across multiple creator universes

## 💎 Why LOAR?

In the expanding multiverse of collaborative content creation, determining what's "canon" has always been centralized and contentious. LOAR disrupts this paradigm by creating a decentralized consensus mechanism where narrative control is determined by community ownership, engagement, and tokenized governance.

## 🔮 Getting Started
### Prerequisites

- Ethereum wallet (MetaMask recommended)
- NFT holdings (for full governance participation)
- Bun runtime environment (v1.1.0 or later)
- PostgreSQL database (for the server component)
- Node.js v18+ (if not using Bun)

### Installation

```bash
# Install dependencies for the entire monorepo
bun install

# If you encounter missing dependencies, install them specifically for the web app
cd apps/web
bun install
bun add reactflow  # Required for the narrative flow editor

# Configure your environment
# Update apps/server/.env with your PostgreSQL and OpenSea API details
# Copy apps/web/.env.example to apps/web/.env and update as needed

# Initialize the database (from the root directory)
cd ../.. 
bun db:push

# Launch the platform
# You can run the full stack:
bun dev

# Or run just the frontend:
bun dev:web

# Or run just the backend:
bun dev:server
```

Open [http://localhost:3001](http://localhost:3001) or [http://localhost:3002](http://localhost:3002) to access the LOAR platform (port may vary if 3001 is already in use).
API endpoints available at [http://localhost:3000](http://localhost:3000).

### Troubleshooting

If you encounter dependency issues:

1. **Missing packages**: Some dependencies might not be installed automatically. If you see errors about missing packages, install them individually:
   ```bash
   cd apps/web
   bun add reactflow @tailwindcss/postcss autoprefixer
   ```

2. **Port conflicts**: If port 3001 is already in use, the application will automatically use port 3002 or another available port.

3. **Database connection issues**: Ensure PostgreSQL is running and your connection details in `apps/server/.env` are correct.

4. **Workspace warnings**: You may see warnings about missing workspace directories like "packages/" or "contracts/". These can be safely ignored if you're only working on the web and server applications.



## 🏗️ Architecture

```
loar-fullstack/
├── apps/
│   ├── web/         # Frontend dApp (React + TanStack Router)
│   └── server/      # Backend API with blockchain integration
├── packages/
│   ├── nft-oracle/  # OpenSea data integration
│   ├── tokenomics/  # Governance and voting mechanisms
│   └── walrus-sdk/  # Decentralized video storage integration
```

## 💰 Tokenomics

LOAR implements a sophisticated token economy where narrative influence is directly tied to token holdings and NFT ownership:

- **Voting Power** - Proportional to NFT rarity and token holdings
- **Content Creation Rewards** - Earn tokens by contributing canonical content
- **Governance Participation** - Stake tokens to participate in major narrative decisions

## 🛠️ Development Commands

- `bun dev`: Launch the full LOAR ecosystem
- `bun build`: Build all applications for production
- `bun dev:web`: Start the frontend dApp only
- `bun dev:server`: Start the blockchain-integrated backend only
- `bun nft:sync`: Synchronize with OpenSea NFT data
- `bun governance:simulate`: Test tokenomics voting mechanisms
- `bun walrus:init`: Initialize decentralized video storage

## 🔗 Join the Revolution

LOAR is redefining narrative ownership in the digital age. Join our community of creators, collectors, and fans to shape the future of collaborative storytelling.

- **Website**: [loar.io](https://loar.io)
- **Discord**: [discord.gg/loar](https://discord.gg/loar)
- **Twitter**: [@loarprotocol](https://twitter.com/loarprotocol)

## 🚀 Built on Modern Tech

- **TypeScript** - Type-safe development
- **React & TanStack** - Dynamic frontend
- **Hono & tRPC** - Performant API layer
- **Ethereum & OpenSea** - Blockchain integration
- **Walrus Protocol** - Decentralized content storage
- **Dynamic** - Wallet Connection