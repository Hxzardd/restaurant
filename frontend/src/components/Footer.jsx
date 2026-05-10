import { Link } from "react-router-dom";
import { UtensilsCrossed } from "lucide-react";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-sand-200 bg-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-display text-xl font-bold tracking-wide text-forest mb-3">
              <span className="w-8 h-8 rounded-full bg-sage-200 flex items-center justify-center text-sage-700">
                 <UtensilsCrossed size={18} />
              </span>
              Hxzard's
            </Link>
            <p className="text-sm leading-relaxed text-forest-muted">
              Crafted flavours, delivered fresh. Restaurant-quality meals made to order with organic, fresh ingredients.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-earth">
              Navigate
            </p>
            <ul className="space-y-2.5">
              {[{ label: "Menu", to: "/menu" }, { label: "Cart", to: "/cart" }, { label: "Orders", to: "/orders" }].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200 text-forest-muted hover:text-sage-600"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-earth">
              Support
            </p>
            <ul className="space-y-2.5">
              {["Contact Us", "FAQ", "Delivery Info", "Feedback"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200 text-forest-muted hover:text-sage-600"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4 text-earth">
              Get in Touch
            </p>
            <div className="space-y-2.5 text-sm text-forest-muted">
              <p>support@hxzards.com</p>
              <p>+1 (555) 123-4567</p>
              <p>10 AM – 10 PM daily</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-sand-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-forest-muted">
            © {year} Hxzard's Restaurant. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-forest-muted">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-200 hover:text-sage-600"
              >
                {item}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
