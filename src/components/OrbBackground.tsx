import { memo } from 'react';

/**
 * OrbBackground v2 — multi-layer ambient orbs + grid overlay.
 * Memoised: never re-renders after mount.
 * Uses transform/opacity CSS animations only (compositor layer = no layout repaints).
 */
const OrbBackground = memo(function OrbBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
      }}
    >
      {/* Primary violet orb — top-left */}
      <div
        className="orb anim-float-a"
        style={{
          width: 800,
          height: 800,
          top: -280,
          left: -200,
          background: 'radial-gradient(circle at 40% 40%, rgba(108,99,255,0.65) 0%, rgba(108,99,255,0.2) 45%, transparent 70%)',
          opacity: 0.12,
          animationDuration: '13s',
        }}
      />

      {/* Secondary purple orb — mid-right */}
      <div
        className="orb anim-float-b"
        style={{
          width: 600,
          height: 600,
          top: '28%',
          right: -200,
          background: 'radial-gradient(circle at 60% 50%, rgba(168,85,247,0.7) 0%, rgba(168,85,247,0.2) 50%, transparent 72%)',
          opacity: 0.1,
          animationDuration: '16s',
        }}
      />

      {/* Accent pink orb — bottom-center */}
      <div
        className="orb anim-float-c"
        style={{
          width: 500,
          height: 500,
          bottom: 0,
          left: '30%',
          background: 'radial-gradient(circle at 50% 60%, rgba(236,72,153,0.5) 0%, rgba(236,72,153,0.15) 50%, transparent 70%)',
          opacity: 0.09,
          animationDuration: '18s',
        }}
      />

      {/* Small warm orb — bottom-left accent */}
      <div
        className="orb anim-float-a"
        style={{
          width: 280,
          height: 280,
          bottom: '15%',
          left: -60,
          background: 'radial-gradient(circle, rgba(249,115,22,0.45) 0%, transparent 70%)',
          opacity: 0.07,
          animationDuration: '20s',
          animationDelay: '-6s',
        }}
      />

      {/* Tiny highlight orb — top-right */}
      <div
        className="orb anim-float-b"
        style={{
          width: 220,
          height: 220,
          top: '10%',
          right: '15%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.5) 0%, transparent 70%)',
          opacity: 0.07,
          animationDuration: '22s',
          animationDelay: '-4s',
        }}
      />

      {/* Grid overlay */}
      <div
        className="bg-grid"
        style={{
          position: 'absolute',
          inset: 0,
          maskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, black 0%, transparent 100%)',
        }}
      />

      {/* Subtle vignette — darkens edges */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 100% 80% at 50% 50%, transparent 40%, rgba(5,7,16,0.6) 100%)',
        }}
      />
    </div>
  );
});

export default OrbBackground;
