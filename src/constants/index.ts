import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Gift,
  Home,
  Map,
  PieChart,
  Settings2,
  Shirt,
  User
} from "lucide-react"
export const navItems = [
    {
      name: "Home",
      link: "#home",
    },
    {
      name: "About",
      link: "#about",
    },
    {
      name: "Events",
      link: "#events",
    },
    {
        name:"Showcase",
        link:"#showcase",
    },
    {
        name: "Blog",
        link: "#blog",
    },
    {
        name: "Join",
        link: "#join",
    }
]



export const sidebarItems = {
  teams: [
    { name: "PurwokertoDev", logo: GalleryVerticalEnd, plan: "Community" },
    { name: "TegalSec", logo: AudioWaveform, plan: "Partner" },
    { name: "Amikom Labs", logo: Command, plan: "Education" },
  ],
  navMain: [
    { title: "Dashboard", url: "/u/dashboard", icon: Home },
    {
      title: "Events",
      url: "#",
      icon: Bot,
      items: [
        { title: "All Events", url: "/u/events" },
        { title: "My Events", url: "/u/events/mine", badge: { label: "new", variant: "green" } },
        { title: "Upcoming", url: "/u/events/upcoming" },
        { title: "History", url: "/u/events/history" },
      ],
    },
    { title: "Articles", url: "/u/articles", icon: BookOpen },
    { title: "Profile", url: "/u/profile", icon: User },
    {
      title: "Rewards",
      url: "/u/rewards",
      icon: Gift,
      badge: { label: "beta", variant:"yellow" },
    },
    {
      title: "Merch",
      url: "/u/merch",
      icon: Shirt,
      badge: { label: "soon", variant: "secondary" },
    },
    { title: "Settings", url: "/u/settings", icon: Settings2 },
  ],
  projects: [
    { name: "Community Development", url: "#", icon: Frame },
    { name: "Marketing", url: "#", icon: PieChart },
    { name: "Exploration", url: "#", icon: Map },
  ],
} 

