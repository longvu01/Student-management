import { Box, Paper, Typography } from '@mui/material';
import classNames from 'classnames/bind';
import { ReactNode } from 'react';
import styles from '../Dashboard.module.scss';

const cx = classNames.bind(styles);

export interface WidgetProps {
  title: string;
  children: ReactNode;
}

export default function Widget({ title, children }: WidgetProps) {
  return (
    <Paper className={cx('widget-wrapper')}>
      <Typography variant="button">{title}</Typography>

      <Box mt={2}>{children}</Box>
    </Paper>
  );
}
