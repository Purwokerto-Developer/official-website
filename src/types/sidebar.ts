// Icons are represented by string keys in constants so the data remains serializable
export interface NavSubItem {
  title: string;
  url: string;
  badge?: {
    label: string;
    variant?: string;
  };
  // icon is a string key referencing an icon component on the client
  icon?: string;
}

export interface NavItem {
  title: string;
  url: string;
  // icon is a string key referencing an icon component on the client
  icon?: string;
  isActive?: boolean;
  badge?: {
    label: string;
    variant?: string;
  };
  items?: NavSubItem[];
}

export interface TeamItem {
  name: string;
  logo: string;
  plan: string;
}

export interface ProjectItem {
  name: string;
  url: string;
  // icon is a string key referencing an icon component on the client
  icon: string;
}

export interface SidebarItems {
  teams: TeamItem[];
  navMain: NavItem[];
  projects: ProjectItem[];
}
