import { PayloadAction } from '@reduxjs/toolkit';
import config from 'config';
import { push } from 'redux-first-history';
import { call, fork, put, take } from 'redux-saga/effects';
import { authActions, LoginPayload } from './authSlice';

function* handleLogin(payload: LoginPayload) {
  try {
    localStorage.setItem('access_token', payload.token);

    yield put(authActions.loginSuccess(payload));
    // Redirect to admin page
    yield put(push(config.routes.dashboard));
  } catch (error) {
    if (error instanceof Error) {
      yield put(authActions.loginFailed(error.message));
    } else {
      yield put(authActions.loginFailed('Unexpected error'));
    }
  }
}

function* handleLogout() {
  localStorage.removeItem('access_token');

  // Redirect to login page
  yield put(push(config.routes.login));
}

function* watchLoginFlow() {
  while (true) {
    const isLoggedIn = Boolean(localStorage.getItem('access_token'));

    if (!isLoggedIn) {
      const actions: PayloadAction<LoginPayload> = yield take(authActions.login.type);
      yield fork(handleLogin, actions.payload);
    }

    yield take([authActions.logout.type, authActions.loginFailed.type]);
    // yield take(authActions.logout.type);
    yield call(handleLogout);
  }
}

export default function* authSaga() {
  yield fork(watchLoginFlow);
}
