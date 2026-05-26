/**
 * App.tsx — Router root for SubFetch
 *
 * Uses React Router v7 with BrowserRouter.
 * Each page is code-split via React.lazy() for fast initial load (web-perf skill).
 */

import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Code-split pages (dynamic imports → separate chunks per page)
const Home = lazy(() => import('./pages/Home'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Contact = lazy(() => import('./pages/Contact'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const NotFound = lazy(() => import('./pages/NotFound'));

/**
 * Full-page loading fallback.
 * Keeps the dark background during chunk loading — no flash of white.
 */
function PageLoader() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}
      aria-label="Loading page"
      role="status"
    >
      <div
        className="anim-spin"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          border: '3px solid rgba(108,99,255,0.2)',
          borderTopColor: 'var(--accent)',
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/"          element={<Home />} />
        <Route path="/privacy"   element={<Privacy />} />
        <Route path="/terms"     element={<Terms />} />
        <Route path="/contact"   element={<Contact />} />
        <Route path="/api-docs"  element={<ApiDocs />} />
        {/* Catch-all 404 */}
        <Route path="*"          element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}
