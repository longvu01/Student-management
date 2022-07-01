import { Box, Button, LinearProgress, Pagination, Typography } from '@mui/material';
import studentApi from 'api/studentApi';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import config from 'config';
import { selectCityList, selectCityMap } from 'features/city/citySlice';
import { ListParams, Student } from 'models';
import queryString from 'query-string';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import StudentFilters from '../components/StudentFilters';
import StudentTable from '../components/StudentTable';
import {
  initFilterStudent,
  selectStudentList,
  selectStudentLoading,
  selectStudentPagination,
  studentActions,
} from '../studentSlice';

export default function ListPage() {
  const [isSearchFieldTouched, setIsSearchFieldTouched] = useState(false);
  const [searchFieldValue, setSearchFieldValue] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const studentList = useAppSelector(selectStudentList);
  const pagination = useAppSelector(selectStudentPagination);
  const loading = useAppSelector(selectStudentLoading);
  const cityMap = useAppSelector(selectCityMap);
  const cityList = useAppSelector(selectCityList);

  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();

  const count = Math.ceil(pagination._totalRows / pagination._limit);
  const page = pagination._page;

  // queryParams
  const queryParams: ListParams = useMemo(() => {
    const paramsParse = queryString.parse(location.search);

    const currentPage = paramsParse?._page;
    const currentLimit = paramsParse?._limit;

    const _page = currentPage ? +currentPage : initFilterStudent._page;
    const _limit = currentLimit ? +currentLimit : initFilterStudent._limit;

    const params = {
      ...paramsParse,
      _page,
      _limit,
    };
    return params;
  }, [location.search]);

  // Re-fetch if url change
  useEffect(() => {
    dispatch(studentActions.fetchStudentList(queryParams));
  }, [dispatch, queryParams]);

  // Set search student value to url
  useEffect(() => {
    const params = { ...queryParams };

    if (searchFieldValue) {
      params.name_like = searchFieldValue.toString();
    } else if (isSearchFieldTouched) {
      delete params.name_like;
    } else return;

    setSearchParams(queryString.stringify(params));
  }, [searchFieldValue, queryParams, isSearchFieldTouched, setSearchParams]);

  // Handlers filters
  const handlePageChange = (e: any, page: number) => {
    const filters = {
      ...queryParams,
      _page: page,
    };

    setSearchParams(queryString.stringify(filters));
  };

  const handleFilterChange = (newFilter: ListParams) => {
    const filters = {
      ...queryParams,
      ...newFilter,
    };

    Object.entries(filters).forEach(([key, val]) => {
      if (!val) delete filters[key];
    });

    setSearchParams(queryString.stringify(filters));
  };

  const handleClearFilter = () => {
    setSearchFieldValue('');
    setSearchParams(queryString.stringify(initFilterStudent));
  };

  const handleSearchChange = (newSearch: string) => {
    setSearchFieldValue(newSearch);
    setIsSearchFieldTouched(true);
  };

  // Handlers remove + edit
  const handleRemoveStudent = async (student: Student) => {
    try {
      await studentApi.remove(student?.id as string);

      toast.success('Remove student successfully!');

      // Trigger to re-fetch student list with current filter
      const newFilter = { ...queryParams };
      dispatch(studentActions.fetchStudentList(newFilter));
    } catch (error: any) {
      toast.success(error.message);
    }
  };

  const handleEditStudent = (student: Student) => {
    navigate(`edit/${student.id}`);
  };

  return (
    <Box sx={{ position: 'relative' }}>
      {loading && <LinearProgress sx={{ position: 'absolute', top: '-8px', left: 0, right: 0 }} />}

      <Box
        sx={{
          display: 'flex',
          flexFlow: 'row nowrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 2,
        }}
      >
        <Typography variant="h4">Students</Typography>
        <Link to={config.routes.studentAdd}>
          <Button variant="contained" color="primary">
            Add new student
          </Button>
        </Link>
      </Box>

      <Box mb={3}>
        <StudentFilters
          filter={queryParams}
          cityList={cityList}
          onChange={handleFilterChange}
          onClear={handleClearFilter}
          onSearchChange={handleSearchChange}
        />
      </Box>

      <StudentTable
        studentList={studentList}
        loading={loading}
        cityMap={cityMap}
        onEdit={handleEditStudent}
        onRemove={handleRemoveStudent}
      />

      <Box my={2} sx={{ display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={count}
          page={page}
          variant="outlined"
          color="primary"
          onChange={handlePageChange}
        />
      </Box>
    </Box>
  );
}
