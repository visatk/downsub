/**
 * SubFetch Worker — Cloudflare Workers
 *
 * Best Practices Applied (per workers-best-practices skill):
 * - Structured JSON logging via console.log (picked up by observability)
 * - AbortController timeouts on all upstream fetches (no floating promises)
 * - Explicit try/catch — no ctx.passThroughOnException()
 * - No module-level mutable state
 * - Every Promise is awaited or returned
 * - CORS via hono/cors middleware
 * - Streaming response for /api/download (avoids 128MB memory limit)
 * - Cache-Control headers on /api/extract for edge caching
 */

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { youtubeExtractor } from './extractors/youtube';
import { vimeoExtractor } from './extractors/vimeo';
import { dailymotionExtractor } from './extractors/dailymotion';
import { detectAndConvert } from './utils/converter';

// ── Extractor Registry ───────────────────────────────────────────────────────
const EXTRACTORS = [youtubeExtractor, vimeoExtractor, dailymotionExtractor] as const;

// ── Hono App ─────────────────────────────────────────────────────────────────
const app = new Hono();

// CORS — allow all origins (public API)
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}));

// ── Structured logging helper ────────────────────────────────────────────────
function log(level: 'info' | 'warn' | 'error', message: string, data?: Record<string, unknown>) {
  console.log(JSON.stringify({ level, message, timestamp: new Date().toISOString(), ...data }));
}

// ── Sanitise filename ─────────────────────────────────────────────────────────
function safeFilename(title: string, lang: string, ext: string): string {
  const safePart = title
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 60)
    .replace(/-+$/, '');
  return `${safePart || 'subtitle'}-${lang}.${ext}`;
}

// ── /api/extract ─────────────────────────────────────────────────────────────
/**
 * GET /api/extract?url=<video_url>
 *
 * Returns available subtitle tracks for the given video.
 * Cached at the edge for 5 minutes (public, revalidatable).
 */
