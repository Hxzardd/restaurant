import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../api/axios";
import { useNavigate, useLocation, Link } from "react-router-dom";
import EmptyState from "../components/ui/EmptyState";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";

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
    <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-[70vh]">
      <div className="max-w-5xl mx-auto">
        <div className="animate-fade-up mb-8">
          <span className="eyebrow mb-2">Almost there</span>
          <h1 className="font-display font-extrabold tracking-tight text-[clamp(2rem,5vw,3rem)]">
            Your Cart
          </h1>
        </div>

        {error && <div className="error-banner mb-6">{error}</div>}

        {cart.length === 0 && (
          <EmptyState
            icon={ShoppingBag}
            title="Your cart is empty"
            text="Browse the menu and add something delicious."
            action={
              <Link to="/menu" className="btn-primary px-8 py-3">
                Explore Menu
              </Link>
            }
          />
        )}

        {cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Items ── */}
            <div className="lg:col-span-2 flex flex-col gap-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-display text-lg font-bold mb-0.5">{item.name}</h3>
                    <p className="text-sm text-ink-soft">
                      ₹{item.price} <span className="mx-1">×</span> {item.quantity}
                    </p>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                    <div className="font-display font-extrabold text-lg min-w-[80px] text-right">
                      ₹{item.price * item.quantity}
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center bg-cream rounded-full border border-linen p-1">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        aria-label={`Decrease quantity of ${item.name}`}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-white transition-colors duration-200"
                      >
                        <Minus size={15} aria-hidden="true" />
                      </button>
                      <span className="w-8 text-center font-bold" aria-live="polite">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        aria-label={`Increase quantity of ${item.name}`}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-white transition-colors duration-200"
                      >
                        <Plus size={15} aria-hidden="true" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      aria-label={`Remove ${item.name} from cart`}
                      className="p-2 rounded-full text-ink-soft hover:text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <Trash2 size={17} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Summary ── */}
            <div className="lg:col-span-1">
              <div className="card p-6 sticky top-24">
                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                <dl className="space-y-3 mb-6 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Subtotal</dt>
                    <dd className="font-medium">₹{total}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Delivery</dt>
                    <dd className="font-semibold text-olive-600">FREE</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-ink-soft">Tax &amp; Fees</dt>
                    <dd className="font-medium">Included</dd>
                  </div>
                </dl>

                <div className="flex justify-between items-center pt-4 mb-6 border-t border-linen">
                  <span className="text-xs font-bold uppercase tracking-widest text-ink-soft">Total</span>
                  <span className="font-display text-3xl font-extrabold">₹{total}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="btn-primary w-full py-4 mb-3"
                >
                  {loading ? "Placing Order…" : (
                    <>{user ? "Place Order" : "Sign in to Order"} <ArrowRight size={18} aria-hidden="true" /></>
                  )}
                </button>

                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="btn-ghost w-full py-3 text-sm"
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
