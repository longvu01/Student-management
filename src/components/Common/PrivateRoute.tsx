import config from 'config';
import { Navigate, Outlet, RouteProps } from 'react-router-dom';

export function PrivateRoute({ children }: RouteProps) {
  // Check if user is logged in
  const isLoggedIn = !!localStorage.getItem('access_token');

  if (!isLoggedIn) return <Navigate to={config.routes.login} />;

  return (
    <>
      {children}
      <Outlet />
    </>
  );
}
