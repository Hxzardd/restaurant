import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, Check, Plus } from "lucide-react";

const FOOD_IMAGES = [
  "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1484723091791-00d3121d5854?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1499028344343-cd173ffc68a9?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=800&q=80"
];

const VegDot = () => (
  <span
    className="flex-shrink-0 w-3 h-3 rounded-full border-2 bg-green-500 border-green-600 shadow-sm"
    title="Vegetarian"
  />
);
const NonVegDot = () => (
  <span
    className="flex-shrink-0 w-3 h-3 rounded-full border-2 bg-red-500 border-red-600 shadow-sm"
    title="Non-Vegetarian"
  />
);

const SkeletonCard = () => (
  <div className="card overflow-hidden flex flex-col">
    <div className="skeleton h-48 w-full rounded-none" />
    <div className="p-5 flex flex-col gap-3">
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-5 w-1/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-10 w-full mt-2" />
    </div>
  </div>
);

function Menu() {
  const [menu, setMenu]         = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [search, setSearch]     = useState("");
  const [category, setCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [added, setAdded]       = useState({});

  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const params = {};
        if (search)   params.q         = search;
        if (category) params.category  = category;
        if (minPrice) params.min_price = minPrice;
        if (maxPrice) params.max_price = maxPrice;
        const res = await api.get("/menu", { params });
        setMenu(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load menu.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [search, category, minPrice, maxPrice]);

  const handleAdd = (item) => {
    addToCart(item);
    setAdded((prev) => ({ ...prev, [item.id]: true }));
    setTimeout(() => setAdded((prev) => ({ ...prev, [item.id]: false })), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-sand min-h-screen pb-16"
    >
      {/* ── Hero ── */}
      <div className="relative py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-sage-50 border-b border-sand-200">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.span
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="inline-block text-xs font-bold tracking-widest uppercase mb-6 px-4 py-1.5 rounded-full bg-sage-200 text-sage-800"
          >
            The Menu
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="font-display font-bold leading-tight mb-6 text-forest"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)" }}
          >
            A Symphony of <em className="text-sage-600 font-normal">Flavors</em>
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg max-w-2xl mx-auto text-forest-muted"
          >
            Curated with love, using only the freshest organic ingredients. Explore our diverse range of culinary delights.
          </motion.p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filters ── */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-sand-200 p-4 mb-10 shadow-soft"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-muted" />
              <input
                type="text"
                placeholder="Search dishes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>

            <div className="flex flex-row gap-4 items-center">
              <div className="relative">
                <SlidersHorizontal className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-forest-muted pointer-events-none" />
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="input-field sm:w-44 pl-11 appearance-none"
                >
                  <option value="">All Categories</option>
                  <option value="Veg">Vegetarian</option>
                  <option value="Non-Veg">Non-Vegetarian</option>
                </select>
              </div>

              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="input-field w-24"
              />
              <span className="text-forest-muted">-</span>
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="input-field w-24"
              />
            </div>
          </div>
        </motion.div>

        {/* ── Error ── */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-5 py-4 mb-8 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* ── Skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && menu.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-sand-200 bg-white p-16 text-center shadow-soft"
          >
            <p className="font-display text-2xl font-bold mb-2 text-forest">No items found</p>
            <p className="text-sm text-forest-muted">Try adjusting your search or filters to find what you're craving.</p>
          </motion.div>
        )}

        {/* ── Menu Grid ── */}
        {!loading && menu.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {menu.map((item, idx) => {
                const popular = idx < 3;
                const isAdded = added[item.id];
                const imageSrc = FOOD_IMAGES[item.id % FOOD_IMAGES.length];
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: idx * 0.05 }}
                    className="card overflow-hidden group flex flex-col"
                  >
                    {/* Image Section */}
                    <div className="relative h-48 overflow-hidden bg-sand-200">
                      {popular && (
                        <div className="absolute top-3 right-3 z-10">
                          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sage-500 text-white shadow-md">
                            Popular
                          </span>
                        </div>
                      )}
                      <img
                        src={imageSrc}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    </div>

                    <div className="p-5 flex flex-col flex-1 bg-white">
                      {/* Name row */}
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-display text-xl font-bold leading-snug text-forest flex-1">
                          {item.name}
                        </h3>
                        <div className="mt-1">
                          {item.category === "Veg" ? <VegDot /> : <NonVegDot />}
                        </div>
                      </div>

                      {/* Price */}
                      <p className="font-medium text-xl text-sage-600 mb-3">
                        ₹{item.price}
                      </p>

                      {/* Description */}
                      <p className="text-sm leading-relaxed text-forest-muted flex-1 mb-5 line-clamp-2">
                        {item.description}
                      </p>

                      {/* CTA */}
                      <button
                        onClick={() => handleAdd(item)}
                        className={`w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                          isAdded 
                            ? "bg-sage-50 text-sage-600 border border-sage-200"
                            : "bg-sage-500 text-white hover:bg-sage-600 shadow-soft hover:shadow-float"
                        }`}
                      >
                        {isAdded ? (
                          <><Check size={16} /> Added</>
                        ) : (
                          <><Plus size={16} /> Add to Cart</>
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

export default Menu;
