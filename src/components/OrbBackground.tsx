import { memo } from 'react';

/**
 * OrbBackground — animated gradient orbs + grid overlay.
 * Memoised so it never re-renders. Uses transform-only CSS animations
 * (compositor-only — no layout repaints per web-perf skill).
 */
const OrbBackground = memo(function OrbBackground() {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 0 }}>
      <div
        className="orb anim-float-a"
        style={{
          width: 700, height: 700,
          top: -192, left: -96,
          background: 'radial-gradient(circle, rgba(108,99,255,0.55) 0%, transparent 65%)',
          opacity: 0.13,
        }}
      />
      <div
        className="orb anim-float-b"
        style={{
          width: 500, height: 500,
          top: '33%', right: -128,
          background: 'radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 65%)',
          opacity: 0.1,
        }}
      />
      <div
        className="orb anim-float-c"
        style={{
          width: 400, height: 400,
          bottom: 80, left: '25%',
          background: 'radial-gradient(circle, rgba(236,72,153,0.4) 0%, transparent 65%)',
          opacity: 0.08,
        }}
      />
      <div className="absolute inset-0 bg-grid" />
    </div>
  );
});

export default OrbBackground;
