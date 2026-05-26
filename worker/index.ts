import { Hono } from 'hono';
import { youtubeExtractor } from './extractors/youtube';
import { vimeoExtractor } from './extractors/vimeo';

// Register all supported platforms here
const supportedExtractors = [
  youtubeExtractor,
  vimeoExtractor
  // Add dailymotionExtractor, vikiExtractor here later
];

const app = new Hono();

app.get('/api/extract', async (c) => {
  const targetUrl = c.req.query('url');
  
  if (!targetUrl) {
    return c.json({ error: 'URL is required' }, 400);
  }

  // Find the correct extractor based on the URL
  const extractor = supportedExtractors.find(e => e.canHandle(targetUrl));
  
  if (!extractor) {
    return c.json({ 
      error: 'Platform not supported yet. We currently support YouTube and Vimeo.' 
    }, 400);
  }

  try {
    const result = await extractor.extract(targetUrl);
    return c.json(result);
  } catch (error: any) {
    console.error(`[${extractor.id}] Extraction error:`, error);
    return c.json({ error: error.message || 'Internal processing error' }, 500);
  }
});

export default app;
