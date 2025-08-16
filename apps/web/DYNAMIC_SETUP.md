# Dynamic Wallet Authentication Setup

## Getting Started

1. **Get your Dynamic Environment ID:**
   - Go to [Dynamic Dashboard](https://app.dynamic.xyz/)
   - Create a new project or use an existing one
   - Copy your Environment ID

2. **Set up environment variables:**
   Create a `.env` file in the `apps/web` directory with:
   ```
   VITE_DYNAMIC_ENVIRONMENT_ID=your_environment_id_here
   VITE_SERVER_URL=http://localhost:3000
   ```

3. **Install dependencies:**
   ```bash
   cd apps/web
   bun install
   ```

4. **Start the development server:**
   ```bash
   bun run dev
   ```

## Features

- 🔗 Connect with MetaMask, WalletConnect, and other popular wallets
- 🎨 Embedded wallet support (MPC)
- 🔐 Smart Account (AA) support
- 🌐 Multi-chain support
- 📱 Mobile wallet support

## Configuration

The Dynamic configuration is in `src/lib/dynamic.ts`. You can customize:
- Wallet connectors
- Event callbacks
- UI themes
- Chain configurations

## Usage

The wallet connect button is automatically available in the header. Users can:
- Connect their existing wallets
- Create embedded wallets
- Switch between different chains
- View their wallet address and balance

## Next Steps

1. Replace `REPLACE_WITH_YOUR_ENVIRONMENT_ID` in `src/lib/dynamic.ts` with your actual Environment ID
2. Customize the UI and branding in the Dynamic dashboard
3. Add additional wallet connectors as needed
4. Implement server-side verification if required

