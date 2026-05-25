import { useState } from 'react';

export default function App() {
  const [isJoined, setIsJoined] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans">
      {/* Header */}
      <header className="p-6 flex items-center justify-between max-w-4xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
            T
          </div>
          <div>
            <h1 className="font-bold text-lg">Tech Insights</h1>
            <p className="text-xs text-slate-500">24.5k subscribers</p>
          </div>
        </div>
        <a 
          href="https://t.me/your_channel_link" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold text-sm transition-all"
        >
          Join
        </a>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <section className="text-center mb-16">
          <h2 className="text-4xl font-extrabold mb-4">Deep dives into edge computing</h2>
          <p className="text-lg text-slate-600 max-w-xl mx-auto mb-8">
            Daily updates on Cloudflare Workers, distributed systems, and modern architecture. Join our growing community of engineers.
          </p>
          <button 
            onClick={() => setIsJoined(!isJoined)}
            className={`px-8 py-3 rounded-xl font-bold transition-all ${
              isJoined ? 'bg-green-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {isJoined ? '✓ Joined' : 'Join Channel'}
          </button>
        </section>

        {/* Content Feed Preview */}
        <section className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold mb-6">Latest Discussions</h3>
          <div className="space-y-6">
            {[
              { title: "Optimizing Durable Objects", date: "May 24" },
              { title: "Cold Starts vs. Warm Pools", date: "May 22" },
              { title: "Why Hyperdrive is a game changer", date: "May 20" }
            ].map((post, i) => (
              <div key={i} className="flex justify-between items-center border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                <span className="font-medium text-slate-700">{post.title}</span>
                <span className="text-xs text-slate-400">{post.date}</span>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-12 text-slate-400 text-sm">
        <p>© 2026 Tech Insights Channel. Built on Cloudflare.</p>
      </footer>
    </div>
  );
}
