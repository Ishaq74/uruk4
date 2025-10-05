import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'place' | 'event';
  jsonLd?: object;
}

const SEO: React.FC<SEOProps> = ({ title, description, image, url, type = 'website', jsonLd }) => {
  useEffect(() => {
    // Set document title
    document.title = `${title} | Salut Annecy`;

    // Update or create meta tags
    const updateMetaTag = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.content = content;
    };

    // Basic meta tags
    updateMetaTag('description', description);

    // Open Graph tags
    updateMetaTag('og:title', title, true);
    updateMetaTag('og:description', description, true);
    updateMetaTag('og:type', type, true);
    
    if (image) {
      updateMetaTag('og:image', image, true);
    }
    
    if (url) {
      updateMetaTag('og:url', url, true);
    }

    // Twitter Card tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', title);
    updateMetaTag('twitter:description', description);
    
    if (image) {
      updateMetaTag('twitter:image', image);
    }

    // JSON-LD structured data
    if (jsonLd) {
      let script = document.querySelector('script[type="application/ld+json"]#seo-schema');
      
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.setAttribute('id', 'seo-schema');
        document.head.appendChild(script);
      }
      
      script.textContent = JSON.stringify(jsonLd);
    }

    // Cleanup function
    return () => {
      // Remove JSON-LD on unmount to avoid stale data
      const script = document.querySelector('script[type="application/ld+json"]#seo-schema');
      if (script) {
        script.remove();
      }
    };
  }, [title, description, image, url, type, jsonLd]);

  return null;
};

export default SEO;
