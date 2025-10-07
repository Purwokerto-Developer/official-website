import { badgeVariants } from "@/components/ui/badge"
import { VariantProps } from "class-variance-authority"
import { type LucideIcon } from "lucide-react"


export interface NavSubItem {
  title: string
  url: string
  badge?: {
    label: string
    variant?: string// Make variant optional
  }
}

export interface NavItem {
  title: string
  url: string
  icon?: LucideIcon
  isActive?: boolean
  badge?: {
    label: string
    variant?: string 
  }
  items?: NavSubItem[]
}

export interface TeamItem {
  name: string
  logo: LucideIcon
  plan: string
}

export interface ProjectItem {
  name: string
  url: string
  icon: LucideIcon
}

export interface SidebarItems {
  teams: TeamItem[]
  navMain: NavItem[]
  projects: ProjectItem[]
}
