import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from '../admin/layouts/auth';
import { DashboardLayout } from '../admin/layouts/dashboard';
// import { Hello } from '../Hello';
import ShowtimeSchedule from '../ShowtimeSchedule';
// import SeatSelector from '../SeatSelector';
// import Home from '../Home';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('../admin/pages/dashboard'));
export const BlogPage = lazy(() => import('../admin/pages/blog'));
export const UserPage = lazy(() => import('../admin/pages/user'));
export const SignInPage = lazy(() => import('../admin/pages/sign-in'));
export const ProductsPage = lazy(() => import('../admin/pages/products'));
export const Page404 = lazy(() => import('../admin/pages/page-not-found'));
export const Hello = lazy(() => import('../Hello'));
export const SeatSelector = lazy(() => import('../SeatSelector'));
export const Checkout =lazy(()=> import(`../Checkout`));
export const Ticket =lazy(()=> import(`../Ticket`));

const renderFallback = () => (
  <Box
    sx={{
      display: 'flex',
      flex: '1 1 auto',
      alignItems: 'center',
      justifyContent: 'center',
    }}
  >
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

export const routesSection: RouteObject[] = [
   {
    path: '/',
    element: (
      <Suspense fallback={renderFallback()}>
        <Hello />
      </Suspense>
    ),
  },
  {
    path:'/admin/',
    element: (
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
      </DashboardLayout>
    ),
    children: [
      { path: 'dashboard', element: <DashboardPage /> },
      { path: 'user', element: <UserPage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'blog', element: <BlogPage /> },
    ],
  },
  {
    path: 'sign-in',
    element: (
      <AuthLayout>
        <SignInPage />
      </AuthLayout>
    ),
  },
  {
    path: '404',
    element: <Page404 />,
  },
  { path: '*', element: <Page404 /> },
  // {
  //   path:'/booking',
  //   element: (
  //     <DashboardLayout>
  //       <Suspense fallback={renderFallback()}>
  //         <Outlet />
  //       </Suspense>
  //     </DashboardLayout>
  //   ),
  //   children: [
  //     { path: '/showtime', element: <ShowtimeSchedule /> },
  //     { path: '/chooseseat', element: <UserPage /> },

  //   ],
  // },
    {
    path: '/book',
    element: <SeatSelector />,
  },
    {
    path: '/checkout',
    element: <Checkout />,
  },
   {
    path: '/ticket',
    element: <Ticket />,
  },
  
  

];
