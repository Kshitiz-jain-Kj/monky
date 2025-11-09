"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import Widget from "@/components/dashboard/widget"
import Notifications from "@/components/dashboard/notifications"
import MentorChatSidebar from "@/components/codetutor/mentor-chat-sidebar"
import { MobileChat } from "@/components/chat/mobile-chat"
import Chat from "@/components/chat"
import type { MockData } from "@/types/dashboard"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Bell, PanelRightClose } from "lucide-react"
import { SidebarProvider, useSidebar } from "@/components/ui/sidebar"
import { Badge } from "@/components/ui/badge"

interface LayoutContentProps {
  children: React.ReactNode
  mockData: MockData
}

function LayoutGrid({ children, mockData }: LayoutContentProps) {
  const pathname = usePathname()
  const isCodeTutorRoute = pathname.startsWith("/codetutor")
  const [isRightSidebarVisible, setIsRightSidebarVisible] = useState(true)
  const unreadNotifications = mockData.notifications.filter((n) => !n.read).length

  const { state } = useSidebar()
  const isLeftCollapsed = state === "collapsed"

  return (
    <>
      {/* Mobile Header - only visible on mobile */}
      <MobileHeader mockData={mockData} />

      {/* Desktop Layout */}
      <div className="w-full flex lg:px-sides relative min-h-screen">
        {/* Left Sidebar - Collapsible to icon-only */}
        <div
          className={`hidden lg:flex transition-all duration-300 ${isLeftCollapsed ? "w-[var(--sidebar-width-icon)]" : "w-[var(--sidebar-width)]"}`}
        >
          <DashboardSidebar collapsible="icon" />
        </div>

        {/* Main Content - Expands based on sidebars state */}
        <div className="flex-1 transition-all duration-300 px-gap">{children}</div>

        {/* Right Sidebar - Completely collapsible */}
        <div className="hidden lg:block relative">
          <Button
            variant="outline"
            size="icon"
            className={`absolute top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full shadow-lg bg-sidebar-accent hover:bg-sidebar-accent-active transition-all duration-300 ${
              isRightSidebarVisible ? "left-0 -translate-x-1/2" : "-left-4"
            }`}
            onClick={() => setIsRightSidebarVisible(!isRightSidebarVisible)}
            aria-label={isRightSidebarVisible ? "Hide sidebar" : "Show sidebar"}
          >
            {isRightSidebarVisible ? (
              <PanelRightClose className="h-5 w-5" />
            ) : (
              <div className="relative">
                <Bell className="h-5 w-5" />
                {unreadNotifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 h-5 min-w-5 flex items-center justify-center rounded-full p-0 px-1 text-xs font-bold"
                  >
                    {unreadNotifications > 99 ? "99+" : unreadNotifications}
                  </Badge>
                )}
              </div>
            )}
          </Button>

          <div
            className={`flex flex-col gap-gap py-sides pr-gap min-h-screen transition-all duration-300 ${
              isRightSidebarVisible ? "w-[320px] opacity-100" : "w-0 opacity-0 overflow-hidden"
            }`}
          >
            <Widget widgetData={mockData.widgetData} />
            <div className="flex-1">
              {isCodeTutorRoute ? (
                <MentorChatSidebar />
              ) : (
                <Notifications initialNotifications={mockData.notifications} />
              )}
            </div>
          </div>
        </div>

        <div className="hidden lg:block fixed bottom-6 right-6 z-50 w-[400px]">
          <Chat />
        </div>
      </div>

      {/* Mobile Chat - floating CTA with drawer */}
      <MobileChat />
    </>
  )
}

export default function LayoutContent({ children, mockData }: LayoutContentProps) {
  const pathname = usePathname()
  const isAuthPage = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"

  if (isAuthPage) {
    return <>{children}</>
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <LayoutGrid mockData={mockData}>{children}</LayoutGrid>
    </SidebarProvider>
  )
}
