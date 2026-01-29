import { useEffect, useState } from "react";
import api from "../api/axios";
import Footer from "../components/Footer";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        const errorMsg = err.response?.data?.msg || err.message || "Failed to load your orders. Please try again.";
        setError(errorMsg);
        console.error("Failed to fetch orders", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("pending")) return "bg-yellow-100 text-yellow-800";
    if (statusLower.includes("confirmed") || statusLower.includes("preparing")) return "bg-blue-100 text-blue-800";
    if (statusLower.includes("delivered") || statusLower.includes("completed")) return "bg-green-100 text-green-800";
    if (statusLower.includes("cancelled") || statusLower.includes("canceled")) return "bg-red-100 text-red-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusAnimation = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("preparing")) return "pulse-subtle";
    return "";
  };

  // Skeleton loader
  const SkeletonOrder = () => (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 animate-pulse">
      <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
        <div className="flex-1">
          <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-48"></div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-10 bg-gray-200 rounded-lg"></div>
        <div className="h-10 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h2>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Unable to load orders</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* Loading state */}
        {loading && (
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <SkeletonOrder key={i} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && sortedOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-200">
            <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-700 text-xl font-semibold mb-2">No orders yet</p>
            <p className="text-gray-500 text-sm">Start ordering delicious food and your order history will appear here</p>
          </div>
        )}

        {/* Orders list */}
        {!loading && sortedOrders.length > 0 && (
          <div className="space-y-6">
            {sortedOrders.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-200"
              >
                <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">
                        Order #{order.order_id}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} ${getStatusAnimation(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </div>
                    {order.created_at && (
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{new Date(order.created_at).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between py-2.5 px-4 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium text-gray-900">{item.name}</span>
                      <span className="text-gray-700 font-semibold">× {item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Orders;
