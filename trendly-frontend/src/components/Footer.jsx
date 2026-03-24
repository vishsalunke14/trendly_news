import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";


export default function Footer() {
  return (
    <footer className="mt-10 bg-slate-950 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* Top Section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300">

          {/* Brand */}
          <div>
            <h2 className="text-xl font-extrabold bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-300 bg-clip-text text-transparent">
              Trendly
            </h2>
            <p className="text-xs text-slate-500 mt-2">
              Your personalized portal for trending, latest and curated news from trusted sources.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Quick Links</h3>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/" className="hover:text-indigo-400">Home</a></li>
              <li><a href="/bookmarks" className="hover:text-indigo-400">Bookmarks</a></li>
              <li><a href="/profile" className="hover:text-indigo-400">Profile</a></li>
              <li><a href="/admin/login" className="hover:text-indigo-400">Admin Login</a></li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-sm font-semibold text-slate-100 mb-3">Connect</h3>
            {/* Social Icons */}
<div className="flex space-x-4 text-slate-300 text-xl">
  <a
    href="https://facebook.com"
    target="_blank"
    rel="noreferrer"
    className="hover:text-indigo-400 transition transform hover:scale-110"
  >
    <FaFacebookF />
  </a>

  <a
    href="https://twitter.com"
    target="_blank"
    rel="noreferrer"
    className="hover:text-indigo-400 transition transform hover:scale-110"
  >
    <FaTwitter />
  </a>

  <a
    href="https://instagram.com"
    target="_blank"
    rel="noreferrer"
    className="hover:text-indigo-400 transition transform hover:scale-110"
  >
    <FaInstagram />
  </a>

  <a
    href="https://youtube.com"
    target="_blank"
    rel="noreferrer"
    className="hover:text-indigo-400 transition transform hover:scale-110"
  >
    <FaYoutube />
  </a>
</div>

          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-slate-800 pt-4 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} Trendly — All rights reserved.
        </div>
      </div>
    </footer>
  );
}
