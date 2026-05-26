import { Link } from 'react-router-dom';
import { FileText, AlertTriangle, Mail } from 'lucide-react';
import Layout from '../components/Layout';
import { usePageMeta } from '../hooks/usePageMeta';

const LAST_UPDATED = 'May 26, 2026';

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-12" aria-labelledby={`${id}-heading`}>
      <h2
        id={`${id}-heading`}
        className="text-xl sm:text-2xl font-bold text-white mb-4"
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

export default function Terms() {
  usePageMeta({
    title: 'Terms of Service — SubFetch',
    description: 'Read SubFetch\'s Terms of Service. Use SubFetch responsibly and in compliance with the terms of video platforms such as YouTube, Vimeo, and Dailymotion.',
    canonical: 'https://downsub.cybercoderbd.com/terms',
  });

  return (
    <Layout>
      <main id="main-content" className="max-w-4xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="text-center mb-14 anim-slide-up" style={{ opacity: 0 }}>
          <span className="badge badge-purple mb-4">
            <FileText className="w-3 h-3" /> Legal
          </span>
          <h1
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Terms of Service
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: <time dateTime="2026-05-26">{LAST_UPDATED}</time>
          </p>
        </div>

        {/* Important warning */}
        <div
          className="card p-5 mb-10 flex items-start gap-4 anim-slide-up"
          style={{ opacity: 0, borderColor: 'rgba(251,146,60,0.3)', background: 'rgba(251,146,60,0.05)' }}
        >
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--warn)' }} />
          <div>
            <p className="font-bold text-sm mb-1" style={{ color: '#fbbf24' }}>Important Notice</p>
            <p className="text-sm" style={{ color: 'rgba(251,191,36,0.75)' }}>
              SubFetch is intended for personal, educational, and accessibility use only. Downloading subtitles for commercial redistribution or in violation of a platform's Terms of Service is not permitted and may violate copyright law.
            </p>
          </div>
        </div>

        <div className="card-glass p-8 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', opacity: 0.8 }} />

          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>
              By accessing or using SubFetch at{' '}
              <a href="https://downsub.cybercoderbd.com" style={{ color: 'var(--accent)' }}
                className="hover:text-white transition-colors">
                downsub.cybercoderbd.com
              </a>{' '}
              (the &quot;Service&quot;), you agree to be bound by these Terms of Service (&quot;Terms&quot;). If you do not agree to these Terms, please do not use the Service.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="description" title="2. Description of Service">
            <p>
              SubFetch is a free web-based tool that extracts and converts subtitle/caption tracks from publicly available videos hosted on supported platforms (YouTube, Vimeo, Dailymotion). The Service provides subtitle data in SRT, VTT, and TXT formats.
            </p>
            <p>
              SubFetch does not host, download, store, or redistribute any video content. Subtitle data is fetched directly from the source platform in real-time and delivered to your browser.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="permitted-use" title="3. Permitted Uses">
            <p>You may use SubFetch to:</p>
            <ul className="space-y-2">
              {[
                'Download subtitles for personal viewing and accessibility purposes',
                'Obtain transcripts for study, research, or educational use',
                'Use subtitle text as input for personal AI/NLP projects',
                'Create translated subtitles for personal use',
                'Improve accessibility for hearing-impaired individuals',
                'Archive subtitles for videos you have the right to access',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--success)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="prohibited-use" title="4. Prohibited Uses">
            <p>You may <strong className="text-white">not</strong> use SubFetch to:</p>
            <ul className="space-y-2">
              {[
                'Download subtitles for commercial redistribution or resale without permission from the copyright holder',
                'Violate YouTube\'s, Vimeo\'s, or Dailymotion\'s Terms of Service',
                'Circumvent access controls on private, age-restricted, or paywalled content',
                'Automate excessive requests in a manner that constitutes abuse of the Service',
                'Use the API or Service to build competing commercial subtitle platforms without authorization',
                'Reverse engineer or scrape the Service beyond its intended use',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--error)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="third-party" title="5. Third-Party Platform Terms">
            <p>
              By using SubFetch, you agree to comply with the Terms of Service of the video platforms whose content you access:
            </p>
            <ul className="space-y-2">
              {[
                { name: 'YouTube Terms of Service', url: 'https://www.youtube.com/t/terms' },
                { name: 'Vimeo Terms of Service', url: 'https://vimeo.com/terms' },
                { name: 'Dailymotion Terms of Use', url: 'https://www.dailymotion.com/legal/terms' },
              ].map(t => (
                <li key={t.name} className="flex items-center gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  <a href={t.url} target="_blank" rel="noopener noreferrer"
                    className="hover:text-white transition-colors" style={{ color: 'var(--accent)' }}>
                    {t.name} ↗
                  </a>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="intellectual-property" title="6. Intellectual Property">
            <p>
              Subtitle content extracted by SubFetch belongs to the respective video creators and/or rights holders. SubFetch does not claim any ownership over subtitle content.
            </p>
            <p>
              The SubFetch website, interface, logo, and original source code are the property of SubFetch and are protected by copyright law. The underlying Cloudflare Worker source code is proprietary.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="disclaimer" title="7. Disclaimer of Warranties">
            <p>
              The Service is provided &quot;as is&quot; without warranties of any kind, express or implied. We do not guarantee that:
            </p>
            <ul className="space-y-1.5">
              {[
                'The Service will be available at all times or uninterrupted',
                'Subtitle extraction will succeed for all videos',
                'The accuracy or completeness of extracted subtitle content',
                'The Service will be compatible with all video platforms or URL formats',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--text-muted)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="limitation" title="8. Limitation of Liability">
            <p>
              To the maximum extent permitted by applicable law, SubFetch shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of or inability to use the Service.
            </p>
            <p>
              Our total liability for any claim arising out of or relating to these Terms or the Service shall not exceed $0 USD (as the Service is provided free of charge with no commercial relationship).
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="dmca" title="9. DMCA & Copyright Notices">
            <p>
              SubFetch respects intellectual property rights. If you believe that content accessible through our Service infringes your copyright, please contact us with:
            </p>
            <ul className="space-y-1.5">
              {[
                'A description of the copyrighted work you believe was infringed',
                'The specific URL or content in question',
                'Your contact information',
                'A statement that you have a good faith belief the use is not authorized',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </Section>

          <div className="divider mb-10" />

          <Section id="changes" title="10. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will indicate the date of the last update. Continued use of the Service after changes are posted constitutes your acceptance of the revised Terms.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="governing-law" title="11. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with applicable international law. Any disputes shall be resolved through good-faith negotiation wherever possible.
            </p>
          </Section>

          <div className="divider mb-10" />

          <Section id="contact" title="12. Contact">
            <p>For questions or concerns about these Terms:</p>
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
