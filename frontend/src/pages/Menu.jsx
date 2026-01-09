import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [menu, setMenu] = useState([]);

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const params = {};

        if (search) params.q = search;
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;

        const res = await api.get("/menu", { params });
        setMenu(res.data);
      } catch (err) {
        console.error("Failed to fetch menu", err);
      }
    };

    fetchMenu();
  }, [search, category, minPrice, maxPrice]);

  return (
    <div>
      <h2>Menu</h2>

      {/* 🔍 Search & Filter UI */}
      <div style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Search food..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ marginLeft: "10px" }}
        >
          <option value="">All</option>
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          style={{ marginLeft: "10px", width: "100px" }}
        />

        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          style={{ marginLeft: "10px", width: "100px" }}
        />
      </div>

      {/* Menu List */}
      {menu.length === 0 && <p>No items found</p>}

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
