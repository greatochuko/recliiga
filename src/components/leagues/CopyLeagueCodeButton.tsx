import { CopyIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CopyLeagueCodeButton({
  leagueCode,
}: {
  leagueCode: string;
}) {
  const [copied, setCopied] = useState(false);

  function handleCopyCode() {
    navigator.clipboard.writeText(leagueCode);
    setCopied(true);
    toast.success("Copied to clipboard", { style: { color: "#16a34a" } });
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  }

  return (
    <button
      onClick={handleCopyCode}
      disabled={copied}
      className={`flex items-center gap-2 rounded p-2 text-xs font-medium ${copied ? "bg-green-100 text-green-600" : "bg-gray-100"}`}
    >
      {leagueCode} <CopyIcon className="h-4 w-4" />
    </button>
  );
}
