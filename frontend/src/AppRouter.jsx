import { createBrowserRouter, RouterProvider } from 'react-router';
import { lazy, Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';
import App from './App';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

const Admin = lazy(() => import('./pages/Admin'));
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const ProductCardDetail = lazy(() => import('./pages/ProductCardDetail'));
const Profile = lazy(() => import('./pages/Profile'));
const Register = lazy(() => import('./pages/Register'));

function page(Component) {
  return (
    <Suspense fallback={<Box display="flex" justifyContent="center" py={8}><CircularProgress aria-label="Loading page" /></Box>}>
      <Component />
    </Suspense>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: page(Home) },
      { path: 'login', element: page(Login) },
      { path: 'register', element: page(Register) },
      { path: 'product/:type/:id', element: page(ProductCardDetail) },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'profile/:id', element: page(Profile) },
          {
            path: 'admin',
            element: <ProtectedRoute requiredRole="ADMIN" />,
            children: [{ index: true, element: page(Admin) }]
          }
        ]
      }
    ]
  }
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
