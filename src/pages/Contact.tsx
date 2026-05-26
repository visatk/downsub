import { useState } from 'react';
import { Mail, MessageSquare, GitBranch, MessageCircle, CheckCircle2, AlertCircle, Loader2, ChevronDown } from 'lucide-react';
import Layout from '../components/Layout';
import { usePageMeta } from '../hooks/usePageMeta';

const FAQS = [
  {
    q: 'What is the best way to report a bug?',
    a: 'Use the contact form below and select "Bug Report" as the subject. Include the video URL that caused the issue and a description of what went wrong. Screenshots are helpful!',
  },
  {
    q: 'My video URL returns "no subtitles found" — is that a bug?',
    a: 'Not necessarily. The video creator may not have added captions, or the video may be private, age-restricted, or a live stream. Try a public video with known captions first.',
  },
  {
    q: 'Can I request support for a new platform?',
    a: 'Yes! Use the contact form and select "Feature Request". Include the platform name and a sample URL. We evaluate all requests.',
  },
  {
    q: 'Is there a public API I can use?',
    a: 'Yes — check out our API Documentation page for details on the /api/extract and /api/download endpoints.',
  },
];

function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  return (
    <details className="card-glass overflow-hidden anim-slide-up group" style={{ opacity: 0, animationDelay: `${index * 70}ms` }}>
      <summary className="flex items-center justify-between gap-4 p-5 font-semibold text-white hover:text-[var(--accent)] transition-colors cursor-pointer">
        <span className="text-sm">{q}</span>
        <ChevronDown className="chevron w-4 h-4 shrink-0" style={{ color: 'var(--text-muted)' }} />
      </summary>
      <div className="faq-body">
        <div className="px-5 pb-5">
          <div className="divider mb-4" />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{a}</p>
        </div>
      </div>
    </details>
  );
}

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  usePageMeta({
    title: 'Contact Us — SubFetch',
    description: 'Get in touch with the SubFetch team. Report bugs, request features, or ask questions about our free subtitle downloader service.',
    canonical: 'https://downsub.cybercoderbd.com/contact',
  });

  const [formState, setFormState] = useState<FormState>('idle');
  const [form, setForm] = useState({ name: '', email: '', subject: 'General Question', message: '' });

  const SUBJECTS = [
    'General Question',
    'Bug Report',
    'Feature Request',
    'Platform Support Request',
    'API / Developer',
    'Business Inquiry',
    'Privacy Concern',
    'Other',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setFormState('sending');
    // Simulate form submission (replace with actual endpoint)
    setTimeout(() => setFormState('success'), 1800);
  };

  const handleChange = (field: keyof typeof form, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }));

  return (
    <Layout>
      <main id="main-content" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24">

        {/* Header */}
        <div className="text-center mb-14 anim-slide-up" style={{ opacity: 0 }}>
          <span className="badge badge-purple mb-4">
            <MessageSquare className="w-3 h-3" /> Get in Touch
          </span>
          <h1
            className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4"
            style={{ fontFamily: 'var(--font-head)' }}
          >
            Contact <span className="grad-text">Us</span>
          </h1>
          <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Have a question, bug report, or feature request? We read every message and respond within 24–48 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8 items-start">

          {/* Left — Form */}
          <div className="lg:col-span-3">
            <div className="card-glass p-7 sm:p-9 anim-slide-up relative overflow-hidden" style={{ opacity: 0, animationDelay: '50ms' }}>
              <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'linear-gradient(90deg, var(--accent), var(--accent-2))', opacity: 0.8 }} />
              {formState === 'success' ? (
                <div className="flex flex-col items-center text-center py-10 gap-5">
                  <div className="btn-primary w-16 h-16" style={{ borderRadius: 'var(--r-full)', padding: 0 }}>
                    <CheckCircle2 className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-head)' }}>Message sent!</h2>
                  <p style={{ color: 'var(--text-muted)' }} className="text-sm max-w-xs">
                    Thanks for reaching out, {form.name.split(' ')[0]}! We'll get back to you at <strong className="text-white">{form.email}</strong> within 24–48 hours.
                  </p>
                  <button
                    onClick={() => { setFormState('idle'); setForm({ name: '', email: '', subject: 'General Question', message: '' }); }}
                    className="pill mt-2"
                  >
                    Send another message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate aria-label="Contact form">
                  <h2 className="text-lg font-bold text-white mb-6" style={{ fontFamily: 'var(--font-head)' }}>
                    Send us a message
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4 mb-4">
                    {/* Name */}
                    <div>
                      <label htmlFor="contact-name" className="block text-xs font-bold mb-2 eyebrow">Your Name *</label>
                      <div className="input-wrap px-4 py-3">
                        <input
                          id="contact-name"
                          type="text"
                          required
                          className="input-field text-sm"
                          placeholder="Jane Smith"
                          value={form.name}
                          onChange={e => handleChange('name', e.target.value)}
                          autoComplete="name"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="contact-email" className="block text-xs font-bold mb-2 eyebrow">Email Address *</label>
                      <div className="input-wrap px-4 py-3">
                        <input
                          id="contact-email"
                          type="email"
                          required
                          className="input-field text-sm"
                          placeholder="jane@example.com"
                          value={form.email}
                          onChange={e => handleChange('email', e.target.value)}
                          autoComplete="email"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Subject */}
                  <div className="mb-4">
                    <label htmlFor="contact-subject" className="block text-xs font-bold mb-2 eyebrow">Subject</label>
                    <div className="input-wrap px-4 py-3 relative">
                      <select
                        id="contact-subject"
                        className="input-field text-sm appearance-none cursor-pointer w-full pr-8"
                        value={form.subject}
                        onChange={e => handleChange('subject', e.target.value)}
                        style={{ background: 'transparent' }}
                      >
                        {SUBJECTS.map(s => (
                          <option key={s} value={s} style={{ background: 'var(--surface)' }}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 w-4 h-4 pointer-events-none" style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label htmlFor="contact-message" className="block text-xs font-bold mb-2 eyebrow">Message *</label>
                    <div className="input-wrap p-4" style={{ borderRadius: 'var(--r-lg)', alignItems: 'flex-start' }}>
                      <textarea
                        id="contact-message"
                        required
                        rows={6}
                        className="input-field text-sm resize-none leading-relaxed"
                        placeholder="Describe your question, bug, or suggestion in detail…"
                        value={form.message}
                        onChange={e => handleChange('message', e.target.value)}
                      />
                    </div>
                    <p className="text-xs mt-1.5" style={{ color: 'var(--text-subtle)' }}>
                      {form.message.length} / 2000 characters
                    </p>
                  </div>

                  {formState === 'error' && (
                    <div className="flex items-center gap-2 mb-4 text-sm" style={{ color: 'var(--error)' }}>
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      Something went wrong. Please try again or email us directly.
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={formState === 'sending' || !form.name || !form.email || !form.message}
                    className="btn-primary w-full py-3.5 text-base"
                  >
                    {formState === 'sending' ? (
                      <><Loader2 className="w-5 h-5 anim-spin" /> Sending…</>
                    ) : (
                      <><Mail className="w-5 h-5" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Right — Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact info */}
            <div className="card p-6 anim-slide-up" style={{ opacity: 0, animationDelay: '100ms' }}>
              <h2 className="font-bold text-white mb-4 text-sm" style={{ fontFamily: 'var(--font-head)' }}>
                Other Ways to Reach Us
              </h2>
              <div className="space-y-4">
                <a href="mailto:hello@downsub.cybercoderbd.com"
                  className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="btn-primary w-9 h-9 shrink-0" style={{ borderRadius: 'var(--r-sm)', padding: 0 }}>
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Email</p>
                    <p className="text-sm text-white font-medium group-hover:text-[var(--accent)] transition-colors">
                      hello@downsub.cybercoderbd.com
                    </p>
                  </div>
                </a>

                <a href="https://github.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="btn-primary w-9 h-9 shrink-0" style={{ borderRadius: 'var(--r-sm)', padding: 0 }}>
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>GitHub Issues</p>
                    <p className="text-sm text-white font-medium group-hover:text-[var(--accent)] transition-colors">
                      Report bugs & request features
                    </p>
                  </div>
                </a>

                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 group p-3 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="btn-primary w-9 h-9 shrink-0" style={{ borderRadius: 'var(--r-sm)', padding: 0 }}>
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold" style={{ color: 'var(--text-muted)' }}>Twitter / X</p>
                    <p className="text-sm text-white font-medium group-hover:text-[var(--accent)] transition-colors">
                      @subfetch
                    </p>
                  </div>
                </a>
              </div>
            </div>

            {/* Response time */}
            <div className="card p-6 anim-slide-up" style={{ opacity: 0, animationDelay: '150ms' }}>
              <h2 className="font-bold text-white mb-3 text-sm" style={{ fontFamily: 'var(--font-head)' }}>
                Response Times
              </h2>
              <div className="space-y-3">
                {[
                  { type: 'General Questions', time: '24–48 hours', color: 'var(--success)' },
                  { type: 'Bug Reports', time: '12–24 hours', color: 'var(--accent)' },
                  { type: 'Feature Requests', time: '48–72 hours', color: 'var(--text-muted)' },
                ].map(r => (
                  <div key={r.type} className="flex items-center justify-between">
                    <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{r.type}</span>
                    <span className="text-xs font-bold" style={{ color: r.color }}>{r.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* FAQ section */}
        <div className="mt-20">
          <div className="text-center mb-10">
            <p className="eyebrow mb-3">Before You Write</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-head)' }}>
              Common Questions
            </h2>
          </div>
          <div className="space-y-3 max-w-2xl mx-auto">
            {FAQS.map((faq, i) => (
              <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
}
