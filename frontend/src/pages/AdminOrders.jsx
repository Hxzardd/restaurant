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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">Admin Dashboard — Orders</h2>

        {orders.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
            <p className="text-gray-500 text-xl font-medium">No orders found</p>
          </div>
        )}

        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Order #{order.order_id}
                  </h3>
                  <p className="text-base text-gray-600 font-semibold">
                    <strong>User ID:</strong> {order.user_id}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-base font-bold ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-base font-bold text-gray-700 mb-3">
                  Update Status:
                </label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus(order.order_id, e.target.value)
                  }
                  className="px-5 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-base font-medium w-full"
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <p className="text-base font-bold text-gray-900 mb-3">Items:</p>
                {order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg"
                  >
                    <span className="font-semibold text-gray-900 text-lg">{item.name}</span>
                    <span className="text-gray-700 font-bold text-lg">× {item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminOrders;
