# 🌌 LOAR: Decentralized Narrative Control Suite

<div align="center">

![LOAR Banner](https://fungerbil.com/LOARLOGO.png)

### *Empowering Creators to Build Collaborative Cinematic Universes*

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Powered by Walrus](https://img.shields.io/badge/Powered%20by-Walrus-blue)](https://www.walrus.xyz/)
[![OpenSea Integration](https://img.shields.io/badge/OpenSea-Integration-blue)](https://opensea.io)
[![Dynamic Auth](https://img.shields.io/badge/Auth%20by-Dynamic-purple)](https://www.dynamic.xyz/)

</div>

## 🔮 Vision

LOAR revolutionizes narrative creation by putting the power of storytelling in the hands of communities. Our platform enables collaborative cinematic universe development with decentralized governance, censorship-resistant content hosting, and blockchain-based ownership.

## 🚀 Core Features

### 🧩 Narrative Flow Editor
- **Interactive Graph-Based Editor** - Create and visualize complex narrative structures
- **Character-Plot Connections** - Link characters to storylines with visual relationships
- **Canonicity Management** - Track and vote on official universe canon
- **NFT Integration** - Characters backed by NFT ownership

### 🛡️ Censorship-Resistant Content (Powered by Walrus Protocol)
- **Decentralized Video Storage** - Content that can't be taken down or censored
- **Blockchain Certification** - Videos certified on Sui blockchain
- **Guaranteed Availability** - Content remains accessible regardless of platform pressure
- **Trustless Distribution** - No central authority controls your narrative

### 🖼️ NFT Character System (OpenSea Integration)
- **Automatic Character Generation** - Create character profiles from NFT metadata
- **MCP Server Integration** - Direct access to OpenSea's Multi-Chain Protocol
- **Rarity-Based Attributes** - Character traits influenced by NFT rarity
- **Dynamic Wikis** - Auto-generated character wikis from NFT collections

### 🏛️ Decentralized Governance
- **Token-Based Voting** - Community decides on canonical content
- **Proposal System** - Submit narrative elements for community approval
- **Stake-Weighted Influence** - Greater stake means greater say in universe direction
- **Transparent Decision Making** - All votes recorded on-chain

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Bun** (recommended) - [Install here](https://bun.sh/)
- **PostgreSQL** - [Install here](https://www.postgresql.org/download/)
- **Foundry** (for smart contracts) - [Install here](https://book.getfoundry.sh/getting-started/installation)
- **Ethereum wallet** (MetaMask recommended)
- **NFT holdings** (for full governance participation)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Loar-Fullstack
   ```

<<<<<<< HEAD
2. **Install dependencies:**
   ```bash
   # Install dependencies for the entire monorepo
   bun install
   
   # If you encounter missing dependencies, install them specifically for the web app
   cd apps/web
   bun install
   bun add reactflow  # Required for the narrative flow editor
   ```

3. **Set up Dynamic Wallet Authentication:**
   - Go to [Dynamic Dashboard](https://app.dynamic.xyz/)
   - Create a new project
   - Copy your Environment ID
   - Create `.env` file in `apps/web/`:
     ```env
     VITE_DYNAMIC_ENVIRONMENT_ID=your_environment_id_here
     VITE_SERVER_URL=http://localhost:3000
     ```

4. **Configure your environment:**
   - Update `apps/server/.env` with your PostgreSQL and OpenSea API details
   - Copy `apps/web/.env.example` to `apps/web/.env` and update as needed

5. **Set up the database:**
   ```bash
   # From the root directory
   bun db:push
   # Or if you prefer to run migrations
   cd apps/server
   bun run db:generate
   bun run db:migrate
   ```

## 🚀 Running the Application

1. **Launch the platform:**
   ```bash
   # Run the full stack:
   bun dev
   
   # Or run just the frontend:
   bun dev:web
   
   # Or run just the backend:
   bun dev:server
   ```

2. **Access the application:**
   - Web App: [http://localhost:3001](http://localhost:3001) or [http://localhost:3002](http://localhost:3002) (port may vary if 3001 is already in use)
   - API endpoints: [http://localhost:3000](http://localhost:3000)

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

3. **Deploy smart contracts (optional):**
   ```bash
   cd apps/contracts
   forge build
   forge test
   ```

## 🌐 Access the Application

- **Web App:** http://localhost:3001
- **Server:** http://localhost:3000
- **API Documentation:** http://localhost:3000/trpc

## 🔐 Dynamic Wallet Features

- **Multi-Wallet Support** - MetaMask, WalletConnect, Coinbase Wallet, and more
- **Embedded Wallets** - MPC-based wallet creation
- **Smart Accounts** - Account abstraction support
- **Multi-Chain** - Ethereum, Polygon, Base, and other EVM chains
- **Mobile Support** - QR code scanning and mobile wallet integration

## 📁 Project Structure

```
Loar-Fullstack/
├── apps/
│   ├── web/                 # React frontend with Dynamic auth
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── flow/       # ReactFlow narrative editor components
│   │   │   │   ├── ui/         # shadcn/ui components
│   │   │   │   └── wiki/       # Character wiki components
│   │   │   ├── lib/          # Utility functions
│   │   │   ├── routes/       # TanStack Router routes
│   │   │   └── utils/        # Helper utilities
│   │   └── public/         # Static assets
│   ├── server/              # tRPC backend
│   │   ├── src/
│   │   │   ├── db/          # Database schema and migrations
│   │   │   ├── routers/      # tRPC route handlers
│   │   │   ├── services/     # Business logic services
│   │   │   └── utils/        # Helper utilities
│   │   └── test/           # Test files
│   ├── character-wiki/      # Character wiki generator
│   └── contracts/           # Solidity smart contracts
├── lib/                     # Shared libraries
└── package.json            # Root package.json
```

## 🌟 Why LOAR? (For Hackathon Judges)

### 💡 The Problem We're Solving
Traditional media creation is centralized, controlled by studios and platforms that can censor content, restrict creator freedom, and limit community involvement. When communities do participate, there's no reliable way to track canonical content or ensure fair governance.

### 🛠️ Our Solution
LOAR creates a decentralized ecosystem where:

1. **Communities Own Their Narratives** - Not corporations or platforms
2. **Content Cannot Be Censored** - Thanks to Walrus Protocol's decentralized storage
3. **Ownership Is Verifiable** - Through blockchain authentication and NFTs
4. **Governance Is Democratic** - With on-chain voting and proposals
5. **Creation Is Collaborative** - With our visual narrative flow editor

### 💸 Market Potential
- **$300B+** global entertainment market
- **80M+** NFT owners seeking utility for their digital assets
- **Growing demand** for decentralized content platforms resistant to censorship
- **Expanding creator economy** looking for new monetization models

### 📊 Technical Innovation
1. **First-of-its-kind integration** between narrative creation tools and decentralized storage
2. **Novel use of OpenSea MCP** for character generation from NFT metadata
3. **Unique visual editor** for managing narrative canonicity with blockchain verification
4. **Censorship-resistant media pipeline** from creation to distribution

## 📍 Technical Architecture

```mermaid
graph TD
    A[User Interface] --> B[Narrative Flow Editor]
    A --> C[Character Wiki]
    A --> D[Governance Portal]
    
    B --> E[ReactFlow Engine]
    E --> F[Narrative State Manager]
    F --> G[tRPC API Layer]
    
    C --> H[OpenSea MCP Integration]
    H --> I[NFT Metadata Parser]
    I --> J[Character Generator]
    J --> G
    
    D --> K[Voting Contract]
    K --> L[On-Chain Governance]
    L --> G
    
    G --> M[PostgreSQL Database]
    G --> N[Walrus Protocol]
    N --> O[Publisher Node]
    N --> P[Aggregator Node]
    O --> Q[Sui Blockchain]
    
    R[Dynamic Auth] --> A
```

### Key Components

1. **Frontend Layer**
   - React 19 with TanStack Router
   - ReactFlow for narrative visualization
   - Dynamic wallet authentication

2. **API Layer**
   - tRPC for type-safe API calls
   - Hono for high-performance endpoints
   - WebSocket for real-time updates

3. **Storage Layer**
   - PostgreSQL with Drizzle ORM for structured data
   - Walrus Protocol for censorship-resistant media

4. **Blockchain Layer**
   - Smart contracts for governance
   - NFT integration for character ownership
   - Multi-chain support via Dynamic

## 🎨 Customization

### Dynamic Configuration
Edit `apps/web/src/lib/dynamic.ts` to customize:
- Wallet connectors
- Event callbacks
- UI themes
- Chain configurations

### UI Components
All UI components are in `apps/web/src/components/ui/` using shadcn/ui.

## 🔧 Development

### Adding New Routes
1. Create a new file in `apps/web/src/routes/`
2. Export a `Route` using `createFileRoute`
3. The route will be automatically included

### Adding New API Endpoints
1. Add new procedures in `apps/server/src/routers/`
2. Export them from `apps/server/src/routers/index.ts`
3. Use them in the frontend with tRPC

### Smart Contract Development
1. Add contracts in `apps/contracts/src/`
2. Write tests in `apps/contracts/test/`
3. Deploy scripts in `apps/contracts/script/`

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd apps/web
bun run build
```

### Backend (Railway/Render)
```bash
cd apps/server
bun run build
```

### Smart Contracts
```bash
cd apps/contracts
forge build
forge deploy
```

## 🔑 Key Technologies & Technical Implementation

### 🧠 Core Stack
- **TypeScript** - End-to-end type safety across the entire application
- **React 19 & TanStack Router** - Latest React features with optimized routing
- **Hono & tRPC** - High-performance API layer with end-to-end typesafety
- **Tailwind & shadcn/ui** - Beautiful, responsive UI components
- **Drizzle ORM** - Type-safe database access with PostgreSQL

### 🌊 Walrus Protocol Integration
- **Censorship-Resistant Storage** - Content stored across decentralized network
- **Blockchain Certification** - All uploads certified on Sui blockchain
- **Publisher/Aggregator Architecture** - Two-tier system for reliable content delivery
- **Content Addressing** - Immutable content identifiers for all media
- **Epoch-Based Storage** - Content guaranteed available for specified epochs
- **Direct Upload API** - Seamless integration with our media pipeline

### 🦑 OpenSea MCP Integration
- **Multi-Chain Protocol Server** - Direct access to OpenSea's data across chains
- **AI-Powered Character Generation** - Automatic character profiles from NFT metadata
- **Trait Analysis** - Extract and normalize NFT traits for character attributes
- **Rarity Ranking** - Character abilities influenced by NFT rarity
- **Collection-Based Universes** - Group narratives by NFT collections
- **Dynamic Character Wikis** - Auto-generated and community-expandable wikis

### 🔗 Blockchain Features
- **Multi-Chain Support** - Ethereum, Polygon, Base, and other EVM chains
- **Dynamic Wallet Authentication** - Connect with any major wallet
- **Smart Contract Governance** - On-chain voting and proposal systems
- **Token-Gated Access** - Exclusive features for token holders
- **NFT Ownership Verification** - Prove character ownership through NFTs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 🌐 The Future of LOAR

Our roadmap includes:

- **AI-Generated Content** - Narrative expansion using AI models
- **Cross-Universe Collaborations** - Connect multiple cinematic universes
- **Mobile Apps** - Take your universe creation on the go
- **Creator Monetization** - Direct revenue streams for contributors
- **Expanded Blockchain Support** - Integration with more chains and L2s

## 🏆 Hackathon Impact

LOAR represents a paradigm shift in how stories are created, shared, and owned. By combining:

- **Censorship-resistant storage** via Walrus Protocol
- **Community ownership** through blockchain authentication
- **Visual narrative tools** with our ReactFlow editor
- **NFT utility** through OpenSea MCP integration

We've created a platform that empowers creators while protecting their freedom of expression. Our technical innovations in decentralized media storage and community governance set new standards for Web3 applications.

## 📚 License

This project is licensed under the MIT License.

## 👨‍💻 Team

LOAR was created by a team of passionate developers, designers, and storytellers who believe in the power of decentralized narrative creation.

## 🆘 Resources

- **Walrus Protocol:** [walrus.xyz](https://www.walrus.xyz/)
- **OpenSea API:** [opensea.io](https://opensea.io/)
- **Dynamic Auth:** [dynamic.xyz](https://www.dynamic.xyz/)
- **ReactFlow:** [reactflow.dev](https://reactflow.dev/)

---

<div align="center">

# 🔥 Decentralize Storytelling. Empower Communities. Build Universes. 🔥

</div>
