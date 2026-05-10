import { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

const VegDot = () => (
  <span
    className="flex-shrink-0 w-3 h-3 rounded-full border-2"
    style={{ backgroundColor: "#5ab285", borderColor: "#4a9a70" }}
    title="Vegetarian"
  />
);
const NonVegDot = () => (
  <span
    className="flex-shrink-0 w-3 h-3 rounded-full border-2"
    style={{ backgroundColor: "#c85a5a", borderColor: "#a84848" }}
    title="Non-Vegetarian"
  />
);

const SkeletonCard = () => (
  <div className="rounded-xl border p-6 flex flex-col gap-3" style={{ backgroundColor: "#1d1915", borderColor: "#2a2320" }}>
    <div className="skeleton h-5 w-3/4 rounded" />
    <div className="skeleton h-7 w-1/3 rounded" />
    <div className="skeleton h-4 w-full rounded" />
    <div className="skeleton h-4 w-4/5 rounded" />
    <div className="skeleton h-10 w-full rounded-lg mt-2" />
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
    <div className="page-fade-in">
      {/* ── Hero ── */}
      <div
        className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 100% 80% at 50% -20%, rgba(224,144,64,0.12) 0%, transparent 70%)",
        }}
      >
        {/* Decorative horizontal rule */}
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-px"
          style={{ background: "linear-gradient(90deg, transparent, #e09040, transparent)" }}
        />

        <div className="max-w-3xl mx-auto text-center">
          <p
            className="float-up inline-block text-xs font-semibold tracking-widest uppercase mb-6 px-4 py-2 rounded-full border"
            style={{ color: "#e09040", borderColor: "rgba(224,144,64,0.3)", backgroundColor: "rgba(224,144,64,0.07)" }}
          >
            Taste the Difference
          </p>
          <h1
            className="float-up delay-100 font-display font-bold leading-tight mb-5"
            style={{ fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#f2ece0" }}
          >
            Crafted Flavours,{" "}
            <em style={{ color: "#e09040", fontStyle: "italic" }}>Delivered Fresh</em>
          </h1>
          <p
            className="float-up delay-200 text-base max-w-xl mx-auto"
            style={{ color: "#5c4e42" }}
          >
            Restaurant-quality meals, made to order and delivered hot to your door.
          </p>

          {/* Feature pills */}
          <div className="float-up delay-300 flex flex-wrap items-center justify-center gap-6 mt-8 text-sm" style={{ color: "#a89478" }}>
            {["Fresh ingredients daily", "Made to order", "Hot delivery"].map((f) => (
              <span key={f} className="flex items-center gap-2">
                <span style={{ color: "#e09040" }}>✦</span> {f}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* ── Filters ── */}
        <div
          className="rounded-xl border p-5 mb-8"
          style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
        >
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: "#5c4e42" }}
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search dishes…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-field pl-11"
              />
            </div>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="input-field sm:w-44"
              style={{ paddingLeft: "1rem" }}
            >
              <option value="">All Categories</option>
              <option value="Veg">Veg</option>
              <option value="Non-Veg">Non-Veg</option>
            </select>

            <input
              type="number"
              placeholder="Min ₹"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="input-field sm:w-28"
            />
            <input
              type="number"
              placeholder="Max ₹"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="input-field sm:w-28"
            />
          </div>
        </div>

        {/* ── Error ── */}
        {error && (
          <div
            className="rounded-xl border px-5 py-4 mb-8 text-sm"
            style={{ backgroundColor: "rgba(200,90,90,0.08)", borderColor: "rgba(200,90,90,0.2)", color: "#e08080" }}
          >
            {error}
          </div>
        )}

        {/* ── Skeleton ── */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* ── Empty ── */}
        {!loading && menu.length === 0 && !error && (
          <div
            className="rounded-xl border p-16 text-center"
            style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
          >
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "#f2ece0" }}>No items found</p>
            <p className="text-sm" style={{ color: "#5c4e42" }}>Try adjusting your search or filters.</p>
          </div>
        )}

        {/* ── Menu Grid ── */}
        {!loading && menu.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {menu.map((item, idx) => {
              const popular = idx < 3;
              const isAdded = added[item.id];
              return (
                <div
                  key={item.id}
                  className="card-hover flex flex-col relative group"
                  style={{ animationDelay: `${(idx % 8) * 0.05}s` }}
                >
                  {popular && (
                    <div className="absolute -top-2.5 -right-2.5 z-10 badge-pop">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-bold"
                        style={{ backgroundColor: "#e09040", color: "#0f0d0b" }}
                      >
                        Popular
                      </span>
                    </div>
                  )}

                  <div className="p-5 flex flex-col flex-1">
                    {/* Name row */}
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-display text-lg font-bold leading-snug flex-1" style={{ color: "#f2ece0" }}>
                        {item.name}
                      </h3>
                      {item.category === "Veg"     && <VegDot />}
                      {item.category === "Non-Veg" && <NonVegDot />}
                    </div>

                    {/* Price */}
                    <p className="font-display text-2xl font-bold mb-3" style={{ color: "#e09040" }}>
                      ₹{item.price}
                    </p>

                    {/* Description */}
                    <p className="text-sm leading-relaxed flex-1 mb-5 line-clamp-2" style={{ color: "#5c4e42" }}>
                      {item.description}
                    </p>

                    {/* CTA */}
                    <button
                      onClick={() => handleAdd(item)}
                      className="w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
                      style={{
                        backgroundColor: isAdded ? "#1d1915" : "#e09040",
                        color: isAdded ? "#e09040" : "#0f0d0b",
                        border: isAdded ? "1px solid #e09040" : "1px solid transparent",
                      }}
                    >
                      {isAdded ? "✓ Added" : "Add to Cart"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
