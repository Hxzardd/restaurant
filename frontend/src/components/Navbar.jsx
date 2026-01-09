import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ marginBottom: "20px" }}>
      <Link to="/menu">Menu</Link> |{" "}
      <Link to="/cart">Cart</Link> |{" "}
      <Link to="/orders">My Orders</Link>
    </nav>
  );
}

export default Navbar;