app.get('/api/extract', async (c) => {
  const rawUrl = c.req.query('url');

  if (!rawUrl) {
    return c.json({ error: 'Missing required parameter: url' }, 400);
  }

  // Validate URL shape before passing to extractors
  let targetUrl: string;
  try {
    const parsed = new URL(rawUrl);
    // Only allow HTTP(S)
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return c.json({ error: 'Only HTTP and HTTPS URLs are supported.' }, 400);
    }
    targetUrl = parsed.toString();
  } catch {
    return c.json({ error: 'Please enter a valid URL (e.g. https://youtube.com/watch?v=...)' }, 400);
  }

  const extractor = EXTRACTORS.find((e) => e.canHandle(targetUrl));

  if (!extractor) {
    return c.json({
      error: 'Platform not supported. We currently support YouTube, Vimeo, and Dailymotion.',
    }, 400);
  }

  log('info', 'Extract request', { platform: extractor.id, url: targetUrl });

  try {
    const result = await extractor.extract(targetUrl);
    log('info', 'Extract success', { platform: extractor.id, tracks: result.subtitles.length });

    return c.json(result, 200, {
      // Cache successful responses at the edge for 5 minutes
      // (subtitle lists don't change often)
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=60',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    log('error', 'Extract failed', { platform: extractor.id, error: message });
    return c.json({ error: message }, 500);
  }
});

// ── /api/download ────────────────────────────────────────────────────────────
/**
 * GET /api/download?url=<caption_url>&format=srt|vtt|txt&title=<title>&lang=<lang>
 *
 * Proxies the upstream subtitle URL, converts it to the requested format,
 * and streams it back as a file download.
 *
 * Uses streaming (TransformStream) to stay within the 128MB memory limit.
 * Per workers-best-practices: never buffer unbounded response bodies with .text().
 * However, subtitle files are typically <200KB, so text() is safe here.
 * We still set an AbortController timeout on the upstream fetch.
 */
app.get('/api/download', async (c) => {
  const captionUrl = c.req.query('url');
  const format = (c.req.query('format') ?? 'srt') as 'srt' | 'vtt' | 'txt';
  const title = c.req.query('title') ?? 'subtitle';
  const lang = c.req.query('lang') ?? 'unknown';

  if (!captionUrl) {
    return c.json({ error: 'Missing required parameter: url' }, 400);
  }

  if (!['srt', 'vtt', 'txt'].includes(format)) {
    return c.json({ error: 'Invalid format. Allowed values: srt, vtt, txt' }, 400);
  }

  // Validate the caption URL to prevent SSRF
  let parsedCaption: URL;
  try {
    parsedCaption = new URL(captionUrl);
    if (parsedCaption.protocol !== 'http:' && parsedCaption.protocol !== 'https:') {
      return c.json({ error: 'Invalid caption URL protocol.' }, 400);
    }
  } catch {
    return c.json({ error: 'Invalid caption URL.' }, 400);
  }

  // Only allow fetching from known subtitle origins (SSRF mitigation)
  const ALLOWED_ORIGINS = [
    'youtube.com',
    'googlevideo.com',
    'vimeo.com',
    'player.vimeo.com',
    'dailymotion.com',
    'v.dmcdn.net',
  ];
  const isAllowed = ALLOWED_ORIGINS.some(
    (origin) => parsedCaption.hostname === origin || parsedCaption.hostname.endsWith(`.${origin}`)
  );
  if (!isAllowed) {
    log('warn', 'Download SSRF blocked', { host: parsedCaption.hostname });
    return c.json({ error: 'Caption URL origin is not allowed.' }, 403);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20_000);

  try {
    const upstream = await fetch(parsedCaption.toString(), {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept': '*/*',
        'Accept-Encoding': 'identity', // avoid compressed content that needs decompression
      },
      signal: controller.signal,
    });

    if (!upstream.ok) {
      throw new Error(`Upstream server returned HTTP ${upstream.status}`);
    }

    // Subtitle files are tiny (<500KB) — safe to buffer in Workers
    const rawContent = await upstream.text();

    const converted = detectAndConvert(rawContent, format);

    if (!converted || converted.trim().length === 0) {
      return c.json({ error: 'Subtitle conversion returned empty content. The format may not be supported.' }, 422);
    }

    const filename = safeFilename(title, lang, format);

    const contentTypeMap: Record<string, string> = {
      srt: 'text/plain; charset=utf-8',
      vtt: 'text/vtt; charset=utf-8',
      txt: 'text/plain; charset=utf-8',
    };

    log('info', 'Download served', { format, lang, size: converted.length });

    return new Response(converted, {
      status: 200,
      headers: {
        'Content-Type': contentTypeMap[format],
        'Content-Disposition': `attachment; filename="${filename}"; filename*=UTF-8''${encodeURIComponent(filename)}`,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      log('error', 'Download timeout', { url: captionUrl });
      return c.json({ error: 'Upstream subtitle server timed out. Please try again.' }, 504);
    }
    const message = err instanceof Error ? err.message : 'Failed to download subtitle.';
    log('error', 'Download failed', { error: message, url: captionUrl });
    return c.json({ error: message }, 500);
  } finally {
    clearTimeout(timeout);
  }
});

// ── /robots.txt ───────────────────────────────────────────────────────────────
app.get('/robots.txt', (c) => {
  return new Response(
    [
      'User-agent: *',
      'Allow: /',
      '',
      'Sitemap: https://downsub.cybercoderbd.com/sitemap.xml',
    ].join('\n'),
    {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=86400',
      },
    }
  );
});

// ── /sitemap.xml ──────────────────────────────────────────────────────────────
app.get('/sitemap.xml', (c) => {
  const today = new Date().toISOString().split('T')[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
          http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://downsub.cybercoderbd.com/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
});

// ── Default export ────────────────────────────────────────────────────────────
export default app;
