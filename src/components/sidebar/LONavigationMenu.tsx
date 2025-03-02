
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Settings, Calendar, UserPlus, FolderPlus, HelpCircle, ChevronDown, PlusCircle } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function LONavigationMenu() {
  const location = useLocation();
  const [isLODropdownOpen, setIsLODropdownOpen] = useState(true);

  const loActions = [
    { id: 'manage-events', label: 'Manage Events', icon: Calendar, url: "/events" },
    { id: 'add-event', label: 'Add Event', icon: PlusCircle, url: "/add-event" },
    { id: 'invite-players', label: 'Invite Players', icon: UserPlus, url: "/invite-players" },
    { id: 'create-league', label: 'Create a New League', icon: FolderPlus, url: "/create-league" },
    { id: 'help-support', label: 'Help & Support', icon: HelpCircle, url: "/help" },
  ];

  return (
    <SidebarContent className="flex-1">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start px-4 py-2 text-sm font-semibold bg-[#FF7A00] text-white hover:bg-[#E66900] rounded-lg mb-2"
              onClick={() => setIsLODropdownOpen(!isLODropdownOpen)}
            >
              <Settings className="h-5 w-5 mr-3" />
              League Organizer
              <ChevronDown className={`ml-auto h-4 w-4 transition-transform duration-200 ${isLODropdownOpen ? 'rotate-180' : ''}`} />
            </Button>
            
            {isLODropdownOpen && (
              <div className="pl-4 mb-4">
                {loActions.map((action) => (
                  <SidebarMenuItem key={action.id}>
                    <SidebarMenuButton 
                      asChild 
                      tooltip={action.label}
                      isActive={location.pathname === action.url}
                    >
                      <Link
                        to={action.url}
                        className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                          location.pathname === action.url
                            ? "text-[#FF7A00] bg-orange-50 font-medium"
                            : "text-gray-600 hover:bg-gray-50 hover:text-[#FF7A00]"
                        }`}
                      >
                        <action.icon className={`w-4 h-4 ${location.pathname === action.url ? "text-[#FF7A00]" : "text-gray-500"}`} />
                        <span>{action.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </div>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </SidebarContent>
  );
}
