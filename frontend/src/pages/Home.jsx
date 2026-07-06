import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { imageFor } from "../constants/foodImages";
import { CategoryBadge } from "../components/ui/Badge";
import { ArrowRight, Timer, Flame, Bike } from "lucide-react";

const PERKS = [
  { icon: Flame, title: "Fresh from the kitchen", text: "Every dish is made to order. Nothing sits under a heat lamp." },
  { icon: Timer, title: "Order in seconds", text: "Browse, add to cart, done. No account needed until checkout." },
  { icon: Bike, title: "Track it to your door", text: "Follow your order from Pending to Ready in real time." },
];

function Home() {
  const [popular, setPopular] = useState([]);

  useEffect(() => {
    api.get("/menu", { params: { available: true } })
      .then((res) => setPopular(res.data.slice(0, 4)))
      .catch(() => setPopular([]));
  }, []);

  return (
    <div>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28 grid lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-up">
            <span className="eyebrow mb-5">Hungry? Good.</span>
            <h1 className="font-display font-extrabold leading-[0.95] tracking-tight text-[clamp(2.75rem,7vw,5rem)] mb-6">
              Real food.
              <br />
              Zero fuss.
              <br />
              <span className="text-paprika">Fast.</span>
            </h1>
            <p className="text-lg text-ink-soft max-w-md mb-9">
              Browse the menu, build your cart, and track your order from kitchen to doorstep — all in one place.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu" className="btn-primary px-8 py-4 text-base">
                Order Now <ArrowRight size={18} aria-hidden="true" />
              </Link>
              <Link to="/orders" className="btn-secondary px-8 py-4 text-base">
                Track My Orders
              </Link>
            </div>
          </div>

          {/* Hero visual — stacked dish cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`rounded-2xl overflow-hidden shadow-lift animate-fade-up ${i % 2 === 1 ? "translate-y-8" : ""}`}
                style={{ animationDelay: `${0.1 + i * 0.1}s` }}
              >
                <img
                  src={imageFor(i)}
                  alt=""
                  className="w-full h-52 object-cover"
                  loading={i < 2 ? "eager" : "lazy"}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular dishes ── */}
      {popular.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="eyebrow mb-2">Crowd favourites</span>
              <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight">Order your favourites</h2>
            </div>
            <Link to="/menu" className="hidden sm:inline-flex btn-ghost px-4 py-2 text-sm">
              Full menu <ArrowRight size={16} aria-hidden="true" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popular.map((item, idx) => (
              <Link
                key={item.id}
                to="/menu"
                className="card card-hover overflow-hidden group animate-fade-up"
                style={{ animationDelay: `${idx * 0.08}s` }}
              >
                <div className="h-40 overflow-hidden bg-cream-dark">
                  <img
                    src={imageFor(item.id)}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display font-bold leading-snug">{item.name}</h3>
                    <CategoryBadge category={item.category} />
                  </div>
                  <p className="font-bold text-paprika">₹{item.price}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ── Perks ── */}
      <section className="bg-white border-y border-linen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid sm:grid-cols-3 gap-10">
          {PERKS.map((perk) => (
            <div key={perk.title}>
              <span className="w-11 h-11 rounded-full bg-paprika-50 text-paprika flex items-center justify-center mb-4">
                <perk.icon size={20} aria-hidden="true" />
              </span>
              <h3 className="font-display font-bold text-lg mb-1.5">{perk.title}</h3>
              <p className="text-sm text-ink-soft leading-relaxed">{perk.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3.5rem)] mb-4">
          From kitchen to doorstep.
        </h2>
        <p className="text-ink-soft text-lg mb-8">Your next meal is a few clicks away.</p>
        <Link to="/menu" className="btn-primary px-10 py-4 text-base">
          Browse the Menu <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </div>
  );
}

export default Home;
