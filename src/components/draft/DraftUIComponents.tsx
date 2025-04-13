import { Star } from "lucide-react";

export const JerseyIcon = ({
  color,
  size = 24,
}: {
  color: string;
  size?: number;
}) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 8.5V20.5H4V8.5L8 4.5H16L20 8.5Z"
      stroke={color === "#FFFFFF" ? "#000000" : "black"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 4.5H16V8.5H8V4.5Z"
      stroke={color === "#FFFFFF" ? "#000000" : "black"}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const PlayerRating = ({ rating }: { rating: number }) => (
  <div className="flex items-center font-bold text-accent-orange">
    <span className="mr-1">{rating.toFixed(2)}</span>
    <Star className="h-4 w-4 fill-accent-orange" />
  </div>
);

export const colorOptions: { name: string; value: string }[] = [
  { name: "red", value: "#FF0000" },
  { name: "blue", value: "#0000FF" },
  { name: "green", value: "#00FF00" },
  { name: "yellow", value: "#FFFF00" },
  { name: "white", value: "#FFFFFF" },
  { name: "black", value: "#000000" },
];
