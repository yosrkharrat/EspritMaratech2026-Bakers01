import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { decodePolyline } from '@/lib/polyline';

interface ActivityMapProps {
  polyline: string | null;
  startLatLng?: [number, number] | null;
  endLatLng?: [number, number] | null;
  className?: string;
}

const ActivityMap = ({ polyline, startLatLng, endLatLng, className = '' }: ActivityMapProps) => {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize map only once
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: false,
      });

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // Clear existing layers (except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline || layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    if (polyline) {
      // Decode and display polyline
      const coordinates = decodePolyline(polyline);

      if (coordinates.length > 0) {
        // Draw route
        const routeLine = L.polyline(coordinates, {
          color: '#FC4C02',
          weight: 3,
          opacity: 0.8,
        }).addTo(map);

        // Add start marker
        if (coordinates[0]) {
          L.marker(coordinates[0], {
            icon: L.divIcon({
              className: 'custom-marker',
              html: '<div style="background: #22c55e; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [16, 16],
            }),
          }).addTo(map);
        }

        // Add end marker
        if (coordinates[coordinates.length - 1]) {
          L.marker(coordinates[coordinates.length - 1], {
            icon: L.divIcon({
              className: 'custom-marker',
              html: '<div style="background: #ef4444; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>',
              iconSize: [16, 16],
            }),
          }).addTo(map);
        }

        // Fit bounds to show entire route
        map.fitBounds(routeLine.getBounds(), { padding: [20, 20] });
      }
    } else if (startLatLng) {
      // Fallback: just show start point
      L.marker(startLatLng, {
        icon: L.divIcon({
          className: 'custom-marker',
          html: '<div style="background: #FC4C02; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>',
          iconSize: [20, 20],
        }),
      }).addTo(map);
      map.setView(startLatLng, 14);
    }

    // Cleanup on unmount
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [polyline, startLatLng, endLatLng]);

  if (!polyline && !startLatLng) {
    return (
      <div className={`bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center ${className}`}>
        <p className="text-sm text-gray-500 dark:text-gray-400">Carte non disponible</p>
      </div>
    );
  }

  return <div ref={containerRef} className={`rounded-lg overflow-hidden ${className}`} />;
};

export default ActivityMap;
