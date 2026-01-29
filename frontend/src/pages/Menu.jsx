import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔍 Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError("");
        const params = {};

        if (search) params.q = search;
        if (category) params.category = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;

        const res = await api.get("/menu", { params });
        setMenu(res.data);
      } catch (err) {
        const errorMsg = err.response?.data?.msg || err.message || "Failed to load menu. Please try again.";
        setError(errorMsg);
        console.error("Failed to fetch menu", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [search, category, minPrice, maxPrice]);

  // Skeleton loader component
  const SkeletonCard = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col animate-pulse">
      <div className="p-6 flex-1 flex flex-col">
        <div className="h-6 bg-gray-200 rounded-md mb-4 w-2/3"></div>
        <div className="h-8 bg-gray-200 rounded-md mb-4 w-1/3"></div>
        <div className="h-4 bg-gray-200 rounded-md mb-3 w-full"></div>
        <div className="h-4 bg-gray-200 rounded-md mb-6 w-4/5"></div>
        <div className="h-10 bg-gray-200 rounded-lg mt-auto"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 page-fade-in">
      {/* Hero Section */}
      <div className="bg-white border-b border-gray-200 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Crafted Flavours, Delivered Fresh</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">Restaurant-quality meals, made to order and delivered hot</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* 🔍 Search & Filter UI */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-[200px] relative">
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-5 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-200"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-5 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-medium transition-all duration-200"
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
              className="w-full sm:w-32 px-5 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-200"
            />

            <input
              type="number"
              placeholder="Max Price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full sm:w-32 px-5 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-200"
            />
          </div>
        </div>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Unable to load menu</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Menu List */}
        {!loading && menu.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-200">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-gray-700 text-xl font-semibold mb-2">No items found</p>
            <p className="text-gray-500 text-sm">Try adjusting your search or filter criteria to find what you're looking for</p>
          </div>
        )}

        {!loading && menu.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menu.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col border border-gray-200"
              >
                <div className="p-6 flex-1 flex flex-col">
                  <div className="mb-4">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 leading-tight flex-1 pr-2">
                        {item.name}
                      </h3>
                      {item.category === "Veg" && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 border-2 border-green-600"></span>
                      )}
                      {item.category === "Non-Veg" && (
                        <span className="flex-shrink-0 w-5 h-5 rounded-full bg-red-600 border-2 border-red-700"></span>
                      )}
                    </div>
                    <p className="text-2xl font-bold text-orange-600 mb-3">
                      ₹{item.price}
                    </p>
                  </div>
                  <p className="text-gray-600 text-sm mb-6 flex-1 leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                  <button
                    onClick={() => addToCart(item)}
                    className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-base mt-auto"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
