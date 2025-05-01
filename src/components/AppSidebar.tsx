import { Link } from "react-router-dom";
import { Sidebar, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ConditionalNavigationMenu } from "./sidebar/ConditionalNavigationMenu";
import { UserMenu } from "./sidebar/UserMenu";
import { NotificationsPopover } from "./sidebar/NotificationsPopover";

export function AppSidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="relative">
      <Sidebar className="border-r border-gray-200 bg-white">
        <div className="flex h-full flex-col">
          <div className="border-b border-gray-200 p-4">
            <Link
              to={"/"}
              className="w-fit cursor-pointer text-2xl font-bold text-accent-orange transition-colors hover:text-[#FF9A30]"
              onClick={toggleSidebar}
            >
              REC LiiGA
            </Link>
          </div>

          {/* User Profile */}
          <div className="border-b border-gray-200 p-2">
            <div className="flex items-center justify-between">
              <NotificationsPopover />
              <UserMenu />
            </div>
          </div>

          {/* Navigation Menu */}
          <ConditionalNavigationMenu />

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 text-sm text-gray-500">
            &copy; {new Date().getFullYear()} REC LiiGA. All rights reserved.
          </div>
        </div>
      </Sidebar>
      <div className="absolute -right-10 top-4 z-50 flex items-center">
        <SidebarTrigger className="z-[20] bg-white shadow-md" />
      </div>
    </div>
  );
}
