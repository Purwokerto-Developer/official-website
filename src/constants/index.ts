// Demo data for EventList component

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

// Demo data for EventStats component
export const demoEventStats = {
  stats: [
    { label: 'total', value: '4K' },
    { label: 'online', value: '6.2K' },
    { label: 'offline', value: '100' },
  ],
};

export const demoEventList = [
  {
    id: 1,
    title: 'React Workshop',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 23,
    type: 'online',
    date: '2025-10-15',
    location: 'Zoom',
    buyNow: 'Free',
    highestBid: '-',
  },
  {
    id: 2,
    title: 'Frontend Meetup',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 15,
    type: 'offline',
    date: '2025-11-01',
    location: 'Coworking Space',
    buyNow: 'Free',
    highestBid: '-',
  },
  {
    id: 3,
    title: 'Backend Bootcamp',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 30,
    type: 'online',
    date: '2025-12-05',
    location: 'Google Meet',
    buyNow: 'Free',
    highestBid: '-',
  },
  {
    id: 4,
    title: 'Tech Talk: AI',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 18,
    type: 'offline',
    date: '2025-12-20',
    location: 'Universitas Jenderal Soedirman',
    buyNow: 'Free',
    highestBid: '-',
  },
  {
    id: 5,
    title: 'UI/UX Seminar',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 12,
    type: 'online',
    date: '2026-01-10',
    location: 'Zoom',
    buyNow: 'Free',
    highestBid: '-',
  },
  {
    id: 6,
    title: 'Startup Pitch Day',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 27,
    type: 'offline',
    date: '2026-02-01',
    location: 'Startup Hub',
    buyNow: 'Free',
    highestBid: '-',
  },
  {
    id: 7,
    title: 'Startup Pitch Day',
    creator: 'Purwokerto Dev',
    image: '',
    likes: 27,
    type: 'offline',
    date: '2026-02-01',
    location: 'Startup Hub',
    buyNow: 'Free',
    highestBid: '-',
  },
];
