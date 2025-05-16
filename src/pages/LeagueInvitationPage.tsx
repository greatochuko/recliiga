import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CheckCircle2,
  XCircle,
  ArrowLeftIcon,
  AlertTriangle,
  Loader,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { fetchLeaguesByCode, joinLeague } from "@/api/league";
import FullScreenLoader from "@/components/FullScreenLoader";
import { toast } from "sonner";
import { useState } from "react";
import { getInitials } from "@/lib/utils";

export default function LeagueInvitationPage() {
  const navigate = useNavigate();
  const { leagueCode } = useParams();

  const [loading, setLoading] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: [`league-code-${leagueCode}`],
    queryFn: () => fetchLeaguesByCode(leagueCode),
  });

  if (isLoading) {
    return <FullScreenLoader className="h-full" />;
  }

  const league = data?.league;

  if (!league) {
    return (
      <div className="flex w-full flex-col items-center justify-center px-4 py-16 text-center">
        <AlertTriangle className="mb-4 h-12 w-12 text-accent-orange" />
        <h1 className="text-4xl font-bold text-gray-800">League Not Found</h1>
        <p className="mt-4 text-gray-600">
          The league you&apos;re looking for doesn&apos;t exist or may have been
          removed.
        </p>
        <Link
          to={"/dashboard"}
          className="mt-6 flex items-center gap-1 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90"
        >
          <ArrowLeftIcon className="h-5 w-5" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const handleAccept = async () => {
    setLoading(true);
    const { error } = await joinLeague(leagueCode);
    if (error) {
      toast.error(error, { style: { color: "#ef4444" } });
    }
    setLoading(false);
    navigate("/dashboard/leagues");
  };

  const handleReject = async () => {
    navigate("/dashboard");
  };

  return (
    <main className="flex flex-1 flex-col items-center justify-center">
      <div className="w-full max-w-md rounded-lg px-6 py-10">
        <div className="mb-6 flex flex-col items-center gap-4">
          {/* <Users className="mb-4 h-12 w-12 text-accent-orange" /> */}
          {league.image ? (
            <img
              src={league.image}
              alt=""
              className="h-20 w-20 rounded-full border-2 border-accent-orange bg-white"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-accent-orange bg-white text-2xl font-bold text-accent-orange">
              {getInitials(league.name)}
            </div>
          )}
          <h1 className="text-2xl font-bold text-gray-800">
            League Invitation
          </h1>
          <p className="text-gray-600">
            You’ve been invited to join{" "}
            <span className="font-semibold text-accent-orange">
              {league.name}
            </span>
            .
          </p>
        </div>
        <div className="mt-6 flex flex-col gap-3">
          <button
            onClick={handleAccept}
            disabled={loading}
            className="flex items-center justify-center gap-2 rounded-md bg-accent-orange px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange/90 disabled:bg-accent-orange/50"
          >
            {loading ? (
              <Loader className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <CheckCircle2 className="h-5 w-5" />
                Accept Invitation
              </>
            )}
          </button>
          <button
            onClick={handleReject}
            className="flex items-center justify-center gap-2 rounded-md border border-accent-orange px-4 py-2 text-sm font-medium text-accent-orange duration-200 hover:bg-accent-orange/10"
          >
            <XCircle className="h-5 w-5" />
            Reject Invitation
          </button>
        </div>
      </div>

      <Link
        to={"/dashboard"}
        className="mt-6 flex items-center gap-1 text-sm font-medium text-accent-orange duration-200 hover:underline"
      >
        <ArrowLeftIcon className="h-4 w-4" />
        Go Home
      </Link>
    </main>
  );
}
