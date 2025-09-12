export function Hero() {
  return (
    <section className="mx-auto flex w-[90%] max-w-7xl flex-col items-center gap-8 py-16 sm:py-20 lg:flex-row">
      <div className="flex-1 text-center lg:text-left">
        <h1 className="min-[480px]:3xl text-2xl font-bold text-accent-orange-2 sm:text-4xl md:text-5xl">
          Elevate Your Recreational Sport Experience
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-slate-600 sm:text-lg">
          REC LiiGA is a free-to-use app that makes drop-in sports more fun and
          competitive.
        </p>
        <div className="mt-6 flex justify-center gap-4 lg:justify-start">
          <a
            href="/sign-up"
            className="rounded-md bg-accent-orange-2 px-6 py-3 font-medium text-white shadow duration-200 hover:bg-accent-orange"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="rounded-md border border-slate-200 bg-white px-6 py-3 font-medium duration-200 hover:bg-slate-100"
          >
            Learn More
          </a>
        </div>
      </div>
      <div className="flex-1">
        <img
          src="/hero-image.png"
          alt="Recliiga"
          className="rounded-xl border-2 border-accent-orange/30 shadow-lg"
        />
      </div>
    </section>
  );
}
