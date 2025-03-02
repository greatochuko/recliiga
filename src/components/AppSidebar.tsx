import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { ConditionalNavigationMenu } from "./sidebar/ConditionalNavigationMenu";
import { UserMenu } from "./sidebar/UserMenu";
import { NotificationsPopover } from "./sidebar/NotificationsPopover";
import { useMobile } from "@/hooks/use-mobile";

export function AppSidebar() {
  return (
    <>
      <Sidebar className="border-r border-gray-200 bg-white">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-[#FF7A00] text-2xl font-bold">REC LiiGA</h1>
            </div>
          </div>

          {/* User Profile */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <NotificationsPopover />
              <UserMenu />
            </div>
          </div>

          {/* Navigation Menu */}
          <ConditionalNavigationMenu />

          {/* Footer */}
          <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
            © 2024 REC LiiGA. All rights reserved.
          </div>
        </div>
      </Sidebar>
      <SidebarRail />
    </>
  )
}
