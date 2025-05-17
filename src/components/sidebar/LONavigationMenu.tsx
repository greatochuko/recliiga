import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Settings,
  Calendar,
  UserPlus,
  FolderPlus,
  HelpCircle,
  ChevronDown,
} from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import InvitePopup from "@/components/InvitePopup";

export function LONavigationMenu({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const location = useLocation();
  const [isLODropdownOpen, setIsLODropdownOpen] = useState(false);
  const [showInvitePopup, setShowInvitePopup] = useState(false);

  useEffect(() => {
    const loPathsPattern = /^\/(manage-events|create-league|help|add-event)/;
    if (loPathsPattern.test(location.pathname)) {
      setIsLODropdownOpen(true);
    }
  }, [location.pathname]);

  const loActions = [
    {
      id: "manage-events",
      label: "Manage Events",
      icon: Calendar,
      url: "/dashboard/manage-events",
    },
    {
      id: "create-league",
      label: "Create League",
      icon: FolderPlus,
      url: "/dashboard/create-league",
    },
    {
      id: "invite-players",
      label: "Invite Players",
      icon: UserPlus,
      url: "#",
      action: () => setShowInvitePopup((prev) => !prev),
    },
    {
      id: "help-support",
      label: "Help & Support",
      icon: HelpCircle,
      url: "/dashboard/help",
    },
  ];

  return (
    <SidebarContent className="flex-1">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <Button
              variant="ghost"
              size="sm"
              className="mb-2 w-full justify-start rounded-lg bg-accent-orange px-4 py-2 text-sm font-semibold text-white hover:bg-[#E66900] hover:text-white"
              onClick={() => setIsLODropdownOpen(!isLODropdownOpen)}
            >
              <Settings className="mr-3 h-5 w-5" />
              League Organizer
              <ChevronDown
                className={`ml-auto h-4 w-4 transition-transform duration-200 ${
                  isLODropdownOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {isLODropdownOpen && (
              <div className="mb-4 pl-4">
                {loActions.map((action) => (
                  <SidebarMenuItem key={action.id}>
                    <SidebarMenuButton
                      asChild
                      tooltip={action.label}
                      isActive={location.pathname === action.url}
                    >
                      {action.action ? (
                        <button
                          onClick={action.action}
                          className={`flex w-full items-center gap-3 rounded-lg px-4 py-2 text-left text-sm ${
                            location.pathname === action.url
                              ? "bg-orange-50 font-medium text-accent-orange"
                              : "text-gray-600 hover:bg-gray-50 hover:text-accent-orange"
                          }`}
                        >
                          <action.icon
                            className={`h-4 w-4 ${
                              location.pathname === action.url
                                ? "text-accent-orange"
                                : "text-gray-500"
                            }`}
                          />
                          <span>{action.label}</span>
                        </button>
                      ) : (
                        <Link
                          to={action.url}
                          onClick={toggleSidebar}
                          className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm ${
                            location.pathname === action.url
                              ? "bg-orange-50 font-medium text-accent-orange"
                              : "text-gray-600 hover:bg-gray-50 hover:text-accent-orange"
                          }`}
                        >
                          <action.icon
                            className={`h-4 w-4 ${
                              location.pathname === action.url
                                ? "text-accent-orange"
                                : "text-gray-500"
                            }`}
                          />
                          <span>{action.label}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <InvitePopup
        closeModal={() => setShowInvitePopup(false)}
        open={showInvitePopup}
      />
    </SidebarContent>
  );
}
