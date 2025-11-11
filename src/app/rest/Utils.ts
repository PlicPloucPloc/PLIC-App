import { FiltersState } from '@app/definitions';

export function filtersToQueryString(filters: FiltersState) {
  const params = new URLSearchParams();

  params.append('rent', filters.maxPrice.toString());
  params.append('min_size', filters.minSurface.toString());
  params.append('max_size', filters.maxSurface.toString());
  params.append('lat', filters.location.latitude.toString());
  params.append('lon', filters.location.longitude.toString());

  return params.toString();
}
