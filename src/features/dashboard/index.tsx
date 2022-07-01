import ArrowCircleDownIcon from '@mui/icons-material/ArrowCircleDown';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import BoyIcon from '@mui/icons-material/Boy';
import GirlIcon from '@mui/icons-material/Girl';
import { Box, Grid, LinearProgress, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from 'app/hooks';
import classNames from 'classnames/bind';
import { useEffect } from 'react';
import StatisticItem from './components/StatisticItem';
import StudentRankingList from './components/StudentRankingList';
import Widget from './components/Widget';
import styles from './Dashboard.module.scss';
import {
  dashboardActions,
  selectDashboardLoading,
  selectDashboardStatistics,
  selectHighestStudentList,
  selectLowestStudentList,
  selectRankingByCityList,
} from './dashboardSlice';

const cx = classNames.bind(styles);

export interface DashboardProps {}

export default function Dashboard(props: DashboardProps) {
  const dispatch = useAppDispatch();

  const loading = useAppSelector(selectDashboardLoading);
  const statistics = useAppSelector(selectDashboardStatistics);
  const highestStudentList = useAppSelector(selectHighestStudentList);
  const lowestStudentList = useAppSelector(selectLowestStudentList);
  const rankingByCityList = useAppSelector(selectRankingByCityList);

  useEffect(() => {
    dispatch(dashboardActions.fetchData());
  }, [dispatch]);

  const STATISTIC_DATA = [
    {
      icon: <BoyIcon fontSize="large" color="primary" />,
      label: 'Male',
      value: statistics.maleCount,
    },
    {
      icon: <GirlIcon fontSize="large" color="primary" />,
      label: 'Female',
      value: statistics.femaleCount,
    },
    {
      icon: <ArrowCircleUpIcon fontSize="large" color="primary" />,
      label: 'Mark greater than 8',
      value: statistics.highMarkCount,
    },
    {
      icon: <ArrowCircleDownIcon fontSize="large" color="primary" />,
      label: 'Mark lower than 5',
      value: statistics.lowMarkCount,
    },
  ];

  const WIDGET_DATA = [
    {
      title: 'Student with highest mark',
      children: <StudentRankingList studentList={highestStudentList} loading={loading} />,
    },
    {
      title: 'Student with lowest mark',
      children: <StudentRankingList studentList={lowestStudentList} loading={loading} />,
    },
  ];

  return (
    <Box className={cx('wrapper')}>
      {/* Loading */}
      {loading && <LinearProgress className={cx('loading')} />}

      {/* Statistic Section */}
      <Grid container spacing={3}>
        {STATISTIC_DATA.map((item) => (
          <Grid key={item.label} item xs={12} md={6} lg={3}>
            <StatisticItem icon={item.icon} label={item.label} value={item.value} />
          </Grid>
        ))}
      </Grid>

      {/* All Student rankings */}
      <Box mt={5}>
        <Typography variant="h4">All Student</Typography>

        <Box mt={2}>
          <Grid container spacing={3}>
            {WIDGET_DATA.map((item) => (
              <Grid key={item.title} item xs={12} md={6} lg={3}>
                <Widget title={item.title}>{item.children}</Widget>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Rankings by city */}
      <Box mt={5}>
        <Typography variant="h4">Rankings by city</Typography>

        <Box mt={2}>
          <Grid container spacing={3}>
            {rankingByCityList.map((ranking) => (
              <Grid key={ranking.cityId} item xs={12} md={6} lg={3}>
                <Widget title={`TP.${ranking.cityName}`}>
                  <StudentRankingList studentList={ranking.rankingList} loading={loading} />
                </Widget>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </Box>
  );
}
