import cityApi from 'api/cityApi';
import studentApi from 'api/studentApi';
import { City, ListResponse, Student } from 'models';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import { dashboardActions, RankingByCity } from './dashboardSlice';

const initParams = {
  _page: 1,
  _limit: 5,
};

function* fetchStatistics() {
  // Get statistics count
  const responseList: Array<ListResponse<Student>> = yield all([
    call(studentApi.getAll, { ...initParams, gender: 'male' }),
    call(studentApi.getAll, { ...initParams, gender: 'female' }),
    call(studentApi.getAll, { ...initParams, mark_gte: 8 }),
    call(studentApi.getAll, { ...initParams, mark_lte: 5 }),
  ]);

  const statisticList = responseList.map((item) => item.pagination._totalRows);
  const [maleCount, femaleCount, highMarkCount, lowMarkCount] = statisticList;

  // Update state
  yield put(
    dashboardActions.setStatistics({ maleCount, femaleCount, highMarkCount, lowMarkCount })
  );
}

function* fetchHighestStudentList() {
  const { data }: ListResponse<Student> = yield call(studentApi.getAll, {
    ...initParams,
    _sort: 'mark',
    _order: 'desc',
  });

  // Update state
  yield put(dashboardActions.setHighestStudentList(data));
}

function* fetchLowestStudentList() {
  const { data }: ListResponse<Student> = yield call(studentApi.getAll, {
    ...initParams,
    _sort: 'mark',
    _order: 'asc',
  });

  // Update state
  yield put(dashboardActions.setLowestStudentList(data));
}

function* fetchRankingByCityList() {
  // Fetch city list
  const { data: cityList }: ListResponse<City> = yield call(cityApi.getAll);

  // Fetch ranking per city
  const callList = cityList.map((item) =>
    call(studentApi.getAll, {
      ...initParams,
      _sort: 'mark',
      _order: 'desc',
      city: item.code,
    })
  );

  const responseList: Array<ListResponse<Student>> = yield all(callList);
  const rankingByCityList: RankingByCity[] = responseList.map((item, index) => ({
    cityId: cityList[index].code,
    cityName: cityList[index].name,
    rankingList: item.data,
  }));

  // Update state
  yield put(dashboardActions.setRankingByCityList(rankingByCityList));
}

function* fetchDashboardData() {
  try {
    yield all([
      call(fetchStatistics),
      call(fetchHighestStudentList),
      call(fetchLowestStudentList),
      call(fetchRankingByCityList),
    ]);

    yield put(dashboardActions.fetchDataSuccess());
  } catch (error) {
    yield put(dashboardActions.fetchDataFailed());
  }
}

export default function* dashboardSaga() {
  yield takeLatest(dashboardActions.fetchData.type, fetchDashboardData);
}
