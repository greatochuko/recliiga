import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="border-b bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between p-6">
        <div className="flex items-center gap-2 text-xl font-bold text-accent-orange-2">
          REC LiiGA
        </div>
        <nav className="flex items-center gap-6 text-sm font-medium text-slate-700">
          <Link to="#features" className="hidden sm:inline">
            Features
          </Link>
          <Link to="#pricing" className="hidden sm:inline">
            Pricing
          </Link>
          <Link to="#testimonials" className="hidden sm:inline">
            Testimonials
          </Link>
          <Link to="#faq" className="hidden sm:inline">
            FAQ
          </Link>
          <Link
            to="#get-started"
            className="rounded-md bg-accent-orange-2 px-4 py-2 font-medium text-white duration-200 hover:bg-accent-orange"
          >
            Get Started
          </Link>
          <Link
            to="#get-started"
            className="rounded-md border border-accent-orange-2 bg-white px-4 py-2 font-medium text-accent-orange-2 duration-200 hover:bg-orange-50"
          >
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}
