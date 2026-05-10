import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Package, Clock, CheckCircle, XCircle, ChefHat } from "lucide-react";

const STATUS_META = {
  pending:   { label: "Pending",   bg: "bg-earth-100",  color: "text-earth-600", dot: "bg-earth-500", icon: Clock },
  preparing: { label: "Preparing", bg: "bg-sage-100",   color: "text-sage-600", dot: "bg-sage-500", icon: ChefHat },
  ready:     { label: "Ready",     bg: "bg-forest-100", color: "text-forest", dot: "bg-forest", icon: Package },
  delivered: { label: "Delivered", bg: "bg-green-100",  color: "text-green-700", dot: "bg-green-500", icon: CheckCircle },
  cancelled: { label: "Cancelled", bg: "bg-red-100",    color: "text-red-700", dot: "bg-red-500", icon: XCircle },
};

function getMeta(status) {
  const key = status?.toLowerCase() || "";
  for (const [k, v] of Object.entries(STATUS_META)) {
    if (key.includes(k)) return v;
  }
  return { label: status, bg: "bg-sand-200", color: "text-forest-muted", dot: "bg-forest-muted", icon: Package };
}

const SkeletonOrder = () => (
  <div className="card p-6">
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-sand-200">
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10 px-4 sm:px-6 lg:px-8 bg-sand min-h-screen"
    >
      <div className="max-w-3xl mx-auto mt-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mb-8"
        >
          <h2 className="font-display font-bold mb-2 text-forest" style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}>
            My Orders
          </h2>
          <p className="text-forest-muted text-lg">
            Track the status of your past and current orders.
          </p>
        </motion.div>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-5 py-4 mb-6 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => <SkeletonOrder key={i} />)}
          </div>
        )}

        {!loading && sorted.length === 0 && !error && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-white border border-sand-200 p-16 text-center shadow-soft"
          >
            <div className="text-5xl mb-5 opacity-80 text-forest-muted"><Package size={64} className="mx-auto" /></div>
            <p className="font-display text-2xl font-bold mb-2 text-forest">No orders yet</p>
            <p className="text-sm text-forest-muted">
              Start ordering and your history will appear here.
            </p>
          </motion.div>
        )}

        {!loading && sorted.length > 0 && (
          <div className="space-y-6">
            <AnimatePresence>
              {sorted.map((order, oi) => {
                const meta = getMeta(order.status);
                const isPreparing = order.status?.toLowerCase().includes("preparing");
                const StatusIcon = meta.icon;

                return (
                  <motion.div
                    key={order.order_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: oi * 0.05 }}
                    className="card p-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-5 pb-4 border-b border-sand-200 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1.5">
                          <h3 className="font-display text-xl font-bold text-forest">
                            Order #{order.order_id}
                          </h3>
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${meta.bg} ${meta.color} ${isPreparing ? 'animate-pulse' : ''}`}>
                            <StatusIcon size={12} />
                            {order.status}
                          </span>
                        </div>
                        {order.created_at && (
                          <p className="text-sm text-forest-muted">
                            {new Date(order.created_at).toLocaleString(undefined, {
                              weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                        )}
                      </div>
                      
                      <div className="font-display font-bold text-2xl text-forest">
                        ₹{order.items.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0) || order.total_amount || "0"}
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {order.items.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between px-4 py-3 rounded-lg bg-sand-50 border border-sand-200"
                        >
                          <span className="font-medium text-forest">{item.name}</span>
                          <div className="flex items-center gap-4 text-forest-muted">
                            <span className="text-sm">× {item.quantity}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Orders;
