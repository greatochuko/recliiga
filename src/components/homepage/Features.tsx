const features = [
  {
    title: "Find Games",
    desc: "Search and join drop-in games near you instantly.",
    image: "/find-games.png",
  },
  {
    title: "Team Drafting",
    desc: "Automatic balancing ensures fair and fun matches.",
    image: "/find-games.png",
  },
  {
    title: "Live Scores",
    desc: "Track scores and leaderboards in real-time.",
    image: "/find-games.png",
  },
  {
    title: "Player Stats",
    desc: "Follow your progress and compare with others.",
    image: "/find-games.png",
  },
  {
    title: "Community Hub",
    desc: "Connect, chat, and plan games with teammates.",
    image: "/find-games.png",
  },
];

export function Features() {
  return (
    <section className="bg-white">
      <section id="features" className="mx-auto w-[90%] max-w-7xl py-20">
        <div className="flex flex-col gap-2">
          <h2 className="text-center text-3xl font-bold text-[#f79602]">
            Powerful features for a seamless sports experience
          </h2>
          <p className="text-center text-slate-600">
            Join games, draft balanced teams, track standings, and connect with
            your community.
          </p>
        </div>
        <div
          className="mt-10 flex flex-wrap gap-4 sm:gap-6"
          style={{ gridTemplateColumns: "" }}
        >
          {features.map((f) => (
            <div
              key={f.title}
              className="flex min-w-[100%] flex-1 flex-col gap-4 rounded-xl border bg-white p-6 shadow-sm sm:min-w-96"
            >
              <img src={f.image} alt={f.title} />
              <div className="flex flex-col gap-2">
                <h3 className="font-semibold">{f.title}</h3>
                <p className="text-sm text-slate-600">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </section>
  );
}
