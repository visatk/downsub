import { Hono } from 'hono';

type Env = {
  // Add bindings here if needed (e.g., D1, KV)
};

const app = new Hono<{ Bindings: Env }>();

app.get('/api/extract', async (c) => {
  const videoUrl = c.req.query('url');
  
  if (!videoUrl) {
    return c.json({ error: 'YouTube URL is required' }, 400);
  }

  try {
    // Extract Video ID
    const videoIdMatch = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) {
      return c.json({ error: 'Invalid YouTube URL' }, 400);
    }

    // Fetch the YouTube watch page
    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const html = await response.text();

    // Extract ytInitialPlayerResponse using Regex
    const regex = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+meta|<\/script|\n)/;
    const match = html.match(regex);

    if (!match) {
      return c.json({ error: 'Could not extract video data. The video might be private or age-restricted.' }, 500);
    }

    const data = JSON.parse(match[1]);
    const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!tracks || tracks.length === 0) {
      return c.json({ error: 'No subtitles found for this video.' }, 404);
    }

    // Format the tracks
    const subtitles = tracks.map((track: any) => ({
      language: track.name.simpleText,
      languageCode: track.languageCode,
      url: track.baseUrl,
      kind: track.kind || 'standard'
    }));

    return c.json({
      videoId,
      title: data?.videoDetails?.title || 'Unknown Title',
      subtitles
    });

  } catch (error) {
    console.error('Extraction error:', error);
    return c.json({ error: 'Internal server error while processing the request.' }, 500);
  }
});

export default app;
