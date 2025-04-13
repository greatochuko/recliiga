import { useEffect, useState } from "react";

export default function CountdownClock({ deadline }: { deadline: Date }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0 });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const difference = deadline.getTime() - now.getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  return (
    <div className="flex space-x-4 text-lg font-semibold">
      <div className="flex flex-col items-center">
        <span>{timeLeft.days}</span>
        <span className="text-xs text-gray-500">days</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.hours}</span>
        <span className="text-xs text-gray-500">hours</span>
      </div>
      <div className="flex flex-col items-center">
        <span>{timeLeft.minutes}</span>
        <span className="text-xs text-gray-500">minutes</span>
      </div>
    </div>
  );
}
