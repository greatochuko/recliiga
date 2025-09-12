const faqs = [
  {
    question: "Is the REC LiiGA app free?",
    answer: "Yes, it is 100% free for all users.",
  },
  {
    question: "Where can I use the REC LiiGA app?",
    answer: "The REC LiiGA app is available at www.recliiga.com",
  },
  {
    question: "What sports is the REC LiiGA app for?",
    answer:
      "The REC LiiGA app can be used for any team sports with head to head competition.",
  },
  {
    question: "Can I invite friends to join a league?",
    answer:
      "Of course! Share the League Code with your friends to get them on the app and in the game.",
  },
  {
    question: "Is there a registration fee to join a league?",
    answer:
      "All leagues are run by individual League Organizers. Costs associated with the league, depend on the league. Feel free to contact the League Organizer in the chat function of the app.",
  },
  {
    question: "Can I participate in multiple leagues?",
    answer:
      "Yes, you can participate in multiple leagues. Ask the League Organizer for the League Code in order to join the league.",
  },
  {
    question: "Can I see individual player statistics and team rankings?",
    answer:
      "The REC LiiGA app has a Team Drafting and Selection feature, which allows Captains to create new teams for each Event. In order to rank players, there is a Individual Player Leaderboard rather than a Team Ranking system.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach us by email at hello@recliiga.com or within the Help & Support section if you are a League Organizer",
  },
  {
    question: "How can I provide feedback or suggest new features?",
    answer:
      "You can reach us by email at hello@recliiga.com or within the Help & Support section if you are a League Organizer",
  },
  {
    question: "How do I delete my account?",
    answer:
      "We are sad to see you go. Please feel free to send us your feedback, as we would love to hear from you at hello@recliiga.com. You can delete your account under the Profile section of your account.",
  },
  {
    question: "How do I report a bug or technical issue?",
    answer:
      "You can reach us by email at hello@recliiga.com or within the Help & Support section if you are a League Organizer",
  },
];

export function FAQ() {
  return (
    <section className="bg-white">
      <section id="faq" className="py-20">
        <div className="mx-auto w-[90%] max-w-7xl">
          <h2 className="text-center text-3xl font-bold text-[#f79602]">
            FAQs
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {faqs.map((f, idx) => (
              <details key={idx} className="rounded-md border bg-white p-4">
                <summary className="cursor-pointer pt-2 font-medium">
                  {f.question}
                </summary>
                <p className="mt-2 text-sm text-slate-600">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </section>
  );
}
