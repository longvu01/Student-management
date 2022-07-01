import cityApi from 'api/cityApi';
import { City } from 'models';
import { call, put, takeLatest } from 'redux-saga/effects';
import { ListResponse } from './../../models/common';
import { cityActions } from './citySlice';

function* sagaFetchCityList() {
  try {
    const response: ListResponse<City> = yield call(cityApi.getAll);
    yield put(cityActions.fetchCitySuccess(response));
  } catch (error) {
    yield put(cityActions.fetchCityFailed());
  }
}

export default function* citySaga() {
  yield takeLatest(cityActions.fetchCityList.type, sagaFetchCityList);
}
