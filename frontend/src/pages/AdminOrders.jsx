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

  return (
    <div>
      <h2>Admin Dashboard — Orders</h2>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <div key={order.order_id} style={{ marginBottom: "20px" }}>
          <h3>Order #{order.order_id}</h3>
          <p><strong>User ID:</strong> {order.user_id}</p>
          <p><strong>Status:</strong> {order.status}</p>

          <select
            value={order.status}
            onChange={(e) =>
              updateStatus(order.order_id, e.target.value)
            }
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <ul>
            {order.items.map((item, idx) => (
              <li key={idx}>
                {item.name} × {item.quantity}
              </li>
            ))}
          </ul>

          <hr />
        </div>
      ))}
    </div>
  );
}

export default AdminOrders;
