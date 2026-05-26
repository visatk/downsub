import { Link } from 'react-router-dom';
import { Home, Search, ArrowRight } from 'lucide-react';
import Layout from '../components/Layout';
import { usePageMeta } from '../hooks/usePageMeta';

export default function NotFound() {
  usePageMeta({
    title: '404 — Page Not Found · SubFetch',
    description: 'The page you are looking for does not exist. Head back to SubFetch to download subtitles from YouTube, Vimeo, and Dailymotion.',
  });

  return (
    <Layout>
      <main
        id="main-content"
        className="flex-1 flex flex-col items-center justify-center text-center px-4 py-24"
        aria-labelledby="not-found-heading"
      >
        {/* Giant 404 */}
        <div
          aria-hidden="true"
          className="text-[140px] sm:text-[200px] font-black leading-none select-none mb-4 anim-slide-up"
          style={{
            fontFamily: 'var(--font-head)',
            opacity: 0,
            background: 'linear-gradient(135deg, rgba(108,99,255,0.2) 0%, rgba(168,85,247,0.1) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-0.04em',
          }}
        >
          404
        </div>

        <span className="badge badge-purple mb-5 anim-slide-up delay-75" style={{ opacity: 0 }}>
          Page Not Found
        </span>

        <h1
          id="not-found-heading"
          className="text-3xl sm:text-4xl font-black text-white mb-4 tracking-tight anim-slide-up delay-150"
          style={{ fontFamily: 'var(--font-head)', opacity: 0 }}
        >
          Oops! This page doesn't exist
        </h1>

        <p
          className="text-base max-w-md mb-10 leading-relaxed anim-slide-up delay-225"
          style={{ color: 'var(--text-muted)', opacity: 0 }}
        >
          The page you're looking for may have been moved, deleted, or never existed. Don't worry — SubFetch is still here to help you download subtitles.
        </p>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3 justify-center anim-slide-up delay-300" style={{ opacity: 0 }}>
          <Link to="/" className="btn-primary px-6 py-3 text-sm" aria-label="Return to homepage">
            <Home className="w-4 h-4" /> Back to Home
          </Link>
          <Link to="/api-docs" className="pill px-5 py-3 text-sm flex items-center gap-2" aria-label="View API docs">
            <Search className="w-4 h-4" /> API Docs
          </Link>
        </div>

        {/* Quick links */}
        <div
          className="mt-14 card p-6 max-w-sm w-full text-left anim-slide-up delay-375"
          style={{ opacity: 0 }}
        >
          <p className="eyebrow mb-4">Quick Links</p>
          <nav aria-label="Quick navigation from 404">
            <ul className="space-y-1">
              {[
                { to: '/', label: 'Subtitle Downloader', desc: 'Download YouTube, Vimeo & Dailymotion captions' },
                { to: '/api-docs', label: 'API Documentation', desc: 'Integrate SubFetch into your app' },
                { to: '/privacy', label: 'Privacy Policy', desc: 'How we handle your data (spoiler: we don\'t)' },
                { to: '/contact', label: 'Contact Us', desc: 'Report a bug or request a feature' },
              ].map(link => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-colors group"
                  >
                    <div>
                      <p className="text-sm font-semibold text-white group-hover:text-[var(--accent)] transition-colors">
                        {link.label}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{link.desc}</p>
                    </div>
                    <ArrowRight
                      className="w-4 h-4 shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      style={{ color: 'var(--accent)' }}
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </Layout>
  );
}
