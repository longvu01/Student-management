import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from 'app/store';
import { City, ListResponse } from 'models';

export interface cityState {
  loading: boolean;
  list: City[];
}
const initialState: cityState = {
  loading: false,
  list: [],
};

const citySlice = createSlice({
  name: 'city',
  initialState,
  reducers: {
    fetchCityList(state) {
      state.loading = true;
    },
    fetchCitySuccess(state, action: PayloadAction<ListResponse<City>>) {
      state.list = action.payload.data;
      state.loading = false;
    },
    fetchCityFailed(state) {
      state.loading = false;
    },
  },
});

// Actions
export const cityActions = citySlice.actions;

// Selectors
export const selectCityList = (state: RootState) => state.city.list;

export const selectCityMap = createSelector(selectCityList, (cityList) =>
  cityList.reduce((cityMap: { [key: string]: City }, city) => {
    cityMap[city.code] = city;
    return cityMap;
  }, {})
);

export const selectCityOptions = createSelector(selectCityList, (cityList) =>
  cityList.map((city) => ({ label: city.name, value: city.code }))
);

// Reducer
const cityReducer = citySlice.reducer;
export default cityReducer;
