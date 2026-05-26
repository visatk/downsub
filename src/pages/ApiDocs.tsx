import { useState } from 'react';
import { Code2, Zap, Shield, Copy, CheckCircle2, ChevronDown, ExternalLink } from 'lucide-react';
import Layout from '../components/Layout';
import { usePageMeta } from '../hooks/usePageMeta';

const BASE_URL = 'https://downsub.cybercoderbd.com';

function CodeBlock({ code, language = 'json' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };
  return (
    <div className="relative group rounded-xl overflow-hidden border" style={{ borderColor: 'var(--border)', background: 'rgba(6,8,15,0.7)' }}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b" style={{ borderColor: 'var(--border)', background: 'rgba(255,255,255,0.02)' }}>
        <span className="text-xs font-mono font-bold" style={{ color: 'var(--text-muted)' }}>{language}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 text-xs font-medium px-2 py-1 rounded-md transition-all hover:bg-white/5"
          style={{ color: copied ? 'var(--success)' : 'var(--text-muted)' }}
          aria-label="Copy code"
        >
          {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <pre className="p-5 text-sm overflow-x-auto" style={{ color: 'var(--text)', lineHeight: '1.7', fontFamily: 'Consolas, "Cascadia Code", monospace' }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

function Endpoint({
  method, path, desc, params, example, response, idx,
}: {
  method: string; path: string; desc: string;
  params: { name: string; required: boolean; desc: string; type: string }[];
  example: string; response: string; idx: number;
}) {
  const methodColors: Record<string, string> = {
    GET: 'rgba(34,197,94,0.15)', POST: 'rgba(108,99,255,0.15)',
  };
  const methodText: Record<string, string> = {
    GET: '#4ade80', POST: '#a899ff',
  };
  return (
    <div className="card overflow-hidden mb-6 anim-slide-up" style={{ opacity: 0, animationDelay: `${idx * 80}ms` }} id={`endpoint-${idx}`}>
      {/* Endpoint header */}
      <div className="p-5 sm:p-6 border-b flex flex-wrap items-center gap-3" style={{ borderColor: 'var(--border)' }}>
        <span className="px-3 py-1 rounded-lg text-xs font-black font-mono"
          style={{ background: methodColors[method] || 'rgba(108,99,255,0.15)', color: methodText[method] || '#a899ff' }}>
          {method}
        </span>
        <code className="font-mono text-sm font-bold text-white bg-transparent break-all">
          {path}
        </code>
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{desc}</span>
      </div>

      <div className="p-5 sm:p-6 space-y-6">
        {/* Parameters */}
        <div>
          <h4 className="eyebrow mb-3">Parameters</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr>
                  {['Name', 'Type', 'Required', 'Description'].map(h => (
                    <th key={h} className="text-left text-xs pb-2 pr-4 font-bold" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {params.map(p => (
                  <tr key={p.name} className="border-b" style={{ borderColor: 'var(--border)' }}>
                    <td className="py-2.5 pr-4">
                      <code className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(108,99,255,0.12)', color: '#a899ff' }}>{p.name}</code>
                    </td>
                    <td className="py-2.5 pr-4 text-xs font-mono" style={{ color: 'var(--text-muted)' }}>{p.type}</td>
                    <td className="py-2.5 pr-4">
                      <span className={`badge text-[10px] ${p.required ? 'badge-error' : 'badge-auto'}`}>
                        {p.required ? 'required' : 'optional'}
                      </span>
                    </td>
                    <td className="py-2.5 text-xs" style={{ color: 'var(--text-muted)' }}>{p.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Example */}
        <div>
          <h4 className="eyebrow mb-3">Example Request</h4>
          <CodeBlock code={example} language="bash" />
        </div>

        {/* Response */}
        <div>
          <h4 className="eyebrow mb-3">Example Response</h4>
          <CodeBlock code={response} language="json" />
        </div>
      </div>
    </div>
  );
}

function ErrorCard({ code, desc, delay }: { code: number; desc: string; delay: number }) {
  return (
    <div className="card p-4 flex items-center gap-4 anim-slide-up" style={{ opacity: 0, animationDelay: `${delay}ms` }}>
      <span className="font-mono font-black text-lg" style={{ color: code >= 500 ? 'var(--error)' : 'var(--warn)', minWidth: 48 }}>{code}</span>
      <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{desc}</span>
    </div>
  );
}

function TOCLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="text-sm hover:text-white transition-colors block py-0.5" style={{ color: 'var(--text-muted)' }}>
      {label}
    </a>
  );
}

export default function ApiDocs() {
  usePageMeta({
    title: 'API Documentation — SubFetch',
    description: 'SubFetch REST API documentation. Use /api/extract and /api/download to programmatically fetch subtitles from YouTube, Vimeo, and Dailymotion.',
    canonical: 'https://downsub.cybercoderbd.com/api-docs',
  });

  const [tryUrl, setTryUrl] = useState('');
  const [tryResult, setTryResult] = useState('');
  const [tryLoading, setTryLoading] = useState(false);

  const handleTry = async () => {
    if (!tryUrl) return;
    setTryLoading(true);
    setTryResult('');
    try {
      const res = await fetch(`/api/extract?url=${encodeURIComponent(tryUrl)}`);
      const json = await res.json();
      setTryResult(JSON.stringify(json, null, 2));
    } catch {
      setTryResult('{"error": "Request failed"}');
    } finally {
      setTryLoading(false);
    }
  };

  return (
    <Layout>
      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="mb-14 anim-slide-up" style={{ opacity: 0 }}>
          <span className="badge badge-purple mb-4">
            <Code2 className="w-3 h-3" /> REST API
          </span>
          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-head)' }}>
            API Documentation
          </h1>
          <p className="text-base max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            SubFetch exposes a public REST API for extracting and converting subtitles programmatically.
            No API key required for personal/educational use.
          </p>
          <div className="flex flex-wrap gap-3 mt-5">
            <span className="badge badge-purple"><Zap className="w-2.5 h-2.5" /> Free · No key required</span>
            <span className="badge badge-auto"><Shield className="w-2.5 h-2.5" /> CORS enabled</span>
            <span className="badge badge-vimeo">Edge-cached</span>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8 items-start">

          {/* Sticky TOC */}
          <nav aria-label="On-page navigation" className="lg:col-span-1 card p-5 sticky top-24 hidden lg:block">
            <p className="eyebrow mb-4">On this page</p>
            <div className="space-y-1">
              <TOCLink href="#base-url" label="Base URL" />
              <TOCLink href="#authentication" label="Authentication" />
              <TOCLink href="#rate-limits" label="Rate Limits" />
              <TOCLink href="#endpoint-0" label="GET /api/extract" />
              <TOCLink href="#endpoint-1" label="GET /api/download" />
              <TOCLink href="#errors" label="Error Codes" />
              <TOCLink href="#examples" label="Code Examples" />
              <TOCLink href="#try-it" label="Try It Live" />
            </div>
          </nav>

          {/* Main content */}
          <div className="lg:col-span-3 space-y-8">

            {/* Base URL */}
            <section id="base-url" className="card p-6 anim-slide-up" style={{ opacity: 0 }}>
              <h2 className="font-bold text-white text-lg mb-4" style={{ fontFamily: 'var(--font-head)' }}>Base URL</h2>
              <CodeBlock code={BASE_URL} language="url" />
              <p className="text-sm mt-3" style={{ color: 'var(--text-muted)' }}>
                All API endpoints are relative to this base URL. HTTPS only.
              </p>
            </section>

            {/* Auth */}
            <section id="authentication" className="card p-6 anim-slide-up" style={{ opacity: 0, animationDelay: '50ms' }}>
              <h2 className="font-bold text-white text-lg mb-3" style={{ fontFamily: 'var(--font-head)' }}>Authentication</h2>
              <div className="flex items-start gap-3">
                <span className="badge badge-auto shrink-0 mt-0.5">No auth required</span>
                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                  The SubFetch API is publicly accessible with no authentication for personal and educational use. For high-volume or commercial use, please{' '}
                  <a href="/contact" className="hover:text-white transition-colors" style={{ color: 'var(--accent)' }}>contact us</a>.
                </p>
              </div>
            </section>

            {/* Rate limits */}
            <section id="rate-limits" className="card p-6 anim-slide-up" style={{ opacity: 0, animationDelay: '100ms' }}>
              <h2 className="font-bold text-white text-lg mb-4" style={{ fontFamily: 'var(--font-head)' }}>Rate Limits</h2>
              <div className="grid sm:grid-cols-3 gap-4">
                {[
                  { metric: '60 req/min', label: 'Per IP address', color: 'var(--accent)' },
                  { metric: '500 req/day', label: 'Per IP address', color: 'var(--accent-2)' },
                  { metric: '20s timeout', label: 'Per request', color: 'var(--text-muted)' },
                ].map(r => (
                  <div key={r.metric} className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <p className="text-2xl font-black mb-1" style={{ color: r.color, fontFamily: 'var(--font-head)' }}>{r.metric}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{r.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Endpoints */}
            <div>
              <h2 className="font-bold text-white text-xl mb-6" style={{ fontFamily: 'var(--font-head)' }}>Endpoints</h2>

              <Endpoint
                idx={0}
                method="GET"
                path="/api/extract"
                desc="Fetch all available subtitle tracks for a video URL"
                params={[
                  { name: 'url', type: 'string', required: true, desc: 'Full video URL (YouTube, Vimeo, or Dailymotion). Must be URL-encoded.' },
                ]}
                example={`curl "${BASE_URL}/api/extract?url=https%3A//www.youtube.com/watch%3Fv%3DdQw4w9WgXcQ"`}
                response={`{
  "platform": "YouTube",
  "title": "Rick Astley - Never Gonna Give You Up",
  "thumbnail": "https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg",
  "subtitles": [
    {
      "language": "English",
      "languageCode": "en",
      "url": "https://www.youtube.com/api/timedtext?...",
      "format": "xml",
      "isAutoGenerated": false,
      "name": "English"
    },
    {
      "language": "English (Auto-generated)",
      "languageCode": "en",
      "url": "https://www.youtube.com/api/timedtext?kind=asr...",
      "format": "xml",
      "isAutoGenerated": true,
      "name": "English"
    }
  ]
}`}
              />

              <Endpoint
                idx={1}
                method="GET"
                path="/api/download"
                desc="Fetch, convert, and stream a subtitle file for download"
                params={[
                  { name: 'url', type: 'string', required: true, desc: 'Caption URL returned by /api/extract. Must be URL-encoded.' },
                  { name: 'format', type: '"srt" | "vtt" | "txt"', required: false, desc: 'Output format. Defaults to "srt".' },
                  { name: 'title', type: 'string', required: false, desc: 'Video title used to generate the filename. Defaults to "subtitle".' },
                  { name: 'lang', type: 'string', required: false, desc: 'Language code (e.g. "en", "fr") for filename. Defaults to "unknown".' },
                ]}
                example={`curl -O -J "${BASE_URL}/api/download?url=CAPTION_URL&format=srt&title=My+Video&lang=en"`}
                response={`# Returns a binary file stream with headers:
Content-Type: text/plain; charset=utf-8
Content-Disposition: attachment; filename="My-Video-en.srt"
Cache-Control: no-store

1
00:00:01,000 --> 00:00:04,000
Never gonna give you up

2
00:00:04,000 --> 00:00:07,000
Never gonna let you down`}
              />
            </div>

            {/* Errors */}
            <section id="errors">
              <h2 className="font-bold text-white text-xl mb-4" style={{ fontFamily: 'var(--font-head)' }}>Error Codes</h2>
              <div className="space-y-2">
                <ErrorCard code={400} desc="Bad Request — Missing or invalid 'url' parameter, or unsupported platform." delay={0} />
                <ErrorCard code={403} desc="Forbidden — Caption URL origin is not in the allowed origins list (SSRF protection)." delay={50} />
                <ErrorCard code={422} desc="Unprocessable Content — Subtitle conversion returned empty content." delay={100} />
                <ErrorCard code={500} desc="Internal Server Error — Upstream video platform returned an error or video is private/unavailable." delay={150} />
                <ErrorCard code={504} desc="Gateway Timeout — Upstream subtitle server timed out after 20 seconds." delay={200} />
              </div>
              <div className="mt-4">
                <CodeBlock code={`{
  "error": "No subtitles or closed captions are available for this video. The creator may not have added captions."
}`} language="json — error response" />
              </div>
            </section>

            {/* Code examples */}
            <section id="examples">
              <h2 className="font-bold text-white text-xl mb-6" style={{ fontFamily: 'var(--font-head)' }}>Code Examples</h2>

              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <span className="badge badge-youtube">JavaScript / Fetch</span>
                  </h3>
                  <CodeBlock language="javascript" code={`const videoUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';

// 1. Extract subtitle tracks
const res = await fetch(\`/api/extract?url=\${encodeURIComponent(videoUrl)}\`);
const data = await res.json();

if (data.error) throw new Error(data.error);

console.log(\`Found \${data.subtitles.length} tracks for: \${data.title}\`);

// 2. Download the first track as SRT
const sub = data.subtitles[0];
const params = new URLSearchParams({
  url: sub.url,
  format: 'srt',
  title: data.title,
  lang: sub.languageCode,
});

const a = document.createElement('a');
a.href = \`/api/download?\${params}\`;
a.download = '';
document.body.appendChild(a);
a.click();
a.remove();`} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <span className="badge badge-vimeo">Python</span>
                  </h3>
                  <CodeBlock language="python" code={`import requests
from urllib.parse import quote

BASE = "https://downsub.cybercoderbd.com"
VIDEO_URL = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"

# Extract subtitle tracks
response = requests.get(f"{BASE}/api/extract", params={"url": VIDEO_URL})
response.raise_for_status()
data = response.json()

print(f"Title: {data['title']}")
print(f"Tracks: {len(data['subtitles'])}")

# Download first track as TXT
if data["subtitles"]:
    sub = data["subtitles"][0]
    dl = requests.get(f"{BASE}/api/download", params={
        "url": sub["url"],
        "format": "txt",
        "title": data["title"],
        "lang": sub["languageCode"],
    })
    dl.raise_for_status()
    with open("subtitle.txt", "wb") as f:
        f.write(dl.content)
    print("Saved to subtitle.txt")`} />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                    <span className="badge badge-dm">cURL (Shell)</span>
                  </h3>
                  <CodeBlock language="bash" code={`# Extract tracks and save JSON
curl -s "${BASE_URL}/api/extract?url=https%3A//vimeo.com/76979871" | jq .

# Download first caption URL as SRT (requires jq)
CAPTION_URL=$(curl -s "${BASE_URL}/api/extract?url=https%3A//vimeo.com/76979871" \\
  | jq -r '.subtitles[0].url')

curl -o subtitle.srt "${BASE_URL}/api/download?url=$(python3 -c "import urllib.parse; print(urllib.parse.quote('$CAPTION_URL'))")&format=srt"`} />
                </div>
              </div>
            </section>

            {/* Try it live */}
            <section id="try-it" className="card p-6 anim-slide-up" style={{ opacity: 0 }}>
              <h2 className="font-bold text-white text-lg mb-2" style={{ fontFamily: 'var(--font-head)' }}>
                ⚡ Try It Live
              </h2>
              <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>
                Paste a video URL below to test the <code className="px-1 rounded text-xs" style={{ background: 'rgba(108,99,255,0.15)', color: '#a899ff' }}>/api/extract</code> endpoint in real-time.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="input-wrap flex-1 px-4 py-3">
                  <input
                    type="url"
                    className="input-field text-sm"
                    placeholder="https://youtube.com/watch?v=..."
                    value={tryUrl}
                    onChange={e => setTryUrl(e.target.value)}
                    id="api-try-url"
                    aria-label="Video URL to test"
                    onKeyDown={e => e.key === 'Enter' && handleTry()}
                  />
                </div>
                <button
                  onClick={handleTry}
                  disabled={tryLoading || !tryUrl}
                  className="btn-primary px-5 py-3 text-sm shrink-0"
                  aria-label="Send API request"
                >
                  {tryLoading ? (
                    <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full anim-spin" /> Fetching…</>
                  ) : (
                    <><ExternalLink className="w-4 h-4" /> Send Request</>
                  )}
                </button>
              </div>
              {tryResult && (
                <div className="mt-4">
                  <CodeBlock code={tryResult} language="json — live response" />
                </div>
              )}
            </section>

          </div>
        </div>
      </main>
    </Layout>
  );
}
