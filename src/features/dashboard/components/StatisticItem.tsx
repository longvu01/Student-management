import { Box, Paper, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import { ReactElement } from 'react';
import CountUp from 'react-countup';
import styles from '../Dashboard.module.scss';

const cx = classNames.bind(styles);

export interface StatisticItemProps {
  icon: ReactElement;
  label: string;
  value: string | number;
}

export default function StatisticItem({ icon, label, value }: StatisticItemProps) {
  return (
    <Paper className={cx('item-wrapper')}>
      <Box>{icon}</Box>

      <Box>
        <CountUp start={0} end={+value} delay={0} duration={2}>
          {({ countUpRef }) => <Typography ref={countUpRef} variant="h5" align="right" />}
        </CountUp>
        <Typography variant="caption">{label}</Typography>
      </Box>
    </Paper>
  );
}
