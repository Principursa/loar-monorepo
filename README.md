# Loar Fullstack

A modern fullstack application with Dynamic wallet authentication, built with React 19, Vite, TanStack Router, and tRPC.

## 🚀 Features

- **Dynamic Wallet Authentication** - Connect with MetaMask, WalletConnect, and more
- **Modern Tech Stack** - React 19, Vite, TanStack Router, tRPC
- **Type Safety** - Full TypeScript support
- **Beautiful UI** - Tailwind CSS with shadcn/ui components
- **Smart Contracts** - Foundry-based Solidity contracts
- **Database** - Drizzle ORM with PostgreSQL

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
│   ├── server/              # tRPC backend
│   └── contracts/           # Solidity smart contracts
├── lib/                     # Shared libraries
└── package.json            # Root package.json
```

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

## 🔑 Key Technologies

- **TypeScript** - Type-safe development
- **React & TanStack** - Dynamic frontend
- **Hono & tRPC** - Performant API layer
- **Ethereum & OpenSea** - Blockchain integration
- **Walrus Protocol** - Decentralized content storage
- **Dynamic** - Wallet Connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Dynamic Documentation:** [docs.dynamic.xyz](https://docs.dynamic.xyz/)
- **tRPC Documentation:** [trpc.io](https://trpc.io/)
- **TanStack Router:** [tanstack.com/router](https://tanstack.com/router)

---

**Gang gang gang! 🚀 LFG!**
