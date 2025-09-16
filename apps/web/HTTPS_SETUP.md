# HTTPS Setup for Porto Wallet Development

## Overview

Porto wallet requires HTTPS for WebAuthn support, which is necessary for secure wallet operations. This guide shows how to set up HTTPS for local development.

## Option 1: Use Vite's HTTPS Mode

### 1. Update package.json scripts

Add HTTPS support to your development script:

```json
{
  "scripts": {
    "dev": "vite --port=3001 --https",
    "dev:http": "vite --port=3001"
  }
}
```

### 2. Run with HTTPS

```bash
bun run dev
```

This will start the development server with HTTPS on `https://localhost:3001`

### 3. Accept the SSL Certificate

Your browser will show a security warning. Click "Advanced" and "Proceed to localhost (unsafe)" to continue.

## Option 2: Use mkcert for Local SSL Certificates

### 1. Install mkcert

**On Ubuntu/Debian:**
```bash
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/download/v1.4.4/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

**On macOS:**
```bash
brew install mkcert
```

**On Windows:**
```bash
choco install mkcert
```

### 2. Create Local CA

```bash
mkcert -install
```

### 3. Generate Certificates

```bash
mkcert localhost 127.0.0.1 ::1
```

This creates `localhost+2.pem` and `localhost+2-key.pem`

### 4. Update Vite Config

Create or update `vite.config.ts`:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'

export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: fs.readFileSync('localhost+2-key.pem'),
      cert: fs.readFileSync('localhost+2.pem'),
    },
    port: 3001,
  },
})
```

## Option 3: Use ngrok for Public HTTPS

### 1. Install ngrok

```bash
npm install -g ngrok
```

### 2. Start your HTTP server

```bash
bun run dev:http
```

### 3. Create HTTPS tunnel

```bash
ngrok http 3001
```

This will give you a public HTTPS URL like `https://abc123.ngrok.io`

## Option 4: Use Cloudflare Tunnel

### 1. Install cloudflared

```bash
# Download from https://github.com/cloudflare/cloudflared/releases
```

### 2. Create tunnel

```bash
cloudflared tunnel --url http://localhost:3001
```

## Testing Porto Integration

Once you have HTTPS set up:

1. Visit your HTTPS URL
2. Check the browser console - you should see "Porto instance created" without errors
3. Try connecting your wallet
4. Test the asset discovery features

## Troubleshooting

### Common Issues

1. **Certificate Errors**: Make sure to accept the self-signed certificate
2. **Port Conflicts**: Change the port if 3001 is already in use
3. **Firewall Issues**: Ensure your firewall allows HTTPS connections

### Browser-Specific Notes

- **Chrome**: May require `--ignore-certificate-errors` flag for development
- **Firefox**: Go to `about:config` and set `security.tls.insecure_fallback_hosts` to include `localhost`
- **Safari**: May need to manually trust the certificate in Keychain Access

## Production Deployment

For production, ensure your deployment platform provides HTTPS:

- **Vercel**: Automatic HTTPS
- **Netlify**: Automatic HTTPS  
- **AWS**: Use CloudFront or ALB with SSL certificates
- **Docker**: Use reverse proxy like nginx with SSL

## Security Notes

- Never use self-signed certificates in production
- Always use proper SSL certificates from trusted CAs
- Consider using Let's Encrypt for free SSL certificates
- Keep your certificates up to date


