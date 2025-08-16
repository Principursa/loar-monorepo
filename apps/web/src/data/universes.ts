export interface TimelineNode {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  characters: string[];
  position: { x: number; y: number };
  connections: string[];
}

export interface Timeline {
  id: string;
  name: string;
  description: string;
  nodes: TimelineNode[];
}

export interface Universe {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  timelines: Timeline[];
}

export const universes: Universe[] = [
  {
    id: "cyberpunk-city",
    name: "Cyberpunk City",
    description: "A neon-lit metropolis where technology and humanity collide in the shadows of corporate towers.",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    timelines: [
      {
        id: "main-timeline",
        name: "Main Timeline",
        description: "The primary narrative path through Cyberpunk City",
        nodes: [
          {
            id: "node-1",
            title: "The Neon Awakening",
            description: "Our heroes discover the truth behind the corporate conspiracy in the heart of the city.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["vera-ash", "captain-somnus-blue"],
            position: { x: 100, y: 100 },
            connections: ["node-2", "node-3"]
          },
          {
            id: "node-2",
            title: "Underground Alliance",
            description: "A secret meeting in the city's underground tunnels reveals new allies.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["vera-ash"],
            position: { x: 200, y: 150 },
            connections: ["node-4"]
          },
          {
            id: "node-3",
            title: "Tower Infiltration",
            description: "A daring mission to infiltrate the corporate headquarters.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["captain-somnus-blue"],
            position: { x: 200, y: 50 },
            connections: ["node-4"]
          },
          {
            id: "node-4",
            title: "The Final Confrontation",
            description: "All paths converge for the ultimate showdown with the corporate overlords.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["vera-ash", "captain-somnus-blue"],
            position: { x: 300, y: 100 },
            connections: []
          }
        ]
      },
      {
        id: "alternate-timeline",
        name: "Alternate Timeline",
        description: "What if the heroes chose a different path?",
        nodes: [
          {
            id: "alt-node-1",
            title: "The Peaceful Resolution",
            description: "Instead of fighting, our heroes choose negotiation.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["vera-ash"],
            position: { x: 100, y: 100 },
            connections: ["alt-node-2"]
          },
          {
            id: "alt-node-2",
            title: "New World Order",
            description: "The city transforms under a new cooperative government.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["vera-ash", "captain-somnus-blue"],
            position: { x: 200, y: 100 },
            connections: []
          }
        ]
      }
    ]
  },
  {
    id: "magical-realm",
    name: "Enchanted Realm",
    description: "A mystical world of magic, ancient forests, and mythical creatures.",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    timelines: [
      {
        id: "forest-timeline",
        name: "Forest Quest",
        description: "Journey through the enchanted forests",
        nodes: [
          {
            id: "forest-1",
            title: "The Ancient Grove",
            description: "Discovery of the sacred trees and their guardians.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["waddles-the-wise", "sunny-halo"],
            position: { x: 100, y: 100 },
            connections: ["forest-2"]
          },
          {
            id: "forest-2",
            title: "The Crystal Cave",
            description: "Hidden deep in the forest, a cave of magical crystals holds the key to saving the realm.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["waddles-the-wise", "sunny-halo"],
            position: { x: 200, y: 100 },
            connections: []
          }
        ]
      }
    ]
  },
  {
    id: "space-odyssey",
    name: "Galactic Odyssey",
    description: "An epic journey across the stars, exploring alien worlds and cosmic mysteries.",
    imageUrl: "https://images.unsplash.com/photo-1446776656089-4cfb1b8e5a3e?w=800&h=400&fit=crop",
    timelines: [
      {
        id: "space-main",
        name: "Main Mission",
        description: "The primary space exploration mission",
        nodes: [
          {
            id: "space-1",
            title: "Launch Sequence",
            description: "The crew prepares for their journey to the unknown reaches of space.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["sunny-glare", "sunny-halo"],
            position: { x: 100, y: 100 },
            connections: ["space-2", "space-3"]
          },
          {
            id: "space-2",
            title: "First Contact",
            description: "Encountering an alien civilization for the first time.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["sunny-glare"],
            position: { x: 200, y: 50 },
            connections: ["space-4"]
          },
          {
            id: "space-3",
            title: "Asteroid Mining",
            description: "A dangerous mission to harvest rare minerals from an asteroid field.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["sunny-halo"],
            position: { x: 200, y: 150 },
            connections: ["space-4"]
          },
          {
            id: "space-4",
            title: "The Home Return",
            description: "The crew returns to Earth with new knowledge and alien allies.",
            videoUrl: "https://aggregator.walrus-testnet.walrus.space/v1/blobs/lBt_Ua5p8I56LFOYgG_z8YiLf3IBVvBNRBlO_94giMI",
            characters: ["sunny-glare", "sunny-halo"],
            position: { x: 300, y: 100 },
            connections: []
          }
        ]
      }
    ]
  }
];