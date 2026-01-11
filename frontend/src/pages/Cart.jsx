import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function Cart() {
  const {
    cart,
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
  } = useContext(CartContext);

  const navigate = useNavigate();

  const placeOrder = async () => {
    const items = cart.map((item) => ({
      menu_item_id: item.id,
      quantity: item.quantity,
    }));

    await api.post("/orders", { items });
    clearCart();
    navigate("/orders");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-8">Your Cart</h2>

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
                  className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {item.name}
                      </h3>
                      <p className="text-xl font-bold text-orange-600 mb-4">
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

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg p-6 sticky top-24 border border-gray-200">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">₹{total}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-2xl font-bold text-orange-600">₹{total}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={placeOrder}
                  className="w-full bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-base mb-3"
                >
                  Place Order
                </button>
                <button
                  onClick={clearCart}
                  className="w-full border-2 border-gray-300 bg-white hover:border-orange-500 text-gray-700 hover:text-orange-600 font-semibold py-3 px-6 rounded-lg transition-all duration-200 active:scale-95 text-sm"
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
