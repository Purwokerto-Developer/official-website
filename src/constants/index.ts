import { NavItem } from '@/types/sidebar';
import {
  AddCircle,
  Calendar2,
  Category,
  DocumentText,
  Gift,
  Home2,
  Personalcard,
  Setting,
  Shop,
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
  adminNav: [
    {
      title: 'Events',
      url: '#',
      icon: Calendar2,
      items: [
        { title: 'Manage Events', url: '/u/events/manage-event', icon: Calendar2 },
        { title: 'Create events', url: '/u/events/create', icon: AddCircle },
        { title: 'Event Categories', url: '/u/events/categories', icon: Category },
      ],
    },
  ] as NavItem[],
};
