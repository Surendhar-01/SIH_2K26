export type LocationResult = {
  latitude: number;
  longitude: number;
  accuracy: number;
  isIpFallback: boolean;
  placeName?: string;
  city?: string;
  region?: string;
  country?: string;
};

/**
 * Multi-tier Live Location Fetcher
 * Tier 1: Browser navigator.geolocation with fallback
 * Tier 2: IP-based Geolocation via HTTPS APIs if browser geolocation times out/fails
 */
export async function fetchLiveLocation(): Promise<LocationResult> {
  // Step 1: Try browser geolocation first with reasonable timeout
  if ('geolocation' in navigator) {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          resolve,
          reject,
          {
            enableHighAccuracy: false, // Prevents PC GPS timeout issue
            maximumAge: 120_000,
            timeout: 6_000,
          }
        );
      });

      const lat = Number(position.coords.latitude.toFixed(5));
      const lng = Number(position.coords.longitude.toFixed(5));
      const placeName = await fetchPlaceName(lat, lng);

      return {
        latitude: lat,
        longitude: lng,
        accuracy: Math.round(position.coords.accuracy),
        isIpFallback: false,
        placeName,
      };
    } catch {
      // Browser geolocation failed or timed out; proceeding to IP fallback
    }
  }

  // Step 2: IP Geolocation Fallback
  try {
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      if (typeof data.latitude === 'number' && typeof data.longitude === 'number') {
        const lat = Number(data.latitude.toFixed(5));
        const lng = Number(data.longitude.toFixed(5));
        const city = data.city || '';
        const region = data.region || '';
        const country = data.country_name || '';
        const placeName = [city, region, country].filter(Boolean).join(', ');

        return {
          latitude: lat,
          longitude: lng,
          accuracy: 5000, // Estimated IP resolution
          isIpFallback: true,
          placeName: placeName || `${lat}, ${lng}`,
          city,
          region,
          country,
        };
      }
    }
  } catch {
    // Secondary IP service fallback
    try {
      const bgcResp = await fetch('https://api.bigdatacloud.net/data/reverse-geocode-client');
      if (bgcResp.ok) {
        const bgcData = await bgcResp.json();
        if (typeof bgcData.latitude === 'number' && typeof bgcData.longitude === 'number') {
          const lat = Number(bgcData.latitude.toFixed(5));
          const lng = Number(bgcData.longitude.toFixed(5));
          const city = bgcData.city || bgcData.locality || '';
          const region = bgcData.principalSubdivision || '';
          const country = bgcData.countryName || '';
          const placeName = [city, region, country].filter(Boolean).join(', ');

          return {
            latitude: lat,
            longitude: lng,
            accuracy: 8000,
            isIpFallback: true,
            placeName: placeName || `${lat}, ${lng}`,
            city,
            region,
            country,
          };
        }
      }
    } catch {
      // Ignore inner catch
    }
  }

  throw new Error('Unable to determine live location from GPS or IP network.');
}

/**
 * Reverse Geocoding Helper
 */
export async function fetchPlaceName(latitude: number, longitude: number): Promise<string> {
  // Option 1: BigDataCloud Reverse Geocoding API (Fast & Reliable)
  try {
    const bgcResp = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    if (bgcResp.ok) {
      const data = await bgcResp.json();
      const parts = [
        data.city || data.locality || data.localityInfo?.informative?.[0]?.name,
        data.principalSubdivision,
        data.countryName,
      ].filter(Boolean);
      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
  } catch {
    // Continue to Nominatim
  }

  // Option 2: OpenStreetMap Nominatim
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
    );
    if (response.ok) {
      const data = await response.json();
      const addr = data.address;
      const parts = [
        addr?.neighbourhood || addr?.suburb || addr?.city || addr?.town || addr?.village,
        addr?.state_district || addr?.state,
        addr?.country,
      ].filter(Boolean);

      if (parts.length > 0) {
        return parts.join(', ');
      }
    }
  } catch {
    // Ignore error
  }

  return `Lat ${latitude.toFixed(4)} / Long ${longitude.toFixed(4)}`;
}

export function estimateOutdoorTemperatureFromLat(latitude: number): number {
  const hour = new Date().getHours();
  const daySwing = Math.sin(((hour - 7) / 24) * Math.PI * 2) * 6;
  const latitudeCooling = Math.min(Math.abs(latitude) * 0.08, 4.5);
  return Math.round((22 + daySwing - latitudeCooling) * 10) / 10;
}
