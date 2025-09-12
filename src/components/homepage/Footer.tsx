// components/Footer.jsx

import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-slate-900 py-10 text-slate-300">
      <div className="mx-auto max-w-7xl px-6">
        <div>
          <h3 className="text-lg font-bold text-white">REC LiiGA</h3>
          <p className="mt-2 text-sm">Drop-in sports, reimagined.</p>
          {/* <form className="flex w-full max-w-md items-center gap-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-0 flex-1 rounded-md px-3 py-2 text-sm text-slate-900"
            />
            <button className="rounded-md bg-[#f79602] px-4 py-2 text-white hover:bg-orange-600">
              Subscribe
            </button>
          </form> */}
        </div>
        <div className="mt-8 flex flex-col justify-between gap-4 border-t border-slate-700 pt-6 text-sm sm:flex-row">
          <p>© {new Date().getFullYear()} REC LiiGA. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#">Privacy</Link>
            <Link to="#">Terms</Link>
            <Link to="#">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
