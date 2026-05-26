import { useState } from 'react';
import { Download, Search, AlertCircle, FileText, ChevronRight } from 'lucide-react';

interface Subtitle {
  language: string;
  languageCode: string;
  url: string;
  kind: string;
}

interface ExtractResponse {
  videoId: string;
  title: string;
  subtitles: Subtitle[];
  error?: string;
}

const YoutubeIcon = ({
  size = undefined,
  color = '#000000',
  strokeWidth = 2,
  background = 'transparent',
  opacity = 1,
  rotation = 0,
  shadow = 0,
  flipHorizontal = false,
  flipVertical = false,
  padding = 0
}) => {
  const transforms = [];
  if (rotation !== 0) transforms.push(`rotate(${rotation}deg)`);
  if (flipHorizontal) transforms.push('scaleX(-1)');
  if (flipVertical) transforms.push('scaleY(-1)');

  const viewBoxSize = 24 + (padding * 2);
  const viewBoxOffset = -padding;
  const viewBox = `${viewBoxOffset} ${viewBoxOffset} ${viewBoxSize} ${viewBoxSize}`;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={viewBox}
      width={size}
      height={size}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        opacity,
        transform: transforms.join(' ') || undefined,
        filter: shadow > 0 ? `drop-shadow(0 ${shadow}px ${shadow * 2}px rgba(0,0,0,0.3))` : undefined,
        backgroundColor: background !== 'transparent' ? background : undefined
      }}
    >
      <g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" {strokeWidth}><path d="M2.5 17a24.1 24.1 0 0 1 0-10a2 2 0 0 1 1.4-1.4a49.6 49.6 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.1 24.1 0 0 1 0 10a2 2 0 0 1-1.4 1.4a49.6 49.6 0 0 1-16.2 0A2 2 0 0 1 2.5 17"/><path d="m10 15l5-3l-5-3z"/></g>
    </svg>
  );
};

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ExtractResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const res = await fetch(`/api/extract?url=${encodeURIComponent(url)}`);
      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || 'Failed to extract subtitles');
      }

      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadFormat = (subtitleUrl: string, format: 'srt' | 'txt') => {
    // YouTube returns XML natively. To get actual SRT/TXT, we modify the URL format parameter
    const finalUrl = `${subtitleUrl}&fmt=${format === 'srt' ? 'vtt' : 'json3'}`; 
    // Note: For a true production app, you might need a backend proxy to convert XML/JSON3 to strict SRT/TXT.
    // For MVP, opening the direct YouTube caption link in a new tab is the fastest approach.
    window.open(finalUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Download className="w-8 h-8" />
            <span>SubFetch</span>
          </div>
          <a href="#" className="text-sm font-medium text-gray-500 hover:text-gray-900">API Documentation</a>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-6 pt-20 pb-12 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-6">
          <YoutubeIcon className="w-4 h-4" /> YouTube Subtitle Downloader
        </div>
        
        <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-6 text-gray-900">
          Download Subtitles in <span className="text-blue-600">Seconds</span>
        </h1>
        
        <p className="text-lg text-gray-500 text-center max-w-2xl mb-10">
          Paste a YouTube video link below to instantly extract and download subtitles in SRT or TXT formats. Free, fast, and no registration required.
        </p>

        {/* Search Box */}
        <form onSubmit={handleExtract} className="w-full max-w-3xl relative shadow-xl rounded-2xl bg-white p-2 flex flex-col sm:flex-row gap-2 border border-gray-200">
          <div className="relative flex-grow flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="w-full pl-12 pr-4 py-4 rounded-xl border-none bg-transparent text-lg focus:ring-0 outline-none placeholder:text-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>Extract <ChevronRight className="w-5 h-5" /></>
            )}
          </button>
        </form>

        {/* Error State */}
        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 w-full max-w-3xl border border-red-100 animate-in fade-in slide-in-from-bottom-4">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {data && (
          <div className="mt-12 w-full max-w-3xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm animate-in fade-in slide-in-from-bottom-4">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-start gap-4">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{data.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Found {data.subtitles.length} subtitle tracks</p>
              </div>
            </div>
            
            <div className="divide-y divide-gray-100">
              {data.subtitles.map((sub, idx) => (
                <div key={idx} className="p-4 sm:px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                      {sub.languageCode.split('-')[0]}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{sub.language}</p>
                      {sub.kind === 'asr' && (
                        <span className="text-xs font-medium text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full mt-1 inline-block">
                          Auto-generated
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button 
                      onClick={() => downloadFormat(sub.url, 'srt')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700 font-medium text-sm rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" /> SRT
                    </button>
                    <button 
                      onClick={() => downloadFormat(sub.url, 'txt')}
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 hover:border-gray-300 hover:bg-gray-100 font-medium text-sm rounded-lg transition-colors"
                    >
                      <FileText className="w-4 h-4" /> TXT
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
