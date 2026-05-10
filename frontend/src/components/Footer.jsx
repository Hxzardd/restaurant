import { Link } from "react-router-dom";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t"
      style={{ backgroundColor: "#0f0d0b", borderColor: "#2a2320" }}
    >
      {/* Top accent */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, #e09040 50%, transparent 100%)", opacity: 0.35 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div>
            <p className="font-display text-lg font-bold mb-3" style={{ color: "#e09040" }}>
              Hxzard's Restaurant
            </p>
            <p className="text-sm leading-relaxed" style={{ color: "#5c4e42" }}>
              Crafted flavours, delivered fresh. Restaurant-quality meals made to order.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#a89478" }}>
              Navigate
            </p>
            <ul className="space-y-2.5">
              {[{ label: "Menu", to: "/menu" }, { label: "Cart", to: "/cart" }, { label: "Orders", to: "/orders" }].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to}
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#5c4e42" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e09040")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#5c4e42")}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#a89478" }}>
              Support
            </p>
            <ul className="space-y-2.5">
              {["Contact Us", "FAQ", "Delivery Info", "Feedback"].map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-sm transition-colors duration-200"
                    style={{ color: "#5c4e42" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#e09040")}
                    onMouseLeave={e => (e.currentTarget.style.color = "#5c4e42")}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#a89478" }}>
              Get in Touch
            </p>
            <div className="space-y-2.5 text-sm" style={{ color: "#5c4e42" }}>
              <p>support@hxzards.com</p>
              <p>+1 (555) 123-4567</p>
              <p>10 AM – 10 PM daily</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: "#2a2320" }}>
          <p className="text-xs" style={{ color: "#5c4e42" }}>
            © {year} Hxzard's Restaurant. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs" style={{ color: "#5c4e42" }}>
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a
                key={item}
                href="#"
                className="transition-colors duration-200"
                onMouseEnter={e => (e.currentTarget.style.color = "#e09040")}
                onMouseLeave={e => (e.currentTarget.style.color = "#5c4e42")}
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
