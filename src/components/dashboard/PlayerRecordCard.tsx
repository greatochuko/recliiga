import { LeaderboardDataType } from "@/types/events";

export default function PlayerRecordCard({
  playerData,
}: {
  playerData: LeaderboardDataType;
}) {
  const totalGames = playerData?.gamesPlayed || 0;
  const winFraction = playerData?.gamesWon / totalGames || 0;
  const lossFraction = playerData?.gamesLost / totalGames || 0;
  const tieFraction = playerData?.gamesTied / totalGames || 0;

  return (
    <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-bold">Record</h3>
      <div className="space-y-4">
        {/* Points Circle */}
        <div className="flex justify-center">
          <div className="relative h-24 w-24">
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#E5E7EB"
                strokeWidth="10"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#22C55E"
                strokeWidth="10"
                strokeDasharray={`${winFraction * 283} ${
                  283 - winFraction * 283
                }`}
                strokeDashoffset="0"
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#EF4444"
                strokeWidth="10"
                strokeDasharray={`${lossFraction * 283} ${
                  283 - lossFraction * 283
                }`}
                strokeDashoffset={`${-winFraction * 283}`}
                transform="rotate(-90 50 50)"
              />
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#F97316"
                strokeWidth="10"
                strokeDasharray={`${tieFraction * 283} ${
                  283 - tieFraction * 283
                }`}
                strokeDashoffset={`${-(winFraction + lossFraction) * 283}`}
                transform="rotate(-90 50 50)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold">
                {playerData?.points || 0}
              </span>
              <span className="text-gray-500">PTS</span>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded bg-emerald-100 p-2">
            <div className="text-lg font-bold text-emerald-700">
              {playerData?.gamesWon || 0}
            </div>
            <div className="text-xs text-emerald-600">Won</div>
          </div>
          <div className="rounded bg-red-100 p-2">
            <div className="text-lg font-bold text-red-700">
              {playerData?.gamesLost || 0}
            </div>
            <div className="text-xs text-red-600">Loss</div>
          </div>
          <div className="rounded bg-orange-100 p-2">
            <div className="text-lg font-bold text-orange-700">
              {playerData?.gamesTied || 0}
            </div>
            <div className="text-xs text-orange-600">Tied</div>
          </div>
        </div>
      </div>
    </div>
  );
}
