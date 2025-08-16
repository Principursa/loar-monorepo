import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'

interface Character {
  id: string
  character_name: string
  collection: string
  token_id: string
  traits: Record<string, string>
  rarity_rank: number
  rarity_percentage?: number
  image_url: string
  description: string
  created_at: string
}


function WikiPage() {
  const { data: wikiData, isLoading, error } = useQuery(trpc.wiki.characters.queryOptions())

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Character Wiki</h1>
        <div className="text-center">Loading characters...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Character Wiki</h1>
        <div className="text-center text-red-500">Error loading characters: {error.message}</div>
      </div>
    )
  }

  const characters = wikiData?.characters || []

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Character Wiki</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map((character: Character) => (
          <Link key={character.id} to={`/wiki/character/${character.id}`} className="block">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
              <div className="aspect-square w-full mb-4">
                <img
                  src={character.image_url}
                  alt={character.character_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <CardTitle className="text-xl">{character.character_name}</CardTitle>
              <div className="text-sm text-muted-foreground">
                {character.collection} #{character.token_id}
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-4 line-clamp-3">{character.description}</p>
              
              <div className="space-y-2">
                <h4 className="font-semibold text-sm">Traits:</h4>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(character.traits).map(([trait, value]: [string, string]) => (
                    <Badge key={trait} variant="secondary" className="text-xs">
                      {trait}: {value}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {character.rarity_percentage && (
                <div className="mt-4 text-xs text-muted-foreground">
                  Rarity: {character.rarity_percentage}%
                </div>
              )}
            </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      {characters.length === 0 && (
        <div className="text-center text-muted-foreground">
          No characters found. Generate some characters first!
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/wiki/')({
  component: WikiPage,
})