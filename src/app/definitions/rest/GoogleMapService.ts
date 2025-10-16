// Types for Geocoding
export type LatLng = {
  latitude: number;
  longitude: number;
};

export type GeocodeResponse = {
  status: string;
  results: {
    geometry: {
      location: {
        lat: number;
        lng: number;
      };
    };
  }[];
};

// Types for Places API
export type PlaceType = 'store' | 'subway';

export type Place = {
  name: string;
  type: PlaceType;
  address: string;
  latitude: number;
  longitude: number;
};

export type PlacesNearbyRequest = {
  includedPrimaryTypes: string[];
  maxResultCount: number;
  rankPreference: 'DISTANCE' | 'POPULARITY';
  locationRestriction: {
    circle: {
      center: { latitude: number; longitude: number };
      radius: number;
    };
  };
};

export type PlacesNearbyResponse = {
  places: PlaceItem[];
};

export type PlaceItem = {
  displayName: { text: string };
  formattedAddress: string;
  location: { latitude: number; longitude: number };
};
