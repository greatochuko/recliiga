
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { 
  Home, 
  Trophy, 
  Calendar, 
  BarChart, 
  MessageSquare, 
  Bell, 
  User, 
  ChevronDown,
  UserPlus,
  Trash2,
  LogOut
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";

interface Notification {
  id: string;
  title: string;
  time: string;
  isNew?: boolean;
}

export function AppSidebar() {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const notifications: Notification[] = [
    {
      id: '1',
      title: 'New message from Team A',
      time: '2 minutes ago',
      isNew: true
    },
    {
      id: '2',
      title: 'Upcoming event: Tournament Finals',
      time: '1 hour ago',
      isNew: true
    },
    {
      id: '3',
      title: 'League standings updated',
      time: 'Yesterday, 3:45 PM'
    },
    {
      id: '4',
      title: 'New team joined the league',
      time: 'May 15, 2024'
    }
  ];

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

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/sign-in');
      toast.success('Successfully logged out');
    } catch (error) {
      toast.error('Error logging out');
    }
  };

  const handleDeleteAccount = () => {
    // This will be implemented later
    toast.info('Delete account functionality will be implemented soon');
  };

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
            <Popover>
              <PopoverTrigger asChild>
                <button className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-gray-500" />
                  <Badge variant="secondary" className="bg-[#FF7A00] text-white">4</Badge>
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0" align="start">
                <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-semibold">New</h2>
                </div>
                <div className="max-h-[400px] overflow-y-auto">
                  {notifications.map((notification, index) => (
                    <div
                      key={notification.id}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        index < notifications.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    >
                      <div className="flex gap-3 items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium">John Doe</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="p-2">
                  <h3 className="text-lg font-semibold px-2 py-1.5">My Account</h3>
                </div>
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="flex items-center gap-2 cursor-pointer">
                    <User className="w-4 h-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/invite-players" className="flex items-center gap-2 cursor-pointer">
                    <UserPlus className="w-4 h-4" />
                    <span>Invite Players</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDeleteAccount} className="text-red-600">
                  <Trash2 className="w-4 h-4 mr-2" />
                  <span>Delete Account</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
