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
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/menu">Menu</Link> |{" "}
      <Link to="/cart">Cart</Link> |{" "}
      <Link to="/orders">My Orders</Link> |{" "}
      {user?.isAdmin && (
        <>
          <Link to="/admin/orders">Admin Orders</Link> |{" "}
          <Link to="/admin/menu">Admin Menu</Link> |{" "}
        </>
      )}
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
