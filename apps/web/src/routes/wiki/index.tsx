import { createFileRoute, Link } from '@tanstack/react-router'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { useState, useMemo, useEffect } from 'react'
import * as React from 'react'
import { Search, Filter, X } from 'lucide-react'

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
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCollection, setSelectedCollection] = useState<string>('all')
  const [selectedTraits, setSelectedTraits] = useState<Set<string>>(new Set())

  const characters = wikiData?.characters || []

  // Get unique collections
  const collections = useMemo(() => {
    const uniqueCollections: string[] = Array.from(new Set(characters.map((char: Character) => char.collection)))
    return uniqueCollections.sort()
  }, [characters])

  // Get traits based on selected collection
  const availableTraits = useMemo(() => {
    const traitSet = new Set<string>()
    const relevantCharacters = selectedCollection === 'all' 
      ? characters 
      : characters.filter((char: Character) => char.collection === selectedCollection)
    
    relevantCharacters.forEach((character: Character) => {
      Object.entries(character.traits).forEach(([trait, value]) => {
        traitSet.add(`${trait}: ${value}`)
      })
    })
    return Array.from(traitSet).sort()
  }, [characters, selectedCollection])

  // Clear trait filters when collection changes
  React.useEffect(() => {
    if (selectedCollection !== 'all') {
      // Only keep traits that are still available in the new collection
      const validTraits = new Set(Array.from(selectedTraits).filter(trait => 
        availableTraits.includes(trait)
      ))
      if (validTraits.size !== selectedTraits.size) {
        setSelectedTraits(validTraits)
      }
    }
  }, [selectedCollection, availableTraits, selectedTraits])

  // Filter characters based on search query, collection, and traits
  const filteredCharacters = useMemo(() => {
    let filtered = characters

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim()
      filtered = filtered.filter((character: Character) => 
        character.character_name.toLowerCase().includes(query) ||
        character.collection.toLowerCase().includes(query)
      )
    }

    // Apply collection filter
    if (selectedCollection !== 'all') {
      filtered = filtered.filter((character: Character) => 
        character.collection === selectedCollection
      )
    }

    // Apply trait filters
    if (selectedTraits.size > 0) {
      filtered = filtered.filter((character: Character) => {
        const characterTraits = Object.entries(character.traits).map(([trait, value]) => `${trait}: ${value}`)
        return Array.from(selectedTraits).some(selectedTrait => 
          characterTraits.includes(selectedTrait)
        )
      })
    }

    return filtered
  }, [characters, searchQuery, selectedCollection, selectedTraits])

  const clearAllFilters = () => {
    setSearchQuery('')
    setSelectedCollection('all')
    setSelectedTraits(new Set())
  }

  const hasActiveFilters = searchQuery.trim() || selectedCollection !== 'all' || selectedTraits.size > 0

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

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Character Wiki</h1>
      
      {/* Search and Filter Section */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by character name or collection..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          {/* Collection Filter */}
          <div className="min-w-[200px]">
            <Select value={selectedCollection} onValueChange={setSelectedCollection}>
              <SelectTrigger>
                <SelectValue placeholder="All Collections" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Collections</SelectItem>
                {collections.map((collection) => (
                  <SelectItem key={collection} value={collection}>
                    {collection}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Trait Filter - Only show when a specific collection is selected */}
          {selectedCollection !== 'all' && (
            <div className="min-w-[200px] max-w-[300px]">
              <details className="relative">
                <summary className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm cursor-pointer hover:bg-accent">
                  <span>
                    {selectedTraits.size > 0 
                      ? `${selectedTraits.size} trait${selectedTraits.size !== 1 ? 's' : ''} selected`
                      : `Filter ${selectedCollection} traits`
                    }
                  </span>
                  <Filter className="h-4 w-4 opacity-50" />
                </summary>
                
                <div className="absolute top-12 left-0 right-0 z-50 max-h-60 overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md">
                  <div className="p-2 space-y-1">
                    {availableTraits.length === 0 ? (
                      <div className="p-2 text-sm text-muted-foreground">
                        No traits available for {selectedCollection}
                      </div>
                    ) : (
                      <>
                        {availableTraits.slice(0, 15).map((trait) => (
                          <label 
                            key={trait} 
                            className="flex items-center gap-2 p-2 hover:bg-accent rounded-sm cursor-pointer text-sm"
                          >
                            <input
                              type="checkbox"
                              checked={selectedTraits.has(trait)}
                              onChange={(e) => {
                                const newTraits = new Set(selectedTraits)
                                if (e.target.checked) {
                                  newTraits.add(trait)
                                } else {
                                  newTraits.delete(trait)
                                }
                                setSelectedTraits(newTraits)
                              }}
                              className="h-3 w-3"
                            />
                            <span className="truncate">{trait}</span>
                          </label>
                        ))}
                        {availableTraits.length > 15 && (
                          <div className="p-2 text-xs text-muted-foreground border-t">
                            Showing first 15 of {availableTraits.length} traits for {selectedCollection}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </details>
            </div>
          )}

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={clearAllFilters}
              className="flex items-center gap-2"
            >
              <X className="h-3 w-3" />
              Clear All
            </Button>
          )}
        </div>
        
        {/* Results Summary */}
        <div className="text-sm text-muted-foreground">
          Showing {filteredCharacters.length} of {characters.length} character{characters.length !== 1 ? 's' : ''}
          {hasActiveFilters && (
            <>
              {searchQuery.trim() && ` matching "${searchQuery}"`}
              {selectedCollection !== 'all' && ` from ${selectedCollection}`}
              {selectedTraits.size > 0 && ` with selected traits`}
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCharacters.map((character: Character) => (
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
      
      {characters.length > 0 && filteredCharacters.length === 0 && searchQuery.trim() && (
        <div className="text-center text-muted-foreground">
          <div className="mb-2">No characters match your search.</div>
          <div className="text-sm">Try searching for a different character name or collection.</div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/wiki/')({
  component: WikiPage,
})