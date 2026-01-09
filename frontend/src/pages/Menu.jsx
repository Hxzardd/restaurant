import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [menu, setMenu] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const res = await api.get("/menu");
        setMenu(res.data);
      } catch (err) {
        console.error("Failed to fetch menu", err);
      }
    };

    fetchMenu();
  }, []);

  return (
    <div>
      <h2>Menu</h2>

      {menu.length === 0 && <p>No items available</p>}

      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> — ₹{item.price}
            <br />
            {item.description}
            <br />
            <button onClick={() => addToCart(item)}>
              Add to Cart
            </button>
            <br /><br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Menu;
