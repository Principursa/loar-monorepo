# Porto Wallet Integration Setup

## Overview

This application now uses [Porto wallet](https://porto.sh/) for blockchain interactions instead of Dynamic Labs. Porto is a modern wallet SDK that provides seamless wallet connectivity without requiring browser extensions, passwords, or seed phrases.

## Getting Started

### 1. HTTPS Requirement

**Important**: Porto requires HTTPS for WebAuthn support. For local development, you need to set up HTTPS.

**Quick Setup:**
```bash
# Use HTTPS for development
bun run dev

# Or use HTTP (limited functionality)
bun run dev:http
```

See [HTTPS_SETUP.md](./HTTPS_SETUP.md) for detailed setup instructions.

### 2. No Installation Required

Porto works without any browser extensions or installations. It's a developer-first solution that integrates seamlessly with wagmi and viem without code changes.

### 3. Features

- **No Extensions Required**: Works without browser extensions or installations
- **Developer-First**: Integrates with wagmi and viem without code changes
- **Modern EIP Support**: Supports latest Ethereum standards
- **Asset Discovery**: View your wallet assets using EIP-7811 standard
- **Multi-Chain Support**: Works with Ethereum and other EVM-compatible chains
- **Programmable**: Supports subscriptions and usage-based pricing

### 3. Usage

1. **Connect Wallet**: Click the "Connect Porto Wallet" button in the header or on the home page
2. **View Assets**: Once connected, you can view your wallet assets
3. **Disconnect**: Use the disconnect button to end the session

### 4. Testing

Visit the home page to see the "Porto Wallet Integration" section where you can:
- Test wallet connection
- View connection status
- Retrieve and display wallet assets
- Experience seamless wallet connectivity

### 5. Development

The integration includes:
- `PortoProvider`: React context for wallet state management
- `PortoWalletButton`: Reusable wallet connection component
- `PortoTest`: Test component for development and debugging

### 6. Error Handling

The application gracefully handles:
- Connection failures
- Network errors
- User rejection of connection requests
- Initialization issues

### 7. Browser Compatibility

Porto wallet works with all modern browsers:
- Chrome
- Firefox
- Safari
- Edge
- Other Chromium-based browsers

## Migration from Dynamic Labs

All Dynamic Labs wallet code has been removed and replaced with Porto wallet integration. The new implementation provides:
- Better error handling
- Cleaner API
- More reliable connection management
- Better user experience

## Support

If you encounter issues:
1. Check that you're using a supported browser
2. Try refreshing the page
3. Check the browser console for detailed error messages
4. Visit the [Porto documentation](https://porto.sh/) for more information
