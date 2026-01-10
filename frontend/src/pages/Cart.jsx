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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">Cart</h2>

        {cart.length === 0 && (
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-16 text-center">
            <p className="text-gray-500 text-xl font-medium">Your cart is empty</p>
          </div>
        )}

        {cart.length > 0 && (
          <div className="space-y-6 mb-8">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-2xl font-bold text-red-600 mb-4">
                      ₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQuantity(item.id)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                      >
                        −
                      </button>
                      <span className="text-gray-900 font-bold text-lg min-w-[3rem] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        className="w-10 h-10 rounded-full border-2 border-gray-300 hover:border-red-500 hover:bg-red-50 text-gray-700 hover:text-red-600 font-bold text-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-4 px-5 py-2 text-base text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 font-semibold border-2 border-red-200 hover:border-red-400"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 sticky bottom-0">
            <div className="flex items-center justify-between mb-8 pb-6 border-b-2 border-gray-200">
              <span className="text-2xl font-bold text-gray-900">Total</span>
              <span className="text-4xl font-bold text-red-600">₹{total}</span>
            </div>
            <div className="flex gap-4">
              <button
                onClick={placeOrder}
                className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-lg"
              >
                Place Order
              </button>
              <button
                onClick={clearCart}
                className="px-8 py-4 border-2 border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600 font-bold rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-lg"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
