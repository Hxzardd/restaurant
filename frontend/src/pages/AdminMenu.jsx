import { useEffect, useState } from "react";
import api from "../api/axios";

function AdminMenu() {
  const [menu, setMenu] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "Veg",
  });

  const fetchMenu = async () => {
    const res = await api.get("/menu");
    setMenu(res.data);
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitForm = async (e) => {
    e.preventDefault();

    if (editingId) {
      await api.put(`/menu/${editingId}`, form);
    } else {
      await api.post("/menu", form);
    }

    setForm({ name: "", description: "", price: "", category: "Veg" });
    setEditingId(null);
    fetchMenu();
  };

  const editItem = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
    });
  };

  const deleteItem = async (id) => {
    if (!confirm("Delete this item?")) return;
    await api.delete(`/menu/${id}`);
    fetchMenu();
  };

  return (
    <div>
      <h2>Admin - Manage Menu</h2>

      <form onSubmit={submitForm}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          name="price"
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Veg">Veg</option>
          <option value="Non-Veg">Non-Veg</option>
        </select>

        <button type="submit">
          {editingId ? "Update Item" : "Add Item"}
        </button>
      </form>

      <hr />

      <ul>
        {menu.map((item) => (
          <li key={item.id}>
            <strong>{item.name}</strong> - ₹{item.price} ({item.category})
            <br />
            {item.description}
            <br />

            <button onClick={() => editItem(item)}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>

            <br /><br />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminMenu;
