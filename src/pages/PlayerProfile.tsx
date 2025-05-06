import { useNavigate, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageCircle, ArrowLeftIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import FullScreenLoader from "@/components/FullScreenLoader";
import { fetchUserProfile } from "@/api/user";
import ProfilePlayerStats from "@/components/profile/ProfilePlayerStats";

export default function PlayerProfile() {
  const navigate = useNavigate();

  const { userId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: [`userProfile-${userId}`],
    queryFn: async () => fetchUserProfile(userId),
  });

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const profile = data?.data;

  if (!profile) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-gray-800">Player Not Found</h1>
        <p className="mt-4 text-gray-600">
          The player profile you are looking for does not exist or has been
          removed.
        </p>
        <Button
          onClick={() => navigate(-1)}
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Go Back
        </Button>
      </div>
    );
  }

  return (
    <main className="relative flex flex-1 flex-col gap-6 bg-background pb-10">
      <div className="relative ml-8 flex items-center justify-between">
        <h1 className="ml-0 text-2xl font-bold">Player Profile</h1>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 rounded-md p-1.5 px-3 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          Previous
        </button>
      </div>

      <div className="mb-8 rounded-lg bg-gradient-to-b from-accent-orange/10 to-white px-3 pb-3 pt-8 shadow-sm">
        <div className="mb-6 flex flex-col items-center">
          <Avatar className="h-32 w-32 outline outline-2 outline-offset-4 outline-accent-orange">
            <AvatarImage
              src={profile.avatar_url}
              alt={`${profile.full_name} Profile picture`}
              className="object-cover"
            />
            <AvatarFallback>
              {profile.full_name
                .split(" ")
                .slice(0, 2)
                .map((n) => n[0])}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="text-center">
          <h2 className="mb-1 text-xl font-semibold text-gray-800">
            {profile.full_name}
          </h2>
          <p className="mb-3 text-base text-gray-600">
            {profile.positions[0]}, {profile.city}
          </p>
          <Button
            variant="outline"
            disabled
            className="border-accent-orange text-accent-orange transition-colors duration-200 hover:bg-accent-orange hover:text-white"
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Message
          </Button>
        </div>
      </div>

      <ProfilePlayerStats user={profile} />
    </main>
  );
}
