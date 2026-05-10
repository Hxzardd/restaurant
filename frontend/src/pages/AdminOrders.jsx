import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_OPTIONS = ["Pending", "Preparing", "Ready", "Delivered"];

const STATUS_META = {
  pending:   { bg: "rgba(212,170,60,0.12)",  color: "#d4aa3c" },
  preparing: { bg: "rgba(80,140,220,0.12)",  color: "#6a9fe0" },
  ready:     { bg: "rgba(140,90,220,0.12)",  color: "#b080e0" },
  delivered: { bg: "rgba(90,178,133,0.12)",  color: "#5ab285" },
};

function getMeta(status) {
  const key = status?.toLowerCase() || "";
  for (const [k, v] of Object.entries(STATUS_META)) {
    if (key.includes(k)) return v;
  }
  return { bg: "rgba(90,90,90,0.12)", color: "#888" };
}

const SkeletonOrder = () => (
  <div className="rounded-xl border p-6" style={{ backgroundColor: "#1d1915", borderColor: "#2a2320" }}>
    <div className="flex items-center gap-3 mb-5 pb-4 border-b" style={{ borderColor: "#2a2320" }}>
      <div className="skeleton h-5 w-28 rounded" />
      <div className="skeleton h-5 w-16 rounded-full" />
    </div>
    <div className="skeleton h-11 rounded-lg mb-5" />
    <div className="space-y-2">
      <div className="skeleton h-9 rounded-lg" />
      <div className="skeleton h-9 rounded-lg" />
    </div>
  </div>
);

function AdminOrders() {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState("");
  const [updateError, setUpdateError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const updateStatus = async (orderId, status) => {
    try {
      setUpdateError("");
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (err) {
      setUpdateError(err.response?.data?.msg || "Failed to update status.");
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2
            className="font-display font-bold mb-1"
            style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#f2ece0" }}
          >
            Order Management
          </h2>
          <p className="text-sm" style={{ color: "#5c4e42" }}>
            Review and update the status of all incoming orders.
          </p>
        </div>

        {/* Errors */}
        {(error || updateError) && (
          <div
            className="rounded-xl border px-5 py-4 mb-6 text-sm"
            style={{ backgroundColor: "rgba(200,90,90,0.08)", borderColor: "rgba(200,90,90,0.2)", color: "#e08080" }}
          >
            {error || updateError}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        )}

        {!loading && orders.length === 0 && !error && (
          <div
            className="rounded-xl border p-16 text-center"
            style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
          >
            <div className="text-5xl mb-5">📋</div>
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "#f2ece0" }}>No orders yet</p>
            <p className="text-sm" style={{ color: "#5c4e42" }}>Orders will appear here when customers place them.</p>
          </div>
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-4">
            {orders.map((order, oi) => {
              const meta = getMeta(order.status);
              const isPreparing = order.status?.toLowerCase().includes("preparing");
              return (
                <div
                  key={order.order_id}
                  className="card-hover p-6"
                  style={{ animationDelay: `${oi * 0.05}s` }}
                >
                  {/* Header row */}
                  <div
                    className="flex items-start justify-between mb-5 pb-4 border-b"
                    style={{ borderColor: "#2a2320" }}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-display text-lg font-bold" style={{ color: "#f2ece0" }}>
                          Order #{order.order_id}
                        </h3>
                        <span
                          className={`status-badge ${isPreparing ? "pulse-subtle" : ""}`}
                          style={{ backgroundColor: meta.bg, color: meta.color }}
                        >
                          {order.status}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: "#5c4e42" }}>
                        Customer ID: {order.user_id}
                      </p>
                    </div>
                  </div>

                  {/* Status selector */}
                  <div className="mb-5">
                    <label className="block text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#5c4e42" }}>
                      Update Status
                    </label>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.order_id, e.target.value)}
                      className="input-field"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {/* Items */}
                  <div>
                    <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: "#5c4e42" }}>
                      Order Items
                    </p>
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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
