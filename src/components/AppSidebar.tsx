
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Home, Trophy, Calendar, BarChart, MessageSquare, Bell, User, ChevronDown } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export function AppSidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      title: "Home",
      icon: Home,
      url: "/",
    },
    {
      title: "Leagues",
      icon: Trophy,
      url: "/leagues",
    },
    {
      title: "Events",
      icon: Calendar,
      url: "/events",
    },
    {
      title: "Results",
      icon: BarChart,
      url: "/results",
    },
    {
      title: "Chat",
      icon: MessageSquare,
      url: "/chat",
    },
  ];

  return (
    <Sidebar className="border-r border-gray-200 bg-white">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-[#FF7A00] text-2xl font-bold">REC LiiGA</h1>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              <Badge variant="secondary" className="bg-[#FF7A00] text-white">4</Badge>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium">John Doe</span>
              <ChevronDown className="w-4 h-4 text-gray-500" />
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <SidebarContent className="flex-1">
          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenu>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.url;
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link 
                          to={item.url} 
                          className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm ${
                            isActive 
                              ? "text-[#FF7A00] bg-orange-50 font-medium" 
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <item.icon className={`w-5 h-5 ${isActive ? "text-[#FF7A00]" : "text-gray-500"}`} />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 text-sm text-gray-500">
          © 2024 REC LiiGA. All rights reserved.
        </div>
      </div>
    </Sidebar>
  );
}
