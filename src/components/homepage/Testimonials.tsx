const testimonials = [
  {
    text: "REC LiiGA makes finding games super easy. I play twice as much now!",
    author: "Alex J.",
  },
  {
    text: "The team drafting is genius. Games feel fair and competitive.",
    author: "Maria L.",
  },
  {
    text: "Our local league runs smoother than ever. Huge time saver.",
    author: "Sam K.",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="bg-orange-50 py-20">
      <div className="mx-auto max-w-7xl px-6 text-center">
        <h2 className="text-3xl font-bold text-[#f79602]">
          Hear from our happy players
        </h2>
        <p className="mt-2 text-slate-600">
          REC LiiGA is trusted by recreational players and organizers
          everywhere.
        </p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.author} className="rounded-xl bg-white p-6 shadow">
              <p className="text-sm text-slate-600">“{t.text}”</p>
              <div className="mt-4 font-semibold">— {t.author}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
