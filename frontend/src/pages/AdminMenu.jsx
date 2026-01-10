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
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-gray-900 mb-10">Admin - Manage Menu</h2>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-10">
          <form onSubmit={submitForm} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input
                name="name"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                required
                className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
              />

              <input
                name="price"
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={handleChange}
                required
                className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
              />
            </div>

            <input
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              required
              className="w-full px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 text-base"
            />

            <div className="flex items-center gap-4">
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="px-5 py-4 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white text-base font-medium"
              >
                <option value="Veg">Veg</option>
                <option value="Non-Veg">Non-Veg</option>
              </select>

              <button
                type="submit"
                className="px-8 py-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-lg"
              >
                {editingId ? "Update Item" : "Add Item"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {item.name}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-bold ${
                      item.category === "Veg"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-red-600 mb-3">
                  ₹{item.price}
                </p>
                <p className="text-base text-gray-600">{item.description}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
                <button
                  onClick={() => editItem(item)}
                  className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminMenu;
