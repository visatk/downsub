import { Extractor, ExtractorResult } from './base';

export const youtubeExtractor: Extractor = {
  id: 'youtube',
  canHandle: (url) => /(?:youtube\.com|youtu\.be)/.test(url),
  
  extract: async (url): Promise<ExtractorResult> => {
    const videoIdMatch = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11}).*/);
    const videoId = videoIdMatch ? videoIdMatch[1] : null;

    if (!videoId) throw new Error('Invalid YouTube URL');

    const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const html = await response.text();
    const regex = /ytInitialPlayerResponse\s*=\s*({.+?})\s*;\s*(?:var\s+meta|<\/script|\n)/;
    const match = html.match(regex);

    if (!match) throw new Error('Could not extract video data. Might be private.');

    const data = JSON.parse(match[1]);
    const tracks = data?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

    if (!tracks || tracks.length === 0) {
      throw new Error('No subtitles found for this YouTube video.');
    }

    const subtitles = tracks.map((track: any) => ({
      language: track.name.simpleText,
      languageCode: track.languageCode,
      url: track.baseUrl,
      format: track.kind === 'asr' ? 'json3 (Auto)' : 'vtt'
    }));

    return {
      platform: 'YouTube',
      title: data?.videoDetails?.title || 'Unknown Title',
      subtitles
    };
  }
};
