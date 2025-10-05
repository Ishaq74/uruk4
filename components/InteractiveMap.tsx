
import React, { useEffect, useRef, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// A generic item type that has the necessary properties for the map
type MapItem = {
    id: string;
    coordinates?: { lat: number, lng: number };
    startPoint?: { lat: number, lng: number };
    name?: string;
    title?: string;
    location?: string;
};

interface InteractiveMapProps {
    items: MapItem[];
    navigateTo?: (page: string, id: string) => void;
    itemPage?: 'place-detail' | 'event-detail' | 'trail-detail' | 'annonce-detail';
    selectedItemId?: string | null;
    onMarkerClick?: (itemId: string | null) => void;
}

// --- React Error Boundary ---
// This will catch rendering errors in the map component and prevent the whole app from crashing.
class MapErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: Error | null }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error: error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log the error to an error reporting service
    console.error("[MapErrorBoundary] Caught a critical map rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="h-full w-full flex flex-col items-center justify-center bg-rose-50 text-rose-700 p-4 rounded-xl border border-rose-200">
          <h3 className="font-bold text-lg">Erreur de la carte</h3>
          <p className="text-sm mt-1">Impossible d'afficher la carte.</p>
          <p className="mt-4 text-xs bg-rose-100 p-2 rounded font-mono">{this.state.error?.message}</p>
        </div>
      );
    }

    return this.props.children;
  }
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ items, navigateTo, itemPage, selectedItemId, onMarkerClick }) => {
    
    const validatedMarkers = useMemo(() => {
        console.log("%c[MAP VALIDATION] Validating map items...", "color: #ff9800;");
        if (!Array.isArray(items)) {
            console.error("[MAP VALIDATION] `items` prop is not an array. Received:", items);
            return [];
        }

        return items.reduce<Array<{ id: string; lat: number; lng: number; title: string; location?: string }>>((acc, item) => {
            if (!item || typeof item !== 'object' || !item.id) {
                console.warn("[MAP VALIDATION] Skipping invalid item:", item);
                return acc;
            }
            
            const position = item.coordinates || item.startPoint;
            if (!position || typeof position.lat === 'undefined' || typeof position.lng === 'undefined') {
                console.warn(`[MAP VALIDATION] Skipping item ID ${item.id} due to missing coordinates.`);
                return acc;
            }
            
            const lat = Number(position.lat);
            const lng = Number(position.lng);

            if (!isFinite(lat) || !isFinite(lng)) {
                console.error(`[MAP VALIDATION] Skipping item ID ${item.id} due to non-finite coordinates: lat=${position.lat}, lng=${position.lng}`);
                return acc;
            }

            acc.push({
                id: item.id,
                lat: lat,
                lng: lng,
                title: item.title || item.name || 'Sans titre',
                location: item.location,
            });
            return acc;
        }, []);
    }, [items]);
    
    console.log(`%c[MAP VALIDATION] Validation complete, ${validatedMarkers.length} valid markers.`, "color: #4caf50;");

    const center: [number, number] = [45.8992, 6.1294];
    const mapRef = useRef<L.Map>(null);
    const markerRefs = useRef<{ [key: string]: L.Marker | null }>({});

    useEffect(() => {
        if (selectedItemId && markerRefs.current[selectedItemId] && mapRef.current) {
            const marker = markerRefs.current[selectedItemId];
            if (marker) {
                mapRef.current.flyTo(marker.getLatLng(), 16, { animate: true, duration: 1 });
                marker.openPopup();
            }
        }
    }, [selectedItemId]);

    return (
        <div className="h-full w-full bg-slate-200 rounded-xl shadow-md overflow-hidden">
            <MapErrorBoundary>
                <MapContainer ref={mapRef} center={center} zoom={13} scrollWheelZoom={true} className="h-full w-full">
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {validatedMarkers.map((markerInfo) => (
                        <Marker
                            key={markerInfo.id}
                            position={[markerInfo.lat, markerInfo.lng]}
                            ref={(el) => { markerRefs.current[markerInfo.id] = el; }}
                            eventHandlers={{ click: () => onMarkerClick?.(markerInfo.id) }}
                        >
                            <Popup>
                                <div className="text-center max-w-[200px]">
                                    <h4 className="font-bold whitespace-normal">{markerInfo.title}</h4>
                                    {markerInfo.location && <p className="text-xs text-gray-500">{markerInfo.location}</p>}
                                    {navigateTo && itemPage && (
                                        <button
                                            onClick={() => navigateTo(itemPage, markerInfo.id)}
                                            className="mt-2 px-3 py-1 bg-sky-500 text-white text-xs font-semibold rounded-full hover:bg-sky-600"
                                        >
                                            Voir les détails
                                        </button>
                                    )}
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </MapErrorBoundary>
        </div>
    );
};

export default InteractiveMap;
