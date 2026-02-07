// Decode Google polyline format to array of lat/lng coordinates
export function decodePolyline(encoded: string): [number, number][] {
  if (!encoded) return [];

  const poly: [number, number][] = [];
  let index = 0;
  const len = encoded.length;
  let lat = 0;
  let lng = 0;

  while (index < len) {
    let b: number;
    let shift = 0;
    let result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;

    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);

    const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    poly.push([lat / 1e5, lng / 1e5]);
  }

  return poly;
}

// Get distance-based medal
export type MedalType = 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';

export interface Medal {
  type: MedalType;
  label: string;
  color: string;
  emoji: string;
}

export function getDistanceMedal(distanceMeters: number): Medal {
  const km = distanceMeters / 1000;

  if (km >= 21.0975) {
    return {
      type: 'diamond',
      label: 'Semi-Marathon+',
      color: '#b9f2ff',
      emoji: '💎'
    };
  } else if (km >= 15) {
    return {
      type: 'platinum',
      label: 'Longue Distance',
      color: '#e5e4e2',
      emoji: '🏆'
    };
  } else if (km >= 10) {
    return {
      type: 'gold',
      label: '10K+',
      color: '#ffd700',
      emoji: '🥇'
    };
  } else if (km >= 5) {
    return {
      type: 'silver',
      label: '5K+',
      color: '#c0c0c0',
      emoji: '🥈'
    };
  } else {
    return {
      type: 'bronze',
      label: 'Course',
      color: '#cd7f32',
      emoji: '🥉'
    };
  }
}
