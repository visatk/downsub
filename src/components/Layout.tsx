import { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Download, Sparkles, Menu, X } from 'lucide-react';
import OrbBackground from './OrbBackground';

/* ── Nav config ─────────────────────────────────────────────────── */
const NAV_LINKS = [
  { to: '/#how-it-works', label: 'How it Works', anchor: true },
  { to: '/#features',     label: 'Features',     anchor: true },
  { to: '/api-docs',      label: 'API',          anchor: false },
];

const FOOTER_COLS = [
  {
    heading: 'Tools',
    links: [
      { to: '/',            label: 'Subtitle Downloader',    anchor: false },
      { to: '/api-docs',    label: 'API Documentation',      anchor: false },
      { to: '/#how-it-works', label: 'How it Works',        anchor: true  },
      { to: '/#faq',        label: 'FAQ',                    anchor: true  },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { to: '/privacy', label: 'Privacy Policy',   anchor: false },
      { to: '/terms',   label: 'Terms of Service', anchor: false },
      { to: '/contact', label: 'Contact',           anchor: false },
    ],
  },
];

/* ── Navbar ─────────────────────────────────────────────────────── */
function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  // Close mobile menu on route change
  useEffect(() => { setOpen(false); }, [pathname]);

  // Add shadow on scroll
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    addEventListener('scroll', handler, { passive: true });
    return () => removeEventListener('scroll', handler);
  }, []);

  return (
    <header role="banner">
      <nav
        className="glass-nav"
        aria-label="Main navigation"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          transition: 'box-shadow 0.2s ease',
          boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div style={{
          maxWidth: 'var(--max-w-xl)',
          margin: '0 auto',
          padding: '0 1.5rem',
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}>

          {/* ── Logo ── */}
          <Link
            to="/"
            aria-label="SubFetch home"
            style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}
          >
            <div
              className="btn-primary"
              style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', padding: 0, flexShrink: 0 }}
              aria-hidden="true"
            >
              <Download style={{ width: 14, height: 14, color: 'white' }} />
            </div>
            <span style={{
              fontFamily: 'var(--font-head)',
              fontSize: '1.05rem',
              fontWeight: 900,
              color: 'var(--text)',
              letterSpacing: '-0.025em',
            }}>
              SubFetch
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <div
            role="navigation"
            className="hide-mobile-nav"
            style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, justifyContent: 'center' }}
          >
            {NAV_LINKS.map(l => (
              l.anchor ? (
                <a
                  key={l.to}
                  href={l.to}
                  style={{
                    padding: '6px 12px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    borderRadius: 'var(--r-sm)',
                    color: 'var(--text-muted)',
                    textDecoration: 'none',
                    transition: 'color 0.15s, background 0.15s',
                  }}
                  onMouseEnter={e => { (e.currentTarget).style.color = 'var(--text)'; (e.currentTarget).style.background = 'rgba(255,255,255,0.05)'; }}
                  onMouseLeave={e => { (e.currentTarget).style.color = 'var(--text-muted)'; (e.currentTarget).style.background = 'transparent'; }}
                >
                  {l.label}
                </a>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  style={({ isActive }) => ({
                    padding: '6px 12px',
                    fontSize: 'var(--text-sm)',
                    fontWeight: 500,
                    borderRadius: 'var(--r-sm)',
                    color: isActive ? 'var(--text)' : 'var(--text-muted)',
                    background: isActive ? 'rgba(108,99,255,0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'color 0.15s, background 0.15s',
                  })}
                >
                  {l.label}
                </NavLink>
              )
            ))}
          </div>

          {/* ── Right actions ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span className="badge badge-purple hide-sm" style={{ fontSize: '0.65rem' }}>
              <Sparkles style={{ width: 9, height: 9 }} /> v2.1
            </span>

            {/* Hamburger */}
            <button
              className="show-mobile-menu-btn"
              onClick={() => setOpen(o => !o)}
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              style={{
                display: 'none', /* controlled by .show-mobile-menu-btn */
                padding: 7,
                borderRadius: 'var(--r-sm)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-muted)',
                transition: 'background 0.15s, color 0.15s',
              }}
              onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(255,255,255,0.05)'; (e.currentTarget).style.color = 'var(--text)'; }}
              onMouseLeave={e => { (e.currentTarget).style.background = 'transparent'; (e.currentTarget).style.color = 'var(--text-muted)'; }}
            >
              {open
                ? <X style={{ width: 20, height: 20 }} />
                : <Menu style={{ width: 20, height: 20 }} />
              }
            </button>
          </div>
        </div>

        {/* ── Mobile menu ── */}
        {open && (
          <div
            id="mobile-menu"
            className="anim-slide-down"
            style={{
              borderTop: '1px solid var(--border)',
              background: 'rgba(5,7,16,0.97)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              padding: '12px 1.5rem 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
            }}
          >
            {NAV_LINKS.map(l => (
              l.anchor ? (
                <a
                  key={l.to}
                  href={l.to}
                  onClick={() => setOpen(false)}
                  style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)', borderRadius: 'var(--r-sm)', textDecoration: 'none', display: 'block' }}
                >
                  {l.label}
                </a>
              ) : (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-muted)', borderRadius: 'var(--r-sm)', textDecoration: 'none', display: 'block' }}
                >
                  {l.label}
                </NavLink>
              )
            ))}
            <div className="divider" style={{ margin: '6px 0' }} />
            <NavLink to="/privacy" onClick={() => setOpen(false)} style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-subtle)', borderRadius: 'var(--r-sm)', textDecoration: 'none', display: 'block' }}>Privacy</NavLink>
            <NavLink to="/terms"   onClick={() => setOpen(false)} style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-subtle)', borderRadius: 'var(--r-sm)', textDecoration: 'none', display: 'block' }}>Terms</NavLink>
            <NavLink to="/contact" onClick={() => setOpen(false)} style={{ padding: '9px 12px', fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--text-subtle)', borderRadius: 'var(--r-sm)', textDecoration: 'none', display: 'block' }}>Contact</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}

/* ── Footer ─────────────────────────────────────────────────────── */
function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer
      role="contentinfo"
      style={{
        background: 'rgba(5,7,16,0.95)',
        borderTop: '1px solid var(--border)',
        padding: '3rem 0 2rem',
        marginTop: 'auto',
      }}
    >
      <div style={{ maxWidth: 'var(--max-w-xl)', margin: '0 auto', padding: '0 1.5rem' }}>
        <div className="footer-grid" style={{ marginBottom: '2.5rem' }}>

          {/* Brand blurb */}
          <div>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, textDecoration: 'none', marginBottom: '0.875rem' }}>
              <div className="btn-primary" style={{ width: 28, height: 28, borderRadius: 'var(--r-sm)', padding: 0, flexShrink: 0 }} aria-hidden="true">
                <Download style={{ width: 13, height: 13, color: 'white' }} />
              </div>
              <span style={{ fontFamily: 'var(--font-head)', fontWeight: 900, color: 'var(--text)', fontSize: '0.95rem', letterSpacing: '-0.02em' }}>SubFetch</span>
            </Link>
            <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', lineHeight: 1.7, maxWidth: '22rem' }}>
              Free subtitle downloader for YouTube, Vimeo, and Dailymotion. Download SRT, VTT, or TXT — no account needed.
            </p>
          </div>

          {/* Link columns */}
          {FOOTER_COLS.map(col => (
            <div key={col.heading}>
              <p className="eyebrow" style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>{col.heading}</p>
              <nav aria-label={`Footer ${col.heading}`} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {col.links.map(l => (
                  l.anchor ? (
                    <a
                      key={l.to}
                      href={l.to}
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textDecoration: 'none', padding: '1px 0', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >{l.label}</a>
                  ) : (
                    <Link
                      key={l.to}
                      to={l.to}
                      style={{ fontSize: 'var(--text-sm)', color: 'var(--text-muted)', textDecoration: 'none', padding: '1px 0', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
                    >{l.label}</Link>
                  )
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="divider" style={{ marginBottom: '1.25rem' }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>
            © {year} SubFetch. All rights reserved.
          </p>
          <p style={{ fontSize: 'var(--text-xs)', color: 'var(--text-subtle)' }}>
            Powered by{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 600 }}>Cloudflare Workers</span>
            {' '}· Built for speed &amp; privacy
          </p>
        </div>
      </div>
    </footer>
  );
}

/* ── Layout ─────────────────────────────────────────────────────── */
interface LayoutProps {
  children: React.ReactNode;
  withOrbs?: boolean;
}

export default function Layout({ children, withOrbs = true }: LayoutProps) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'var(--font-body)', background: 'var(--bg)' }}>
      {withOrbs && <OrbBackground />}
      <Navbar />
      <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column' }}>
        {children}
      </div>
      <Footer />
    </div>
  );
}
