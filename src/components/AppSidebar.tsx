import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/ui/sidebar";
import { ConditionalNavigationMenu } from "./sidebar/ConditionalNavigationMenu";
import { UserMenu } from "./sidebar/UserMenu";
import { NotificationsPopover } from "./sidebar/NotificationsPopover";

export function AppSidebar() {
  const navigate = useNavigate();

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <h1
              className="text-accent-orange cursor-pointer text-2xl font-bold transition-colors hover:text-[#FF9A30]"
              onClick={handleLogoClick}
            >
              REC LiiGA
            </h1>
          </div>
        </div>

        {/* User Profile */}
        <div className="border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <NotificationsPopover />
            <UserMenu />
          </div>
        </div>

        {/* Navigation Menu */}
        <ConditionalNavigationMenu />

        {/* Footer */}
        <div className="border-t border-gray-200 p-4 text-sm text-gray-500">
          © 2024 REC LiiGA. All rights reserved.
        </div>
      </div>
    </Sidebar>
  );
}
