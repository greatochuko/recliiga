import { fetchApi } from "@/lib/utils";

export async function sendInvitationEmail(
  toEmail: string,
  args: {
    leagueOrganizerFirstName: string;
    leagueName: string;
    leagueImage?: string;
    invitationLink: string;
  },
) {
  return await fetchApi("/email", {
    method: "POST",
    body: { toEmail, ...args },
  });
}
