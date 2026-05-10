import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const items = cart.map((item) => ({ menu_item_id: item.id, quantity: item.quantity }));
      await api.post("/orders", { items });
      clearCart();
      navigate("/orders");
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="py-10 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display font-bold mb-8"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)", color: "#f2ece0" }}
        >
          Your Cart
        </h2>

        {error && (
          <div
            className="rounded-xl border px-5 py-4 mb-6 text-sm"
            style={{ backgroundColor: "rgba(200,90,90,0.08)", borderColor: "rgba(200,90,90,0.2)", color: "#e08080" }}
          >
            {error}
          </div>
        )}

        {cart.length === 0 && (
          <div
            className="rounded-xl border p-16 text-center"
            style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
          >
            <div className="text-5xl mb-5">🛒</div>
            <p className="font-display text-2xl font-bold mb-2" style={{ color: "#f2ece0" }}>Your cart is empty</p>
            <p className="text-sm" style={{ color: "#5c4e42" }}>
              Browse the menu and add something delicious.
            </p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* ── Items ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="card-hover p-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="font-display text-lg font-bold mb-1" style={{ color: "#f2ece0" }}>
                        {item.name}
                      </h3>
                      <p className="font-display text-base font-semibold mb-4" style={{ color: "#e09040" }}>
                        ₹{item.price} × {item.quantity}{" "}
                        <span className="font-semibold text-sm" style={{ color: "#a89478" }}>
                          = ₹{item.price * item.quantity}
                        </span>
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 rounded-lg border flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-90"
                          style={{ borderColor: "#38302a", color: "#a89478", backgroundColor: "#1d1915" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#e09040"; e.currentTarget.style.color = "#e09040"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#38302a"; e.currentTarget.style.color = "#a89478"; }}
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold" style={{ color: "#f2ece0" }}>
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded-lg border flex items-center justify-center text-lg font-bold transition-all duration-150 active:scale-90"
                          style={{ borderColor: "#38302a", color: "#a89478", backgroundColor: "#1d1915" }}
                          onMouseEnter={e => { e.currentTarget.style.borderColor = "#e09040"; e.currentTarget.style.color = "#e09040"; }}
                          onMouseLeave={e => { e.currentTarget.style.borderColor = "#38302a"; e.currentTarget.style.color = "#a89478"; }}
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-3 text-xs font-semibold transition-colors duration-150"
                          style={{ color: "#5c4e42" }}
                          onMouseEnter={e => (e.currentTarget.style.color = "#e08080")}
                          onMouseLeave={e => (e.currentTarget.style.color = "#5c4e42")}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div
                className="rounded-xl border p-6 sticky top-24"
                style={{ backgroundColor: "#1d1915", borderColor: "#38302a" }}
              >
                <h3 className="font-display text-xl font-bold mb-6" style={{ color: "#f2ece0" }}>
                  Order Summary
                </h3>

                <div className="space-y-3 mb-6">
                  {[
                    ["Subtotal",    `₹${total}`],
                    ["Delivery",    "FREE"],
                    ["Tax & Fees",  "Included"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span style={{ color: "#5c4e42" }}>{label}</span>
                      <span
                        className="font-medium"
                        style={{ color: value === "FREE" ? "#5ab285" : "#a89478" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  <div className="pt-3 border-t" style={{ borderColor: "#38302a" }}>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-semibold" style={{ color: "#a89478" }}>Total</span>
                      <span className="font-display text-3xl font-bold" style={{ color: "#e09040" }}>
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full py-3.5 rounded-lg font-semibold text-sm transition-all duration-200 active:scale-95 mb-3"
                  style={{ backgroundColor: "#e09040", color: "#0f0d0b" }}
                  onMouseEnter={e => !loading && (e.currentTarget.style.backgroundColor = "#cc7e2e")}
                  onMouseLeave={e => !loading && (e.currentTarget.style.backgroundColor = "#e09040")}
                >
                  {loading ? "Placing Order…" : "Place Order Now"}
                </button>

                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg text-sm font-semibold border transition-all duration-200 active:scale-95"
                  style={{ borderColor: "#38302a", color: "#5c4e42" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "#e09040"; e.currentTarget.style.color = "#e09040"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "#38302a"; e.currentTarget.style.color = "#5c4e42"; }}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
