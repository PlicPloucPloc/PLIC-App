import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { FILTERS_SURFACE_MAX, FILTERS_SURFACE_MIN } from '@app/config/Constants';
import { FiltersState } from '@app/definitions';

const initialState: FiltersState = {
  hasValues: false,
  minSurface: FILTERS_SURFACE_MIN,
  maxSurface: FILTERS_SURFACE_MAX,
  maxPrice: 0,
  isFurnished: false,
  location: {
    name: '',
    latitude: 0,
    longitude: 0,
  },
};

export const filtersStateSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFiltersState: (_, action: PayloadAction<FiltersState>) => {
      return action.payload.hasValues ? action.payload : initialState;
    },
  },
});

export const { setFiltersState } = filtersStateSlice.actions;

export default filtersStateSlice.reducer;
