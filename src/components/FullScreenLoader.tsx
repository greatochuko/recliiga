import { Loader2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function FullScreenLoader({ className = "" }) {
  return (
    <div
      className={twMerge(
        "flex h-full w-full flex-1 items-center justify-center",
        className,
      )}
    >
      <Loader2Icon className={"h-8 w-8 animate-spin text-accent-orange"} />
    </div>
  );
}
