import { useState } from 'react';
import { Download, Search, AlertCircle, FileText, ChevronRight, CheckCircle2 } from 'lucide-react';

interface Subtitle {
  language: string;
  languageCode: string;
  url: string;
  format: string;
}

interface ExtractResponse {
  platform: string;
  title: string;
  subtitles: Subtitle[];
  error?: string;
}

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

      if (!res.ok) throw new Error(result.error || 'Failed to extract subtitles');
      setData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (subtitleUrl: string) => {
    // For MVP, opening the URL directly handles the download/viewing natively
    window.open(subtitleUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans selection:bg-blue-500 selection:text-white">
      <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2 text-2xl font-bold text-blue-600">
            <Download className="w-8 h-8" />
            <span>DownSub Pro</span>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-12 flex flex-col items-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-center tracking-tight mb-6 text-gray-900">
          Universal Subtitle <span className="text-blue-600">Downloader</span>
        </h1>
        
        <p className="text-lg text-gray-500 text-center max-w-2xl mb-8">
          Download subtitles in SRT, VTT, and TXT formats from multiple platforms. Paste your video link below.
        </p>

        <form onSubmit={handleExtract} className="w-full max-w-3xl relative shadow-xl rounded-2xl bg-white p-2 flex flex-col sm:flex-row gap-2 border border-gray-200">
          <div className="relative flex-grow flex items-center">
            <Search className="absolute left-4 w-5 h-5 text-gray-400" />
            <input
              type="url"
              placeholder="Paste YouTube, Vimeo URL here..."
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
            {loading ? <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>Extract <ChevronRight className="w-5 h-5" /></>}
          </button>
        </form>

        <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm font-medium text-gray-500">
          <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> YouTube</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-green-500" /> Vimeo</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-gray-300" /> Dailymotion (Coming Soon)</span>
          <span className="flex items-center gap-1"><CheckCircle2 className="w-4 h-4 text-gray-300" /> Viki (Coming Soon)</span>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 w-full max-w-3xl border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {data && (
          <div className="mt-12 w-full max-w-3xl bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-6 border-b border-gray-100 bg-gray-50 flex items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-100 px-2 py-1 rounded-md mb-2 inline-block">
                  {data.platform}
                </span>
                <h3 className="font-bold text-lg text-gray-900 line-clamp-2">{data.title}</h3>
                <p className="text-sm text-gray-500 mt-1">Found {data.subtitles.length} tracks</p>
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
                      <p className="text-xs text-gray-500 uppercase">{sub.format}</p>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleDownload(sub.url)}
                    className="flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 hover:bg-gray-800 text-white font-medium text-sm rounded-lg transition-colors w-full sm:w-auto"
                  >
                    <FileText className="w-4 h-4" /> Download
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
