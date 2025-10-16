import { useState } from "react";
import { Copy, Send, AlertCircle, Info, Loader2 } from "lucide-react";
import ModalContainer from "./ModalContainer";
import { fetchLeaguesByUser } from "@/api/league";
import { useQuery } from "@tanstack/react-query";
import { sendInvitationEmail } from "@/api/email";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function InvitePopup({
  closeModal,
  open,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const { user } = useAuth();

  const { data: leaguesData, isLoading } = useQuery({
    queryKey: ["teammates"],
    queryFn: fetchLeaguesByUser,
  });

  const leagues = leaguesData?.leagues || [];

  const [email, setEmail] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedLeagueCode, setSelectedLeagueCode] = useState<string>();
  const [error, setError] = useState<string | null>(null);

  const inviteLink = `${window.location.origin}/dashboard/invite/${selectedLeagueCode || ""}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = async () => {
    if (!email.trim() || !selectedLeagueCode) return;

    const selectedLeague = leagues.find(
      (lg) => lg.leagueCode === selectedLeagueCode,
    );

    if (!selectedLeague) {
      setError("Please select a valid league");
      return;
    }

    setLoading(true);

    const { error } = await sendInvitationEmail(email, {
      invitationLink: inviteLink,
      leagueName: selectedLeague.name,
      leagueOrganizerFirstName: user.full_name.split(" ")[0],
      leagueImage: selectedLeague.image,
    });

    if (error) {
      setError("");
    } else {
      toast.success("Invitation sent successfully!", {
        style: { color: "#16a34a" },
      });
      setError(null);
      setEmail("");
    }

    setLoading(false);
  };

  return (
    <ModalContainer open={open} closeModal={closeModal}>
      <div className="mx-auto w-[90%] max-w-md rounded-lg bg-white p-6 shadow-md sm:max-w-md">
        <div className="space-y-4">
          <div className="flex justify-center">
            <span className="text-4xl font-bold text-accent-orange">
              REC LiiGA
            </span>
          </div>
          <h2 className="text-center text-2xl font-semibold text-gray-800">
            Share Invite Link
          </h2>
        </div>

        <div className="mt-4 space-y-4">
          <div className="flex items-start gap-2 rounded-md border border-accent-orange bg-accent-orange/10 p-3 text-sm text-accent-orange">
            <Info className="mt-0.5 h-4 w-4" />
            <p>
              This invite link will expire in 7 days. Share it with your team
              members soon!
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="league" className="text-sm text-gray-700">
              Select League
            </label>
            <select
              name="league"
              id="league"
              className="rounded-md border p-2 text-sm"
              value={selectedLeagueCode}
              disabled={isLoading}
              onChange={(e) => setSelectedLeagueCode(e.target.value)}
            >
              <option hidden>Select League</option>
              {leagues.map((league) => (
                <option key={league.id} value={league.leagueCode}>
                  {league.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label htmlFor="invite-link" className="text-sm text-gray-700">
              Shareable Invite Link
            </label>
            <div className="flex space-x-2">
              <input
                id="invite-link"
                value={inviteLink}
                readOnly
                disabled={!selectedLeagueCode}
                className="w-0 flex-grow rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-orange disabled:bg-gray-100 disabled:opacity-70"
              />
              <button
                onClick={handleCopyLink}
                disabled={!selectedLeagueCode}
                className="flex items-center rounded-md bg-accent-orange px-3 py-2 text-sm font-medium text-white hover:bg-accent-orange/90 disabled:pointer-events-none disabled:opacity-50"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email-invite" className="text-sm text-gray-700">
              Invite by Email
            </label>
            <div className="flex space-x-2">
              <input
                id="email-invite"
                type="email"
                placeholder="Enter email address"
                value={email}
                disabled={loading}
                onChange={(e) => setEmail(e.target.value)}
                className="w-0 flex-grow rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-orange disabled:bg-gray-100 disabled:opacity-70"
              />
              <button
                disabled={!selectedLeagueCode || !email.trim() || loading}
                onClick={handleSendInvite}
                className="flex items-center gap-2 rounded-md bg-accent-orange px-3 py-2 text-sm font-medium text-white hover:bg-accent-orange/90 disabled:pointer-events-none disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Sending
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send
                  </>
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
