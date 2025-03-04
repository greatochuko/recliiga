
export const routes = {
  home: '/',
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    forgotPassword: '/forgot-password',
    completeRegistration: '/complete-registration',
  },
  leagues: {
    list: '/leagues',
    details: (id: string) => `/leagues/${id}`,
    create: '/create-league',
    setup: '/league-setup',
  },
  events: {
    list: '/events',
    details: (id: string) => `/events/${id}`,
    results: (id: string) => `/events/${id}/results`,
    manage: '/manage-events',
    add: '/add-event',
    selectCaptains: (id: string) => `/select-captains/${id}`,
    editResults: (id: string) => `/edit-results/${id}`,
  },
  players: {
    profile: '/profile',
    playerProfile: '/player-profile',
    rateTeammates: '/rate-teammates',
  },
  results: '/results',
  chat: '/chat',
  help: '/help',
};
