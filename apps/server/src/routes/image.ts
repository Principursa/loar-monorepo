import { Hono } from 'hono';

const imageRouter = new Hono();

// In-memory storage for generated images (temporary solution)
const imageStore = new Map<string, { data: string; mimeType: string; timestamp: number }>();

// Clean up old images every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 60 * 60 * 1000;
  for (const [key, value] of imageStore.entries()) {
    if (value.timestamp < oneHourAgo) {
      imageStore.delete(key);
    }
  }
}, 60 * 60 * 1000);

// Store a base64 image and return an ID
export function storeImage(base64Data: string, mimeType: string = 'image/png'): string {
  const id = Math.random().toString(36).substring(2, 15);
  imageStore.set(id, {
    data: base64Data,
    mimeType,
    timestamp: Date.now()
  });
  return id;
}

// Serve stored images
imageRouter.get('/temp/:id', (c) => {
  const id = c.req.param('id');
  const image = imageStore.get(id);
  
  if (!image) {
    return c.text('Image not found', 404);
  }
  
  const buffer = Buffer.from(image.data, 'base64');
  
  c.header('Content-Type', image.mimeType);
  c.header('Content-Length', buffer.length.toString());
  c.header('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour
  
  return c.body(buffer);
});

export { imageRouter };