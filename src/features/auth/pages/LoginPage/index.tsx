import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { useAppSelector } from 'app/hooks';
import classNames from 'classnames/bind';
import config from 'config';
import { selectIsLogging } from 'features/auth/authSlice';
import StyledFirebaseAuth from 'features/auth/components/StyledFirebaseAuth';
import firebase from 'firebase/compat/app';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LoginPage.module.scss';

const cx = classNames.bind(styles);

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // We will display Google and Facebook as auth providers.
  signInOptions: [firebase.auth.GoogleAuthProvider.PROVIDER_ID],
};

export default function LoginPage() {
  const navigate = useNavigate();
  const isLogging = useAppSelector(selectIsLogging);

  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('access_token');
  useEffect(() => {
    if (isLoggedIn) navigate(config.routes.dashboard);
  }, [isLoggedIn, navigate]);

  return (
    <div className={cx('root')}>
      <Paper elevation={1} className={cx('box')}>
        <Typography variant="h5" component="h1">
          Student Management
        </Typography>

        <Box mt={4}>
          {isLogging && <CircularProgress size={20} color="secondary" />}
          <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
        </Box>
      </Paper>
    </div>
  );
}
