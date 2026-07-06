import { Link } from "react-router-dom";
import { Flame } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-ink text-cream mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight mb-3 text-cream hover:opacity-80 transition-opacity duration-200">
              <span className="w-8 h-8 rounded-full bg-paprika flex items-center justify-center text-white">
                <Flame size={16} aria-hidden="true" />
              </span>
              Hxzard&rsquo;s
            </Link>
            <p className="text-sm text-cream/60 max-w-xs">
              Fresh food, ordered in seconds. From our kitchen to your doorstep.
            </p>
          </div>

          <nav className="flex gap-12" aria-label="Footer">
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-cream/40 mb-1">Explore</p>
              <Link to="/menu" className="text-sm text-cream/70 hover:text-cream transition-colors duration-200">Menu</Link>
              <Link to="/cart" className="text-sm text-cream/70 hover:text-cream transition-colors duration-200">Cart</Link>
              <Link to="/orders" className="text-sm text-cream/70 hover:text-cream transition-colors duration-200">My Orders</Link>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-xs font-bold uppercase tracking-widest text-cream/40 mb-1">Account</p>
              <Link to="/login" className="text-sm text-cream/70 hover:text-cream transition-colors duration-200">Sign in</Link>
              <Link to="/signup" className="text-sm text-cream/70 hover:text-cream transition-colors duration-200">Create account</Link>
            </div>
          </nav>
        </div>

        <div className="mt-10 pt-6 border-t border-cream/10 text-xs text-cream/40">
          Built with React, Flask &amp; PostgreSQL — a full-stack ordering system.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
