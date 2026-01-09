import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { logout } = useContext(AuthContext);
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
      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
}

export default Navbar;
