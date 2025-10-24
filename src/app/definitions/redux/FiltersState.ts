export type FiltersState = {
  hasValues: boolean;
  minSurface: number;
  maxSurface: number;
  maxPrice: number;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
};
