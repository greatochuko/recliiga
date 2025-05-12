export const conversations = [
  {
    id: 1,
    name: "Team Chat",
    type: "group",
    avatar: "",
    lastMessage: "Coach: Don't forget practice tomorrow at 6PM!",
    timestamp: "10:30 AM",
    unread: 2,
    members: Array(17)
      .fill(null)
      .map((_, index) => ({
        name: `Player ${index + 1}`,
        initials: `P${index + 1}`,
        image: "",
      })),
  },
  {
    id: 2,
    name: "John Smith",
    type: "individual",
    role: "player",
    avatar: "",
    lastMessage: "Are you coming to the game on Saturday?",
    timestamp: "Yesterday",
    unread: 0,
  },
  {
    id: 3,
    name: "Sarah Davis",
    type: "individual",
    role: "organizer",
    avatar: "",
    lastMessage: "Great game yesterday!",
    timestamp: "Tuesday",
    unread: 0,
  },
  {
    id: 4,
    name: "Premier League",
    type: "group",
    avatar: "",
    lastMessage: "New game scheduled for next week",
    timestamp: "Monday",
    unread: 0,
    members: Array(12)
      .fill(null)
      .map((_, index) => ({
        name: `Player ${index + 1}`,
        initials: `P${index + 1}`,
        image: "",
      })),
  },
];

// Mock data for messages in the active conversation
export const groupMessages = [
  {
    name: "Alex Johnson",
    message: "Hey everyone! Excited for the upcoming match. Any predictions?",
    time: "10:30 AM",
    initials: "AJ",
  },
  {
    name: "Sarah Lee",
    message: "I think it's going to be a close one. 2-1 to us!",
    time: "10:32 AM",
    initials: "SL",
  },
  {
    name: "Mike Brown",
    message: "Our defense has been solid lately. I'm predicting a clean sheet.",
    time: "10:35 AM",
    initials: "MB",
  },
  {
    name: "John Doe",
    message:
      "Great insights, team! Let's focus on our strengths during practice this week.",
    time: "10:40 AM",
    initials: "JD",
  },
  {
    name: "Alex Johnson",
    message: "Agreed, Coach! When's our next training session?",
    time: "10:42 AM",
    initials: "AJ",
  },
  {
    name: "John Doe",
    message:
      "We'll have an intensive session tomorrow at 4 PM. Be ready to work on our new formation!",
    time: "10:45 AM",
    initials: "JD",
  },
];

export const individualMessages = [
  {
    name: "Contact",
    message:
      "Hey coach, I wanted to discuss our strategy for the upcoming game. Do you have any specific plays in mind?",
    time: "8:55 PM",
    initials: "CT",
  },
  {
    name: "John Doe",
    message:
      "Hi there! Yes, I've been working on a new offensive formation. Let's go over it at tomorrow's practice.",
    time: "8:59 PM",
    initials: "JD",
  },
  {
    name: "Contact",
    message:
      "Sounds great! Should we focus on our passing game or running plays?",
    time: "9:01 PM",
    initials: "CT",
  },
  {
    name: "John Doe",
    message:
      "I think we should emphasize our passing game. Our receivers have been showing great improvement lately.",
    time: "9:05 PM",
    initials: "JD",
  },
  {
    name: "Contact",
    message:
      "Agreed. I'll let the team know to be prepared for some intensive passing drills tomorrow.",
    time: "9:10 PM",
    initials: "CT",
  },
];
