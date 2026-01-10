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

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">My Orders</h2>

        {sortedOrders.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
            <p className="text-gray-500 text-xl font-medium">No orders yet</p>
          </div>
        )}

        <div className="space-y-6">
          {sortedOrders.map((order) => (
            <div
              key={order.order_id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 hover:shadow-xl transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-6 pb-6 border-b-2 border-gray-200">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    Order #{order.order_id}
                  </h3>
                  {order.created_at && (
                    <p className="text-base text-gray-600 font-medium">
                      Placed at: {new Date(order.created_at).toLocaleString()}
                    </p>
                  )}
                </div>
                <span
                  className={`px-4 py-2 rounded-full text-base font-bold ${getStatusColor(order.status)}`}
                >
                  {order.status}
                </span>
              </div>

              <div className="space-y-3">
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

export default Orders;
