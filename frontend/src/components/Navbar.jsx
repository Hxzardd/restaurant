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
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-10">
            <Link
              to="/menu"
              className="text-xl font-bold text-gray-900 hover:text-orange-600 transition-colors duration-200"
            >
              Hxzard's Restaurant
            </Link>
            <div className="flex items-center space-x-1">
              <Link
                to="/menu"
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 rounded-lg hover:bg-orange-50 active:scale-95 text-sm"
              >
                Menu
              </Link>
              <Link
                to="/cart"
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 rounded-lg hover:bg-orange-50 active:scale-95 text-sm"
              >
                Cart
              </Link>
              <Link
                to="/orders"
                className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 rounded-lg hover:bg-orange-50 active:scale-95 text-sm"
              >
                Orders
              </Link>
              {user?.isAdmin && (
                <>
                  <Link
                    to="/admin/orders"
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 rounded-lg hover:bg-orange-50 active:scale-95 text-sm"
                  >
                    Admin Orders
                  </Link>
                  <Link
                    to="/admin/menu"
                    className="px-4 py-2 text-gray-700 hover:text-orange-600 font-medium transition-all duration-200 rounded-lg hover:bg-orange-50 active:scale-95 text-sm"
                  >
                    Admin Menu
                  </Link>
                </>
              )}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-5 py-2 text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
