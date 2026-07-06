import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { StatusBadge } from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Package } from "lucide-react";

const SkeletonOrder = () => (
  <div className="card p-6">
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-linen">
      <div className="skeleton h-6 w-32" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
    <div className="space-y-3">
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-10 w-full" />
    </div>
  </div>
);

function Orders() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        setError(err.response?.data?.msg || "Failed to load orders.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const sorted = [...orders].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="max-w-3xl mx-auto">
        <div className="animate-fade-up mb-8">
          <span className="eyebrow mb-2">Order history</span>
          <h1 className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3rem)] mb-2">
            My Orders
          </h1>
          <p className="text-ink-soft">Track the status of your past and current orders.</p>
        </div>

        {error && <div className="error-banner mb-6">{error}</div>}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        )}

        {!loading && sorted.length === 0 && !error && (
          <EmptyState
            icon={Package}
            title="No orders yet"
            text="Start ordering and your history will appear here."
            action={
              <Link to="/menu" className="btn-primary px-8 py-3">
                Browse Menu
              </Link>
            }
          />
        )}

        {!loading && sorted.length > 0 && (
          <div className="space-y-5">
            {sorted.map((order, idx) => (
              <article
                key={order.order_id}
                className="card p-6 animate-fade-up"
                style={{ animationDelay: `${Math.min(idx, 6) * 0.06}s` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 pb-4 border-b border-linen gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h2 className="font-display text-lg font-bold">Order #{order.order_id}</h2>
                      <StatusBadge status={order.status} />
                    </div>
                    {order.created_at && (
                      <p className="text-sm text-ink-soft">
                        {new Date(order.created_at).toLocaleString(undefined, {
                          weekday: "short", year: "numeric", month: "short",
                          day: "numeric", hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    )}
                  </div>
                  <div className="font-display font-extrabold text-2xl">
                    ₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                  </div>
                </div>

                <ul className="space-y-2.5">
                  {order.items.map((item, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-cream border border-linen"
                    >
                      <span className="font-medium">{item.name}</span>
                      <span className="text-sm text-ink-soft">× {item.quantity}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Orders;
