import { Place, Event, Trail, Article } from '../types';

export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Salut Annecy",
  "url": window.location.origin,
  "logo": `${window.location.origin}/vite.svg`,
  "description": "Votre guide local complet pour découvrir Annecy - Restaurants, hébergements, activités et événements",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Annecy",
    "addressCountry": "FR"
  }
});

export const generatePlaceSchema = (place: Place) => ({
  "@context": "https://schema.org",
  "@type": getPlaceSchemaType(place.mainCategory),
  "name": place.name,
  "description": place.description,
  "image": place.imageUrl,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": place.address,
    "addressLocality": "Annecy",
    "addressCountry": "FR"
  },
  "telephone": place.phone,
  "url": place.website,
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": place.coordinates.lat,
    "longitude": place.coordinates.lng
  },
  "aggregateRating": place.reviewCount > 0 ? {
    "@type": "AggregateRating",
    "ratingValue": place.rating,
    "reviewCount": place.reviewCount,
    "bestRating": 5,
    "worstRating": 0
  } : undefined,
  "priceRange": place.priceRange,
  "openingHoursSpecification": generateOpeningHours(place.openingHours)
});

const getPlaceSchemaType = (mainCategory: Place['mainCategory']): string => {
  switch (mainCategory) {
    case 'restauration':
      return 'Restaurant';
    case 'hebergement':
      return 'LodgingBusiness';
    case 'activites':
      return 'TouristAttraction';
    case 'commerces':
      return 'LocalBusiness';
    default:
      return 'LocalBusiness';
  }
};

const generateOpeningHours = (hours: Place['openingHours']) => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  // Convert OpeningHours object to array in day order (0=Sunday, 6=Saturday)
  const hoursArray = Array.isArray(hours)
    ? hours
    : Array.from({ length: 7 }, (_, i) => hours && typeof hours === 'object' ? hours[i] ?? null : null);
  return hoursArray.map((hour, index) => {
    if (!hour) return null;
    return {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": daysOfWeek[index],
      "opens": hour.open,
      "closes": hour.close
    };
  }).filter(Boolean);
};

export const generateEventSchema = (event: Event) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": event.title,
  "description": event.description,
  "image": event.imageUrl,
  "startDate": event.date,
  "location": {
    "@type": "Place",
    "name": event.location,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Annecy",
      "addressCountry": "FR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": event.coordinates.lat,
      "longitude": event.coordinates.lng
    }
  },
  "offers": {
    "@type": "Offer",
    "price": event.price === 'Gratuit' ? '0' : event.price,
    "priceCurrency": "EUR",
    "availability": "https://schema.org/InStock"
  },
  "eventStatus": "https://schema.org/EventScheduled",
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
});

export const generateArticleSchema = (article: Article, authorName?: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.excerpt,
  "image": article.imageUrl,
  "datePublished": article.publishedAt,
  "dateModified": article.publishedAt,
  "author": {
    "@type": "Person",
    "name": authorName || "Salut Annecy"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Salut Annecy",
    "logo": {
      "@type": "ImageObject",
      "url": `${window.location.origin}/vite.svg`
    }
  }
});

export const generateTrailSchema = (trail: Trail) => ({
  "@context": "https://schema.org",
  "@type": "ExerciseRoute",
  "name": trail.name,
  "description": trail.description,
  "image": trail.imageUrl,
  "distance": `${trail.distanceKm} km`,
  "estimatedDuration": `PT${Math.floor(trail.durationMin / 60)}H${trail.durationMin % 60}M`,
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": trail.startPoint.lat,
    "longitude": trail.startPoint.lng
  },
  "url": window.location.href
});

export const generateCollectionPageSchema = (category: string, description: string, itemCount: number) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": category,
  "description": description,
  "numberOfItems": itemCount,
  "url": window.location.href,
  "isPartOf": {
    "@type": "WebSite",
    "name": "Salut Annecy",
    "url": window.location.origin
  }
});

export const generateBreadcrumbSchema = (items: { name: string; url: string }[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": items.map((item, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": item.name,
    "item": item.url
  }))
});
