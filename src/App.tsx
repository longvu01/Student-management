import { useAppDispatch } from 'app/hooks';
import { NotFound, PrivateRoute } from 'components/Common';
import config from 'config';
import { authActions } from 'features/auth/authSlice';
import LoginPage from 'features/auth/pages/LoginPage';
import firebase from 'firebase/compat/app';
import { AdminLayout } from 'layouts';
import { useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Configure Firebase.
const configFirebase = {
  apiKey: process.env.REACT_APP_API_KEY_FIREBASE,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN_FIREBASE,
};
firebase.initializeApp(configFirebase);

function App() {
  const dispatch = useAppDispatch();

  // Handle firebase auth change
  useEffect(() => {
    const unregisterAuthObserver = firebase.auth().onAuthStateChanged(async (user) => {
      if (!user) return;

      const isLoggedIn = Boolean(localStorage.getItem('access_token'));
      if (isLoggedIn) return;

      const name = user?.displayName;
      const token = await user?.getIdToken();
      const id = user?.uid;

      dispatch(
        authActions.login({
          id: id ?? '',
          username: name ?? '',
          token: token ?? '',
        })
      );
    });

    return () => unregisterAuthObserver();
  }, [dispatch]);

  return (
    <Routes>
      <Route path={config.routes.home} element={<Navigate to={config.routes.login} />} />
      <Route path={config.routes.login} element={<LoginPage />} />
      <Route
        path={`${config.routes.admin}/*`}
        element={
          <PrivateRoute>
            <AdminLayout />
          </PrivateRoute>
        }
      ></Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
