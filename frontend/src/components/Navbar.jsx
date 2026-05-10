import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const location = useLocation();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `relative px-3 py-1.5 text-sm font-medium transition-all duration-200 rounded-md ${
      isActive(path)
        ? "text-ember-DEFAULT"
        : "text-cream-secondary hover:text-cream"
    }`;

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{ backgroundColor: "#0f0d0b", borderColor: "#2a2320" }}
    >
      {/* Subtle top accent line */}
      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, #e09040 50%, transparent 100%)", opacity: 0.5 }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            to="/menu"
            className="font-display text-xl font-bold tracking-wide transition-opacity duration-200 hover:opacity-80"
            style={{ color: "#e09040" }}
          >
            Hxzard's Restaurant
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-1">
            <Link to="/menu"   className={linkClass("/menu")}>Menu</Link>
            <Link to="/cart"   className={`${linkClass("/cart")} relative`}>
              Cart
              {cartCount > 0 && (
                <span
                  className="absolute -top-1.5 -right-1.5 w-4.5 h-4.5 text-xs font-bold rounded-full flex items-center justify-center badge-pop"
                  style={{ backgroundColor: "#e09040", color: "#0f0d0b", width: "18px", height: "18px", fontSize: "10px" }}
                >
                  {cartCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className={linkClass("/orders")}>Orders</Link>

            {user?.isAdmin && (
              <>
                <span className="w-px h-4 mx-1" style={{ backgroundColor: "#38302a" }} />
                <Link to="/admin/orders" className={`${linkClass("/admin/orders")} text-cream-muted`}>
                  Admin Orders
                </Link>
                <Link to="/admin/menu"   className={`${linkClass("/admin/menu")} text-cream-muted`}>
                  Admin Menu
                </Link>
              </>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 active:scale-95"
            style={{ borderColor: "#38302a", color: "#a89478" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#e09040"; e.currentTarget.style.color = "#e09040"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#38302a"; e.currentTarget.style.color = "#a89478"; }}
          >
            Log out
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
