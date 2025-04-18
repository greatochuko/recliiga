import { Loader2Icon } from "lucide-react";
import { twMerge } from "tailwind-merge";

export default function FullScreenLoader({ className = "" }) {
  return (
    <div className="flex h-full w-full flex-1 items-center justify-center">
      <Loader2Icon
        className={twMerge(
          "h-8 w-8 animate-spin text-accent-orange",
          className,
        )}
      />
    </div>
  );
}
