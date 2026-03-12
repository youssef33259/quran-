import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { Readable } from "stream";
import { pipeline } from "stream/promises";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API route to resolve redirects
  app.get("/api/resolve", async (req, res) => {
    const { url } = req.query;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: "URL parameter is required" });
    }
    try {
      const response = await fetch(url, {
        method: 'HEAD',
        redirect: 'follow',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      res.json({ url: response.url });
    } catch (error) {
      console.error("Resolve error:", error);
      res.status(500).json({ error: "Failed to resolve URL" });
    }
  });

  // API route to proxy audio downloads
  app.get("/api/download", async (req, res) => {
    const { url, filename } = req.query;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).send("URL parameter is required");
    }

    try {
      // Use fetch to handle redirects and get the final stream
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
      }

      // Set headers to force download
      res.setHeader('Content-Disposition', `attachment; filename="${filename || 'audio.mp3'}"`);
      res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
      
      const contentLength = response.headers.get('content-length');
      if (contentLength) {
        res.setHeader('Content-Length', contentLength);
      }

      // Pipe the body to the response
      if (response.body) {
        try {
          // @ts-ignore
          await pipeline(Readable.fromWeb(response.body), res);
        } catch (err) {
          console.error("Pipeline error:", err);
          if (!res.headersSent) {
            res.status(500).send("Stream error");
          }
        }
      } else {
        res.status(500).send("No response body");
      }
    } catch (error) {
      console.error("Proxy error:", error);
      res.status(500).send("Failed to proxy download");
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
