import { PayloadAction } from '@reduxjs/toolkit';
import { delay, put, takeEvery } from 'redux-saga/effects';
import { incrementSaga, incrementSagaSuccess } from './counterSlice';

function* handleIncrementSaga(action: PayloadAction<number>) {
  yield delay(1000);
  yield put(incrementSagaSuccess(action.payload));
}

export default function* counterSaga() {
  yield takeEvery(incrementSaga.type, handleIncrementSaga);
  // yield takeLatest(incrementSaga.type, handleIncrementSaga);
}
