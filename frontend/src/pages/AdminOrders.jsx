import { useEffect, useState } from "react";
import api from "../api/axios";

const STATUS_OPTIONS = ["Pending", "Preparing", "Ready", "Delivered"];

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/all");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch admin orders", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      fetchOrders(); // this rfreshes the list
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("pending")) return "bg-yellow-100 text-yellow-800";
    if (statusLower.includes("preparing")) return "bg-blue-100 text-blue-800";
    if (statusLower.includes("ready")) return "bg-purple-100 text-purple-800";
    if (statusLower.includes("delivered")) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const getStatusAnimation = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower.includes("preparing")) return "pulse-subtle";
    return "";
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
          <p className="text-gray-600">Manage and track all orders</p>
        </div>

        {orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-200">
            <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-700 text-xl font-semibold mb-2">No orders found</p>
            <p className="text-gray-500 text-sm">Orders will appear here when customers place them</p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-200"
            >
              <div className="flex items-start justify-between mb-6 pb-4 border-b border-gray-200">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      Order #{order.order_id}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(order.status)} ${getStatusAnimation(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">User ID:</span> {order.user_id}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.order_id, e.target.value)
                  }
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-medium transition-all duration-200"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">Order Items</p>
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
