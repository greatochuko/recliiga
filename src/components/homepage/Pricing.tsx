const plans = [
  { name: "Basic", price: "Free", desc: "For casual players joining games." },
  {
    name: "Pro",
    price: "$9.99/mo",
    desc: "Perfect for active groups and leagues.",
  },
  {
    name: "Enterprise",
    price: "Custom",
    desc: "Tailored for organizations and schools.",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-6 py-20 text-center">
      <h2 className="text-3xl font-bold text-[#f79602]">
        Choose the plan that fits
      </h2>
      <p className="mt-2 text-slate-600">
        Start for free and upgrade as your league grows.
      </p>
      <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {plans.map((p) => (
          <div key={p.name} className="rounded-xl border bg-white p-6 shadow">
            <h3 className="text-lg font-semibold">{p.name}</h3>
            <p className="mt-2 text-3xl font-bold text-[#f79602]">{p.price}</p>
            <p className="mt-2 text-sm text-slate-600">{p.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
