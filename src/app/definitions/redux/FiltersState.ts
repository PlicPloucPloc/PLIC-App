export type FiltersState = {
  hasValues: boolean;
  minSurface: number;
  maxSurface: number;
  maxPrice: number;
  isFurnished: boolean;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};
