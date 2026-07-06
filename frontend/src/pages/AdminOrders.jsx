import { useEffect, useState } from "react";
import api from "../api/axios";
import { StatusBadge } from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import { Package, User } from "lucide-react";

const STATUS_OPTIONS = ["Pending", "Preparing", "Ready", "Delivered", "Cancelled"];

const SkeletonOrder = () => (
  <div className="card p-6">
    <div className="flex items-center gap-3 mb-5 pb-4 border-b border-linen">
      <div className="skeleton h-6 w-32" />
      <div className="skeleton h-6 w-24 rounded-full" />
    </div>
    <div className="skeleton h-12 w-full rounded-xl mb-5" />
    <div className="space-y-3">
      <div className="skeleton h-10 w-full" />
      <div className="skeleton h-10 w-full" />
    </div>
  </div>
);

function AdminOrders() {
  const [orders, setOrders]           = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState("");
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
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <div className="animate-fade-up mb-8">
          <span className="eyebrow mb-2">Admin</span>
          <h1 className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3rem)] mb-2">
            Order Management
          </h1>
          <p className="text-ink-soft">Review and update the status of all incoming orders.</p>
        </div>

        {(error || updateError) && (
          <div className="error-banner mb-6">{error || updateError}</div>
        )}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        )}

        {!loading && orders.length === 0 && !error && (
          <EmptyState
            icon={Package}
            title="No orders yet"
            text="Orders will appear here when customers place them."
          />
        )}

        {!loading && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.order_id} className="card p-6">
                {/* Header row */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 pb-4 border-b border-linen gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1.5">
                      <h2 className="font-display text-lg font-bold">Order #{order.order_id}</h2>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="text-sm text-ink-soft flex items-center gap-1.5">
                      <User size={14} aria-hidden="true" /> Customer ID: {order.user_id}
                    </p>
                  </div>
                  <div className="font-display font-extrabold text-2xl">
                    ₹{order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)}
                  </div>
                </div>

                {/* Status selector */}
                <div className="mb-6 bg-cream p-4 rounded-xl border border-linen flex flex-col sm:flex-row sm:items-center gap-4">
                  <label
                    htmlFor={`status-${order.order_id}`}
                    className="text-xs font-bold tracking-widest uppercase text-ink-soft whitespace-nowrap"
                  >
                    Update Status
                  </label>
                  <select
                    id={`status-${order.order_id}`}
                    value={order.status}
                    onChange={(e) => updateStatus(order.order_id, e.target.value)}
                    className="input-field flex-1"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                {/* Items */}
                <div>
                  <p className="text-xs font-bold tracking-widest uppercase mb-3 text-ink-soft">
                    Order Items
                  </p>
                  <ul className="space-y-2.5">
                    {order.items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-center justify-between px-4 py-3 rounded-xl bg-cream border border-linen"
                      >
                        <span className="font-medium">{item.name}</span>
                        <span className="text-sm font-semibold text-ink-soft">× {item.quantity}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminOrders;
