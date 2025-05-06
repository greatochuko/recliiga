import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LeagueDataType } from "@/api/league";

export function ConfirmationStep({
  leagueData,
}: {
  leagueData: LeagueDataType;
}) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-center text-2xl font-semibold text-gray-800">
          Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <CheckCircle className="mx-auto mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold">Your League is Ready!</h2>
          <p className="mb-6 text-gray-600">
            You've successfully set up your {leagueData.sport} league. Get ready
            for an exciting season!
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <h3 className="mb-4 text-lg font-semibold">League Summary</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">League Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{leagueData.name}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sport</dt>
              <dd className="mt-1 text-sm text-gray-900">{leagueData.sport}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Privacy Setting
              </dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {leagueData.is_private ? "Private" : "Public"}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">City</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {leagueData.city}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Date</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {new Date(leagueData.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">League Code</dt>
              <dd className="mt-1 text-sm capitalize text-gray-900">
                {leagueData.leagueCode}
              </dd>
            </div>
            {/* <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Events
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {leagueData.events.length}
              </dd>
            </div> */}
          </dl>
        </div>

        {/* <div className="flex justify-center space-x-4">
          <Button className="bg-accent-orange hover:bg-accent-orange/90 text-white">
            Invite Players
          </Button>
          <Button variant="outline">
            View League Dashboard
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
