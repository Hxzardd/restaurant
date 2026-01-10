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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">Menu</h2>

        {/* 🔍 Search & Filter UI */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-10">
          <div className="flex flex-wrap gap-4">
            <input
              type="text"
              placeholder="Search food..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[200px] px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-base font-medium"
            >
              <option value="">All Categories</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>

            <input
              type="number"
              placeholder="Min Price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="w-36 px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-36 px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
            />
          </div>
        </div>

        {/* Menu List */}
        {menu.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg p-16 text-center">
            <p className="text-gray-500 text-xl font-medium">No items found</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 overflow-hidden border border-gray-200 flex flex-col"
            >
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-3xl font-bold text-red-600 mb-3">
                    ₹{item.price}
                  </p>
                </div>
                <p className="text-gray-500 text-base mb-6 flex-1 leading-relaxed">
                  {item.description}
                </p>
                <button
                  onClick={() => addToCart(item)}
                  className="w-full bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-lg mt-auto"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Menu;
