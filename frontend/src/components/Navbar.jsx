import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-gray-200 sticky top-0 z-50 mb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-2">
            <Link
              to="/menu"
              className="px-5 py-3 text-gray-700 hover:text-red-600 font-semibold transition-all duration-200 rounded-xl hover:bg-red-50 text-base"
            >
              Menu
            </Link>
            <Link
              to="/cart"
              className="px-5 py-3 text-gray-700 hover:text-red-600 font-semibold transition-all duration-200 rounded-xl hover:bg-red-50 text-base"
            >
              Cart
            </Link>
            <Link
              to="/orders"
              className="px-5 py-3 text-gray-700 hover:text-red-600 font-semibold transition-all duration-200 rounded-xl hover:bg-red-50 text-base"
            >
              My Orders
            </Link>
            {user?.isAdmin && (
              <>
                <Link
                  to="/admin/orders"
                  className="px-5 py-3 text-gray-700 hover:text-red-600 font-semibold transition-all duration-200 rounded-xl hover:bg-red-50 text-base"
                >
                  Admin Orders
                </Link>
                <Link
                  to="/admin/menu"
                  className="px-5 py-3 text-gray-700 hover:text-red-600 font-semibold transition-all duration-200 rounded-xl hover:bg-red-50 text-base"
                >
                  Admin Menu
                </Link>
              </>
            )}
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-3 text-white bg-red-600 hover:bg-red-700 active:bg-red-800 font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
