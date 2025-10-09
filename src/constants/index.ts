import { NavItem } from '@/types/sidebar';
import {
  Calendar2,
  DocumentText,
  Gift,
  Home2,
  Personalcard,
  Setting,
  Shop,
  CalendarRemove,
  CalendarTick,
} from 'iconsax-reactjs';
export const navItems = [
  {
    name: 'Home',
    link: '#home',
  },
  {
    name: 'About',
    link: '#about',
  },
  {
    name: 'Events',
    link: '#events',
  },
  {
    name: 'Showcase',
    link: '#showcase',
  },
  {
    name: 'Blog',
    link: '#blog',
  },
  {
    name: 'Join',
    link: '#join',
  },
];

export const sidebarItems = {
  teams: [{ name: 'PurwokertoDev', logo: '/img-logo.png', plan: 'Community' }],
  navMain: [
    { title: 'Dashboard', url: '/u/dashboard', icon: Home2 },
    {
      title: 'Events',
      url: '/u/events',
      icon: Calendar2,
    },
    { title: 'Articles', url: '/u/articles', icon: DocumentText },
    { title: 'Profile', url: '/u/profile', icon: Personalcard },
    {
      title: 'Rewards',
      url: '/u/rewards',
      icon: Gift,
      badge: { label: 'beta', variant: 'yellow' },
    },
    {
      title: 'Merch',
      url: '/u/merch',
      icon: Shop,
      badge: { label: 'soon', variant: 'secondary' },
    },
    { title: 'Settings', url: '/u/settings', icon: Setting },
  ] as NavItem[],
};

// dashboard dummy

export const stateData = [
  {
    title: 'Total Events',
    description: 'Jumlah semua event yang pernah kamu ikuti di komunitas ini.',
    count: 13,
    icon: Calendar2,
  },
  {
    title: 'Upcoming',
    description: 'Event yang akan datang dan belum kamu ikuti.',
    count: 2,
    icon: CalendarTick,
  },
  {
    title: 'My Articles',
    description: 'Jumlah artikel yang telah kamu tulis dan publikasikan.',
    count: 4,
    icon: DocumentText,
  },
  {
    title: 'Past Events',
    description: 'Event yang sudah kamu ikuti atau telah selesai diselenggarakan.',
    count: 9,
    icon: CalendarRemove,
  },
];
