"use client"

import type * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import AtomIcon from "@/components/icons/atom"
import BracketsIcon from "@/components/icons/brackets"
import ProcessorIcon from "@/components/icons/proccesor"
import CuteRobotIcon from "@/components/icons/cute-robot"
import EmailIcon from "@/components/icons/email"
import GearIcon from "@/components/icons/gear"
import MonkeyIcon from "@/components/icons/monkey"
import DotsVerticalIcon from "@/components/icons/dots-vertical"
import { Bullet } from "@/components/ui/bullet"
import LockIcon from "@/components/icons/lock"
import Image from "next/image"
import { useIsV0 } from "@/lib/v0-context"
import BoomIcon from "@/components/icons/boom"
import { useAuth } from "@/lib/auth-context"
import LogoutIcon from "@/components/icons/logout"
import UserIcon from "@/components/icons/user"
import KeyboardIcon from "@/components/icons/keyboard"

// This is sample data for the sidebar
const data = {
  navMain: [
    {
      title: "CodeTutor",
      items: [
        {
          title: "Overview",
          url: "/",
          icon: BracketsIcon,
        },
        {
          title: "Code Editor",
          url: "/code-editor",
          icon: BracketsIcon,
        },
        {
          title: "AI Debugger",
          url: "/ai-debugger",
          icon: CuteRobotIcon,
        },
        {
          title: "Code Flow",
          url: "/code-flow",
          icon: ProcessorIcon,
        },
        {
          title: "Learning Hub",
          url: "/learning-hub",
          icon: AtomIcon,
        },
        {
          title: "Typing Trainer",
          url: "/typing-trainer",
          icon: KeyboardIcon,
        },
        {
          title: "Error History",
          url: "/error-history",
          icon: BoomIcon,
        },
        {
          title: "Workspace",
          url: "/workspace",
          icon: EmailIcon,
        },
        {
          title: "Debug History",
          url: "/debug-history",
          icon: BoomIcon,
        },
        {
          title: "Sandbox",
          url: "/sandbox",
          icon: EmailIcon,
        },
        {
          title: "Community",
          url: "/community",
          icon: ProcessorIcon,
        },
      ],
    },
  ],
  desktop: {
    title: "Desktop (Online)",
    status: "online",
  },
}

export function DashboardSidebar({ className, ...props }: React.ComponentProps<typeof Sidebar>) {
  const isV0 = useIsV0()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (url: string) => {
    if (url === "/" && pathname === "/") return true
    if (url !== "/" && pathname.startsWith(url)) return true
    return false
  }

  return (
    <Sidebar {...props} className={cn("py-sides", className)}>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-50">
        <SidebarTrigger className="shadow-lg rounded-full h-8 w-8 bg-sidebar-accent hover:bg-sidebar-accent-active" />
      </div>

      <SidebarHeader className="rounded-t-lg flex gap-3 flex-row rounded-b-none">
        <div className="flex overflow-clip size-12 shrink-0 items-center justify-center rounded bg-sidebar-primary-foreground/10 transition-colors group-hover:bg-sidebar-primary text-sidebar-primary-foreground">
          <MonkeyIcon className="size-10 group-hover:scale-[1.7] origin-top-left transition-transform" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
          <span className="text-2xl font-display whitespace-nowrap">M.O.N.K.Y.</span>
          <span className="text-xs uppercase whitespace-nowrap">The OS for Rebels</span>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {data.navMain.map((group, i) => (
          <SidebarGroup className={cn(i === 0 && "rounded-t-none")} key={group.title}>
            <SidebarGroupLabel>
              <Bullet className="mr-2" />
              {group.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem
                    key={item.title}
                    className={cn(item.locked && "pointer-events-none opacity-50")}
                    data-disabled={item.locked}
                  >
                    <SidebarMenuButton
                      asChild={!item.locked}
                      isActive={isActive(item.url)}
                      disabled={item.locked}
                      tooltip={item.title}
                      className={cn("disabled:cursor-not-allowed", item.locked && "pointer-events-none")}
                    >
                      {item.locked ? (
                        <div className="flex items-center gap-3 w-full">
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </div>
                      ) : (
                        <Link href={item.url} className="flex items-center gap-3 w-full">
                          <item.icon className="size-5" />
                          <span>{item.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                    {item.locked && (
                      <SidebarMenuBadge>
                        <LockIcon className="size-5 block" />
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-0">
        <SidebarGroup>
          <SidebarGroupLabel>
            <Bullet className="mr-2" />
            User
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {!user ? (
                <>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Login">
                      <Link href="/login" className="flex items-center gap-3 w-full">
                        <UserIcon className="size-5" />
                        <span>Login</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Sign Up">
                      <Link href="/signup" className="flex items-center gap-3 w-full">
                        <UserIcon className="size-5" />
                        <span>Sign Up</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </>
              ) : (
                <SidebarMenuItem>
                  <Popover>
                    <PopoverTrigger className="flex gap-0.5 w-full group cursor-pointer">
                      <div className="shrink-0 flex size-14 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground overflow-clip">
                        <Image
                          src={user.avatar || "/placeholder.svg?height=120&width=120&query=user+avatar"}
                          alt={user.name}
                          width={56}
                          height={56}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="group/item pl-3 pr-1.5 pt-2 pb-1.5 flex-1 flex bg-sidebar-accent hover:bg-sidebar-accent-active/75 items-center rounded group-data-[state=open]:bg-sidebar-accent-active group-data-[state=open]:hover:bg-sidebar-accent-active group-data-[state=open]:text-sidebar-accent-foreground group-data-[collapsible=icon]:hidden">
                        <div className="grid flex-1 text-left text-sm leading-tight">
                          <span className="truncate text-xl font-display">{user.name}</span>
                          <span className="truncate text-xs uppercase opacity-50 group-hover/item:opacity-100">
                            {user.email}
                          </span>
                        </div>
                        <DotsVerticalIcon className="ml-auto size-4" />
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-56 p-0" side="bottom" align="end" sideOffset={4}>
                      <div className="flex flex-col">
                        <Link href="/profile" className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                          <MonkeyIcon className="mr-2 h-4 w-4" />
                          Profile
                        </Link>
                        <Link href="/settings" className="flex items-center px-4 py-2 text-sm hover:bg-accent">
                          <GearIcon className="mr-2 h-4 w-4" />
                          Settings
                        </Link>
                        <button
                          onClick={logout}
                          className="flex items-center px-4 py-2 text-sm hover:bg-accent text-left"
                        >
                          <LogoutIcon className="mr-2 h-4 w-4" />
                          Logout
                        </button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
