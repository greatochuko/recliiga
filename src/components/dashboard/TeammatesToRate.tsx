
import { StarRating } from "./StarRating";

export function TeammatesToRate() {
  return (
    <div className="mb-8 bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-bold mb-4">Teammates to Rate</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <p className="text-sm font-semibold">John Smith</p>
              <p className="text-xs text-gray-500">Soccer League - 06/12/2023</p>
            </div>
          </div>
          <StarRating rating={0} />
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full bg-gray-200"></div>
            <div>
              <p className="text-sm font-semibold">Jane Doe</p>
              <p className="text-xs text-gray-500">Volleyball League - 06/10/2023</p>
            </div>
          </div>
          <StarRating rating={0} />
        </div>
      </div>
    </div>
  );
}
