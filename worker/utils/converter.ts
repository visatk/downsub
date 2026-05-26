/**
 * Subtitle Format Converters
 *
 * Converts between YouTube XML timed-text, JSON3, VTT, and SRT formats.
 * All functions are pure and synchronous — safe for use in a Worker.
 */

interface Caption {
  startMs: number;
  endMs: number;
  text: string;
}

// ── Timestamp Utilities ─────────────────────────────────────────────────────

function padded(n: number, digits = 2): string {
  return String(n).padStart(digits, '0');
}

/** Format milliseconds as SRT timestamp: HH:MM:SS,mmm */
function msToSrtTs(ms: number): string {
  const h = Math.floor(ms / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  const s = Math.floor((ms % 60_000) / 1_000);
  const mil = ms % 1_000;
  return `${padded(h)}:${padded(m)}:${padded(s)},${padded(mil, 3)}`;
}

/** Format milliseconds as VTT timestamp: HH:MM:SS.mmm */
function msToVttTs(ms: number): string {
  return msToSrtTs(ms).replace(',', '.');
}

/** Parse SRT/VTT timestamp to milliseconds */
function tsToMs(ts: string): number {
  // Normalise separator
  const normalised = ts.trim().replace(',', '.');
  const parts = normalised.split(':');
  if (parts.length === 3) {
    const h = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const [sec, ms] = parts[2].split('.').map(Number);
    return h * 3_600_000 + m * 60_000 + (sec || 0) * 1_000 + (ms || 0);
  }
  if (parts.length === 2) {
    const m = parseInt(parts[0], 10);
    const [sec, ms] = parts[1].split('.').map(Number);
    return m * 60_000 + (sec || 0) * 1_000 + (ms || 0);
  }
  return 0;
}

// ── HTML Entity Decoder ─────────────────────────────────────────────────────

function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code, 10)))
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCharCode(parseInt(hex, 16)));
}

/** Strip XML/HTML tags and decode entities */
function cleanXmlText(raw: string): string {
  return decodeEntities(raw.replace(/<[^>]*>/g, '').replace(/\n/g, ' ')).trim();
}

// ── Parsers ─────────────────────────────────────────────────────────────────

/**
 * Parse YouTube XML timed-text format.
 * Example: <text start="1.23" dur="2.0">Hello &amp; world</text>
 */
function parseYouTubeXml(xml: string): Caption[] {
  const captions: Caption[] = [];
  // Use a simple regex — Workers have no DOMParser
  const re = /<text\s+start="([\d.]+)"\s+dur="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) !== null) {
    const startMs = Math.round(parseFloat(m[1]) * 1_000);
    const durMs = Math.round(parseFloat(m[2]) * 1_000);
    const text = cleanXmlText(m[3]);
    if (text) captions.push({ startMs, endMs: startMs + durMs, text });
  }
  // Some YouTube formats have start but no dur — handle gracefully
  if (captions.length === 0) {
    // Try without dur attribute
    const re2 = /<text\s+start="([\d.]+)"[^>]*>([\s\S]*?)<\/text>/g;
    while ((m = re2.exec(xml)) !== null) {
      const startMs = Math.round(parseFloat(m[1]) * 1_000);
      const text = cleanXmlText(m[2]);
      if (text) captions.push({ startMs, endMs: startMs + 3_000, text });
    }
  }
  return captions;
}

/**
 * Parse YouTube JSON3 format.
 * Structure: { events: [{ tStartMs, dDurationMs, segs: [{ utf8 }] }] }
 */
function parseJson3(raw: string): Caption[] {
  let data: any;
  try {
    data = JSON.parse(raw);
  } catch {
    return [];
  }

  const events: any[] = data?.events ?? [];
  return events
    .filter((e: any) => e.segs?.length)
    .map((e: any) => {
      const text = (e.segs as any[])
        .map((s: any) => s.utf8 ?? '')
        .join('')
        .replace(/\n/g, ' ')
        .trim();
      const startMs: number = e.tStartMs ?? 0;
      const durMs: number = e.dDurationMs ?? 3_000;
      return { startMs, endMs: startMs + durMs, text };
    })
    .filter((c) => c.text && c.text !== '\n');
}

/**
 * Parse WebVTT format.
 */
