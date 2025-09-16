import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Play, Sparkles, Video, Shield, Coins, ShoppingBag } from "lucide-react";
import { useCDPOfficial } from "@/lib/useCDPOfficial";
import { CDPAuthButton } from "@/components/cdp-auth-button";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

function HomeComponent() {
  const { isInitialized, error, isAuthenticated, user, walletAddress, hooksReady } = useCDPOfficial();


  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="LOAR Logo" className="h-10 w-10 object-contain" />
            <span className="text-2xl font-bold text-foreground">LOAR</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </a>
            {hooksReady && isAuthenticated ? (
              <div className="flex items-center gap-3">
                {walletAddress && (
                  <div className="px-3 py-1 rounded-md bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-200 text-xs font-mono">
                    ...{walletAddress.slice(-8)}
                  </div>
                )}
                <Button asChild size="sm">
                  <a href="/universes">Universes</a>
                </Button>
                <CDPAuthButton size="sm" />
              </div>
            ) : (
              <CDPAuthButton size="sm" />
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-accent/5">
        <div className="container mx-auto max-w-4xl">
          <Badge variant="secondary" className="mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            AI-Powered Video Generation
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Create Stunning Videos in Minutes
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your ideas into professional videos with LOAR's advanced AI technology. No editing experience
            required – just describe your vision and watch it come to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            {hooksReady && isAuthenticated ? (
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="/universes">
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating
                </a>
              </Button>
            ) : (
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <a href="/universes">
                  <Play className="w-5 h-5 mr-2" />
                  Start Creating
                </a>
              </Button>
            )}
            <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
              <Video className="w-5 h-5 mr-2" />
              Watch Demo
            </Button>
          </div>


          {/* CDP Status Section */}
          {!isInitialized && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                ⚠️ CDP Official SDK is loading... Please wait for initialization.
              </p>
            </div>
          )}

              {/* Authentication Info Section */}
              {isInitialized && !isAuthenticated && (
                <div className="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-blue-800 dark:text-blue-200 text-sm">
                    💡 <strong>Connect Your Wallet:</strong> Use the official Coinbase CDP authentication with support for email and SMS. 
                    Both methods will create an embedded wallet for you automatically.
                  </p>
                  <p className="text-blue-700 dark:text-blue-300 text-xs mt-2">
                    📱 <strong>Note:</strong> SMS authentication requires a US phone number (+1 country code).
                  </p>
                </div>
              )}
          
          {error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-red-800 dark:text-red-200 text-sm">
                ❌ {error}
              </p>
            </div>
          )}

          {hooksReady && isAuthenticated && user && (
            <div className="mb-8 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-green-800 dark:text-green-200 text-sm">
                ✅ <strong>Successfully Authenticated!</strong> Welcome to LOAR!
              </p>
              {walletAddress && (
                <div className="mt-2 p-2 bg-green-100 dark:bg-green-800/30 rounded border">
                  <p className="text-green-800 dark:text-green-200 text-sm font-semibold">
                    🪙 Embedded Wallet Address:
                  </p>
                  <p className="text-green-700 dark:text-green-300 text-xs mt-1 font-mono break-all">
                    {walletAddress}
                  </p>
                  <p className="text-green-600 dark:text-green-400 text-xs mt-1">
                    Last 10 characters: ...{walletAddress.slice(-10)}
                  </p>
                </div>
              )}
              {user.email && (
                <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                  Email: {user.email}
                </p>
              )}
              {user.phoneNumber && (
                <p className="text-green-700 dark:text-green-300 text-xs mt-1">
                  Phone: {user.phoneNumber}
                </p>
              )}
            </div>
          )}

          {/* Demo Video Placeholder */}
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-card rounded-xl border-2 border-border shadow-2xl overflow-hidden">
              <video 
                className="w-full h-full object-cover" 
                controls 
                autoPlay 
                muted 
                loop 
                poster="/loar-video-generation-preview.png"
              >
                <source
                  src="https://aggregator.walrus-testnet.walrus.space/v1/blobs/SfYobs0IsGUYorA898m0k2mQxK4wud5HotOyysKGrs0"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Video Example Section */}
      <section className="py-20 px-4 bg-card/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">See LOAR in Action</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Watch real videos created with LOAR's AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="relative">
              <div className="aspect-video bg-card rounded-xl border-2 border-border shadow-xl overflow-hidden">
                <video 
                  className="w-full h-full object-cover" 
                  controls 
                  autoPlay 
                  muted 
                  loop 
                  poster="/ai-generated-video-example-1.png"
                >
                  <source
                    src="https://aggregator.walrus-testnet.walrus.space/v1/blobs/SfYobs0IsGUYorA898m0k2mQxK4wud5HotOyysKGrs0"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-semibold mb-2">AI Story Video</h3>
                <p className="text-sm text-muted-foreground">Generated from text prompt</p>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-video bg-card rounded-xl border-2 border-border shadow-xl overflow-hidden">
                <video 
                  className="w-full h-full object-cover" 
                  controls 
                  autoPlay 
                  muted 
                  loop 
                  poster="/ai-generated-video-example-2.png"
                >
                  <source
                    src="https://aggregator.walrus-testnet.walrus.space/v1/blobs/a-yeySpQFv6J0IwVNZZ3iCY2mN-vyIyb0A66oFuEiKc"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-semibold mb-2">Product Demo</h3>
                <p className="text-sm text-muted-foreground">Marketing video creation</p>
              </div>
            </div>

            <div className="relative md:col-span-2 lg:col-span-1">
              <div className="aspect-video bg-card rounded-xl border-2 border-border shadow-xl overflow-hidden">
                <video 
                  className="w-full h-full object-cover" 
                  controls 
                  autoPlay 
                  muted 
                  loop 
                  poster="/ai-generated-video-example-3.png"
                >
                  <source
                    src="https://aggregator.walrus-testnet.walrus.space/v1/blobs/Ns8IUy5XjhVJwUQ2Xptiv5ZWX4uIyqovVlWpEJDCX7M"
                    type="video/mp4"
                  />
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="mt-4 text-center">
                <h3 className="font-semibold mb-2">Creative Content</h3>
                <p className="text-sm text-muted-foreground">Social media ready</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Blockchain Video Timeline Workflow</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Create branching narratives with blockchain-verified video content across multiple timeline nodes.
            </p>
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="aspect-[4/3] bg-card rounded-xl border-2 border-border shadow-xl overflow-hidden">
              <img
                src="/workflow-diagram.png"
                alt="LOAR Blockchain Video Timeline Workflow showing 4 connected timeline nodes with video content and blockchain verification"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful Features for Every Creator</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional videos, powered by cutting-edge AI technology and Web3
              innovation.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Censorship Resistant</CardTitle>
                <CardDescription>
                  Your videos are stored on Walrus decentralized storage, ensuring permanent access and resistance to
                  censorship.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                  <Coins className="w-6 h-6 text-accent" />
                </div>
                <CardTitle>Community Governance</CardTitle>
                <CardDescription>
                  Participate in platform decisions through token incentives and earn rewards for contributing to the
                  ecosystem.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-2 hover:border-primary/50 transition-colors">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                  <ShoppingBag className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>Content Ownership</CardTitle>
                <CardDescription>
                  Own your videos as NFTs on OpenSea, enabling true digital ownership and monetization opportunities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

    </div>
  );
}
