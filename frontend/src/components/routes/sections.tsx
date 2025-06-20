import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from '../admin/layouts/auth';
import { DashboardLayout } from '../admin/layouts/dashboard';
import Login from '../Login';
import Register from '../Register';
import VerifyEmail from '../VerifyEmail';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import Home from '../Home';
import MovieList from '../MovieList';
import MovieDetail from '../MovieDetail';
import AdminRoute from './AdminRoute';
import BookingAdminW from '../admin/pages/BookingAdmin';
// import ShowtimeSchedule from '../ShowtimeSchedule';
// import SeatSelector from '../SeatSelector';
// import Home from '../Home';

// ----------------------------------------------------------------------

export const DashboardPage = lazy(() => import('../admin/pages/dashboard'));
export const BlogPage = lazy(() => import('../admin/pages/blog'));
export const UserPage = lazy(() => import('../admin/pages/user'));
export const SignInPage = lazy(() => import('../admin/pages/sign-in'));
export const Movie = lazy(() => import('../admin/pages/MovieAdmin'));
export const Page404 = lazy(() => import('../admin/pages/page-not-found'));
export const Hello = lazy(() => import('../Hello'));
export const SeatSelector = lazy(() => import('../SeatSelector'));
export const Checkout =lazy(()=> import(`../Checkout`));
export const Ticket =lazy(()=> import(`../Ticket`));
export const ShowTimeAdmin =lazy(()=> import(`../admin/pages/ShowTimeAdmin`));
export const RoomAdmin =lazy(()=> import(`../admin/pages/RoomAdmin`));

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
                <Home />
            </Suspense>
        ),
    },
    {
        path: '/movie',
        element: (
            <Suspense fallback={renderFallback()}>
                <MovieList />
            </Suspense>
        ),
    },
    {
        path: '/movie/:id',
        element: (
            <Suspense fallback={renderFallback()}>
                <MovieDetail />
            </Suspense>
        ),
    },
    {
        path: '/admin',
        element: <AdminRoute />,
        children: [
            {
                path: '',
                element: (
                    <DashboardLayout>
                        <Suspense fallback={renderFallback()}>
                            <Outlet />
                        </Suspense>
                    </DashboardLayout>
                ),
                children: [
                    { path: 'dashboard', element: <DashboardPage /> },
                    { path: 'users', element: <UserPage /> },
                    { path: 'movies', element: <Movie /> },
                    { path: 'showtime', element: <ShowTimeAdmin /> },
                    { path: 'room', element: <RoomAdmin /> },
                    { path: 'booking', element: <BookingAdminW /> },
                ],
            },
        ],
    },
    {
        path: '/login',
        element: (
            <Login />
        ),
    },
    {
        path: '/verify-email',
        element: (
            <VerifyEmail />
        ),
    },
    {
        path: '/forgot-password',
        element: (
            <ForgotPassword />
        ),
    },
    {
        path: '/reset-password',
        element: (
            <ResetPassword />
        ),
    },
    {
        path: '/register',
        element: (
            <Register />
        ),
    },
    {
        path: '/sign-in',
        element: (
            <SignInPage />
        ),
    },
    {
        // path: '/booking/chooseSeat/:showtimeId',
        path: '/booking/:bookingId/:movieId/:showtimeId/choose-seat',
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
];
