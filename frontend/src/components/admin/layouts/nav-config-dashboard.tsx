import { Label } from '../components/label';
import { SvgColor } from '../components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => <SvgColor src={`src/assets/icons/navbar/${name}.svg`} />;

export type NavItem = {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
};

export const navData = [
  {
    title: 'Dashboard',
    path: '/admin/dashboard',
    icon: icon('ic-analytics'),
  },
  {
    title: 'User',
    path: '/admin/users',
    icon: icon('ic-user'),
  },
  {
    title: 'Movie',
    path: '/admin/movies',
    icon: icon('ic-cart'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Showtime',
    path: '/admin/showtime',
    icon: icon('ic-blog'),
  },
  {
    title: 'Room',
    path: '/admin/room',
  },
  {
    title: 'Booking',
    path: '/admin/booking',
  },
  
];
