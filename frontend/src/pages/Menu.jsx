import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";
import { imageFor } from "../constants/foodImages";
import { CategoryBadge } from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Search, Check, Plus, UtensilsCrossed } from "lucide-react";

const CATEGORIES = [
  { value: "", label: "All" },
  { value: "Veg", label: "Veg" },
  { value: "Non-Veg", label: "Non-Veg" },
];

const SkeletonCard = () => (
  <div className="card overflow-hidden flex flex-col">
    <div className="skeleton h-44 w-full rounded-none" />
    <div className="p-5 flex flex-col gap-3">
      <div className="skeleton h-6 w-3/4" />
      <div className="skeleton h-5 w-1/4" />
      <div className="skeleton h-4 w-full" />
      <div className="skeleton h-10 w-full mt-2 rounded-full" />
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
    <div className="pb-16">
      {/* ── Header ── */}
      <div className="border-b border-linen bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 animate-fade-up">
          <span className="eyebrow mb-3">The Menu</span>
          <h1 className="font-display font-extrabold tracking-tight leading-none text-[clamp(2.5rem,6vw,4.5rem)] mb-4">
            What are you craving?
          </h1>
          <p className="text-lg text-ink-soft max-w-xl">
            Fresh, made to order, and ready when you are.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ── Filters ── */}
        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-10">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-soft" aria-hidden="true" />
            <input
              type="search"
              aria-label="Search dishes"
              placeholder="Search dishes…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 rounded-full"
            />
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2" role="group" aria-label="Filter by category">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={label}
                onClick={() => setCategory(value)}
                aria-pressed={category === value}
                className={`chip ${category === value ? "chip-active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Price range */}
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="0"
              aria-label="Minimum price"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input-field w-24 rounded-full py-2"
            />
            <span className="text-ink-soft" aria-hidden="true">–</span>
            <input
              type="number"
              min="0"
              aria-label="Maximum price"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input-field w-24 rounded-full py-2"
            />
          </div>
        </div>

        {/* ── Error ── */}
        {error && <div className="error-banner mb-8">{error}</div>}

        {/* ── Skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && menu.length === 0 && !error && (
          <EmptyState
            icon={UtensilsCrossed}
            title="No dishes match"
            text="Try adjusting your search or filters to find what you're craving."
          />
        )}

        {/* ── Menu Grid ── */}
        {!loading && menu.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {menu.map((item, idx) => {
              const isAdded = added[item.id];
              return (
                <article
                  key={item.id}
                  className="card card-hover overflow-hidden group flex flex-col animate-fade-up"
                  style={{ animationDelay: `${Math.min(idx, 8) * 0.05}s` }}
                >
                  <div className="relative h-44 overflow-hidden bg-cream-dark">
                    <img
                      src={imageFor(item.id)}
                      alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-display text-lg font-bold leading-snug flex-1">
                        {item.name}
                      </h3>
                      <CategoryBadge category={item.category} />
                    </div>

                    <p className="text-sm leading-relaxed text-ink-soft flex-1 mb-4 line-clamp-2">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display font-extrabold text-xl">₹{item.price}</span>
                      <button
                        onClick={() => handleAdd(item)}
                        className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-200 inline-flex items-center gap-1.5 active:scale-[0.98] ${
                          isAdded
                            ? "bg-olive-100 text-olive-700"
                            : "bg-paprika text-white hover:bg-paprika-600 shadow-card"
                        }`}
                      >
                        {isAdded ? (
                          <><Check size={15} aria-hidden="true" /> Added</>
                        ) : (
                          <><Plus size={15} aria-hidden="true" /> Add</>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
