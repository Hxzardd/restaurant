import { useEffect, useState } from "react";
import api from "../api/axios";

function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.get("/orders/my");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch orders", err);
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

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">My Orders</h2>

        {sortedOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-200">
            <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-700 text-xl font-semibold mb-2">No orders yet</p>
            <p className="text-gray-500 text-sm">Start ordering delicious food and your order history will appear here</p>
          </div>
        )}

        <div className="space-y-6">
          {sortedOrders.map((order) => (
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
      </div>
    </div>
  );
}

export default Orders;
