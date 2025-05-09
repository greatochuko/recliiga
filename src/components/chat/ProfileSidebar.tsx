import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeftIcon, Eye, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatType } from "@/pages/Chat";
import { getInitials } from "@/lib/utils";
import { useSidebar } from "../ui/sidebar";

export default function ProfileSidebar({
  activeConversation,
  closeProfileView,
}: {
  activeConversation: ChatType;
  closeProfileView: () => void;
}) {
  const { open } = useSidebar();

  return (
    <aside
      className={`${open ? "xl:flex-none" : "lg:flex-none"} relative w-64 flex-1 border-l border-gray-200 p-4`}
    >
      <button
        onClick={closeProfileView}
        className="absolute left-4 top-4 p-2 duration-200 hover:text-accent-orange xl:hidden"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
      <div className="flex flex-col items-center">
        <Avatar className="mb-4 h-24 w-24">
          <AvatarImage
            src={activeConversation.avatar}
            alt={activeConversation.name}
          />
          <AvatarFallback className="bg-accent-orange text-2xl text-white">
            {activeConversation.type === "group" ? (
              <Users className="h-12 w-12" />
            ) : (
              getInitials(activeConversation.name)
            )}
          </AvatarFallback>
        </Avatar>
        <h4 className="text-lg font-medium text-accent-orange">
          {activeConversation.name}
        </h4>
        <p className="mb-2 text-sm text-[#707B81]">
          {activeConversation.type === "group"
            ? "Group Chat"
            : `${
                activeConversation.role === "organizer"
                  ? "League Organizer"
                  : "Player"
              } | New York`}
        </p>
        <p className="mb-8 text-sm text-[#707B81]">
          {activeConversation.type === "group"
            ? `${activeConversation.members?.length || 0} members`
            : "7:08 PM EST"}
        </p>
        <div className="w-full space-y-2">
          <Button variant="outline" className="w-full justify-start">
            <Eye className="mr-2 h-4 w-4 text-accent-orange" />
            {activeConversation.type === "group"
              ? "View League Info"
              : "View Profile"}
          </Button>
        </div>
        {activeConversation.type === "group" && activeConversation.members && (
          <div className="mt-4 w-full">
            <h5 className="mb-2 text-sm font-medium text-[#707B81]">Members</h5>
            <div className="max-h-[300px] overflow-y-auto">
              {activeConversation.members.map((member, index) => (
                <div key={index} className="mb-2 flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={member.image} alt={member.name} />
                    <AvatarFallback>{member.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-[#707B81]">{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
