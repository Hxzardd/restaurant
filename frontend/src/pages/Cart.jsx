import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ArrowRight } from "lucide-react";

function Cart() {
  const { cart, addToCart, decreaseQuantity, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();
  const location              = useLocation();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const placeOrder = async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-10 px-4 sm:px-6 lg:px-8 bg-sand min-h-screen"
    >
      <div className="max-w-5xl mx-auto mt-8">
        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="font-display font-bold mb-8 text-forest"
          style={{ fontSize: "clamp(2rem, 5vw, 3rem)" }}
        >
          Your Cart
        </motion.h2>

        {error && (
          <div className="rounded-xl bg-red-50 border border-red-100 px-5 py-4 mb-6 text-sm text-red-600 shadow-sm">
            {error}
          </div>
        )}

        {cart.length === 0 && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="rounded-2xl bg-white border border-sand-200 p-16 text-center shadow-soft"
          >
            <div className="text-5xl mb-5 opacity-80">🛒</div>
            <p className="font-display text-2xl font-bold mb-2 text-forest">Your cart is empty</p>
            <p className="text-sm text-forest-muted">
              Browse the menu and add something delicious.
            </p>
            <button onClick={() => navigate('/menu')} className="mt-8 btn-primary px-8 py-3">
              Explore Menu
            </button>
          </motion.div>
        )}

        {cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Items ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              <AnimatePresence>
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                    className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <h3 className="font-display text-xl font-bold mb-1 text-forest">
                        {item.name}
                      </h3>
                      <p className="font-medium text-sage-600">
                        ₹{item.price} <span className="text-forest-muted font-normal mx-1">×</span> {item.quantity}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="font-display font-bold text-xl text-forest min-w-[80px] text-right">
                        ₹{item.price * item.quantity}
                      </div>

                      {/* Quantity controls */}
                      <div className="flex items-center bg-sand-100 rounded-lg border border-sand-200 p-1">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-8 h-8 rounded flex items-center justify-center text-forest-muted hover:text-forest hover:bg-white transition-all duration-200"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-bold text-forest">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-8 h-8 rounded flex items-center justify-center text-forest-muted hover:text-forest hover:bg-white transition-all duration-200"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-forest-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                        title="Remove item"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card p-6 sticky top-24"
              >
                <h3 className="font-display text-2xl font-bold mb-6 text-forest">
                  Order Summary
                </h3>

                <div className="space-y-4 mb-6">
                  {[
                    ["Subtotal",    `₹${total}`],
                    ["Delivery",    "FREE"],
                    ["Tax & Fees",  "Included"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-sm">
                      <span className="text-forest-muted">{label}</span>
                      <span
                        className="font-medium"
                        style={{ color: value === "FREE" ? "#5ab285" : "#2b342d" }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}

                  <div className="pt-4 border-t border-sand-200 mt-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-semibold text-earth uppercase tracking-wider">Total</span>
                      <span className="font-display text-4xl font-bold text-forest">
                        ₹{total}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="btn-primary w-full py-4 mb-3 flex items-center justify-center gap-2"
                >
                  {loading ? "Placing Order…" : (
                    <>Place Order <ArrowRight size={18} /></>
                  )}
                </button>

                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="btn-secondary w-full py-3"
                >
                  Clear Cart
                </button>
              </motion.div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default Cart;
