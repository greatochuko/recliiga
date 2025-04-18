import { Link, useLocation } from "react-router-dom";
import { Home, Trophy, Calendar, BarChart, MessageSquare } from "lucide-react";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

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
  // {
  //   title: "Chat",
  //   icon: MessageSquare,
  //   url: "/chat",
  // },
];

export function NavigationMenu() {
  const location = useLocation();

  return (
    <SidebarContent className="flex-none">
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.url;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                    isActive={isActive}
                  >
                    <Link
                      to={item.url}
                      className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm ${
                        isActive
                          ? "bg-orange-50 font-medium text-accent-orange"
                          : "text-gray-600 hover:bg-gray-50 hover:text-accent-orange"
                      }`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${isActive ? "text-accent-orange" : "text-gray-500"}`}
                      />
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
  );
}
