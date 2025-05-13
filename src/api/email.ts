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
  return await fetchApi("/email/invite", {
    method: "POST",
    body: { toEmail, ...args },
  });
}

export async function sendSupportEmail(args: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  return await fetchApi("/email/support", {
    method: "POST",
    body: args,
  });
}
