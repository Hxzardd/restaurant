import { Link, NavLink, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShoppingBag, LogOut, Menu as MenuIcon, X, Flame } from "lucide-react";

function NavItem({ to, children, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `px-3 py-2 text-sm font-semibold rounded-full transition-colors duration-200 ${
          isActive ? "text-paprika" : "text-ink-soft hover:text-ink"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate("/");
  };

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-linen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            to="/"
            onClick={close}
            className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight text-ink hover:opacity-80 transition-opacity duration-200"
          >
            <span className="w-8 h-8 rounded-full bg-paprika flex items-center justify-center text-white">
              <Flame size={16} aria-hidden="true" />
            </span>
            Hxzard&rsquo;s
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            <NavItem to="/menu">Menu</NavItem>
            {user && <NavItem to="/orders">My Orders</NavItem>}
            {user?.isAdmin && (
              <>
                <span className="w-px h-4 mx-1 bg-linen" aria-hidden="true" />
                <NavItem to="/admin/menu">Admin Menu</NavItem>
                <NavItem to="/admin/orders">Admin Orders</NavItem>
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-ink text-cream">
                  Admin
                </span>
              </>
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              to="/cart"
              onClick={close}
              aria-label={`Cart, ${cartCount} item${cartCount === 1 ? "" : "s"}`}
              className="relative p-2.5 rounded-full text-ink hover:bg-cream-dark transition-colors duration-200"
            >
              <ShoppingBag size={20} aria-hidden="true" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full flex items-center justify-center bg-paprika text-white">
                  {cartCount}
                </span>
              )}
            </Link>

            <Link to="/menu" onClick={close} className="hidden sm:inline-flex btn-primary px-5 py-2.5 text-sm">
              Order Now
            </Link>

            {user ? (
              <button
                onClick={handleLogout}
                aria-label="Log out"
                className="hidden md:flex btn-ghost px-3 py-2.5 text-sm"
              >
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden lg:inline">Log out</span>
              </button>
            ) : (
              <Link to="/login" className="hidden md:inline-flex btn-ghost px-4 py-2.5 text-sm">
                Sign in
              </Link>
            )}

            {/* Mobile toggle */}
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="md:hidden p-2.5 rounded-full text-ink hover:bg-cream-dark transition-colors duration-200"
            >
              {open ? <X size={20} aria-hidden="true" /> : <MenuIcon size={20} aria-hidden="true" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="md:hidden pb-4 flex flex-col gap-1 border-t border-linen pt-3">
            <NavItem to="/menu" onClick={close}>Menu</NavItem>
            <NavItem to="/cart" onClick={close}>Cart {cartCount > 0 && `(${cartCount})`}</NavItem>
            {user && <NavItem to="/orders" onClick={close}>My Orders</NavItem>}
            {user?.isAdmin && (
              <>
                <NavItem to="/admin/menu" onClick={close}>Admin Menu</NavItem>
                <NavItem to="/admin/orders" onClick={close}>Admin Orders</NavItem>
              </>
            )}
            {user ? (
              <button onClick={handleLogout} className="btn-ghost px-3 py-2 text-sm justify-start">
                <LogOut size={16} aria-hidden="true" /> Log out
              </button>
            ) : (
              <NavItem to="/login" onClick={close}>Sign in</NavItem>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
