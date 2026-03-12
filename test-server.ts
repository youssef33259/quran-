import express from "express";
import { Readable } from "stream";

const app = express();
app.get("/api/download", async (req, res) => {
  const url = "http://j.mp/2b8SiNO";
  const response = await fetch(url);
  res.setHeader('Content-Type', response.headers.get('content-type') || 'audio/mpeg');
  const contentLength = response.headers.get('content-length');
  if (contentLength) res.setHeader('Content-Length', contentLength);
  
  if (response.body) {
    Readable.fromWeb(response.body as any).pipe(res);
  }
});
app.listen(3001, () => console.log("Test server running on 3001"));
