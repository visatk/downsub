import type { Extractor, ExtractorResult } from './base';

// Match all YouTube URL patterns robustly
const YT_ID_REGEX = /(?:youtube\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([0-9A-Za-z_-]{11})/;

// Robust regex to extract ytInitialPlayerResponse from YouTube HTML
// Uses multiple fallback strategies
function extractPlayerResponse(html: string): any {
  const strategies = [
    // Strategy 1: Followed by semicolon + var/let/const
    /ytInitialPlayerResponse\s*=\s*(\{.+?\})\s*;[\s\S]*?(?:var |let |const |\<\/script)/,
    // Strategy 2: Greedy up to known terminator
    /ytInitialPlayerResponse\s*=\s*(\{[\s\S]+?\});\s*(?:var|if|window)/,
    // Strategy 3: Broad match
    /ytInitialPlayerResponse\s*=\s*(\{[\s\S]+?\})\s*;/,
  ];

  for (const pattern of strategies) {
    const match = html.match(pattern);
    if (match?.[1]) {
      try {
        return JSON.parse(match[1]);
      } catch {
        // Try next strategy
      }
    }
  }

  // Strategy 4: Find ytInitialPlayerResponse within a script tag content
  const scriptMatches = html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi);
  for (const scriptMatch of scriptMatches) {
    const scriptContent = scriptMatch[1];
    if (!scriptContent.includes('ytInitialPlayerResponse')) continue;
    const idx = scriptContent.indexOf('ytInitialPlayerResponse');
    if (idx === -1) continue;
    const start = scriptContent.indexOf('{', idx);
    if (start === -1) continue;

    // Bracket-count parse
    let depth = 0;
    let end = -1;
    for (let i = start; i < scriptContent.length; i++) {
      if (scriptContent[i] === '{') depth++;
      else if (scriptContent[i] === '}') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end === -1) continue;
    try {
      return JSON.parse(scriptContent.slice(start, end + 1));
    } catch {
      // Try next script tag
    }
  }

  return null;
}

export const youtubeExtractor: Extractor = {
  id: 'youtube',
  canHandle: (url) => /(?:youtube\.com|youtu\.be)/.test(url),

  extract: async (url): Promise<ExtractorResult> => {
    const videoIdMatch = url.match(YT_ID_REGEX);
    const videoId = videoIdMatch?.[1] ?? null;

    if (!videoId) {
      throw new Error('Invalid YouTube URL — could not find a valid video ID.');
    }

    // Fetch YouTube page with realistic browser headers
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15_000);

    let html: string;
    try {
      const response = await fetch(`https://www.youtube.com/watch?v=${videoId}&hl=en`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
        },
        signal: controller.signal,
      });

      if (response.status === 404) throw new Error('YouTube video not found. Check the URL.');
      if (!response.ok) throw new Error(`YouTube returned HTTP ${response.status}.`);
      html = await response.text();
    } finally {
      clearTimeout(timeout);
    }

    const playerData = extractPlayerResponse(html);

    if (!playerData) {
      throw new Error('Could not extract video data. The video may be private, age-restricted, or unavailable in this region.');
    }

    // Validate playability
    const playabilityStatus = playerData?.playabilityStatus?.status;
    if (playabilityStatus === 'LOGIN_REQUIRED') {
      throw new Error('This video requires login (age-restricted or private). Cannot extract subtitles.');
    }
    if (playabilityStatus === 'UNPLAYABLE') {
      const reason = playerData?.playabilityStatus?.reason || 'Video is unplayable.';
      throw new Error(reason);
    }

    const videoDetails = playerData?.videoDetails;
    const captionRenderer = playerData?.captions?.playerCaptionsTracklistRenderer;
    const tracks: any[] = captionRenderer?.captionTracks ?? [];

    if (tracks.length === 0) {
      throw new Error('No subtitles or closed captions are available for this video. The creator may not have added captions.');
    }

    const thumbnail = videoDetails?.videoId
      ? `https://i.ytimg.com/vi/${videoDetails.videoId}/maxresdefault.jpg`
      : `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;

    const subtitles = tracks.map((track: any) => {
      const isAsr = track.kind === 'asr';
      const langCode: string = track.languageCode ?? 'unknown';
      const langName: string = track.name?.simpleText ?? track.name?.runs?.[0]?.text ?? langCode;
      // baseUrl is the raw timed-text XML URL
      const captionUrl: string = track.baseUrl ?? '';

      return {
        language: isAsr ? `${langName} (Auto-generated)` : langName,
        languageCode: langCode,
        url: captionUrl,
        format: 'xml',
        isAutoGenerated: isAsr,
        name: langName,
      };
    });

    return {
      platform: 'YouTube',
      title: videoDetails?.title ?? 'YouTube Video',
      thumbnail,
      subtitles,
    };
  },
};
