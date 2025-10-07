
import { NavItem } from "@/types/sidebar"
import {Calendar2, DocumentText, Gift, Home2, Personalcard,Setting,Shop} from "iconsax-reactjs"
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



export const sidebarItems  = {
  teams: [
    { name: "PurwokertoDev", logo: '/img-logo.png', plan: "Community" },
   
  ],
  navMain: [
    { title: "Dashboard", url: "/u/dashboard", icon: Home2 },
    {
      title: "Events",
      url: "#",
      icon: Calendar2,
      items: [
        { title: "All Events", url: "/u/events" },
        { title: "My Events", url: "/u/events/mine", badge: { label: "new", variant: "green" } },
        { title: "Upcoming", url: "/u/events/upcoming" },
        { title: "History", url: "/u/events/history" },
      ],
    },
    { title: "Articles", url: "/u/articles", icon: DocumentText },
    { title: "Profile", url: "/u/profile", icon: Personalcard },
    {
      title: "Rewards",
      url: "/u/rewards",
      icon: Gift,
      badge: { label: "beta", variant:"yellow" },
    },
    {
      title: "Merch",
      url: "/u/merch",
      icon: Shop,
      badge: { label: "soon", variant: "secondary" },
    },
    { title: "Settings", url: "/u/settings", icon: Setting },
  ] as NavItem[],
  
} 

