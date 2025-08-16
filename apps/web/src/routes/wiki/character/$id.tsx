import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'

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

function CharacterPage() {
  const { id } = Route.useParams()
  const { data: character, isLoading, error } = useQuery(
    trpc.wiki.character.queryOptions({ id: id })
  )

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading character...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Link to="/wiki">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wiki
          </Button>
        </Link>
        <div className="text-center text-red-500">Error loading character: {error.message}</div>
      </div>
    )
  }

  if (!character) {
    return (
      <div className="container mx-auto p-6">
        <Link to="/wiki">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Wiki
          </Button>
        </Link>
        <div className="text-center text-muted-foreground">Character not found</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Link to="/wiki">
        <Button variant="outline" className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Wiki
        </Button>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Character Image */}
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="aspect-square w-full">
                <img
                  src={character.image_url}
                  alt={character.character_name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
            </CardContent>
          </Card>

          {/* Collection Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Collection Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div>
                  <span className="font-semibold">Collection:</span> {character.collection}
                </div>
                <div>
                  <span className="font-semibold">Token ID:</span> #{character.token_id}
                </div>
                {character.rarity_percentage && (
                  <div>
                    <span className="font-semibold">Rarity:</span> {character.rarity_percentage}%
                  </div>
                )}
                <div>
                  <span className="font-semibold">Created:</span> {new Date(character.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Character Details */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{character.character_name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">{character.description}</p>
            </CardContent>
          </Card>

          {/* Traits */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traits</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {Object.entries(character.traits).map(([trait, value]: [string, string]) => (
                  <div key={trait} className="flex justify-between items-center p-3 bg-secondary rounded-lg">
                    <span className="font-medium text-sm">{trait}</span>
                    <Badge variant="outline" className="text-xs">
                      {value}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/wiki/character/$id')({
  component: CharacterPage,
})