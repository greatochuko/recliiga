import { ChevronLeft, ChevronRight, PlusIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const navLinks = [
  { text: "Home", href: "/" },
  { text: "Features", href: "#features" },
  { text: "Testimonials", href: "#testimonials" },
  { text: "FAQs", href: "#faqs" },
];

const features = [
  { name: "Team Drafting", icon: "/team-drafting.png" },
  { name: "Player Ratings", icon: "/player-rating.png" },
  {
    name: "Individual Leaderboard Rankings",
    icon: "/leaderboard-rankings.png",
  },
  {
    name: "League & Event Management",
    icon: "/league-management.png",
  },
];

const reviews = [
  {
    username: "Dom B.",
    flag: "/wales.webp",
    text: "As a League Organizer, the REC LiiGA app makes managing the league so much easier",
  },
  {
    username: "Dan C.",
    flag: "/canada.png",
    text: "I love how it makes the games that much more fun and exciting",
  },
  {
    username: "Curtis H.",
    flag: "/hong-kong.png",
    text: "I don't often win, but when I do, I like to brag about it by sharing the REC LiiGA Leaderboard",
  },
  {
    username: "Ricky N.",
    flag: "/usa.png",
    text: "You can see the difference in player engagement using the REC LiiGA app.",
  },
  {
    username: "Matti F.",
    flag: "/finland.png",
    text: "Every game there's new match ups and new rivalries born",
  },
  {
    username: "Chris W.",
    flag: "/switzerland.png",
    text: "It's the most fun I've had playing sports in a long time",
  },
  {
    username: "Adam L.",
    flag: "/australia.png",
    text: "It's great to get out with the mates and play sports with the help of the REC LiiGA app",
  },
  {
    username: "Ross P.",
    flag: "/england.png",
    text: "I look forward to attending every game now",
  },
];

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

export default function HomePage() {
  const [faqsOpen, setFaqsOpen] = useState<string[]>([]);

  const navRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const faqsRef = useRef<HTMLDivElement>(null);

  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (section: string) => {
    console.log(section);
    if (section === "features") {
      featuresRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "testimonials") {
      testimonialsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "faqs") {
      faqsRef.current?.scrollIntoView({ behavior: "smooth" });
    } else if (section === "home") {
      navRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  function handlePrev() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: -window.innerWidth / 2.4,
        behavior: "smooth",
      });
    }
  }

  function handleNext() {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({
        left: window.innerWidth / 2.4,
        behavior: "smooth",
      });
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (carouselRef.current) {
        // Only auto-scroll if mouse is NOT over the carousel
        const isHovered = carouselRef.current.matches(":hover");
        if (!isHovered) {
          const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
          if (scrollLeft + clientWidth >= scrollWidth - 5) {
            carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
          } else {
            handleNext();
          }
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <main>
      <header>
        <nav
          ref={navRef}
          className="flex items-center justify-between bg-white px-[5%] py-4"
        >
          <h1 className="text-xl font-bold text-accent-orange-2">REC LiiGA</h1>
          <ul className="flex items-center gap-4">
            {navLinks.map((navLink) => (
              <li
                className={"hidden lg:block"}
                key={navLink.text}
                onClick={
                  navLink.href.startsWith("#")
                    ? () => scrollToSection(navLink.href.split("#")[1])
                    : () => scrollToSection("home")
                }
              >
                <Link
                  to={navLink.href}
                  className={`inline-block p-2 text-sm font-medium ${navLink.href === "/" ? "" : "text-gray-500"}`}
                >
                  {navLink.text}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            to={"/sign-up"}
            className="rounded-md bg-accent-orange-2 px-4 py-2 text-sm font-medium text-white duration-200 hover:bg-accent-orange"
          >
            Get Started
          </Link>
        </nav>
      </header>

      <div className="relative z-10 overflow-hidden bg-accent-orange-2 py-10 text-white">
        <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-10 lg:flex-row lg:items-center">
          <div className="flex flex-1 flex-col items-center gap-4 text-center lg:items-start lg:text-left">
            <h2 className="text-xl font-semibold sm:text-3xl lg:text-4xl lg:leading-[48px]">
              ELEVATE YOUR RECREATIONAL SPORT EXPERIENCE
            </h2>
            <p className="text-neutral-200">
              REC LiiGA is a free-to-use app that makes drop in sports more fun
              and competitive.
            </p>
            <div className="relative h-10">
              <Link
                to={"/sign-up"}
                className="absolute z-40 w-fit -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-4 py-2 font-medium text-neutral-800 duration-200 hover:shadow-lg hover:shadow-black/30 lg:translate-x-0"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="flex h-[30rem] flex-1 items-center justify-center">
            <img
              src={"/recliiga-dashboard.png"}
              alt={"Recliiga home page"}
              className="h-[30rem] w-full max-w-96 rounded-md object-cover object-top lg:w-fit"
            />
          </div>
        </div>
        <img
          src={"/hero-design-1.png"}
          alt={"Design"}
          className="absolute left-0 top-[20%] -z-10 h-[150%] w-[150%]"
        />
        <img
          src={"/hero-design-2.png"}
          alt={"Design"}
          className="absolute left-0 top-0 -z-10 h-[150%] w-[150%] -rotate-12"
        />
      </div>

      <div
        className="mx-auto flex w-[90%] max-w-7xl flex-col items-center gap-4 py-10"
        ref={featuresRef}
      >
        <h2 className="max-w-xl text-center text-xl font-semibold sm:text-2xl lg:text-3xl">
          BRING THE EXCITEMENT OF FANTASY SPORTS TO YOUR{" "}
          <span className="text-accent-orange-2">REC LEAGUE</span>
        </h2>
        <p className="font-medium">REC LiiGA Features</p>
        <div className="flex w-full items-center gap-8 lg:mt-8">
          <div className="hidden flex-1 items-center justify-center lg:flex">
            <img
              src={"/results-view-recliiga.png"}
              alt={"Recliiga home page"}
              className="max-h-[44rem]"
            />
          </div>
          <ul className="grid w-full flex-1 gap-6 font-medium uppercase sm:grid-cols-2 lg:grid-cols-1">
            {features.map((feat, i) => (
              <li
                key={feat.name}
                className={`flex items-center gap-4 ${i === 1 || i === 2 ? "lg:ml-8" : ""}`}
              >
                <div className="rounded-full border border-neutral-600 bg-accent-orange-2 p-3">
                  <img src={feat.icon} alt={feat.name} className="h-8 w-8" />
                </div>

                <span className="flex-1 lg:text-lg">{feat.name}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="relative z-10 overflow-hidden bg-accent-orange-2 py-10">
        <div className="mx-auto flex w-[90%] max-w-7xl flex-col items-center gap-4 lg:flex-row">
          <div className="flex flex-1 flex-col items-center gap-4 text-center lg:items-start lg:text-start">
            <h2 className="text-xl font-semibold uppercase sm:text-2xl">
              Use the app now
            </h2>
            <p className="text-lg text-neutral-100">
              Getting started is easy. Create your account now and join our
              growing community of sports enthusiasts.
            </p>
            <div className="relative h-10">
              <Link
                to={"/sign-up"}
                className="absolute z-40 w-fit -translate-x-1/2 whitespace-nowrap rounded-md bg-white px-4 py-2 font-medium text-neutral-800 duration-200 hover:shadow-lg hover:shadow-black/30 lg:translate-x-0"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
          <div className="flex-1">
            <img
              src={"/league-view-recliiga.png"}
              alt={"Recliiga home page"}
              className="max-h-[44rem]"
            />
          </div>
        </div>
        <img
          src={"/hero-design-2.png"}
          alt={"Design"}
          className="absolute left-0 top-0 -z-10 h-[125%] w-[125%] -rotate-12"
        />
      </div>

      <div className="bg-white py-10">
        <div className="mx-auto flex w-[90%] max-w-7xl flex-col items-center gap-4">
          <h2 className="text-center text-xl font-semibold uppercase sm:text-2xl">
            Checkout the App Interface
          </h2>
          <div className="flex h-80 items-center justify-center sm:h-[22rem] md:h-[30rem]">
            <img
              src="/league-details.png"
              alt="league-details"
              className="hidden max-h-full flex-1 translate-x-[75%] scale-75 sm:block"
            />
            <img
              src="/chat-page.png"
              alt="chat-page"
              className="max-h-full flex-1 translate-x-[32.5%] scale-[.875]"
            />
            <img
              src="/profile-page.png"
              alt="profile-page"
              className="z-10 max-h-full flex-1"
            />
            <img
              src="/results-page.png"
              alt="results-page"
              className="z-[2] max-h-full flex-1 -translate-x-[32.5%] scale-[.875]"
            />
            <img
              src="/leagues-page.png"
              alt="leagues-page"
              className="hidden max-h-full flex-1 -translate-x-[75%] scale-75 sm:block"
            />
          </div>
        </div>
      </div>

      <div className="bg-accent-orange-2 py-10" ref={testimonialsRef}>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col items-center gap-2 text-center">
            <h2 className="font-semibold uppercase text-white">Testimonials</h2>
            <p className="text-xl font-semibold capitalize sm:text-2xl">
              What our customers say
            </p>
            <p className="max-w-xl text-white">
              Join thousands of satisfied players who discovered a better way to
              play recreational sports.
            </p>
          </div>
          <div
            ref={carouselRef}
            className="hide-scrollbar flex snap-x snap-mandatory items-stretch gap-4 overflow-x-auto p-10 sm:gap-6"
          >
            {reviews.map((review, i) => (
              <div
                key={i}
                className="relative flex w-[60vw] shrink-0 snap-center flex-col items-center justify-between gap-8 rounded-3xl bg-white p-4 text-center shadow-lg md:w-[40vw] lg:p-8"
              >
                <img
                  src={review.flag}
                  alt={review.flag.split("/")[1]}
                  className="absolute left-1/2 top-0 z-10 h-14 w-14 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white shadow-xl shadow-black/20 sm:h-16 sm:w-16"
                />
                <div />
                <p className="max-w-sm text-sm">"{review.text}"</p>
                <h4 className="font-semibold uppercase text-accent-orange-2">
                  {review.username}
                </h4>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-8">
            <button
              onClick={handlePrev}
              className="rounded-full border border-white/50 bg-white/10 p-3 text-white shadow-lg duration-200 hover:bg-white/20 hover:shadow-black/20"
            >
              <ChevronLeft className="h-8 w-8" />
            </button>
            <button
              onClick={handleNext}
              className="rounded-full border border-white/50 bg-white/10 p-3 text-white shadow-lg duration-200 hover:bg-white/20 hover:shadow-black/20"
            >
              <ChevronRight className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      <div className="py-10" ref={faqsRef}>
        <div className="mx-auto flex w-[90%] max-w-7xl flex-col items-center gap-8 lg:flex-row">
          <div className="flex-1">
            <img src="/faq-image.png" alt="Frequently Asked Questions" />
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <h2 className="border-b-[3px] pb-4 text-xl font-semibold sm:text-2xl">
              Frequently Asked Questions
            </h2>
            <ul className="flex flex-col gap-2">
              {faqs.map((faq) => (
                <li
                  key={faq.question}
                  className="h-fit cursor-pointer overflow-hidden border-b-[3px] pb-2"
                  onClick={() => {
                    setFaqsOpen((prev) =>
                      prev.includes(faq.question)
                        ? prev.filter((q) => q !== faq.question)
                        : [...prev, faq.question],
                    );
                  }}
                  role="button"
                >
                  <h4 className="flex items-center justify-between py-2 font-semibold sm:text-lg">
                    <span className="flex-1">{faq.question}</span>
                    <PlusIcon
                      className={`h-4 w-4 transition-transform duration-300 ${faqsOpen.includes(faq.question) ? "rotate-45" : ""}`}
                    />
                  </h4>
                  <p
                    className={`overflow-hidden text-sm text-gray-500 duration-300 sm:text-base ${faqsOpen.includes(faq.question) ? "max-h-80" : "max-h-0"}`}
                  >
                    {faq.answer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-4 bg-accent-orange-2 py-10">
        <ul className="flex items-center justify-center gap-4">
          {navLinks.map((navLink) => (
            <li
              key={navLink.text}
              onClick={
                navLink.href.startsWith("#")
                  ? () => scrollToSection(navLink.href.split("#")[1])
                  : () => scrollToSection("home")
              }
            >
              <Link
                className="text-sm text-white/70 duration-200 hover:text-white"
                to={navLink.href}
              >
                {navLink.text}
              </Link>
            </li>
          ))}
        </ul>
        <p className="mx-auto mt-6 w-[90%] max-w-7xl border-t border-white/50 pt-4 text-end text-xs text-white">
          Copyright &copy; {new Date().getFullYear()}
        </p>
      </div>
    </main>
  );
}
