import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_META = {
  pending:   { label: "Pending",   bg: "rgba(212,170,60,0.12)",  color: "#d4aa3c", dot: "#d4aa3c" },
  preparing: { label: "Preparing", bg: "rgba(80,140,220,0.12)",  color: "#6a9fe0", dot: "#6a9fe0" },
  ready:     { label: "Ready",     bg: "rgba(140,90,220,0.12)",  color: "#b080e0", dot: "#b080e0" },
  delivered: { label: "Delivered", bg: "rgba(90,178,133,0.12)",  color: "#5ab285", dot: "#5ab285" },
  cancelled: { label: "Cancelled", bg: "rgba(200,90,90,0.10)",   color: "#c85a5a", dot: "#c85a5a" },
};

function getMeta(status) {
  const key = status?.toLowerCase() || "";
  for (const [k, v] of Object.entries(STATUS_META)) {
    if (key.includes(k)) return v;
  }
  return { label: status, bg: "rgba(90,90,90,0.12)", color: "#888", dot: "#888" };
}

const SkeletonOrder = () => (
  <div className="rounded-xl border p-6" style={{ backgroundColor: "#1d1915", borderColor: "#2a2320" }}>
    <div className="flex items-center gap-3 mb-4 pb-4 border-b" style={{ borderColor: "#2a2320" }}>
      <div className="skeleton h-5 w-24 rounded" />
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
    <div className="space-y-2">
      <div className="skeleton h-9 rounded-lg" />
      <div className="skeleton h-9 rounded-lg" />
    </div>
  </div>
);

function Orders() {
  const [orders, setOrders] = useState([]);
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
    <div className="py-10 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-3xl mx-auto">
        <h2
          className="font-display font-bold mb-2"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#f2ece0" }}
        >
          My Orders
        </h2>
        <p className="text-sm mb-8" style={{ color: "#5c4e42" }}>
          Track the status of your past and current orders.
        </p>

        {error && (
          <div
            className="rounded-xl border px-5 py-4 mb-6 text-sm"
            style={{ backgroundColor: "rgba(200,90,90,0.08)", borderColor: "rgba(200,90,90,0.2)", color: "#e08080" }}
          >
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        )}

        {!loading && sorted.length === 0 && !error && (
          <div
            className="rounded-xl border p-16 text-center"
            style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
          >
            <div className="text-5xl mb-5">📋</div>
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "#f2ece0" }}>No orders yet</p>
            <p className="text-sm" style={{ color: "#5c4e42" }}>
              Start ordering and your history will appear here.
            </p>
          </div>
        )}

        {!loading && sorted.length > 0 && (
          <div className="space-y-4">
            {sorted.map((order, oi) => {
              const meta = getMeta(order.status);
              const isPreparing = order.status?.toLowerCase().includes("preparing");
              return (
                <div
                  key={order.order_id}
                  className="card-hover p-6"
                  style={{ animationDelay: `${oi * 0.06}s` }}
                >
                  {/* Header */}
                  <div
                    className="flex items-start justify-between mb-5 pb-4 border-b"
                    style={{ borderColor: "#2a2320" }}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="font-display text-lg font-bold" style={{ color: "#f2ece0" }}>
                          Order #{order.order_id}
                        </h3>
                        <span
                          className={`status-badge ${isPreparing ? "pulse-subtle" : ""}`}
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          <span
                            className="inline-block w-1.5 h-1.5 rounded-full mr-1.5"
                            style={{ backgroundColor: meta.dot }}
                          />
                          {order.status}
                        </span>
                      </div>
                      {order.created_at && (
                        <p className="text-xs" style={{ color: "#5c4e42" }}>
                          {new Date(order.created_at).toLocaleString()}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-2">
                    {order.items.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-4 py-2.5 rounded-lg"
                        style={{ backgroundColor: "#151210" }}
                      >
                        <span className="text-sm font-medium" style={{ color: "#a89478" }}>{item.name}</span>
                        <span className="text-sm font-semibold" style={{ color: "#5c4e42" }}>× {item.quantity}</span>
                      </div>
                    ))}
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

export default Orders;
