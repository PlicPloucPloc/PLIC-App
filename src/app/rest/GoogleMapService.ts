import { MAP_CIRCLE_RADIUS } from '@app/config/Constants';
import { GOOGLE_API_KEY } from '@app/config/Env';
import {
  GeocodeResponse,
  LatLng,
  Place,
  PlacesNearbyRequest,
  PlacesNearbyResponse,
  PlaceType,
} from '@app/definitions';

export async function geocodeAddress(address: string): Promise<LatLng> {
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json?address=` +
    encodeURIComponent(address) +
    `&key=${GOOGLE_API_KEY}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network error: ${response.status}`);
  }

  const data: GeocodeResponse = await response.json();

  if (data.status !== 'OK' || data.results.length === 0) {
    throw new Error(`Geocoding API error: ${data.status}`);
  }

  const location = data.results[0].geometry.location;
  return {
    latitude: location.lat,
    longitude: location.lng,
  };
}

async function callPlacesAPI(requestBody: PlacesNearbyRequest, type: PlaceType): Promise<Place[]> {
  const response = await fetch('https://places.googleapis.com/v1/places:searchNearby', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.formattedAddress,places.location',
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    throw new Error(`Places API error: ${response.status}`);
  }

  const places: PlacesNearbyResponse = await response.json();

  if (!places || !places.places || places.places.length === 0) {
    return [];
  }

  return places.places.map((place) => ({
    name: place.displayName.text,
    type: type,
    address: place.formattedAddress,
    latitude: place.location.latitude,
    longitude: place.location.longitude,
  }));
}

const LOCATION_RESTRICTION = (latitude: number, longitude: number) => ({
  circle: {
    center: { latitude, longitude },
    radius: MAP_CIRCLE_RADIUS, // 1 km
  },
});

export async function getNearbyStores(latitude: number, longitude: number): Promise<Place[]> {
  const requestBody: PlacesNearbyRequest = {
    includedPrimaryTypes: ['supermarket'],
    maxResultCount: 6,
    rankPreference: 'POPULARITY',
    locationRestriction: LOCATION_RESTRICTION(latitude, longitude),
  };

  return await callPlacesAPI(requestBody, 'store');
}

export async function getNearbySubways(latitude: number, longitude: number): Promise<Place[]> {
  const requestBody: PlacesNearbyRequest = {
    includedPrimaryTypes: ['subway_station'],
    maxResultCount: 4,
    rankPreference: 'DISTANCE',
    locationRestriction: LOCATION_RESTRICTION(latitude, longitude),
  };

  return await callPlacesAPI(requestBody, 'subway');
}
