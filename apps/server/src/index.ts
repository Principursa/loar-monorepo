import "dotenv/config";
import { trpcServer } from "@hono/trpc-server";
import { createContext } from "./lib/context";
import { appRouter } from "./routers/index";
import { auth } from "./lib/auth";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { imageRouter } from "./routes/image";

const app = new Hono();

app.use(logger());
app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// Add image serving routes
app.route("/images", imageRouter);

// Add Filecoin content serving route
app.get("/api/filecoin/:pieceCid", async (c) => {
  let downloadTimeout: NodeJS.Timeout;
  
  try {
    const pieceCid = c.req.param("pieceCid");
    console.log(`🔽 Serving Filecoin content for PieceCID: ${pieceCid}`);
    
    // Validate PieceCID format
    if (!pieceCid || pieceCid.length < 10) {
      return c.json({ error: "Invalid PieceCID format" }, 400);
    }
    
    // Import synapse service with error handling
    const { synapseService } = await import("./services/synapse");
    const service = await synapseService;
    
    console.log(`🔄 Starting download from Filecoin...`);
    
    // Create download promise with proper cleanup and retry logic
    const downloadPromise = new Promise<Uint8Array>(async (resolve, reject) => {
      try {
        const data = await service.download(pieceCid);
        resolve(data);
      } catch (error) {
        console.error(`🔄 First attempt failed, this might be a problematic PieceCID: ${pieceCid}`);
        console.error(`🔄 Error details:`, error);
        
        // For certain types of errors, we could try alternative methods here
        // For now, just reject with the original error
        reject(error);
      }
    });
    
    // Setup timeout with cleanup
    const timeoutPromise = new Promise<never>((_, reject) => {
      downloadTimeout = setTimeout(() => {
        reject(new Error('Download timeout after 2 minutes'));
      }, 120000); // 2 minutes to match synapse service
    });
    
    // Race between download and timeout
    const data = await Promise.race([downloadPromise, timeoutPromise]);
    
    if (downloadTimeout) {
      clearTimeout(downloadTimeout);
    }
    
    console.log(`✅ Downloaded ${data.length} bytes for PieceCID: ${pieceCid}`);
    
    // Check file size limit (50MB max for HTTP gateway)
    if (data.length > 50 * 1024 * 1024) {
      console.error(`❌ File too large for HTTP serving: ${Math.round(data.length / 1024 / 1024)}MB`);
      return c.json({ error: `File too large: ${Math.round(data.length / 1024 / 1024)}MB (max 50MB for HTTP gateway)` }, 413);
    }
    
    // Log memory usage
    const memUsage = process.memoryUsage();
    console.log(`📊 Memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB heap, ${Math.round(memUsage.rss / 1024 / 1024)}MB RSS`);
    
    // Set appropriate headers for video content
    c.header("Content-Type", "video/mp4");
    c.header("Cache-Control", "public, max-age=31536000");
    c.header("Accept-Ranges", "bytes");
    c.header("Content-Length", data.length.toString());
    
    console.log(`📤 Serving ${data.length} bytes as video/mp4`);
    
    // Force garbage collection if available
    if (global.gc) {
      global.gc();
    }
    
    return c.body(data);
    
  } catch (error) {
    // Cleanup timeout on error
    if (downloadTimeout) {
      clearTimeout(downloadTimeout);
    }
    
    console.error(`❌ Error serving Filecoin content for ${c.req.param("pieceCid")}:`, error);
    
    // Return detailed error information
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ 
      error: "Failed to retrieve content from Filecoin",
      details: errorMessage,
      pieceCid: c.req.param("pieceCid")
    }, 500);
  }
});

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => {
      return createContext({ context });
    },
  })
);



app.get("/", (c) => {
  return c.text("OK");
});

app.get("/health", (c) => {
  return c.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Add process-level error handling to prevent server crashes
process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  console.error('Stack trace:', error.stack);
  
  // Log memory usage during crash
  const memUsage = process.memoryUsage();
  console.error(`💾 Memory at crash: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB heap, ${Math.round(memUsage.rss / 1024 / 1024)}MB RSS`);
  
  // Don't exit the process, just log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Promise Rejection at:', promise);
  console.error('Reason:', reason);
  
  // Log memory usage during rejection
  const memUsage = process.memoryUsage();
  console.error(`💾 Memory at rejection: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB heap, ${Math.round(memUsage.rss / 1024 / 1024)}MB RSS`);
  
  // Don't exit the process, just log the error
});

// Add memory monitoring
setInterval(() => {
  const memUsage = process.memoryUsage();
  if (memUsage.heapUsed > 500 * 1024 * 1024) { // Alert if > 500MB
    console.warn(`⚠️ High memory usage: ${Math.round(memUsage.heapUsed / 1024 / 1024)}MB heap`);
  }
}, 30000); // Check every 30 seconds

const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 Starting server on port ${port}`);
console.log(`🌍 CORS origin: ${process.env.CORS_ORIGIN || "not set"}`);

export default {
  port,
  fetch: app.fetch,
};
