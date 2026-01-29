import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function Cart() {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const placeOrder = async () => {
    try {
      setLoading(true);
      setError("");
      const items = cart.map((item) => ({
        menu_item_id: item.id,
        quantity: item.quantity,
      }));

      await api.post("/orders", { items });
      clearCart();
      navigate("/orders");
    } catch (err) {
      const errorMsg = err.response?.data?.msg || err.message || "Failed to place order. Please try again.";
      setError(errorMsg);
      setLoading(false);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Your Cart</h2>

        {/* Error state */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
              </svg>
              <div>
                <p className="font-semibold text-red-900">Order failed</p>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {cart.length === 0 && (
          <div className="bg-white rounded-xl shadow-md p-16 text-center border border-gray-200">
            <svg className="mx-auto h-20 w-20 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <p className="text-gray-700 text-xl font-semibold mb-2">Your cart is empty</p>
            <p className="text-gray-500 text-sm">Browse our menu and add delicious items to get started with your order</p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-lg font-bold text-orange-600 mb-4">
                        ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 bg-white hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-bold transition-all duration-200 flex items-center justify-center active:scale-95"
                        >
                          −
                        </button>
                        <span className="text-gray-900 font-bold text-base min-w-[2.5rem] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => addToCart(item)}
                          className="w-9 h-9 rounded-lg border-2 border-gray-300 bg-white hover:border-orange-500 hover:bg-orange-50 text-gray-700 hover:text-orange-600 font-bold transition-all duration-200 flex items-center justify-center active:scale-95"
                        >
                          +
                        </button>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="ml-4 px-4 py-2 text-sm text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-all duration-200 font-semibold active:scale-95"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary - Level 3 Improved */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-orange-50 to-white rounded-xl shadow-xl p-6 sticky top-24 border-2 border-orange-200">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-3 mb-7 bg-white rounded-lg p-4">
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Delivery Fee</span>
                    <span className="font-semibold text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-gray-600 text-sm">
                    <span>Tax & Charges</span>
                    <span className="font-semibold text-gray-900">Included</span>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-gray-900">Total Amount</span>
                      <span className="text-3xl font-bold text-orange-600">₹{total}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl text-base mb-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Placing Order..." : "Place Order Now"}
                </button>
                <button
                  onClick={clearCart}
                  disabled={loading}
                  className="w-full border-2 border-gray-300 bg-white hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
