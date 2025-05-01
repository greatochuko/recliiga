import { useState } from "react";
import { Copy, Send, AlertCircle, CheckCircle, Info } from "lucide-react";
import ModalContainer from "./ModalContainer";

export default function InvitePopup({
  closeModal,
  open,
}: {
  open: boolean;
  closeModal: () => void;
}) {
  const [inviteLink, setInviteLink] = useState(
    "https://recliiga.com/invite/abc123",
  );
  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSendInvite = () => {
    if (email && !invitedEmails.includes(email)) {
      setInvitedEmails([...invitedEmails, email]);
      setEmail("");
      setError(null);
      // In a real application, you would send an API request here to invite the user
    } else if (invitedEmails.includes(email)) {
      setError("This email has already been invited.");
    } else {
      setError("Please enter a valid email address.");
    }
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

          <div className="space-y-2">
            <label htmlFor="invite-link" className="text-sm text-gray-700">
              Shareable Invite Link
            </label>
            <div className="flex space-x-2">
              <input
                id="invite-link"
                value={inviteLink}
                readOnly
                className="w-0 flex-grow rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-orange"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center rounded-md bg-accent-orange px-3 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
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
                onChange={(e) => setEmail(e.target.value)}
                className="w-0 flex-grow rounded-md border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-accent-orange"
              />
              <button
                onClick={handleSendInvite}
                className="flex items-center rounded-md bg-accent-orange px-3 py-2 text-sm font-medium text-white hover:bg-accent-orange/90"
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center text-sm text-red-600">
              <AlertCircle className="mr-2 h-4 w-4" />
              <p>{error}</p>
            </div>
          )}

          {invitedEmails.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm text-gray-700">Invited Members</label>
              <ul className="space-y-1 text-sm text-[#707B81]">
                {invitedEmails.map((email, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                    {email}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
