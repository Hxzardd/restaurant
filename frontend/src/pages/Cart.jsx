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

  return (
    <div>
      <h2>Cart</h2>

      {cart.length === 0 && <p>Cart is empty</p>}

      <ul>
        {cart.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> × {item.quantity}
            <br />

            <button onClick={() => decreaseQuantity(item.id)}>-</button>
            <button onClick={() => addToCart(item)}>+</button>
            <button onClick={() => removeFromCart(item.id)}>
              Remove
            </button>

            <br /><br />
          </li>
        ))}
      </ul>

      {cart.length > 0 && (
        <>
          <button onClick={placeOrder}>Place Order</button>
          <br /><br />
          <button onClick={clearCart}>Clear Cart</button>
        </>
      )}
    </div>
  );
}

export default Cart;
