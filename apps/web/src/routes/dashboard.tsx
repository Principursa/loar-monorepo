// import { useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Copy, ExternalLink, Play, Users, Calendar, Plus, Wand2 } from "lucide-react";
import { trpcClient } from '@/utils/trpc';
import { useQuery } from '@tanstack/react-query';
import { GenerativeMedia } from "@/components/GenerativeMedia";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
});

function RouteComponent() {
  // const { user, isConnecting, handleConnect } = useDynamicContext();
  const user = null;
  const isConnecting = false;
  const handleConnect = () => {};
  const navigate = Route.useNavigate();

  // Dummy data for testing
  const dummyUniverses = [
    {
      id: 'cyberpunk-2077',
      name: 'Cyberpunk 2077',
      description: 'A dystopian future where technology and humanity collide in Night City',
      createdAt: '2024-01-15',
      creator: '0x1234...5678',
      address: '0xabcd...ef01'
    },
    {
      id: 'space-odyssey',
      name: 'Space Odyssey',
      description: 'An epic journey through the cosmos exploring alien civilizations',
      createdAt: '2024-02-10', 
      creator: '0x2345...6789',
      address: '0xbcde...f012'
    },
    {
      id: 'medieval-kingdoms',
      name: 'Medieval Kingdoms',
      description: 'Knights, dragons, and magic in a fantasy realm of endless adventures',
      createdAt: '2024-03-05',
      creator: '0x3456...789a',
      address: '0xcdef...0123'
    },
    {
      id: 'detective-noir',
      name: 'Detective Noir',
      description: 'Dark mysteries in 1940s Los Angeles with corruption and crime',
      createdAt: '2024-01-20',
      creator: '0x4567...89ab',
      address: '0xdef0...1234'
    },
    {
      id: 'zombie-apocalypse',
      name: 'Zombie Apocalypse',
      description: 'Survival horror in a world overrun by the undead',
      createdAt: '2024-02-28',
      creator: '0x5678...9abc',
      address: '0xef01...2345'
    },
    {
      id: 'blockchain-universe',
      name: 'Blockchain Universe',
      description: 'A decentralized narrative universe powered by smart contracts',
      createdAt: '2024-01-01',
      creator: '0x0000...0000',
      address: null,
      isDefault: true
    }
  ];

  // Use dummy data instead of API call for testing
  const universesData = { data: dummyUniverses };
  const isLoading = false;

  // Fetch all universes for the selection page (commented out for testing)
  // const { data: universesData, isLoading } = useQuery({
  //   queryKey: ['universes'],
  //   queryFn: () => trpcClient.cinematicUniverses.list.query({}),
  //   enabled: !!user,
  // });

  useEffect(() => {
    if (!user && !isConnecting) {
      navigate({
        to: "/",
      });
    }
  }, [user, isConnecting, navigate]);

  const selectUniverse = (universeId: string) => {
    navigate({
      to: "/universe/$id",
      params: { id: universeId },
    });
  };

  const createNewUniverse = () => {
    navigate({
      to: "/cinematicUniverseCreate",
    });
  };

  if (isConnecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Connecting wallet...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Your Wallet</CardTitle>
            <CardDescription>
              Connect your wallet to access the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={handleConnect} className="w-full">
              <Wallet className="mr-2 h-4 w-4" />
              Connect Wallet
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading universes...</p>
        </div>
      </div>
    );
  }

  const universes = universesData?.data || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">LOAR Dashboard</h1>
              <p className="text-muted-foreground">Select a narrative universe to explore</p>
            </div>
            <Button onClick={createNewUniverse} className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create Universe
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Featured Universe Section */}
        {universes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-xl font-semibold mb-6">Featured Universe</h2>
            <div className="relative">
              <Card 
                className="cursor-pointer hover:shadow-lg transition-all duration-300 overflow-hidden h-64 bg-gradient-to-r from-blue-600 to-purple-600"
                onClick={() => selectUniverse(universes[0].id)}
              >
                <CardContent className="p-0 h-full relative">
                  <div className="absolute inset-0 bg-black/40" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2">{universes[0].name}</h3>
                    <p className="text-sm opacity-90 mb-4">
                      {universes[0].description || "A captivating narrative universe awaits"}
                    </p>
                    <Button 
                      variant="secondary" 
                      className="flex items-center gap-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        selectUniverse(universes[0].id);
                      }}
                    >
                      <Play className="h-4 w-4" />
                      Enter Timeline
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </section>
        )}

        {/* AI Media Generation Section */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Wand2 className="h-5 w-5" />
            <h2 className="text-xl font-semibold">AI Media Generation</h2>
          </div>
          <GenerativeMedia />
        </section>

        {/* All Universes Grid */}
        <section>
          <h2 className="text-xl font-semibold mb-6">Your Universes</h2>
          {universes.length === 0 ? (
            <div className="text-center py-12">
              <div className="mb-4">
                <Users className="h-12 w-12 mx-auto text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No universes yet</h3>
              <p className="text-muted-foreground mb-4">Create your first narrative universe to get started</p>
              <Button onClick={createNewUniverse} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Universe
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {universes.map((universe: any) => (
                <Card 
                  key={universe.id}
                  className="cursor-pointer hover:shadow-lg transition-all duration-300 group overflow-hidden"
                  onClick={() => selectUniverse(universe.id)}
                >
                  <CardContent className="p-0">
                    {/* Universe Thumbnail/Header */}
                    <div className="h-32 bg-gradient-to-br from-indigo-500 to-purple-600 relative">
                      <div className="absolute inset-0 bg-black/20" />
                      <div className="absolute top-2 right-2">
                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                          <Calendar className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="absolute bottom-2 left-2">
                        <div className="text-white text-xs bg-black/40 px-2 py-1 rounded">
                          Active Timeline
                        </div>
                      </div>
                    </div>
                    
                    {/* Universe Info */}
                    <div className="p-4">
                      <h3 className="font-semibold truncate group-hover:text-primary transition-colors">
                        {universe.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {universe.description || "Explore this narrative universe"}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-xs text-muted-foreground">
                          Created {new Date(universe.createdAt).toLocaleDateString()}
                        </span>
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            selectUniverse(universe.id);
                          }}
                        >
                          <Play className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
