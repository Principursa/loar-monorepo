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

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Loar-Fullstack
   ```

2. **Install dependencies:**
   ```bash
   # Using Bun (recommended)
   bun install
   
   # Or using npm
   npm install
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

4. **Set up the database:**
   ```bash
   cd apps/server
   # Update database connection in drizzle.config.ts
   bun run db:generate
   bun run db:migrate
   ```

## 🚀 Running the Application

1. **Start the server:**
   ```bash
   cd apps/server
   bun run dev
   ```

2. **Start the web app:**
   ```bash
   cd apps/web
   bun run dev
   ```

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
