import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShoppingBag, LogOut, LayoutDashboard, UtensilsCrossed, ReceiptText } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

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

  const NavLink = ({ to, icon: Icon, children }) => (
    <Link
      to={to}
      className={twMerge(
        clsx(
          "relative flex items-center gap-2 px-3 py-2 text-sm font-medium transition-colors duration-200 rounded-md",
          isActive(to)
            ? "text-sage-700"
            : "text-forest-muted hover:text-sage-600"
        )
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
      {isActive(to) && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-sage-500 rounded-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 border-b border-sand-200 glass-panel"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <Link
            to="/menu"
            className="flex items-center gap-2 font-display text-xl font-bold tracking-wide transition-opacity duration-200 hover:opacity-80 text-forest"
          >
            <span className="w-8 h-8 rounded-full bg-sage-100 flex items-center justify-center text-sage-600">
               <UtensilsCrossed size={18} />
            </span>
            Hxzard's
          </Link>

          {/* Nav links */}
          <div className="hidden sm:flex items-center gap-2">
            <NavLink to="/menu">Menu</NavLink>
            <NavLink to="/cart" icon={ShoppingBag}>
              Cart
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-2 w-4 h-4 text-[10px] font-bold rounded-full flex items-center justify-center bg-sage-500 text-white"
                >
                  {cartCount}
                </motion.span>
              )}
            </NavLink>
            {user && <NavLink to="/orders" icon={ReceiptText}>Orders</NavLink>}

            {user?.isAdmin && (
              <>
                <div className="w-px h-4 mx-2 bg-sand-300" />
                <NavLink to="/admin/orders" icon={LayoutDashboard}>
                  Admin Orders
                </NavLink>
                <NavLink to="/admin/menu" icon={LayoutDashboard}>
                  Admin Menu
                </NavLink>
              </>
            )}
          </div>

          {/* Auth action */}
          {user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-forest-muted hover:text-red-600 hover:bg-red-50 transition-colors duration-200 active:scale-95"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Log out</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-forest-muted hover:text-sage-600 transition-colors duration-200"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>
    </motion.nav>
  );
}

export default Navbar;
