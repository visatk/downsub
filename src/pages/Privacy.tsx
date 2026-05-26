import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Database, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import { usePageMeta } from '../hooks/usePageMeta';

const LAST_UPDATED = 'May 26, 2026';
const EFFECTIVE_DATE = 'May 26, 2026';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12" aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="text-xl sm:text-2xl font-bold text-white mb-4 flex items-center gap-2"
        style={{ fontFamily: 'var(--font-head)' }}
      >
        {title}
      </h2>
      <div className="space-y-4 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
        {children}
      </div>
    </section>
  );
}

function Highlight({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="card p-5 flex gap-4 items-start anim-slide-up" style={{ opacity: 0 }}>
      <div className="btn-primary w-10 h-10 shrink-0" style={{ borderRadius: 'var(--r-sm)', padding: 0 }}>
        {icon}
      </div>
      <div>
        <p className="font-bold text-white text-sm mb-1">{title}</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>{desc}</p>
      </div>
    </div>
  );
}

export default function Privacy() {
  usePageMeta({
    title: 'Privacy Policy — SubFetch',
    description: 'Read SubFetch\'s privacy policy. We do not collect personal data, never store video URLs, and run stateless on Cloudflare Workers.',
    canonical: 'https://downsub.cybercoderbd.com/privacy',
  });

  return (
    <Layout>
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="text-center mb-14 anim-slide-up" style={{ opacity: 0 }}>
          <span className="badge badge-purple mb-4">
            <Shield className="w-3 h-3" /> Privacy First
          </span>
          <h1
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: <time dateTime="2026-05-26">{LAST_UPDATED}</time>
            &nbsp;· Effective: <time dateTime="2026-05-26">{EFFECTIVE_DATE}</time>
          </p>
        </div>

        {/* TL;DR summary cards */}
        <div className="grid sm:grid-cols-2 gap-4 mb-14">
          <Highlight icon={<Eye className="w-5 h-5" />} title="We don't track you" desc="No analytics, no cookies, no fingerprinting. Your browsing is completely private." />
          <Highlight icon={<Database className="w-5 h-5" />} title="Zero data stored" desc="Video URLs you paste are never saved to any database or log file." />
          <Highlight icon={<Lock className="w-5 h-5" />} title="Stateless by design" desc="Each subtitle request is independent. Nothing is persisted between requests." />
          <Highlight icon={<Shield className="w-5 h-5" />} title="Cloudflare edge" desc="Requests route through Cloudflare's global network — never to our own servers." />
        </div>

        <div className="card p-8 sm:p-10">

          <Section id="overview" title="1. Overview">
            <p>
              SubFetch (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is a free subtitle extraction service available at{' '}
              <a href="https://downsub.cybercoderbd.com" className="hover:text-white transition-colors" style={{ color: 'var(--accent)' }}>
                downsub.cybercoderbd.com
              </a>. This Privacy Policy describes how we handle (and in most cases, do not handle) information when you use our service.
            </p>
            <p>
              <strong className="text-white">Short version:</strong> We are a stateless edge application. We do not collect, store, sell, or share any personal information. Your use of SubFetch is private.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="data-we-collect" title="2. Information We Do NOT Collect">
            <p>SubFetch does <strong className="text-white">not</strong> collect or store:</p>
            <ul className="space-y-2 list-none">
              {[
                'Your name, email address, or any personal identifiers',
                'The video URLs you paste into the tool',
                'Your IP address (beyond standard Cloudflare network routing, which is discarded immediately)',
                'Browser cookies or local storage data on our servers',
                'Subtitle content downloaded through our service',
                'Search history or recent searches (stored only in your browser\'s localStorage)',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="how-it-works" title="3. How The Service Works">
            <p>
              When you paste a video URL and click &quot;Extract&quot;:
            </p>
            <ol className="space-y-3 list-none">
              {[
                'Your browser sends a request directly to our Cloudflare Worker — no intermediary servers.',
                'The Worker fetches subtitle metadata from the video platform (YouTube, Vimeo, Dailymotion) on your behalf.',
                'The subtitle data is returned directly to your browser in real-time.',
                'Nothing is written to any database, cache, or log. The Worker has no persistent storage.',
                'When you download a subtitle file, the file is converted and streamed directly to your device.',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="btn-primary w-6 h-6 text-xs font-black shrink-0 mt-0.5"
                    style={{ borderRadius: 'var(--r-full)', padding: 0 }}>{i + 1}</span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </Section>

          <div className="divider mb-10" />

          <Section id="cloudflare" title="4. Cloudflare & Infrastructure">
            <p>
              SubFetch runs on <strong className="text-white">Cloudflare Workers</strong> — a serverless edge computing platform. Cloudflare may process request metadata (IP address, HTTP headers) for DDoS protection and routing purposes as described in{' '}
              <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer"
                className="hover:text-white transition-colors" style={{ color: 'var(--accent)' }}>
                Cloudflare's Privacy Policy
              </a>.
            </p>
            <p>
              We have configured our Worker with <strong className="text-white">observability logging</strong> for error tracking only. Logs contain no personal data — only structured entries like{' '}
              <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(108,99,255,0.12)', color: '#a899ff' }}>
                {`{"level":"error","message":"Extract failed","platform":"youtube"}`}
              </code>
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="third-parties" title="5. Third-Party Platforms">
            <p>
              When you request subtitles, our service fetches data from the respective video platform (YouTube, Vimeo, Dailymotion). These requests are governed by their own privacy policies:
            </p>
            <ul className="space-y-2">
              {[
                { name: 'YouTube / Google', url: 'https://policies.google.com/privacy' },
                { name: 'Vimeo', url: 'https://vimeo.com/privacy' },
                { name: 'Dailymotion', url: 'https://www.dailymotion.com/legal/privacy' },
              ].map(p => (
                <li key={p.name} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors" style={{ color: 'var(--accent)' }}>
                    {p.name} Privacy Policy ↗
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="local-storage" title="6. Your Browser's localStorage">
            <p>
              SubFetch stores your <strong className="text-white">recent searches</strong> in your browser's{' '}
              <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(108,99,255,0.12)', color: '#a899ff' }}>localStorage</code>{' '}
              under the key <code className="px-1.5 py-0.5 rounded text-xs" style={{ background: 'rgba(108,99,255,0.12)', color: '#a899ff' }}>subfetch_v2_recent</code>.
              This data never leaves your device — it is only visible to you and can be cleared at any time using the &quot;Clear&quot; button in the recent searches panel, or by clearing your browser's site data.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="cookies" title="7. Cookies">
            <p>
              SubFetch does <strong className="text-white">not use cookies</strong> — not for analytics, not for authentication, not for tracking. The site functions entirely without cookies.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="gdpr" title="8. GDPR & Your Rights">
            <p>
              Because we collect no personal data, GDPR obligations such as data access, deletion, and portability requests are trivially satisfied — there is simply nothing to access or delete on our end.
            </p>
            <p>
              If you have concerns about data processed by Cloudflare's infrastructure, please refer to their{' '}
              <a href="https://www.cloudflare.com/gdpr/introduction/" target="_blank" rel="noopener noreferrer"
                className="hover:text-white transition-colors" style={{ color: 'var(--accent)' }}>
                GDPR compliance documentation ↗
              </a>.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="changes" title="9. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. If we make material changes, we will update the &quot;Last updated&quot; date above. Continued use of SubFetch after any update constitutes acceptance of the revised policy.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="contact" title="10. Contact">
            <p>
              Questions about this Privacy Policy? We welcome your feedback:
            </p>
            <Link to="/contact"
              className="inline-flex items-center gap-2 btn-primary px-5 py-2.5 text-sm mt-2">
              <Mail className="w-4 h-4" /> Contact Us
            </Link>
          </Section>

        </div>
      </main>
    </Layout>
  );
}
