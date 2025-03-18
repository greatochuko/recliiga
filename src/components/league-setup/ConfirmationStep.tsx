import { CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfirmationStep({ leagueData }) {
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold text-center text-gray-800">
          Confirmation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your League is Ready!</h2>
          <p className="text-gray-600 mb-6">
            You've successfully set up your {leagueData.sport} league. Get ready
            for an exciting season!
          </p>
        </div>

        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">League Summary</h3>
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">League Name</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {leagueData.leagueName}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Sport</dt>
              <dd className="mt-1 text-sm text-gray-900">{leagueData.sport}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Privacy Setting
              </dt>
              <dd className="mt-1 text-sm text-gray-900 capitalize">
                {leagueData.privacySetting}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">
                Total Events
              </dt>
              <dd className="mt-1 text-sm text-gray-900">
                {leagueData.events.length}
              </dd>
            </div>
          </dl>
        </div>

        {/* <div className="flex justify-center space-x-4">
          <Button className="bg-[#FF7A00] hover:bg-[#FF7A00]/90 text-white">
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
