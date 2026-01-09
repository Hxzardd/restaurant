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

  return (
    <div>
      <h2>My Orders</h2>

      {sortedOrders.length === 0 && <p>No orders yet</p>}

      {sortedOrders.map((order) => (
        <div key={order.order_id} style={{ marginBottom: "20px" }}>
          <h3>Order #{order.order_id}</h3>

          <p>
            <strong>Status:</strong> {order.status}
          </p>

          {order.created_at && (
            <p>
              <small>
                Placed at:{" "}
                {new Date(order.created_at).toLocaleString()}
              </small>
            </p>
          )}

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

export default Orders;