function parseVtt(vtt: string): Caption[] {
  const captions: Caption[] = [];
  // Split into cue blocks (separated by blank lines)
  const blocks = vtt.split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    // Find the line with --> (timestamp line)
    const tsLine = lines.find((l) => l.includes('-->'));
    if (!tsLine) continue;
    const [startStr, endStr] = tsLine.split('-->').map((s) => s.split(/\s/)[0].trim());
    const startMs = tsToMs(startStr);
    const endMs = tsToMs(endStr);
    // Text is everything after the timestamp line, strip VTT tags
    const textLines = lines.slice(lines.indexOf(tsLine) + 1);
    const text = textLines
      .map((l) => l.replace(/<[^>]*>/g, '').trim())
      .filter(Boolean)
      .join(' ');
    if (text) captions.push({ startMs, endMs, text });
  }
  return captions;
}

// ── Detect format ────────────────────────────────────────────────────────────

type RawFormat = 'xml' | 'json3' | 'vtt' | 'srt' | 'unknown';

function detectFormat(content: string): RawFormat {
  const trimmed = content.trimStart();
  if (trimmed.startsWith('WEBVTT')) return 'vtt';
  if (trimmed.startsWith('{') && trimmed.includes('"events"')) return 'json3';
  if (trimmed.includes('<text ') && (trimmed.includes('start="') || trimmed.includes('<transcript'))) return 'xml';
  // SRT: first line is a number, second has -->
  if (/^\d+\r?\n\d{2}:\d{2}:\d{2}[,.]/.test(trimmed)) return 'srt';
  return 'unknown';
}

function parseSrt(srt: string): Caption[] {
  const captions: Caption[] = [];
  const blocks = srt.split(/\n{2,}/);
  for (const block of blocks) {
    const lines = block.trim().split('\n');
    if (lines.length < 2) continue;
    const tsLine = lines.find((l) => l.includes('-->'));
    if (!tsLine) continue;
    const [startStr, endStr] = tsLine.split('-->').map((s) => s.trim());
    const text = lines.slice(lines.indexOf(tsLine) + 1).join(' ').trim();
    if (text) captions.push({ startMs: tsToMs(startStr), endMs: tsToMs(endStr), text });
  }
  return captions;
}

function parseCaptions(content: string): Caption[] {
  const fmt = detectFormat(content);
  switch (fmt) {
    case 'xml': return parseYouTubeXml(content);
    case 'json3': return parseJson3(content);
    case 'vtt': return parseVtt(content);
    case 'srt': return parseSrt(content);
    default: {
      // Last-resort: try xml
      const byXml = parseYouTubeXml(content);
      if (byXml.length > 0) return byXml;
      const byJson = parseJson3(content);
      if (byJson.length > 0) return byJson;
      return [];
    }
  }
}

// ── Serialisers ──────────────────────────────────────────────────────────────

export function convertToSRT(content: string): string {
  const captions = parseCaptions(content);
  if (captions.length === 0) return '';
  return captions
    .map((c, i) => `${i + 1}\n${msToSrtTs(c.startMs)} --> ${msToSrtTs(c.endMs)}\n${c.text}`)
    .join('\n\n') + '\n';
}

export function convertToVTT(content: string): string {
  const captions = parseCaptions(content);
  if (captions.length === 0) return 'WEBVTT\n';
  const cues = captions
    .map((c, i) => `${i + 1}\n${msToVttTs(c.startMs)} --> ${msToVttTs(c.endMs)}\n${c.text}`)
    .join('\n\n');
  return `WEBVTT\n\n${cues}\n`;
}

export function convertToTXT(content: string): string {
  const captions = parseCaptions(content);
  return captions.map((c) => c.text).join('\n');
}

/**
 * Main entry: detect format and convert to target.
 * If already in target format and no conversion needed, returns content as-is.
 */
export function detectAndConvert(content: string, format: 'srt' | 'vtt' | 'txt'): string {
  // Pass-through optimisation: already VTT and requesting VTT
  if (format === 'vtt' && detectFormat(content) === 'vtt') return content;

  switch (format) {
    case 'srt': return convertToSRT(content);
    case 'vtt': return convertToVTT(content);
    case 'txt': return convertToTXT(content);
  }
}
