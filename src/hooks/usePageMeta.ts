import { useEffect } from 'react';

interface PageMeta {
  title: string;
  description: string;
  canonical?: string;
}

/**
 * usePageMeta — sets document title, meta description, and canonical
 * for each page. Lightweight alternative to react-helmet.
 */
export function usePageMeta({ title, description, canonical }: PageMeta) {
  useEffect(() => {
    // Title
    document.title = title;

    // Description
    let metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    // Canonical
    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement('link');
        link.rel = 'canonical';
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    // OG title
    const ogTitle = document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
    if (ogTitle) ogTitle.content = title;

    // OG description
    const ogDesc = document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;
  }, [title, description, canonical]);
}
