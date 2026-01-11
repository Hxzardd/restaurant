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
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-6 lg:px-8 page-fade-in">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h2 className="text-4xl font-bold text-gray-900 mb-2">Manage Menu</h2>
          <p className="text-gray-600">Add, edit, or remove menu items</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-8 mb-8 border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            {editingId ? "Edit Menu Item" : "Add New Menu Item"}
          </h3>
          <form onSubmit={submitForm} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Item Name</label>
                <input
                  name="name"
                  placeholder="Enter item name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
                <input
                  name="price"
                  type="number"
                  placeholder="Enter price"
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-200"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                name="description"
                placeholder="Enter item description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base transition-all duration-200"
              />
            </div>

            <div className="flex items-end gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-base font-medium transition-all duration-200"
                >
                  <option value="Veg">Veg</option>
                  <option value="Non-Veg">Non-Veg</option>
                </select>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white font-bold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg text-base"
              >
                {editingId ? "Update Item" : "Add Item"}
              </button>
            </div>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menu.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 p-6 border border-gray-200"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-bold text-gray-900 flex-1">
                    {item.name}
                  </h3>
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ml-2 ${
                      item.category === "Veg"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="text-2xl font-bold text-orange-600 mb-3">
                  ₹{item.price}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => editItem(item)}
                  className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 active:scale-95 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteItem(item.id)}
                  className="flex-1 px-4 py-2.5 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 active:scale-95 text-white font-semibold rounded-lg transition-all duration-200 shadow-sm hover:shadow-md text-sm"
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
